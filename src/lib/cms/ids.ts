// Stable id helpers for CMS-added list items. Existing ids are preserved;
// these only mint ids for newly created items (which double as DB slugs).

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
