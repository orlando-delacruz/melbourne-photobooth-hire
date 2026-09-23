// CMS repository: frontend-only phase (DEC-018).
//
// Pages + settings + module collections are stored per section so editors save
// only what they touch. Uploads persist in the local image store (IndexedDB)
// and are garbage-collected against the previous saved section value. Saves
// persist per browser: nothing reaches the public site until the backend is
// connected.

import type { CmsContent, CmsPageKey, StoreSectionKey } from "./types";
import { cmsSeed } from "./seed";
import { gcImages } from "./images";

const STORAGE_KEY = "mph-cms-v2";

export interface SectionMeta {
  savedAt: string | null;
}

export interface CmsRepository {
  load(): Promise<CmsContent>;
  loadSection(key: StoreSectionKey): Promise<unknown>;
  saveSection(key: StoreSectionKey, value: unknown): Promise<{ savedAt: string }>;
  resetSection(key: StoreSectionKey): Promise<unknown>;
  resetAll(): Promise<CmsContent>;
  getMeta(): Promise<Record<StoreSectionKey, SectionMeta>>;
}

// Section-key mapping: pages and modules each save one slice.
export type SectionValue<K extends StoreSectionKey> = K extends StoreSectionKey
  ? K extends keyof CmsContent["pages"]
    ? CmsContent["pages"][K]
    : K extends "settings"
      ? CmsContent["settings"]
      : K extends "mod-services"
        ? CmsContent["modules"]["services"]
        : K extends "mod-packages"
          ? CmsContent["modules"]["packages"]
          : K extends "mod-gallery"
            ? CmsContent["modules"]["gallery"]
            : K extends "mod-faqs"
              ? CmsContent["modules"]["faqs"]
              : never
  : never;

export const STORE_SECTIONS: StoreSectionKey[] = [
  "home",
  "services",
  "packages",
  "gallery",
  "about",
  "faq",
  "contact",
  "settings",
  "mod-services",
  "mod-packages",
  "mod-gallery",
  "mod-faqs",
];

/** Public content sections shown in the dashboard's Website Content table. */
export const PAGE_SECTIONS: CmsPageKey[] = [
  "home",
  "services",
  "packages",
  "gallery",
  "about",
  "faq",
  "contact",
];

function clone<T>(value: T): T {
  if (typeof structuredClone === "function") return structuredClone(value);
  return JSON.parse(JSON.stringify(value)) as T;
}

function readStored(): { sections: Record<string, unknown>; meta: Record<string, SectionMeta> } {
  if (typeof window === "undefined" || typeof window.localStorage === "undefined") {
    return { sections: {}, meta: {} };
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { sections: {}, meta: {} };
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return { sections: {}, meta: {} };
    return {
      sections: parsed.sections && typeof parsed.sections === "object" ? parsed.sections : {},
      meta: parsed.meta && typeof parsed.meta === "object" ? parsed.meta : {},
    };
  } catch {
    return { sections: {}, meta: {} };
  }
}

function writeStored(state: {
  sections: Record<string, unknown>;
  meta: Record<string, SectionMeta>;
}): void {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function seedFor(key: StoreSectionKey): unknown {
  if (key === "settings") return cmsSeed.settings;
  if (key.startsWith("mod-")) {
    const moduleKey = key.slice(4) as keyof CmsContent["modules"];
    return cmsSeed.modules[moduleKey];
  }
  return cmsSeed.pages[key as keyof CmsContent["pages"]];
}

class MockCmsRepository implements CmsRepository {
  async load(): Promise<CmsContent> {
    return {
      pages: {
        home: (await this.loadSection("home")) as CmsContent["pages"]["home"],
        services: (await this.loadSection("services")) as CmsContent["pages"]["services"],
        packages: (await this.loadSection("packages")) as CmsContent["pages"]["packages"],
        gallery: (await this.loadSection("gallery")) as CmsContent["pages"]["gallery"],
        about: (await this.loadSection("about")) as CmsContent["pages"]["about"],
        faq: (await this.loadSection("faq")) as CmsContent["pages"]["faq"],
        contact: (await this.loadSection("contact")) as CmsContent["pages"]["contact"],
      },
      settings: (await this.loadSection("settings")) as CmsContent["settings"],
      modules: {
        services: (await this.loadSection("mod-services")) as CmsContent["modules"]["services"],
        packages: (await this.loadSection("mod-packages")) as CmsContent["modules"]["packages"],
        gallery: (await this.loadSection("mod-gallery")) as CmsContent["modules"]["gallery"],
        faqs: (await this.loadSection("mod-faqs")) as CmsContent["modules"]["faqs"],
      },
    };
  }

  async loadSection(key: StoreSectionKey): Promise<unknown> {
    const stored = readStored();
    const override = stored.sections[key];
    return clone((override ?? seedFor(key)) as unknown);
  }

  async saveSection(key: StoreSectionKey, value: unknown): Promise<{ savedAt: string }> {
    const stored = readStored();
    const previous = stored.sections[key];
    const savedAt = new Date().toISOString();
    try {
      await gcImages(previous, value);
    } catch {
      // Garbage collection is best-effort; the save proceeds.
    }
    stored.sections[key] = clone(value);
    stored.meta[key] = { savedAt };
    writeStored(stored);
    return { savedAt };
  }

  async resetSection(key: StoreSectionKey): Promise<unknown> {
    const stored = readStored();
    const previous = stored.sections[key];
    try {
      await gcImages(previous, seedFor(key));
    } catch {
      // Keep the reset working even if cleanup fails.
    }
    delete stored.sections[key];
    delete stored.meta[key];
    writeStored(stored);
    return clone(seedFor(key));
  }

  async resetAll(): Promise<CmsContent> {
    if (typeof window !== "undefined" && typeof window.localStorage !== "undefined") {
      window.localStorage.removeItem(STORAGE_KEY);
    }
    return this.load();
  }

  async getMeta(): Promise<Record<StoreSectionKey, SectionMeta>> {
    const stored = readStored();
    const meta = {} as Record<StoreSectionKey, SectionMeta>;
    for (const key of STORE_SECTIONS) {
      meta[key] = stored.meta[key] ?? { savedAt: null };
    }
    return meta;
  }
}

/** The mock data source for the frontend-only CMS. Accepts the repository so tests can substitute a stub. */
export const cmsRepository: CmsRepository = new MockCmsRepository();

/** Short stable id for CMS-added list items. Existing ids are preserved. */
export function createId(prefix: string): string {
  const suffix =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID().slice(0, 8)
      : String(Math.floor(Math.random() * 1e8));
  return `${prefix}-${suffix}`;
}

/** URL-safe id derived from a label, used for newly added list items. */
export function slugId(label: string, fallback: string): string {
  const slug = label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
  return slug ? `${fallback}-${slug}` : createId(fallback);
}
