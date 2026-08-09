import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Platform, Linking, TextInput, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { UserProfile } from '../types';
import LoginScreen from './LoginScreen';
import { signOut } from '../lib/auth';
import { supabase } from '../lib/supabase';
import { upsertProfile, updateChild, addChild, fetchUserProfile } from '../lib/profile';
import { fetchOrders, OrderData } from '../lib/data';
import { syncProfileToSheet } from '../lib/sheets';

interface ProfileScreenProps {
  user: UserProfile | null;
  onLogout: () => void;
  onLogin?: (user: UserProfile) => void;
}

export default function ProfileScreen({ user, onLogout, onLogin }: ProfileScreenProps) {
  if (!user) {
    return <LoginScreen onLogin={onLogin || (() => {})} />;
  }

  return <ProfileView key={user.email} user={user} onLogout={onLogout} onLogin={onLogin || (() => {})} />;
}

function ProfileView({ user, onLogout, onLogin }: { user: UserProfile; onLogout: () => void; onLogin: (user: UserProfile) => void }) {
  const child = user?.children?.[0] || { name: 'Arka', age: 4, specialNeeds: '' };

  // Edit mode state
  const [editing, setEditing] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [parentName, setParentName] = useState<string>(user?.parentName || '');
  const [phone, setPhone] = useState<string>(user?.phone || '');
  const [childName, setChildName] = useState<string>(child.name || '');
  const [childAge, setChildAge] = useState<string>(String(child.age || 4));
  const [specialNeeds, setSpecialNeeds] = useState<string>(child.specialNeeds || '');

  // Order history state
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [ordersLoading, setOrdersLoading] = useState<boolean>(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await fetchOrders();
        if (mounted) setOrders(data);
      } catch {
        // fallback: biarkan kosong
      } finally {
        if (mounted) setOrdersLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const alertMessage = (title: string, message: string) => {
    if (Platform.OS === 'web') {
      window.alert(`${title}: ${message}`);
    } else {
      Alert.alert(title, message);
    }
  };

  const startEdit = () => {
    setParentName(user?.parentName || '');
    setPhone(user?.phone || '');
    setChildName(child.name || '');
    setChildAge(String(child.age || 4));
    setSpecialNeeds(child.specialNeeds || '');
    setEditing(true);
  };

  const handleSave = async () => {
    if (!parentName.trim() || !childName.trim()) {
      alertMessage('Form Belum Lengkap', 'Harap isi Nama Orang Tua dan Nama Anak.');
      return;
    }

    setSaving(true);
    try {
      const { data: authData } = await supabase.auth.getUser();
      const userId = authData.user?.id;
      if (!userId) throw new Error('Sesi tidak ditemukan.');

      const ageNumber = parseInt(childAge.trim()) || child.age || 4;

      await upsertProfile(userId, {
        parentName: parentName.trim(),
        phone: phone.trim() || undefined,
      });

      if (child.id) {
        await updateChild(child.id, {
          name: childName.trim(),
          age: ageNumber,
          specialNeeds: specialNeeds.trim() || undefined,
        });
      } else {
        // Anak belum ada (login Google pertama kali tanpa data anak) → buat baru
        await addChild(userId, {
          name: childName.trim(),
          age: ageNumber,
          specialNeeds: specialNeeds.trim() || undefined,
        });
      }

      const { profile } = await fetchUserProfile(userId);
      onLogin(profile);

      // Sinkronkan data profil ke Google Sheet
      await syncProfileToSheet(profile);

      setEditing(false);
      alertMessage('Profil Tersimpan', 'Data profil Anda berhasil diperbarui.');
    } catch (error: any) {
      alertMessage('Gagal Menyimpan', error?.message || 'Terjadi kesalahan. Coba lagi nanti.');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
    onLogout();
  };

  const handleOpenDrive = () => {
    if (Platform.OS === 'web') {
      window.open('https://www.instagram.com/sobatceria__?igsh=ZzFmMW5jcXZ6ampp', '_blank');
    } else {
      Linking.openURL('https://www.instagram.com/sobatceria__?igsh=ZzFmMW5jcXZ6ampp');
    }
  };

  const inputCls = "bg-white border border-gray-200 rounded-2xl px-4 py-3 text-xs text-[#162E5C] font-medium mb-3.5 focus:border-[#D82B5A]";
  const labelCls = "text-[10px] font-extrabold text-[#162E5C] mb-1.5 uppercase tracking-wider";

  // Inisial untuk avatar
  const initials = (user?.parentName || 'S')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase() || 'S';

  const infoCard = (icon: any, color: string, bg: string, label: string, value: string, valueCls = 'text-xs font-bold text-[#162E5C]') => (
    <View className="bg-[#FAF7F3] rounded-2xl px-4 py-3.5 flex-row items-center gap-3">
      <View className={`w-10 h-10 rounded-xl ${bg} items-center justify-center shrink-0`}>
        <Feather name={icon} size={17} color={color} />
      </View>
      <View className="flex-1">
        <Text className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">{label}</Text>
        <Text className={`${valueCls} mt-0.5 leading-snug`} numberOfLines={2}>{value}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1 }} className="bg-[#FAF6F0]">
      <ScrollView contentContainerStyle={{ paddingBottom: 110 }} className="p-4 md:p-8 max-w-5xl mx-auto w-full" showsVerticalScrollIndicator={false}>
        {/* Header Row */}
        <View className="flex-row items-center justify-between mb-5">
          <View className="flex-row items-center gap-2">
            <View className="w-2.5 h-2.5 rounded-full bg-[#D82B5A]" />
            <Text className="text-lg md:text-xl font-extrabold text-[#162E5C]">Profil Saya</Text>
          </View>
          {!editing ? (
            <TouchableOpacity
              className="bg-[#162E5C] px-4 py-2 rounded-full flex-row items-center gap-1.5 shadow-sm active:scale-95 transition-transform"
              onPress={startEdit}
            >
              <Feather name="edit-3" size={13} color="#FFFFFF" />
              <Text className="text-white font-extrabold text-[11px]">Edit Profil</Text>
            </TouchableOpacity>
          ) : (
            <View className="flex-row gap-2">
              <TouchableOpacity
                className="bg-gray-200 px-4 py-2 rounded-full items-center active:scale-95 transition-transform"
                onPress={() => setEditing(false)}
              >
                <Text className="text-gray-600 font-extrabold text-[11px]">Batal</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="bg-[#D82B5A] px-4 py-2 rounded-full flex-row items-center gap-1.5 shadow-sm active:scale-95 transition-transform"
                onPress={handleSave}
                disabled={saving}
              >
                {saving ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Feather name="check" size={13} color="#FFFFFF" />
                )}
                <Text className="text-white font-extrabold text-[11px]">Simpan</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Profile Hero Card */}
        <View className="rounded-[2rem] overflow-hidden mb-6 relative">
          {/* Background Gradient */}
          <View
            className="absolute inset-0"
            style={{ backgroundImage: 'linear-gradient(135deg, #D82B5A 0%, #8B22C0 60%, #162E5C 100%)' } as any}
          />
          {/* Decorative Circles */}
          <View className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/10" />
          <View className="absolute bottom-4 -left-6 w-24 h-24 rounded-full bg-white/10" />

          <View className="p-6 md:p-7 relative z-10">
            <View className="flex-row items-center gap-4">
              {/* Avatar */}
              <View className="w-16 h-16 rounded-2xl bg-white/95 items-center justify-center shadow-lg">
                <Text className="text-xl font-black text-[#D82B5A]">{initials}</Text>
              </View>
              <View className="flex-1">
                <Text className="text-white/70 text-[10px] font-black uppercase tracking-widest">Selamat Datang</Text>
                <Text className="text-lg md:text-xl font-extrabold text-white leading-tight mt-0.5">
                  {user?.parentName || 'Bunda Dinda'}
                </Text>
                <Text className="text-white/80 text-[11px] font-medium mt-0.5">{user?.email}</Text>
              </View>
            </View>

            {/* Badge Member */}
            <View className="mt-5 bg-white/15 border border-white/25 rounded-full px-3.5 py-1.5 self-start flex-row items-center gap-1.5">
              <Feather name="star" size={12} color="#FFD100" />
              <Text className="text-white text-[10px] font-black uppercase tracking-wide">🌟 Member Sobat Ceria</Text>
            </View>
          </View>
        </View>

        {/* Informasi Orang Tua */}
        <View className="mb-6">
          <View className="flex-row items-center gap-2 mb-3">
            <Text className="text-sm font-extrabold text-[#162E5C]">Informasi Orang Tua</Text>
            <View className="flex-1 h-px bg-gray-200/80" />
          </View>

          {editing ? (
            <View className="bg-white rounded-[1.75rem] p-5 shadow-sm border border-gray-100">
              <Text className={labelCls}>Nama Lengkap</Text>
              <TextInput
                className={inputCls}
                placeholder="Nama lengkap orang tua"
                placeholderTextColor="#9CA3AF"
                value={parentName}
                onChangeText={setParentName}
              />

              <Text className={labelCls}>Email Terdaftar</Text>
              <View className="bg-gray-100 border border-gray-200 rounded-2xl px-4 py-3 mb-3.5 flex-row items-center gap-2">
                <Feather name="lock" size={12} color="#9CA3AF" />
                <Text className="text-xs text-gray-500 font-medium">{user?.email}</Text>
              </View>

              <Text className={labelCls}>No. WhatsApp</Text>
              <TextInput
                className={inputCls}
                placeholder="e.g. 085876332598"
                placeholderTextColor="#9CA3AF"
                keyboardType="phone-pad"
                value={phone}
                onChangeText={setPhone}
              />
            </View>
          ) : (
            <View className="flex-col gap-3">
              {infoCard('user', '#D82B5A', 'bg-[#D82B5A]/10', 'Nama Lengkap', user?.parentName || 'Bunda Dinda', 'text-xs font-black text-[#162E5C]')}
              {infoCard('mail', '#8B22C0', 'bg-[#8B22C0]/10', 'Email Terdaftar', user?.email || 'dinda@sobatceria.id')}
              {infoCard('message-circle', '#2DA9E9', 'bg-[#2DA9E9]/10', 'No. WhatsApp', user?.phone || '- belum diisi -')}
            </View>
          )}
        </View>

        {/* Data Pendampingan Anak */}
        <View className="mb-6">
          <View className="flex-row items-center gap-2 mb-3">
            <Text className="text-sm font-extrabold text-[#162E5C]">Data Pendampingan Anak</Text>
            <View className="flex-1 h-px bg-gray-200/80" />
          </View>

          {editing ? (
            <View className="bg-white rounded-[1.75rem] p-5 shadow-sm border border-gray-100">
              <View className="flex-row gap-3 mb-3.5">
                <View className="flex-[2]">
                  <Text className={labelCls}>Nama Anak</Text>
                  <TextInput
                    className="bg-white border border-gray-200 rounded-2xl px-4 py-3 text-xs text-[#162E5C] font-medium"
                    placeholder="Nama anak"
                    placeholderTextColor="#9CA3AF"
                    value={childName}
                    onChangeText={setChildName}
                  />
                </View>
                <View className="flex-1">
                  <Text className={`${labelCls} text-center`}>Usia (Thn)</Text>
                  <TextInput
                    className="bg-white border border-gray-200 rounded-2xl px-4 py-3 text-xs text-[#162E5C] text-center font-medium"
                    placeholder="4"
                    placeholderTextColor="#9CA3AF"
                    keyboardType="numeric"
                    value={childAge}
                    onChangeText={setChildAge}
                  />
                </View>
              </View>

              <Text className={labelCls}>Kebutuhan Khusus / ABK</Text>
              <TextInput
                className={inputCls}
                placeholder="e.g. Speech Delay / ADHD / Kosong"
                placeholderTextColor="#9CA3AF"
                value={specialNeeds}
                onChangeText={setSpecialNeeds}
              />
            </View>
          ) : (
            <View className="flex-col gap-3">
              {infoCard('smile', '#30B864', 'bg-[#30B864]/10', 'Nama Anak', child.name, 'text-xs font-black text-[#162E5C]')}
              {infoCard('calendar', '#F77712', 'bg-[#F77712]/10', 'Usia Anak', `${child.age} Tahun (Jenjang Usia 2–7 Thn)`)}
              <View className="bg-[#FAF7F3] rounded-2xl px-4 py-3.5 flex-row items-center gap-3">
                <View className="w-10 h-10 rounded-xl bg-[#5A3B8B]/10 items-center justify-center shrink-0">
                  <Feather name="heart" size={17} color="#5A3B8B" />
                </View>
                <View className="flex-1">
                  <Text className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">Kebutuhan Khusus / ABK</Text>
                  <Text className={`text-xs font-extrabold mt-0.5 ${child.specialNeeds ? 'text-[#F77712]' : 'text-[#30B864]'}`}>
                    {child.specialNeeds || 'Anak Tipikal (Inklusif Welcome)'}
                  </Text>
                </View>
              </View>
            </View>
          )}
        </View>

        {/* Riwayat Order / Receipt */}
        <View className="mb-6">
          <View className="flex-row items-center gap-2 mb-3">
            <Text className="text-sm font-extrabold text-[#162E5C]">Riwayat Order</Text>
            <View className="flex-1 h-px bg-gray-200/80" />
            {orders.length > 0 && (
              <View className="bg-[#30B864]/15 px-2.5 py-1 rounded-full">
                <Text className="text-[9px] font-black text-[#30B864]">{orders.length} Order</Text>
              </View>
            )}
          </View>

          {ordersLoading ? (
            <View className="items-center py-10 bg-white rounded-[1.75rem] shadow-sm border border-gray-100">
              <ActivityIndicator size="small" color="#D82B5A" />
            </View>
          ) : orders.length === 0 ? (
            <View className="items-center py-10 bg-white rounded-[1.75rem] shadow-sm border border-gray-100">
              <View className="w-14 h-14 rounded-2xl bg-[#FAF6F0] items-center justify-center mb-3">
                <Feather name="inbox" size={24} color="#C4C4C4" />
              </View>
              <Text className="text-xs font-bold text-gray-400">Belum ada order</Text>
              <Text className="text-[10px] text-gray-400 mt-1 text-center px-8 leading-relaxed">
                Order kelas akan muncul di sini setelah Anda daftar.
              </Text>
            </View>
          ) : (
            orders.map((order) => (
              <View key={order.id} className="bg-white rounded-[1.75rem] p-4 mb-3 shadow-sm border border-gray-100 flex-row items-center gap-3.5">
                {/* Course Thumb */}
                <View className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#D82B5A] to-[#8B22C0] items-center justify-center shrink-0">
                  <Feather name="book-open" size={20} color="#FFFFFF" />
                </View>

                <View className="flex-1">
                  <View className="flex-row items-center justify-between mb-0.5">
                    <Text className="text-xs font-black text-[#162E5C] flex-1 mr-2" numberOfLines={1}>
                      {order.courses?.title || 'Kelas Sobat Ceria'}
                    </Text>
                    <View className="bg-[#30B864]/15 px-2 py-0.5 rounded-full ml-1">
                      <Text className="text-[8px] font-black text-[#30B864] uppercase">{order.status}</Text>
                    </View>
                  </View>

                  <Text className="text-[10px] text-gray-500 font-medium">
                    {order.courses?.category || ''} • Anak: {order.child_name || '-'}
                  </Text>

                  <View className="flex-row items-center justify-between mt-2 pt-2 border-t border-gray-100">
                    <View className="flex-row items-center gap-1.5">
                      <Feather name="calendar" size={10} color="#9CA3AF" />
                      <Text className="text-[9px] text-gray-500 font-medium">
                        {new Date(order.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </Text>
                    </View>
                    <View className="flex-row items-center gap-2">
                      {order.voucher_code ? (
                        <View className="bg-[#F77712]/10 px-1.5 py-0.5 rounded-md">
                          <Text className="text-[8px] font-bold text-[#F77712]">{order.voucher_code}</Text>
                        </View>
                      ) : null}
                      <Text className="text-xs font-black text-[#D82B5A]">
                        Rp {order.total_amount.toLocaleString('id-ID')}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            ))
          )}
        </View>

        {/* Vault Dokumentasi */}
        <View className="rounded-[1.75rem] overflow-hidden mb-6 relative">
          <View
            className="absolute inset-0"
            style={{ backgroundImage: 'linear-gradient(135deg, #162E5C 0%, #1B254B 100%)' } as any}
          />
          <View className="absolute -bottom-6 -right-6 w-24 h-24 rounded-full bg-white/10" />
          <View className="p-6 relative z-10 flex-row items-center gap-4">
            <View className="w-12 h-12 rounded-2xl bg-white/15 items-center justify-center border border-white/20 shrink-0">
              <Feather name="image" size={20} color="#FFFFFF" />
            </View>
            <View className="flex-1">
              <Text className="text-sm font-extrabold text-white">Vault Dokumentasi Activity</Text>
              <Text className="text-[10px] text-gray-300 font-medium mt-0.5 leading-relaxed">
                Lihat rekaman momen belajar sambil bermain si kecil selama mengikuti kelas stimulasi Sobat Ceria di Instagram & Drive official kami.
              </Text>
            </View>
          </View>
          <View className="px-6 pb-6 relative z-10">
            <TouchableOpacity
              className="bg-[#D82B5A] py-3 rounded-full items-center shadow-md hover:bg-[#B01E49] transition-transform active:scale-95 flex-row justify-center gap-2"
              onPress={handleOpenDrive}
            >
              <Feather name="instagram" size={16} color="#FFFFFF" />
              <Text className="text-white text-xs font-extrabold">Buka Dokumentasi Official</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Log Out Button */}
        <TouchableOpacity
          className="bg-white border border-rose-200 py-3.5 rounded-[1.75rem] items-center flex-row justify-center gap-2 shadow-sm transition-transform active:scale-98"
          onPress={handleLogout}
        >
          <Feather name="log-out" size={15} color="#D82B5A" />
          <Text className="text-[#D82B5A] text-xs font-extrabold">Keluar dari Akun</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
