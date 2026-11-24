import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { UserProfile } from '../../types';

const JADWAL = [
  { hari: 'Senin, 22 Agu', waktu: '09.00 - 10.30', tugas: 'Pendamping Mini Stimulation', kelas: 'Mini Stimulation Class', lokasi: 'Lab Tumbuh Kembang FKIP UMS Lt. 2', status: 'Selesai' },
  { hari: 'Rabu, 24 Agu', waktu: '13.00 - 14.30', tugas: 'Pendamping Science', kelas: 'Science Class', lokasi: 'Ruang STEAM', status: 'Terjadwal', active: true },
  { hari: 'Kamis, 25 Agu', waktu: '10.00 - 11.30', tugas: 'Dokumentasi Art & Craft', kelas: 'Art and Craft Class', lokasi: 'Studio Kriya', status: 'Terjadwal' },
  { hari: 'Jumat, 26 Agu', waktu: '15.00 - 16.30', tugas: 'Pendamping Cooking', kelas: 'Cooking Class', lokasi: 'Ruang Life Skill', status: 'Menunggu' },
];

export default function VolunteerJadwalScreen({ user }: { user: UserProfile }) {
  return (
    <ScrollView className="flex-1 bg-[#FAF7F2]" contentContainerStyle={{ padding: 24, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
      <View className="flex-row items-center justify-between mb-6">
        <View>
          <Text className="text-xl font-extrabold text-[#132A5E]">Jadwal Tugas</Text>
          <Text className="text-xs text-gray-500 font-medium mt-0.5">Daftar pendampingan kelas Anda minggu ini</Text>
        </View>
        <TouchableOpacity className="bg-[#C81E45] px-4 py-2.5 rounded-xl flex-row items-center gap-2 shadow-sm hover:bg-[#9F1239] transition">
          <Feather name="plus" size={14} color="#FFFFFF" />
          <Text className="text-white text-xs font-bold">Ajukan Jadwal</Text>
        </TouchableOpacity>
      </View>

      <View className="flex-col gap-3">
        {JADWAL.map((j) => (
          <View key={j.tugas} className={`rounded-2xl p-5 border ${j.active ? 'bg-[#C81E45] border-[#C81E45] shadow-md' : 'bg-white border-[#F1F5F9] shadow-sm'}`}>
            <View className="flex-row items-start justify-between mb-3">
              <View className="flex-1 pr-3">
                <Text className={`text-xs font-bold ${j.active ? 'text-white/80' : 'text-gray-400'}`}>{j.hari} • {j.waktu}</Text>
                <Text className={`text-base font-extrabold mt-1 ${j.active ? 'text-white' : 'text-[#132A5E]'}`}>{j.tugas}</Text>
              </View>
              <View className={`px-2.5 py-1 rounded-full ${j.active ? 'bg-white/20' : j.status === 'Selesai' ? 'bg-emerald-50' : j.status === 'Terjadwal' ? 'bg-rose-50' : 'bg-amber-50'}`}>
                <Text className={`text-[10px] font-bold ${j.active ? 'text-white' : j.status === 'Selesai' ? 'text-emerald-600' : j.status === 'Terjadwal' ? 'text-[#C81E45]' : 'text-amber-600'}`}>{j.status}</Text>
              </View>
            </View>
            <View className={`flex-row items-center gap-3 ${j.active ? 'border-t border-white/20 pt-3' : 'border-t border-[#F1F5F9] pt-3'}`}>
              <View className={`flex-row items-center gap-1.5 ${j.active ? 'bg-white/10 px-3 py-1.5 rounded-lg' : 'bg-gray-50 px-3 py-1.5 rounded-lg'}`}>
                <Feather name="book-open" size={13} color={j.active ? '#FFFFFF' : '#64748B'} />
                <Text className={`text-[11px] font-bold ${j.active ? 'text-white' : 'text-[#1E293B]'}`}>{j.kelas}</Text>
              </View>
              <View className={`flex-row items-center gap-1.5 flex-1 ${j.active ? 'bg-white/10 px-3 py-1.5 rounded-lg' : 'bg-gray-50 px-3 py-1.5 rounded-lg'}`}>
                <Feather name="map-pin" size={13} color={j.active ? '#FFFFFF' : '#64748B'} />
                <Text className={`text-[11px] font-medium ${j.active ? 'text-white/90' : 'text-gray-500'}`} numberOfLines={1}>{j.lokasi}</Text>
              </View>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
