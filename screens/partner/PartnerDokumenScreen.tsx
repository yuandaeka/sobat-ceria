import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { UserProfile } from '../../types';

const DOKUMEN = [
  { nama: 'Kontrak Mitra.pdf', kategori: 'Perjanjian', ukuran: '1.9 MB', tanggal: '10 Agu 2026', color: '#C81E45', icon: 'file-text' },
  { nama: 'Panduan Kemitraan.pdf', kategori: 'Panduan', ukuran: '3.2 MB', tanggal: '08 Agu 2026', color: '#2DA9E9', icon: 'book-open' },
  { nama: 'Formulir Pendaftaran Mitra.pdf', kategori: 'Formulir', ukuran: '850 KB', tanggal: '05 Agu 2026', color: '#30B864', icon: 'file' },
  { nama: 'Harga & Katalog Produk.xlsx', kategori: 'Katalog', ukuran: '2.1 MB', tanggal: '01 Agu 2026', color: '#F77712', icon: 'bar-chart-2' },
];

export default function PartnerDokumenScreen({ user }: { user: UserProfile }) {
  return (
    <ScrollView className="flex-1 bg-[#FAF7F2]" contentContainerStyle={{ padding: 24, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
      <View className="flex-row items-center justify-between mb-6">
        <View>
          <Text className="text-xl font-extrabold text-[#132A5E]">Dokumen Mitra</Text>
          <Text className="text-xs text-gray-500 font-medium mt-0.5">Kontrak, panduan, dan dokumen kemitraan</Text>
        </View>
        <TouchableOpacity
          className="bg-[#C81E45] px-4 py-2.5 rounded-xl flex-row items-center gap-2 shadow-sm hover:bg-[#9F1239] transition"
          onPress={() => {
            if (Platform.OS === 'web') {
              window.alert('Unggah dokumen baru (fitur segera hadir).');
            } else {
              alert('Unggah dokumen baru (fitur segera hadir).');
            }
          }}
        >
          <Feather name="upload" size={14} color="#FFFFFF" />
          <Text className="text-white text-xs font-bold">Unggah</Text>
        </TouchableOpacity>
      </View>

      <View className="bg-white rounded-2xl border border-[#F1F5F9] shadow-sm overflow-hidden">
        {DOKUMEN.map((d, i) => (
          <View key={d.nama} className={`flex-row items-center gap-4 px-5 py-4 ${i < DOKUMEN.length - 1 ? 'border-b border-[#F1F5F9]' : ''}`}>
            <View className="w-11 h-11 rounded-xl items-center justify-center shrink-0" style={{ backgroundColor: `${d.color}1A` }}>
              <Feather name={d.icon as any} size={20} color={d.color} />
            </View>
            <View className="flex-1">
              <Text className="text-sm font-extrabold text-[#1E293B]" numberOfLines={1}>{d.nama}</Text>
              <Text className="text-[11px] text-gray-500 font-medium mt-0.5">{d.kategori} • {d.ukuran} • {d.tanggal}</Text>
            </View>
            <TouchableOpacity className="w-9 h-9 rounded-full bg-[#C81E45]/10 items-center justify-center">
              <Feather name="download" size={15} color="#C81E45" />
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
