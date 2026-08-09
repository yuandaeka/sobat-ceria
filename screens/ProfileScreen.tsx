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

  const inputCls = "bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-xs text-[#162E5C] font-medium mb-3.5";
  const labelCls = "text-[10px] font-extrabold text-[#162E5C] mb-1 uppercase tracking-wider";

  return (
    <SafeAreaView style={{ flex: 1 }} className="bg-[#FAF6F0]">
      <ScrollView contentContainerStyle={{ paddingBottom: 110 }} className="p-4 md:p-8 max-w-5xl mx-auto w-full" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-xs mb-6">
          <View className="flex-row items-center gap-2 mb-1">
            <View className="w-2.5 h-2.5 rounded-full bg-[#D82B5A]" />
            <Text className="text-lg md:text-xl font-extrabold text-[#162E5C]">Profil Pengguna & Pendampingan</Text>
          </View>
          <Text className="text-xs text-gray-500 font-medium">
            Kelola data orang tua, informasi anak, dan dokumentasi aktivitas Sobat Ceria.
          </Text>
        </View>

        {/* Edit / Save Action Bar */}
        {!editing ? (
          <View className="flex-row justify-end mb-4">
            <TouchableOpacity
              className="bg-[#162E5C] px-5 py-2.5 rounded-full flex-row items-center gap-2 shadow-sm active:scale-95 transition-transform"
              onPress={startEdit}
            >
              <Feather name="edit-3" size={14} color="#FFFFFF" />
              <Text className="text-white font-extrabold text-xs">Edit Profil</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View className="flex-row justify-end gap-2 mb-4">
            <TouchableOpacity
              className="bg-gray-100 px-5 py-2.5 rounded-full items-center active:scale-95 transition-transform"
              onPress={() => setEditing(false)}
            >
              <Text className="text-gray-600 font-extrabold text-xs">Batal</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="bg-[#D82B5A] px-5 py-2.5 rounded-full flex-row items-center gap-2 shadow-sm active:scale-95 transition-transform"
              onPress={handleSave}
              disabled={saving}
            >
              {saving ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Feather name="check" size={14} color="#FFFFFF" />
              )}
              <Text className="text-white font-extrabold text-xs">Simpan</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Parent Details Card */}
        <View className="bg-white border border-gray-100 shadow-xs rounded-[2.5rem] p-6 mb-5 card-hover-effect">
          <View className="flex-row items-center gap-3 mb-4 border-b border-gray-100 pb-3">
            <View className="w-10 h-10 rounded-2xl bg-[#D82B5A]/10 items-center justify-center border border-[#D82B5A]/20">
              <Feather name="user" size={18} color="#D82B5A" />
            </View>
            <Text className="text-sm font-extrabold text-[#162E5C]">Informasi Orang Tua</Text>
          </View>

          {editing ? (
            <View>
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
            <View className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <View>
                <Text className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">Nama Lengkap</Text>
                <Text className="text-xs font-black text-[#162E5C] mt-0.5">{user?.parentName || 'Bunda Dinda'}</Text>
              </View>

              <View>
                <Text className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">Email Terdaftar</Text>
                <Text className="text-xs font-bold text-[#162E5C] mt-0.5">{user?.email || 'dinda@sobatceria.id'}</Text>
              </View>

              <View>
                <Text className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">No. WhatsApp</Text>
                <Text className="text-xs font-bold text-[#162E5C] mt-0.5">{user?.phone || '- belum diisi -'}</Text>
              </View>
            </View>
          )}
        </View>

        {/* Child Details Card */}
        <View className="bg-white border border-gray-100 shadow-xs rounded-[2.5rem] p-6 mb-5 card-hover-effect">
          <View className="flex-row items-center gap-3 mb-4 border-b border-gray-100 pb-3">
            <View className="w-10 h-10 rounded-2xl bg-[#2DA9E9]/10 items-center justify-center border border-[#2DA9E9]/20">
              <Feather name="smile" size={18} color="#2DA9E9" />
            </View>
            <Text className="text-sm font-extrabold text-[#162E5C]">Data Pendampingan Anak</Text>
          </View>

          {editing ? (
            <View>
              <View className="flex-row gap-3 mb-3.5">
                <View className="flex-[2]">
                  <Text className={labelCls}>Nama Anak</Text>
                  <TextInput
                    className="bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-xs text-[#162E5C] font-medium"
                    placeholder="Nama anak"
                    placeholderTextColor="#9CA3AF"
                    value={childName}
                    onChangeText={setChildName}
                  />
                </View>
                <View className="flex-1">
                  <Text className={`${labelCls} text-center`}>Usia (Thn)</Text>
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
            <View className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <View>
                <Text className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">Nama Anak</Text>
                <Text className="text-xs font-black text-[#162E5C] mt-0.5">{child.name}</Text>
              </View>

              <View>
                <Text className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">Usia Anak</Text>
                <Text className="text-xs font-bold text-[#162E5C] mt-0.5">{child.age} Tahun (Jenjang Usia 2–7 Thn)</Text>
              </View>

              <View>
                <Text className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">Kebutuhan Khusus / ABK</Text>
                <Text className={`text-xs font-extrabold mt-0.5 ${child.specialNeeds ? 'text-[#F77712]' : 'text-[#30B864]'}`}>
                  {child.specialNeeds || 'Anak Tipikal (Inklusif Welcome)'}
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* Documentation Media Vault Card */}
        <View className="bg-[#162E5C] border border-[#162E5C] shadow-md rounded-[2.5rem] p-6 md:p-8 mb-6 text-white card-solid-hover">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-base font-extrabold text-white">Vault Dokumentasi Activity</Text>
            <View className="w-10 h-10 bg-white/10 rounded-2xl items-center justify-center border border-white/20">
              <Feather name="image" size={18} color="#FFFFFF" />
            </View>
          </View>
          <Text className="text-xs text-gray-300 leading-relaxed font-medium mb-4">
            Lihat rekaman momen belajar sambil bermain si kecil selama mengikuti kelas stimulasi Sobat Ceria di Instagram & Drive official kami.
          </Text>
          <TouchableOpacity 
            className="bg-[#D82B5A] py-3 rounded-full items-center shadow-md hover:bg-[#B01E49] transition-transform active:scale-95 flex-row justify-center gap-2"
            onPress={handleOpenDrive}
          >
            <Feather name="instagram" size={16} color="#FFFFFF" />
            <Text className="text-white text-xs font-extrabold">Buka Dokumentasi Official</Text>
          </TouchableOpacity>
        </View>

        {/* Riwayat Order / Receipt */}
        <View className="bg-white border border-gray-100 shadow-xs rounded-[2.5rem] p-6 mb-6 card-hover-effect">
          <View className="flex-row items-center justify-between mb-4 border-b border-gray-100 pb-3">
            <View className="flex-row items-center gap-3">
              <View className="w-10 h-10 rounded-2xl bg-[#30B864]/10 items-center justify-center border border-[#30B864]/20">
                <Feather name="file-text" size={18} color="#30B864" />
              </View>
              <View>
                <Text className="text-sm font-extrabold text-[#162E5C]">Riwayat Order</Text>
                <Text className="text-[10px] text-gray-400 font-medium">Daftar pendaftaran kelas & receipt</Text>
              </View>
            </View>
          </View>

          {ordersLoading ? (
            <View className="items-center py-6">
              <ActivityIndicator size="small" color="#D82B5A" />
            </View>
          ) : orders.length === 0 ? (
            <View className="items-center py-6 bg-[#FAF6F0] rounded-2xl border border-dashed border-gray-200">
              <Feather name="inbox" size={26} color="#C4C4C4" />
              <Text className="text-xs font-bold text-gray-400 mt-2">Belum ada order</Text>
              <Text className="text-[10px] text-gray-400 mt-0.5 text-center">
                Order kelas akan muncul di sini setelah Anda daftar.
              </Text>
            </View>
          ) : (
            orders.map((order) => (
              <View key={order.id} className="bg-[#FAF6F0] rounded-2xl p-4 mb-3 border border-gray-100">
                <View className="flex-row justify-between items-start mb-2">
                  <View className="flex-1 mr-2">
                    <Text className="text-xs font-black text-[#162E5C]">
                      {order.courses?.title || 'Kelas Sobat Ceria'}
                    </Text>
                    <Text className="text-[10px] text-gray-500 font-medium mt-0.5">
                      {order.courses?.category || ''} • Anak: {order.child_name || '-'}
                    </Text>
                  </View>
                  <View className="bg-[#30B864]/15 px-2.5 py-1 rounded-full">
                    <Text className="text-[9px] font-black text-[#30B864] uppercase">{order.status}</Text>
                  </View>
                </View>

                <View className="flex-row justify-between items-center border-t border-gray-200/70 pt-2">
                  <View className="flex-row items-center gap-1.5">
                    <Feather name="calendar" size={11} color="#9CA3AF" />
                    <Text className="text-[10px] text-gray-500 font-medium">
                      {new Date(order.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </Text>
                  </View>
                  <View className="flex-row items-center gap-2">
                    {order.voucher_code ? (
                      <Text className="text-[9px] text-emerald-600 font-bold">
                        {order.voucher_code} (-Rp {order.discount.toLocaleString('id-ID')})
                      </Text>
                    ) : null}
                    <Text className="text-xs font-black text-[#D82B5A]">
                      Rp {order.total_amount.toLocaleString('id-ID')}
                    </Text>
                  </View>
                </View>
              </View>
            ))
          )}
        </View>

        {/* Log Out Button */}
        <TouchableOpacity 
          className="bg-rose-50 border border-rose-200 py-3.5 rounded-full items-center flex-row justify-center gap-2 transition-transform active:scale-98"
          onPress={handleLogout}
        >
          <Feather name="log-out" size={16} color="#D82B5A" />
          <Text className="text-[#D82B5A] text-xs font-extrabold">Keluar dari Akun</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
