-- Sample catalog for Tech Heim. Safe to re-run: it wipes and recreates the catalog.
-- Images live in src/assets and are uploaded with `node scripts/sync-images.mjs` (see README).

truncate public.product_images, public.products, public.categories restart identity cascade;

insert into public.shipping_methods (code, price, position) values
  ('free', 0, 0),
  ('regular', 7.5, 1),
  ('express', 22.5, 2)
on conflict (code) do update set price = excluded.price, position = excluded.position;

insert into public.categories (slug, title, description, thumbnail_path, position) values
  ('mobile-phones', 'Mobile Phones', 'Latest smartphones from top brands', 'mobile.jpg', 1),
  ('laptops', 'Laptops & Computers', 'Laptops, ultrabooks and desktops', 'laptops.jpg', 2),
  ('wearables', 'Wearables', 'Smart watches and fitness trackers', 'smart-watch.jpg', 3),
  ('cameras', 'Cameras', 'Mirrorless, DSLR and action cameras', 'cameras.jpg', 4),
  ('gaming', 'Gaming', 'Consoles, VR and gaming gear', 'game.jpg', 5),
  ('accessories', 'Accessories', 'Headphones, chargers and more', 'accessory.jpg', 6);

with c as (select id, slug from public.categories)
insert into public.products (slug, title, description, price, discount_percentage, is_new, rate, colors, details, category_id, created_at)
select p.slug, p.title, p.description, p.price, p.discount, p.is_new, p.rate, p.colors, p.details::jsonb, c.id, now() - (p.age_days || ' days')::interval
from (values
  ('iphone-14-pro-max-256gb', 'iPhone 14 Pro Max 256GB', 'Apple flagship with A16 Bionic, 48MP camera and Dynamic Island.', 1199.00, 10, false, 4.8, array['black','silver','gold','purple'], '{"Display":"6.7\" OLED","Chip":"A16 Bionic","Storage":"256GB","Camera":"48MP"}', 'mobile-phones', 40),
  ('samsung-galaxy-s23-ultra-256gb', 'Samsung Galaxy S23 Ultra 256GB', 'Snapdragon 8 Gen 2, 200MP camera and built-in S Pen.', 1099.00, 15, false, 4.7, array['black','green','beige'], '{"Display":"6.8\" AMOLED","Chip":"Snapdragon 8 Gen 2","Storage":"256GB","Camera":"200MP"}', 'mobile-phones', 35),
  ('google-pixel-8-pro', 'Google Pixel 8 Pro', 'Tensor G3 with the best of Google AI and a pro-grade camera.', 999.00, null, true, 4.6, array['black','white','blue'], '{"Display":"6.7\" OLED","Chip":"Tensor G3","Storage":"128GB","Camera":"50MP"}', 'mobile-phones', 5),
  ('xiaomi-13t-pro', 'Xiaomi 13T Pro', 'Leica optics and 120W HyperCharge.', 749.00, 20, false, 4.4, array['black','blue'], '{"Display":"6.67\" AMOLED","Chip":"Dimensity 9200+","Storage":"512GB","Camera":"50MP"}', 'mobile-phones', 60),
  ('oneplus-12', 'OnePlus 12', 'Snapdragon 8 Gen 3 with Hasselblad camera.', 899.00, null, true, 4.5, array['green','black'], '{"Display":"6.82\" AMOLED","Chip":"Snapdragon 8 Gen 3","Storage":"256GB","Camera":"50MP"}', 'mobile-phones', 3),

  ('apple-macbook-pro-14-m3', 'Apple MacBook Pro 14" M3', 'M3 chip, Liquid Retina XDR display and all-day battery life.', 1999.00, null, true, 4.9, array['gray','silver'], '{"Display":"14.2\" XDR","Chip":"Apple M3","RAM":"16GB","Storage":"512GB SSD"}', 'laptops', 2),
  ('apple-macbook-air-13-m2', 'Apple MacBook Air 13" M2', 'Thin, light and silent with the M2 chip.', 1099.00, 12, false, 4.8, array['silver','gray','gold'], '{"Display":"13.6\" Liquid Retina","Chip":"Apple M2","RAM":"8GB","Storage":"256GB SSD"}', 'laptops', 90),
  ('dell-xps-15', 'Dell XPS 15', 'InfinityEdge OLED display with Intel Core i7.', 1599.00, 8, false, 4.5, array['silver','black'], '{"Display":"15.6\" OLED","CPU":"Intel Core i7-13700H","RAM":"16GB","Storage":"1TB SSD"}', 'laptops', 70),
  ('lenovo-thinkpad-x1-carbon', 'Lenovo ThinkPad X1 Carbon', 'Business ultrabook with legendary keyboard.', 1449.00, null, false, 4.6, array['black'], '{"Display":"14\" IPS","CPU":"Intel Core i7-1365U","RAM":"16GB","Storage":"512GB SSD"}', 'laptops', 120),
  ('asus-rog-zephyrus-g14', 'ASUS ROG Zephyrus G14', 'Compact gaming laptop with RTX 4060.', 1699.00, 18, true, 4.7, array['white','gray'], '{"Display":"14\" 165Hz","CPU":"AMD Ryzen 9 7940HS","GPU":"RTX 4060","Storage":"1TB SSD"}', 'laptops', 6),

  ('apple-watch-series-9', 'Apple Watch Series 9', 'S9 chip, double tap gesture and brighter display.', 399.00, null, true, 4.7, array['black','silver','pink'], '{"Case":"45mm","Chip":"S9 SiP","Battery":"18h","Water resistance":"50m"}', 'wearables', 4),
  ('samsung-galaxy-watch-6', 'Samsung Galaxy Watch 6', 'Advanced sleep coaching and health tracking.', 299.00, 25, false, 4.4, array['black','silver','gold'], '{"Case":"44mm","Display":"Super AMOLED","Battery":"40h","Water resistance":"5ATM"}', 'wearables', 80),
  ('garmin-fenix-7', 'Garmin Fenix 7', 'Rugged multisport GPS watch with solar charging.', 699.00, 10, false, 4.8, array['black','gray'], '{"Case":"47mm","GPS":"Multi-band","Battery":"18 days","Water resistance":"10ATM"}', 'wearables', 150),
  ('fitbit-charge-6', 'Fitbit Charge 6', 'Fitness tracker with built-in GPS and Google apps.', 159.00, null, false, 4.2, array['black','white','blue'], '{"Display":"AMOLED","GPS":"Built-in","Battery":"7 days","Water resistance":"50m"}', 'wearables', 100),
  ('xiaomi-smart-band-8', 'Xiaomi Smart Band 8', 'Lightweight band with 16-day battery.', 49.00, 20, false, 4.1, array['black','gold','pink'], '{"Display":"1.62\" AMOLED","Battery":"16 days","Water resistance":"5ATM"}', 'wearables', 110),

  ('sony-alpha-a7-iv', 'Sony Alpha A7 IV', 'Full-frame hybrid camera with 33MP sensor.', 2499.00, 10, false, 4.9, array['black'], '{"Sensor":"33MP full-frame","Video":"4K 60p","Stabilization":"5-axis IBIS","Mount":"Sony E"}', 'cameras', 130),
  ('canon-eos-r6-mark-ii', 'Canon EOS R6 Mark II', 'Fast full-frame mirrorless for stills and video.', 2299.00, null, true, 4.8, array['black'], '{"Sensor":"24MP full-frame","Video":"4K 60p","Burst":"40 fps","Mount":"Canon RF"}', 'cameras', 7),
  ('fujifilm-x-t5', 'Fujifilm X-T5', '40MP APS-C with classic dials.', 1699.00, 5, false, 4.7, array['black','silver'], '{"Sensor":"40MP APS-C","Video":"6.2K 30p","Stabilization":"7-stop IBIS","Mount":"Fujifilm X"}', 'cameras', 95),
  ('gopro-hero-12-black', 'GoPro HERO12 Black', 'Waterproof action camera with HDR video.', 399.00, 15, false, 4.5, array['black'], '{"Video":"5.3K 60p","Waterproof":"10m","Stabilization":"HyperSmooth 6.0"}', 'cameras', 85),
  ('dji-osmo-pocket-3', 'DJI Osmo Pocket 3', 'Pocket gimbal camera with 1-inch sensor.', 519.00, null, true, 4.6, array['gray'], '{"Sensor":"1-inch CMOS","Video":"4K 120p","Gimbal":"3-axis"}', 'cameras', 1),

  ('vr-visiontech-x1', 'VisionTech X1 VR Headset', 'Immersive standalone VR with 4K displays.', 499.00, 10, true, 4.3, array['white','black'], '{"Display":"4K LCD","Refresh rate":"120Hz","Storage":"256GB","Tracking":"Inside-out"}', 'gaming', 8),
  ('playstation-5-slim', 'PlayStation 5 Slim', 'Slimmer PS5 with 1TB SSD.', 499.00, null, false, 4.8, array['white'], '{"Storage":"1TB SSD","Resolution":"Up to 8K","Drive":"Ultra HD Blu-ray"}', 'gaming', 75),
  ('xbox-series-x', 'Xbox Series X', 'The fastest, most powerful Xbox ever.', 499.00, 10, false, 4.7, array['black'], '{"Storage":"1TB SSD","Resolution":"4K 120fps","CPU":"8-core Zen 2"}', 'gaming', 140),
  ('nintendo-switch-oled', 'Nintendo Switch OLED', 'Handheld and TV play with a vibrant 7" OLED.', 349.00, null, false, 4.7, array['white','red'], '{"Display":"7\" OLED","Storage":"64GB","Battery":"4.5–9h"}', 'gaming', 160),
  ('logitech-g-pro-x-superlight', 'Logitech G Pro X Superlight', 'Ultra-light wireless gaming mouse.', 149.00, 20, false, 4.6, array['black','white','pink'], '{"Weight":"63g","Sensor":"HERO 25K","Battery":"70h"}', 'gaming', 55),

  ('sony-wh-1000xm5', 'Sony WH-1000XM5', 'Industry-leading noise cancelling headphones.', 399.00, 15, false, 4.8, array['black','silver','blue'], '{"Type":"Over-ear","ANC":"Yes","Battery":"30h","Bluetooth":"5.2"}', 'accessories', 65),
  ('apple-airpods-pro-2', 'Apple AirPods Pro (2nd gen)', 'Adaptive audio and USB-C charging case.', 249.00, null, true, 4.7, array['white'], '{"Type":"In-ear","ANC":"Yes","Battery":"6h (30h with case)","Charging":"USB-C / MagSafe"}', 'accessories', 9),
  ('anker-737-power-bank', 'Anker 737 Power Bank', '24,000mAh, 140W fast charging power bank.', 149.00, 25, false, 4.5, array['black'], '{"Capacity":"24000mAh","Output":"140W","Ports":"2x USB-C, 1x USB-A"}', 'accessories', 45),
  ('samsung-t7-shield-1tb', 'Samsung T7 Shield 1TB', 'Rugged portable SSD up to 1,050MB/s.', 109.00, 10, false, 4.6, array['black','blue','beige'], '{"Capacity":"1TB","Speed":"1050MB/s","Interface":"USB 3.2 Gen 2"}', 'accessories', 50),
  ('logitech-mx-master-3s', 'Logitech MX Master 3S', 'Quiet-click ergonomic productivity mouse.', 99.00, null, false, 4.8, array['gray','black','white'], '{"Sensor":"8K DPI","Battery":"70 days","Connectivity":"Bluetooth / Bolt"}', 'accessories', 115)
) as p (slug, title, description, price, discount, is_new, rate, colors, details, category_slug, age_days)
join c on c.slug = p.category_slug;

-- Product photos: files of src/assets/products, uploaded to the product-images bucket
-- by scripts/sync-images.mjs (keep this list in sync with PRODUCT_IMAGES there).
insert into public.product_images (product_id, storage_path, alt, position)
select p.id, img.path, p.title, img.position
from (values
  ('iphone-14-pro-max-256gb', 'iphone-14.jpg', 0),
  ('iphone-14-pro-max-256gb', 'iphone-14-1.jpg', 1),
  ('samsung-galaxy-s23-ultra-256gb', 'samsung-galaxy.jpg', 0),
  ('samsung-galaxy-s23-ultra-256gb', 'samsung-galaxy-1.jpg', 1),
  ('google-pixel-8-pro', 'google-pixel.jpg', 0),
  ('xiaomi-13t-pro', 'xiaomi.jpg', 0),
  ('xiaomi-13t-pro', 'xiaomi-1.jpg', 1),
  ('oneplus-12', 'oneplus.jpg', 0),
  ('oneplus-12', 'oneplus-1.jpg', 1),
  ('oneplus-12', 'oneplus-2.jpg', 2),
  ('apple-macbook-pro-14-m3', 'apple-macbook-1.jpg', 0),
  ('apple-macbook-pro-14-m3', 'apple-macbook-2.jpg', 1),
  ('apple-macbook-air-13-m2', 'apple-macbook.jpg', 0),
  ('dell-xps-15', 'del-xps.jpg', 0),
  ('lenovo-thinkpad-x1-carbon', 'lenovo-laptop.jpg', 0),
  ('asus-rog-zephyrus-g14', 'asus-rog.jpg', 0),
  ('apple-watch-series-9', 'apple-watch.jpg', 0),
  ('apple-watch-series-9', 'apple-watch-1.jpg', 1),
  ('apple-watch-series-9', 'apple-watch-2.jpg', 2),
  ('samsung-galaxy-watch-6', 'galaxy-watch.jpg', 0),
  ('samsung-galaxy-watch-6', 'galaxy-watch-1.jpg', 1),
  ('samsung-galaxy-watch-6', 'galaxy-watch-2.jpg', 2),
  ('garmin-fenix-7', 'garmin-fenix.jpg', 0),
  ('garmin-fenix-7', 'garmin-fenix-1.jpg', 1),
  ('fitbit-charge-6', 'fitbit-charge.jpg', 0),
  ('fitbit-charge-6', 'fitbit-charge-1.jpg', 1),
  ('xiaomi-smart-band-8', 'xiaomi-band.jpg', 0),
  ('xiaomi-smart-band-8', 'xiaomi-band-1.jpg', 1),
  ('sony-alpha-a7-iv', 'sony-alpha.jpg', 0),
  ('sony-alpha-a7-iv', 'sony-alpha-1.jpg', 1),
  ('sony-alpha-a7-iv', 'sony-alpha-2.jpg', 2),
  ('canon-eos-r6-mark-ii', 'canon-eos.jpg', 0),
  ('canon-eos-r6-mark-ii', 'canon-eos-1.jpg', 1),
  ('fujifilm-x-t5', 'fujifilm.jpg', 0),
  ('fujifilm-x-t5', 'fujifilm-1.jpg', 1),
  ('gopro-hero-12-black', 'gopro-hero.jpg', 0),
  ('gopro-hero-12-black', 'gopro-hero-1.jpg', 1),
  ('gopro-hero-12-black', 'gopro-hero-2.jpg', 2),
  ('dji-osmo-pocket-3', 'dji-osmo.jpg', 0),
  ('dji-osmo-pocket-3', 'dji-osmo-1.jpg', 1),
  ('vr-visiontech-x1', 'apple-visiotech.jpg', 0),
  ('vr-visiontech-x1', 'apple-visiotech-1.jpg', 1),
  ('playstation-5-slim', 'playstation.jpg', 0),
  ('playstation-5-slim', 'playstation-1.jpg', 1),
  ('playstation-5-slim', 'playstation-3.jpg', 2),
  ('xbox-series-x', 'xbox-x.jpg', 0),
  ('xbox-series-x', 'xbox-x-1.jpg', 1),
  ('nintendo-switch-oled', 'nintendo.jpg', 0),
  ('nintendo-switch-oled', 'nintendo-1.jpg', 1),
  ('logitech-g-pro-x-superlight', 'logitech-g.jpg', 0),
  ('sony-wh-1000xm5', 'sony-wh.jpg', 0),
  ('sony-wh-1000xm5', 'sony-wh-1.jpg', 1),
  ('sony-wh-1000xm5', 'sony-wh-2.jpg', 2),
  ('apple-airpods-pro-2', 'apple-airpods.jpg', 0),
  ('apple-airpods-pro-2', 'apple-airpods-1.jpg', 1),
  ('apple-airpods-pro-2', 'apple-airpods-2.jpg', 2),
  ('anker-737-power-bank', 'anker-power-bank.jpg', 0),
  ('anker-737-power-bank', 'anker-power-bank-1.jpg', 1),
  ('samsung-t7-shield-1tb', 'samsung-t7.jpg', 0),
  ('samsung-t7-shield-1tb', 'samsung-t7-1.jpg', 1),
  ('samsung-t7-shield-1tb', 'samsung-t7-2.jpg', 2),
  ('logitech-mx-master-3s', 'logitech-mx.jpg', 0),
  ('logitech-mx-master-3s', 'logitech-mx-2.jpg', 1)
) as img (slug, path, position)
join public.products p on p.slug = img.slug;
