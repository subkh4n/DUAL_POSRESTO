-- ===============================================
-- POS_RESTO Database Schema for Supabase (HYBRID MONOLITH)
-- Multi-Branch, Role-Based Access, Vouchers, and Points
-- ===============================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- CLEANUP (Optional: Remove if you want to keep existing data)
DROP TABLE IF EXISTS email_logs CASCADE;
DROP TABLE IF EXISTS stock_log CASCADE;
DROP TABLE IF EXISTS transaction_details CASCADE;
DROP TABLE IF EXISTS transactions CASCADE;
DROP TABLE IF EXISTS vouchers CASCADE;
DROP TABLE IF EXISTS branch_products CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS customer_points CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS branches CASCADE;

-- 1. BRANCHES TABLE
CREATE TABLE branches (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    address TEXT,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    is_active BOOLEAN DEFAULT TRUE
);

-- 2. USERS TABLE (Profiles)
CREATE TABLE users (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    username TEXT UNIQUE,
    password TEXT,
    phone TEXT UNIQUE NOT NULL, -- Phone is the main identifier for Customers
    name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'CUSTOMER' CHECK (role IN ('ADMIN_PUSAT', 'BRANCH_ADMIN', 'KASIR', 'CUSTOMER')),
    branch_id UUID REFERENCES branches(id) ON DELETE SET NULL, -- Null for ADMIN_PUSAT
    avatar TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    last_login TIMESTAMPTZ,
    is_active BOOLEAN DEFAULT TRUE
);

-- 3. CUSTOMER POINTS
CREATE TABLE customer_points (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
    total_points INTEGER DEFAULT 0,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. CATEGORIES TABLE (Global)
CREATE TABLE categories (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    icon TEXT
);

-- 5. PRODUCTS TABLE (Global Catalog - Managed by Admin Pusat)
CREATE TABLE products (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    base_price DECIMAL(12,2) NOT NULL DEFAULT 0,
    image TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. BRANCH PRODUCTS (Availability and Stock - Managed by Branch Admin)
CREATE TABLE branch_products (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    branch_id UUID REFERENCES branches(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    is_active BOOLEAN DEFAULT TRUE,
    stock INTEGER DEFAULT 0,
    stock_type TEXT NOT NULL CHECK (stock_type IN ('STOK_FISIK', 'NON_STOK', 'JASA')),
    UNIQUE (branch_id, product_id)
);

-- 7. VOUCHERS TABLE
CREATE TABLE vouchers (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    branch_id UUID REFERENCES branches(id) ON DELETE CASCADE, -- Voucher per branch
    code TEXT NOT NULL,
    discount_type TEXT NOT NULL CHECK (discount_type IN ('PERCENTAGE', 'FIXED')),
    value DECIMAL(12,2) NOT NULL,
    min_spend DECIMAL(12,2) DEFAULT 0,
    expires_at TIMESTAMPTZ,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (branch_id, code)
);

-- 8. TRANSACTIONS TABLE
CREATE TABLE transactions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    branch_id UUID REFERENCES branches(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    subtotal DECIMAL(12,2) NOT NULL,
    voucher_id UUID REFERENCES vouchers(id) ON DELETE SET NULL,
    discount_amount DECIMAL(12,2) DEFAULT 0,
    tax DECIMAL(12,2) DEFAULT 0,
    total DECIMAL(12,2) NOT NULL,
    cash_received DECIMAL(12,2),
    change DECIMAL(12,2),
    order_type TEXT,
    table_number TEXT,
    cashier_id UUID REFERENCES users(id) ON DELETE SET NULL,
    customer_id UUID REFERENCES users(id) ON DELETE SET NULL,
    payment_method TEXT CHECK (payment_method IN ('Tunai', 'QRIS', 'Piutang'))
);

-- 9. TRANSACTION DETAILS TABLE
CREATE TABLE transaction_details (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    transaction_id UUID REFERENCES transactions(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE SET NULL,
    product_name TEXT NOT NULL,
    qty INTEGER NOT NULL,
    price DECIMAL(12,2) NOT NULL, -- Price at the time of sale
    total_price DECIMAL(12,2) GENERATED ALWAYS AS (qty * price) STORED
);

-- 10. STOCK LOG TABLE
CREATE TABLE stock_log (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    branch_id UUID REFERENCES branches(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE SET NULL,
    action_type TEXT NOT NULL CHECK (action_type IN ('STOCK_IN', 'STOCK_OUT', 'SALE_OUT', 'ADJUSTMENT')),
    stock_value INTEGER NOT NULL,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. EMAIL LOGS TABLE
CREATE TABLE email_logs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    recipient TEXT NOT NULL,
    subject TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('SUCCESS', 'FAILED')),
    error_message TEXT,
    sent_at TIMESTAMPTZ DEFAULT NOW(),
    metadata JSONB
);

-- ===============================================
-- INDEXES
-- ===============================================
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_branch_products_branch ON branch_products(branch_id);
CREATE INDEX idx_vouchers_branch ON vouchers(branch_id);
CREATE INDEX idx_transactions_branch ON transactions(branch_id);
CREATE INDEX idx_transactions_created ON transactions(created_at DESC);

-- ===============================================
-- RLS POLICIES
-- ===============================================
ALTER TABLE branches ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE branch_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE vouchers ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE transaction_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_logs ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read branches and products
CREATE POLICY "Public read access for branches" ON branches FOR SELECT USING (true);
CREATE POLICY "Public read access for categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Public read access for products" ON products FOR SELECT USING (true);
CREATE POLICY "Public read access for branch_products" ON branch_products FOR SELECT USING (true);

-- Allow authenticated customers to insert orders
CREATE POLICY "Authenticated users can insert transactions" ON transactions FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can insert details" ON transaction_details FOR INSERT TO authenticated WITH CHECK (true);

-- Allow users to read their own data
CREATE POLICY "Users can read own record" ON users FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "Users can read own points" ON customer_points FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can read own transactions" ON transactions FOR SELECT TO authenticated USING (auth.uid() = customer_id);

-- Only Admins can read email logs
CREATE POLICY "Admins can read email logs" ON email_logs FOR SELECT TO authenticated USING (
    EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role IN ('ADMIN_PUSAT', 'BRANCH_ADMIN'))
);

CREATE POLICY "Allow server-side logging" ON email_logs FOR INSERT WITH CHECK (true);

-- ===============================================
-- TRIGGERS
-- ===============================================
-- (Trigger for adding points after transaction)
CREATE OR REPLACE FUNCTION add_points_on_purchase()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.customer_id IS NOT NULL THEN
        INSERT INTO customer_points (user_id, total_points)
        VALUES (NEW.customer_id, floor(NEW.total / 1000)::int)
        ON CONFLICT (user_id) DO UPDATE
        SET total_points = customer_points.total_points + EXCLUDED.total_points,
            updated_at = NOW();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_add_points
AFTER INSERT ON transactions
FOR EACH ROW
EXECUTE FUNCTION add_points_on_purchase();

-- ===============================================
-- DEFAULT DATA
-- ===============================================
INSERT INTO branches (name, address) VALUES 
('Toko Pusat (A)', 'Jl. Sudirman No. 1'),
('Cabang Mal (B)', 'Mal Grand Indonesia');

INSERT INTO users (username, phone, name, role) VALUES
('pusat', '081122334455', 'Admin Pusat', 'ADMIN_PUSAT');
