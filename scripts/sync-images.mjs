// Mirrors src/assets/category-images and src/assets/products into the Supabase Storage
// buckets of the same purpose and points the catalog at them.
// Usage: SUPABASE_SECRET_KEY=sb_secret_... node --env-file=.env.local scripts/sync-images.mjs
//
// - uploads (upsert) every local image to the bucket root, keeping its file name
// - deletes every object in the buckets that has no local counterpart
// - rewrites public.product_images from PRODUCT_IMAGES and categories.thumbnail_path from CATEGORY_IMAGES
// Keep both maps in sync with supabase/seed.sql.
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";

/** category slug → file in src/assets/category-images */
const CATEGORY_IMAGES = {
  "mobile-phones": "mobile.jpg",
  laptops: "laptops.jpg",
  wearables: "smart-watch.jpg",
  cameras: "cameras.jpg",
  gaming: "game.jpg",
  accessories: "accessory.jpg",
};

/** product slug → files in src/assets/products, in display order */
const PRODUCT_IMAGES = {
  "iphone-14-pro-max-256gb": ["iphone-14.jpg", "iphone-14-1.jpg"],
  "samsung-galaxy-s23-ultra-256gb": ["samsung-galaxy.jpg", "samsung-galaxy-1.jpg"],
  "google-pixel-8-pro": ["google-pixel.jpg"],
  "xiaomi-13t-pro": ["xiaomi.jpg", "xiaomi-1.jpg"],
  "oneplus-12": ["oneplus.jpg", "oneplus-1.jpg", "oneplus-2.jpg"],

  "apple-macbook-pro-14-m3": ["apple-macbook-1.jpg", "apple-macbook-2.jpg"],
  "apple-macbook-air-13-m2": ["apple-macbook.jpg"],
  "dell-xps-15": ["del-xps.jpg"],
  "lenovo-thinkpad-x1-carbon": ["lenovo-laptop.jpg"],
  "asus-rog-zephyrus-g14": ["asus-rog.jpg"],

  "apple-watch-series-9": ["apple-watch.jpg", "apple-watch-1.jpg", "apple-watch-2.jpg"],
  "samsung-galaxy-watch-6": ["galaxy-watch.jpg", "galaxy-watch-1.jpg", "galaxy-watch-2.jpg"],
  "garmin-fenix-7": ["garmin-fenix.jpg", "garmin-fenix-1.jpg"],
  "fitbit-charge-6": ["fitbit-charge.jpg", "fitbit-charge-1.jpg"],
  "xiaomi-smart-band-8": ["xiaomi-band.jpg", "xiaomi-band-1.jpg"],

  "sony-alpha-a7-iv": ["sony-alpha.jpg", "sony-alpha-1.jpg", "sony-alpha-2.jpg"],
  "canon-eos-r6-mark-ii": ["canon-eos.jpg", "canon-eos-1.jpg"],
  "fujifilm-x-t5": ["fujifilm.jpg", "fujifilm-1.jpg"],
  "gopro-hero-12-black": ["gopro-hero.jpg", "gopro-hero-1.jpg", "gopro-hero-2.jpg"],
  "dji-osmo-pocket-3": ["dji-osmo.jpg", "dji-osmo-1.jpg"],

  "vr-visiontech-x1": ["apple-visiotech.jpg", "apple-visiotech-1.jpg"],
  "playstation-5-slim": ["playstation.jpg", "playstation-1.jpg", "playstation-3.jpg"],
  "xbox-series-x": ["xbox-x.jpg", "xbox-x-1.jpg"],
  "nintendo-switch-oled": ["nintendo.jpg", "nintendo-1.jpg"],
  "logitech-g-pro-x-superlight": ["logitech-g.jpg"],

  "sony-wh-1000xm5": ["sony-wh.jpg", "sony-wh-1.jpg", "sony-wh-2.jpg"],
  "apple-airpods-pro-2": ["apple-airpods.jpg", "apple-airpods-1.jpg", "apple-airpods-2.jpg"],
  "anker-737-power-bank": ["anker-power-bank.jpg", "anker-power-bank-1.jpg"],
  "samsung-t7-shield-1tb": ["samsung-t7.jpg", "samsung-t7-1.jpg", "samsung-t7-2.jpg"],
  "logitech-mx-master-3s": ["logitech-mx.jpg", "logitech-mx-2.jpg"],
};

const BUCKETS = [
  { bucket: "category-images", dir: "src/assets/category-images", mapped: Object.values(CATEGORY_IMAGES) },
  { bucket: "product-images", dir: "src/assets/products", mapped: Object.values(PRODUCT_IMAGES).flat() },
];

const CONTENT_TYPES = { ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png", ".webp": "image/webp" };

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const secretKey = process.env.SUPABASE_SECRET_KEY;

if (!url || !secretKey) {
  console.error("NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SECRET_KEY are required");
  process.exit(1);
}

const supabase = createClient(url, secretKey, { auth: { persistSession: false } });

const fail = (message) => {
  console.error(`✗ ${message}`);
  process.exit(1);
};

/** Lists every object path in a bucket, descending into folders. */
const listObjects = async (bucket, prefix = "") => {
  const { data, error } = await supabase.storage.from(bucket).list(prefix, { limit: 1000 });
  if (error) fail(`list ${bucket}/${prefix}: ${error.message}`);
  const paths = [];
  for (const entry of data) {
    const full = prefix ? `${prefix}/${entry.name}` : entry.name;
    // Folders have no id
    paths.push(...(entry.id ? [full] : await listObjects(bucket, full)));
  }
  return paths;
};

// 1. Local files and maps must agree before anything is touched.
for (const { dir, mapped } of BUCKETS) {
  const files = (await readdir(dir)).filter((file) => CONTENT_TYPES[path.extname(file).toLowerCase()]);
  const unmapped = files.filter((file) => !mapped.includes(file));
  const missing = mapped.filter((file) => !files.includes(file));
  if (unmapped.length) fail(`${dir}: not referenced by the maps: ${unmapped.join(", ")}`);
  if (missing.length) fail(`${dir}: referenced but missing: ${missing.join(", ")}`);
}

// 2. Mirror the folders into the buckets.
for (const { bucket, dir, mapped } of BUCKETS) {
  for (const file of mapped) {
    const body = await readFile(path.join(dir, file));
    const { error } = await supabase.storage.from(bucket).upload(file, body, {
      contentType: CONTENT_TYPES[path.extname(file).toLowerCase()],
      upsert: true,
    });
    if (error) fail(`${bucket}/${file}: ${error.message}`);
    console.log(`✓ ${bucket}/${file}`);
  }

  const stale = (await listObjects(bucket)).filter((name) => !mapped.includes(name));
  if (stale.length) {
    const { error } = await supabase.storage.from(bucket).remove(stale);
    if (error) fail(`remove from ${bucket}: ${error.message}`);
    stale.forEach((name) => console.log(`− ${bucket}/${name}`));
  }
}

// 3. Point the catalog at the uploaded files.
for (const [slug, file] of Object.entries(CATEGORY_IMAGES)) {
  const { error } = await supabase.from("categories").update({ thumbnail_path: file }).eq("slug", slug);
  if (error) fail(`category ${slug}: ${error.message}`);
}
console.log(`✓ ${Object.keys(CATEGORY_IMAGES).length} category thumbnails`);

const { data: products, error: productsError } = await supabase.from("products").select("id, slug, title");
if (productsError) fail(`products: ${productsError.message}`);

const withoutImages = products.filter((p) => !PRODUCT_IMAGES[p.slug]).map((p) => p.slug);
if (withoutImages.length) console.warn(`! products without images: ${withoutImages.join(", ")}`);

const rows = products.flatMap((product) =>
  (PRODUCT_IMAGES[product.slug] ?? []).map((file, position) => ({
    product_id: product.id,
    storage_path: file,
    alt: product.title,
    position,
  }))
);

const { error: deleteError } = await supabase.from("product_images").delete().not("id", "is", null);
if (deleteError) fail(`product_images delete: ${deleteError.message}`);
const { error: insertError } = await supabase.from("product_images").insert(rows);
if (insertError) fail(`product_images insert: ${insertError.message}`);
console.log(`✓ ${rows.length} product images for ${products.length - withoutImages.length} products`);
