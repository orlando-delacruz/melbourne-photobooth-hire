// Shared package badge derivation for live islands (DEC-033).
// Mirrors lib/content/cmsSource.ts: custom text wins, "none" hides,
// built-in types resolve through BADGE_LABELS.
import { BADGE_LABELS } from "../../lib/cms/types";
import type { BadgeType, PackageItem } from "../../lib/cms/types";

export function packageBadgeText(item: PackageItem): string | undefined {
  if (item.badgeType === "custom") return item.customBadge || undefined;
  if (item.badgeType === "none") return undefined;
  return BADGE_LABELS[item.badgeType as Exclude<BadgeType, "none" | "custom">] ?? undefined;
}
