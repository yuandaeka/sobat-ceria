// types/index.ts
// Custom TypeScript interfaces for SOBAT CERIA project

export interface Child {
  id?: string;           // id dari tabel children (untuk update/edit)
  name: string;
  age: number;
  specialNeeds?: string; // e.g., "Speech Delay", "ADHD", or leave empty/undefined for typical children
}

export type UserRole =
  | 'parent'
  | 'volunteer'
  | 'teacher'
  | 'collaboration'
  | 'partner'
  | 'admin';

export type AccountStatus = 'active' | 'pending' | 'rejected';

export interface UserProfile {
  id?: string;
  parentName: string;
  email: string;
  phone: string;
  children: Child[];
  role?: UserRole | null;
  status?: AccountStatus;
}

export interface TeacherProfileData {
  specialization: string;
  education?: string;
  experienceYears?: number;
  notes?: string;
}

export interface VolunteerProfileData {
  city?: string;
  occupation?: string;
  availability?: string;
  motivation?: string;
}

export interface PartnerProfileData {
  brandName: string;
  businessType: string;
  websiteSocial?: string;
}

export interface CollaborationProfileData {
  institutionName: string;
  projectType: string;
  proposalNote?: string;
}

export interface AdminUserData {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  status: AccountStatus;
  createdAt: string;
  details?: Record<string, any>;
}

export interface Course {
  id: string;
  title: string;
  category: string; // e.g., "Mini Stimulation", "Art & Craft", "Cooking", "Science Class", "Communication"
  ageRange: string;  // e.g., "2-3 Thn", "4-5 Thn", "5-6 Thn"
  price: number;
  seats: number;
  image: string;     // URL image representing the course activity
  description: string;
  facilitator?: string; // Name of the psychologist or facilitator
}

export interface Voucher {
  code: string;
  discountAmount: number;
  description: string;
}

export interface ScreeningResult {
  id: string;
  childName: string;
  category: string; // e.g., "Motorik", "Bahasa & Bicara", "Sosial Emosional"
  status: 'Belum Berkembang' | 'Mulai Berkembang' | 'Berkembang Sesuai Harapan';
  scoreDate: string;
  psychologistNotes: string;
}

export interface BookItem {
  id: string;
  title: string;
  author: string;
  category: string;
  ageRange?: string;
  rating: number;
  reviewsCount: number;
  pages: number;
  coverType: string; // e.g., "Hard Cover", "Soft Cover"
  language: string;  // e.g., "Indonesia", "English"
  price: number;
  image: string;
  description: string;
  isBestSeller?: boolean;
  isTrending?: boolean;
  ownerInfo?: {
    name: string;
    role: string;
    avatar: string;
    location?: string;
  };
}

