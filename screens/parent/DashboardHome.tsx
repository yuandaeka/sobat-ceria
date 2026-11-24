import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { UserProfile } from '../../types';

const PRIMARY = '#C81E45';

const ASPECTS = [
  { label: 'Motorik Halus', sub: 'Optimal 88%', icon: 'edit-3', color: '#3B82F6', bg: 'bg-blue-100' },
  { label: 'Komunikasi', sub: 'Sangat Baik 92%', icon: 'message-circle', color: '#F97316', bg: 'bg-orange-100' },
  { label: 'Kognitif', sub: 'Optimal 85%', icon: 'cpu', color: '#C81E45', bg: 'bg-rose-100' },
  { label: 'Sosial-Emosi', sub: 'Perlu Stimulasi', icon: 'heart', color: '#14B8A6', bg: 'bg-teal-100' },
  { label: 'Seni & Kriya', sub: 'Optimal 90%', icon: 'pen-tool', color: '#8B5CF6', bg: 'bg-purple-100' },
];

const PROGRAMS = [
  { name: 'Mini Stimulation Class', focus: 'Sensorik & motorik kasar', status: 'Selesai', active: false },
  { name: 'Communication Class', focus: 'Bahasa & bicara', status: 'Selesai', active: false },
  { name: 'Science Class', focus: 'Eksperimen STEAM', status: 'Terjadwal 24 Agu', active: true },
  { name: 'Pottery Class', focus: 'Motorik halus & fokus', status: 'Menunggu', active: false },
  { name: 'Art and Craft Class', focus: 'Kreativitas & imajinasi', status: 'Menunggu', active: false },
  { name: 'Cooking Class', focus: 'Kemandirian & life skill', status: 'Terbuka', active: false },
];

const DAYS = [
  { day: 'Sen', date: '22' },
  { day: 'Sel', date: '23' },
  { day: 'Rab', date: '24', active: true },
  { day: 'Kam', date: '25' },
  { day: 'Jum', date: '26' },
];

const FACILITATORS = [
  { name: 'Bunda Sarah, M.Psi', role: 'Psikolog Anak', color: '#8B5CF6' },
  { name: 'Kak Fatimah, S.Pd', role: 'Tutor Science', color: '#2DA9E9' },
  { name: 'dr. Raditya Sp.A', role: 'Konsultan', color: '#30B864' },
  { name: 'Kak Dina, S.Pd', role: 'Tutor Sensory', color: '#F77712' },
];

const WORKSHEETS = [
  { title: 'Motorik Halus', icon: 'edit-3', color: '#3B82F6' },
  { title: 'Tracing Huruf', icon: 'type', color: '#8B5CF6' },
  { title: 'Modul Sensori', icon: 'layers', color: '#2DA9E9' },
];

export default function DashboardHome({
  user,
  onNavigate,
}: {
  user: UserProfile;
  onNavigate: (key: string) => void;
}) {
  const child = user?.children?.[0] || { name: 'Arka', age: 4 };
  const parentName = user?.parentName || 'Bunda Dinda';

  return (
    <View className="flex-1 flex-row">
      {/* ===== KOLOM TENGAH — MAIN CANVAS ===== */}
      <ScrollView
        className="flex-1 bg-[#FAF7F2]"
        contentContainerStyle={{ padding: 24, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* 1. Top Action Bar */}
        <View className="flex-row items-center gap-3 mb-5">
          <View className="flex-1 flex-row items-center bg-white rounded-xl px-4 py-2.5 border border-[#F1F5F9] shadow-sm">
            <Feather name="search" size={16} color="#94A3B8" />
            <TextInput
              className="flex-1 ml-2 text-sm text-[#1E293B]"
              placeholder="Cari kelas, worksheet, atau artikel..."
              placeholderTextColor="#94A3B8"
            />
          </View>
          <TouchableOpacity
            className="bg-[#C81E45] px-5 py-2.5 rounded-xl flex-row items-center gap-2 shadow-sm hover:bg-[#9F1239] transition"
            onPress={() => onNavigate('Katalog Kelas')}
          >
            <Feather name="plus" size={16} color="#FFFFFF" />
            <Text className="text-white text-sm font-bold">Daftar Kelas</Text>
          </TouchableOpacity>
          <View className="bg-white px-3.5 py-2.5 rounded-xl border border-[#F1F5F9] shadow-sm flex-row items-center gap-1.5">
            <Text className="text-xs">👦</Text>
            <Text className="text-xs font-bold text-[#1E293B]">
              {child.name} • {child.age} Thn
            </Text>
            <Feather name="chevron-down" size={14} color="#94A3B8" />
          </View>
        </View>

        {/* 2. Hero Welcome Banner */}
        <View className="rounded-2xl p-6 mb-6 flex-row items-center justify-between relative overflow-hidden">
          <View
            className="absolute inset-0"
            style={{ backgroundImage: 'linear-gradient(135deg, #C81E45 0%, #9F1239 100%)' } as any}
          />
          <View className="absolute -top-10 -right-6 w-40 h-40 rounded-full bg-white/10" />
          <View className="absolute -bottom-12 right-20 w-28 h-28 rounded-full bg-white/10" />

          <View className="relative z-10 flex-1 pr-4 max-w-xl">
            <Text className="text-white/80 text-[11px] font-bold uppercase tracking-wider mb-1">Dashboard Orang Tua</Text>
            <Text className="text-2xl font-black text-white mb-2">Selamat Pagi, {parentName}!</Text>
            <Text className="text-white/90 text-sm leading-relaxed mb-4">
              Ananda {child.name} telah menyelesaikan 3 dari 4 sesi di Level 1. Pantau grafik STPPA dan jadwal kelas minggu ini!
            </Text>
            <TouchableOpacity
              className="bg-white self-start px-5 py-2.5 rounded-lg flex-row items-center gap-2 hover:bg-rose-50 transition"
              onPress={() => onNavigate('Rapor Anak')}
            >
              <Feather name="bar-chart-2" size={15} color="#C81E45" />
              <Text className="text-[#C81E45] text-sm font-bold">Lihat Rapor</Text>
            </TouchableOpacity>
          </View>

          {/* Ilustrasi dekoratif */}
          <View className="relative z-10 hidden md:flex items-center justify-center mr-2">
            <View className="w-28 h-28 rounded-full bg-white/15 border border-white/25 items-center justify-center">
              <Feather name="smile" size={48} color="#FFFFFF" />
            </View>
          </View>
        </View>

        {/* 3. Pantauan 5 Aspek STPPA */}
        <View className="flex-row items-center justify-between mb-3">
          <Text className="text-base font-extrabold text-[#132A5E]">Pantauan 5 Aspek STPPA</Text>
          <TouchableOpacity onPress={() => onNavigate('Screening STPPA')} className="flex-row items-center gap-1">
            <Text className="text-[#C81E45] text-xs font-bold">Lihat Semua</Text>
            <Feather name="chevron-right" size={14} color="#C81E45" />
          </TouchableOpacity>
        </View>
        <View className="flex-row gap-3 mb-6" style={{ flexWrap: 'wrap' }}>
          {ASPECTS.map((a) => (
            <View
              key={a.label}
              className="bg-white rounded-2xl p-4 border border-[#F1F5F9] shadow-sm items-center"
              style={{ width: '18%', minWidth: 120 }}
            >
              <View className={`w-11 h-11 rounded-xl ${a.bg} items-center justify-center mb-2.5`}>
                <Feather name={a.icon as any} size={20} color={a.color} />
              </View>
              <Text className="text-xs font-extrabold text-[#1E293B] text-center">{a.label}</Text>
              <Text className="text-[10px] font-semibold text-gray-500 mt-1 text-center">{a.sub}</Text>
            </View>
          ))}
        </View>

        {/* 4. Progres Kelas & Aktivitas */}
        <View className="flex-row items-center justify-between mb-3">
          <Text className="text-base font-extrabold text-[#132A5E]">Progres Kelas & Aktivitas {child.name}</Text>
          <TouchableOpacity onPress={() => onNavigate('Katalog Kelas')} className="flex-row items-center gap-1">
            <Text className="text-[#C81E45] text-xs font-bold">Lihat Semua</Text>
            <Feather name="chevron-right" size={14} color="#C81E45" />
          </TouchableOpacity>
        </View>

        <View className="bg-white rounded-2xl border border-[#F1F5F9] shadow-sm overflow-hidden mb-6">
          {/* Table header */}
          <View className="flex-row items-center px-5 py-3 border-b border-[#F1F5F9]">
            <Text className="text-[10px] font-black text-gray-400 uppercase tracking-wider" style={{ width: '34%' }}>Program Kelas</Text>
            <Text className="text-[10px] font-black text-gray-400 uppercase tracking-wider" style={{ width: '30%' }}>Fokus Stimulasi</Text>
            <Text className="text-[10px] font-black text-gray-400 uppercase tracking-wider" style={{ width: '26%' }}>Status</Text>
            <Text className="text-[10px] font-black text-gray-400 uppercase tracking-wider" style={{ width: '10%', textAlign: 'right' }}></Text>
          </View>
          {PROGRAMS.map((p) => (
            <View
              key={p.name}
              className={`flex-row items-center px-5 py-3.5 border-b border-[#F1F5F9] ${
                p.active ? 'bg-[#C81E45] mx-3 my-2 rounded-xl shadow-md' : ''
              }`}
              style={p.active ? { marginBottom: 2 } : undefined}
            >
              <Text
                className={`text-xs font-bold ${p.active ? 'text-white' : 'text-[#1E293B]'}`}
                style={{ width: '34%' }}
                numberOfLines={1}
              >
                {p.name}
              </Text>
              <Text
                className={`text-xs ${p.active ? 'text-white/90' : 'text-gray-500'}`}
                style={{ width: '30%' }}
                numberOfLines={1}
              >
                {p.focus}
              </Text>
              <View style={{ width: '26%' }}>
                <View
                  className={`self-start px-2.5 py-1 rounded-full ${
                    p.active ? 'bg-white/20' : p.status === 'Selesai' ? 'bg-emerald-50' : p.status === 'Terbuka' ? 'bg-rose-50' : 'bg-amber-50'
                  }`}
                >
                  <Text
                    className={`text-[10px] font-bold ${
                      p.active ? 'text-white' : p.status === 'Selesai' ? 'text-emerald-600' : p.status === 'Terbuka' ? 'text-[#C81E45]' : 'text-amber-600'
                    }`}
                  >
                    {p.status}
                  </Text>
                </View>
              </View>
              <View style={{ width: '10%', alignItems: 'flex-end' }}>
                <Feather name="more-vertical" size={16} color={p.active ? '#FFFFFF' : '#94A3B8'} />
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* ===== KOLOM KANAN — RIGHT PANEL ===== */}
      <View className="hidden xl:flex w-80 bg-white border-l border-[#F1F5F9] flex-col">
        <ScrollView contentContainerStyle={{ padding: 24 }} showsVerticalScrollIndicator={false}>
          {/* 1. Top Profile Bar */}
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
            <TouchableOpacity className="flex-row items-center gap-2" onPress={() => onNavigate('Profil')}>
              <View className="items-end">
                <Text className="text-xs font-extrabold text-[#1E293B]">{parentName}</Text>
                <Text className="text-[10px] text-gray-400 font-medium">Lihat profil</Text>
              </View>
              <View className="w-9 h-9 rounded-full bg-[#C81E45] items-center justify-center">
                <Text className="text-white text-xs font-black">
                  {parentName.split(' ').filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase() || 'S'}
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* 2. Widget Jadwal Kelas */}
          <Text className="text-sm font-extrabold text-[#132A5E] mb-3">Jadwal Kelas</Text>
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
              <View
                key={d.date}
                className={`flex-1 items-center rounded-xl py-2.5 ${
                  d.active ? 'bg-[#C81E45] shadow-md' : 'bg-gray-50'
                }`}
              >
                <Text className={`text-[10px] font-bold ${d.active ? 'text-white/80' : 'text-gray-400'}`}>{d.day}</Text>
                <Text className={`text-sm font-extrabold mt-0.5 ${d.active ? 'text-white' : 'text-[#1E293B]'}`}>{d.date}</Text>
              </View>
            ))}
          </View>

          {/* 3. Widget Fasilitator & Psikolog */}
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-sm font-extrabold text-[#132A5E]">Fasilitator & Psikolog</Text>
            <TouchableOpacity>
              <Text className="text-[#C81E45] text-[11px] font-bold">Lihat Semua</Text>
            </TouchableOpacity>
          </View>
          <View className="flex-col gap-2.5 mb-6">
            {FACILITATORS.map((f) => (
              <View key={f.name} className="flex-row items-center gap-2.5">
                <View className="w-10 h-10 rounded-full items-center justify-center" style={{ backgroundColor: `${f.color}20` }}>
                  <Text className="text-xs font-black" style={{ color: f.color }}>
                    {f.name.split(' ').filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase()}
                  </Text>
                </View>
                <View className="flex-1">
                  <Text className="text-xs font-extrabold text-[#1E293B]" numberOfLines={1}>{f.name}</Text>
                  <Text className="text-[10px] text-gray-400 font-medium">{f.role}</Text>
                </View>
                <TouchableOpacity className="w-8 h-8 rounded-full bg-[#C81E45]/10 items-center justify-center">
                  <Feather name="message-circle" size={14} color="#C81E45" />
                </TouchableOpacity>
                <TouchableOpacity className="w-8 h-8 rounded-full bg-[#C81E45]/10 items-center justify-center">
                  <Feather name="info" size={14} color="#C81E45" />
                </TouchableOpacity>
              </View>
            ))}
          </View>

          {/* 4. Widget Worksheet Siap Unduh */}
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-sm font-extrabold text-[#132A5E]">Worksheet Siap Unduh</Text>
            <TouchableOpacity onPress={() => onNavigate('Worksheet PDF')}>
              <Text className="text-[#C81E45] text-[11px] font-bold">Lihat Semua</Text>
            </TouchableOpacity>
          </View>
          <View className="flex-row gap-2">
            {WORKSHEETS.map((w) => (
              <View key={w.title} className="flex-1 bg-gray-50 rounded-2xl p-3 items-center border border-[#F1F5F9]">
                <View className="w-10 h-10 rounded-full bg-white items-center justify-center mb-2 shadow-sm">
                  <Feather name={w.icon as any} size={17} color={w.color} />
                </View>
                <Text className="text-[10px] font-extrabold text-[#1E293B] text-center" numberOfLines={1}>{w.title}</Text>
                <TouchableOpacity className="mt-2 bg-[#C81E45] px-3 py-1 rounded-full">
                  <Text className="text-white text-[9px] font-bold">Unduh</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
    </View>
  );
}
