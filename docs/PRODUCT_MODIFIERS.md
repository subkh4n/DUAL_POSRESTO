# Product Modifier System

> **Status**: ✅ Selesai

Fitur pemilihan Modifier (Topping, Size, Level) saat kasir menambahkan produk ke keranjang, dan halaman Admin untuk mengelola data modifier.

## Database Schema

Tabel yang sudah ditambahkan ke `supabase_migration.sql`:

### modifier_groups

```sql
CREATE TABLE modifier_groups (
    id TEXT PRIMARY KEY, -- e.g. 'grp-topping', 'grp-size'
    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('SINGLE', 'MULTIPLE')),
    required BOOLEAN DEFAULT FALSE,
    min_select INT DEFAULT 0,
    max_select INT DEFAULT 1
);
```

### modifier_items

```sql
CREATE TABLE modifier_items (
    id TEXT PRIMARY KEY, -- e.g. 'mod-coklat', 'size-m'
    group_id TEXT REFERENCES modifier_groups(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    price_adjust DECIMAL(12,2) DEFAULT 0,
    available BOOLEAN DEFAULT TRUE
);
```

### product_modifiers (Junction Table)

```sql
CREATE TABLE product_modifiers (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    group_id TEXT REFERENCES modifier_groups(id) ON DELETE CASCADE,
    UNIQUE (product_id, group_id)
);
```

## Fitur POS Page

File `src/app/(admin)/admin/pos/page.tsx`:

- Klik produk → muncul modal pilihan Topping/Size/Level
- Validasi required groups dan min/max selection
- Harga di keranjang sudah termasuk `price_adjust`

## Fitur Admin CRUD

Halaman `/admin/modifiers`:

- Daftar Modifier Groups (expandable)
- Form Create/Edit/Delete Group
- Nested list untuk Modifier Items
- Toggle ketersediaan item (available)

## Cara Menghubungkan Produk ke Modifier

Insert data ke tabel `product_modifiers`:

```sql
INSERT INTO product_modifiers (product_id, group_id) VALUES
('uuid-produk-kopi', 'grp-size'),
('uuid-produk-kopi', 'grp-topping');
```
