import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { UserProfile } from '../../types';

const ORDER = [
  { id: '#SC-321', program: 'Science Class', pelanggan: 'Bunda Dinda', jumlah: 'Rp 69.000', status: 'Paid', active: false },
  { id: '#SC-322', program: 'Cooking Class', pelanggan: 'Mama Cut', jumlah: 'Rp 85.000', status: 'Baru', active: true },
  { id: '#SC-323', program: 'Art and Craft Class', pelanggan: 'Ayah Dimas', jumlah: 'Rp 79.000', status: 'Paid', active: false },
  { id: '#SC-324', program: 'Seminar Parenting', pelanggan: 'Bunda Sarah', jumlah: 'Rp 49.000', status: 'Pending', active: false },
];

const DAYS = [
  { day: 'Sen', date: '22' },
  { day: 'Sel', date: '23' },
  { day: 'Rab', date: '24', active: true },
  { day: 'Kam', date: '25' },
  { day: 'Jum', date: '26' },
];

const NOTIFIKASI = [
  { title: 'Order baru #SC-322 menunggu verifikasi', waktu: 'Baru saja', color: '#C81E45', icon: 'shopping-bag' },
  { title: 'Screening STPPA siap ditinjau', waktu: '2 jam lalu', color: '#2DA9E9', icon: 'activity' },
  { title: 'Voucher SOBATCERIA20 hampir habis', waktu: '5 jam lalu', color: '#F59E0B', icon: 'tag' },
];

export default function AdminHome({
  user,
  onNavigate,
}: {
  user: UserProfile;
  onNavigate: (key: string) => void;
}) {
  const name = user?.parentName || 'Admin';
  const initials = name.split(' ').filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase() || 'A';

  return (
    <View className="flex-1 flex-row">
      {/* ===== MAIN CANVAS ===== */}
      <ScrollView
        className="flex-1 bg-[#FAF7F2]"
        contentContainerStyle={{ padding: 24, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Action Bar */}
        <View className="flex-row items-center gap-3 mb-5">
          <View className="flex-1 flex-row items-center bg-white rounded-xl px-4 py-2.5 border border-[#F1F5F9] shadow-sm">
            <Feather name="search" size={16} color="#94A3B8" />
            <TextInput
              className="flex-1 ml-2 text-sm text-[#1E293B]"
              placeholder="Cari order, pengguna, atau kelas..."
              placeholderTextColor="#94A3B8"
            />
          </View>
          <TouchableOpacity
            className="bg-[#C81E45] px-5 py-2.5 rounded-xl flex-row items-center gap-2 shadow-sm hover:bg-[#9F1239] transition"
            onPress={() => onNavigate('Kelola Kelas')}
          >
            <Feather name="plus" size={16} color="#FFFFFF" />
            <Text className="text-white text-sm font-bold">Tambah Data</Text>
          </TouchableOpacity>
          <View className="bg-white px-3.5 py-2.5 rounded-xl border border-[#F1F5F9] shadow-sm flex-row items-center gap-1.5">
            <View className="w-2 h-2 rounded-full bg-emerald-500" />
            <Text className="text-xs font-bold text-[#1E293B]">Sistem Aktif</Text>
          </View>
        </View>

        {/* Hero Banner */}
        <View className="rounded-2xl p-6 mb-6 flex-row items-center justify-between relative overflow-hidden">
          <View className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(135deg, #162E5C 0%, #8B22C0 100%)' } as any} />
          <View className="absolute -top-10 -right-6 w-40 h-40 rounded-full bg-white/10" />
          <View className="relative z-10 flex-1 pr-4 max-w-xl">
            <Text className="text-white/80 text-[11px] font-bold uppercase tracking-wider mb-1">Dashboard Admin</Text>
            <Text className="text-2xl font-black text-white mb-2">Halo, {name}!</Text>
            <Text className="text-white/90 text-sm leading-relaxed mb-4">
              Platform berjalan normal. 326 order dan Rp 24jt pendapatan tercatat bulan ini. Pantau semua aktivitas di sini.
            </Text>
            <TouchableOpacity
              className="bg-white self-start px-5 py-2.5 rounded-lg flex-row items-center gap-2 hover:bg-indigo-50 transition"
              onPress={() => onNavigate('Laporan')}
            >
              <Feather name="bar-chart-2" size={15} color="#162E5C" />
              <Text className="text-[#162E5C] text-sm font-bold">Lihat Laporan</Text>
            </TouchableOpacity>
          </View>
          <View className="relative z-10 hidden md:flex items-center justify-center mr-2">
            <View className="w-28 h-28 rounded-full bg-white/15 border border-white/25 items-center justify-center">
              <Feather name="shield" size={48} color="#FFFFFF" />
            </View>
          </View>
        </View>

        {/* Statistik */}
        <Text className="text-sm font-extrabold text-[#132A5E] mb-3">Ringkasan Platform</Text>
        <View className="flex-row gap-3 mb-6" style={{ flexWrap: 'wrap' }}>
          {[
            { label: 'Total Pengguna', value: '1.240', icon: 'users', color: '#162E5C' },
            { label: 'Total Order', value: '326', icon: 'shopping-bag', color: '#C81E45' },
            { label: 'Pendapatan', value: 'Rp 24jt', icon: 'dollar-sign', color: '#30B864' },
            { label: 'Kelas Aktif', value: '8 kelas', icon: 'book-open', color: '#8B22C0' },
          ].map((s) => (
            <View key={s.label} className="flex-1 bg-white rounded-2xl border border-[#F1F5F9] shadow-sm p-4 flex-row items-center gap-3" style={{ minWidth: 180 }}>
              <View className="w-11 h-11 rounded-xl items-center justify-center shrink-0" style={{ backgroundColor: `${s.color}1A` }}>
                <Feather name={s.icon as any} size={20} color={s.color} />
              </View>
              <View>
                <Text className="text-lg font-black text-[#132A5E] leading-none">{s.value}</Text>
                <Text className="text-[10px] font-bold text-gray-500 mt-1">{s.label}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Order Terbaru */}
        <View className="flex-row items-center justify-between mb-3">
          <Text className="text-base font-extrabold text-[#132A5E]">Order Terbaru</Text>
          <TouchableOpacity onPress={() => onNavigate('Laporan')} className="flex-row items-center gap-1">
            <Text className="text-[#C81E45] text-xs font-bold">Lihat Semua</Text>
            <Feather name="chevron-right" size={14} color="#C81E45" />
          </TouchableOpacity>
        </View>
        <View className="bg-white rounded-2xl border border-[#F1F5F9] shadow-sm overflow-hidden mb-6">
          <View className="flex-row items-center px-5 py-3 border-b border-[#F1F5F9]">
            <Text className="text-[10px] font-black text-gray-400 uppercase tracking-wider" style={{ width: '24%' }}>ID Order</Text>
            <Text className="text-[10px] font-black text-gray-400 uppercase tracking-wider" style={{ width: '30%' }}>Program</Text>
            <Text className="text-[10px] font-black text-gray-400 uppercase tracking-wider" style={{ width: '22%' }}>Pelanggan</Text>
            <Text className="text-[10px] font-black text-gray-400 uppercase tracking-wider" style={{ width: '14%' }}>Jumlah</Text>
            <Text className="text-[10px] font-black text-gray-400 uppercase tracking-wider" style={{ width: '10%' }}>Status</Text>
          </View>
          {ORDER.map((o) => (
            <View
              key={o.id}
              className={`flex-row items-center px-5 py-3.5 border-b border-[#F1F5F9] ${
                o.active ? 'bg-[#162E5C] mx-3 my-2 rounded-xl shadow-md' : ''
              }`}
            >
              <Text className={`text-xs font-bold ${o.active ? 'text-white' : 'text-[#1E293B]'}`} style={{ width: '24%' }}>{o.id}</Text>
              <Text className={`text-xs ${o.active ? 'text-white/90' : 'text-gray-500'}`} style={{ width: '30%' }} numberOfLines={1}>{o.program}</Text>
              <Text className={`text-xs ${o.active ? 'text-white/90' : 'text-gray-500'}`} style={{ width: '22%' }} numberOfLines={1}>{o.pelanggan}</Text>
              <Text className={`text-xs font-bold ${o.active ? 'text-white' : 'text-[#1E293B]'}`} style={{ width: '14%' }}>{o.jumlah}</Text>
              <View style={{ width: '10%' }}>
                <View className={`self-start px-2 py-0.5 rounded-full ${
                  o.active ? 'bg-white/20' : o.status === 'Paid' ? 'bg-emerald-50' : o.status === 'Pending' ? 'bg-amber-50' : 'bg-blue-50'
                }`}>
                  <Text className={`text-[9px] font-bold ${
                    o.active ? 'text-white' : o.status === 'Paid' ? 'text-emerald-600' : o.status === 'Pending' ? 'text-amber-600' : 'text-blue-600'
                  }`}>{o.status}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* ===== RIGHT PANEL ===== */}
      <View className="hidden xl:flex w-80 bg-white border-l border-[#F1F5F9] flex-col">
        <ScrollView contentContainerStyle={{ padding: 24 }} showsVerticalScrollIndicator={false}>
          {/* Profile Bar */}
          <View className="flex-row items-center justify-between mb-6">
            <View className="flex-row items-center gap-2">
              <TouchableOpacity className="w-9 h-9 rounded-full bg-gray-50 items-center justify-center">
                <Feather name="settings" size={16} color="#64748B" />
              </TouchableOpacity>
              <TouchableOpacity className="w-9 h-9 rounded-full bg-gray-50 items-center justify-center relative">
                <Feather name="bell" size={16} color="#64748B" />
                <View className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#C81E45] border border-white" />
              </TouchableOpacity>
            </View>
            <View className="flex-row items-center gap-2">
              <View className="items-end">
                <Text className="text-xs font-extrabold text-[#1E293B]">{name}</Text>
                <Text className="text-[10px] text-gray-400 font-medium">Admin</Text>
              </View>
              <View className="w-9 h-9 rounded-full bg-[#162E5C] items-center justify-center">
                <Text className="text-white text-xs font-black">{initials}</Text>
              </View>
            </View>
          </View>

          {/* Kalender */}
          <Text className="text-sm font-extrabold text-[#132A5E] mb-3">Kalender Operasional</Text>
          <View className="flex-row items-center justify-between mb-3">
            <View className="flex-row items-center gap-1">
              <TouchableOpacity className="w-7 h-7 rounded-lg bg-gray-50 items-center justify-center">
                <Feather name="chevron-left" size={15} color="#64748B" />
              </TouchableOpacity>
              <TouchableOpacity className="w-7 h-7 rounded-lg bg-gray-50 items-center justify-center">
                <Feather name="chevron-right" size={15} color="#64748B" />
              </TouchableOpacity>
            </View>
            <View className="bg-[#162E5C]/10 px-3 py-1 rounded-full">
              <Text className="text-[#162E5C] text-[11px] font-extrabold">Agustus</Text>
            </View>
          </View>
          <View className="flex-row gap-2 mb-6">
            {DAYS.map((d) => (
              <View key={d.date} className={`flex-1 items-center rounded-xl py-2.5 ${d.active ? 'bg-[#162E5C] shadow-md' : 'bg-gray-50'}`}>
                <Text className={`text-[10px] font-bold ${d.active ? 'text-white/80' : 'text-gray-400'}`}>{d.day}</Text>
                <Text className={`text-sm font-extrabold mt-0.5 ${d.active ? 'text-white' : 'text-[#1E293B]'}`}>{d.date}</Text>
              </View>
            ))}
          </View>

          {/* Notifikasi Sistem */}
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-sm font-extrabold text-[#132A5E]">Notifikasi Sistem</Text>
            <TouchableOpacity>
              <Text className="text-[#C81E45] text-[11px] font-bold">Lihat Semua</Text>
            </TouchableOpacity>
          </View>
          <View className="flex-col gap-2.5 mb-6">
            {NOTIFIKASI.map((n) => (
              <View key={n.title} className="flex-row items-center gap-3">
                <View className="w-10 h-10 rounded-full items-center justify-center" style={{ backgroundColor: `${n.color}20` }}>
                  <Feather name={n.icon as any} size={17} color={n.color} />
                </View>
                <View className="flex-1">
                  <Text className="text-xs font-extrabold text-[#1E293B]" numberOfLines={1}>{n.title}</Text>
                  <Text className="text-[10px] text-gray-400 font-medium">{n.waktu}</Text>
                </View>
              </View>
            ))}
          </View>

          {/* Aksi Cepat */}
          <Text className="text-sm font-extrabold text-[#132A5E] mb-3">Aksi Cepat</Text>
          <View className="flex-col gap-2.5">
            <TouchableOpacity
              className="flex-row items-center gap-3 bg-[#162E5C] rounded-xl px-4 py-3 hover:bg-[#0B1F4B] transition"
              onPress={() => onNavigate('Kelola Kelas')}
            >
              <Feather name="book-open" size={16} color="#FFFFFF" />
              <Text className="text-white text-xs font-bold">Kelola Kelas</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-row items-center gap-3 bg-gray-50 border border-[#F1F5F9] rounded-xl px-4 py-3 hover:bg-gray-100 transition"
              onPress={() => onNavigate('Kelola Pengguna')}
            >
              <Feather name="users" size={16} color="#64748B" />
              <Text className="text-[#1E293B] text-xs font-bold">Kelola Pengguna</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}
