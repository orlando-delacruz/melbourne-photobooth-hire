// Phase 0 SEO remediation: CMS content corrections.
//
// The public site reads saved CMS rows before the TypeScript seed fallback, so
// the confirmed Phase 0 fixes (test content, pricing, trust claims, contact
// details, OG images) must be applied to the live rows as well as the seed.
// Mirrors supabase/migration-phase0-seo-fixes.sql.
//
// Dry run (default):
//   node --env-file=.env scripts/phase0-cms-fixes.mjs
// Apply:
//   node --env-file=.env scripts/phase0-cms-fixes.mjs --apply
//
// Idempotent: every patch matches an exact old value or pattern, so a second
// run reports "no changes". Non-destructive: updates individual fields; never
// deletes rows. Secrets come from the environment and are never printed.

import { createClient } from "@supabase/supabase-js";

const APPLY = process.argv.includes("--apply");
const url = process.env.PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !serviceKey) {
  console.error(
    "Missing PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY. Run with `node --env-file=.env ...`.",
  );
  process.exit(1);
}

const supabase = createClient(url, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const NEW_PRICE = "Packages start from $350";
const PRICE_RE = /Price\s+[Ss]tarts\s+\$1(?:30|50)\b/g;
const APPROVED_EMAIL = "melbournephotoboothhire.au@gmail.com";
const SERVICES_H1 = "Photobooth hire services in Melbourne";

let changeCount = 0;

function report(label, from, to) {
  changeCount += 1;
  console.log(`  ~ ${label}`);
  console.log(`      from: ${JSON.stringify(from)}`);
  console.log(`      to:   ${JSON.stringify(to)}`);
}

function setPath(obj, path, next, label) {
  let cursor = obj;
  for (let i = 0; i < path.length - 1; i += 1) {
    const key = path[i];
    if (!cursor[key] || typeof cursor[key] !== "object") return;
    cursor = cursor[key];
  }
  const leaf = path[path.length - 1];
  if (cursor[leaf] === next) return;
  report(label, cursor[leaf], next);
  cursor[leaf] = next;
}

function replaceInString(obj, path, pattern, replacement, label) {
  let cursor = obj;
  for (let i = 0; i < path.length - 1; i += 1) {
    const key = path[i];
    if (!cursor[key] || typeof cursor[key] !== "object") return;
    cursor = cursor[key];
  }
  const leaf = path[path.length - 1];
  const current = cursor[leaf];
  if (typeof current !== "string") return;
  const next = current.replace(pattern, replacement);
  if (next === current) return;
  report(label, current, next);
  cursor[leaf] = next;
}

// ── Load ────────────────────────────────────────────────────────────────────

const { data: pageRows, error: pageErr } = await supabase
  .from("page_contents")
  .select("page_key, content");
if (pageErr) throw new Error(pageErr.message);
const pages = Object.fromEntries((pageRows ?? []).map((row) => [row.page_key, row.content ?? {}]));

const { data: seoRows, error: seoErr } = await supabase.from("page_seo").select("*");
if (seoErr) throw new Error(seoErr.message);

const { data: serviceRows } = await supabase.from("services").select("*").order("sort_order");
const { data: packageRows } = await supabase.from("packages").select("*").order("sort_order");
const { data: faqRows } = await supabase.from("faqs").select("*").order("sort_order");
const { data: galleryRows } = await supabase.from("gallery_items").select("*").order("sort_order");

const serviceImage = (slug) => {
  const row = (serviceRows ?? []).find((s) => s.slug === slug);
  return row ? { src: row.image_src, alt: row.image_alt || row.name } : null;
};

// ── page_contents: home ─────────────────────────────────────────────────────

const home = structuredClone(pages.home ?? {});
if (home.packagesHeading?.lede) {
  replaceInString(
    home,
    ["packagesHeading", "lede"],
    PRICE_RE,
    NEW_PRICE,
    "home.packagesHeading.lede price line",
  );
}
if (Array.isArray(home.hero?.stats)) {
  home.hero.stats = home.hero.stats.map((stat, index) => {
    if (stat && stat.value === "Public" && /ensured/i.test(stat.label ?? "")) {
      report(`home.hero.stats[${index}] insurance label`, stat.label, "insured");
      return { ...stat, label: "insured" };
    }
    if (stat && (stat.icon === "star" || /star/i.test(stat.label ?? ""))) {
      const next = {
        value: "3",
        label: "booth experiences",
        icon: "camera",
        source: "services",
      };
      report(`home.hero.stats[${index}] unverified rating claim`, stat, next);
      return next;
    }
    return stat;
  });
}

// ── page_contents: services / packages ──────────────────────────────────────

const servicesPage = structuredClone(pages.services ?? {});
if (servicesPage.header?.title && /testing/i.test(servicesPage.header.title)) {
  setPath(servicesPage, ["header", "title"], SERVICES_H1, "services.header.title test copy");
}
if (servicesPage.header?.lede && /testing/i.test(servicesPage.header.lede)) {
  setPath(
    servicesPage,
    ["header", "lede"],
    "Three ways to put a photo studio in the middle of your event, each styled, staffed and built to keep the line moving.",
    "services.header.lede test copy",
  );
}

const packagesPage = structuredClone(pages.packages ?? {});
if (packagesPage.plansHeading?.lede) {
  replaceInString(
    packagesPage,
    ["plansHeading", "lede"],
    PRICE_RE,
    NEW_PRICE,
    "packages.plansHeading.lede price line",
  );
}

// ── page_contents: settings ─────────────────────────────────────────────────

const settings = structuredClone(pages.settings ?? {});
if (!settings.contactEmail) {
  setPath(settings, ["contactEmail"], APPROVED_EMAIL, "settings.contactEmail missing");
}
const normalizePhone = (value) => (value ?? "").replace(/[\s()]/g, "");
if (normalizePhone(settings.phonePrimary) === "+61459918987") {
  setPath(settings, ["phonePrimary"], "+61 459 918 987", "settings.phonePrimary formatting");
}
if (normalizePhone(settings.phoneSecondary) === "+61402332908") {
  setPath(settings, ["phoneSecondary"], "+61 402 332 908", "settings.phoneSecondary formatting");
}
if (
  settings.reviewUrl &&
  /review|google/i.test(settings.reviewUrl) &&
  !settings.reviewUrl.startsWith("http")
) {
  setPath(settings, ["reviewUrl"], "", "settings.reviewUrl invalid value");
}

// ── page_contents writes ────────────────────────────────────────────────────

const pageUpdates = [
  ["home", home],
  ["services", servicesPage],
  ["packages", packagesPage],
  ["settings", settings],
].filter(([key, next]) => JSON.stringify(next) !== JSON.stringify(pages[key] ?? {}));

// ── faqs module ─────────────────────────────────────────────────────────────

const faqUpdates = [];
for (const row of faqRows ?? []) {
  if (typeof row.answer !== "string") continue;
  const next = row.answer.replace(PRICE_RE, NEW_PRICE);
  if (next === row.answer) continue;
  report(`faq ${row.id} answer price line`, row.answer, next);
  faqUpdates.push({ id: row.id, answer: next });
}

// ── packages module ─────────────────────────────────────────────────────────

const packageUpdates = [];
for (const row of packageRows ?? []) {
  const patch = {};
  if (/four hours/i.test(row.name ?? "") && !/\d/.test(row.duration_label ?? "")) {
    report(`package ${row.id} duration label`, row.duration_label, "4 hours");
    patch.duration_label = "4 hours";
  }
  if (Array.isArray(row.inclusions)) {
    const seen = new Set();
    const deduped = [];
    for (const item of row.inclusions) {
      const normalized = item
        .replace(/Personalized/g, "Personalised")
        .replace(/Full Liability Insured/gi, "Public Liability Insured");
      if (seen.has(normalized)) {
        report(`package ${row.id} duplicate inclusion`, item, "(removed duplicate)");
        continue;
      }
      seen.add(normalized);
      if (normalized !== item) report(`package ${row.id} inclusion wording`, item, normalized);
      deduped.push(normalized);
    }
    if (JSON.stringify(deduped) !== JSON.stringify(row.inclusions)) {
      patch.inclusions = deduped;
    }
  }
  if (Object.keys(patch).length > 0) packageUpdates.push({ id: row.id, ...patch });
}

// ── gallery module: retire placeholder stock imagery ────────────────────────
//
// The gallery page intentionally renders every public row, so the nine seeded
// Pexels placeholders can only be retired from the homepage showcase / about
// story by clearing their highlight flag (reversible in the admin). Repointing
// them at client photos would duplicate images; deleting rows is out of scope.

const galleryUpdates = [];
for (const row of galleryRows ?? []) {
  if (!String(row.image_src ?? "").includes("images.pexels.com")) continue;
  if (row.highlight === false) continue;
  report(`gallery ${row.slug ?? row.id} placeholder image`, row.image_src, "(highlight cleared)");
  galleryUpdates.push({ id: row.id, highlight: false });
}

// ── page_seo OG images + canonical host ─────────────────────────────────────

const OG_BY_PAGE = {
  services: serviceImage("premium-photobooth"),
  packages: serviceImage("premium-photobooth"),
  gallery: serviceImage("360-video-booth"),
  about: serviceImage("roaming-photobooth"),
  faq: serviceImage("360-video-booth"),
  contact: serviceImage("roaming-photobooth"),
  privacy: serviceImage("premium-photobooth"),
  terms: serviceImage("premium-photobooth"),
};

const seoUpdates = [];
for (const row of seoRows ?? []) {
  const patch = {};
  const og = OG_BY_PAGE[row.page_key];
  const isPlaceholder = !row.og_image_src || row.og_image_src.includes("images.pexels.com");
  if (og?.src && isPlaceholder) {
    report(`page_seo ${row.page_key} og:image`, row.og_image_src || "(empty)", og.src);
    patch.og_image_src = og.src;
    patch.og_image_alt = og.alt;
  }
  if (
    row.canonical_url &&
    row.canonical_url.includes("melbournephotoboothhire.com.au") &&
    !row.canonical_url.includes("www.")
  ) {
    const next = row.canonical_url.replace(
      "https://melbournephotoboothhire.com.au",
      "https://www.melbournephotoboothhire.com.au",
    );
    report(`page_seo ${row.page_key} canonical host`, row.canonical_url, next);
    patch.canonical_url = next;
  }
  if (Object.keys(patch).length > 0) seoUpdates.push({ page_key: row.page_key, ...patch });
}

// ── Apply / report ──────────────────────────────────────────────────────────

console.log(APPLY ? "\nAPPLY mode\n" : "\nDRY RUN (pass --apply to write)\n");
console.log(
  `Planned: ${pageUpdates.length} page_contents row(s), ${faqUpdates.length} FAQ row(s), ` +
    `${packageUpdates.length} package row(s), ${galleryUpdates.length} gallery row(s), ` +
    `${seoUpdates.length} page_seo row(s).`,
);

if (!APPLY) {
  console.log("\nRe-run with --apply to write the changes.");
  process.exit(0);
}

for (const [key, content] of pageUpdates) {
  const { error } = await supabase.from("page_contents").update({ content }).eq("page_key", key);
  if (error) throw new Error(`page_contents ${key}: ${error.message}`);
}
for (const row of faqUpdates) {
  const { error } = await supabase.from("faqs").update({ answer: row.answer }).eq("id", row.id);
  if (error) throw new Error(`faqs ${row.id}: ${error.message}`);
}
for (const row of packageUpdates) {
  const { id, ...patch } = row;
  const { error } = await supabase.from("packages").update(patch).eq("id", id);
  if (error) throw new Error(`packages ${id}: ${error.message}`);
}
for (const row of galleryUpdates) {
  const { error } = await supabase
    .from("gallery_items")
    .update({ highlight: false })
    .eq("id", row.id);
  if (error) throw new Error(`gallery_items ${row.id}: ${error.message}`);
}
for (const row of seoUpdates) {
  const { page_key, ...patch } = row;
  const { error } = await supabase.from("page_seo").update(patch).eq("page_key", page_key);
  if (error) throw new Error(`page_seo ${page_key}: ${error.message}`);
}

console.log(`\nApplied ${changeCount} change(s).`);
