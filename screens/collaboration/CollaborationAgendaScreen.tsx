import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { UserProfile } from '../../types';

const AGENDA = [
  { title: 'Rapat progres Riset Tumbuh Kembang', tanggal: 'Rabu, 24 Agu 2026', waktu: '10.00 - 11.30', lokasi: 'Ruang Rapat A', status: 'Terjadwal', active: true },
  { title: 'Penandatanganan MoU Dinas Pendidikan', tanggal: 'Kamis, 25 Agu 2026', waktu: '13.00 - 14.00', lokasi: 'Kantor Dinas', status: 'Terjadwal' },
  { title: 'Review laporan workshop Q2', tanggal: 'Jumat, 26 Agu 2026', waktu: '09.00 - 10.00', lokasi: 'Online (Zoom)', status: 'Terjadwal' },
  { title: 'Presentasi proposal program baru', tanggal: 'Senin, 29 Agu 2026', waktu: '14.00 - 15.30', lokasi: 'Lab FKIP UMS Lt. 2', status: 'Direncanakan' },
];

export default function CollaborationAgendaScreen({ user }: { user: UserProfile }) {
  return (
    <ScrollView className="flex-1 bg-[#FAF7F2]" contentContainerStyle={{ padding: 24, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
      <View className="flex-row items-center justify-between mb-6">
        <View>
          <Text className="text-xl font-extrabold text-[#132A5E]">Agenda Rapat</Text>
          <Text className="text-xs text-gray-500 font-medium mt-0.5">Jadwal rapat & kegiatan koordinasi tim</Text>
        </View>
        <TouchableOpacity className="bg-[#C81E45] px-4 py-2.5 rounded-xl flex-row items-center gap-2 shadow-sm hover:bg-[#9F1239] transition">
          <Feather name="plus" size={14} color="#FFFFFF" />
          <Text className="text-white text-xs font-bold">Buat Agenda</Text>
        </TouchableOpacity>
      </View>

      <View className="flex-col gap-3">
        {AGENDA.map((a) => (
          <View key={a.title} className={`rounded-2xl p-5 border ${a.active ? 'bg-[#30B864] border-[#30B864] shadow-md' : 'bg-white border-[#F1F5F9] shadow-sm'}`}>
            <View className="flex-row items-start justify-between mb-3">
              <View className="flex-1 pr-3">
                <Text className={`text-xs font-bold ${a.active ? 'text-white/80' : 'text-gray-400'}`}>{a.tanggal} • {a.waktu}</Text>
                <Text className={`text-base font-extrabold mt-1 ${a.active ? 'text-white' : 'text-[#132A5E]'}`}>{a.title}</Text>
              </View>
              <View className={`px-2.5 py-1 rounded-full ${a.active ? 'bg-white/20' : a.status === 'Direncanakan' ? 'bg-amber-50' : 'bg-emerald-50'}`}>
                <Text className={`text-[10px] font-bold ${a.active ? 'text-white' : a.status === 'Direncanakan' ? 'text-amber-600' : 'text-emerald-600'}`}>{a.status}</Text>
              </View>
            </View>
            <View className={`flex-row items-center gap-1.5 ${a.active ? 'bg-white/10 px-3 py-2 rounded-lg' : 'bg-gray-50 px-3 py-2 rounded-lg'}`}>
              <Feather name="map-pin" size={13} color={a.active ? '#FFFFFF' : '#64748B'} />
              <Text className={`text-[11px] font-medium ${a.active ? 'text-white/90' : 'text-gray-500'}`}>{a.lokasi}</Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
