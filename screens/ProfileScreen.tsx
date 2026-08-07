import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Platform, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { UserProfile } from '../types';
import LoginScreen from './LoginScreen';
import { signOut } from '../lib/auth';

interface ProfileScreenProps {
  user: UserProfile | null;
  onLogout: () => void;
  onLogin?: (user: UserProfile) => void;
}

export default function ProfileScreen({ user, onLogout, onLogin }: ProfileScreenProps) {
  if (!user) {
    return <LoginScreen onLogin={onLogin || (() => {})} />;
  }

  const child = user?.children?.[0] || { name: 'Arka', age: 4, specialNeeds: '' };

  const handleLogout = async () => {
    await signOut();
    onLogout();
  };

  const handleOpenDrive = () => {
    if (Platform.OS === 'web') {
      window.open('https://www.instagram.com/sobatceria__?igsh=ZzFmMW5jcXZ6ampp', '_blank');
    } else {
      Linking.openURL('https://www.instagram.com/sobatceria__?igsh=ZzFmMW5jcXZ6ampp');
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }} className="bg-[#FAF6F0]">
      <ScrollView contentContainerStyle={{ paddingBottom: 110 }} className="p-4 md:p-8 max-w-5xl mx-auto w-full" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-xs mb-6">
          <View className="flex-row items-center gap-2 mb-1">
            <View className="w-2.5 h-2.5 rounded-full bg-[#D82B5A]" />
            <Text className="text-lg md:text-xl font-extrabold text-[#162E5C]">Profil Pengguna & Pendampingan</Text>
          </View>
          <Text className="text-xs text-gray-500 font-medium">
            Kelola data orang tua, informasi anak, dan dokumentasi aktivitas Sobat Ceria.
          </Text>
        </View>

        {/* Parent Details Card */}
        <View className="bg-white border border-gray-100 shadow-xs rounded-[2.5rem] p-6 mb-5 card-hover-effect">
          <View className="flex-row items-center gap-3 mb-4 border-b border-gray-100 pb-3">
            <View className="w-10 h-10 rounded-2xl bg-[#D82B5A]/10 items-center justify-center border border-[#D82B5A]/20">
              <Feather name="user" size={18} color="#D82B5A" />
            </View>
            <Text className="text-sm font-extrabold text-[#162E5C]">Informasi Orang Tua</Text>
          </View>
          
          <View className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <View>
              <Text className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">Nama Lengkap</Text>
              <Text className="text-xs font-black text-[#162E5C] mt-0.5">{user?.parentName || 'Bunda Dinda'}</Text>
            </View>

            <View>
              <Text className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">Email Terdaftar</Text>
              <Text className="text-xs font-bold text-[#162E5C] mt-0.5">{user?.email || 'dinda@sobatceria.id'}</Text>
            </View>

            <View>
              <Text className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">No. WhatsApp</Text>
              <Text className="text-xs font-bold text-[#162E5C] mt-0.5">{user?.phone || '+62 858-7633-2598'}</Text>
            </View>
          </View>
        </View>

        {/* Child Details Card */}
        <View className="bg-white border border-gray-100 shadow-xs rounded-[2.5rem] p-6 mb-5 card-hover-effect">
          <View className="flex-row items-center gap-3 mb-4 border-b border-gray-100 pb-3">
            <View className="w-10 h-10 rounded-2xl bg-[#2DA9E9]/10 items-center justify-center border border-[#2DA9E9]/20">
              <Feather name="smile" size={18} color="#2DA9E9" />
            </View>
            <Text className="text-sm font-extrabold text-[#162E5C]">Data Pendampingan Anak</Text>
          </View>
          
          <View className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <View>
              <Text className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">Nama Anak</Text>
              <Text className="text-xs font-black text-[#162E5C] mt-0.5">{child.name}</Text>
            </View>

            <View>
              <Text className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">Usia Anak</Text>
              <Text className="text-xs font-bold text-[#162E5C] mt-0.5">{child.age} Tahun (Jenjang Usia 2–7 Thn)</Text>
            </View>

            <View>
              <Text className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">Kebutuhan Khusus / ABK</Text>
              <Text className={`text-xs font-extrabold mt-0.5 ${child.specialNeeds ? 'text-[#F77712]' : 'text-[#30B864]'}`}>
                {child.specialNeeds || 'Anak Tipikal (Inklusif Welcome)'}
              </Text>
            </View>
          </View>
        </View>

        {/* Documentation Media Vault Card */}
        <View className="bg-[#162E5C] border border-[#162E5C] shadow-md rounded-[2.5rem] p-6 md:p-8 mb-6 text-white card-solid-hover">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-base font-extrabold text-white">Vault Dokumentasi Activity</Text>
            <View className="w-10 h-10 bg-white/10 rounded-2xl items-center justify-center border border-white/20">
              <Feather name="image" size={18} color="#FFFFFF" />
            </View>
          </View>
          <Text className="text-xs text-gray-300 leading-relaxed font-medium mb-4">
            Lihat rekaman momen belajar sambil bermain si kecil selama mengikuti kelas stimulasi Sobat Ceria di Instagram & Drive official kami.
          </Text>
          <TouchableOpacity 
            className="bg-[#D82B5A] py-3 rounded-full items-center shadow-md hover:bg-[#B01E49] transition-transform active:scale-95 flex-row justify-center gap-2"
            onPress={handleOpenDrive}
          >
            <Feather name="instagram" size={16} color="#FFFFFF" />
            <Text className="text-white text-xs font-extrabold">Buka Dokumentasi Official</Text>
          </TouchableOpacity>
        </View>

        {/* Log Out Button */}
        <TouchableOpacity 
          className="bg-rose-50 border border-rose-200 py-3.5 rounded-full items-center flex-row justify-center gap-2 transition-transform active:scale-98"
          onPress={handleLogout}
        >
          <Feather name="log-out" size={16} color="#D82B5A" />
          <Text className="text-[#D82B5A] text-xs font-extrabold">Keluar dari Akun</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
