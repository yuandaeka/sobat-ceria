import { Platform } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';
import { supabase } from './supabase';
import { Session } from '@supabase/supabase-js';

WebBrowser.maybeCompleteAuthSession();

// Web: gunakan env EXPO_PUBLIC_SITE_URL (opsional) atau origin halaman aktif.
// Native: pakai scheme sobatceria:// untuk callback.
const redirectTo =
  Platform.OS === 'web'
    ? (process.env.EXPO_PUBLIC_SITE_URL as string) || window.location.origin
    : AuthSession.makeRedirectUri();

export async function signInWithGoogle(): Promise<Session | null> {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo,
      skipBrowserRedirect: Platform.OS !== 'web',
    },
  });

  if (error) throw error;
  if (!data?.url) throw new Error('Terjadi kesalahan saat menyiapkan login Google.');

  // Web: supabase-js melakukan redirect penuh browser ke Google (skipBrowserRedirect false).
  // Jangan tunggu session di sini — setelah kembali, detectSessionInUrl + onAuthStateChange
  // di App.tsx yang akan memuat profil & masuk otomatis.
  if (Platform.OS === 'web') {
    return null;
  }

  // Native: buka browser OAuth dan tangkap callback session
  const authResponse = await WebBrowser.openAuthSessionAsync(data.url, redirectTo);

  if (authResponse.type !== 'success') {
    throw new Error('Login dibatalkan atau gagal.');
  }

  const url = new URL(authResponse.url);
  const code = url.searchParams.get('code');
  if (!code) throw new Error('Tidak dapat mengambil kode otorisasi.');

  const { data: exchangeData, error: exchangeError } =
    await supabase.auth.exchangeCodeForSession(code);

  if (exchangeError) throw exchangeError;
  return exchangeData.session as Session;
}

export async function signOut() {
  await supabase.auth.signOut();
}

export async function getCurrentUser() {
  const { data } = await supabase.auth.getUser();
  return data.user;
}
