import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { UserProfile } from '../../types';

const KELAS = [
  { name: 'Mini Stimulation Class', kategori: 'Sensorik & Motorik', jadwal: 'Senin 09.00', murid: 12, color: '#3B82F6', icon: 'activity' },
  { name: 'Science Class', kategori: 'Eksperimen STEAM', jadwal: 'Rabu 13.00', murid: 15, color: '#2DA9E9', icon: 'cpu' },
  { name: 'Art and Craft Class', kategori: 'Kreativitas', jadwal: 'Kamis 10.00', murid: 8, color: '#8B5CF6', icon: 'pen-tool' },
  { name: 'Cooking Class', kategori: 'Kemandirian', jadwal: 'Jumat 15.00', murid: 10, color: '#F77712', icon: 'shopping-bag' },
];

export default function TeacherKelasScreen({ user }: { user: UserProfile }) {
  return (
    <ScrollView className="flex-1 bg-[#FAF7F2]" contentContainerStyle={{ padding: 24, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
      <View className="flex-row items-center justify-between mb-6">
        <View>
          <Text className="text-xl font-extrabold text-[#132A5E]">Kelas Saya</Text>
          <Text className="text-xs text-gray-500 font-medium mt-0.5">Kelas yang Anda ampu sebagai fasilitator</Text>
        </View>
        <TouchableOpacity className="bg-[#C81E45] px-4 py-2.5 rounded-xl flex-row items-center gap-2 shadow-sm hover:bg-[#9F1239] transition">
          <Feather name="plus" size={14} color="#FFFFFF" />
          <Text className="text-white text-xs font-bold">Buat Kelas</Text>
        </TouchableOpacity>
      </View>

      <View className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {KELAS.map((k) => (
          <View key={k.name} className="bg-white rounded-2xl border border-[#F1F5F9] shadow-sm p-5 flex-row items-start gap-4">
            <View className="w-12 h-12 rounded-xl items-center justify-center shrink-0" style={{ backgroundColor: `${k.color}1A` }}>
              <Feather name={k.icon as any} size={22} color={k.color} />
            </View>
            <View className="flex-1">
              <View className="flex-row items-center justify-between">
                <Text className="text-sm font-extrabold text-[#1E293B]" numberOfLines={1}>{k.name}</Text>
                <Feather name="more-vertical" size={16} color="#94A3B8" />
              </View>
              <Text className="text-[11px] text-gray-500 font-medium mt-0.5">{k.kategori}</Text>
              <View className="flex-row items-center justify-between mt-3 pt-3 border-t border-[#F1F5F9]">
                <View className="flex-row items-center gap-1.5">
                  <Feather name="calendar" size={12} color="#94A3B8" />
                  <Text className="text-[11px] text-gray-500 font-medium">{k.jadwal}</Text>
                </View>
                <View className="flex-row items-center gap-1.5">
                  <Feather name="users" size={12} color="#94A3B8" />
                  <Text className="text-[11px] text-gray-500 font-medium">{k.murid} murid</Text>
                </View>
              </View>
              <TouchableOpacity className="mt-3 bg-[#8B22C0]/10 py-2.5 rounded-xl items-center justify-center">
                <Text className="text-[#8B22C0] text-xs font-bold">Kelola Kelas</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
