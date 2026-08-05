import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Platform, Image, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';

interface HomeScreenProps {
  navigation: any;
  user: any;
}

export default function HomeScreen({ navigation, user }: HomeScreenProps) {
  const child = user?.children?.[0] || { name: 'Arka', age: 4, specialNeeds: '' };

  return (
    <SafeAreaView style={{ flex: 1 }} className="bg-[#FAF6F0]">
      <ScrollView contentContainerStyle={{ paddingBottom: 110 }} className="p-4 md:p-8 max-w-5xl mx-auto w-full" showsVerticalScrollIndicator={false}>
        
        {/* User Welcome Bar (Clean White Card with Pink Accents) */}
        <View className="bg-white p-5 md:p-6 rounded-[2rem] border border-gray-100 shadow-xs flex-row justify-between items-center mb-6 card-hover-effect">
          <View className="flex-row items-center gap-3.5 flex-1">
            <View className="w-12 h-12 rounded-2xl bg-[#D82B5A]/10 border border-[#D82B5A]/20 items-center justify-center">
              <Feather name="smile" size={24} color="#D82B5A" />
            </View>
            <View className="flex-1">
              <Text className="text-[10px] font-black text-[#D82B5A] uppercase tracking-widest">Selamat Datang</Text>
              <Text className="text-base md:text-lg font-extrabold text-[#162E5C] leading-tight">
                {user?.parentName || 'Bunda Dinda'}
              </Text>
              <Text className="text-xs font-semibold text-gray-500 mt-0.5">
                Anak: <Text className="text-[#D82B5A] font-bold">{child.name}</Text> ({child.age} Tahun) {child.specialNeeds ? `• ${child.specialNeeds}` : ''}
              </Text>
            </View>
          </View>

          <View className="bg-[#D82B5A] px-3.5 py-1.5 rounded-full shadow-xs">
            <Text className="text-[10px] font-black text-white uppercase tracking-wide">🌟 Member Sobat Ceria</Text>
          </View>
        </View>

        {/* Hero Banner (Crimson Pink SMM Gradient Card) */}
        <View 
          className="p-6 md:p-8 rounded-[2.5rem] mb-6 shadow-md relative overflow-hidden flex-col justify-between"
          style={{
            backgroundImage: 'linear-gradient(135deg, #D82B5A 0%, #B01E49 100%)',
          } as any}
        >
          {/* Decorative Watermark Icons */}
          <View className="absolute top-4 right-6 opacity-15 pointer-events-none">
            <Feather name="send" size={110} color="#FFFFFF" />
          </View>

          <View className="relative z-10 max-w-lg mb-4">
            <View className="bg-white/20 self-start px-3 py-1 rounded-full mb-3 border border-white/30">
              <Text className="text-white text-[10px] font-extrabold uppercase tracking-wider">Program Stimulasi Terpadu</Text>
            </View>
            <Text className="text-white text-xl md:text-2xl font-black leading-snug mb-2">
              Kelas Belajar Sambil Bermain (Fun Learning)
            </Text>
            <Text className="text-white/95 text-xs leading-relaxed font-medium">
              Metode inklusif berbasis Mindfulness & Family Co-Creation. Ramah untuk anak tipikal maupun berkebutuhan khusus usia 2–7 tahun.
            </Text>
          </View>

          <TouchableOpacity 
            className="bg-white py-2.5 px-6 rounded-full self-start shadow-md hover:bg-gray-100 transition-transform active:scale-95 flex-row items-center gap-2"
            onPress={() => navigation.navigate('Katalog')}
          >
            <Text className="text-[#D82B5A] font-extrabold text-xs md:text-sm">Jelajahi 8 Kelas Resmi</Text>
            <Feather name="arrow-right" size={14} color="#D82B5A" />
          </TouchableOpacity>
        </View>

        {/* Quick Access Feature Cards Grid */}
        <Text className="text-base font-extrabold text-[#162E5C] mb-3">Akses Cepat Fitur Aplikasi</Text>
        <View className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          
          {/* 1. Screening STPPA */}
          <TouchableOpacity 
            className="bg-white p-4 rounded-[2rem] border border-gray-100 shadow-xs items-center text-center card-hover-effect"
            onPress={() => navigation.navigate('Screening')}
          >
            <View className="w-11 h-11 rounded-2xl bg-[#2DA9E9]/15 border border-[#2DA9E9]/30 items-center justify-center mb-2.5">
              <Feather name="activity" size={20} color="#2DA9E9" />
            </View>
            <Text className="text-xs font-black text-[#162E5C]">Screening STPPA</Text>
            <Text className="text-[10px] text-gray-500 mt-0.5">6 Aspek Anak</Text>
          </TouchableOpacity>

          {/* 2. Katalog Kelas */}
          <TouchableOpacity 
            className="bg-white p-4 rounded-[2rem] border border-gray-100 shadow-xs items-center text-center card-hover-effect"
            onPress={() => navigation.navigate('Katalog')}
          >
            <View className="w-11 h-11 rounded-2xl bg-[#D82B5A]/15 border border-[#D82B5A]/30 items-center justify-center mb-2.5">
              <Feather name="shopping-bag" size={20} color="#D82B5A" />
            </View>
            <Text className="text-xs font-black text-[#162E5C]">Katalog 8 Kelas</Text>
            <Text className="text-[9px] text-gray-500 mt-0.5">Stimulasi Terpadu</Text>
          </TouchableOpacity>

          {/* 3. Printable Kit */}
          <TouchableOpacity 
            className="bg-white p-4 rounded-[2rem] border border-gray-100 shadow-xs items-center text-center card-hover-effect"
            onPress={() => navigation.navigate('Worksheet')}
          >
            <View className="w-11 h-11 rounded-2xl bg-[#30B864]/15 border border-[#30B864]/30 items-center justify-center mb-2.5">
              <Feather name="file-text" size={20} color="#30B864" />
            </View>
            <Text className="text-xs font-black text-[#162E5C]">Worksheet PDF</Text>
            <Text className="text-[9px] text-gray-500 mt-0.5">Gratis Printable</Text>
          </TouchableOpacity>

          {/* 4. Vault Dokumentasi */}
          <TouchableOpacity 
            className="bg-white p-4 rounded-[2rem] border border-gray-100 shadow-xs items-center text-center card-hover-effect"
            onPress={() => {
              if (Platform.OS === 'web') {
                window.open('https://www.instagram.com/sobatceria__?igsh=ZzFmMW5jcXZ6ampp', '_blank');
              } else {
                Linking.openURL('https://www.instagram.com/sobatceria__?igsh=ZzFmMW5jcXZ6ampp');
              }
            }}
          >
            <View className="w-11 h-11 rounded-2xl bg-[#F77712]/15 border border-[#F77712]/30 items-center justify-center mb-2.5">
              <Feather name="image" size={20} color="#F77712" />
            </View>
            <Text className="text-xs font-black text-[#162E5C]">Dokumentasi</Text>
            <Text className="text-[9px] text-gray-500 mt-0.5">Foto & Video Activity</Text>
          </TouchableOpacity>

        </View>

        {/* Why Sobat Ceria? Card */}
        <View className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-xs mb-6 card-hover-effect">
          <View className="flex-row items-center gap-2 mb-2">
            <Feather name="heart" size={18} color="#D82B5A" />
            <Text className="text-base font-extrabold text-[#162E5C]">Mengapa Sobat Ceria Fun Learning?</Text>
          </View>
          <Text className="text-xs text-gray-600 leading-relaxed mb-4 font-medium">
            Program kami memadukan stimulasi sensorik-motorik, kelas kriya, komunikasi, serta pemantauan intensif oleh psikolog anak & fasilitator PAUD. Kami mendukung penuh tumbuh kembang emas bebas kecanduan gadget.
          </Text>
          <View className="flex-row flex-wrap gap-2">
            <View className="bg-[#30B864]/10 px-3 py-1 rounded-full border border-[#30B864]/20">
              <Text className="text-[10px] font-black text-[#30B864]">Inklusif (ABK Welcome)</Text>
            </View>
            <View className="bg-[#5A3B8B]/10 px-3 py-1 rounded-full border border-[#5A3B8B]/20">
              <Text className="text-[10px] font-black text-[#5A3B8B]">Mindfulness Kids</Text>
            </View>
            <View className="bg-[#F77712]/10 px-3 py-1 rounded-full border border-[#F77712]/20">
              <Text className="text-[10px] font-black text-[#F77712]">Family Co-Creation</Text>
            </View>
          </View>
        </View>

        {/* Upcoming Class Schedule */}
        <View className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-xs mb-6 card-hover-effect">
          <Text className="text-sm font-extrabold text-[#162E5C] mb-3">📅 Kelas Terdekat Anda</Text>
          <View className="flex-row items-center gap-3">
            <View className="bg-[#D82B5A]/10 w-12 h-12 rounded-2xl items-center justify-center border border-[#D82B5A]/20">
              <Feather name="calendar" size={20} color="#D82B5A" />
            </View>
            <View className="flex-1">
              <Text className="text-xs font-black text-[#162E5C]">Creative Play: Art and Craft Class</Text>
              <Text className="text-[10px] text-gray-500 mt-0.5">Sabtu • 09:00 - 10:30 WIB • Lab FKIP UMS</Text>
            </View>
            <View className="bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full">
              <Text className="text-[9px] font-black text-amber-700">Terdaftar</Text>
            </View>
          </View>
        </View>

        {/* Location & WhatsApp Help Card */}
        <View className="bg-[#162E5C] p-6 rounded-[2.5rem] text-white shadow-md flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <View className="flex-1">
            <Text className="text-[#FFD100] text-[10px] font-black uppercase tracking-wider mb-1">LOKASI KELAS & BANTUAN</Text>
            <Text className="text-white text-xs md:text-sm font-extrabold mb-1">
              Laboratorium Tumbuh Kembang FKIP UMS
            </Text>
            <Text className="text-gray-300 text-[11px] font-medium">
              Jl. A. Yani Tromol Pos 1 Pabelan, Sukoharjo • WhatsApp: +62 858-7633-2598
            </Text>
          </View>
          <TouchableOpacity
            className="bg-[#30B864] px-5 py-2.5 rounded-full flex-row items-center gap-2 shadow-sm hover:bg-[#28A056] transition"
            onPress={() => Linking.openURL('https://wa.me/6285876332598')}
          >
            <Feather name="message-circle" size={16} color="#FFFFFF" />
            <Text className="text-white font-extrabold text-xs">Chat Admin WA</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}
