import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { UserProfile } from '../../types';

const PROYEK = [
  { nama: 'Riset Tumbuh Kembang Anak', mitra: 'FKIP UMS', progres: 75, status: 'Berjalan', color: '#30B864', icon: 'layers' },
  { nama: 'Program Sekolah Inklusif', mitra: 'Dinas Pendidikan', progres: 50, status: 'Aktif', color: '#2DA9E9', icon: 'git-merge' },
  { nama: 'Workshop Parenting Massal', mitra: 'Yayasan Ceria', progres: 90, status: 'Berjalan', color: '#8B5CF6', icon: 'users' },
  { nama: 'Pelatihan Fasilitator PAUD', mitra: 'Komunitas Guru', progres: 20, status: 'Perencanaan', color: '#F59E0B', icon: 'book-open' },
];

export default function CollaborationProyekScreen({ user }: { user: UserProfile }) {
  return (
    <ScrollView className="flex-1 bg-[#FAF7F2]" contentContainerStyle={{ padding: 24, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
      <View className="flex-row items-center justify-between mb-6">
        <View>
          <Text className="text-xl font-extrabold text-[#132A5E]">Proyek Kolaborasi</Text>
          <Text className="text-xs text-gray-500 font-medium mt-0.5">Pantau progres proyek bersama mitra & internal</Text>
        </View>
        <TouchableOpacity className="bg-[#C81E45] px-4 py-2.5 rounded-xl flex-row items-center gap-2 shadow-sm hover:bg-[#9F1239] transition">
          <Feather name="plus" size={14} color="#FFFFFF" />
          <Text className="text-white text-xs font-bold">Proyek Baru</Text>
        </TouchableOpacity>
      </View>

      <View className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {PROYEK.map((p) => (
          <View key={p.nama} className="bg-white rounded-2xl border border-[#F1F5F9] shadow-sm p-5">
            <View className="flex-row items-start justify-between mb-3">
              <View className="flex-row items-center gap-3 flex-1">
                <View className="w-11 h-11 rounded-xl items-center justify-center shrink-0" style={{ backgroundColor: `${p.color}1A` }}>
                  <Feather name={p.icon as any} size={20} color={p.color} />
                </View>
                <View className="flex-1">
                  <Text className="text-sm font-extrabold text-[#1E293B]" numberOfLines={1}>{p.nama}</Text>
                  <Text className="text-[11px] text-gray-500 font-medium mt-0.5">{p.mitra}</Text>
                </View>
              </View>
              <View className="px-2.5 py-1 rounded-full" style={{ backgroundColor: `${p.color}1A` }}>
                <Text className="text-[10px] font-bold" style={{ color: p.color }}>{p.status}</Text>
              </View>
            </View>

            <View className="flex-row items-center gap-3 mb-4">
              <View className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                <View className="h-full rounded-full" style={{ width: `${p.progres}%`, backgroundColor: p.color }} />
              </View>
              <Text className="text-xs font-black" style={{ color: p.color }}>{p.progres}%</Text>
            </View>

            <View className="flex-row gap-2">
              <TouchableOpacity className="flex-1 bg-[#C81E45] py-2.5 rounded-xl items-center justify-center">
                <Text className="text-white text-xs font-bold">Detail</Text>
              </TouchableOpacity>
              <TouchableOpacity className="flex-1 border border-[#F1F5F9] py-2.5 rounded-xl items-center justify-center">
                <Text className="text-[#1E293B] text-xs font-bold">Tim</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
