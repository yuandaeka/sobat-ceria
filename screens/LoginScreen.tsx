import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, Platform, ActivityIndicator, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { UserProfile } from '../types';
import { supabase } from '../lib/supabase';
import { signInWithGoogle } from '../lib/auth';
import { fetchUserProfile, upsertProfile, addChild } from '../lib/profile';

interface LoginScreenProps {
  onLogin: (user: UserProfile) => void;
}

export default function LoginScreen({ onLogin }: LoginScreenProps) {
  const [parentName, setParentName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [childName, setChildName] = useState<string>('');
  const [childAge, setChildAge] = useState<string>('');
  const [specialNeeds, setSpecialNeeds] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [mode, setMode] = useState<'register' | 'login'>('register');

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const session = await signInWithGoogle();

      // Web: redirect penuh ke Google terjadi — session akan ditangani oleh App.tsx
      // setelah kembali (detectSessionInUrl + onAuthStateChange). Tidak perlu lanjut di sini.
      if (Platform.OS === 'web') {
        return;
      }

      if (!session?.user) throw new Error('Session tidak ditemukan.');
      const { profile } = await fetchUserProfile(session.user.id);
      onLogin(profile);
    } catch (error: any) {
      alertMessage('Login Google Gagal', error?.message || 'Terjadi kesalahan saat login.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (mode === 'login') {
      return handleLogin();
    }
    if (!parentName.trim() || !email.trim() || !phone.trim() || !password.trim()) {
      alertMessage('Form Belum Lengkap', 'Harap isi Nama, Email, Password, dan No WhatsApp Orang Tua!');
      return;
    }

    setLoading(true);
    try {
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: email.trim(),
        password: password.trim(),
        options: {
          data: { full_name: parentName.trim() },
        },
      });

      if (signUpError) throw signUpError;
      if (!signUpData.session?.user) {
        alertMessage('Cek Email Anda', 'Pendaftaran berhasil. Silakan verifikasi email untuk masuk.');
        setLoading(false);
        return;
      }

      const userId = signUpData.session.user.id;
      await upsertProfile(userId, { parentName: parentName.trim(), email: email.trim(), phone: phone.trim() });

      const ageNumber = parseInt(childAge.trim()) || 4;
      if (childName.trim()) {
        await addChild(userId, {
          name: childName.trim(),
          age: ageNumber,
          specialNeeds: specialNeeds.trim() || undefined,
        });
      }

      const { profile } = await fetchUserProfile(userId);
      onLogin(profile);
    } catch (error: any) {
      alertMessage('Pendaftaran Gagal', error?.message || 'Terjadi kesalahan. Coba lagi nanti.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      alertMessage('Form Belum Lengkap', 'Harap isi Email dan Password!');
      return;
    }

    setLoading(true);
    try {
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim(),
      });
      if (signInError) throw signInError;
      if (!signInData.user) throw new Error('User tidak ditemukan.');

      const { profile } = await fetchUserProfile(signInData.user.id);
      onLogin(profile);
    } catch (error: any) {
      alertMessage('Login Gagal', error?.message || 'Email atau password salah.');
    } finally {
      setLoading(false);
    }
  };

  const alertMessage = (title: string, message: string) => {
    if (Platform.OS === 'web') {
      window.alert(`${title}: ${message}`);
    } else {
      alert(`${title}\n${message}`);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }} className="bg-[#FAF6F0] justify-center">
      <ScrollView contentContainerStyle={{ paddingVertical: 30 }} className="p-4 md:p-8 max-w-md mx-auto w-full" showsVerticalScrollIndicator={false}>
        <View className="items-center mb-6">
          <View className="w-16 h-16 rounded-full overflow-hidden bg-white border-2 border-[#D82B5A]/20 shadow-md items-center justify-center p-1 mb-3">
            <Image
              source={require('../assets/sobatceria.png')}
              style={{ width: '100%', height: '100%', borderRadius: 999 }}
              resizeMode="contain"
            />
          </View>
          <Text className="text-2xl font-black text-[#162E5C] tracking-widest text-center">SOBAT CERIA</Text>
          <Text className="text-xs font-semibold text-gray-500 text-center mt-1">
            Program Fun Learning & Stimulasi Tumbuh Kembang
          </Text>
        </View>

        <View className="bg-white rounded-[2.5rem] p-6 md:p-8 border border-gray-100 shadow-md">
          <Text className="text-base font-extrabold text-[#162E5C] mb-4 text-center">Pendaftaran Akun Ceria</Text>

          {/* Google Login Button */}
          <TouchableOpacity
            className="bg-white border-2 border-gray-200 rounded-2xl py-3 flex-row items-center justify-center gap-2.5 mb-5 shadow-sm hover:bg-gray-50 transition-transform active:scale-95"
            onPress={handleGoogleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#D82B5A" />
            ) : (
              <>
                <View className="w-5 h-5 items-center justify-center">
                  <Image
                    source={{ uri: 'https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg' }}
                    style={{ width: 18, height: 18 }}
                    resizeMode="contain"
                  />
                </View>
                <Text className="text-xs font-extrabold text-[#162E5C]">Lanjutkan dengan Google</Text>
              </>
            )}
          </TouchableOpacity>

          <View className="flex-row items-center gap-3 mb-5">
            <View className="flex-1 h-px bg-gray-200" />
            <Text className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">atau daftar manual</Text>
            <View className="flex-1 h-px bg-gray-200" />
          </View>

          {/* Form input fields */}
          <Text className="text-[10px] font-extrabold text-[#162E5C] mb-1 uppercase tracking-wider">Nama Lengkap Orang Tua</Text>
          <TextInput
            className="bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-xs text-[#162E5C] mb-3.5 font-medium"
            placeholder="e.g. Bunda Dinda"
            placeholderTextColor="#9CA3AF"
            value={parentName}
            onChangeText={setParentName}
          />

          <Text className="text-[10px] font-extrabold text-[#162E5C] mb-1 uppercase tracking-wider">Email</Text>
          <TextInput
            className="bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-xs text-[#162E5C] mb-3.5 font-medium"
            placeholder="dinda@sobatceria.id"
            placeholderTextColor="#9CA3AF"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />

          <Text className="text-[10px] font-extrabold text-[#162E5C] mb-1 uppercase tracking-wider">Nomor WhatsApp</Text>
          <TextInput
            className="bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-xs text-[#162E5C] mb-3.5 font-medium"
            placeholder="e.g. 085876332598"
            placeholderTextColor="#9CA3AF"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
          />

          <Text className="text-[10px] font-extrabold text-[#162E5C] mb-1 uppercase tracking-wider">Password</Text>
          <TextInput
            className="bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-xs text-[#162E5C] mb-3.5 font-medium"
            placeholder={mode === 'register' ? 'Buat password (min. 6 karakter)' : 'Masukkan password'}
            placeholderTextColor="#9CA3AF"
            secureTextEntry
            autoCapitalize="none"
            value={password}
            onChangeText={setPassword}
          />

          {mode === 'register' && (
            <>
          {/* Child details row */}
          <View className="flex-row gap-3 mb-3.5">
            <View className="flex-[2]">
              <Text className="text-[10px] font-extrabold text-[#162E5C] mb-1 uppercase tracking-wider">Nama Anak</Text>
              <TextInput
                className="bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-xs text-[#162E5C] font-medium"
                placeholder="Arka"
                placeholderTextColor="#9CA3AF"
                value={childName}
                onChangeText={setChildName}
              />
            </View>
            <View className="flex-1">
              <Text className="text-[10px] font-extrabold text-[#162E5C] mb-1 uppercase tracking-wider text-center">Usia (Thn)</Text>
              <TextInput
                className="bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-xs text-[#162E5C] text-center font-medium"
                placeholder="4"
                placeholderTextColor="#9CA3AF"
                keyboardType="numeric"
                value={childAge}
                onChangeText={setChildAge}
              />
            </View>
          </View>

          <Text className="text-[10px] font-extrabold text-[#162E5C] mb-1 uppercase tracking-wider">
            Kebutuhan Khusus / ABK <Text className="text-gray-400 font-medium">(Opsional)</Text>
          </Text>
          <TextInput
            className="bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-xs text-[#162E5C] mb-5 font-medium"
            placeholder="e.g. Speech Delay / ADHD / Kosong"
            placeholderTextColor="#9CA3AF"
            value={specialNeeds}
            onChangeText={setSpecialNeeds}
          />
            </>
          )}

          {/* Submit Button */}
          <TouchableOpacity
            className="bg-[#D82B5A] py-3.5 rounded-full items-center shadow-md hover:bg-[#B01E49] transition-transform active:scale-95 flex-row justify-center gap-2"
            onPress={handleRegister}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text className="text-white text-xs font-extrabold">
                {mode === 'register' ? 'Masuk ke Platform Ceria' : 'Masuk dengan Email'}
              </Text>
            )}
          </TouchableOpacity>

          {/* Toggle Login / Register */}
          <TouchableOpacity
            className="items-center mt-4"
            onPress={() => setMode(mode === 'register' ? 'login' : 'register')}
          >
            <Text className="text-[11px] font-semibold text-[#162E5C]">
              {mode === 'register' ? 'Sudah punya akun?' : 'Belum punya akun?'}{' '}
              <Text className="text-[#D82B5A] font-extrabold">
                {mode === 'register' ? 'Masuk di sini' : 'Daftar sekarang'}
              </Text>
            </Text>
          </TouchableOpacity>
        </View>

        <Text className="text-[10px] text-gray-400 mt-5 text-center leading-relaxed font-medium">
          Lab Tumbuh Kembang FKIP UMS Lantai 2 • Jl. A. Yani Tromol Pos 1 Pabelan, Sukoharjo
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
