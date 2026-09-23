// Public content adapter: builds the public SiteContent contract from the
// CMS modules (DEC-018). Module collections are the single source of truth:
// the build renders module data, and the CmsEcho island applies any saved
// admin edits (highlights, badges, uploaded images) client-side.

import { cmsSeed } from "../cms/seed";
import { BADGE_LABELS } from "../cms/types";
import type { Faq, GalleryItem, Package, SampleImage, Service, SiteContent } from "./types";
import { mockContent } from "./mock";

function serviceImage(id: string): SampleImage | undefined {
  const item = cmsSeed.modules.services.find((service) => service.id === id);
  if (!item) return undefined;
  return { src: item.image.src, alt: item.image.alt || item.name };
}

export function buildSiteContent(): SiteContent {
  const services: Service[] = cmsSeed.modules.services.map((item) => ({
    id: item.id,
    name: item.name,
    summary: item.summary,
    badge: item.badge || undefined,
    tagline: item.tagline || undefined,
    highlights: item.highlights,
    icon: item.icon,
    highlight: item.highlight,
  }));

  const packages: Package[] = cmsSeed.modules.packages.map((item) => {
    const badge =
      item.badgeType === "custom"
        ? item.customBadge || undefined
        : item.badgeType === "none"
          ? undefined
          : (BADGE_LABELS[item.badgeType as "basic" | "most-popular" | "best-value"] ?? undefined);
    return {
      id: item.id,
      name: item.name,
      summary: item.summary,
      durationLabel: item.durationLabel,
      priceLabel: item.priceLabel,
      inclusions: item.inclusions,
      badge,
      featured: item.badgeType === "most-popular",
      highlight: item.highlight,
    };
  });

  const gallery: GalleryItem[] = cmsSeed.modules.gallery.map((item) => ({
    id: item.id,
    src: item.image.src,
    alt: item.image.alt,
    caption: item.caption || undefined,
    highlight: item.highlight,
  }));

  const faqs: Faq[] = cmsSeed.modules.faqs.map((item) => ({
    id: item.id,
    question: item.question,
    answer: item.answer,
    highlight: item.highlight,
  }));

  const serviceImages: Record<string, SampleImage> = {};
  for (const item of cmsSeed.modules.services) {
    const image = serviceImage(item.id);
    if (image) serviceImages[item.id] = image;
  }

  return {
    ...mockContent,
    services,
    packages,
    gallery,
    faqs,
    serviceImages,
    showcaseImages: gallery
      .filter((item) => item.highlight !== false)
      .map((item) => ({ src: item.src, alt: item.alt, caption: item.caption ?? "" })),
  };
}
