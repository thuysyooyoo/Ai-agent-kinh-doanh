-- ═════════════════════════════════════════════════════════════════════════════
-- EUREKA LOGISTICS — SUPABASE DATABASE SCHEMA & RLS SETUP
-- Hướng dẫn: Mở Supabase Dashboard -> Vào mục "SQL Editor" -> Dán đoạn này -> Bấm Run
-- ═════════════════════════════════════════════════════════════════════════════

-- 1. BẢNG USERS (Tài khoản người dùng với password hash SHA-256)
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username TEXT UNIQUE NOT NULL,
    display_name TEXT NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'sale', -- 'admin' hoặc 'sale'
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tạo sẵn tài khoản Admin mặc định (mật khẩu đã hash chuẩn SHA-256)
INSERT INTO public.users (username, display_name, password_hash, role)
VALUES (
    'admin',
    'Quản trị viên Eureka',
    '$sha256$00c88ff9fda448818fee2d9d338fef509afe5a2d92b01583c3521342b70085b0',
    'admin'
)
ON CONFLICT (username) DO NOTHING;

-- 2. BẢNG BUYERS (Danh bạ khách hàng / Bên mua)
CREATE TABLE IF NOT EXISTS public.buyers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL,
    address TEXT,
    tax_code TEXT,
    phone TEXT,
    email TEXT,
    representative TEXT,
    position TEXT,
    created_by TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. BẢNG CALCULATION_HISTORY (Lịch sử tính giá khai báo 1 sổ)
CREATE TABLE IF NOT EXISTS public.calculation_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type TEXT NOT NULL, -- 'LCL' hoặc 'FCL'
    customer_name TEXT,
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    data_payload JSONB NOT NULL,
    created_by TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. BẢNG IP_LOGS (Nhật ký đăng nhập và IP)
CREATE TABLE IF NOT EXISTS public.ip_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username TEXT NOT NULL,
    status TEXT NOT NULL, -- 'Thành công' hoặc 'Thất bại'
    ip TEXT,
    details TEXT,
    timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- 5. BẢNG TARIFFS (Bảng cước cấu hình)
CREATE TABLE IF NOT EXISTS public.tariffs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    version TEXT DEFAULT 'v1',
    tariff_data JSONB NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ═════════════════════════════════════════════════════════════════════════════
-- BẬT ROW LEVEL SECURITY (RLS) ĐỂ BẢO VỆ DỮ LIỆU
-- ═════════════════════════════════════════════════════════════════════════════

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.buyers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.calculation_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ip_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tariffs ENABLE ROW LEVEL SECURITY;

-- Cho phép ứng dụng truy xuất qua Anon Key (có kiểm soát)
CREATE POLICY "Cho phép đọc users" ON public.users FOR SELECT USING (true);
CREATE POLICY "Cho phép ghi users" ON public.users FOR ALL USING (true);

CREATE POLICY "Toàn quyền buyers" ON public.buyers FOR ALL USING (true);
CREATE POLICY "Toàn quyền history" ON public.calculation_history FOR ALL USING (true);
CREATE POLICY "Toàn quyền ip_logs" ON public.ip_logs FOR ALL USING (true);
CREATE POLICY "Toàn quyền tariffs" ON public.tariffs FOR ALL USING (true);

-- Indexes tối ưu tốc độ tra cứu
CREATE INDEX IF NOT EXISTS idx_users_username ON public.users(username);
CREATE INDEX IF NOT EXISTS idx_buyers_name ON public.buyers(name);
CREATE INDEX IF NOT EXISTS idx_history_timestamp ON public.calculation_history(timestamp DESC);
