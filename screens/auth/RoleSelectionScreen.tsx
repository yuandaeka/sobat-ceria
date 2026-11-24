import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { UserProfile, UserRole } from '../../types';
import { supabase } from '../../lib/supabase';
import { updateProfileRole } from '../../lib/profile';
import { ROLES, ROLE_ORDER } from '../../lib/roles';

interface RoleSelectionScreenProps {
  user: UserProfile;
  onSelect: (role: UserRole) => void;
}

export default function RoleSelectionScreen({ user, onSelect }: RoleSelectionScreenProps) {
  const [submitting, setSubmitting] = useState<UserRole | null>(null);

  const handleSelect = async (role: UserRole) => {
    setSubmitting(role);
    try {
      const { data: authData } = await supabase.auth.getUser();
      const userId = authData.user?.id;
      if (userId) {
        await updateProfileRole(userId, role);
      }
    } catch {
      // penyimpanan role bersifat best-effort; tetap lanjutkan
    }
    onSelect(role);
    setSubmitting(null);
  };

  const initials = (user?.parentName || 'S')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase() || 'S';

  return (
    <SafeAreaView style={{ flex: 1 }} className="bg-[#FAF6F0]">
      <ScrollView contentContainerStyle={{ paddingVertical: 30 }} className="p-4 md:p-8 max-w-2xl mx-auto w-full" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="items-center mb-6">
          <View className="w-16 h-16 rounded-2xl bg-white border border-[#D82B5A]/20 shadow-md items-center justify-center mb-3">
            <Text className="text-xl font-black text-[#D82B5A]">{initials}</Text>
          </View>
          <Text className="text-2xl font-black text-[#162E5C] tracking-tight text-center">Pilih Peran Anda</Text>
          <Text className="text-xs font-semibold text-gray-500 text-center mt-1.5 max-w-sm leading-relaxed">
            Halo {user?.parentName || 'Sobat Ceria'}! Pilih peran untuk membuka dashboard yang sesuai dengan kebutuhan Anda.
          </Text>
        </View>

        {/* Role Cards */}
        <View className="flex-col gap-3.5">
          {ROLE_ORDER.map((role) => {
            const meta = ROLES[role];
            return (
              <TouchableOpacity
                key={role}
                className="bg-white rounded-[2rem] p-5 border border-gray-100 shadow-xs flex-row items-center gap-4 active:scale-98 transition-transform"
                onPress={() => handleSelect(role)}
                disabled={submitting !== null}
              >
                <View className="w-14 h-14 rounded-2xl items-center justify-center shrink-0" style={{ backgroundColor: `${meta.color}18` }}>
                  <Feather name={meta.icon as any} size={24} color={meta.color} />
                </View>
                <View className="flex-1">
                  <View className="flex-row items-center gap-2">
                    <Text className="text-base font-extrabold text-[#162E5C]">{meta.label}</Text>
                    <View className="px-2 py-0.5 rounded-full" style={{ backgroundColor: `${meta.color}18` }}>
                      <Text className="text-[9px] font-black" style={{ color: meta.color }}>{meta.tagline}</Text>
                    </View>
                  </View>
                  <Text className="text-[11px] text-gray-500 font-medium mt-1 leading-snug">{meta.description}</Text>
                </View>
                {submitting === role ? (
                  <ActivityIndicator size="small" color={meta.color} />
                ) : (
                  <View className="w-8 h-8 rounded-full bg-gray-50 items-center justify-center shrink-0">
                    <Feather name="chevron-right" size={16} color="#9CA3AF" />
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        <Text className="text-[10px] text-gray-400 mt-6 text-center leading-relaxed font-medium">
          Anda dapat mengganti peran kapan saja dari menu Profil.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
