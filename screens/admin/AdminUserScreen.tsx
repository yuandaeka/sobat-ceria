import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { UserProfile } from '../../types';

const USER = [
  { nama: 'Bunda Dinda', email: 'dinda@sobatceria.id', role: 'Orang Tua', color: '#C81E45', aktif: true },
  { nama: 'Kak Rian', email: 'rian@sobatceria.id', role: 'Guru / Tutor', color: '#8B22C0', aktif: true },
  { nama: 'Bunda Sarah', email: 'sarah@sobatceria.id', role: 'Admin', color: '#162E5C', aktif: true },
  { nama: 'Kak Dina', email: 'dina@sobatceria.id', role: 'Volunteer', color: '#2DA9E9', aktif: true },
  { nama: 'Yayasan Harapan', email: 'mitra@harapan.org', role: 'Mitra', color: '#F77712', aktif: false },
];

export default function AdminUserScreen({ user }: { user: UserProfile }) {
  return (
    <ScrollView className="flex-1 bg-[#FAF7F2]" contentContainerStyle={{ padding: 24, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
      <View className="flex-row items-center justify-between mb-6">
        <View>
          <Text className="text-xl font-extrabold text-[#132A5E]">Kelola Pengguna & Role</Text>
          <Text className="text-xs text-gray-500 font-medium mt-0.5">Atur akses dan peran pengguna platform</Text>
        </View>
        <TouchableOpacity className="bg-[#C81E45] px-4 py-2.5 rounded-xl flex-row items-center gap-2 shadow-sm hover:bg-[#9F1239] transition">
          <Feather name="user-plus" size={14} color="#FFFFFF" />
          <Text className="text-white text-xs font-bold">Tambah Pengguna</Text>
        </TouchableOpacity>
      </View>

      <View className="bg-white rounded-2xl border border-[#F1F5F9] shadow-sm overflow-hidden">
        {USER.map((u, i) => (
          <View key={u.email} className={`flex-row items-center gap-4 px-5 py-4 ${i < USER.length - 1 ? 'border-b border-[#F1F5F9]' : ''}`}>
            <View className="w-11 h-11 rounded-full items-center justify-center shrink-0" style={{ backgroundColor: `${u.color}20` }}>
              <Text className="text-xs font-black" style={{ color: u.color }}>{u.nama[0]}</Text>
            </View>
            <View className="flex-1">
              <Text className="text-sm font-extrabold text-[#1E293B]" numberOfLines={1}>{u.nama}</Text>
              <Text className="text-[11px] text-gray-500 font-medium mt-0.5">{u.email}</Text>
            </View>
            <View className="px-2.5 py-1 rounded-full" style={{ backgroundColor: `${u.color}1A` }}>
              <Text className="text-[10px] font-bold" style={{ color: u.color }}>{u.role}</Text>
            </View>
            <View className={`px-2.5 py-1 rounded-full ${u.aktif ? 'bg-emerald-50' : 'bg-gray-100'}`}>
              <Text className={`text-[10px] font-bold ${u.aktif ? 'text-emerald-600' : 'text-gray-500'}`}>{u.aktif ? 'Aktif' : 'Nonaktif'}</Text>
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
