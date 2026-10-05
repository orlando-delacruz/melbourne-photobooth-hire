// Phase 1B.6 backfill: generate responsive variants for existing CMS images.
//
// Supabase's free plan has no on-the-fly transforms, so responsive delivery
// uses pre-generated variants stored next to the original:
//   img-abc.jpg  ->  img-abc-320.webp, img-abc-640.webp, img-abc-1024.webp ...
// This one-off creates the missing variants for every base image already in
// the bucket and records the variant list (original included as the largest
// entry) on every page_contents image object (hero, headers, CTA, logo).
// Module images (services, gallery) need no database change: their variant
// names are derived deterministically from the storage path at render time.
//
// Dry run (default):
//   node --env-file=.env scripts/generate-image-variants.mjs
// Apply:
//   node --env-file=.env scripts/generate-image-variants.mjs --apply
//
// Idempotent: existing variant files are skipped and re-runs report 0 changes.
// Non-destructive: never deletes or replaces originals. Secrets come from the
// environment and are never printed.

import { createClient } from "@supabase/supabase-js";
import sharp from "sharp";

const BUCKET = "cms-media";
const WIDTHS = [320, 640, 1024];
const MAX_EDGE = 1600;
const QUALITY = 80;
const CACHE_CONTROL = "31536000";
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
const publicUrl = (key) => `${url}/storage/v1/object/public/${BUCKET}/${key}`;

async function listAll(prefix = "") {
  const paths = [];
  let offset = 0;
  for (;;) {
    const { data, error } = await supabase.storage
      .from(BUCKET)
      .list(prefix, { limit: 100, offset });
    if (error) throw new Error(`list failed: ${error.message}`);
    if (!data || data.length === 0) break;
    for (const entry of data) {
      const path = prefix ? `${prefix}/${entry.name}` : entry.name;
      if (entry.id === null) paths.push(...(await listAll(path)));
      else paths.push(path);
    }
    if (data.length < 100) break;
    offset += data.length;
  }
  return paths;
}

const isVariant = (name) => /-\d+\.webp$/.test(name);
const isBaseImage = (name) => !isVariant(name) && /\.(jpe?g|png|webp)$/i.test(name);

const objects = await listAll();
const existing = new Set(objects);
const baseKeys = objects.filter(isBaseImage);
console.log(
  `${APPLY ? "APPLY" : "DRY RUN"} — ${baseKeys.length} base image(s), ${objects.length} object(s)\n`,
);

/** key -> [{ width, key, src }] including the original as the largest entry. */
const variantMap = new Map();
/** key -> stored intrinsic width, used to tag module image_src URLs. */
const widthMap = new Map();
let created = 0;

for (const key of baseKeys) {
  const { data: blob, error } = await supabase.storage.from(BUCKET).download(key);
  if (error || !blob) {
    console.warn(`  ! ${key}: download failed (${error?.message ?? "no data"})`);
    continue;
  }
  const buffer = Buffer.from(await blob.arrayBuffer());
  let meta;
  try {
    meta = await sharp(buffer).metadata();
  } catch (metadataError) {
    console.warn(`  ! ${key}: metadata failed (${metadataError.message})`);
    continue;
  }
  if (!meta.width || !meta.height) continue;

  const originalWidth = Math.min(meta.width, MAX_EDGE);
  widthMap.set(key, originalWidth);
  const variants = [{ width: originalWidth, key, src: publicUrl(key) }];
  for (const width of WIDTHS) {
    if (width >= originalWidth) continue;
    const variantKey = `${key.replace(/\.[^.]+$/, "")}-${width}.webp`;
    if (!existing.has(variantKey)) {
      created += 1;
      console.log(`  + ${variantKey}`);
      if (APPLY) {
        const output = await sharp(buffer)
          .rotate()
          .resize({ width, withoutEnlargement: true })
          .webp({ quality: QUALITY })
          .toBuffer();
        const { error: uploadError } = await supabase.storage
          .from(BUCKET)
          .upload(variantKey, output, {
            contentType: "image/webp",
            cacheControl: CACHE_CONTROL,
            upsert: false,
          });
        if (uploadError) {
          console.warn(`    ! upload failed: ${uploadError.message}`);
          continue;
        }
      }
      existing.add(variantKey);
    }
    variants.push({ width, key: variantKey, src: publicUrl(variantKey) });
  }
  variants.sort((a, b) => a.width - b.width);
  variantMap.set(key, variants);
}

console.log(`\n${APPLY ? "Created" : "Would create"} ${created} variant file(s).`);

// ── Module rows: tag image_src with the stored width ────────────────────────
//
// Module tables have no variants column, so the intrinsic width travels on the
// URL fragment (`...#w=1200`). The fragment is never sent to the server; it
// only lets the renderer derive the exact variant set. Data-only update.

async function tagModuleRows(table) {
  const { data: rows, error } = await supabase
    .from(table)
    .select("id, image_key, image_src")
    .not("image_key", "is", null);
  if (error) throw new Error(`${table}: ${error.message}`);
  let changed = 0;
  for (const row of rows ?? []) {
    const width = widthMap.get(row.image_key);
    if (!width) continue;
    const clean = String(row.image_src ?? "").split(/[?#]/)[0];
    const next = `${clean}#w=${width}`;
    if (row.image_src === next) continue;
    changed += 1;
    if (APPLY) {
      const { error: updateError } = await supabase
        .from(table)
        .update({ image_src: next })
        .eq("id", row.id);
      if (updateError) throw new Error(`${table} ${row.id}: ${updateError.message}`);
    }
  }
  console.log(`${APPLY ? "Tagged" : "Would tag"} ${changed} ${table} row(s).`);
}

await tagModuleRows("services");
await tagModuleRows("gallery_items");

// ── page_contents blobs ─────────────────────────────────────────────────────

function attachVariants(value) {
  let changed = false;
  if (Array.isArray(value)) {
    for (const item of value) if (attachVariants(item)) changed = true;
    return changed;
  }
  if (!value || typeof value !== "object") return false;
  const record = value;
  if (
    typeof record.key === "string" &&
    typeof record.src === "string" &&
    typeof record.alt === "string"
  ) {
    const variants = variantMap.get(record.key);
    if (variants && JSON.stringify(record.variants ?? []) !== JSON.stringify(variants)) {
      record.variants = variants;
      return true;
    }
    return false;
  }
  for (const child of Object.values(record)) if (attachVariants(child)) changed = true;
  return changed;
}

const { data: pageRows, error: pageError } = await supabase
  .from("page_contents")
  .select("page_key, content");
if (pageError) throw new Error(pageError.message);

let pageChanged = 0;
for (const row of pageRows ?? []) {
  const content = JSON.parse(JSON.stringify(row.content ?? {}));
  if (!attachVariants(content)) continue;
  pageChanged += 1;
  if (APPLY) {
    const { error: updateError } = await supabase
      .from("page_contents")
      .update({ content })
      .eq("page_key", row.page_key);
    if (updateError) throw new Error(`page_contents ${row.page_key}: ${updateError.message}`);
  }
}
console.log(`${APPLY ? "Updated" : "Would update"} ${pageChanged} page_contents row(s).`);

if (!APPLY) console.log("\nRe-run with --apply to write the changes.");
