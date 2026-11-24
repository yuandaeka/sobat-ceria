-- ============================================================
-- SOBAT CERIA - Tambah kolom ROLE pada profiles
-- Mendukung pemilihan peran setelah login:
--   parent | volunteer | teacher | collaboration | partner | admin
-- ============================================================

alter table public.profiles
  add column if not exists role text;
