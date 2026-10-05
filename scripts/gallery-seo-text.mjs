// Gallery SEO text: per-image alt text and captions.
//
// The CMS gallery rows uploaded by the client carried the generic alt
// "Melbourne Photobooth Hire" and an empty caption. This one-off writes
// image-specific, descriptive alt text and a short caption for every gallery
// row, including the seeded Pexels placeholders (content only; no images are
// added, replaced or deleted).
//
// Dry run (default):
//   node --env-file=.env scripts/gallery-seo-text.mjs
// Apply:
//   node --env-file=.env scripts/gallery-seo-text.mjs --apply
//
// Idempotent: rows already matching the target text are skipped. Secrets come
// from the environment and are never printed.

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

/** Image-specific alt text and caption per gallery slug. */
const TEXT = {
  "gallery-2660b3ae": {
    alt: "Open-air photobooth with studio light and red carpet",
    caption: "Open-air booth setup",
  },
  "gallery-1": {
    alt: "Bride and groom toasting with wedding guests",
    caption: "Wedding reception",
  },
  "gallery-2": {
    alt: "Guest inside a curtained photo booth",
    caption: "Inside the booth",
  },
  "gallery-650364bc": {
    alt: "360 video booth on a red carpet with gold stanchions",
    caption: "360 Video Booth",
  },
  "gallery-c4fdcea9": {
    alt: "Vintage wooden camera booth on a tripod",
    caption: "Booth detail",
  },
  "gallery-3": {
    alt: "Friends in party hats with birthday confetti",
    caption: "Birthday party",
  },
  "gallery-aea34a2b": {
    alt: "LED photobooth with touchscreen in a function room",
    caption: "LED booth setup",
  },
  "gallery-4": {
    alt: "Friends laughing in front of a gold backdrop",
    caption: "Gold backdrop",
  },
  "gallery-4b8db681": {
    alt: "Wooden photobooth on a tripod on a garden lawn",
    caption: "Outdoor booth",
  },
  "gallery-5": {
    alt: "Bride dancing on stage at a wedding reception",
    caption: "Wedding dance floor",
  },
  "gallery-6": {
    alt: "Four friends laughing on an outdoor terrace",
    caption: "Guests having fun",
  },
  "gallery-fc856af2": {
    alt: "Students queuing at a photobooth at a school formal",
    caption: "School formal",
  },
  "gallery-fdf1fcd0": {
    alt: "Photobooth with geometric backdrop and red carpet",
    caption: "Geometric backdrop",
  },
  "gallery-7": {
    alt: "Wedding guests dancing under string lights at night",
    caption: "Outdoor wedding",
  },
  "gallery-8f095fae": {
    alt: "Guests using a photobooth with animated filters",
    caption: "Animated filters",
  },
  "gallery-8": {
    alt: "Outdoor wedding tables styled under string lights",
    caption: "Courtyard reception",
  },
  "gallery-81dbcecb": {
    alt: "Photobooth and props table in a garden",
    caption: "Garden booth",
  },
  "gallery-8a057d26": {
    alt: "LED photobooth with printer station and checkered backdrop",
    caption: "Booth and printer",
  },
  "gallery-3390d719": {
    alt: "Guest using the touchscreen on a wooden photobooth",
    caption: "Touchscreen booth",
  },
  "gallery-74d19ecb": {
    alt: "Couple posing at a photobooth by a gold wall",
    caption: "Couple's photo",
  },
  "gallery-40ffc69b": {
    alt: "Photobooth screen showing a print template",
    caption: "Print preview",
  },
};

const { data: rows, error } = await supabase
  .from("gallery_items")
  .select("id, slug, image_alt, caption")
  .order("sort_order");
if (error) throw new Error(error.message);

const updates = [];
for (const row of rows ?? []) {
  const target = TEXT[row.slug];
  if (!target) {
    console.warn(`  ! no text for slug ${row.slug} (left unchanged)`);
    continue;
  }
  const patch = {};
  if (row.image_alt !== target.alt) patch.image_alt = target.alt;
  if (row.caption !== target.caption) patch.caption = target.caption;
  if (Object.keys(patch).length === 0) continue;
  updates.push({
    id: row.id,
    slug: row.slug,
    patch,
    from: { alt: row.image_alt, caption: row.caption },
  });
}

console.log(APPLY ? "\nAPPLY mode\n" : "\nDRY RUN (pass --apply to write)\n");
for (const update of updates) {
  console.log(`  ~ ${update.slug}`);
  if (update.patch.image_alt)
    console.log(
      `      alt:     ${JSON.stringify(update.from.alt)} -> ${JSON.stringify(update.patch.image_alt)}`,
    );
  if (update.patch.caption)
    console.log(
      `      caption: ${JSON.stringify(update.from.caption)} -> ${JSON.stringify(update.patch.caption)}`,
    );
}
console.log(`\nPlanned: ${updates.length} of ${rows?.length ?? 0} row(s).`);

if (!APPLY) {
  console.log("\nRe-run with --apply to write the changes.");
  process.exit(0);
}

for (const update of updates) {
  const { error: updateError } = await supabase
    .from("gallery_items")
    .update(update.patch)
    .eq("id", update.id);
  if (updateError) throw new Error(`gallery_items ${update.slug}: ${updateError.message}`);
}
console.log(`\nApplied ${updates.length} change(s).`);
