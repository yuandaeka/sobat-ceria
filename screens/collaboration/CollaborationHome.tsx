import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { UserProfile } from '../../types';

const PROYEK = [
  { nama: 'Riset Tumbuh Kembang Anak', mitra: 'FKIP UMS', status: 'Berjalan', active: false },
  { nama: 'Program Sekolah Inklusif', mitra: 'Dinas Pendidikan', status: 'Aktif', active: true },
  { nama: 'Workshop Parenting Massal', mitra: 'Yayasan Ceria', status: 'Berjalan', active: false },
  { nama: 'Pelatihan Fasilitator PAUD', mitra: 'Komunitas Guru', status: 'Perencanaan', active: false },
];

const DAYS = [
  { day: 'Sen', date: '22' },
  { day: 'Sel', date: '23' },
  { day: 'Rab', date: '24', active: true },
  { day: 'Kam', date: '25' },
  { day: 'Jum', date: '26' },
];

const AGENDA = [
  { title: 'Rapat progres Riset Tumbuh Kembang', waktu: 'Rab 24 • 10.00', color: '#30B864' },
  { title: 'Penandatanganan MoU Dinas', waktu: 'Kam 25 • 13.00', color: '#2DA9E9' },
];

export default function CollaborationHome({
  user,
  onNavigate,
}: {
  user: UserProfile;
  onNavigate: (key: string) => void;
}) {
  const name = user?.parentName || 'Rekan Kolaborasi';
  const initials = name.split(' ').filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase() || 'K';

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
              placeholder="Cari proyek, mitra, atau dokumen..."
              placeholderTextColor="#94A3B8"
            />
          </View>
          <TouchableOpacity
            className="bg-[#C81E45] px-5 py-2.5 rounded-xl flex-row items-center gap-2 shadow-sm hover:bg-[#9F1239] transition"
            onPress={() => onNavigate('Proyek Kolaborasi')}
          >
            <Feather name="plus" size={16} color="#FFFFFF" />
            <Text className="text-white text-sm font-bold">Proyek Baru</Text>
          </TouchableOpacity>
          <View className="bg-white px-3.5 py-2.5 rounded-xl border border-[#F1F5F9] shadow-sm flex-row items-center gap-1.5">
            <Feather name="briefcase" size={14} color="#30B864" />
            <Text className="text-xs font-bold text-[#1E293B]">4 Mitra Aktif</Text>
          </View>
        </View>

        {/* Hero Banner */}
        <View className="rounded-2xl p-6 mb-6 flex-row items-center justify-between relative overflow-hidden">
          <View className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(135deg, #30B864 0%, #1E9E50 100%)' } as any} />
          <View className="absolute -top-10 -right-6 w-40 h-40 rounded-full bg-white/10" />
          <View className="relative z-10 flex-1 pr-4 max-w-xl">
            <Text className="text-white/80 text-[11px] font-bold uppercase tracking-wider mb-1">Dashboard Kolaborasi</Text>
            <Text className="text-2xl font-black text-white mb-2">Halo, {name}!</Text>
            <Text className="text-white/90 text-sm leading-relaxed mb-4">
              3 proyek kolaborasi berjalan aktif dan 2 MoU menunggu tanda tangan. Tinjau dokumen terbaru di sini.
            </Text>
            <TouchableOpacity
              className="bg-white self-start px-5 py-2.5 rounded-lg flex-row items-center gap-2 hover:bg-emerald-50 transition"
              onPress={() => onNavigate('Proyek Kolaborasi')}
            >
              <Feather name="git-merge" size={15} color="#30B864" />
              <Text className="text-[#30B864] text-sm font-bold">Lihat Proyek</Text>
            </TouchableOpacity>
          </View>
          <View className="relative z-10 hidden md:flex items-center justify-center mr-2">
            <View className="w-28 h-28 rounded-full bg-white/15 border border-white/25 items-center justify-center">
              <Feather name="users" size={48} color="#FFFFFF" />
            </View>
          </View>
        </View>

        {/* Statistik */}
        <Text className="text-sm font-extrabold text-[#132A5E] mb-3">Ringkasan Kolaborasi</Text>
        <View className="flex-row gap-3 mb-6" style={{ flexWrap: 'wrap' }}>
          {[
            { label: 'Proyek Aktif', value: '3 proyek', icon: 'layers', color: '#30B864' },
            { label: 'Mitra Terlibat', value: '12 mitra', icon: 'users', color: '#2DA9E9' },
            { label: 'MoU Aktif', value: '4 MoU', icon: 'briefcase', color: '#F59E0B' },
            { label: 'Dokumen', value: '9 file', icon: 'folder', color: '#8B5CF6' },
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

        {/* Proyek Terbaru */}
        <View className="flex-row items-center justify-between mb-3">
          <Text className="text-base font-extrabold text-[#132A5E]">Proyek Kolaborasi Terbaru</Text>
          <TouchableOpacity onPress={() => onNavigate('Proyek Kolaborasi')} className="flex-row items-center gap-1">
            <Text className="text-[#C81E45] text-xs font-bold">Lihat Semua</Text>
            <Feather name="chevron-right" size={14} color="#C81E45" />
          </TouchableOpacity>
        </View>
        <View className="bg-white rounded-2xl border border-[#F1F5F9] shadow-sm overflow-hidden mb-6">
          <View className="flex-row items-center px-5 py-3 border-b border-[#F1F5F9]">
            <Text className="text-[10px] font-black text-gray-400 uppercase tracking-wider" style={{ width: '44%' }}>Proyek</Text>
            <Text className="text-[10px] font-black text-gray-400 uppercase tracking-wider" style={{ width: '32%' }}>Mitra</Text>
            <Text className="text-[10px] font-black text-gray-400 uppercase tracking-wider" style={{ width: '24%' }}>Status</Text>
          </View>
          {PROYEK.map((p) => (
            <View
              key={p.nama}
              className={`flex-row items-center px-5 py-3.5 border-b border-[#F1F5F9] ${
                p.active ? 'bg-[#30B864] mx-3 my-2 rounded-xl shadow-md' : ''
              }`}
            >
              <Text className={`text-xs font-bold ${p.active ? 'text-white' : 'text-[#1E293B]'}`} style={{ width: '44%' }} numberOfLines={1}>{p.nama}</Text>
              <Text className={`text-xs ${p.active ? 'text-white/90' : 'text-gray-500'}`} style={{ width: '32%' }} numberOfLines={1}>{p.mitra}</Text>
              <View style={{ width: '24%' }}>
                <View className={`self-start px-2.5 py-1 rounded-full ${
                  p.active ? 'bg-white/20' : p.status === 'Perencanaan' ? 'bg-amber-50' : 'bg-emerald-50'
                }`}>
                  <Text className={`text-[10px] font-bold ${
                    p.active ? 'text-white' : p.status === 'Perencanaan' ? 'text-amber-600' : 'text-emerald-600'
                  }`}>{p.status}</Text>
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
                <Text className="text-[10px] text-gray-400 font-medium">Kolaborasi</Text>
              </View>
              <View className="w-9 h-9 rounded-full bg-[#30B864] items-center justify-center">
                <Text className="text-white text-xs font-black">{initials}</Text>
              </View>
            </View>
          </View>

          {/* Kalender */}
          <Text className="text-sm font-extrabold text-[#132A5E] mb-3">Agenda Bulan Ini</Text>
          <View className="flex-row items-center justify-between mb-3">
            <View className="flex-row items-center gap-1">
              <TouchableOpacity className="w-7 h-7 rounded-lg bg-gray-50 items-center justify-center">
                <Feather name="chevron-left" size={15} color="#64748B" />
              </TouchableOpacity>
              <TouchableOpacity className="w-7 h-7 rounded-lg bg-gray-50 items-center justify-center">
                <Feather name="chevron-right" size={15} color="#64748B" />
              </TouchableOpacity>
            </View>
            <View className="bg-[#30B864]/10 px-3 py-1 rounded-full">
              <Text className="text-[#30B864] text-[11px] font-extrabold">Agustus</Text>
            </View>
          </View>
          <View className="flex-row gap-2 mb-6">
            {DAYS.map((d) => (
              <View key={d.date} className={`flex-1 items-center rounded-xl py-2.5 ${d.active ? 'bg-[#30B864] shadow-md' : 'bg-gray-50'}`}>
                <Text className={`text-[10px] font-bold ${d.active ? 'text-white/80' : 'text-gray-400'}`}>{d.day}</Text>
                <Text className={`text-sm font-extrabold mt-0.5 ${d.active ? 'text-white' : 'text-[#1E293B]'}`}>{d.date}</Text>
              </View>
            ))}
          </View>

          {/* Agenda Rapat */}
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-sm font-extrabold text-[#132A5E]">Agenda Terdekat</Text>
            <TouchableOpacity onPress={() => onNavigate('Agenda Rapat')}>
              <Text className="text-[#C81E45] text-[11px] font-bold">Lihat Semua</Text>
            </TouchableOpacity>
          </View>
          <View className="flex-col gap-2.5 mb-6">
            {AGENDA.map((a) => (
              <View key={a.title} className="flex-row items-center gap-3">
                <View className="w-10 h-10 rounded-full items-center justify-center" style={{ backgroundColor: `${a.color}20` }}>
                  <Feather name="calendar" size={17} color={a.color} />
                </View>
                <View className="flex-1">
                  <Text className="text-xs font-extrabold text-[#1E293B]" numberOfLines={1}>{a.title}</Text>
                  <Text className="text-[10px] text-gray-400 font-medium">{a.waktu}</Text>
                </View>
              </View>
            ))}
          </View>

          {/* Aksi Cepat */}
          <Text className="text-sm font-extrabold text-[#132A5E] mb-3">Aksi Cepat</Text>
          <View className="flex-col gap-2.5">
            <TouchableOpacity
              className="flex-row items-center gap-3 bg-[#30B864] rounded-xl px-4 py-3 hover:opacity-90 transition"
              onPress={() => onNavigate('MoU & Kerja Sama')}
            >
              <Feather name="briefcase" size={16} color="#FFFFFF" />
              <Text className="text-white text-xs font-bold">Ajukan MoU Baru</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-row items-center gap-3 bg-gray-50 border border-[#F1F5F9] rounded-xl px-4 py-3 hover:bg-gray-100 transition"
              onPress={() => onNavigate('Dokumen')}
            >
              <Feather name="upload" size={16} color="#64748B" />
              <Text className="text-[#1E293B] text-xs font-bold">Unggah Dokumen</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}
