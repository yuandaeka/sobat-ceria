import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { UserProfile } from '../../types';

const ASPECTS = [
  { label: 'Motorik Halus', pct: 88, status: 'Optimal', icon: 'edit-3', color: '#3B82F6' },
  { label: 'Komunikasi', pct: 92, status: 'Sangat Baik', icon: 'message-circle', color: '#F97316' },
  { label: 'Kognitif', pct: 85, status: 'Optimal', icon: 'cpu', color: '#C81E45' },
  { label: 'Sosial-Emosi', pct: 65, status: 'Perlu Stimulasi', icon: 'heart', color: '#14B8A6' },
  { label: 'Seni & Kriya', pct: 90, status: 'Optimal', icon: 'pen-tool', color: '#8B5CF6' },
];

const NOTES = [
  {
    name: 'Bunda Sarah, M.Psi',
    role: 'Psikolog Anak',
    color: '#8B5CF6',
    date: '12 Agu 2026',
    text: 'Arka menunjukkan perkembangan bahasa yang sangat baik. Kosakata aktifnya bertambah signifikan dan sudah mampu bercerita dua arah. Disarankan lanjut stimulasi percakapan rutin di rumah.',
  },
  {
    name: 'Kak Fatimah, S.Pd',
    role: 'Tutor Science',
    color: '#2DA9E9',
    date: '05 Agu 2026',
    text: 'Rasa ingin tahu Arka tinggi saat sesi eksperimen STEAM. Ia antusias mencoba dan bertanya. Pertahankan eksplorasi sains sederhana untuk mengasah berpikir kritis.',
  },
];

export default function RaporAnakScreen({ user }: { user: UserProfile }) {
  const child = user?.children?.[0] || { name: 'Arka', age: 4 };

  return (
    <ScrollView
      className="flex-1 bg-[#FAF7F2]"
      contentContainerStyle={{ padding: 24, paddingBottom: 40 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View className="flex-row items-center justify-between mb-6">
        <View>
          <Text className="text-xl font-extrabold text-[#132A5E]">Rapor Anak</Text>
          <Text className="text-xs text-gray-500 font-medium mt-0.5">Rekap perkembangan STPPA berdasarkan sesi terbaru</Text>
        </View>
        <View className="bg-white px-3.5 py-2 rounded-xl border border-[#F1F5F9] shadow-sm flex-row items-center gap-1.5">
          <Text className="text-xs">👦</Text>
          <Text className="text-xs font-bold text-[#1E293B]">{child.name} • {child.age} Thn</Text>
          <Feather name="chevron-down" size={14} color="#94A3B8" />
        </View>
      </View>

      {/* Summary Card */}
      <View className="rounded-2xl p-6 mb-6 flex-row items-center justify-between relative overflow-hidden">
        <View
          className="absolute inset-0"
          style={{ backgroundImage: 'linear-gradient(135deg, #132A5E 0%, #1E293B 100%)' } as any}
        />
        <View className="absolute -top-10 -right-6 w-40 h-40 rounded-full bg-white/5" />
        <View className="relative z-10 flex-1 pr-4">
          <Text className="text-white/70 text-[11px] font-bold uppercase tracking-wider mb-1">Rata-rata Perkembangan</Text>
          <Text className="text-3xl font-black text-white">84%</Text>
          <Text className="text-white/80 text-xs mt-1">Level 1 • 3 dari 4 sesi selesai</Text>
        </View>
        <View className="relative z-10 bg-white/10 border border-white/20 rounded-2xl px-4 py-3 flex-row items-center gap-2">
          <Feather name="trending-up" size={18} color="#FFD100" />
          <Text className="text-white text-xs font-bold">Perkembangan Positif</Text>
        </View>
      </View>

      {/* Aspek STPPA */}
      <Text className="text-sm font-extrabold text-[#132A5E] mb-3">Perkembangan 5 Aspek STPPA</Text>
      <View className="bg-white rounded-2xl border border-[#F1F5F9] shadow-sm p-5 mb-6">
        {ASPECTS.map((a, i) => (
          <View key={a.label} className={`flex-row items-center gap-4 ${i > 0 ? 'pt-4' : ''} ${i < ASPECTS.length - 1 ? 'pb-4 border-b border-[#F1F5F9]' : ''}`}>
            <View className="w-11 h-11 rounded-xl items-center justify-center shrink-0" style={{ backgroundColor: `${a.color}1A` }}>
              <Feather name={a.icon as any} size={20} color={a.color} />
            </View>
            <View className="flex-1">
              <View className="flex-row items-center justify-between mb-1.5">
                <Text className="text-sm font-extrabold text-[#1E293B]">{a.label}</Text>
                <View className="flex-row items-center gap-2">
                  <Text className="text-xs font-black" style={{ color: a.color }}>{a.pct}%</Text>
                  <View className="px-2 py-0.5 rounded-full" style={{ backgroundColor: `${a.color}1A` }}>
                    <Text className="text-[10px] font-bold" style={{ color: a.color }}>{a.status}</Text>
                  </View>
                </View>
              </View>
              <View className="h-2.5 w-full bg-gray-100 rounded-full overflow-hidden">
                <View className="h-full rounded-full" style={{ width: `${a.pct}%`, backgroundColor: a.color }} />
              </View>
            </View>
          </View>
        ))}
      </View>

      {/* Catatan Fasilitator */}
      <Text className="text-sm font-extrabold text-[#132A5E] mb-3">Catatan Fasilitator & Psikolog</Text>
      <View className="flex-col gap-3 mb-6">
        {NOTES.map((n) => (
          <View key={n.name} className="bg-white rounded-2xl border border-[#F1F5F9] shadow-sm p-5 flex-row items-start gap-3.5">
            <View className="w-10 h-10 rounded-full items-center justify-center shrink-0" style={{ backgroundColor: `${n.color}20` }}>
              <Text className="text-xs font-black" style={{ color: n.color }}>
                {n.name.split(' ').filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase()}
              </Text>
            </View>
            <View className="flex-1">
              <View className="flex-row items-center justify-between mb-1">
                <View>
                  <Text className="text-xs font-extrabold text-[#1E293B]">{n.name}</Text>
                  <Text className="text-[10px] text-gray-400 font-medium">{n.role}</Text>
                </View>
                <Text className="text-[10px] text-gray-400 font-medium">{n.date}</Text>
              </View>
              <Text className="text-xs text-gray-600 leading-relaxed font-medium">"{n.text}"</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Download */}
      <TouchableOpacity
        className="bg-[#C81E45] py-3.5 rounded-xl items-center justify-center flex-row gap-2 shadow-md hover:bg-[#9F1239] transition"
        onPress={() => {
          if (Platform.OS === 'web') {
            window.alert('Mengunduh Rapor PDF Sobat Ceria...');
          } else {
            alert('Mengunduh Rapor PDF Sobat Ceria...');
          }
        }}
      >
        <Feather name="download" size={16} color="#FFFFFF" />
        <Text className="text-white text-sm font-bold">Unduh Rapor Lengkap (PDF)</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
