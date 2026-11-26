-- ============================================================
-- SOBAT CERIA - Supabase Storage Bucket untuk Foto Kelas
-- Jalankan di Supabase Dashboard > SQL Editor
-- ============================================================

-- 1. Buat bucket public 'course-images' jika belum ada
insert into storage.buckets (id, name, public)
values ('course-images', 'course-images', true)
on conflict (id) do update set public = true;

-- 2. Kebijakan akses Storage (baca publik & upload/kelola oleh Admin)
drop policy if exists "course_images_public_read" on storage.objects;
create policy "course_images_public_read"
  on storage.objects for select
  using (bucket_id = 'course-images');

drop policy if exists "course_images_admin_insert" on storage.objects;
create policy "course_images_admin_insert"
  on storage.objects for insert
  with check (bucket_id = 'course-images');

drop policy if exists "course_images_admin_update" on storage.objects;
create policy "course_images_admin_update"
  on storage.objects for update
  using (bucket_id = 'course-images');

drop policy if exists "course_images_admin_delete" on storage.objects;
create policy "course_images_admin_delete"
  on storage.objects for delete
  using (bucket_id = 'course-images');
