import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { UserProfile } from '../../types';

const PENDING = [
  { anak: 'Arka', aspek: 'Bahasa & Bicara', status: 'Mulai Berkembang', pengisi: 'Kak Fatimah, S.Pd', tanggal: '24 Agu 2026' },
  { anak: 'Kirana', aspek: 'Motorik Kasar', status: 'Berkembang Sesuai Harapan', pengisi: 'Bunda Sarah, M.Psi', tanggal: '23 Agu 2026' },
  { anak: 'Dafa', aspek: 'Sosial-Emosi', status: 'Mulai Berkembang', pengisi: 'Kak Dina, S.Pd', tanggal: '22 Agu 2026' },
];

export default function AdminScreeningScreen({ user }: { user: UserProfile }) {
  return (
    <ScrollView className="flex-1 bg-[#FAF7F2]" contentContainerStyle={{ padding: 24, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
      <View className="mb-6">
        <Text className="text-xl font-extrabold text-[#132A5E]">Verifikasi Screening</Text>
        <Text className="text-xs text-gray-500 font-medium mt-0.5">Review hasil screening & catatan psikolog sebelum dipublikasikan</Text>
      </View>

      <View className="flex-row gap-3 mb-6" style={{ flexWrap: 'wrap' }}>
        <View className="flex-1 bg-white rounded-2xl border border-[#F1F5F9] shadow-sm p-4 items-center" style={{ minWidth: 130 }}>
          <Text className="text-xl font-black text-amber-600">3</Text>
          <Text className="text-[11px] text-gray-500 font-medium mt-1">Menunggu Review</Text>
        </View>
        <View className="flex-1 bg-white rounded-2xl border border-[#F1F5F9] shadow-sm p-4 items-center" style={{ minWidth: 130 }}>
          <Text className="text-xl font-black text-emerald-600">28</Text>
          <Text className="text-[11px] text-gray-500 font-medium mt-1">Terverifikasi</Text>
        </View>
        <View className="flex-1 bg-white rounded-2xl border border-[#F1F5F9] shadow-sm p-4 items-center" style={{ minWidth: 130 }}>
          <Text className="text-xl font-black text-[#162E5C]">31</Text>
          <Text className="text-[11px] text-gray-500 font-medium mt-1">Total Screening</Text>
        </View>
      </View>

      <Text className="text-sm font-extrabold text-[#132A5E] mb-3">Menunggu Verifikasi</Text>
      <View className="flex-col gap-3">
        {PENDING.map((p) => (
          <View key={p.anak + p.aspek} className="bg-white rounded-2xl border border-[#F1F5F9] shadow-sm p-5 flex-row items-center gap-4">
            <View className="w-12 h-12 rounded-xl bg-[#2DA9E9]/10 items-center justify-center shrink-0">
              <Feather name="activity" size={22} color="#2DA9E9" />
            </View>
            <View className="flex-1">
              <Text className="text-sm font-extrabold text-[#1E293B]">{p.anak} — {p.aspek}</Text>
              <Text className="text-[11px] text-gray-500 font-medium mt-0.5">Diisi {p.pengisi} • {p.tanggal}</Text>
            </View>
            <View className="flex-row gap-2">
              <TouchableOpacity className="w-9 h-9 rounded-full bg-emerald-50 items-center justify-center">
                <Feather name="check" size={16} color="#30B864" />
              </TouchableOpacity>
              <TouchableOpacity className="w-9 h-9 rounded-full bg-rose-50 items-center justify-center">
                <Feather name="x" size={16} color="#C81E45" />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
