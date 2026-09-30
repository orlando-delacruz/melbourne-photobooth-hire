// One-off CMS media backfill (DEC-047).
//
// Pre-DEC-046 uploads were stored as full-resolution JPEGs with a 1-hour cache.
// New uploads are optimized + given an immutable cache by lib/cms/storage.ts,
// but nothing re-processes the existing objects. This script closes that gap:
// it re-encodes every stored JPEG to a delivery-sized mozjpeg JPEG and
// re-uploads it to the SAME path with a one-year immutable cache, so the public
// URLs (and every CMS reference to them) stay valid. No database changes.
// PNGs are left untouched (they are unreferenced/alpha assets, and JPEG would
// destroy their transparency).
//
// Usage (from the repo root, with a local .env holding the service-role key):
//   node --env-file=.env scripts/optimize-cms-media.mjs            # dry run
//   node --env-file=.env scripts/optimize-cms-media.mjs --apply    # write
//
// Secrets are read from the environment only and never printed or committed.

import { createClient } from "@supabase/supabase-js";
import sharp from "sharp";

const BUCKET = "cms-media";
const MAX_EDGE = 1600;
const JPEG_QUALITY = 78;
const CACHE_CONTROL = "31536000";
/** Leave tiny files alone; the churn isn't worth it. */
const MIN_BYTES = 20 * 1024;
/** Skip a re-encode that would save less than this fraction (idempotency). */
const MIN_GAIN = 0.1;
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

/** Recursively list every object path in the bucket. */
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
      if (entry.id === null) {
        paths.push(...(await listAll(path)));
      } else {
        paths.push({ path, metadata: entry.metadata });
      }
    }
    if (data.length < 100) break;
    offset += data.length;
  }
  return paths;
}

function ext(path) {
  const i = path.lastIndexOf(".");
  return i === -1 ? "" : path.slice(i + 1).toLowerCase();
}

function kb(bytes) {
  return `${(bytes / 1024).toFixed(0)} KB`;
}

async function main() {
  console.log(`${APPLY ? "APPLY" : "DRY RUN"} — bucket ${BUCKET}, max edge ${MAX_EDGE}px\n`);
  const objects = await listAll();
  let processed = 0;
  let skipped = 0;
  let before = 0;
  let after = 0;

  for (const { path, metadata } of objects) {
    const type = ext(path);
    // Supabase returns this as e.g. "max-age=31536000".
    const cacheControlValue = String(metadata?.cacheControl ?? "");
    if (type === "webp" || cacheControlValue.includes(CACHE_CONTROL)) {
      skipped += 1;
      continue;
    }
    // JPEG only: re-encoding to JPEG would destroy transparency in PNG logos,
    // and the flagged oversized assets are all JPEGs.
    if (!["jpg", "jpeg"].includes(type)) {
      skipped += 1;
      continue;
    }

    const { data: blob, error: dlError } = await supabase.storage.from(BUCKET).download(path);
    if (dlError || !blob) {
      console.warn(`  ! ${path}: download failed (${dlError?.message ?? "no data"})`);
      continue;
    }
    const input = Buffer.from(await blob.arrayBuffer());
    if (input.length < MIN_BYTES) {
      skipped += 1;
      continue;
    }

    const output = await sharp(input)
      .rotate()
      .resize({ width: MAX_EDGE, height: MAX_EDGE, fit: "inside", withoutEnlargement: true })
      .jpeg({ quality: JPEG_QUALITY, mozjpeg: true, progressive: true })
      .toBuffer();

    if (output.length >= input.length) {
      console.log(`  = ${path}: ${kb(input.length)} — no gain, skipped`);
      skipped += 1;
      continue;
    }
    if (output.length >= input.length * (1 - MIN_GAIN)) {
      console.log(`  = ${path}: ${kb(input.length)} — under ${MIN_GAIN * 100}% gain, skipped`);
      skipped += 1;
      continue;
    }

    before += input.length;
    after += output.length;
    processed += 1;
    console.log(`  → ${path}: ${kb(input.length)} → ${kb(output.length)}`);

    if (APPLY) {
      const { error: upError } = await supabase.storage.from(BUCKET).upload(path, output, {
        contentType: "image/jpeg",
        cacheControl: CACHE_CONTROL,
        upsert: true,
      });
      if (upError) console.warn(`    ! upload failed: ${upError.message}`);
    }
  }

  console.log(
    `\n${APPLY ? "Applied" : "Would apply"} ${processed} object(s); skipped ${skipped}.` +
      `\nTotal ${kb(before)} → ${kb(after)} (saved ${kb(before - after)}).`,
  );
  if (!APPLY) console.log("Re-run with --apply to write the changes.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
