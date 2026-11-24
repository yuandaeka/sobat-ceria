import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { UserProfile } from '../../types';

const TIM = [
  { name: 'Bunda Sarah, M.Psi', role: 'Koordinator Program', divisi: 'Psikologi', color: '#8B5CF6' },
  { name: 'Kak Fatimah, S.Pd', role: 'Lead Riset', divisi: 'Pendidikan', color: '#2DA9E9' },
  { name: 'Pak Rian, S.Sn', role: 'Desain Program', divisi: 'Kreatif', color: '#F77712' },
  { name: 'dr. Raditya Sp.A', role: 'Konsultan Medis', divisi: 'Kesehatan', color: '#30B864' },
  { name: 'Bu Rina, M.Psi', role: 'Peneliti', divisi: 'Riset', color: '#C81E45' },
];

export default function CollaborationTimScreen({ user }: { user: UserProfile }) {
  return (
    <ScrollView className="flex-1 bg-[#FAF7F2]" contentContainerStyle={{ padding: 24, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
      <View className="flex-row items-center justify-between mb-6">
        <View>
          <Text className="text-xl font-extrabold text-[#132A5E]">Koordinasi Tim</Text>
          <Text className="text-xs text-gray-500 font-medium mt-0.5">Anggota tim kolaborasi lintas divisi</Text>
        </View>
        <TouchableOpacity className="bg-[#C81E45] px-4 py-2.5 rounded-xl flex-row items-center gap-2 shadow-sm hover:bg-[#9F1239] transition">
          <Feather name="user-plus" size={14} color="#FFFFFF" />
          <Text className="text-white text-xs font-bold">Tambah Anggota</Text>
        </TouchableOpacity>
      </View>

      <View className="bg-white rounded-2xl border border-[#F1F5F9] shadow-sm overflow-hidden">
        {TIM.map((t, i) => (
          <View key={t.name} className={`flex-row items-center gap-3.5 px-5 py-4 ${i < TIM.length - 1 ? 'border-b border-[#F1F5F9]' : ''}`}>
            <View className="w-11 h-11 rounded-full items-center justify-center shrink-0" style={{ backgroundColor: `${t.color}20` }}>
              <Text className="text-xs font-black" style={{ color: t.color }}>
                {t.name.split(' ').filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase()}
              </Text>
            </View>
            <View className="flex-1">
              <Text className="text-sm font-extrabold text-[#1E293B]">{t.name}</Text>
              <Text className="text-[11px] text-gray-500 font-medium mt-0.5">{t.role} • {t.divisi}</Text>
            </View>
            <TouchableOpacity className="w-9 h-9 rounded-full bg-[#C81E45]/10 items-center justify-center">
              <Feather name="message-circle" size={15} color="#C81E45" />
            </TouchableOpacity>
            <TouchableOpacity className="w-9 h-9 rounded-full bg-[#C81E45]/10 items-center justify-center">
              <Feather name="info" size={15} color="#C81E45" />
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
