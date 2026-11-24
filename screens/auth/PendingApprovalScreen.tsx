import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Linking, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { UserProfile } from '../../types';
import { ROLES } from '../../lib/roles';
import { supabase } from '../../lib/supabase';
import { fetchUserProfile } from '../../lib/profile';

interface PendingApprovalScreenProps {
  user: UserProfile;
  onLogout: () => void;
  onStatusUpdated?: (updatedUser: UserProfile) => void;
}

export default function PendingApprovalScreen({
  user,
  onLogout,
  onStatusUpdated,
}: PendingApprovalScreenProps) {
  const [checking, setChecking] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [approvedUser, setApprovedUser] = useState<UserProfile | null>(null);

  const roleMeta = user.role ? ROLES[user.role] : null;

  const handleContactAdmin = () => {
    const text = encodeURIComponent(
      `Halo Admin Sobat Ceria, saya ${user.parentName} (${user.email}). Saya ingin menanyakan status verifikasi akun pendaftaran saya sebagai ${roleMeta?.label || user.role}. Terima kasih!`
    );
    Linking.openURL(`https://wa.me/6281290000000?text=${text}`).catch(() => {});
  };

  const checkStatusSilently = async () => {
    try {
      const { data } = await supabase.auth.getUser();
      if (data.user) {
        const { profile } = await fetchUserProfile(data.user.id);
        if (profile.status === 'active') {
          setApprovedUser(profile);
        }
      }
    } catch {
      // ignore silent check
    }
  };

  const handleCheckStatus = async () => {
    setChecking(true);
    setStatusMessage(null);
    try {
      const { data } = await supabase.auth.getUser();
      if (data.user) {
        const { profile } = await fetchUserProfile(data.user.id);
        if (profile.status === 'active') {
          setApprovedUser(profile);
          return;
        } else {
          setStatusMessage('Akun Anda masih dalam proses peninjauan oleh tim admin.');
        }
      }
    } catch {
      setStatusMessage('Gagal memeriksa status. Silakan coba lagi nanti.');
    } finally {
      setChecking(false);
    }
  };

  // Otomatis cek status setiap 8 detik agar pelamar tidak perlu reload
  useEffect(() => {
    checkStatusSilently();
    const timer = setInterval(checkStatusSilently, 8000);
    return () => clearInterval(timer);
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }} className="bg-[#FAF6F0]">
      <ScrollView
        contentContainerStyle={{ paddingVertical: 40, alignItems: 'center' }}
        className="p-4 md:p-8 max-w-lg mx-auto w-full"
        showsVerticalScrollIndicator={false}
      >
        {approvedUser ? (
          /* TAMPILAN JIKA SUDAH DISETUJUI ADMIN */
          <View className="items-center w-full">
            <View className="w-24 h-24 rounded-full bg-emerald-50 border-4 border-emerald-400 items-center justify-center mb-5 shadow-sm">
              <Feather name="check" size={44} color="#059669" />
            </View>

            <View className="bg-emerald-100/80 border border-emerald-300 px-4 py-1 rounded-full mb-3">
              <Text className="text-emerald-800 text-[10px] font-black uppercase tracking-wider">
                Status: Telah Disetujui! 🎉
              </Text>
            </View>

            <Text className="text-2xl font-black text-[#162E5C] text-center mb-2 tracking-tight">
              Selamat, Akun Anda Telah Aktif!
            </Text>

            <Text className="text-xs text-gray-600 font-medium text-center leading-relaxed mb-6">
              Halo <Text className="font-bold text-[#162E5C]">{approvedUser.parentName}</Text>! Aplikasi Anda sebagai{' '}
              <Text className="font-bold text-[#8B22C0]">{roleMeta?.label || approvedUser.role}</Text> telah disetujui
              oleh Admin. Anda sekarang dapat mengakses dashboard mengajar, jadwal kelas, dan presensi murid.
            </Text>

            <TouchableOpacity
              onPress={() => onStatusUpdated && onStatusUpdated(approvedUser)}
              className="w-full bg-emerald-600 hover:bg-emerald-700 py-4 rounded-full items-center justify-center shadow-md active:scale-98 transition flex-row items-center gap-2 mb-3"
            >
              <Text className="text-white text-xs font-black">
                Buka Dashboard {roleMeta?.label} Sekarang 🚀
              </Text>
              <Feather name="arrow-right" size={15} color="#FFFFFF" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={onLogout}
              className="w-full bg-white border border-gray-200 py-3 rounded-full items-center justify-center active:scale-98 transition"
            >
              <Text className="text-gray-600 text-xs font-bold">Keluar (Logout)</Text>
            </TouchableOpacity>
          </View>
        ) : (
          /* TAMPILAN SAAT MASIH MENUNGGU PENINJAUAN */
          <>
            {/* Status Illustration Icon */}
            <View className="w-24 h-24 rounded-full bg-amber-50 border-4 border-amber-300 items-center justify-center mb-6 shadow-sm">
              <Feather name="clock" size={44} color="#D97706" />
            </View>

            {/* Badge Status */}
            <View className="bg-amber-100/70 border border-amber-300 px-3.5 py-1 rounded-full mb-3">
              <Text className="text-amber-800 text-[10px] font-black uppercase tracking-wider">
                Status Akun: Menunggu Verifikasi
              </Text>
            </View>

            <Text className="text-2xl font-black text-[#162E5C] text-center mb-2 tracking-tight">
              Aplikasi Anda Sedang Ditinjau
            </Text>

            <Text className="text-xs text-gray-600 font-medium text-center leading-relaxed mb-6">
              Halo <Text className="font-bold text-[#162E5C]">{user.parentName || 'Sobat Ceria'}</Text>! Terima kasih telah
              mendaftar sebagai{' '}
              <Text className="font-bold" style={{ color: roleMeta?.color || '#162E5C' }}>
                {roleMeta?.label || user.role}
              </Text>
              . Demi menjaga kualitas ekosistem Sobat Ceria, seluruh pendaftaran mitra/pengajar ditinjau langsung oleh tim Admin.
            </Text>

            {/* User Card Info */}
            <View className="w-full bg-white rounded-3xl p-5 border border-gray-100 shadow-xs mb-6">
              <View className="flex-row items-center gap-3 pb-3.5 border-b border-gray-100">
                <View
                  className="w-12 h-12 rounded-2xl items-center justify-center shrink-0"
                  style={{ backgroundColor: `${roleMeta?.color || '#D97706'}1A` }}
                >
                  <Feather name={(roleMeta?.icon as any) || 'user'} size={22} color={roleMeta?.color || '#D97706'} />
                </View>
                <View className="flex-1">
                  <Text className="text-sm font-black text-[#162E5C]">{user.parentName}</Text>
                  <Text className="text-xs text-gray-500 font-medium">{user.email}</Text>
                </View>
                <View className="px-2.5 py-1 rounded-full bg-gray-50 border border-gray-200">
                  <Text className="text-[10px] font-bold text-gray-600">{roleMeta?.label}</Text>
                </View>
              </View>

              <View className="pt-3.5 flex-col gap-2">
                <View className="flex-row items-center justify-between">
                  <Text className="text-[11px] text-gray-500 font-medium">No. WhatsApp</Text>
                  <Text className="text-[11px] font-bold text-gray-800">{user.phone || '-'}</Text>
                </View>
                <View className="flex-row items-center justify-between">
                  <Text className="text-[11px] text-gray-500 font-medium">Estimasi Peninjauan</Text>
                  <Text className="text-[11px] font-bold text-amber-700">Maks. 1 x 24 Jam Kerja</Text>
                </View>
              </View>
            </View>

            {statusMessage ? (
              <View className="w-full bg-blue-50 border border-blue-200 rounded-2xl p-3 mb-4 flex-row items-center gap-2">
                <Feather name="info" size={15} color="#2563EB" />
                <Text className="text-xs text-blue-800 font-medium flex-1">{statusMessage}</Text>
              </View>
            ) : null}

            {/* Action Buttons */}
            <View className="w-full flex-col gap-3">
              <TouchableOpacity
                onPress={handleCheckStatus}
                disabled={checking}
                className="w-full bg-[#162E5C] py-3.5 rounded-full items-center justify-center shadow-xs active:scale-98 transition flex-row items-center gap-2"
              >
                {checking ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <>
                    <Feather name="refresh-cw" size={14} color="#FFFFFF" />
                    <Text className="text-white text-xs font-black">Cek Ulang Status Verifikasi</Text>
                  </>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleContactAdmin}
                className="w-full bg-[#25D366] py-3.5 rounded-full items-center justify-center shadow-xs active:scale-98 transition flex-row items-center gap-2"
              >
                <Feather name="message-circle" size={15} color="#FFFFFF" />
                <Text className="text-white text-xs font-black">Hubungi Admin via WhatsApp</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={onLogout}
                className="w-full bg-white border border-gray-200 py-3 rounded-full items-center justify-center active:scale-98 transition mt-1"
              >
                <Text className="text-gray-600 text-xs font-bold">Keluar (Logout)</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

