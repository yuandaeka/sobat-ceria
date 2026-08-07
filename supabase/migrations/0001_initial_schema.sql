-- ============================================================
-- SOBAT CERIA - Supabase Database Schema (Initial Migration)
-- Jalankan di Supabase Dashboard > SQL Editor
-- ============================================================

-- 1. PROFILES (terhubung ke auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  parent_name text not null default '',
  email text,
  phone text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2. CHILDREN (data anak milik orang tua)
create table if not exists public.children (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles (id) on delete cascade,
  name text not null,
  age integer not null default 4,
  special_needs text,
  created_at timestamptz not null default now()
);

-- 3. COURSES (katalog kelas)
create table if not exists public.courses (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null,
  age_range text not null,
  price integer not null default 0,
  seats integer not null default 10,
  image text,
  description text,
  facilitator text,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- 4. VOUCHERS (kode promo)
create table if not exists public.vouchers (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  discount_amount integer not null default 0,
  description text,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- 5. ORDERS (riwayat pendaftaran kelas)
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references public.profiles (id) on delete set null,
  course_id uuid references public.courses (id) on delete set null,
  child_name text,
  whatsapp text,
  voucher_code text,
  discount integer not null default 0,
  total_amount integer not null default 0,
  status text not null default 'paid',
  created_at timestamptz not null default now()
);

-- 6. SCREENING_RESULTS (hasil observasi STPPA)
create table if not exists public.screening_results (
  id uuid primary key default gen_random_uuid(),
  child_id uuid references public.children (id) on delete cascade,
  category text not null,
  status text not null default 'Mulai Berkembang',
  score_date timestamptz not null default now(),
  psychologist_notes text,
  created_at timestamptz not null default now()
);

-- 7. WORKSHEETS (materi printable)
create table if not exists public.worksheets (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  age_group text not null,
  category text not null,
  pages integer not null default 1,
  file_url text,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================
alter table public.profiles enable row level security;
alter table public.children enable row level security;
alter table public.courses enable row level security;
alter table public.vouchers enable row level security;
alter table public.orders enable row level security;
alter table public.screening_results enable row level security;
alter table public.worksheets enable row level security;

-- Profil: user hanya bisa baca/ubah profil sendiri
create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id);
create policy "profiles_insert_own" on public.profiles
  for insert with check (auth.uid() = id);
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id);

-- Children: user hanya bisa akses data anak miliknya
create policy "children_select_own" on public.children
  for select using (auth.uid() = profile_id);
create policy "children_insert_own" on public.children
  for insert with check (auth.uid() = profile_id);
create policy "children_update_own" on public.children
  for update using (auth.uid() = profile_id);
create policy "children_delete_own" on public.children
  for delete using (auth.uid() = profile_id);

-- Courses: publik bisa baca (katalog), hanya admin yang tulis
create policy "courses_select_public" on public.courses
  for select using (true);

-- Vouchers: publik bisa baca kode aktif
create policy "vouchers_select_active" on public.vouchers
  for select using (is_active = true);

-- Orders: user hanya bisa baca pesanan miliknya
create policy "orders_select_own" on public.orders
  for select using (auth.uid() = profile_id);
create policy "orders_insert_own" on public.orders
  for insert with check (auth.uid() = profile_id);

-- Screening: user hanya bisa baca hasil anaknya (via children join)
create policy "screening_select_own" on public.screening_results
  for select using (
    exists (
      select 1 from public.children c
      where c.id = child_id and c.profile_id = auth.uid()
    )
  );

-- Worksheets: publik bisa baca
create policy "worksheets_select_public" on public.worksheets
  for select using (is_active = true);

-- ============================================================
-- TRIGGER: buat profil otomatis saat user baru daftar/login
-- ============================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, parent_name, email)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', ''), new.email)
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
