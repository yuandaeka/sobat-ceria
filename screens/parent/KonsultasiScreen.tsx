import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { UserProfile } from '../../types';

const SPECIALISTS = [
  {
    name: 'Bunda Sarah, M.Psi',
    role: 'Psikolog Anak',
    specialty: 'Tumbuh kembang & emosi',
    color: '#8B5CF6',
    online: true,
  },
  {
    name: 'Kak Fatimah, S.Pd',
    role: 'Tutor Science',
    specialty: 'Stimulasi kognitif & STEAM',
    color: '#2DA9E9',
    online: true,
  },
  {
    name: 'dr. Raditya Sp.A',
    role: 'Konsultan Medis',
    specialty: 'Kesehatan & nutrisi anak',
    color: '#30B864',
    online: false,
  },
  {
    name: 'Kak Dina, S.Pd',
    role: 'Tutor Sensory',
    specialty: 'Motorik halus & sensori',
    color: '#F77712',
    online: true,
  },
  {
    name: 'Bu Rina, M.Psi',
    role: 'Psikolog Klinis',
    specialty: 'Perilaku & regulasi emosi',
    color: '#C81E45',
    online: false,
  },
];

export default function KonsultasiScreen({ user }: { user: UserProfile }) {
  const parentName = user?.parentName || 'Bunda Dinda';

  return (
    <ScrollView
      className="flex-1 bg-[#FAF7F2]"
      contentContainerStyle={{ padding: 24, paddingBottom: 40 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View className="flex-row items-center justify-between mb-6">
        <View>
          <Text className="text-xl font-extrabold text-[#132A5E]">Konsultasi Psikolog</Text>
          <Text className="text-xs text-gray-500 font-medium mt-0.5">Ngobrol langsung dengan psikolog & fasilitator Sobat Ceria</Text>
        </View>
        <TouchableOpacity className="bg-[#C81E45] px-4 py-2.5 rounded-xl flex-row items-center gap-2 shadow-sm hover:bg-[#9F1239] transition">
          <Feather name="calendar" size={14} color="#FFFFFF" />
          <Text className="text-white text-xs font-bold">Jadwalkan Sesi</Text>
        </TouchableOpacity>
      </View>

      {/* Intro Banner */}
      <View className="rounded-2xl p-5 mb-6 relative overflow-hidden">
        <View
          className="absolute inset-0"
          style={{ backgroundImage: 'linear-gradient(135deg, #C81E45 0%, #9F1239 100%)' } as any}
        />
        <View className="relative z-10 flex-row items-center gap-4">
          <View className="w-12 h-12 rounded-2xl bg-white/15 border border-white/25 items-center justify-center shrink-0">
            <Feather name="message-circle" size={22} color="#FFFFFF" />
          </View>
          <View className="flex-1">
            <Text className="text-white text-sm font-extrabold mb-0.5">Punya pertanyaan seputar tumbuh kembang?</Text>
            <Text className="text-white/85 text-xs leading-relaxed">
              Halo {parentName}, konsultasikan kekhawatiran Anda dengan tim ahli kami — gratis untuk anggota.
            </Text>
          </View>
        </View>
      </View>

      {/* Specialist List */}
      <Text className="text-sm font-extrabold text-[#132A5E] mb-3">Tim Ahli Tersedia</Text>
      <View className="bg-white rounded-2xl border border-[#F1F5F9] shadow-sm overflow-hidden mb-6">
        {SPECIALISTS.map((s, i) => (
          <View key={s.name} className={`flex-row items-center gap-3.5 px-5 py-4 ${i < SPECIALISTS.length - 1 ? 'border-b border-[#F1F5F9]' : ''}`}>
            <View className="relative">
              <View className="w-11 h-11 rounded-full items-center justify-center" style={{ backgroundColor: `${s.color}20` }}>
                <Text className="text-xs font-black" style={{ color: s.color }}>
                  {s.name.split(' ').filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase()}
                </Text>
              </View>
              {s.online && (
                <View className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white" />
              )}
            </View>
            <View className="flex-1">
              <View className="flex-row items-center gap-2">
                <Text className="text-sm font-extrabold text-[#1E293B]">{s.name}</Text>
                {s.online && <View className="bg-emerald-50 px-2 py-0.5 rounded-full"><Text className="text-[9px] font-bold text-emerald-600">Online</Text></View>}
              </View>
              <Text className="text-[11px] text-gray-500 font-medium mt-0.5">{s.role} • {s.specialty}</Text>
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

      {/* Jadwal CTA */}
      <View className="bg-white rounded-2xl border border-[#F1F5F9] shadow-sm p-5 flex-row items-center gap-4">
        <View className="w-12 h-12 rounded-2xl bg-[#132A5E]/5 items-center justify-center shrink-0">
          <Feather name="clock" size={22} color="#132A5E" />
        </View>
        <View className="flex-1">
          <Text className="text-sm font-extrabold text-[#132A5E]">Sesi konsultasi 1:1 (30 menit)</Text>
          <Text className="text-[11px] text-gray-500 font-medium mt-0.5 leading-relaxed">
            Pilih jadwal yang sesuai, diskusi via chat atau video call langsung dengan ahli.
          </Text>
        </View>
        <TouchableOpacity
          className="bg-[#132A5E] px-4 py-2.5 rounded-xl flex-row items-center gap-2 hover:bg-[#0B1F4B] transition"
          onPress={() => {
            if (Platform.OS === 'web') {
              window.alert('Fitur penjadwalan konsultasi segera hadir.');
            } else {
              alert('Fitur penjadwalan konsultasi segera hadir.');
            }
          }}
        >
          <Feather name="calendar" size={14} color="#FFFFFF" />
          <Text className="text-white text-xs font-bold">Pilih Jadwal</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
