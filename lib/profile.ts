import { supabase } from './supabase';
import { UserProfile, UserRole, AccountStatus, AdminUserData } from '../types';

export interface ProfileWithChildren {
  profile: NonNullable<UserProfile>;
  children: { id: string; name: string; age: number; special_needs: string | null }[];
}

// Ambil profil + anak dari Supabase, buat default jika belum ada
export async function fetchUserProfile(userId: string): Promise<ProfileWithChildren> {
  // Ambil metadata user (nama dari Google/email) untuk isi parent_name jika kosong
  const { data: authData } = await supabase.auth.getUser();
  const metaName = authData.user?.user_metadata?.full_name || authData.user?.user_metadata?.name || '';

  let { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (profileError && profileError.code === 'PGRST116') {
    const { data: inserted, error: insertError } = await supabase
      .from('profiles')
      .insert({
        id: userId,
        parent_name: metaName,
        email: authData.user?.email || null,
        phone: null,
      })
      .select()
      .single();
    if (insertError) throw insertError;
    profile = inserted;
  } else if (profileError) {
    console.warn('Profile fetch warning (using auth fallback):', profileError.message);
    profile = {
      id: userId,
      parent_name: metaName || (authData.user?.email === 'sobatceria25@gmail.com' ? 'Admin Sobat Ceria' : ''),
      email: authData.user?.email || null,
      phone: authData.user?.phone || null,
      role: (authData.user?.user_metadata?.role as string) || (authData.user?.email === 'sobatceria25@gmail.com' ? 'admin' : null),
      status: (authData.user?.user_metadata?.status as string) || 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  } else if (profile && (!profile.parent_name || !profile.email) && (metaName || authData.user?.email)) {
    // Profil sudah ada tapi kosong (mis. user lama) → isi dari metadata Google
    const patch: { parent_name?: string; email?: string } = {};
    if (!profile.parent_name && metaName) patch.parent_name = metaName;
    if (!profile.email && authData.user?.email) patch.email = authData.user.email;
    await supabase.from('profiles').update(patch).eq('id', userId);
    profile = { ...profile, ...patch };
  }

  let childrenList: { id: string; name: string; age: number; special_needs: string | null }[] = [];
  try {
    const { data: children } = await supabase
      .from('children')
      .select('*')
      .eq('profile_id', userId);
    childrenList = children || [];
  } catch {
    childrenList = [];
  }

  // Auto-set Admin jika user menggunakan email owner/admin
  const userEmail = (profile?.email || authData.user?.email || '').toLowerCase();
  const isMasterAdmin =
    userEmail === 'sobatceria25@gmail.com' ||
    userEmail === 'sobatceria2025@gmail.com' ||
    userEmail === 'yuandaeka45@gmail.com';

  if (isMasterAdmin && (profile?.role !== 'admin' || profile?.status !== 'active')) {
    try {
      await supabase.from('profiles').update({ role: 'admin', status: 'active' }).eq('id', userId);
      if (profile) {
        profile.role = 'admin';
        profile.status = 'active';
      }
    } catch {
      // ignore
    }
  }

  const roleResult: UserRole | null = isMasterAdmin ? 'admin' : ((profile?.role as UserRole | null) ?? null);
  const statusResult: AccountStatus = isMasterAdmin ? 'active' : ((profile?.status as AccountStatus) || 'active');

  return {
    profile: {
      id: profile?.id || userId,
      parentName: profile?.parent_name || (isMasterAdmin ? 'Admin Sobat Ceria' : metaName),
      email: profile?.email || authData.user?.email || '',
      phone: profile?.phone || '',
      role: roleResult,
      status: statusResult,
      children: childrenList.map((c) => ({
        id: c.id,
        name: c.name,
        age: c.age,
        specialNeeds: c.special_needs || undefined,
      })),
    },
    children: childrenList,
  };
}

export async function upsertProfile(userId: string, data: Partial<{ parentName: string; email: string; phone: string }>) {
  const { error } = await supabase
    .from('profiles')
    .upsert(
      {
        id: userId,
        parent_name: data.parentName ?? '',
        email: data.email ?? null,
        phone: data.phone ?? null,
      },
      { onConflict: 'id' }
    );
  if (error) throw error;
}

export async function updateProfileRole(userId: string, role: UserRole) {
  const { error } = await supabase
    .from('profiles')
    .update({ role })
    .eq('id', userId);
  if (error) throw error;
}

export async function clearProfileRole(userId: string) {
  const { error } = await supabase
    .from('profiles')
    .update({ role: null })
    .eq('id', userId);
  if (error) throw error;
}

export async function addChild(userId: string, child: { name: string; age: number; specialNeeds?: string }) {
  const { error } = await supabase
    .from('children')
    .insert({
      profile_id: userId,
      name: child.name,
      age: child.age,
      special_needs: child.specialNeeds || null,
    });
  if (error) throw error;
}

export async function updateChild(
  childId: string,
  child: { name: string; age: number; specialNeeds?: string }
) {
  const { error } = await supabase
    .from('children')
    .update({
      name: child.name,
      age: child.age,
      special_needs: child.specialNeeds || null,
    })
    .eq('id', childId);
  if (error) throw error;
}

// -------------------------------------------------------------
// MULTI-ROLE REGISTRATION & APPROVAL HELPERS
// -------------------------------------------------------------

export interface RoleRegisterPayload {
  email: string;
  password: string;
  fullName: string;
  phone: string;
  role: 'volunteer' | 'teacher' | 'collaboration' | 'partner';
  roleData: Record<string, any>;
}

/**
 * Mendaftarkan akun khusus role non-parent (Volunteer, Teacher, Collaboration, Partner)
 * Akun langsung berstatus 'pending' dan menunggu review Admin.
 */
export async function registerRoleUser(payload: RoleRegisterPayload) {
  const { email, password, fullName, phone, role, roleData } = payload;

  // 1. SignUp ke Supabase Auth dengan metadata lengkap
  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email: email.trim(),
    password: password.trim(),
    options: {
      data: {
        full_name: fullName.trim(),
        phone: phone.trim(),
        role: role,
        status: 'pending',
        // Detail kualifikasi spesifik role disimpan di metadata auth
        specialization: roleData.specialization || '',
        education: roleData.education || '',
        experience_years: roleData.experienceYears || '0',
        notes: roleData.notes || '',
        city: roleData.city || '',
        occupation: roleData.occupation || '',
        availability: roleData.availability || '',
        motivation: roleData.motivation || '',
        brand_name: roleData.brandName || '',
        business_type: roleData.businessType || '',
        website_social: roleData.websiteSocial || '',
        institution_name: roleData.institutionName || '',
        project_type: roleData.projectType || '',
        proposal_note: roleData.proposalNote || '',
      },
    },
  });

  let userId = signUpData?.user?.id;

  if (signUpError) {
    const errorMsg = (signUpError.message || '').toLowerCase();
    if (errorMsg.includes('already') || errorMsg.includes('registered')) {
      throw new Error('Email ini sudah terdaftar. Silakan gunakan email lain atau hubungi Admin Sobat Ceria.');
    }

    // Jika terkena email rate limit dari Supabase (karena fitur "Confirm email" aktif)
    // Jangan gagalkan pendaftaran! Buat ID pelamar fallback agar tetap tersimpan & bisa di-review Admin
    if (errorMsg.includes('rate limit') || errorMsg.includes('rate_limit')) {
      userId = 'applicant-' + Math.random().toString(36).substring(2, 9) + '-' + Date.now();
      console.warn('Supabase email rate limit exceeded. Menggunakan applicant fallback ID:', userId);
    } else {
      throw signUpError;
    }
  }

  if (!userId) {
    throw new Error('Gagal membuat akun pengguna. Silakan periksa kembali email Anda.');
  }

  // 2. Pastikan record di profiles tersimpan dengan role & status pending (best-effort)
  try {
    await supabase
      .from('profiles')
      .upsert({
        id: userId,
        parent_name: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        role: role,
        status: 'pending',
      });
  } catch (err: any) {
    console.warn('Upsert profile notice:', err.message);
  }

  // 3. Masukkan ke tabel spesifik masing-masing role (best-effort)
  try {
    if (role === 'teacher') {
      await supabase.from('teacher_profiles').upsert({
        profile_id: userId,
        specialization: roleData.specialization || 'Umum',
        education: roleData.education || '',
        experience_years: parseInt(roleData.experienceYears || '0') || 0,
        status_approval: 'pending',
        notes: roleData.notes || '',
      });
    } else if (role === 'volunteer') {
      await supabase.from('volunteer_profiles').upsert({
        profile_id: userId,
        city: roleData.city || '',
        occupation: roleData.occupation || '',
        availability: roleData.availability || '',
        motivation: roleData.motivation || '',
        status_approval: 'pending',
      });
    } else if (role === 'partner') {
      await supabase.from('partner_profiles').upsert({
        profile_id: userId,
        brand_name: roleData.brandName || '',
        business_type: roleData.businessType || '',
        website_social: roleData.websiteSocial || '',
        status_approval: 'pending',
      });
    } else if (role === 'collaboration') {
      await supabase.from('collaboration_profiles').upsert({
        profile_id: userId,
        institution_name: roleData.institutionName || '',
        project_type: roleData.projectType || '',
        proposal_note: roleData.proposalNote || '',
        status_approval: 'pending',
      });
    }
  } catch (err: any) {
    console.warn(`Gagal menyimpan detail profil ${role}:`, err.message);
  }

  // 4. Simpan ke cache lokal browser (localStorage) agar Admin Dashboard langsung mendeteksi pendaftar
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const pendingKey = 'sc_pending_applicants';
      const existingStr = window.localStorage.getItem(pendingKey);
      const existingList = existingStr ? JSON.parse(existingStr) : [];
      const newApplicant = {
        id: userId,
        name: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        role: role,
        status: 'pending',
        createdAt: new Date().toISOString(),
        details: roleData,
      };
      // Hapus jika sudah ada ID yang sama lalu taruh paling depan
      const filtered = existingList.filter((item: any) => item.id !== userId && item.email !== email.trim());
      filtered.unshift(newApplicant);
      window.localStorage.setItem(pendingKey, JSON.stringify(filtered));
    }
  } catch {
    // ignore
  }

  return { userId, role, status: 'pending' as AccountStatus };
}

/**
 * Mengambil daftar seluruh user untuk Admin Dashboard
 * beserta status aktif / pending / rejected dan role pendukung.
 */
export async function fetchAdminUsersList(): Promise<AdminUserData[]> {
  // Ambil cache pendaftar lokal lebih dulu
  let localApplicants: AdminUserData[] = [];
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const stored = window.localStorage.getItem('sc_pending_applicants');
      if (stored) {
        localApplicants = JSON.parse(stored);
      }
    }
  } catch {
    localApplicants = [];
  }

  try {
    const { data: profiles, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Gagal memuat daftar profiles dari Supabase:', error.message);
      return localApplicants;
    }

    // Ambil data pendukung teacher_profiles untuk memperkaya detail pelamar
    let teacherMap = new Map<string, any>();
    try {
      const { data: teachers } = await supabase.from('teacher_profiles').select('*');
      if (teachers) {
        teachers.forEach((t) => teacherMap.set(t.profile_id, t));
      }
    } catch {
      // ignore
    }

    const liveList: AdminUserData[] = (profiles || []).map((p) => {
      let details: Record<string, any> | undefined = undefined;
      if (p.role === 'teacher' && teacherMap.has(p.id)) {
        const t = teacherMap.get(p.id);
        details = {
          specialization: t.specialization || 'Umum',
          education: t.education || '-',
          experienceYears: t.experience_years || 0,
          notes: t.notes || '-',
        };
      }

      return {
        id: p.id,
        name: p.parent_name || 'Tanpa Nama',
        email: p.email || '-',
        phone: p.phone || '-',
        role: (p.role as UserRole) || 'parent',
        status: (p.status as AccountStatus) || 'active',
        createdAt: p.created_at || new Date().toISOString(),
        details,
      };
    });

    // Gabungkan live list dari Supabase dengan data pendaftar baru dari local storage
    const liveIds = new Set(liveList.map((u) => u.id));
    const merged = [...liveList];
    for (const local of localApplicants) {
      if (!liveIds.has(local.id)) {
        merged.unshift(local);
      }
    }

    return merged;
  } catch (err: any) {
    console.warn('Gagal memuat daftar user admin dari Supabase:', err.message);
    return localApplicants;
  }
}

/**
 * Admin mengubah status approval user ('active' untuk setujui, 'rejected' untuk tolak)
 * Juga memastikan record user dan kualifikasinya tersimpan permanen di Supabase.
 */
export async function updateUserAccountStatus(
  userId: string,
  status: AccountStatus,
  role?: UserRole,
  fullData?: Partial<AdminUserData>
) {
  // 1. Jika ada email, coba auto-confirm email di Supabase Auth via RPC
  if (fullData?.email) {
    try {
      await (supabase.rpc as any)('confirm_user_email', { p_email: fullData.email });
    } catch {
      // ignore
    }
  }

  // 2. Simpan / perbarui tabel profiles di Supabase
  try {
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('id')
      .or(`id.eq.${userId},email.eq.${fullData?.email || ''}`)
      .maybeSingle();

    if (existingProfile) {
      await supabase
        .from('profiles')
        .update({ status, role: role || 'teacher' })
        .eq('id', existingProfile.id);
    } else if (fullData && fullData.email) {
      await supabase.from('profiles').insert({
        id: userId.startsWith('applicant-') ? undefined as any : userId,
        parent_name: fullData.name || 'Guru Sobat Ceria',
        email: fullData.email,
        phone: fullData.phone || null,
        role: role || 'teacher',
        status: status,
      });
    }
  } catch (err: any) {
    console.warn('Update profiles status notice:', err.message);
  }

  // 3. Simpan / perbarui status_approval di tabel kualifikasi spesifik (teacher, volunteer, dll.)
  try {
    if (role === 'teacher') {
      const details = fullData?.details || {};
      const { data: existingTeacher } = await supabase
        .from('teacher_profiles')
        .select('profile_id')
        .eq('profile_id', userId)
        .maybeSingle();

      if (existingTeacher) {
        await supabase
          .from('teacher_profiles')
          .update({ status_approval: status })
          .eq('profile_id', userId);
      } else {
        await supabase.from('teacher_profiles').upsert({
          profile_id: userId,
          specialization: details.specialization || 'Umum',
          education: details.education || '-',
          experience_years: parseInt(details.experienceYears || '1') || 1,
          status_approval: status,
          notes: details.notes || '',
        });
      }
    } else if (role === 'volunteer') {
      await supabase.from('volunteer_profiles').update({ status_approval: status }).eq('profile_id', userId);
    } else if (role === 'partner') {
      await supabase.from('partner_profiles').update({ status_approval: status }).eq('profile_id', userId);
    } else if (role === 'collaboration') {
      await supabase.from('collaboration_profiles').update({ status_approval: status }).eq('profile_id', userId);
    }
  } catch (err: any) {
    console.warn('Update role table notice:', err.message);
  }

  // 4. Update juga di localStorage
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const pendingKey = 'sc_pending_applicants';
      const stored = window.localStorage.getItem(pendingKey);
      if (stored) {
        const list: AdminUserData[] = JSON.parse(stored);
        const updated = list.map((item) => (item.id === userId || (fullData?.email && item.email === fullData.email) ? { ...item, status } : item));
        window.localStorage.setItem(pendingKey, JSON.stringify(updated));
      }
    }
  } catch {
    // ignore
  }
}

