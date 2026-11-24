import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { UserProfile } from '../../types';

const RIWAYAT = [
  { tanggal: 'Sen, 22 Agu 2026', tugas: 'Pendamping Mini Stimulation', jam: '09.00 - 10.30', status: 'Hadir' },
  { tanggal: 'Rab, 17 Agu 2026', tugas: 'Pendamping Science', jam: '13.00 - 14.30', status: 'Hadir' },
  { tanggal: 'Jum, 15 Agu 2026', tugas: 'Dokumentasi Cooking', jam: '15.00 - 16.30', status: 'Hadir' },
];

export default function VolunteerAbsensiScreen({ user }: { user: UserProfile }) {
  const [checked, setChecked] = useState(false);

  return (
    <ScrollView className="flex-1 bg-[#FAF7F2]" contentContainerStyle={{ padding: 24, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
      <View className="mb-6">
        <Text className="text-xl font-extrabold text-[#132A5E]">Absensi Volunteer</Text>
        <Text className="text-xs text-gray-500 font-medium mt-0.5">Check-in kehadiran saat bertugas pendampingan</Text>
      </View>

      {/* Check-in Card */}
      <View className="rounded-2xl p-6 mb-6 relative overflow-hidden">
        <View className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(135deg, #132A5E 0%, #1E293B 100%)' } as any} />
        <View className="absolute -top-10 -right-6 w-40 h-40 rounded-full bg-white/5" />
        <View className="relative z-10">
          <Text className="text-white/70 text-[11px] font-bold uppercase tracking-wider mb-1">Tugas Hari Ini</Text>
          <Text className="text-xl font-extrabold text-white mb-1">Pendamping Science Class</Text>
          <Text className="text-white/80 text-xs">Rabu, 24 Agu 2026 • 13.00 - 14.30 WIB • Ruang STEAM</Text>

          <TouchableOpacity
            className={`mt-5 py-3 rounded-xl items-center justify-center flex-row gap-2 ${checked ? 'bg-emerald-500' : 'bg-[#C81E45]'} hover:opacity-90 transition`}
            onPress={() => {
              setChecked(true);
              if (Platform.OS === 'web') {
                window.alert('Absensi berhasil dicatat. Terima kasih!');
              } else {
                alert('Absensi berhasil dicatat. Terima kasih!');
              }
            }}
          >
            <Feather name={checked ? 'check-circle' : 'clipboard'} size={16} color="#FFFFFF" />
            <Text className="text-white text-sm font-bold">{checked ? 'Sudah Check-in' : 'Check-in Sekarang'}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Riwayat */}
      <Text className="text-sm font-extrabold text-[#132A5E] mb-3">Riwayat Absensi</Text>
      <View className="bg-white rounded-2xl border border-[#F1F5F9] shadow-sm overflow-hidden mb-6">
        {RIWAYAT.map((r, i) => (
          <View key={r.tanggal} className={`flex-row items-center gap-3.5 px-5 py-4 ${i < RIWAYAT.length - 1 ? 'border-b border-[#F1F5F9]' : ''}`}>
            <View className="w-10 h-10 rounded-full bg-emerald-50 items-center justify-center shrink-0">
              <Feather name="check" size={18} color="#30B864" />
            </View>
            <View className="flex-1">
              <Text className="text-xs font-extrabold text-[#1E293B]">{r.tugas}</Text>
              <Text className="text-[11px] text-gray-500 font-medium mt-0.5">{r.tanggal} • {r.jam}</Text>
            </View>
            <View className="bg-emerald-50 px-2.5 py-1 rounded-full">
              <Text className="text-[10px] font-bold text-emerald-600">{r.status}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Info */}
      <View className="bg-white rounded-2xl border border-[#F1F5F9] shadow-sm p-5 flex-row items-center gap-3.5">
        <View className="w-11 h-11 rounded-xl bg-[#2DA9E9]/10 items-center justify-center">
          <Feather name="info" size={19} color="#2DA9E9" />
        </View>
        <View className="flex-1">
          <Text className="text-xs font-extrabold text-[#1E293B]">Catatan absensi tercatat otomatis</Text>
          <Text className="text-[11px] text-gray-500 font-medium mt-0.5 leading-relaxed">
            Pastikan check-in sebelum sesi dimulai agar jam volunteer Anda terhitung.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}
