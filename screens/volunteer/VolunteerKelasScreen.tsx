import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { UserProfile } from '../../types';

const KELAS = [
  { name: 'Mini Stimulation Class', kategori: 'Sensorik & Motorik', fasilitator: 'Bunda Sarah, M.Psi', jadwal: 'Senin 09.00', murid: 12, color: '#3B82F6', icon: 'activity' },
  { name: 'Science Class', kategori: 'Eksperimen STEAM', fasilitator: 'Kak Fatimah, S.Pd', jadwal: 'Rabu 13.00', murid: 15, color: '#2DA9E9', icon: 'cpu' },
  { name: 'Art and Craft Class', kategori: 'Kreativitas', fasilitator: 'Kak Dina, S.Pd', jadwal: 'Kamis 10.00', murid: 8, color: '#8B5CF6', icon: 'pen-tool' },
  { name: 'Cooking Class', kategori: 'Kemandirian', fasilitator: 'Bunda Sarah, M.Psi', jadwal: 'Jumat 15.00', murid: 10, color: '#F77712', icon: 'shopping-bag' },
];

export default function VolunteerKelasScreen({ user }: { user: UserProfile }) {
  return (
    <ScrollView className="flex-1 bg-[#FAF7F2]" contentContainerStyle={{ padding: 24, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
      <View className="mb-6">
        <Text className="text-xl font-extrabold text-[#132A5E]">Kelas Didampingi</Text>
        <Text className="text-xs text-gray-500 font-medium mt-0.5">Kelas yang Anda dampingi sebagai relawan pendamping</Text>
      </View>

      <View className="flex-row gap-4 mb-6" style={{ flexWrap: 'wrap' }}>
        <View className="flex-1 bg-white rounded-2xl border border-[#F1F5F9] shadow-sm p-5 items-center" style={{ minWidth: 160 }}>
          <Feather name="book-open" size={22} color="#C81E45" />
          <Text className="text-2xl font-black text-[#132A5E] mt-2">4</Text>
          <Text className="text-[11px] text-gray-500 font-medium mt-1">Kelas Aktif</Text>
        </View>
        <View className="flex-1 bg-white rounded-2xl border border-[#F1F5F9] shadow-sm p-5 items-center" style={{ minWidth: 160 }}>
          <Feather name="users" size={22} color="#2DA9E9" />
          <Text className="text-2xl font-black text-[#132A5E] mt-2">45</Text>
          <Text className="text-[11px] text-gray-500 font-medium mt-1">Murid Didampingi</Text>
        </View>
        <View className="flex-1 bg-white rounded-2xl border border-[#F1F5F9] shadow-sm p-5 items-center" style={{ minWidth: 160 }}>
          <Feather name="clock" size={22} color="#30B864" />
          <Text className="text-2xl font-black text-[#132A5E] mt-2">24 jam</Text>
          <Text className="text-[11px] text-gray-500 font-medium mt-1">Total Jam</Text>
        </View>
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
              <View className="flex-row items-center gap-2 mt-3">
                <View className="bg-gray-50 px-2.5 py-1 rounded-lg flex-row items-center gap-1">
                  <Feather name="user" size={11} color="#64748B" />
                  <Text className="text-[10px] font-bold text-[#1E293B]">{k.fasilitator}</Text>
                </View>
              </View>
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
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
