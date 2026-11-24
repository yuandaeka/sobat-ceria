import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { UserProfile } from '../../types';

const KELAS = [
  { nama: 'Mini Stimulation Class', harga: 'Rp 59.000', kuota: 12, terisi: 12, aktif: true },
  { nama: 'Communication Class', harga: 'Rp 65.000', kuota: 4, terisi: 4, aktif: true },
  { nama: 'Seminar Parenting', harga: 'Rp 49.000', kuota: 25, terisi: 18, aktif: true },
  { nama: 'Art and Craft Class', harga: 'Rp 79.000', kuota: 8, terisi: 8, aktif: true },
  { nama: 'Science Class', harga: 'Rp 69.000', kuota: 15, terisi: 15, aktif: true },
  { nama: 'Pottery Class', harga: 'Rp 75.000', kuota: 6, terisi: 6, aktif: false },
];

export default function AdminKelasScreen({ user }: { user: UserProfile }) {
  return (
    <ScrollView className="flex-1 bg-[#FAF7F2]" contentContainerStyle={{ padding: 24, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
      <View className="flex-row items-center justify-between mb-6">
        <View>
          <Text className="text-xl font-extrabold text-[#132A5E]">Kelola Kelas</Text>
          <Text className="text-xs text-gray-500 font-medium mt-0.5">Tambah, ubah, dan nonaktifkan program kelas</Text>
        </View>
        <TouchableOpacity className="bg-[#C81E45] px-4 py-2.5 rounded-xl flex-row items-center gap-2 shadow-sm hover:bg-[#9F1239] transition">
          <Feather name="plus" size={14} color="#FFFFFF" />
          <Text className="text-white text-xs font-bold">Tambah Kelas</Text>
        </TouchableOpacity>
      </View>

      <View className="bg-white rounded-2xl border border-[#F1F5F9] shadow-sm overflow-hidden">
        {KELAS.map((k, i) => (
          <View key={k.nama} className={`flex-row items-center gap-4 px-5 py-4 ${i < KELAS.length - 1 ? 'border-b border-[#F1F5F9]' : ''}`}>
            <View className="w-11 h-11 rounded-xl bg-gray-50 items-center justify-center shrink-0">
              <Feather name="book-open" size={19} color="#162E5C" />
            </View>
            <View className="flex-1">
              <Text className="text-sm font-extrabold text-[#1E293B]" numberOfLines={1}>{k.nama}</Text>
              <Text className="text-[11px] text-gray-500 font-medium mt-0.5">{k.harga} • Kuota {k.terisi}/{k.kuota}</Text>
            </View>
            <View className={`px-2.5 py-1 rounded-full ${k.aktif ? 'bg-emerald-50' : 'bg-gray-100'}`}>
              <Text className={`text-[10px] font-bold ${k.aktif ? 'text-emerald-600' : 'text-gray-500'}`}>{k.aktif ? 'Aktif' : 'Nonaktif'}</Text>
            </View>
            <TouchableOpacity className="w-9 h-9 rounded-full bg-[#C81E45]/10 items-center justify-center">
              <Feather name="edit-3" size={15} color="#C81E45" />
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
