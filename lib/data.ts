import { supabase } from './supabase';
import { Course, ScreeningResult } from '../types';

// ============ COURSES (Katalog Kelas) ============

export interface AdminCourseData {
  id: string;
  title: string;
  category: string;
  ageRange: string;
  price: number;
  seats: number;
  image: string;
  description: string;
  facilitator: string;
  isActive: boolean;
  createdAt: string;
}

export interface CoursePayload {
  title: string;
  category: string;
  ageRange: string;
  price: number;
  seats: number;
  image?: string;
  description?: string;
  facilitator?: string;
  isActive?: boolean;
}

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

export async function fetchAllCoursesAdmin(): Promise<AdminCourseData[]> {
  const { data, error } = await supabase
    .from('courses')
    .select('*')
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
    facilitator: c.facilitator || '',
    isActive: c.is_active,
    createdAt: c.created_at,
  }));
}

export async function createCourse(payload: CoursePayload): Promise<AdminCourseData> {
  const { data, error } = await supabase
    .from('courses')
    .insert({
      title: payload.title.trim(),
      category: payload.category.trim(),
      age_range: payload.ageRange.trim(),
      price: Number(payload.price) || 0,
      seats: Number(payload.seats) || 10,
      image: payload.image?.trim() || null,
      description: payload.description?.trim() || '',
      facilitator: payload.facilitator?.trim() || 'Tim Fasilitator Sobat Ceria',
      is_active: payload.isActive ?? true,
    })
    .select()
    .single();

  if (error) throw error;

  return {
    id: data.id,
    title: data.title,
    category: data.category,
    ageRange: data.age_range,
    price: data.price,
    seats: data.seats,
    image: data.image || '',
    description: data.description || '',
    facilitator: data.facilitator || '',
    isActive: data.is_active,
    createdAt: data.created_at,
  };
}

export async function updateCourse(id: string, payload: Partial<CoursePayload>): Promise<void> {
  const patch: {
    title?: string;
    category?: string;
    age_range?: string;
    price?: number;
    seats?: number;
    image?: string | null;
    description?: string | null;
    facilitator?: string | null;
    is_active?: boolean;
  } = {};
  if (payload.title !== undefined) patch.title = payload.title.trim();
  if (payload.category !== undefined) patch.category = payload.category.trim();
  if (payload.ageRange !== undefined) patch.age_range = payload.ageRange.trim();
  if (payload.price !== undefined) patch.price = Number(payload.price) || 0;
  if (payload.seats !== undefined) patch.seats = Number(payload.seats) || 10;
  if (payload.image !== undefined) patch.image = payload.image.trim() || null;
  if (payload.description !== undefined) patch.description = payload.description.trim();
  if (payload.facilitator !== undefined) patch.facilitator = payload.facilitator.trim();
  if (payload.isActive !== undefined) patch.is_active = payload.isActive;

  const { error } = await supabase.from('courses').update(patch).eq('id', id);
  if (error) throw error;
}

export async function deleteCourse(id: string): Promise<void> {
  const { error } = await supabase.from('courses').delete().eq('id', id);
  if (error) throw error;
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
