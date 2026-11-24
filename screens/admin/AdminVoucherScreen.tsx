import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { UserProfile } from '../../types';

const VOUCHER = [
  { code: 'REPEATORDER10', diskon: 'Rp 10.000', deskripsi: 'Diskon semua kelas repeat order', aktif: true },
  { code: 'SOBATCERIA20', diskon: 'Rp 20.000', deskripsi: 'Diskon spesial kelas tematik', aktif: true },
  { code: 'WELCOMEKID', diskon: 'Rp 15.000', deskripsi: 'Selamat datang member baru', aktif: true },
  { code: 'LIBURAN20', diskon: 'Rp 20.000', deskripsi: 'Promo musim liburan', aktif: false },
];

export default function AdminVoucherScreen({ user }: { user: UserProfile }) {
  return (
    <ScrollView className="flex-1 bg-[#FAF7F2]" contentContainerStyle={{ padding: 24, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
      <View className="flex-row items-center justify-between mb-6">
        <View>
          <Text className="text-xl font-extrabold text-[#132A5E]">Kelola Voucher</Text>
          <Text className="text-xs text-gray-500 font-medium mt-0.5">Atur kode promo & besaran diskon</Text>
        </View>
        <TouchableOpacity className="bg-[#C81E45] px-4 py-2.5 rounded-xl flex-row items-center gap-2 shadow-sm hover:bg-[#9F1239] transition">
          <Feather name="plus" size={14} color="#FFFFFF" />
          <Text className="text-white text-xs font-bold">Tambah Voucher</Text>
        </TouchableOpacity>
      </View>

      <View className="bg-white rounded-2xl border border-[#F1F5F9] shadow-sm overflow-hidden">
        {VOUCHER.map((v, i) => (
          <View key={v.code} className={`flex-row items-center gap-4 px-5 py-4 ${i < VOUCHER.length - 1 ? 'border-b border-[#F1F5F9]' : ''}`}>
            <View className="w-11 h-11 rounded-xl bg-[#F59E0B]/10 items-center justify-center shrink-0">
              <Feather name="tag" size={19} color="#F59E0B" />
            </View>
            <View className="flex-1">
              <Text className="text-sm font-extrabold text-[#1E293B]">{v.code}</Text>
              <Text className="text-[11px] text-gray-500 font-medium mt-0.5">{v.deskripsi}</Text>
            </View>
            <Text className="text-xs font-black text-[#C81E45]">{v.diskon}</Text>
            <View className={`px-2.5 py-1 rounded-full ${v.aktif ? 'bg-emerald-50' : 'bg-gray-100'}`}>
              <Text className={`text-[10px] font-bold ${v.aktif ? 'text-emerald-600' : 'text-gray-500'}`}>{v.aktif ? 'Aktif' : 'Nonaktif'}</Text>
            </View>
            <TouchableOpacity className="w-9 h-9 rounded-full bg-[#C81E45]/10 items-center justify-center">
              <Feather name="edit-3" size={15} color="#C81E45" />
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
