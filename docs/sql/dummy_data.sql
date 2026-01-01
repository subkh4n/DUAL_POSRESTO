-- ===============================================
-- DUMMY DATA - Products & Categories
-- Jalankan di Supabase SQL Editor
-- ===============================================

-- 1. Insert Categories
INSERT INTO categories (name, icon) 
VALUES 
  ('Food', '🍔'),
  ('Drinks', '🥤'),
  ('Extra', '🍟'),
  ('Donasi', '💝'),
  ('Services', '🛠️'),
  ('Minuman', '🧃')
ON CONFLICT (name) DO NOTHING;

-- 2. Insert Products
INSERT INTO products (name, category_id, base_price, image) VALUES
('Paket Lengkap', (SELECT id FROM categories WHERE name = 'Food'), 50000, 'https://lh3.googleusercontent.com/d/13mE43Kld4sxHGSkAt8kNovUq9qtAPhH3'),
('Nasi Goreng Spesial', (SELECT id FROM categories WHERE name = 'Food'), 25000, 'https://lh3.googleusercontent.com/d/1XCTs_UEhUsD_2JsLa0H3GxLT5TWzyN3m'),
('Es Teh Manis', (SELECT id FROM categories WHERE name = 'Drinks'), 5000, 'https://lh3.googleusercontent.com/d/1ahTK-0kUEXjVYYX2JmWvQZ-CsyctSu-M'),
('Susu Kaleng', (SELECT id FROM categories WHERE name = 'Extra'), 2000, 'https://lh3.googleusercontent.com/d/1f2dLK3HHXrtNMjXkQRzyzVfXcDGngtIN'),
('Roti Bakar Cokelat', (SELECT id FROM categories WHERE name = 'Food'), 15000, 'https://lh3.googleusercontent.com/d/1KCFI7jJhttddPQ3S97tHi_qP5LOVbVby'),
('Air Mineral 600ml', (SELECT id FROM categories WHERE name = 'Minuman'), 4000, 'https://lh3.googleusercontent.com/d/1FHO7NiJlFp6jo7L-336pHZsAWQWlMGzJ'),
('Ayam Bakar Madu', (SELECT id FROM categories WHERE name = 'Food'), 30000, 'https://lh3.googleusercontent.com/d/1K3L0hWGSQku6yP4kFzIpi_JJa2HybdK3'),
('Teh Kemasan', (SELECT id FROM categories WHERE name = 'Extra'), 3000, 'https://lh3.googleusercontent.com/d/1-4_UJGialsyehBYOQp0D7WfqP8CcVaCN'),
('Jus Alpukat', (SELECT id FROM categories WHERE name = 'Drinks'), 12000, 'https://lh3.googleusercontent.com/d/1IUuyzfQj36W060fqiSqEZiW2AVHUvicD'),
('Susu Kotak', (SELECT id FROM categories WHERE name = 'Drinks'), 6000, 'https://lh3.googleusercontent.com/d/11kWJc7qUjAeSD_wQjpAyTxv-BRQUkEDp'),
('Emping Melinjo', (SELECT id FROM categories WHERE name = 'Extra'), 5000, 'https://lh3.googleusercontent.com/d/12QBquVW_tJe958g5Dg7AsFjjVWAkd2yj'),
('Nasi Mandi', (SELECT id FROM categories WHERE name = 'Food'), 150000, 'https://lh3.googleusercontent.com/d/19OmG-w-Tqoc6w32CaKpE2m2ynlSsuvbI'),
('Nasi Kebuli', (SELECT id FROM categories WHERE name = 'Food'), 100000, 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c'),
('Biaya Bungkus', (SELECT id FROM categories WHERE name = 'Services'), 1000, 'https://lh3.googleusercontent.com/d/120YCW6azH63YNdaZCzmH-0K8PL4UWduw'),
('Donasi Umum', (SELECT id FROM categories WHERE name = 'Donasi'), 0, 'https://lh3.googleusercontent.com/d/1vIjIhSLNOes417z6SSZIbAPwPp1QYNUr'),
('Rujak Manis', (SELECT id FROM categories WHERE name = 'Food'), 15000, 'https://lh3.googleusercontent.com/d/11cA1Mb_0AUGwjX0qOA--p6HnSIviF6he'),
('Donasi RS Almaunah', (SELECT id FROM categories WHERE name = 'Donasi'), 0, NULL),
('Donasi Pendidikan', (SELECT id FROM categories WHERE name = 'Donasi'), 0, NULL),
('Telur Dadar', (SELECT id FROM categories WHERE name = 'Extra'), 10000, 'https://lh3.googleusercontent.com/d/1qoq6C7gZjg6fI-ZfeuGUnD2VaqAxH7Xn'),
('Nasi Goreng PIN', (SELECT id FROM categories WHERE name = 'Food'), 50000, 'https://lh3.googleusercontent.com/d/17m1wzgDQK8-wByx3tkWkMEBiFFxHE86u'),
('Ayam ARSENAL', (SELECT id FROM categories WHERE name = 'Food'), 20000, 'https://lh3.googleusercontent.com/d/1BuOtbOWYEEk1DcndiCBsigf8P96GJ17V'),
('Nasi Bakar TERANG BULAN', (SELECT id FROM categories WHERE name = 'Food'), 15000, 'https://lh3.googleusercontent.com/d/1cEbxc3D_m_etsV00HjMtgTfk9ZZr3eyI');

-- 3. Tambahkan semua produk ke branch pertama
INSERT INTO branch_products (branch_id, product_id, is_active, stock, stock_type)
SELECT 
  (SELECT id FROM branches LIMIT 1),
  p.id,
  TRUE,
  0,
  'NON_STOK'
FROM products p
ON CONFLICT (branch_id, product_id) DO NOTHING;

-- 4. Hubungkan beberapa produk ke modifier (contoh)
-- Kopi/Minuman dengan Size
INSERT INTO product_modifiers (product_id, group_id)
SELECT p.id, 'grp-size' FROM products p WHERE p.name IN ('Es Teh Manis', 'Jus Alpukat', 'Susu Kotak')
ON CONFLICT DO NOTHING;

-- Makanan dengan Topping
INSERT INTO product_modifiers (product_id, group_id)
SELECT p.id, 'grp-topping' FROM products p WHERE p.name IN ('Nasi Goreng Spesial', 'Roti Bakar Cokelat')
ON CONFLICT DO NOTHING;

-- Makanan dengan Level Pedas
INSERT INTO product_modifiers (product_id, group_id)
SELECT p.id, 'grp-level' FROM products p WHERE p.name IN ('Nasi Goreng Spesial', 'Ayam Bakar Madu', 'Nasi Mandi')
ON CONFLICT DO NOTHING;
