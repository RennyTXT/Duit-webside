-- 1. Create a table for Product Options/Accessories
CREATE TABLE IF NOT EXISTS product_options (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id TEXT REFERENCES products(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  price_modifier NUMERIC DEFAULT 0,
  sku TEXT,
  category TEXT, -- e.g., 'bowl', 'cushion', 'refill'
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 2. Enable RLS for the new table
ALTER TABLE product_options ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public Read Options" ON product_options FOR SELECT USING (true);
CREATE POLICY "Allow All for Admin" ON product_options FOR ALL USING (true) WITH CHECK (true);

-- 3. Clear existing data to avoid conflicts (Optional, but cleaner for full import)
DELETE FROM product_options;
DELETE FROM products;

-- 4. INSERT BASE PRODUCTS
INSERT INTO products (id, name, price, category, tagline, description, image_url, is_new, is_best)
VALUES
('DUIT0118', 'City Rover Beige', 17900, 'travel', 'Urban Luxury Stroller', 'Premium urban stroller for the refined companion.', 'https://cdn-optimized.imweb.me/upload/S20240401733b573a10ea4/a3087dd65d164.jpg', true, true),
('DUIT0119', 'City Rover Black', 17900, 'travel', 'Urban Luxury Stroller', 'Stealth black edition of our flagship urban stroller.', 'https://cdn-optimized.imweb.me/upload/S20240401733b573a10ea4/a3087dd65d164.jpg', true, false),
('DUIT0030', 'The Table Plus', 7490, 'eat-drink', 'Customizable Smart Feeder', 'The ultimate dining experience with adjustable height and tilt.', 'https://cdn-optimized.imweb.me/upload/S20240401733b573a10ea4/13ff08bf73ad5.jpg', false, true),
('DUIT0034', 'Daily Table (M)', 2590, 'eat-drink', 'Everyday Essential Dining', 'Clean aesthetics for your pet''s daily meals.', 'https://cdn-optimized.imweb.me/upload/S20240401733b573a10ea4/02c3dd1725fb7.jpg', false, false),
('DUIT0033', 'Daily Table (S)', 2590, 'eat-drink', 'Everyday Essential Dining', 'Compact design for smaller companions.', 'https://cdn-optimized.imweb.me/upload/S20240401733b573a10ea4/02c3dd1725fb7.jpg', false, false),
('DUIT0116', 'Windows Hammock', 2890, 'furniture', 'Floating Panoramic Lounge', 'Secure window lounging with premium materials.', 'https://cdn-optimized.imweb.me/upload/S20240401733b573a10ea4/a42c07212f457.jpg', false, true),
('DUIT0088', 'Catthenon', 3190, 'play-rest', 'Architectural Cat Scratcher', 'Inspired by Greek temples, built for feline play.', 'https://cdn-optimized.imweb.me/upload/S20240401733b573a10ea4/1ea24a0d5546d.jpg', false, true),
('DUIT0109', 'Mini Cat Tower', 8290, 'furniture', 'Modular Vertical Haven', 'A customizable sky-high retreat for cats.', 'https://cdn-optimized.imweb.me/upload/S20240401733b573a10ea4/1eff7a9ff2bb1.jpg', true, false),
('DUIT0092', 'Poo Poo Box 2-Way', 2990, 'hygiene', 'Privacy Litter Solution', 'Smart entry design to keep litter inside.', 'https://cdn.imweb.me/upload/S201801295a6ea8288a1a1/aab92744b8a85.jpg', false, false),
('DUIT0077', 'Waterpot', 4390, 'eat-drink', 'Advanced Filtration Fountain', 'Ultra-pure water circulation system.', 'https://cdn-optimized.imweb.me/upload/S20240401733b573a10ea4/02c3dd1725fb7.jpg', false, true);

-- 5. INSERT OPTIONS/ACCESSORIES
INSERT INTO product_options (product_id, name, price_modifier)
VALUES
-- City Rover Options
('DUIT0118', 'Carry Bag', 1690),
('DUIT0118', 'Comforter Cushion', 1890),
('DUIT0118', 'Liner Cushion', 1790),
('DUIT0119', 'Carry Bag', 1690),
('DUIT0119', 'Comforter Cushion', 1890),
('DUIT0119', 'Liner Cushion', 1790),

-- Daily Table Options
('DUIT0034', 'Ceramic Bowl Mushroom (M)', 550),
('DUIT0034', 'Ceramic Bowl White (M)', 550),
('DUIT0034', 'Slow Feeder Insert', 690),
('DUIT0033', 'Ceramic Bowl Mushroom (S)', 550),
('DUIT0033', 'Ceramic Bowl White (S)', 550),

-- Windows Hammock Options
('DUIT0116', 'Replacement Carpet', 790),
('DUIT0116', 'Felt Refill', 790),
('DUIT0116', 'Luxe Cushion', 1490),

-- Mini Cat Tower Options
('DUIT0109', '2nd Floor Round Cushion', 1290),
('DUIT0109', '3rd Floor Round Cushion (7cm)', 1490),
('DUIT0109', '3rd Floor Round Scratcher', 890),

-- Waterpot Options
('DUIT0077', 'Carbon Filter A-Type (2pcs)', 990),
('DUIT0077', 'Carbon Filter B-Type (2pcs)', 890),
('DUIT0077', 'Wave Pot Head A-Type', 390);
