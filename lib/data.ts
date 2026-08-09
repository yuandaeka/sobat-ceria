import { supabase } from './supabase';
import { Course, ScreeningResult } from '../types';

// ============ COURSES (Katalog Kelas) ============

export async function fetchCourses(): Promise<Course[]> {
  const { data, error } = await supabase
    .from('courses')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: true });

  if (error) throw error;

  return (data || []).map((c) => ({
    id: c.id,
    title: c.title,
    category: c.category,
    ageRange: c.age_range,
    price: c.price,
    seats: c.seats,
    image: c.image || '',
    description: c.description || '',
    facilitator: c.facilitator || undefined,
  }));
}

// ============ SCREENING RESULTS ============

export async function fetchScreeningResults(childId?: string): Promise<ScreeningResult[]> {
  let query = supabase.from('screening_results').select('*').order('score_date', { ascending: false });
  if (childId) query = query.eq('child_id', childId);

  const { data, error } = await query;
  if (error) throw error;

  return (data || []).map((r) => ({
    id: r.id,
    childName: '',
    category: r.category,
    status: r.status as ScreeningResult['status'],
    scoreDate: new Date(r.score_date).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }),
    psychologistNotes: r.psychologist_notes || '',
  }));
}

// ============ WORKSHEETS ============

export interface WorksheetData {
  id: string;
  title: string;
  age_group: string;
  category: string;
  pages: number;
  file_url: string | null;
}

export async function fetchWorksheets(): Promise<WorksheetData[]> {
  const { data, error } = await supabase
    .from('worksheets')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data || [];
}

// ============ VOUCHERS ============

export interface VoucherData {
  id: string;
  code: string;
  discount_amount: number;
  description: string | null;
}

export async function fetchVouchers(): Promise<VoucherData[]> {
  const { data, error } = await supabase
    .from('vouchers')
    .select('*')
    .eq('is_active', true);

  if (error) throw error;
  return data || [];
}

// ============ ORDERS ============

export interface OrderData {
  id: string;
  course_id: string | null;
  child_name: string | null;
  whatsapp: string | null;
  voucher_code: string | null;
  discount: number;
  total_amount: number;
  status: string;
  created_at: string;
  courses?: { title: string | null; category: string | null; image: string | null } | null;
}

export async function fetchOrders(): Promise<OrderData[]> {
  const { data: authData } = await supabase.auth.getUser();
  if (!authData.user) return [];

  const { data, error } = await supabase
    .from('orders')
    .select('*, courses(title, category, image)')
    .eq('profile_id', authData.user.id)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data || []) as OrderData[];
}

export async function createOrder(input: {
  courseId: string;
  childName: string;
  whatsapp: string;
  voucherCode: string | null;
  discount: number;
  totalAmount: number;
}) {
  const { data: authData } = await supabase.auth.getUser();
  const { error } = await supabase.from('orders').insert({
    profile_id: authData.user?.id || null,
    course_id: input.courseId,
    child_name: input.childName,
    whatsapp: input.whatsapp,
    voucher_code: input.voucherCode,
    discount: input.discount,
    total_amount: input.totalAmount,
    status: 'paid',
  });
  if (error) throw error;
}
