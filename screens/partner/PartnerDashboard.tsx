import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { UserProfile } from '../../types';
import { signOut } from '../../lib/auth';
import PartnerHome from './PartnerHome';
import PartnerProgramScreen from './PartnerProgramScreen';
import PartnerLeadsScreen from './PartnerLeadsScreen';
import PartnerKomisiScreen from './PartnerKomisiScreen';
import PartnerDokumenScreen from './PartnerDokumenScreen';
import PartnerBrandingScreen from './PartnerBrandingScreen';

const logoImg = require('../../assets/sobatceria.png');

const NAV = [
  { key: 'Dashboard', label: 'Dashboard', icon: 'grid' },
  { key: 'Program Kemitraan', label: 'Program Kemitraan', icon: 'briefcase' },
  { key: 'Prospek Leads', label: 'Prospek Leads', icon: 'user-check' },
  { key: 'Komisi Referal', label: 'Komisi Referal', icon: 'dollar-sign' },
  { key: 'Dokumen Mitra', label: 'Dokumen Mitra', icon: 'folder' },
  { key: 'Materi Branding', label: 'Materi Branding', icon: 'image' },
];

interface PartnerDashboardProps {
  user: UserProfile;
  onLogout: () => void;
  onSwitchRole: () => void;
}

export default function PartnerDashboard({ user, onLogout, onSwitchRole }: PartnerDashboardProps) {
  const [active, setActive] = useState<string>('Dashboard');

  const name = user?.parentName || 'Rekan Mitra';
  const initials = name.split(' ').filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase() || 'M';

  const handleLogout = async () => {
    try {
      await signOut();
    } catch {
      // ignore
    }
    onLogout();
  };

  const renderScreen = () => {
    switch (active) {
      case 'Program Kemitraan':
        return <PartnerProgramScreen user={user} />;
      case 'Prospek Leads':
        return <PartnerLeadsScreen user={user} />;
      case 'Komisi Referal':
        return <PartnerKomisiScreen user={user} />;
      case 'Dokumen Mitra':
        return <PartnerDokumenScreen user={user} />;
      case 'Materi Branding':
        return <PartnerBrandingScreen user={user} />;
      default:
        return <PartnerHome user={user} onNavigate={setActive} />;
    }
  };

  return (
    <View className="flex-1 flex-row bg-[#FAF7F2]">
      {/* ===== SIDEBAR ===== */}
      <View className="hidden lg:flex w-60 bg-white border-r border-[#F1F5F9] flex-col justify-between py-6 shrink-0">
        <View>
          <View className="flex-row items-center gap-2.5 px-5 mb-7">
            <View className="w-10 h-10 rounded-full overflow-hidden bg-white border border-purple-100 shadow-sm items-center justify-center p-0.5">
              <Image source={logoImg} style={{ width: '100%', height: '100%', borderRadius: 999 }} resizeMode="contain" />
            </View>
            <Text className="text-base font-black text-[#132A5E] tracking-wide">Sobat Ceria</Text>
          </View>

          <View className="flex-col gap-1 px-3">
            {NAV.map((item) => {
              const isActive = active === item.key;
              return (
                <TouchableOpacity
                  key={item.key}
                  onPress={() => setActive(item.key)}
                  className={`relative flex-row items-center gap-3 px-3 py-2.5 rounded-xl transition ${
                    isActive ? 'bg-[#FFF1F2]' : 'hover:bg-gray-50'
                  }`}
                >
                  {isActive && <View className="absolute left-0 top-2 bottom-2 w-1 rounded-full bg-[#C81E45]" />}
                  <Feather name={item.icon as any} size={17} color={isActive ? '#C81E45' : '#64748B'} />
                  <Text className={`text-[13px] font-bold ${isActive ? 'text-[#C81E45]' : 'text-[#64748B]'}`}>{item.label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Footer */}
        <View className="px-4 flex-col gap-2">
          <View className="flex-row items-center gap-2.5 bg-gray-50 rounded-xl p-3 mb-1">
            <View className="w-9 h-9 rounded-full bg-[#F77712] items-center justify-center">
              <Text className="text-white text-[11px] font-black">{initials}</Text>
            </View>
            <View className="flex-1">
              <Text className="text-xs font-extrabold text-[#1E293B]" numberOfLines={1}>{name}</Text>
              <Text className="text-[10px] text-gray-400 font-medium">Mitra</Text>
            </View>
          </View>
          <TouchableOpacity
            className="border border-[#F1F5F9] py-2.5 rounded-xl items-center justify-center flex-row gap-1.5 hover:bg-gray-50 transition"
            onPress={onSwitchRole}
          >
            <Feather name="refresh-cw" size={13} color="#64748B" />
            <Text className="text-[#64748B] text-xs font-bold">Ganti Role</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="bg-[#C81E45] py-2.5 rounded-xl items-center justify-center flex-row gap-1.5 hover:bg-[#9F1239] transition"
            onPress={handleLogout}
          >
            <Feather name="log-out" size={13} color="#FFFFFF" />
            <Text className="text-white text-xs font-bold">Keluar</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* ===== MAIN AREA ===== */}
      <View className="flex-1 flex-col">
        {/* Mobile Top Bar */}
        <View className="lg:hidden bg-white border-b border-[#F1F5F9] px-4 py-3 flex-row items-center justify-between">
          <View className="flex-row items-center gap-2">
            <View className="w-8 h-8 rounded-full overflow-hidden bg-white border border-purple-100 items-center justify-center p-0.5">
              <Image source={logoImg} style={{ width: '100%', height: '100%', borderRadius: 999 }} resizeMode="contain" />
            </View>
            <Text className="text-sm font-black text-[#132A5E] tracking-wide">Sobat Ceria</Text>
          </View>
          <View className="flex-row items-center gap-2">
            <TouchableOpacity
              onPress={onSwitchRole}
              className="w-8 h-8 rounded-full bg-gray-100 border border-gray-200 items-center justify-center"
            >
              <Feather name="refresh-cw" size={13} color="#64748B" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleLogout}
              className="px-3 py-1.5 rounded-full bg-[#FFF1F2] border border-rose-200 flex-row items-center gap-1"
            >
              <Feather name="log-out" size={12} color="#C81E45" />
              <Text className="text-[11px] font-extrabold text-[#C81E45]">Keluar</Text>
            </TouchableOpacity>
            <View className="w-8 h-8 rounded-full bg-[#F77712] items-center justify-center">
              <Text className="text-white text-[11px] font-black">{initials}</Text>
            </View>
          </View>
        </View>

        {/* Mobile Nav Tabs */}
        <View className="lg:hidden bg-white border-b border-[#F1F5F9] px-3 py-2">
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingHorizontal: 4 }}>
            {NAV.map((item) => {
              const isActive = active === item.key;
              return (
                <TouchableOpacity
                  key={item.key}
                  onPress={() => setActive(item.key)}
                  className={`px-4 py-2 rounded-full flex-row items-center gap-1.5 ${isActive ? 'bg-[#C81E45]' : 'bg-gray-100'}`}
                >
                  <Feather name={item.icon as any} size={13} color={isActive ? '#FFFFFF' : '#64748B'} />
                  <Text className={`text-[11px] font-bold ${isActive ? 'text-white' : 'text-[#64748B]'}`}>{item.label}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Content */}
        <View className="flex-1">{renderScreen()}</View>
      </View>
    </View>
  );
}
