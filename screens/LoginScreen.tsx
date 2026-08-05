import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { UserProfile } from '../types';

interface LoginScreenProps {
  onLogin: (user: UserProfile) => void;
}

export default function LoginScreen({ onLogin }: LoginScreenProps) {
  const [parentName, setParentName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [childName, setChildName] = useState<string>('');
  const [childAge, setChildAge] = useState<string>('');
  const [specialNeeds, setSpecialNeeds] = useState<string>('');

  const handleRegister = () => {
    if (!parentName.trim() || !email.trim() || !phone.trim()) {
      alertMessage('Form Belum Lengkap', 'Harap isi Nama, Email, dan No WhatsApp Orang Tua!');
      return;
    }

    const ageNumber = parseInt(childAge.trim()) || 4;
    
    const userProfile: UserProfile = {
      parentName: parentName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      children: [
        {
          name: childName.trim() || 'Arka',
          age: ageNumber,
          specialNeeds: specialNeeds.trim() ? specialNeeds.trim() : undefined
        }
      ]
    };

    onLogin(userProfile);
  };

  const alertMessage = (title: string, message: string) => {
    if (Platform.OS === 'web') {
      window.alert(`${title}: ${message}`);
    } else {
      alert(`${title}\n${message}`);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }} className="bg-[#FAF6F0] justify-center">
      <ScrollView contentContainerStyle={{ paddingVertical: 30 }} className="p-4 md:p-8 max-w-md mx-auto w-full" showsVerticalScrollIndicator={false}>
        <View className="items-center mb-6">
          <View className="w-14 h-14 bg-[#D82B5A]/10 border border-[#D82B5A]/20 rounded-2xl items-center justify-center mb-3 shadow-xs">
            <Feather name="smile" size={28} color="#D82B5A" />
          </View>
          <Text className="text-2xl font-black text-[#162E5C] tracking-widest text-center">SOBAT CERIA</Text>
          <Text className="text-xs font-semibold text-gray-500 text-center mt-1">
            Program Fun Learning & Stimulasi Tumbuh Kembang
          </Text>
        </View>

        <View className="bg-white rounded-[2.5rem] p-6 md:p-8 border border-gray-100 shadow-md">
          <Text className="text-base font-extrabold text-[#162E5C] mb-4 text-center">Pendaftaran Akun Ceria</Text>

          {/* Form input fields */}
          <Text className="text-[10px] font-extrabold text-[#162E5C] mb-1 uppercase tracking-wider">Nama Lengkap Orang Tua</Text>
          <TextInput
            className="bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-xs text-[#162E5C] mb-3.5 font-medium"
            placeholder="e.g. Bunda Dinda"
            placeholderTextColor="#9CA3AF"
            value={parentName}
            onChangeText={setParentName}
          />

          <Text className="text-[10px] font-extrabold text-[#162E5C] mb-1 uppercase tracking-wider">Email</Text>
          <TextInput
            className="bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-xs text-[#162E5C] mb-3.5 font-medium"
            placeholder="dinda@sobatceria.id"
            placeholderTextColor="#9CA3AF"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />

          <Text className="text-[10px] font-extrabold text-[#162E5C] mb-1 uppercase tracking-wider">Nomor WhatsApp</Text>
          <TextInput
            className="bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-xs text-[#162E5C] mb-3.5 font-medium"
            placeholder="e.g. 085876332598"
            placeholderTextColor="#9CA3AF"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
          />

          {/* Child details row */}
          <View className="flex-row gap-3 mb-3.5">
            <View className="flex-[2]">
              <Text className="text-[10px] font-extrabold text-[#162E5C] mb-1 uppercase tracking-wider">Nama Anak</Text>
              <TextInput
                className="bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-xs text-[#162E5C] font-medium"
                placeholder="Arka"
                placeholderTextColor="#9CA3AF"
                value={childName}
                onChangeText={setChildName}
              />
            </View>
            <View className="flex-1">
              <Text className="text-[10px] font-extrabold text-[#162E5C] mb-1 uppercase tracking-wider text-center">Usia (Thn)</Text>
              <TextInput
                className="bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-xs text-[#162E5C] text-center font-medium"
                placeholder="4"
                placeholderTextColor="#9CA3AF"
                keyboardType="numeric"
                value={childAge}
                onChangeText={setChildAge}
              />
            </View>
          </View>

          <Text className="text-[10px] font-extrabold text-[#162E5C] mb-1 uppercase tracking-wider">
            Kebutuhan Khusus / ABK <Text className="text-gray-400 font-medium">(Opsional)</Text>
          </Text>
          <TextInput
            className="bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-xs text-[#162E5C] mb-5 font-medium"
            placeholder="e.g. Speech Delay / ADHD / Kosong"
            placeholderTextColor="#9CA3AF"
            value={specialNeeds}
            onChangeText={setSpecialNeeds}
          />

          {/* Submit Button */}
          <TouchableOpacity 
            className="bg-[#D82B5A] py-3.5 rounded-full items-center shadow-md hover:bg-[#B01E49] transition-transform active:scale-95"
            onPress={handleRegister}
          >
            <Text className="text-white text-xs font-extrabold">Masuk ke Platform Ceria</Text>
          </TouchableOpacity>
        </View>

        <Text className="text-[10px] text-gray-400 mt-5 text-center leading-relaxed font-medium">
          Laboratorium Tumbuh Kembang FKIP UMS • Pabelan, Sukoharjo
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
