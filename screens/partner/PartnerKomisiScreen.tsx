import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { UserProfile } from '../../types';

const RIWAYAT = [
  { nama: 'Komunitas Ibu Ceria', program: 'Reseller Worksheet', tanggal: '20 Agu 2026', nilai: 'Rp 750.000', status: 'Dibayar' },
  { nama: 'TK Pelangi', program: 'Kemitraan Sekolah', tanggal: '15 Agu 2026', nilai: 'Rp 800.000', status: 'Dibayar' },
  { nama: 'Yayasan Harapan', program: 'Franchise Class Toolkit', tanggal: '10 Agu 2026', nilai: 'Rp 2.250.000', status: 'Diproses' },
  { nama: 'PAUD Mentari', program: 'Kemitraan Sekolah', tanggal: '05 Agu 2026', nilai: 'Rp 600.000', status: 'Dibayar' },
];

export default function PartnerKomisiScreen({ user }: { user: UserProfile }) {
  return (
    <ScrollView className="flex-1 bg-[#FAF7F2]" contentContainerStyle={{ padding: 24, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
      <View className="mb-6">
        <Text className="text-xl font-extrabold text-[#132A5E]">Komisi Referal</Text>
        <Text className="text-xs text-gray-500 font-medium mt-0.5">Pantau performa & pencairan komisi mitra</Text>
      </View>

      {/* Ringkasan Komisi */}
      <View className="rounded-2xl p-6 mb-6 relative overflow-hidden">
        <View className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(135deg, #30B864 0%, #1E9E50 100%)' } as any} />
        <View className="absolute -top-10 -right-6 w-40 h-40 rounded-full bg-white/10" />
        <View className="relative z-10 flex-row items-center gap-4">
          <View className="w-14 h-14 rounded-2xl bg-white/15 border border-white/25 items-center justify-center">
            <Feather name="dollar-sign" size={26} color="#FFFFFF" />
          </View>
          <View className="flex-1">
            <Text className="text-white/80 text-[11px] font-bold uppercase tracking-wider">Total Komisi Bulan Ini</Text>
            <Text className="text-3xl font-black text-white">Rp 1.200.000</Text>
          </View>
          <TouchableOpacity className="bg-white px-4 py-2.5 rounded-xl">
            <Text className="text-[#30B864] text-xs font-bold">Tarik Dana</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Riwayat */}
      <Text className="text-sm font-extrabold text-[#132A5E] mb-3">Riwayat Komisi</Text>
      <View className="bg-white rounded-2xl border border-[#F1F5F9] shadow-sm overflow-hidden">
        {RIWAYAT.map((r, i) => (
          <View key={r.nama} className={`flex-row items-center gap-4 px-5 py-4 ${i < RIWAYAT.length - 1 ? 'border-b border-[#F1F5F9]' : ''}`}>
            <View className="w-10 h-10 rounded-full bg-emerald-50 items-center justify-center shrink-0">
              <Feather name="dollar-sign" size={17} color="#30B864" />
            </View>
            <View className="flex-1">
              <Text className="text-sm font-extrabold text-[#1E293B]" numberOfLines={1}>{r.nama}</Text>
              <Text className="text-[11px] text-gray-500 font-medium mt-0.5">{r.program} • {r.tanggal}</Text>
            </View>
            <View className="items-end">
              <Text className="text-xs font-extrabold text-[#1E293B]">{r.nilai}</Text>
              <View className={`px-2 py-0.5 rounded-full mt-0.5 ${r.status === 'Dibayar' ? 'bg-emerald-50' : 'bg-amber-50'}`}>
                <Text className={`text-[9px] font-bold ${r.status === 'Dibayar' ? 'text-emerald-600' : 'text-amber-600'}`}>{r.status}</Text>
              </View>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
