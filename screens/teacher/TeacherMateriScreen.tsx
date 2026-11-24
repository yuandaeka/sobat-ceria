import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { UserProfile } from '../../types';

const MATERI = [
  { title: 'Modul Sensori & Motorik Halus', kelas: 'Mini Stimulation', pages: 12, type: 'PDF', color: '#3B82F6', icon: 'file-text' },
  { title: 'Panduan Eksperimen STEAM', kelas: 'Science Class', pages: 18, type: 'PDF', color: '#2DA9E9', icon: 'cpu' },
  { title: 'Worksheet Tracing Huruf', kelas: 'Communication', pages: 8, type: 'PDF', color: '#8B5CF6', icon: 'type' },
  { title: 'Template Kriya Gunting Tempel', kelas: 'Art & Craft', pages: 10, type: 'PDF', color: '#F77712', icon: 'scissors' },
  { title: 'Modul Resep Sehat Anak', kelas: 'Cooking Class', pages: 6, type: 'PDF', color: '#30B864', icon: 'shopping-bag' },
];

export default function TeacherMateriScreen({ user }: { user: UserProfile }) {
  return (
    <ScrollView className="flex-1 bg-[#FAF7F2]" contentContainerStyle={{ padding: 24, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
      <View className="flex-row items-center justify-between mb-6">
        <View>
          <Text className="text-xl font-extrabold text-[#132A5E]">Materi & Worksheet</Text>
          <Text className="text-xs text-gray-500 font-medium mt-0.5">Susun dan bagikan materi belajar untuk murid</Text>
        </View>
        <TouchableOpacity
          className="bg-[#C81E45] px-4 py-2.5 rounded-xl flex-row items-center gap-2 shadow-sm hover:bg-[#9F1239] transition"
          onPress={() => {
            if (Platform.OS === 'web') {
              window.alert('Unggah materi baru (fitur segera hadir).');
            } else {
              alert('Unggah materi baru (fitur segera hadir).');
            }
          }}
        >
          <Feather name="upload" size={14} color="#FFFFFF" />
          <Text className="text-white text-xs font-bold">Unggah Materi</Text>
        </TouchableOpacity>
      </View>

      <View className="bg-white rounded-2xl border border-[#F1F5F9] shadow-sm overflow-hidden">
        {MATERI.map((m, i) => (
          <View key={m.title} className={`flex-row items-center gap-4 px-5 py-4 ${i < MATERI.length - 1 ? 'border-b border-[#F1F5F9]' : ''}`}>
            <View className="w-11 h-11 rounded-xl items-center justify-center shrink-0" style={{ backgroundColor: `${m.color}1A` }}>
              <Feather name={m.icon as any} size={20} color={m.color} />
            </View>
            <View className="flex-1">
              <Text className="text-sm font-extrabold text-[#1E293B]" numberOfLines={1}>{m.title}</Text>
              <Text className="text-[11px] text-gray-500 font-medium mt-0.5">{m.kelas} • {m.pages} halaman</Text>
            </View>
            <View className="bg-gray-50 px-2.5 py-1 rounded-md">
              <Text className="text-[10px] font-bold text-gray-500">{m.type}</Text>
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
