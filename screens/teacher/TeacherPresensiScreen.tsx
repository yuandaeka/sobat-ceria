import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { UserProfile } from '../../types';

const MURID = [
  { name: 'Arka', color: '#2DA9E9' },
  { name: 'Kirana', color: '#8B5CF6' },
  { name: 'Dafa', color: '#F77712' },
  { name: 'Bima', color: '#30B864' },
  { name: 'Aisyah', color: '#C81E45' },
];

const STATUS_OPTIONS = ['Hadir', 'Izin', 'Sakit'];

export default function TeacherPresensiScreen({ user }: { user: UserProfile }) {
  const [presensi, setPresensi] = useState<Record<string, string>>({
    Arka: 'Hadir',
    Kirana: 'Hadir',
    Dafa: 'Izin',
    Bima: 'Hadir',
    Aisyah: 'Sakit',
  });

  return (
    <ScrollView className="flex-1 bg-[#FAF7F2]" contentContainerStyle={{ padding: 24, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
      <View className="flex-row items-center justify-between mb-6">
        <View>
          <Text className="text-xl font-extrabold text-[#132A5E]">Presensi Murid</Text>
          <Text className="text-xs text-gray-500 font-medium mt-0.5">Science Class • Rabu, 24 Agu 2026</Text>
        </View>
        <TouchableOpacity className="bg-[#C81E45] px-4 py-2.5 rounded-xl flex-row items-center gap-2 shadow-sm hover:bg-[#9F1239] transition">
          <Feather name="check" size={14} color="#FFFFFF" />
          <Text className="text-white text-xs font-bold">Simpan Presensi</Text>
        </TouchableOpacity>
      </View>

      <View className="bg-white rounded-2xl border border-[#F1F5F9] shadow-sm overflow-hidden mb-6">
        <View className="flex-row items-center px-5 py-3 border-b border-[#F1F5F9] bg-gray-50">
          <Text className="text-[10px] font-black text-gray-400 uppercase tracking-wider flex-1">Nama Murid</Text>
          <Text className="text-[10px] font-black text-gray-400 uppercase tracking-wider" style={{ width: 200, textAlign: 'right' }}>Status Kehadiran</Text>
        </View>
        {MURID.map((m, i) => (
          <View key={m.name} className={`flex-row items-center px-5 py-3.5 ${i < MURID.length - 1 ? 'border-b border-[#F1F5F9]' : ''}`}>
            <View className="flex-1 flex-row items-center gap-3">
              <View className="w-9 h-9 rounded-full items-center justify-center" style={{ backgroundColor: `${m.color}20` }}>
                <Text className="text-xs font-black" style={{ color: m.color }}>{m.name[0]}</Text>
              </View>
              <Text className="text-sm font-extrabold text-[#1E293B]">{m.name}</Text>
            </View>
            <View className="flex-row gap-1.5" style={{ width: 200, justifyContent: 'flex-end' }}>
              {STATUS_OPTIONS.map((s) => {
                const isActive = presensi[m.name] === s;
                const activeBg = s === 'Hadir' ? 'bg-emerald-500' : s === 'Izin' ? 'bg-amber-500' : 'bg-rose-500';
                return (
                  <TouchableOpacity
                    key={s}
                    onPress={() => setPresensi((p) => ({ ...p, [m.name]: s }))}
                    className={`px-3 py-1.5 rounded-full ${isActive ? activeBg : 'bg-gray-100'}`}
                  >
                    <Text className={`text-[10px] font-bold ${isActive ? 'text-white' : 'text-gray-500'}`}>{s}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        ))}
      </View>

      {/* Ringkasan */}
      <View className="flex-row gap-3" style={{ flexWrap: 'wrap' }}>
        <View className="flex-1 bg-white rounded-2xl border border-[#F1F5F9] shadow-sm p-4 items-center" style={{ minWidth: 120 }}>
          <Text className="text-xl font-black text-emerald-600">3</Text>
          <Text className="text-[11px] text-gray-500 font-medium mt-1">Hadir</Text>
        </View>
        <View className="flex-1 bg-white rounded-2xl border border-[#F1F5F9] shadow-sm p-4 items-center" style={{ minWidth: 120 }}>
          <Text className="text-xl font-black text-amber-600">1</Text>
          <Text className="text-[11px] text-gray-500 font-medium mt-1">Izin</Text>
        </View>
        <View className="flex-1 bg-white rounded-2xl border border-[#F1F5F9] shadow-sm p-4 items-center" style={{ minWidth: 120 }}>
          <Text className="text-xl font-black text-rose-600">1</Text>
          <Text className="text-[11px] text-gray-500 font-medium mt-1">Sakit</Text>
        </View>
      </View>
    </ScrollView>
  );
}
