// Phase 1B image payload pass: re-encode CMS JPEGs tighter.
//
// The Phase 0 media pass encoded JPEGs at mozjpeg quality 78 with a 1600px
// edge. Several gallery/service files are still 150-550 KB and are delivered
// as single-size images (Supabase free tier has no on-the-fly transforms).
// This one-off re-encodes JPEGs at quality 72 and re-uploads to the SAME
// path with the same immutable cache, so every CMS URL keeps working and no
// database row changes. PNG/WebP assets are left untouched.
//
// Dry run (default):
//   node --env-file=.env scripts/compress-cms-media.mjs
// Apply:
//   node --env-file=.env scripts/compress-cms-media.mjs --apply
//
// Idempotent enough for a one-off: re-running after apply reports ~0% gain and
// skips. Secrets come from the environment and are never printed.

import { createClient } from "@supabase/supabase-js";
import sharp from "sharp";

const BUCKET = "cms-media";
const MAX_EDGE = 1600;
const JPEG_QUALITY = 72;
const CACHE_CONTROL = "31536000";
/** Skip tiny files; the churn is not worth it. */
const MIN_BYTES = 40 * 1024;
/** Skip a re-encode that saves less than this fraction (idempotency). */
const MIN_GAIN = 0.08;
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
        paths.push(path);
      }
    }
    if (data.length < 100) break;
    offset += data.length;
  }
  return paths;
}

function kb(bytes) {
  return `${(bytes / 1024).toFixed(0)} KB`;
}

const objects = await listAll();
let processed = 0;
let skipped = 0;
let before = 0;
let after = 0;

console.log(`${APPLY ? "APPLY" : "DRY RUN"} — ${objects.length} object(s)\n`);

for (const path of objects) {
  const ext = path.slice(path.lastIndexOf(".") + 1).toLowerCase();
  if (ext !== "jpg" && ext !== "jpeg") {
    skipped += 1;
    continue;
  }

  const { data: blob, error } = await supabase.storage.from(BUCKET).download(path);
  if (error || !blob) {
    console.warn(`  ! ${path}: download failed (${error?.message ?? "no data"})`);
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

  if (output.length >= input.length * (1 - MIN_GAIN)) {
    skipped += 1;
    continue;
  }

  before += input.length;
  after += output.length;
  processed += 1;
  console.log(`  ~ ${path}: ${kb(input.length)} -> ${kb(output.length)}`);

  if (APPLY) {
    const { error: uploadError } = await supabase.storage.from(BUCKET).upload(path, output, {
      contentType: "image/jpeg",
      cacheControl: CACHE_CONTROL,
      upsert: true,
    });
    if (uploadError) console.warn(`    ! upload failed: ${uploadError.message}`);
  }
}

console.log(
  `\n${APPLY ? "Applied" : "Would apply"} ${processed} object(s); skipped ${skipped}.` +
    `\nTotal ${kb(before)} -> ${kb(after)}` +
    (before > 0 ? ` (saved ${(100 - (after / before) * 100).toFixed(1)}%)` : "") +
    ".",
);
if (!APPLY) console.log("Re-run with --apply to write the changes.");
