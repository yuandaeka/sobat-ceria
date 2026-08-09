import { supabase } from './supabase';
import { UserProfile } from '../types';

const EDGE_FUNCTION = 'sync-to-sheets';

// Kirim data profil/login ke Google Sheet (tidak memblokir bila gagal)
export async function syncProfileToSheet(user: UserProfile) {
  const child = user?.children?.[0];
  try {
    const { data: sessionData } = await supabase.auth.getSession();
    const token = sessionData.session?.access_token;

    await supabase.functions.invoke(EDGE_FUNCTION, {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      body: {
        type: 'profile',
        parent_name: user.parentName,
        email: user.email,
        phone: user.phone,
        child_name: child?.name || '',
        child_age: child?.age || '',
        special_needs: child?.specialNeeds || '',
      },
    });
  } catch {
    // sinkronisasi ke sheet bersifat opsional — abaikan jika gagal
  }
}

// Kirim data order/pembayaran ke Google Sheet
export async function syncOrderToSheet(input: {
  courseTitle: string;
  courseCategory: string;
  childName: string;
  whatsapp: string;
  voucherCode: string | null;
  discount: number;
  totalAmount: number;
  status?: string;
}) {
  try {
    const { data: sessionData } = await supabase.auth.getSession();
    const token = sessionData.session?.access_token;

    await supabase.functions.invoke(EDGE_FUNCTION, {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      body: {
        type: 'order',
        course_title: input.courseTitle,
        course_category: input.courseCategory,
        child_name: input.childName,
        whatsapp: input.whatsapp,
        voucher_code: input.voucherCode,
        discount: input.discount,
        total_amount: input.totalAmount,
        status: input.status || 'paid',
      },
    });
  } catch {
    // sinkronisasi ke sheet bersifat opsional — abaikan jika gagal
  }
}
