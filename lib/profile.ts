import { supabase } from './supabase';
import { UserProfile } from '../types';

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
    throw profileError;
  } else if (profile && (!profile.parent_name || !profile.email) && (metaName || authData.user?.email)) {
    // Profil sudah ada tapi kosong (mis. user lama) → isi dari metadata Google
    const patch: { parent_name?: string; email?: string } = {};
    if (!profile.parent_name && metaName) patch.parent_name = metaName;
    if (!profile.email && authData.user?.email) patch.email = authData.user.email;
    await supabase.from('profiles').update(patch).eq('id', userId);
    profile = { ...profile, ...patch };
  }

  const { data: children, error: childrenError } = await supabase
    .from('children')
    .select('*')
    .eq('profile_id', userId);

  if (childrenError) throw childrenError;

  return {
    profile: {
      parentName: profile?.parent_name || metaName,
      email: profile?.email || '',
      phone: profile?.phone || '',
      children: (children || []).map((c) => ({
        id: c.id,
        name: c.name,
        age: c.age,
        specialNeeds: c.special_needs || undefined,
      })),
    },
    children: children || [],
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
