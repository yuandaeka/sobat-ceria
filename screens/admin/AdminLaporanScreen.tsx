import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { UserProfile } from '../../types';

const PENDAPATAN = [
  { bulan: 'Mar', nilai: 40 },
  { bulan: 'Apr', nilai: 55 },
  { bulan: 'Mei', nilai: 48 },
  { bulan: 'Jun', nilai: 70 },
  { bulan: 'Jul', nilai: 85 },
  { bulan: 'Agu', nilai: 100 },
];

const RINGKASAN = [
  { label: 'Pendapatan Bulan Ini', value: 'Rp 24.000.000', icon: 'dollar-sign', color: '#30B864' },
  { label: 'Order Bulan Ini', value: '326 order', icon: 'shopping-bag', color: '#C81E45' },
  { label: 'Pengguna Baru', value: '82 user', icon: 'user-plus', color: '#2DA9E9' },
];

export default function AdminLaporanScreen({ user }: { user: UserProfile }) {
  return (
    <ScrollView className="flex-1 bg-[#FAF7F2]" contentContainerStyle={{ padding: 24, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
      <View className="mb-6">
        <Text className="text-xl font-extrabold text-[#132A5E]">Laporan</Text>
        <Text className="text-xs text-gray-500 font-medium mt-0.5">Rekap penjualan, kehadiran, dan pertumbuhan platform</Text>
      </View>

      {/* Ringkasan */}
      <View className="flex-row gap-3 mb-6" style={{ flexWrap: 'wrap' }}>
        {RINGKASAN.map((r) => (
          <View key={r.label} className="flex-1 bg-white rounded-2xl border border-[#F1F5F9] shadow-sm p-5 flex-row items-center gap-3" style={{ minWidth: 200 }}>
            <View className="w-11 h-11 rounded-xl items-center justify-center shrink-0" style={{ backgroundColor: `${r.color}1A` }}>
              <Feather name={r.icon as any} size={20} color={r.color} />
            </View>
            <View>
              <Text className="text-base font-black text-[#132A5E]">{r.value}</Text>
              <Text className="text-[10px] font-bold text-gray-500 mt-1">{r.label}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Grafik Pendapatan */}
      <Text className="text-sm font-extrabold text-[#132A5E] mb-3">Pendapatan 6 Bulan Terakhir</Text>
      <View className="bg-white rounded-2xl border border-[#F1F5F9] shadow-sm p-6 mb-6">
        <View className="flex-row items-end justify-between" style={{ height: 180 }}>
          {PENDAPATAN.map((p) => (
            <View key={p.bulan} className="items-center flex-1">
              <View
                className="w-full rounded-t-lg"
                style={{ height: p.nilai * 1.6, backgroundColor: p.bulan === 'Agu' ? '#C81E45' : '#F3B7C7' }}
              />
            </View>
          ))}
        </View>
        <View className="flex-row justify-between mt-2">
          {PENDAPATAN.map((p) => (
            <Text key={p.bulan} className="text-[10px] font-bold text-gray-500 flex-1 text-center">{p.bulan}</Text>
          ))}
        </View>
      </View>

      {/* Kehadiran Kelas */}
      <Text className="text-sm font-extrabold text-[#132A5E] mb-3">Kelas Terlaris</Text>
      <View className="bg-white rounded-2xl border border-[#F1F5F9] shadow-sm overflow-hidden">
        {[
          { nama: 'Science Class', order: 86, pct: 100 },
          { nama: 'Mini Stimulation Class', order: 74, pct: 86 },
          { nama: 'Art and Craft Class', order: 58, pct: 67 },
          { nama: 'Cooking Class', order: 49, pct: 57 },
        ].map((k, i) => (
          <View key={k.nama} className={`flex-row items-center gap-4 px-5 py-4 ${i < 3 ? 'border-b border-[#F1F5F9]' : ''}`}>
            <View className="w-10 h-10 rounded-full bg-[#C81E45]/10 items-center justify-center shrink-0">
              <Feather name="book-open" size={17} color="#C81E45" />
            </View>
            <View className="flex-1">
              <View className="flex-row items-center justify-between mb-1.5">
                <Text className="text-sm font-extrabold text-[#1E293B]">{k.nama}</Text>
                <Text className="text-xs font-bold text-gray-500">{k.order} order</Text>
              </View>
              <View className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                <View className="h-full rounded-full bg-[#C81E45]" style={{ width: `${k.pct}%` }} />
              </View>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
