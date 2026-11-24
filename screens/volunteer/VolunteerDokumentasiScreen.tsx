import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { UserProfile } from '../../types';

const DOKUMENTASI = [
  { title: 'Sesi Mini Stimulation', tanggal: '22 Agu 2026', count: 12, color: '#3B82F6', icon: 'image' },
  { title: 'Eksperimen Science', tanggal: '17 Agu 2026', count: 9, color: '#2DA9E9', icon: 'cpu' },
  { title: 'Kriya Art & Craft', tanggal: '15 Agu 2026', count: 15, color: '#8B5CF6', icon: 'pen-tool' },
  { title: 'Cooking Class', tanggal: '12 Agu 2026', count: 8, color: '#F77712', icon: 'shopping-bag' },
  { title: 'Outbond Ceria', tanggal: '10 Agu 2026', count: 20, color: '#30B864', icon: 'award' },
  { title: 'Seminar Parenting', tanggal: '08 Agu 2026', count: 6, color: '#C81E45', icon: 'users' },
];

export default function VolunteerDokumentasiScreen({ user }: { user: UserProfile }) {
  return (
    <ScrollView className="flex-1 bg-[#FAF7F2]" contentContainerStyle={{ padding: 24, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
      <View className="flex-row items-center justify-between mb-6">
        <View>
          <Text className="text-xl font-extrabold text-[#132A5E]">Dokumentasi Kegiatan</Text>
          <Text className="text-xs text-gray-500 font-medium mt-0.5">Kumpulan foto & video aktivitas yang Anda dampingi</Text>
        </View>
        <TouchableOpacity
          className="bg-[#C81E45] px-4 py-2.5 rounded-xl flex-row items-center gap-2 shadow-sm hover:bg-[#9F1239] transition"
          onPress={() => {
            if (Platform.OS === 'web') {
              window.alert('Unggah foto/video kegiatan (fitur segera hadir).');
            } else {
              alert('Unggah foto/video kegiatan (fitur segera hadir).');
            }
          }}
        >
          <Feather name="upload" size={14} color="#FFFFFF" />
          <Text className="text-white text-xs font-bold">Unggah</Text>
        </TouchableOpacity>
      </View>

      <View className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {DOKUMENTASI.map((d) => (
          <View key={d.title} className="bg-white rounded-2xl border border-[#F1F5F9] shadow-sm overflow-hidden">
            <View className="h-28 items-center justify-center" style={{ backgroundColor: `${d.color}1A` }}>
              <Feather name={d.icon as any} size={34} color={d.color} />
            </View>
            <View className="p-4">
              <Text className="text-sm font-extrabold text-[#1E293B]" numberOfLines={1}>{d.title}</Text>
              <View className="flex-row items-center justify-between mt-2">
                <Text className="text-[11px] text-gray-500 font-medium">{d.tanggal}</Text>
                <View className="flex-row items-center gap-1">
                  <Feather name="image" size={12} color="#94A3B8" />
                  <Text className="text-[11px] text-gray-500 font-medium">{d.count} media</Text>
                </View>
              </View>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
