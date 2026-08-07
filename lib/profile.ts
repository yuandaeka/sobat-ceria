import { supabase } from './supabase';
import { UserProfile } from '../types';

export interface ProfileWithChildren {
  profile: NonNullable<UserProfile>;
  children: { id: string; name: string; age: number; special_needs: string | null }[];
}

// Ambil profil + anak dari Supabase, buat default jika belum ada
export async function fetchUserProfile(userId: string): Promise<ProfileWithChildren> {
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
        parent_name: '',
        email: null,
        phone: null,
      })
      .select()
      .single();
    if (insertError) throw insertError;
    profile = inserted;
  } else if (profileError) {
    throw profileError;
  }

  const { data: children, error: childrenError } = await supabase
    .from('children')
    .select('*')
    .eq('profile_id', userId);

  if (childrenError) throw childrenError;

  return {
    profile: {
      parentName: profile?.parent_name || '',
      email: profile?.email || '',
      phone: profile?.phone || '',
      children: (children || []).map((c) => ({
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
    .update({
      parent_name: data.parentName ?? undefined,
      email: data.email ?? undefined,
      phone: data.phone ?? undefined,
    })
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
