import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { UserProfile } from '../../types';

const MATERI = [
  { nama: 'Logo Sobat Ceria (High Res)', tipe: 'PNG / SVG', deskripsi: 'Untuk media promosi digital & cetak', color: '#C81E45', icon: 'image' },
  { nama: 'Template Poster Promo', tipe: 'Canva / PSD', deskripsi: 'Poster siap edit untuk sosmed', color: '#2DA9E9', icon: 'layout' },
  { nama: 'Banner & Feed Instagram', tipe: 'JPG', deskripsi: 'Ukuran feed, story, dan banner', color: '#8B5CF6', icon: 'monitor' },
  { nama: 'Katalog Program Kelas', tipe: 'PDF', deskripsi: 'Katalog resmi untuk ditawarkan', color: '#30B864', icon: 'book-open' },
  { nama: 'Video Company Profile', tipe: 'MP4', deskripsi: 'Video profil Sobat Ceria 2 menit', color: '#F77712', icon: 'video' },
  { nama: 'Kop Surat & Materai Digital', tipe: 'DOC', deskripsi: 'Template dokumen resmi', color: '#64748B', icon: 'file-text' },
];

export default function PartnerBrandingScreen({ user }: { user: UserProfile }) {
  return (
    <ScrollView className="flex-1 bg-[#FAF7F2]" contentContainerStyle={{ padding: 24, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
      <View className="mb-6">
        <Text className="text-xl font-extrabold text-[#132A5E]">Materi Branding</Text>
        <Text className="text-xs text-gray-500 font-medium mt-0.5">Aset promosi & materi pemasaran untuk mitra</Text>
      </View>

      <View className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {MATERI.map((m) => (
          <View key={m.nama} className="bg-white rounded-2xl border border-[#F1F5F9] shadow-sm overflow-hidden">
            <View className="h-24 items-center justify-center" style={{ backgroundColor: `${m.color}1A` }}>
              <Feather name={m.icon as any} size={30} color={m.color} />
            </View>
            <View className="p-4">
              <Text className="text-sm font-extrabold text-[#1E293B]" numberOfLines={1}>{m.nama}</Text>
              <Text className="text-[11px] text-gray-500 font-medium mt-0.5">{m.deskripsi}</Text>
              <View className="flex-row items-center justify-between mt-3 pt-3 border-t border-[#F1F5F9]">
                <Text className="text-[10px] font-bold text-gray-400">{m.tipe}</Text>
                <TouchableOpacity className="bg-[#C81E45] px-3.5 py-1.5 rounded-full flex-row items-center gap-1">
                  <Feather name="download" size={12} color="#FFFFFF" />
                  <Text className="text-white text-[10px] font-bold">Unduh</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
