import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { UserProfile } from '../../types';

const VOUCHERS = [
  { code: 'REPEATORDER10', discount: 'Rp 10.000', desc: 'Diskon untuk semua kelas repeat order', color: '#C81E45', icon: 'repeat' },
  { code: 'SOBATCERIA20', discount: 'Rp 20.000', desc: 'Diskon spesial untuk kelas tematik', color: '#8B5CF6', icon: 'tag' },
  { code: 'WELCOMEKID', discount: 'Rp 15.000', desc: 'Selamat datang untuk member baru', color: '#2DA9E9', icon: 'gift' },
];

const PAKETS = [
  {
    name: 'Paket Coba',
    sessions: '4 Sesi',
    price: 199000,
    features: ['1 program kelas pilihan', 'Worksheet printable gratis', 'Konsultasi 15 menit'],
    popular: false,
  },
  {
    name: 'Paket Tumbuh',
    sessions: '8 Sesi',
    price: 349000,
    features: ['2 program kelas pilihan', 'Worksheet + rapor STPPA', 'Konsultasi 30 menit'],
    popular: true,
  },
  {
    name: 'Paket Emas',
    sessions: '12 Sesi',
    price: 479000,
    features: ['Semua program kelas', 'Rapor lengkap + voucher', 'Konsultasi unlimited chat'],
    popular: false,
  },
];

export default function VoucherScreen({ user }: { user: UserProfile }) {
  const [copied, setCopied] = useState<string | null>(null);

  const copyCode = (code: string) => {
    if (Platform.OS === 'web') {
      window.navigator?.clipboard?.writeText(code);
    }
    setCopied(code);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <ScrollView
      className="flex-1 bg-[#FAF7F2]"
      contentContainerStyle={{ padding: 24, paddingBottom: 40 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View className="mb-6">
        <Text className="text-xl font-extrabold text-[#132A5E]">Voucher & Paket</Text>
        <Text className="text-xs text-gray-500 font-medium mt-0.5">Klaim kode promo hemat dan pilih paket bundling sesi kelas</Text>
      </View>

      {/* Voucher Section */}
      <Text className="text-sm font-extrabold text-[#132A5E] mb-3">Voucher Saya</Text>
      <View className="flex-row gap-3 mb-8" style={{ flexWrap: 'wrap' }}>
        {VOUCHERS.map((v) => (
          <View
            key={v.code}
            className="bg-white rounded-2xl border border-[#F1F5F9] shadow-sm p-4 flex-row items-center gap-3.5"
            style={{ width: '32%', minWidth: 240 }}
          >
            <View className="w-11 h-11 rounded-xl items-center justify-center shrink-0" style={{ backgroundColor: `${v.color}1A` }}>
              <Feather name={v.icon as any} size={20} color={v.color} />
            </View>
            <View className="flex-1">
              <Text className="text-xs font-black text-[#1E293B]" numberOfLines={1}>{v.code}</Text>
              <Text className="text-[10px] text-gray-500 font-medium mt-0.5">{v.desc}</Text>
              <Text className="text-xs font-black mt-1" style={{ color: v.color }}>{v.discount}</Text>
            </View>
            <TouchableOpacity
              className="bg-[#C81E45] px-3.5 py-1.5 rounded-full flex-row items-center gap-1 hover:bg-[#9F1239] transition"
              onPress={() => copyCode(v.code)}
            >
              <Feather name={copied === v.code ? 'check' : 'copy'} size={12} color="#FFFFFF" />
              <Text className="text-white text-[10px] font-bold">{copied === v.code ? 'Tersalin' : 'Salin'}</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      {/* Paket Bundling Section */}
      <Text className="text-sm font-extrabold text-[#132A5E] mb-3">Paket Bundling Sesi</Text>
      <View className="flex-row gap-4" style={{ flexWrap: 'wrap' }}>
        {PAKETS.map((p) => (
          <View
            key={p.name}
            className={`flex-1 rounded-2xl border p-6 relative overflow-hidden ${
              p.popular ? 'bg-[#C81E45] border-[#C81E45] shadow-lg' : 'bg-white border-[#F1F5F9] shadow-sm'
            }`}
            style={{ minWidth: 240 }}
          >
            {p.popular && (
              <View className="absolute top-4 right-4 bg-white px-2.5 py-1 rounded-full">
                <Text className="text-[9px] font-black text-[#C81E45] uppercase">Terpopuler</Text>
              </View>
            )}
            <Text className={`text-xs font-extrabold uppercase tracking-wider ${p.popular ? 'text-white/80' : 'text-gray-400'}`}>{p.name}</Text>
            <View className="flex-row items-end gap-1 mt-2 mb-1">
              <Text className={`text-2xl font-black ${p.popular ? 'text-white' : 'text-[#132A5E]'}`}>Rp {p.price.toLocaleString('id-ID')}</Text>
              <Text className={`text-xs font-medium mb-1 ${p.popular ? 'text-white/80' : 'text-gray-400'}`}>/ {p.sessions}</Text>
            </View>
            <View className={`flex-col gap-1.5 my-4 ${p.popular ? '' : 'border-t border-[#F1F5F9] pt-4'}`}>
              {p.features.map((f) => (
                <View key={f} className="flex-row items-center gap-2">
                  <Feather name="check-circle" size={14} color={p.popular ? '#FFD100' : '#30B864'} />
                  <Text className={`text-xs font-medium ${p.popular ? 'text-white/90' : 'text-gray-600'}`}>{f}</Text>
                </View>
              ))}
            </View>
            <TouchableOpacity
              className={`py-3 rounded-xl items-center justify-center ${p.popular ? 'bg-white' : 'bg-[#C81E45]'} hover:opacity-90 transition`}
            >
              <Text className={`text-sm font-bold ${p.popular ? 'text-[#C81E45]' : 'text-white'}`}>Pilih Paket</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
