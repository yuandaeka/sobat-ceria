-- ============================================================
-- SOBAT CERIA - Seed Data (Jalankan SETELAH migration 0001)
-- ============================================================

-- COURSES (8 Program Kelas Resmi)
insert into public.courses (title, category, age_range, price, seats, image, description, facilitator) values
('Mini Stimulation Class', 'Mini Stimulation', '2-3 Thn', 59000, 12, 'https://images.unsplash.com/photo-1596464716127-f2a82984de30?w=600', 'Sensory motor stimulation, melatih fokus & pemecahan masalah sederhana berbasis latihan fisik.', 'Bunda Sarah, M.Psi'),
('Communication Class', 'Communication', '2-4 Thn', 65000, 4, 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600', 'Interaksi teman sebaya untuk mengatasi speech delay dan melatih kepercayaan diri anak dalam berkomunikasi.', 'Bunda Sarah, M.Psi'),
('Seminar Parenting', 'Parenting', 'Ortu', 49000, 25, 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=600', 'Wadah edukasi interaktif untuk orang tua mengenai stimulasi golden age, emosi anak, & pencegahan kecanduan gadget.', 'Dr. Anita, Sp.A & Tim Psikolog'),
('Art and Craft Class', 'Art & Craft', '2-5 Thn', 79000, 8, 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600', 'Kriya tangan ramah anak, eksplorasi media warna, & gunting tempel untuk mengasah kreativitas dan motorik halus.', 'Kak Rian, S.Sn'),
('Science Class', 'Science Class', '3-7 Thn', 69000, 15, 'https://images.unsplash.com/photo-1530210124550-912dc1381cb8?w=600', 'Eksperimen sains aman dan menyenangkan untuk memicu rasa ingin tahu alami serta berpikir kritis si kecil.', 'Kak Rian, S.Sn'),
('Pottery Class', 'Pottery Class', '3-7 Thn', 75000, 6, 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=600', 'Pembentukan media tanah liat alami untuk melatih kesabaran, koordinasi jemari tangan, serta imajinasi spasial.', 'Kak Rian, S.Sn'),
('Cooking Class', 'Cooking Class', '3-7 Thn', 85000, 10, 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=600', 'Kreasi makanan sehat sederhana untuk melatih kemandirian, pengenalan tekstur bahan, & kebersihan anak.', 'Bunda Sarah, M.Psi'),
('Sensory & Movement Class', 'Sensory Play', '2-6 Thn', 69000, 12, 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600', 'Permainan fisik aktif, rintangan motorik kasar, serta stimulasi taktil untuk perkembangan olah tubuh anak.', 'Tim Fasilitator Sobat Ceria')
on conflict do nothing;

-- VOUCHERS (Kode Promo)
insert into public.vouchers (code, discount_amount, description) values
('REPEATORDER10', 10000, 'Diskon Rp 10.000 untuk semua kelas repeat order'),
('SOBATCERIA20', 20000, 'Diskon spesial Rp 20.000 untuk kelas tematik')
on conflict (code) do nothing;

-- WORKSHEETS (Materi printable)
insert into public.worksheets (title, age_group, category, pages) values
('Focus & Sensory Tracer Kit (PDF Printable)', 'Usia 2-3 Tahun', 'Mini Stimulation', 12),
('Clay Sculpting & Color Mix Guide', 'Usia 3-5 Tahun', 'Art & Craft', 18),
('STEAM Fun: Simple Science Experiment Worksheet', 'Usia 5-7 Tahun', 'Science Class', 15)
on conflict do nothing;

-- SCREENING RESULTS CONTOH (untuk anak default demo, profile_id diisi manual oleh admin)
-- insert into public.screening_results (child_id, category, status, score_date, psychologist_notes) values
-- (NULL, 'Motorik Kasar & Halus', 'Berkembang Sesuai Harapan', now(), 'Koordinasi jemari anak sangat baik saat memegang kuas melukis.'),
-- (NULL, 'Bahasa & Bicara (Speech)', 'Mulai Berkembang', now(), 'Anak dapat memahami instruksi dengan lancar. Disarankan latihan percakapan dua arah di rumah.');
