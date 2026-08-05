// types/index.ts
// Custom TypeScript interfaces for SOBAT CERIA project

export interface Child {
  name: string;
  age: number;
  specialNeeds?: string; // e.g., "Speech Delay", "ADHD", or leave empty/undefined for typical children
}

export interface UserProfile {
  parentName: string;
  email: string;
  phone: string;
  children: Child[];
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
