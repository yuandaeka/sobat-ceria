import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { UserProfile } from '../../types';

const JADWAL = [
  { hari: 'Senin, 22 Agu', waktu: '09.00 - 10.30', kelas: 'Mini Stimulation Class', ruang: 'Lab Tumbuh Kembang FKIP UMS Lt. 2', status: 'Selesai' },
  { hari: 'Rabu, 24 Agu', waktu: '13.00 - 14.30', kelas: 'Science Class', ruang: 'Ruang STEAM', status: 'Hari Ini', active: true },
  { hari: 'Kamis, 25 Agu', waktu: '10.00 - 11.30', kelas: 'Art and Craft Class', ruang: 'Studio Kriya', status: 'Terjadwal' },
  { hari: 'Jumat, 26 Agu', waktu: '15.00 - 16.30', kelas: 'Cooking Class', ruang: 'Ruang Life Skill', status: 'Terjadwal' },
];

export default function TeacherJadwalScreen({ user }: { user: UserProfile }) {
  return (
    <ScrollView className="flex-1 bg-[#FAF7F2]" contentContainerStyle={{ padding: 24, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
      <View className="mb-6">
        <Text className="text-xl font-extrabold text-[#132A5E]">Jadwal Mengajar</Text>
        <Text className="text-xs text-gray-500 font-medium mt-0.5">Jadwal kelas yang Anda ampu minggu ini</Text>
      </View>

      <View className="flex-col gap-3">
        {JADWAL.map((j) => (
          <View key={j.kelas} className={`rounded-2xl p-5 border ${j.active ? 'bg-[#8B22C0] border-[#8B22C0] shadow-md' : 'bg-white border-[#F1F5F9] shadow-sm'}`}>
            <View className="flex-row items-start justify-between mb-3">
              <View className="flex-1 pr-3">
                <Text className={`text-xs font-bold ${j.active ? 'text-white/80' : 'text-gray-400'}`}>{j.hari} • {j.waktu}</Text>
                <Text className={`text-base font-extrabold mt-1 ${j.active ? 'text-white' : 'text-[#132A5E]'}`}>{j.kelas}</Text>
              </View>
              <View className={`px-2.5 py-1 rounded-full ${j.active ? 'bg-white/20' : j.status === 'Selesai' ? 'bg-emerald-50' : 'bg-purple-50'}`}>
                <Text className={`text-[10px] font-bold ${j.active ? 'text-white' : j.status === 'Selesai' ? 'text-emerald-600' : 'text-[#8B22C0]'}`}>{j.status}</Text>
              </View>
            </View>
            <View className={`flex-row items-center gap-1.5 ${j.active ? 'bg-white/10 px-3 py-2 rounded-lg' : 'bg-gray-50 px-3 py-2 rounded-lg'}`}>
              <Feather name="map-pin" size={13} color={j.active ? '#FFFFFF' : '#64748B'} />
              <Text className={`text-[11px] font-medium ${j.active ? 'text-white/90' : 'text-gray-500'}`}>{j.ruang}</Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
