import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { UserProfile } from '../../types';

const PROGRAM = [
  { nama: 'Franchise Class Toolkit', deskripsi: 'Paket franchise kelas siap pakai', komisi: '15%', status: 'Aktif', color: '#F77712', icon: 'briefcase' },
  { nama: 'Kemitraan Sekolah', deskripsi: 'Kerja sama program dengan sekolah', komisi: '10%', status: 'Aktif', color: '#2DA9E9', icon: 'book-open' },
  { nama: 'Reseller Worksheet', deskripsi: 'Jual kembali worksheet printable', komisi: '25%', status: 'Aktif', color: '#30B864', icon: 'file-text' },
];

export default function PartnerProgramScreen({ user }: { user: UserProfile }) {
  return (
    <ScrollView className="flex-1 bg-[#FAF7F2]" contentContainerStyle={{ padding: 24, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
      <View className="mb-6">
        <Text className="text-xl font-extrabold text-[#132A5E]">Program Kemitraan</Text>
        <Text className="text-xs text-gray-500 font-medium mt-0.5">Detail program & syarat kerja sama mitra</Text>
      </View>

      <View className="flex-col gap-4">
        {PROGRAM.map((p) => (
          <View key={p.nama} className="bg-white rounded-2xl border border-[#F1F5F9] shadow-sm p-5 flex-row items-start gap-4">
            <View className="w-12 h-12 rounded-xl items-center justify-center shrink-0" style={{ backgroundColor: `${p.color}1A` }}>
              <Feather name={p.icon as any} size={22} color={p.color} />
            </View>
            <View className="flex-1">
              <View className="flex-row items-center justify-between">
                <Text className="text-sm font-extrabold text-[#1E293B]" numberOfLines={1}>{p.nama}</Text>
                <View className="bg-emerald-50 px-2.5 py-1 rounded-full">
                  <Text className="text-[10px] font-bold text-emerald-600">{p.status}</Text>
                </View>
              </View>
              <Text className="text-[11px] text-gray-500 font-medium mt-0.5">{p.deskripsi}</Text>
              <View className="flex-row items-center justify-between mt-3 pt-3 border-t border-[#F1F5F9]">
                <View className="flex-row items-center gap-1.5">
                  <Feather name="percent" size={13} color="#94A3B8" />
                  <Text className="text-[11px] text-gray-500 font-medium">Komisi {p.komisi}</Text>
                </View>
                <TouchableOpacity className="bg-[#C81E45] px-4 py-2 rounded-xl">
                  <Text className="text-white text-xs font-bold">Lihat Detail</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
