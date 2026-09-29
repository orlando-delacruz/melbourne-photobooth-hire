// Derived homepage hero stat values (DEC-037).
//
// The hero stat row stores a manually typed value by default. A stat may
// instead set a `source` and have its value computed from live module data:
//   "services"      -> number of publicly available services
//   "longest-hire"  -> longest package hire window, from the duration labels
// Pure functions kept apart from the island so the mapping is easy to reason
// about and verify.

import type { HeroStat, PackageItem, ServiceItem } from "../cms/types";

/** Number of publicly available services (hero stats with source "services"). */
export function countPublicServices(services: ServiceItem[]): string {
  return String(services.filter((service) => service.highlight !== false).length);
}

/** Longest hire window parsed from the package duration labels ("4 hours" → 4). */
export function longestHireHours(packages: PackageItem[]): number | null {
  let longest: number | null = null;
  for (const pkg of packages) {
    const match = pkg.durationLabel.match(/\d+/);
    if (!match) continue;
    const hours = Number(match[0]);
    if (!Number.isFinite(hours)) continue;
    longest = longest === null ? hours : Math.max(longest, hours);
  }
  return longest;
}

/** Resolve a stat's displayed value: derived when a source is set, else typed. */
export function heroStatValue(
  stat: HeroStat,
  services: ServiceItem[],
  packages: PackageItem[],
): string {
  if (stat.source === "services") return countPublicServices(services);
  if (stat.source === "longest-hire") {
    const hours = longestHireHours(packages);
    if (hours !== null) return hours === 1 ? "1 hr" : `${hours} hrs`;
  }
  return stat.value;
}
