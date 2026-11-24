import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { UserProfile } from '../../types';

const MOU = [
  { nama: 'Kerja Sama FKIP UMS', pihak: 'Universitas Muhammadiyah Surakarta', tanggal: '12 Jan 2026', status: 'Aktif' },
  { nama: 'MoU Dinas Pendidikan', pihak: 'Dinas Pendidikan Kota', tanggal: '24 Agu 2026', status: 'Menunggu TTD', active: true },
  { nama: 'Kemitraan Yayasan Ceria', pihak: 'Yayasan Ceria Indonesia', tanggal: '03 Mar 2026', status: 'Aktif' },
  { nama: 'Kerja Sama Komunitas Guru', pihak: 'Komunitas Guru PAUD', tanggal: '17 Jun 2026', status: 'Kedaluwarsa' },
];

export default function CollaborationMouScreen({ user }: { user: UserProfile }) {
  return (
    <ScrollView className="flex-1 bg-[#FAF7F2]" contentContainerStyle={{ padding: 24, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
      <View className="flex-row items-center justify-between mb-6">
        <View>
          <Text className="text-xl font-extrabold text-[#132A5E]">MoU & Kerja Sama</Text>
          <Text className="text-xs text-gray-500 font-medium mt-0.5">Kelola perjanjian dan status kemitraan</Text>
        </View>
        <TouchableOpacity className="bg-[#C81E45] px-4 py-2.5 rounded-xl flex-row items-center gap-2 shadow-sm hover:bg-[#9F1239] transition">
          <Feather name="plus" size={14} color="#FFFFFF" />
          <Text className="text-white text-xs font-bold">Ajukan MoU</Text>
        </TouchableOpacity>
      </View>

      <View className="bg-white rounded-2xl border border-[#F1F5F9] shadow-sm overflow-hidden">
        {MOU.map((m, i) => (
          <View key={m.nama} className={`flex-row items-center gap-4 px-5 py-4 ${i < MOU.length - 1 ? 'border-b border-[#F1F5F9]' : ''}`}>
            <View className={`w-11 h-11 rounded-xl items-center justify-center shrink-0 ${m.active ? 'bg-[#F59E0B]' : 'bg-gray-50'}`}>
              <Feather name="briefcase" size={19} color={m.active ? '#FFFFFF' : '#64748B'} />
            </View>
            <View className="flex-1">
              <Text className="text-sm font-extrabold text-[#1E293B]" numberOfLines={1}>{m.nama}</Text>
              <Text className="text-[11px] text-gray-500 font-medium mt-0.5">{m.pihak} • {m.tanggal}</Text>
            </View>
            <View className={`px-2.5 py-1 rounded-full ${
              m.status === 'Aktif' ? 'bg-emerald-50' : m.status === 'Menunggu TTD' ? 'bg-amber-50' : 'bg-rose-50'
            }`}>
              <Text className={`text-[10px] font-bold ${
                m.status === 'Aktif' ? 'text-emerald-600' : m.status === 'Menunggu TTD' ? 'text-amber-600' : 'text-rose-600'
              }`}>{m.status}</Text>
            </View>
            <TouchableOpacity className="w-9 h-9 rounded-full bg-[#C81E45]/10 items-center justify-center">
              <Feather name="download" size={15} color="#C81E45" />
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
