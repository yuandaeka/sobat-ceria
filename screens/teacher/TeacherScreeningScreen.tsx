import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { UserProfile } from '../../types';

const ASPECTS = ['Motorik Halus', 'Komunikasi', 'Kognitif', 'Sosial-Emosi', 'Seni & Kriya'];

const STATUSES = [
  { label: 'Belum Berkembang', color: '#C81E45' },
  { label: 'Mulai Berkembang', color: '#F59E0B' },
  { label: 'Berkembang Sesuai Harapan', color: '#30B864' },
];

export default function TeacherScreeningScreen({ user }: { user: UserProfile }) {
  const [murid, setMurid] = useState('Arka');
  const [aspek, setAspek] = useState('Komunikasi');
  const [status, setStatus] = useState('Mulai Berkembang');
  const [notes, setNotes] = useState('');

  return (
    <ScrollView className="flex-1 bg-[#FAF7F2]" contentContainerStyle={{ padding: 24, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
      <View className="mb-6">
        <Text className="text-xl font-extrabold text-[#132A5E]">Input Screening STPPA</Text>
        <Text className="text-xs text-gray-500 font-medium mt-0.5">Catat hasil observasi perkembangan murid per sesi</Text>
      </View>

      <View className="bg-white rounded-2xl border border-[#F1F5F9] shadow-sm p-6 mb-6">
        {/* Pilih Murid */}
        <Text className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-2">Nama Murid</Text>
        <View className="flex-row gap-2 mb-5" style={{ flexWrap: 'wrap' }}>
          {['Arka', 'Kirana', 'Dafa', 'Bima', 'Aisyah'].map((m) => (
            <TouchableOpacity
              key={m}
              onPress={() => setMurid(m)}
              className={`px-4 py-2 rounded-full ${murid === m ? 'bg-[#8B22C0]' : 'bg-gray-100'}`}
            >
              <Text className={`text-xs font-bold ${murid === m ? 'text-white' : 'text-gray-600'}`}>{m}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Pilih Aspek */}
        <Text className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-2">Aspek STPPA</Text>
        <View className="flex-row gap-2 mb-5" style={{ flexWrap: 'wrap' }}>
          {ASPECTS.map((a) => (
            <TouchableOpacity
              key={a}
              onPress={() => setAspek(a)}
              className={`px-4 py-2 rounded-full ${aspek === a ? 'bg-[#8B22C0]' : 'bg-gray-100'}`}
            >
              <Text className={`text-xs font-bold ${aspek === a ? 'text-white' : 'text-gray-600'}`}>{a}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Pilih Status */}
        <Text className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-2">Status Perkembangan</Text>
        <View className="flex-row gap-2 mb-5" style={{ flexWrap: 'wrap' }}>
          {STATUSES.map((s) => (
            <TouchableOpacity
              key={s.label}
              onPress={() => setStatus(s.label)}
              className={`px-4 py-2 rounded-full border ${status === s.label ? 'bg-white border-transparent' : 'bg-white border-[#F1F5F9]'}`}
              style={status === s.label ? { backgroundColor: `${s.color}20` } : undefined}
            >
              <View className="flex-row items-center gap-1.5">
                {status === s.label && <View className="w-2 h-2 rounded-full" style={{ backgroundColor: s.color }} />}
                <Text className="text-xs font-bold" style={{ color: status === s.label ? s.color : '#64748B' }}>{s.label}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Catatan */}
        <Text className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-2">Catatan Fasilitator</Text>
        <TextInput
          className="bg-gray-50 border border-[#F1F5F9] rounded-xl px-4 py-3 text-xs text-[#1E293B] mb-6"
          placeholder="Tulis catatan observasi perkembangan murid..."
          placeholderTextColor="#94A3B8"
          multiline
          numberOfLines={4}
          style={{ minHeight: 90, textAlignVertical: 'top' }}
          value={notes}
          onChangeText={setNotes}
        />

        <TouchableOpacity
          className="bg-[#C81E45] py-3.5 rounded-xl items-center justify-center flex-row gap-2 hover:bg-[#9F1239] transition"
          onPress={() => {
            if (Platform.OS === 'web') {
              window.alert(`Hasil screening ${murid} (${aspek}: ${status}) berhasil disimpan.`);
            } else {
              alert(`Hasil screening ${murid} (${aspek}: ${status}) berhasil disimpan.`);
            }
          }}
        >
          <Feather name="save" size={16} color="#FFFFFF" />
          <Text className="text-white text-sm font-bold">Simpan Hasil Screening</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
