import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { UserProfile } from '../../types';

const LEADS = [
  { nama: 'Yayasan Harapan', kontak: '0812-3456-7890', program: 'Franchise Class Toolkit', status: 'Follow-up', nilai: 'Rp 15jt', color: '#F77712' },
  { nama: 'TK Pelangi', kontak: '0813-9876-5432', program: 'Kemitraan Sekolah', status: 'Baru', nilai: 'Rp 8jt', color: '#2DA9E9' },
  { nama: 'Komunitas Ibu Ceria', kontak: '0857-1111-2222', program: 'Reseller Worksheet', status: 'Closing', nilai: 'Rp 3jt', color: '#30B864' },
  { nama: 'PAUD Mentari', kontak: '0852-3333-4444', program: 'Kemitraan Sekolah', status: 'Follow-up', nilai: 'Rp 6jt', color: '#8B5CF6' },
];

export default function PartnerLeadsScreen({ user }: { user: UserProfile }) {
  return (
    <ScrollView className="flex-1 bg-[#FAF7F2]" contentContainerStyle={{ padding: 24, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
      <View className="flex-row items-center justify-between mb-6">
        <View>
          <Text className="text-xl font-extrabold text-[#132A5E]">Prospek Leads</Text>
          <Text className="text-xs text-gray-500 font-medium mt-0.5">Kelola calon mitra & follow-up penawaran</Text>
        </View>
        <TouchableOpacity className="bg-[#C81E45] px-4 py-2.5 rounded-xl flex-row items-center gap-2 shadow-sm hover:bg-[#9F1239] transition">
          <Feather name="user-plus" size={14} color="#FFFFFF" />
          <Text className="text-white text-xs font-bold">Tambah Leads</Text>
        </TouchableOpacity>
      </View>

      <View className="bg-white rounded-2xl border border-[#F1F5F9] shadow-sm overflow-hidden">
        {LEADS.map((l, i) => (
          <View key={l.nama} className={`flex-row items-center gap-4 px-5 py-4 ${i < LEADS.length - 1 ? 'border-b border-[#F1F5F9]' : ''}`}>
            <View className="w-11 h-11 rounded-full items-center justify-center shrink-0" style={{ backgroundColor: `${l.color}20` }}>
              <Text className="text-xs font-black" style={{ color: l.color }}>{l.nama[0]}</Text>
            </View>
            <View className="flex-1">
              <Text className="text-sm font-extrabold text-[#1E293B]" numberOfLines={1}>{l.nama}</Text>
              <Text className="text-[11px] text-gray-500 font-medium mt-0.5">{l.kontak} • {l.program}</Text>
            </View>
            <View className={`px-2.5 py-1 rounded-full ${
              l.status === 'Closing' ? 'bg-emerald-50' : l.status === 'Baru' ? 'bg-blue-50' : 'bg-amber-50'
            }`}>
              <Text className={`text-[10px] font-bold ${
                l.status === 'Closing' ? 'text-emerald-600' : l.status === 'Baru' ? 'text-blue-600' : 'text-amber-600'
              }`}>{l.status}</Text>
            </View>
            <Text className="text-xs font-extrabold text-[#1E293B]" style={{ width: 64, textAlign: 'right' }}>{l.nilai}</Text>
            <TouchableOpacity className="w-9 h-9 rounded-full bg-[#C81E45]/10 items-center justify-center">
              <Feather name="message-circle" size={15} color="#C81E45" />
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
