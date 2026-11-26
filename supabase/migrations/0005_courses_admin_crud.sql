-- ============================================================
-- SOBAT CERIA - Migrasi Izin CRUD Tabel Courses untuk Admin
-- Jalankan di Supabase Dashboard > SQL Editor
-- ============================================================

alter table public.courses enable row level security;

drop policy if exists "courses_select_public" on public.courses;
create policy "courses_select_public" on public.courses
  for select using (true);

drop policy if exists "courses_insert_admin" on public.courses;
create policy "courses_insert_admin" on public.courses
  for insert with check (true);

drop policy if exists "courses_update_admin" on public.courses;
create policy "courses_update_admin" on public.courses
  for update using (true);

drop policy if exists "courses_delete_admin" on public.courses;
create policy "courses_delete_admin" on public.courses
  for delete using (true);
