// CMS repository: frontend-only phase.
//
// The CmsRepository interface mirrors a future backend API (load, save one
// section, reset) so the mock below can be replaced by a Supabase-backed
// adapter without touching any editor. Saves persist to localStorage in this
// browser only; nothing reaches the public site until the backend exists.

import type { CmsContent, CmsSectionKey } from "./types";
import { cmsSeed } from "./seed";

const STORAGE_KEY = "mph-cms-v1";

export interface SectionMeta {
  savedAt: string | null;
}

export interface CmsRepository {
  load(): Promise<CmsContent>;
  loadSection<K extends CmsSectionKey>(key: K): Promise<CmsContent[K]>;
  saveSection<K extends CmsSectionKey>(key: K, value: CmsContent[K]): Promise<{ savedAt: string }>;
  resetSection<K extends CmsSectionKey>(key: K): Promise<CmsContent[K]>;
  resetAll(): Promise<CmsContent>;
  getMeta(): Promise<Record<CmsSectionKey, SectionMeta>>;
}

interface StoredState {
  sections: Partial<CmsContent>;
  meta: Partial<Record<CmsSectionKey, SectionMeta>>;
}

const SECTION_KEYS: CmsSectionKey[] = [
  "home",
  "services",
  "packages",
  "gallery",
  "about",
  "faq",
  "contact",
  "settings",
];

function clone<T>(value: T): T {
  if (typeof structuredClone === "function") return structuredClone(value);
  return JSON.parse(JSON.stringify(value)) as T;
}

function readStored(): StoredState {
  if (typeof window === "undefined" || typeof window.localStorage === "undefined") {
    return { sections: {}, meta: {} };
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { sections: {}, meta: {} };
    const parsed = JSON.parse(raw) as StoredState;
    if (!parsed || typeof parsed !== "object") return { sections: {}, meta: {} };
    return {
      sections: parsed.sections && typeof parsed.sections === "object" ? parsed.sections : {},
      meta: parsed.meta && typeof parsed.meta === "object" ? parsed.meta : {},
    };
  } catch {
    return { sections: {}, meta: {} };
  }
}

function writeStored(state: StoredState): void {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function mergeSection<K extends CmsSectionKey>(key: K, stored: StoredState): CmsContent[K] {
  const override = stored.sections[key];
  return clone((override ?? cmsSeed[key]) as CmsContent[K]);
}

class MockCmsRepository implements CmsRepository {
  async load(): Promise<CmsContent> {
    const stored = readStored();
    return {
      home: mergeSection("home", stored),
      services: mergeSection("services", stored),
      packages: mergeSection("packages", stored),
      gallery: mergeSection("gallery", stored),
      about: mergeSection("about", stored),
      faq: mergeSection("faq", stored),
      contact: mergeSection("contact", stored),
      settings: mergeSection("settings", stored),
    };
  }

  async loadSection<K extends CmsSectionKey>(key: K): Promise<CmsContent[K]> {
    return mergeSection(key, readStored());
  }

  async saveSection<K extends CmsSectionKey>(
    key: K,
    value: CmsContent[K],
  ): Promise<{ savedAt: string }> {
    const stored = readStored();
    const savedAt = new Date().toISOString();
    stored.sections[key] = clone(value);
    stored.meta[key] = { savedAt };
    writeStored(stored);
    return { savedAt };
  }

  async resetSection<K extends CmsSectionKey>(key: K): Promise<CmsContent[K]> {
    const stored = readStored();
    delete stored.sections[key];
    delete stored.meta[key];
    writeStored(stored);
    return clone(cmsSeed[key]);
  }

  async resetAll(): Promise<CmsContent> {
    if (typeof window !== "undefined" && typeof window.localStorage !== "undefined") {
      window.localStorage.removeItem(STORAGE_KEY);
    }
    return clone(cmsSeed);
  }

  async getMeta(): Promise<Record<CmsSectionKey, SectionMeta>> {
    const stored = readStored();
    return {
      home: stored.meta.home ?? { savedAt: null },
      services: stored.meta.services ?? { savedAt: null },
      packages: stored.meta.packages ?? { savedAt: null },
      gallery: stored.meta.gallery ?? { savedAt: null },
      about: stored.meta.about ?? { savedAt: null },
      faq: stored.meta.faq ?? { savedAt: null },
      contact: stored.meta.contact ?? { savedAt: null },
      settings: stored.meta.settings ?? { savedAt: null },
    };
  }
}

/** The mock data source for the frontend-only CMS. Accepts the repository so tests can substitute a stub. */
export const cmsRepository: CmsRepository = new MockCmsRepository();

export { SECTION_KEYS };

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
