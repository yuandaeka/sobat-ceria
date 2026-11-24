import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { UserProfile } from '../types';
import { ROLES } from '../lib/roles';

// --- Shell wrapper: header + scroll + logout ---
export function RoleShell({
  user,
  onLogout,
  onSwitchRole,
  children,
}: {
  user: UserProfile;
  onLogout: () => void;
  onSwitchRole?: () => void;
  children: React.ReactNode;
}) {
  const meta = user.role ? ROLES[user.role] : undefined;
  const initials = (user?.parentName || 'S')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase() || 'S';

  return (
    <SafeAreaView style={{ flex: 1 }} className="bg-[#FAF6F0]">
      <ScrollView
        contentContainerStyle={{ paddingBottom: 40 }}
        className="p-4 md:p-8 max-w-5xl mx-auto w-full"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className="flex-row items-center justify-between mb-6">
          <View className="flex-row items-center gap-3">
            <View className="w-11 h-11 rounded-2xl bg-white border border-gray-100 items-center justify-center shadow-xs">
              <Text className="text-base font-black" style={{ color: meta?.color || '#D82B5A' }}>
                {initials}
              </Text>
            </View>
            <View>
              <Text className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                Dashboard {meta?.label || ''}
              </Text>
              <Text className="text-lg font-extrabold text-[#162E5C] leading-tight">
                Halo, {user?.parentName || 'Sobat Ceria'}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            className="bg-white border border-rose-200 px-4 py-2 rounded-full flex-row items-center gap-1.5 shadow-xs active:scale-95 transition-transform"
            onPress={onLogout}
          >
            <Feather name="log-out" size={13} color="#D82B5A" />
            <Text className="text-[#D82B5A] text-[11px] font-extrabold">Keluar</Text>
          </TouchableOpacity>
        </View>

        {children}

        {/* Ganti Peran */}
        {onSwitchRole && (
          <TouchableOpacity
            className="mt-6 bg-white border border-gray-200 py-3.5 rounded-[1.75rem] items-center flex-row justify-center gap-2 shadow-xs active:scale-98 transition-transform"
            onPress={onSwitchRole}
          >
            <Feather name="refresh-cw" size={15} color="#162E5C" />
            <Text className="text-[#162E5C] text-xs font-extrabold">Ganti Peran / Role</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

// --- Stat card (angka ringkas) ---
export function StatCard({
  icon,
  label,
  value,
  color,
}: {
  icon: string;
  label: string;
  value: string;
  color: string;
}) {
  return (
    <View className="bg-white rounded-[1.5rem] p-4 border border-gray-100 shadow-xs flex-1 min-w-[120px]">
      <View
        className="w-9 h-9 rounded-xl items-center justify-center mb-2.5"
        style={{ backgroundColor: `${color}18` }}
      >
        <Feather name={icon as any} size={17} color={color} />
      </View>
      <Text className="text-lg font-black text-[#162E5C] leading-none">{value}</Text>
      <Text className="text-[10px] font-bold text-gray-500 mt-1">{label}</Text>
    </View>
  );
}

// --- Menu tile (navigasi/aksi dalam dashboard) ---
export function MenuTile({
  icon,
  label,
  desc,
  color,
  onPress,
}: {
  icon: string;
  label: string;
  desc: string;
  color: string;
  onPress?: () => void;
}) {
  return (
    <TouchableOpacity
      className="bg-white rounded-[1.5rem] p-4 border border-gray-100 shadow-xs flex-row items-center gap-3.5 active:scale-98 transition-transform"
      onPress={onPress}
    >
      <View
        className="w-11 h-11 rounded-2xl items-center justify-center shrink-0"
        style={{ backgroundColor: `${color}18` }}
      >
        <Feather name={icon as any} size={19} color={color} />
      </View>
      <View className="flex-1">
        <Text className="text-sm font-extrabold text-[#162E5C]">{label}</Text>
        <Text className="text-[11px] text-gray-500 font-medium mt-0.5 leading-snug">{desc}</Text>
      </View>
      <Feather name="chevron-right" size={16} color="#C4C4C4" />
    </TouchableOpacity>
  );
}

// --- Section title helper ---
export function SectionTitle({ title }: { title: string }) {
  return (
    <View className="flex-row items-center gap-2 mb-3">
      <Text className="text-sm font-extrabold text-[#162E5C]">{title}</Text>
      <View className="flex-1 h-px bg-gray-200/80" />
    </View>
  );
}
