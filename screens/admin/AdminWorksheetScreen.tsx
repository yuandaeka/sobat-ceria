import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { UserProfile } from '../../types';

const WORKSHEET = [
  { nama: 'Focus & Sensory Tracer Kit', kategori: 'Mini Stimulation', halaman: 12, aktif: true },
  { nama: 'Clay Sculpting & Color Mix Guide', kategori: 'Art & Craft', halaman: 18, aktif: true },
  { nama: 'STEAM Fun: Science Experiment', kategori: 'Science Class', halaman: 15, aktif: true },
  { nama: 'Tracing Huruf & Angka', kategori: 'Communication', halaman: 8, aktif: false },
];

export default function AdminWorksheetScreen({ user }: { user: UserProfile }) {
  return (
    <ScrollView className="flex-1 bg-[#FAF7F2]" contentContainerStyle={{ padding: 24, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
      <View className="flex-row items-center justify-between mb-6">
        <View>
          <Text className="text-xl font-extrabold text-[#132A5E]">Kelola Worksheet</Text>
          <Text className="text-xs text-gray-500 font-medium mt-0.5">Unggah & kelola materi printable</Text>
        </View>
        <TouchableOpacity
          className="bg-[#C81E45] px-4 py-2.5 rounded-xl flex-row items-center gap-2 shadow-sm hover:bg-[#9F1239] transition"
          onPress={() => {
            if (Platform.OS === 'web') {
              window.alert('Unggah worksheet baru (fitur segera hadir).');
            } else {
              alert('Unggah worksheet baru (fitur segera hadir).');
            }
          }}
        >
          <Feather name="upload" size={14} color="#FFFFFF" />
          <Text className="text-white text-xs font-bold">Unggah</Text>
        </TouchableOpacity>
      </View>

      <View className="bg-white rounded-2xl border border-[#F1F5F9] shadow-sm overflow-hidden">
        {WORKSHEET.map((w, i) => (
          <View key={w.nama} className={`flex-row items-center gap-4 px-5 py-4 ${i < WORKSHEET.length - 1 ? 'border-b border-[#F1F5F9]' : ''}`}>
            <View className="w-11 h-11 rounded-xl bg-[#30B864]/10 items-center justify-center shrink-0">
              <Feather name="file-text" size={19} color="#30B864" />
            </View>
            <View className="flex-1">
              <Text className="text-sm font-extrabold text-[#1E293B]" numberOfLines={1}>{w.nama}</Text>
              <Text className="text-[11px] text-gray-500 font-medium mt-0.5">{w.kategori} • {w.halaman} halaman</Text>
            </View>
            <View className={`px-2.5 py-1 rounded-full ${w.aktif ? 'bg-emerald-50' : 'bg-gray-100'}`}>
              <Text className={`text-[10px] font-bold ${w.aktif ? 'text-emerald-600' : 'text-gray-500'}`}>{w.aktif ? 'Aktif' : 'Nonaktif'}</Text>
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
