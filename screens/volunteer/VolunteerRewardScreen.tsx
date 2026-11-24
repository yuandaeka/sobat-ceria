import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { UserProfile } from '../../types';

const BADGES = [
  { name: 'Pendamping Pertama', desc: 'Selesaikan tugas pertama', icon: 'award', color: '#C81E45', unlocked: true },
  { name: 'Sahabat Anak', desc: 'Dampingi 10 sesi kelas', icon: 'heart', color: '#8B5CF6', unlocked: true },
  { name: 'Dokumentator Ceria', desc: 'Unggah 50 foto kegiatan', icon: 'camera', color: '#2DA9E9', unlocked: true },
  { name: 'Relawan Emas', desc: 'Kumpulkan 500 poin', icon: 'star', color: '#F59E0B', unlocked: false },
  { name: 'Super Fasilitator', desc: 'Dampingi 30 sesi', icon: 'users', color: '#30B864', unlocked: false },
  { name: 'Pahlawan Ceria', desc: 'Kumpulkan 1000 poin', icon: 'shield', color: '#1E293B', unlocked: false },
];

export default function VolunteerRewardScreen({ user }: { user: UserProfile }) {
  return (
    <ScrollView className="flex-1 bg-[#FAF7F2]" contentContainerStyle={{ padding: 24, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
      <View className="mb-6">
        <Text className="text-xl font-extrabold text-[#132A5E]">Poin & Reward</Text>
        <Text className="text-xs text-gray-500 font-medium mt-0.5">Kumpulkan poin dari setiap tugas yang Anda selesaikan</Text>
      </View>

      {/* Poin Card */}
      <View className="rounded-2xl p-6 mb-6 relative overflow-hidden">
        <View className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(135deg, #C81E45 0%, #9F1239 100%)' } as any} />
        <View className="absolute -top-10 -right-6 w-40 h-40 rounded-full bg-white/10" />
        <View className="relative z-10 flex-row items-center gap-4">
          <View className="w-14 h-14 rounded-2xl bg-white/15 border border-white/25 items-center justify-center">
            <Feather name="award" size={26} color="#FFFFFF" />
          </View>
          <View className="flex-1">
            <Text className="text-white/80 text-[11px] font-bold uppercase tracking-wider">Poin Anda</Text>
            <Text className="text-3xl font-black text-white">320</Text>
          </View>
          <View className="items-end">
            <Text className="text-white/80 text-[11px] font-bold">Badge Terbuka</Text>
            <Text className="text-white text-lg font-black">3 / 6</Text>
          </View>
        </View>
      </View>

      {/* Badges */}
      <Text className="text-sm font-extrabold text-[#132A5E] mb-3">Koleksi Badge</Text>
      <View className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {BADGES.map((b) => (
          <View key={b.name} className={`rounded-2xl border p-5 items-center ${b.unlocked ? 'bg-white border-[#F1F5F9] shadow-sm' : 'bg-gray-50 border-[#F1F5F9] opacity-70'}`}>
            <View className="w-14 h-14 rounded-full items-center justify-center mb-3" style={{ backgroundColor: `${b.color}1A` }}>
              <Feather name={b.icon as any} size={26} color={b.unlocked ? b.color : '#9CA3AF'} />
            </View>
            <Text className={`text-sm font-extrabold text-center ${b.unlocked ? 'text-[#1E293B]' : 'text-gray-400'}`}>{b.name}</Text>
            <Text className="text-[10px] text-gray-500 font-medium text-center mt-1">{b.desc}</Text>
            {!b.unlocked && (
              <View className="mt-2 flex-row items-center gap-1">
                <Feather name="lock" size={11} color="#9CA3AF" />
                <Text className="text-[10px] font-bold text-gray-400">Terkunci</Text>
              </View>
            )}
          </View>
        ))}
      </View>

      {/* Info */}
      <View className="bg-white rounded-2xl border border-[#F1F5F9] shadow-sm p-5 flex-row items-center gap-3.5">
        <View className="w-11 h-11 rounded-xl bg-[#F59E0B]/10 items-center justify-center">
          <Feather name="trending-up" size={19} color="#F59E0B" />
        </View>
        <View className="flex-1">
          <Text className="text-xs font-extrabold text-[#1E293B]">Poin dapat ditukar merchandise</Text>
          <Text className="text-[11px] text-gray-500 font-medium mt-0.5 leading-relaxed">
            Kumpulkan poin lebih banyak untuk menukar merchandise eksklusif Sobat Ceria.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}
