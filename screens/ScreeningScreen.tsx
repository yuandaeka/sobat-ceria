import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Platform, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { ScreeningResult } from '../types';

const MOCK_RESULTS: ScreeningResult[] = [
  {
    id: 's1',
    childName: 'Arka',
    category: 'Motorik Kasar & Halus',
    status: 'Berkembang Sesuai Harapan',
    scoreDate: '01 Aug 2026',
    psychologistNotes: 'Koordinasi jemari Arka sangat baik saat memegang kuas melukis dan membentuk tanah liat. Kekuatan fisik kasar dan keseimbangan sudah matang.'
  },
  {
    id: 's2',
    childName: 'Arka',
    category: 'Bahasa & Bicara (Speech)',
    status: 'Mulai Berkembang',
    scoreDate: '01 Aug 2026',
    psychologistNotes: 'Arka dapat memahami instruksi fasilitator dengan lancar. Disarankan latihan rutin percakapan dua arah di rumah dan membatasi screen time gadget.'
  },
  {
    id: 's3',
    childName: 'Arka',
    category: 'Sosial Emosional & Mindfulness',
    status: 'Berkembang Sesuai Harapan',
    scoreDate: '01 Aug 2026',
    psychologistNotes: 'Arka menunjukkan empati tinggi saat sesi lingkaran cerita dan dengan sabar mau antre berbagi alat mainan bersama teman sebaya.'
  }
];

export default function ScreeningScreen({ navigation, user }: { navigation: any; user: any }) {
  const child = user?.children?.[0] || { name: 'Arka', age: 4 };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Berkembang Sesuai Harapan':
        return { text: 'text-[#30B864]', bg: 'bg-[#30B864]/10 border-[#30B864]/20', bar: 'bg-[#30B864] w-full' };
      case 'Mulai Berkembang':
        return { text: 'text-[#2DA9E9]', bg: 'bg-[#2DA9E9]/10 border-[#2DA9E9]/20', bar: 'bg-[#2DA9E9] w-3/4' };
      default:
        return { text: 'text-[#D82B5A]', bg: 'bg-[#D82B5A]/10 border-[#D82B5A]/20', bar: 'bg-[#D82B5A] w-1/2' };
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }} className="bg-[#FAF6F0]">
      <ScrollView contentContainerStyle={{ paddingBottom: 110 }} className="p-4 md:p-8 max-w-5xl mx-auto w-full" showsVerticalScrollIndicator={false}>
        {/* Header Title */}
        <View className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-xs mb-6 flex-row items-center justify-between">
          <View>
            <View className="flex-row items-center gap-2 mb-1">
              <View className="w-2.5 h-2.5 rounded-full bg-[#D82B5A]" />
              <Text className="text-lg md:text-xl font-extrabold text-[#162E5C]">Screening STPPA Digital</Text>
            </View>
            <Text className="text-xs text-gray-500 font-medium">
              Hasil evaluasi 6 aspek perkembangan anak oleh psikolog & fasilitator Sobat Ceria.
            </Text>
          </View>

          <View className="bg-[#D82B5A]/10 px-3.5 py-1.5 rounded-full border border-[#D82B5A]/20">
            <Text className="text-xs font-black text-[#D82B5A]">{child.name} ({child.age} Thn)</Text>
          </View>
        </View>

        {/* Info Banner STPPA */}
        <View className="bg-[#162E5C] p-6 rounded-[2.5rem] mb-6 shadow-md text-white flex-col justify-between">
          <View className="flex-row items-center gap-2 mb-2">
            <Feather name="shield" size={18} color="#FFD100" />
            <Text className="text-white text-sm font-extrabold">Standar Tingkat Pencapaian Perkembangan Anak (STPPA)</Text>
          </View>
          <Text className="text-gray-300 text-xs leading-relaxed font-medium mb-4">
            Pemantauan berkala 6 aspek perkembangan utama: Nilai Agama & Moral, Motorik, Kognitif, Bahasa, Sosial-Emosional, serta Seni.
          </Text>
          <View className="bg-white/10 p-3 rounded-2xl border border-white/20 flex-row items-center gap-2">
            <Feather name="check-circle" size={14} color="#30B864" />
            <Text className="text-[11px] text-white font-semibold">Tersusun otomatis oleh Tim Psikolog FKIP UMS</Text>
          </View>
        </View>

        {/* Screening Results List */}
        <Text className="text-base font-extrabold text-[#162E5C] mb-3">Laporan Hasil Sesi Terbaru</Text>
        <View className="grid grid-cols-1 gap-4 mb-6">
          {MOCK_RESULTS.map((result) => {
            const badge = getStatusBadge(result.status);
            return (
              <View key={result.id} className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xs p-6 card-hover-effect">
                <View className="flex-row justify-between items-start mb-3">
                  <View className="flex-1 mr-2">
                    <Text className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">{result.scoreDate}</Text>
                    <Text className="text-base font-extrabold text-[#162E5C] mt-0.5">{result.category}</Text>
                  </View>
                  <View className={`px-3 py-1 rounded-full border ${badge.bg}`}>
                    <Text className={`text-[10px] font-black ${badge.text}`}>{result.status}</Text>
                  </View>
                </View>

                {/* Progress Bar */}
                <View className="h-2.5 w-full bg-gray-100 rounded-full overflow-hidden mb-4">
                  <View className={`h-full rounded-full ${badge.bar}`} />
                </View>

                {/* Psychologist Notes */}
                <View className="bg-[#FAF6F0] p-4 rounded-2xl border border-gray-200/60">
                  <View className="flex-row items-center gap-2 mb-1.5">
                    <Feather name="edit-3" size={14} color="#D82B5A" />
                    <Text className="text-xs font-extrabold text-[#162E5C]">Catatan Fasilitator / Psikolog:</Text>
                  </View>
                  <Text className="text-xs text-gray-600 leading-relaxed italic font-medium">
                    "{result.psychologistNotes}"
                  </Text>
                </View>
              </View>
            );
          })}
        </View>

        {/* Download PDF Action Button */}
        <TouchableOpacity 
          className="bg-[#D82B5A] p-4 rounded-full items-center shadow-md hover:bg-[#B01E49] transition-transform active:scale-98 flex-row justify-center gap-2"
          onPress={() => {
            if (Platform.OS === 'web') {
              window.alert('Mengunduh Laporan PDF STPPA Sobat Ceria...');
            } else {
              alert('Mengunduh Laporan PDF STPPA Sobat Ceria...');
            }
          }}
        >
          <Feather name="download" size={18} color="#FFFFFF" />
          <Text className="text-white text-xs font-extrabold">Unduh Laporan PDF STPPA Lengkap</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}
