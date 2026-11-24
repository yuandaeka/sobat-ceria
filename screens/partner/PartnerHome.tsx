import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { UserProfile } from '../../types';

const LEADS = [
  { nama: 'Yayasan Harapan', program: 'Franchise Class Toolkit', status: 'Follow-up', nilai: 'Rp 15jt', active: false },
  { nama: 'TK Pelangi', program: 'Kemitraan Sekolah', status: 'Baru', nilai: 'Rp 8jt', active: true },
  { nama: 'Komunitas Ibu Ceria', program: 'Reseller Worksheet', status: 'Closing', nilai: 'Rp 3jt', active: false },
  { nama: 'PAUD Mentari', program: 'Kemitraan Sekolah', status: 'Follow-up', nilai: 'Rp 6jt', active: false },
];

const DAYS = [
  { day: 'Sen', date: '22' },
  { day: 'Sel', date: '23' },
  { day: 'Rab', date: '24', active: true },
  { day: 'Kam', date: '25' },
  { day: 'Jum', date: '26' },
];

const FOLLOWUP = [
  { title: 'Follow-up Yayasan Harapan', waktu: 'Rab 24 • 10.00', color: '#F77712' },
  { title: 'Presentasi TK Pelangi', waktu: 'Kam 25 • 13.00', color: '#2DA9E9' },
];

export default function PartnerHome({
  user,
  onNavigate,
}: {
  user: UserProfile;
  onNavigate: (key: string) => void;
}) {
  const name = user?.parentName || 'Rekan Mitra';
  const initials = name.split(' ').filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase() || 'M';

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
              placeholder="Cari leads, program, atau dokumen..."
              placeholderTextColor="#94A3B8"
            />
          </View>
          <TouchableOpacity
            className="bg-[#C81E45] px-5 py-2.5 rounded-xl flex-row items-center gap-2 shadow-sm hover:bg-[#9F1239] transition"
            onPress={() => onNavigate('Prospek Leads')}
          >
            <Feather name="plus" size={16} color="#FFFFFF" />
            <Text className="text-white text-sm font-bold">Tambah Leads</Text>
          </TouchableOpacity>
          <View className="bg-white px-3.5 py-2.5 rounded-xl border border-[#F1F5F9] shadow-sm flex-row items-center gap-1.5">
            <Feather name="dollar-sign" size={14} color="#30B864" />
            <Text className="text-xs font-bold text-[#1E293B]">Rp 1.2jt</Text>
          </View>
        </View>

        {/* Hero Banner */}
        <View className="rounded-2xl p-6 mb-6 flex-row items-center justify-between relative overflow-hidden">
          <View className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(135deg, #F77712 0%, #D95E0A 100%)' } as any} />
          <View className="absolute -top-10 -right-6 w-40 h-40 rounded-full bg-white/10" />
          <View className="relative z-10 flex-1 pr-4 max-w-xl">
            <Text className="text-white/80 text-[11px] font-bold uppercase tracking-wider mb-1">Dashboard Mitra</Text>
            <Text className="text-2xl font-black text-white mb-2">Halo, {name}!</Text>
            <Text className="text-white/90 text-sm leading-relaxed mb-4">
              15 prospek leads menunggu follow-up. Komisi referal bulan ini mencapai Rp 1.200.000.
            </Text>
            <TouchableOpacity
              className="bg-white self-start px-5 py-2.5 rounded-lg flex-row items-center gap-2 hover:bg-orange-50 transition"
              onPress={() => onNavigate('Prospek Leads')}
            >
              <Feather name="user-check" size={15} color="#F77712" />
              <Text className="text-[#F77712] text-sm font-bold">Kelola Leads</Text>
            </TouchableOpacity>
          </View>
          <View className="relative z-10 hidden md:flex items-center justify-center mr-2">
            <View className="w-28 h-28 rounded-full bg-white/15 border border-white/25 items-center justify-center">
              <Feather name="briefcase" size={48} color="#FFFFFF" />
            </View>
          </View>
        </View>

        {/* Statistik */}
        <Text className="text-sm font-extrabold text-[#132A5E] mb-3">Ringkasan Kemitraan</Text>
        <View className="flex-row gap-3 mb-6" style={{ flexWrap: 'wrap' }}>
          {[
            { label: 'Program Aktif', value: '2 program', icon: 'briefcase', color: '#F77712' },
            { label: 'Prospek Leads', value: '15 leads', icon: 'user-check', color: '#2DA9E9' },
            { label: 'Komisi Bulan Ini', value: 'Rp 1.2jt', icon: 'dollar-sign', color: '#30B864' },
            { label: 'Total Referal', value: '24 referal', icon: 'trending-up', color: '#8B5CF6' },
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

        {/* Leads Terbaru */}
        <View className="flex-row items-center justify-between mb-3">
          <Text className="text-base font-extrabold text-[#132A5E]">Prospek Leads Terbaru</Text>
          <TouchableOpacity onPress={() => onNavigate('Prospek Leads')} className="flex-row items-center gap-1">
            <Text className="text-[#C81E45] text-xs font-bold">Lihat Semua</Text>
            <Feather name="chevron-right" size={14} color="#C81E45" />
          </TouchableOpacity>
        </View>
        <View className="bg-white rounded-2xl border border-[#F1F5F9] shadow-sm overflow-hidden mb-6">
          <View className="flex-row items-center px-5 py-3 border-b border-[#F1F5F9]">
            <Text className="text-[10px] font-black text-gray-400 uppercase tracking-wider" style={{ width: '34%' }}>Nama Leads</Text>
            <Text className="text-[10px] font-black text-gray-400 uppercase tracking-wider" style={{ width: '30%' }}>Program</Text>
            <Text className="text-[10px] font-black text-gray-400 uppercase tracking-wider" style={{ width: '20%' }}>Status</Text>
            <Text className="text-[10px] font-black text-gray-400 uppercase tracking-wider" style={{ width: '16%', textAlign: 'right' }}>Estimasi</Text>
          </View>
          {LEADS.map((l) => (
            <View
              key={l.nama}
              className={`flex-row items-center px-5 py-3.5 border-b border-[#F1F5F9] ${
                l.active ? 'bg-[#F77712] mx-3 my-2 rounded-xl shadow-md' : ''
              }`}
            >
              <Text className={`text-xs font-bold ${l.active ? 'text-white' : 'text-[#1E293B]'}`} style={{ width: '34%' }} numberOfLines={1}>{l.nama}</Text>
              <Text className={`text-xs ${l.active ? 'text-white/90' : 'text-gray-500'}`} style={{ width: '30%' }} numberOfLines={1}>{l.program}</Text>
              <View style={{ width: '20%' }}>
                <View className={`self-start px-2.5 py-1 rounded-full ${
                  l.active ? 'bg-white/20' : l.status === 'Closing' ? 'bg-emerald-50' : l.status === 'Baru' ? 'bg-blue-50' : 'bg-amber-50'
                }`}>
                  <Text className={`text-[10px] font-bold ${
                    l.active ? 'text-white' : l.status === 'Closing' ? 'text-emerald-600' : l.status === 'Baru' ? 'text-blue-600' : 'text-amber-600'
                  }`}>{l.status}</Text>
                </View>
              </View>
              <Text className={`text-xs font-extrabold ${l.active ? 'text-white' : 'text-[#1E293B]'}`} style={{ width: '16%', textAlign: 'right' }}>{l.nilai}</Text>
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
                <Text className="text-[10px] text-gray-400 font-medium">Mitra</Text>
              </View>
              <View className="w-9 h-9 rounded-full bg-[#F77712] items-center justify-center">
                <Text className="text-white text-xs font-black">{initials}</Text>
              </View>
            </View>
          </View>

          {/* Kalender */}
          <Text className="text-sm font-extrabold text-[#132A5E] mb-3">Agenda Follow-up</Text>
          <View className="flex-row items-center justify-between mb-3">
            <View className="flex-row items-center gap-1">
              <TouchableOpacity className="w-7 h-7 rounded-lg bg-gray-50 items-center justify-center">
                <Feather name="chevron-left" size={15} color="#64748B" />
              </TouchableOpacity>
              <TouchableOpacity className="w-7 h-7 rounded-lg bg-gray-50 items-center justify-center">
                <Feather name="chevron-right" size={15} color="#64748B" />
              </TouchableOpacity>
            </View>
            <View className="bg-[#F77712]/10 px-3 py-1 rounded-full">
              <Text className="text-[#F77712] text-[11px] font-extrabold">Agustus</Text>
            </View>
          </View>
          <View className="flex-row gap-2 mb-6">
            {DAYS.map((d) => (
              <View key={d.date} className={`flex-1 items-center rounded-xl py-2.5 ${d.active ? 'bg-[#F77712] shadow-md' : 'bg-gray-50'}`}>
                <Text className={`text-[10px] font-bold ${d.active ? 'text-white/80' : 'text-gray-400'}`}>{d.day}</Text>
                <Text className={`text-sm font-extrabold mt-0.5 ${d.active ? 'text-white' : 'text-[#1E293B]'}`}>{d.date}</Text>
              </View>
            ))}
          </View>

          {/* Follow-up Terdekat */}
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-sm font-extrabold text-[#132A5E]">Follow-up Terdekat</Text>
            <TouchableOpacity onPress={() => onNavigate('Prospek Leads')}>
              <Text className="text-[#C81E45] text-[11px] font-bold">Lihat Semua</Text>
            </TouchableOpacity>
          </View>
          <View className="flex-col gap-2.5 mb-6">
            {FOLLOWUP.map((f) => (
              <View key={f.title} className="flex-row items-center gap-3">
                <View className="w-10 h-10 rounded-full items-center justify-center" style={{ backgroundColor: `${f.color}20` }}>
                  <Feather name="calendar" size={17} color={f.color} />
                </View>
                <View className="flex-1">
                  <Text className="text-xs font-extrabold text-[#1E293B]" numberOfLines={1}>{f.title}</Text>
                  <Text className="text-[10px] text-gray-400 font-medium">{f.waktu}</Text>
                </View>
              </View>
            ))}
          </View>

          {/* Aksi Cepat */}
          <Text className="text-sm font-extrabold text-[#132A5E] mb-3">Aksi Cepat</Text>
          <View className="flex-col gap-2.5">
            <TouchableOpacity
              className="flex-row items-center gap-3 bg-[#F77712] rounded-xl px-4 py-3 hover:opacity-90 transition"
              onPress={() => onNavigate('Prospek Leads')}
            >
              <Feather name="user-plus" size={16} color="#FFFFFF" />
              <Text className="text-white text-xs font-bold">Tambah Leads Baru</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-row items-center gap-3 bg-gray-50 border border-[#F1F5F9] rounded-xl px-4 py-3 hover:bg-gray-100 transition"
              onPress={() => onNavigate('Dokumen Mitra')}
            >
              <Feather name="folder" size={16} color="#64748B" />
              <Text className="text-[#1E293B] text-xs font-bold">Buka Dokumen Mitra</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}
