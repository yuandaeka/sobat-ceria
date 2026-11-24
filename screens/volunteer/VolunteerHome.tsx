import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { UserProfile } from '../../types';

const TUGAS = [
  { tugas: 'Pendamping Mini Stimulation', kelas: 'Mini Stimulation Class', tanggal: 'Sen 22 Agu', status: 'Selesai', active: false },
  { tugas: 'Pendamping Science', kelas: 'Science Class', tanggal: 'Rab 24 Agu', status: 'Terjadwal', active: true },
  { tugas: 'Dokumentasi Art & Craft', kelas: 'Art and Craft Class', tanggal: 'Kam 25 Agu', status: 'Terjadwal', active: false },
  { tugas: 'Pendamping Cooking', kelas: 'Cooking Class', tanggal: 'Jum 26 Agu', status: 'Menunggu', active: false },
];

const DAYS = [
  { day: 'Sen', date: '22' },
  { day: 'Sel', date: '23' },
  { day: 'Rab', date: '24', active: true },
  { day: 'Kam', date: '25' },
  { day: 'Jum', date: '26' },
];

const KOORDINATOR = [
  { name: 'Bunda Sarah, M.Psi', role: 'Koordinator Program', color: '#8B5CF6' },
  { name: 'Kak Fatimah, S.Pd', role: 'Lead Fasilitator', color: '#2DA9E9' },
  { name: 'Kak Dina, S.Pd', role: 'Koordinator Volunteer', color: '#F77712' },
];

export default function VolunteerHome({
  user,
  onNavigate,
}: {
  user: UserProfile;
  onNavigate: (key: string) => void;
}) {
  const name = user?.parentName || 'Kak Relawan';
  const initials = name.split(' ').filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase() || 'V';

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
              placeholder="Cari tugas, kelas, atau jadwal..."
              placeholderTextColor="#94A3B8"
            />
          </View>
          <TouchableOpacity
            className="bg-[#C81E45] px-5 py-2.5 rounded-xl flex-row items-center gap-2 shadow-sm hover:bg-[#9F1239] transition"
            onPress={() => onNavigate('Jadwal Tugas')}
          >
            <Feather name="plus" size={16} color="#FFFFFF" />
            <Text className="text-white text-sm font-bold">Ajukan Jadwal</Text>
          </TouchableOpacity>
          <View className="bg-white px-3.5 py-2.5 rounded-xl border border-[#F1F5F9] shadow-sm flex-row items-center gap-1.5">
            <Feather name="award" size={14} color="#F59E0B" />
            <Text className="text-xs font-bold text-[#1E293B]">320 Poin</Text>
          </View>
        </View>

        {/* Hero Banner */}
        <View className="rounded-2xl p-6 mb-6 flex-row items-center justify-between relative overflow-hidden">
          <View
            className="absolute inset-0"
            style={{ backgroundImage: 'linear-gradient(135deg, #C81E45 0%, #9F1239 100%)' } as any}
          />
          <View className="absolute -top-10 -right-6 w-40 h-40 rounded-full bg-white/10" />
          <View className="relative z-10 flex-1 pr-4 max-w-xl">
            <Text className="text-white/80 text-[11px] font-bold uppercase tracking-wider mb-1">Dashboard Volunteer</Text>
            <Text className="text-2xl font-black text-white mb-2">Halo, {name}!</Text>
            <Text className="text-white/90 text-sm leading-relaxed mb-4">
              Anda memiliki 2 tugas hari ini dan 3 kelas berjalan lancar minggu ini. Jangan lupa isi absensi setelah selesai bertugas.
            </Text>
            <TouchableOpacity
              className="bg-white self-start px-5 py-2.5 rounded-lg flex-row items-center gap-2 hover:bg-rose-50 transition"
              onPress={() => onNavigate('Jadwal Tugas')}
            >
              <Feather name="calendar" size={15} color="#C81E45" />
              <Text className="text-[#C81E45] text-sm font-bold">Lihat Jadwal</Text>
            </TouchableOpacity>
          </View>
          <View className="relative z-10 hidden md:flex items-center justify-center mr-2">
            <View className="w-28 h-28 rounded-full bg-white/15 border border-white/25 items-center justify-center">
              <Feather name="heart" size={48} color="#FFFFFF" />
            </View>
          </View>
        </View>

        {/* Statistik */}
        <Text className="text-sm font-extrabold text-[#132A5E] mb-3">Ringkasan Volunteer</Text>
        <View className="flex-row gap-3 mb-6" style={{ flexWrap: 'wrap' }}>
          {[
            { label: 'Total Jam', value: '24 jam', icon: 'clock', color: '#2DA9E9' },
            { label: 'Sesi Didampingi', value: '18 sesi', icon: 'check-square', color: '#30B864' },
            { label: 'Poin Volunteer', value: '320 poin', icon: 'award', color: '#F59E0B' },
            { label: 'Badge Diraih', value: '3 badge', icon: 'star', color: '#8B5CF6' },
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

        {/* Jadwal Tugas Terdekat */}
        <View className="flex-row items-center justify-between mb-3">
          <Text className="text-base font-extrabold text-[#132A5E]">Jadwal Tugas Terdekat</Text>
          <TouchableOpacity onPress={() => onNavigate('Jadwal Tugas')} className="flex-row items-center gap-1">
            <Text className="text-[#C81E45] text-xs font-bold">Lihat Semua</Text>
            <Feather name="chevron-right" size={14} color="#C81E45" />
          </TouchableOpacity>
        </View>
        <View className="bg-white rounded-2xl border border-[#F1F5F9] shadow-sm overflow-hidden mb-6">
          <View className="flex-row items-center px-5 py-3 border-b border-[#F1F5F9]">
            <Text className="text-[10px] font-black text-gray-400 uppercase tracking-wider" style={{ width: '34%' }}>Tugas</Text>
            <Text className="text-[10px] font-black text-gray-400 uppercase tracking-wider" style={{ width: '30%' }}>Kelas</Text>
            <Text className="text-[10px] font-black text-gray-400 uppercase tracking-wider" style={{ width: '22%' }}>Tanggal</Text>
            <Text className="text-[10px] font-black text-gray-400 uppercase tracking-wider" style={{ width: '14%' }}>Status</Text>
          </View>
          {TUGAS.map((t) => (
            <View
              key={t.tugas}
              className={`flex-row items-center px-5 py-3.5 border-b border-[#F1F5F9] ${
                t.active ? 'bg-[#C81E45] mx-3 my-2 rounded-xl shadow-md' : ''
              }`}
            >
              <Text className={`text-xs font-bold ${t.active ? 'text-white' : 'text-[#1E293B]'}`} style={{ width: '34%' }} numberOfLines={1}>{t.tugas}</Text>
              <Text className={`text-xs ${t.active ? 'text-white/90' : 'text-gray-500'}`} style={{ width: '30%' }} numberOfLines={1}>{t.kelas}</Text>
              <Text className={`text-xs ${t.active ? 'text-white/90' : 'text-gray-500'}`} style={{ width: '22%' }}>{t.tanggal}</Text>
              <View style={{ width: '14%' }}>
                <View className={`self-start px-2.5 py-1 rounded-full ${
                  t.active ? 'bg-white/20' : t.status === 'Selesai' ? 'bg-emerald-50' : t.status === 'Terjadwal' ? 'bg-rose-50' : 'bg-amber-50'
                }`}>
                  <Text className={`text-[10px] font-bold ${
                    t.active ? 'text-white' : t.status === 'Selesai' ? 'text-emerald-600' : t.status === 'Terjadwal' ? 'text-[#C81E45]' : 'text-amber-600'
                  }`}>{t.status}</Text>
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
                <Text className="text-[10px] text-gray-400 font-medium">Volunteer</Text>
              </View>
              <View className="w-9 h-9 rounded-full bg-[#2DA9E9] items-center justify-center">
                <Text className="text-white text-xs font-black">{initials}</Text>
              </View>
            </View>
          </View>

          {/* Jadwal Minggu Ini */}
          <Text className="text-sm font-extrabold text-[#132A5E] mb-3">Jadwal Minggu Ini</Text>
          <View className="flex-row items-center justify-between mb-3">
            <View className="flex-row items-center gap-1">
              <TouchableOpacity className="w-7 h-7 rounded-lg bg-gray-50 items-center justify-center">
                <Feather name="chevron-left" size={15} color="#64748B" />
              </TouchableOpacity>
              <TouchableOpacity className="w-7 h-7 rounded-lg bg-gray-50 items-center justify-center">
                <Feather name="chevron-right" size={15} color="#64748B" />
              </TouchableOpacity>
            </View>
            <View className="bg-[#C81E45]/10 px-3 py-1 rounded-full">
              <Text className="text-[#C81E45] text-[11px] font-extrabold">Agustus</Text>
            </View>
          </View>
          <View className="flex-row gap-2 mb-6">
            {DAYS.map((d) => (
              <View key={d.date} className={`flex-1 items-center rounded-xl py-2.5 ${d.active ? 'bg-[#C81E45] shadow-md' : 'bg-gray-50'}`}>
                <Text className={`text-[10px] font-bold ${d.active ? 'text-white/80' : 'text-gray-400'}`}>{d.day}</Text>
                <Text className={`text-sm font-extrabold mt-0.5 ${d.active ? 'text-white' : 'text-[#1E293B]'}`}>{d.date}</Text>
              </View>
            ))}
          </View>

          {/* Koordinator */}
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-sm font-extrabold text-[#132A5E]">Koordinator & Tim</Text>
            <TouchableOpacity>
              <Text className="text-[#C81E45] text-[11px] font-bold">Lihat Semua</Text>
            </TouchableOpacity>
          </View>
          <View className="flex-col gap-2.5 mb-6">
            {KOORDINATOR.map((k) => (
              <View key={k.name} className="flex-row items-center gap-2.5">
                <View className="w-10 h-10 rounded-full items-center justify-center" style={{ backgroundColor: `${k.color}20` }}>
                  <Text className="text-xs font-black" style={{ color: k.color }}>
                    {k.name.split(' ').filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase()}
                  </Text>
                </View>
                <View className="flex-1">
                  <Text className="text-xs font-extrabold text-[#1E293B]" numberOfLines={1}>{k.name}</Text>
                  <Text className="text-[10px] text-gray-400 font-medium">{k.role}</Text>
                </View>
                <TouchableOpacity className="w-8 h-8 rounded-full bg-[#C81E45]/10 items-center justify-center">
                  <Feather name="message-circle" size={14} color="#C81E45" />
                </TouchableOpacity>
              </View>
            ))}
          </View>

          {/* Aksi Cepat */}
          <Text className="text-sm font-extrabold text-[#132A5E] mb-3">Aksi Cepat</Text>
          <View className="flex-col gap-2.5">
            <TouchableOpacity
              className="flex-row items-center gap-3 bg-[#C81E45] rounded-xl px-4 py-3 hover:bg-[#9F1239] transition"
              onPress={() => onNavigate('Absensi')}
            >
              <Feather name="clipboard" size={16} color="#FFFFFF" />
              <Text className="text-white text-xs font-bold">Check-in / Isi Absensi</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-row items-center gap-3 bg-gray-50 border border-[#F1F5F9] rounded-xl px-4 py-3 hover:bg-gray-100 transition"
              onPress={() => onNavigate('Dokumentasi')}
            >
              <Feather name="camera" size={16} color="#64748B" />
              <Text className="text-[#1E293B] text-xs font-bold">Unggah Dokumentasi</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}
