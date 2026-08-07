import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { fetchWorksheets, fetchVouchers, WorksheetData, VoucherData } from '../lib/data';

interface Worksheet {
  id: string;
  title: string;
  ageGroup: string;
  category: string;
  pages: number;
}

const MOCK_WORKSHEETS: Worksheet[] = [
  {
    id: 'w1',
    title: 'Focus & Sensory Tracer Kit (PDF Printable)',
    ageGroup: 'Usia 2-3 Tahun',
    category: 'Mini Stimulation',
    pages: 12
  },
  {
    id: 'w2',
    title: 'Clay Sculpting & Color Mix Guide',
    ageGroup: 'Usia 3-5 Tahun',
    category: 'Art & Craft',
    pages: 18
  },
  {
    id: 'w3',
    title: 'STEAM Fun: Simple Science Experiment Worksheet',
    ageGroup: 'Usia 5-7 Tahun',
    category: 'Science Class',
    pages: 15
  }
];

export default function RewardScreen({ navigation, user }: { navigation: any; user: any }) {
  const [worksheets, setWorksheets] = useState<Worksheet[]>(MOCK_WORKSHEETS);
  const [voucherCode, setVoucherCode] = useState<string>('CERIA10K');

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const [wsData, voucherData] = await Promise.all([
          fetchWorksheets(),
          fetchVouchers(),
        ]);
        if (mounted) {
          if (wsData.length > 0) {
            setWorksheets(wsData.map((w: WorksheetData) => ({
              id: w.id,
              title: w.title,
              ageGroup: w.age_group,
              category: w.category,
              pages: w.pages,
            })));
          }
          if (voucherData.length > 0) {
            setVoucherCode(voucherData[0].code);
          }
        }
      } catch {
        // fallback mock
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const handleDownload = (title: string) => {
    if (Platform.OS === 'web') {
      window.alert(`Mengunduh printable PDF "${title}" Sobat Ceria...`);
    } else {
      alert(`Mengunduh printable PDF "${title}" Sobat Ceria...`);
    }
  };

  const handleCopyCode = () => {
    if (Platform.OS === 'web') {
      window.navigator?.clipboard?.writeText(voucherCode);
      window.alert(`Kode voucher "${voucherCode}" berhasil disalin!`);
    } else {
      alert(`Kode voucher "${voucherCode}" berhasil disalin!`);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }} className="bg-[#FAF6F0]">
      <ScrollView contentContainerStyle={{ paddingBottom: 110 }} className="p-4 md:p-8 max-w-5xl mx-auto w-full" showsVerticalScrollIndicator={false}>
        
        {/* Header */}
        <View className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-xs mb-6">
          <View className="flex-row items-center gap-2 mb-1">
            <View className="w-2.5 h-2.5 rounded-full bg-[#D82B5A]" />
            <Text className="text-lg md:text-xl font-extrabold text-[#162E5C]">Reward & Worksheet Gratis</Text>
          </View>
          <Text className="text-xs text-gray-500 font-medium">
            Klaim voucher hemat dan unduh materi lembar kerja printable siap cetak untuk si kecil.
          </Text>
        </View>

        {/* Voucher Promo Card */}
        <View className="bg-white border border-gray-100 shadow-xs rounded-[2.5rem] p-6 md:p-8 mb-6 card-hover-effect">
          <View className="flex-row justify-between items-center mb-3">
            <View className="flex-1 mr-2">
              <View className="bg-[#D82B5A]/10 self-start px-3 py-1 rounded-full mb-1 border border-[#D82B5A]/20">
                <Text className="text-[10px] font-black text-[#D82B5A] uppercase tracking-widest">MEMBER PROMO REWARD</Text>
              </View>
              <Text className="text-base md:text-lg font-extrabold text-[#162E5C] leading-snug">Voucher Diskon Repeat Order</Text>
            </View>
            <View className="w-12 h-12 bg-[#D82B5A]/10 rounded-2xl items-center justify-center border border-[#D82B5A]/20">
              <Feather name="gift" size={22} color="#D82B5A" />
            </View>
          </View>
          <Text className="text-xs text-gray-600 leading-relaxed font-medium mb-4">
            Gunakan kode promo hemat ini untuk mendapatkan potongan Rp 10.000 pada pendaftaran sesi kelas Sobat Ceria berikutnya.
          </Text>

          <View className="flex-row gap-3">
            <View className="flex-1 bg-[#FAF6F0] border-2 border-dashed border-[#D82B5A]/40 py-3 rounded-2xl items-center justify-center">
              <Text className="text-[#D82B5A] text-lg font-black tracking-widest">{voucherCode}</Text>
            </View>
            <TouchableOpacity 
              className="bg-[#D82B5A] px-6 rounded-2xl items-center justify-center shadow-md hover:bg-[#B01E49] transition-transform active:scale-95"
              onPress={handleCopyCode}
            >
              <Text className="text-white text-xs font-extrabold">Salin Kode</Text>
            </TouchableOpacity>
          </View>
          <Text className="text-[10px] text-gray-400 font-medium mt-3">*Voucher berlaku untuk seluruh 8 pilihan program kelas resmi Sobat Ceria.</Text>
        </View>

        {/* Printable Worksheets Section */}
        <Text className="text-base font-extrabold text-[#162E5C] mb-3">Printable Worksheet PDF Gratis</Text>
        <View className="grid grid-cols-1 gap-4">
          {MOCK_WORKSHEETS.map((ws) => (
            <View key={ws.id} className="bg-white rounded-[2rem] border border-gray-100 shadow-xs p-5 flex-row items-center justify-between card-hover-effect">
              <View className="flex-1 mr-3">
                <View className="flex-row items-center gap-2 mb-1">
                  <View className="bg-[#162E5C] px-2.5 py-0.5 rounded-full">
                    <Text className="text-[9px] font-black text-white">{ws.category}</Text>
                  </View>
                  <Text className="text-[10px] font-bold text-[#D82B5A]">{ws.ageGroup}</Text>
                </View>
                <Text className="text-sm font-extrabold text-[#162E5C] leading-snug mb-1">{ws.title}</Text>
                <View className="flex-row items-center gap-1.5">
                  <Feather name="file-text" size={12} color="#9CA3AF" />
                  <Text className="text-[11px] text-gray-500 font-medium">{ws.pages} Halaman • High Res PDF Printable</Text>
                </View>
              </View>

              <TouchableOpacity 
                className="bg-[#D82B5A] px-4 py-3 rounded-full flex-row items-center gap-1.5 shadow-sm hover:bg-[#B01E49] transition-transform active:scale-95"
                onPress={() => handleDownload(ws.title)}
              >
                <Feather name="download" size={15} color="#FFFFFF" />
                <Text className="text-white text-xs font-extrabold">Unduh</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
