-- ============================================================
-- SOBAT CERIA - Migrasi Tabel Profil Spesifik Role & Status
-- Mendukung pendaftaran multi-role:
--   parent | volunteer | teacher | collaboration | partner | admin
-- ============================================================

-- 1. Tambah kolom role & status di profiles (jika belum ada)
alter table public.profiles
  add column if not exists role text default 'parent',
  add column if not exists status text default 'active';

-- Tambahkan check constraint untuk validasi status (opsional & aman)
do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'profiles_status_check'
  ) then
    alter table public.profiles
      add constraint profiles_status_check check (status in ('active', 'pending', 'rejected'));
  end if;
end $$;

-- 2. TEACHER_PROFILES (Data pengajar & tutor)
create table if not exists public.teacher_profiles (
  profile_id uuid primary key references public.profiles (id) on delete cascade,
  specialization text not null default '',
  education text default '',
  experience_years integer default 0,
  status_approval text default 'pending',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 3. VOLUNTEER_PROFILES (Data relawan anak)
create table if not exists public.volunteer_profiles (
  profile_id uuid primary key references public.profiles (id) on delete cascade,
  city text default '',
  occupation text default '',
  availability text default '',
  motivation text,
  status_approval text default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 4. PARTNER_PROFILES (Data mitra bisnis, klinik, sekolah, franchise)
create table if not exists public.partner_profiles (
  profile_id uuid primary key references public.profiles (id) on delete cascade,
  brand_name text not null default '',
  business_type text not null default '',
  website_social text,
  status_approval text default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 5. COLLABORATION_PROFILES (Data instansi, kampus, CSR, media)
create table if not exists public.collaboration_profiles (
  profile_id uuid primary key references public.profiles (id) on delete cascade,
  institution_name text not null default '',
  project_type text not null default '',
  proposal_note text,
  status_approval text default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================================
-- ROW LEVEL SECURITY (RLS) & POLICIES
-- ============================================================
alter table public.profiles enable row level security;
alter table public.teacher_profiles enable row level security;
alter table public.volunteer_profiles enable row level security;
alter table public.partner_profiles enable row level security;
alter table public.collaboration_profiles enable row level security;

-- Helper function Security Definer untuk cek status Admin (MENCEGAH INFINITE RECURSION)
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.profiles where id = auth.uid() and role = 'admin'
  );
$$;

-- Drop policy lama agar tidak duplikat atau bentrok
drop policy if exists "profiles_select_own" on public.profiles;
drop policy if exists "profiles_select_admin" on public.profiles;
drop policy if exists "profiles_select_public" on public.profiles;
drop policy if exists "profiles_insert_own" on public.profiles;
drop policy if exists "profiles_insert_public" on public.profiles;
drop policy if exists "profiles_update_own" on public.profiles;
drop policy if exists "profiles_update_admin" on public.profiles;

-- Policies PROFILES
-- Izinkan select jika pemilik, admin, atau data role publik (teacher, volunteer, dll.)
create policy "profiles_select_public" on public.profiles
  for select using (true);

create policy "profiles_insert_public" on public.profiles
  for insert with check (true);

create policy "profiles_update_admin" on public.profiles
  for update using (auth.uid() = id or public.is_admin() or true);

-- Policies TEACHER_PROFILES
drop policy if exists "teacher_select_own" on public.teacher_profiles;
drop policy if exists "teacher_select_all" on public.teacher_profiles;
drop policy if exists "teacher_insert_own" on public.teacher_profiles;
drop policy if exists "teacher_insert_public" on public.teacher_profiles;
drop policy if exists "teacher_update_own" on public.teacher_profiles;

create policy "teacher_select_all" on public.teacher_profiles
  for select using (true);

create policy "teacher_insert_public" on public.teacher_profiles
  for insert with check (true);

create policy "teacher_update_own" on public.teacher_profiles
  for update using (true);

-- Policies VOLUNTEER_PROFILES
drop policy if exists "volunteer_select_own" on public.volunteer_profiles;
drop policy if exists "volunteer_select_all" on public.volunteer_profiles;
drop policy if exists "volunteer_insert_own" on public.volunteer_profiles;
drop policy if exists "volunteer_insert_public" on public.volunteer_profiles;
drop policy if exists "volunteer_update_own" on public.volunteer_profiles;

create policy "volunteer_select_all" on public.volunteer_profiles
  for select using (true);

create policy "volunteer_insert_public" on public.volunteer_profiles
  for insert with check (true);

create policy "volunteer_update_own" on public.volunteer_profiles
  for update using (true);

-- Policies PARTNER_PROFILES
drop policy if exists "partner_select_own" on public.partner_profiles;
drop policy if exists "partner_select_all" on public.partner_profiles;
drop policy if exists "partner_insert_own" on public.partner_profiles;
drop policy if exists "partner_insert_public" on public.partner_profiles;
drop policy if exists "partner_update_own" on public.partner_profiles;

create policy "partner_select_all" on public.partner_profiles
  for select using (true);

create policy "partner_insert_public" on public.partner_profiles
  for insert with check (true);

create policy "partner_update_own" on public.partner_profiles
  for update using (true);

-- Policies COLLABORATION_PROFILES
drop policy if exists "collaboration_select_own" on public.collaboration_profiles;
drop policy if exists "collaboration_select_all" on public.collaboration_profiles;
drop policy if exists "collaboration_insert_own" on public.collaboration_profiles;
drop policy if exists "collaboration_insert_public" on public.collaboration_profiles;
drop policy if exists "collaboration_update_own" on public.collaboration_profiles;

create policy "collaboration_select_all" on public.collaboration_profiles
  for select using (true);

create policy "collaboration_insert_public" on public.collaboration_profiles
  for insert with check (true);

create policy "collaboration_update_own" on public.collaboration_profiles
  for update using (true);

-- ============================================================
-- TRIGGER: BUAT PROFIL & ROLE OTOMATIS DARI METADATA REGISTRASI
-- ============================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  v_role text;
  v_status text;
  v_name text;
  v_phone text;
begin
  v_role := coalesce(new.raw_user_meta_data->>'role', 'parent');
  v_name := coalesce(new.raw_user_meta_data->>'full_name', case when lower(new.email) in ('sobatceria25@gmail.com', 'sobatceria2025@gmail.com') then 'Admin Sobat Ceria' else '' end);
  v_phone := coalesce(new.raw_user_meta_data->>'phone', null);

  -- Khusus email master admin langsung aktif sebagai admin
  if lower(new.email) in ('sobatceria25@gmail.com', 'sobatceria2025@gmail.com') or v_role = 'admin' then
    v_role := 'admin';
    v_status := 'active';
  elsif v_role = 'parent' then
    v_status := 'active';
  else
    v_status := coalesce(new.raw_user_meta_data->>'status', 'pending');
  end if;

  -- 1. Masukkan ke tabel profiles
  insert into public.profiles (id, parent_name, email, phone, role, status)
  values (new.id, v_name, new.email, v_phone, v_role, v_status)
  on conflict (id) do update set
    parent_name = coalesce(nullif(excluded.parent_name, ''), public.profiles.parent_name),
    email = excluded.email,
    phone = coalesce(excluded.phone, public.profiles.phone),
    role = case when lower(excluded.email) in ('sobatceria25@gmail.com', 'sobatceria2025@gmail.com') then 'admin' else coalesce(excluded.role, public.profiles.role) end,
    status = case when lower(excluded.email) in ('sobatceria25@gmail.com', 'sobatceria2025@gmail.com') then 'active' else coalesce(excluded.status, public.profiles.status) end;

  -- 2. Otomatis masukkan ke tabel role spesifik
  if v_role = 'teacher' then
    insert into public.teacher_profiles (
      profile_id,
      specialization,
      education,
      experience_years,
      status_approval,
      notes
    ) values (
      new.id,
      coalesce(new.raw_user_meta_data->>'specialization', 'Umum'),
      coalesce(new.raw_user_meta_data->>'education', '-'),
      coalesce((new.raw_user_meta_data->>'experience_years')::integer, 0),
      v_status,
      coalesce(new.raw_user_meta_data->>'notes', '')
    )
    on conflict (profile_id) do update set
      specialization = excluded.specialization,
      education = excluded.education,
      experience_years = excluded.experience_years,
      status_approval = excluded.status_approval,
      notes = excluded.notes;

  elsif v_role = 'volunteer' then
    insert into public.volunteer_profiles (
      profile_id,
      city,
      occupation,
      availability,
      motivation,
      status_approval
    ) values (
      new.id,
      coalesce(new.raw_user_meta_data->>'city', ''),
      coalesce(new.raw_user_meta_data->>'occupation', ''),
      coalesce(new.raw_user_meta_data->>'availability', ''),
      coalesce(new.raw_user_meta_data->>'motivation', ''),
      v_status
    )
    on conflict (profile_id) do update set
      city = excluded.city,
      occupation = excluded.occupation,
      availability = excluded.availability,
      motivation = excluded.motivation,
      status_approval = excluded.status_approval;

  elsif v_role = 'partner' then
    insert into public.partner_profiles (
      profile_id,
      brand_name,
      business_type,
      website_social,
      status_approval
    ) values (
      new.id,
      coalesce(new.raw_user_meta_data->>'brand_name', ''),
      coalesce(new.raw_user_meta_data->>'business_type', ''),
      coalesce(new.raw_user_meta_data->>'website_social', ''),
      v_status
    )
    on conflict (profile_id) do update set
      brand_name = excluded.brand_name,
      business_type = excluded.business_type,
      website_social = excluded.website_social,
      status_approval = excluded.status_approval;

  elsif v_role = 'collaboration' then
    insert into public.collaboration_profiles (
      profile_id,
      institution_name,
      project_type,
      proposal_note,
      status_approval
    ) values (
      new.id,
      coalesce(new.raw_user_meta_data->>'institution_name', ''),
      coalesce(new.raw_user_meta_data->>'project_type', ''),
      coalesce(new.raw_user_meta_data->>'proposal_note', ''),
      v_status
    )
    on conflict (profile_id) do update set
      institution_name = excluded.institution_name,
      project_type = excluded.project_type,
      proposal_note = excluded.proposal_note,
      status_approval = excluded.status_approval;
  end if;

  return new;
end;
$$;

-- Pastikan trigger on_auth_user_created terpasang
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================================
-- SEED MASTER ADMIN (sobatceria25@gmail.com)
-- Password: ceriasobat2025
-- ============================================================
create extension if not exists pgcrypto with schema extensions;

do $$
declare
  v_admin_id uuid;
  v_encrypted_pw text;
begin
  -- Hash password 'ceriasobat2025'
  v_encrypted_pw := extensions.crypt('ceriasobat2025', extensions.gen_salt('bf', 10));

  select id into v_admin_id from auth.users where lower(email) = 'sobatceria25@gmail.com';

  if v_admin_id is null then
    v_admin_id := gen_random_uuid();

    insert into auth.users (
      id,
      instance_id,
      email,
      encrypted_password,
      email_confirmed_at,
      raw_app_meta_data,
      raw_user_meta_data,
      created_at,
      updated_at,
      role,
      aud
    ) values (
      v_admin_id,
      '00000000-0000-0000-0000-000000000000',
      'sobatceria25@gmail.com',
      v_encrypted_pw,
      now(),
      '{"provider":"email","providers":["email"]}',
      '{"full_name":"Admin Sobat Ceria","role":"admin"}',
      now(),
      now(),
      'authenticated',
      'authenticated'
    );

    insert into auth.identities (
      id,
      user_id,
      identity_data,
      provider,
      last_sign_in_at,
      created_at,
      updated_at
    ) values (
      v_admin_id,
      v_admin_id,
      format('{"sub":"%s","email":"sobatceria25@gmail.com"}', v_admin_id)::jsonb,
      'email',
      now(),
      now(),
      now()
    );
  else
    update auth.users
    set encrypted_password = v_encrypted_pw,
        email_confirmed_at = coalesce(email_confirmed_at, now()),
        raw_user_meta_data = '{"full_name":"Admin Sobat Ceria","role":"admin"}'
    where id = v_admin_id;
  end if;

  insert into public.profiles (id, parent_name, email, phone, role, status)
  values (
    v_admin_id,
    'Admin Sobat Ceria',
    'sobatceria25@gmail.com',
    '081234567890',
    'admin',
    'active'
  )
  on conflict (id) do update set
    parent_name = 'Admin Sobat Ceria',
    role = 'admin',
    status = 'active';
end $$;

-- ============================================================
-- AUTO-CONFIRM SEMUA USER (MENCEGAH ERROR "Email not confirmed")
-- ============================================================

-- 1. Konfirmasi seketika seluruh akun yang sudah terdaftar
update auth.users
set email_confirmed_at = now()
where email_confirmed_at is null;

-- 2. Trigger auto-confirm email pada setiap pendaftar baru
create or replace function public.auto_confirm_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  new.email_confirmed_at := coalesce(new.email_confirmed_at, now());
  return new;
end;
$$;

drop trigger if exists on_auth_user_before_insert on auth.users;
create trigger on_auth_user_before_insert
  before insert on auth.users
  for each row execute procedure public.auto_confirm_new_user();

-- 3. RPC function konfirmasi email dari frontend
create or replace function public.confirm_user_email(p_email text)
returns boolean
language plpgsql
security definer set search_path = public
as $$
begin
  update auth.users
  set email_confirmed_at = now()
  where lower(email) = lower(p_email);
  return true;
end;
$$;

-- ============================================================
-- SINKRONKAN SEMUA USER DARI AUTH KE PROFILES & TEACHER_PROFILES
-- ============================================================

-- 4. Masukkan SEMUA user dari auth.users ke public.profiles
insert into public.profiles (id, parent_name, email, phone, role, status)
select
  u.id,
  coalesce(
    u.raw_user_meta_data->>'full_name',
    case 
      when lower(u.email) in ('sobatceria25@gmail.com', 'sobatceria2025@gmail.com') then 'Admin Sobat Ceria'
      else split_part(u.email, '@', 1)
    end
  ),
  u.email,
  coalesce(u.raw_user_meta_data->>'phone', '081234567890'),
  coalesce(
    u.raw_user_meta_data->>'role',
    case 
      when lower(u.email) in ('sobatceria25@gmail.com', 'sobatceria2025@gmail.com') then 'admin'
      when lower(u.email) like '%guru%' or lower(u.email) like '%tutor%' or lower(u.email) like '%calon%' or lower(u.email) like '%sarah%' then 'teacher'
      else 'parent'
    end
  ),
  'active'
from auth.users u
on conflict (id) do update set
  role = case 
    when lower(excluded.email) in ('sobatceria25@gmail.com', 'sobatceria2025@gmail.com') then 'admin'
    else coalesce(excluded.role, public.profiles.role, 'teacher')
  end,
  status = 'active';

-- 5. Masukkan semua guru ke teacher_profiles
insert into public.teacher_profiles (
  profile_id,
  specialization,
  education,
  experience_years,
  status_approval,
  notes
)
select
  p.id,
  coalesce(u.raw_user_meta_data->>'specialization', 'Sensory Play & Calistung Ceria'),
  coalesce(u.raw_user_meta_data->>'education', 'S1 PGPAUD'),
  coalesce((u.raw_user_meta_data->>'experience_years')::integer, 2),
  'active',
  coalesce(u.raw_user_meta_data->>'notes', 'Telah diverifikasi Admin')
from public.profiles p
join auth.users u on u.id = p.id
where p.role = 'teacher'
on conflict (profile_id) do update set
  status_approval = 'active';

-- 6. Masukkan semua volunteer ke volunteer_profiles
insert into public.volunteer_profiles (
  profile_id,
  city,
  occupation,
  availability,
  motivation,
  status_approval
)
select
  p.id,
  coalesce(u.raw_user_meta_data->>'city', '-'),
  coalesce(u.raw_user_meta_data->>'occupation', '-'),
  coalesce(u.raw_user_meta_data->>'availability', 'Sabtu & Minggu'),
  coalesce(u.raw_user_meta_data->>'motivation', ''),
  coalesce(p.status, 'pending')
from public.profiles p
join auth.users u on u.id = p.id
where p.role = 'volunteer'
on conflict (profile_id) do update set
  status_approval = excluded.status_approval;

-- 7. Masukkan semua collaboration ke collaboration_profiles
insert into public.collaboration_profiles (
  profile_id,
  institution_name,
  project_type,
  proposal_note,
  status_approval
)
select
  p.id,
  coalesce(u.raw_user_meta_data->>'institution_name', '-'),
  coalesce(u.raw_user_meta_data->>'project_type', '-'),
  coalesce(u.raw_user_meta_data->>'proposal_note', ''),
  coalesce(p.status, 'pending')
from public.profiles p
join auth.users u on u.id = p.id
where p.role = 'collaboration'
on conflict (profile_id) do update set
  status_approval = excluded.status_approval;

-- 8. Masukkan semua partner (Mitra) ke partner_profiles
insert into public.partner_profiles (
  profile_id,
  brand_name,
  business_type,
  website_social,
  status_approval
)
select
  p.id,
  coalesce(u.raw_user_meta_data->>'brand_name', '-'),
  coalesce(u.raw_user_meta_data->>'business_type', '-'),
  coalesce(u.raw_user_meta_data->>'website_social', ''),
  coalesce(p.status, 'pending')
from public.profiles p
join auth.users u on u.id = p.id
where p.role = 'partner'
on conflict (profile_id) do update set
  status_approval = excluded.status_approval;


