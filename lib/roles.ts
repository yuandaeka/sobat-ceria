import { UserRole } from '../types';

export interface RoleMeta {
  label: string;
  tagline: string;
  description: string;
  icon: string;
  color: string;
  bg: string;
}

export const ROLES: Record<UserRole, RoleMeta> = {
  parent: {
    label: 'Orang Tua',
    tagline: 'Dampingi tumbuh kembang si kecil',
    description: 'Pantau screening, daftar kelas, klaim voucher & unduh worksheet untuk buah hati.',
    icon: 'home',
    color: '#D82B5A',
    bg: 'bg-[#D82B5A]/10',
  },
  volunteer: {
    label: 'Volunteer',
    tagline: 'Relawan pendamping kelas',
    description: 'Kelola jadwal pendampingan, absensi, dan dokumentasi kegiatan relawan.',
    icon: 'users',
    color: '#2DA9E9',
    bg: 'bg-[#2DA9E9]/10',
  },
  teacher: {
    label: 'Guru / Tutor',
    tagline: 'Fasilitator & pendidik kelas',
    description: 'Kelola kelas ajar, presensi murid, input hasil screening STPPA & materi belajar.',
    icon: 'book-open',
    color: '#8B22C0',
    bg: 'bg-[#8B22C0]/10',
  },
  collaboration: {
    label: 'Kolaborasi',
    tagline: 'Kerja sama program & riset',
    description: 'Kelola proyek kolaborasi, dokumen kerja sama, dan koordinasi lintas tim.',
    icon: 'git-merge',
    color: '#30B864',
    bg: 'bg-[#30B864]/10',
  },
  partner: {
    label: 'Mitra',
    tagline: 'Kemitraan & referal bisnis',
    description: 'Pantau program kemitraan, prospek leads, komisi referal, dan dokumen mitra.',
    icon: 'briefcase',
    color: '#F77712',
    bg: 'bg-[#F77712]/10',
  },
  admin: {
    label: 'Admin',
    tagline: 'Kendali penuh platform',
    description: 'Kelola kelas, voucher, worksheet, verifikasi screening, user, dan laporan.',
    icon: 'shield',
    color: '#162E5C',
    bg: 'bg-[#162E5C]/10',
  },
};

export const ROLE_ORDER: UserRole[] = [
  'parent',
  'volunteer',
  'teacher',
  'collaboration',
  'partner',
  'admin',
];
