import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Modal,
  Linking,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { UserProfile, UserRole, AccountStatus, AdminUserData } from '../../types';
import { ROLES } from '../../lib/roles';
import { fetchAdminUsersList, updateUserAccountStatus } from '../../lib/profile';

// Fallback data awal jika database Supabase belum ada data pendaftar non-parent
const INITIAL_MOCK_USERS: AdminUserData[] = [
  {
    id: 'mock-1',
    name: 'Kak Zahra Nurul',
    email: 'zahra.tutor@gmail.com',
    phone: '081234567891',
    role: 'teacher',
    status: 'pending',
    createdAt: '2026-11-24T10:00:00Z',
    details: { specialization: 'Sensory Play & Calistung', education: 'S1 PGPAUD UNJ' },
  },
  {
    id: 'mock-2',
    name: 'Ahmad Fadhil',
    email: 'fadhil.volunteer@gmail.com',
    phone: '085678901234',
    role: 'volunteer',
    status: 'pending',
    createdAt: '2026-11-24T09:30:00Z',
    details: { city: 'Solo', availability: 'Sabtu & Minggu', occupation: 'Mahasiswa Psikologi' },
  },
  {
    id: 'mock-3',
    name: 'Klinik Tumbuh Kembang Sehat',
    email: 'kerjasama@kliniksehat.com',
    phone: '082199887766',
    role: 'partner',
    status: 'pending',
    createdAt: '2026-11-23T15:20:00Z',
    details: { brandName: 'Klinik Tumbuh Kembang Sehat', businessType: 'Rujukan Medis & Terapi Wicara' },
  },
  {
    id: 'mock-4',
    name: 'Bunda Dinda & Arka',
    email: 'dinda@sobatceria.id',
    phone: '081298765432',
    role: 'parent',
    status: 'active',
    createdAt: '2026-11-20T08:00:00Z',
  },
  {
    id: 'mock-5',
    name: 'Kak Rian S.Pd',
    email: 'rian@sobatceria.id',
    phone: '081344556677',
    role: 'teacher',
    status: 'active',
    createdAt: '2026-11-18T14:00:00Z',
    details: { specialization: 'Art & Craft, Mini STEM' },
  },
];

type FilterTab = 'all' | 'pending' | 'teacher' | 'volunteer' | 'partner' | 'collaboration' | 'parent';

export default function AdminUserScreen({ user }: { user: UserProfile }) {
  const [users, setUsers] = useState<AdminUserData[]>(INITIAL_MOCK_USERS);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<FilterTab>('all');
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [selectedApplicant, setSelectedApplicant] = useState<AdminUserData | null>(null);
  const [approvedApplicant, setApprovedApplicant] = useState<AdminUserData | null>(null);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const liveUsers = await fetchAdminUsersList();
      if (liveUsers && liveUsers.length > 0) {
        // Gabungkan live users dengan mock pendaftar yang statusnya pending untuk preview lengkap
        const existingIds = new Set(liveUsers.map((u) => u.id));
        const combined = [...liveUsers, ...INITIAL_MOCK_USERS.filter((m) => !existingIds.has(m.id))];
        setUsers(combined);
      }
    } catch {
      // jika gagal, tetap gunakan initial data
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleUpdateStatus = async (targetUser: AdminUserData, nextStatus: AccountStatus) => {
    setProcessingId(targetUser.id);
    try {
      // Update di Supabase & sinkronkan detail lengkap pelamar
      if (!targetUser.id.startsWith('mock-')) {
        await updateUserAccountStatus(targetUser.id, nextStatus, targetUser.role, targetUser);
      }

      // Update state lokal
      setUsers((prev) =>
        prev.map((u) => (u.id === targetUser.id ? { ...u, status: nextStatus } : u))
      );

      // Jika pendaftar berstatus pending disetujui, buka modal notifikasi WhatsApp/Email
      if (nextStatus === 'active' && targetUser.status === 'pending') {
        setApprovedApplicant(targetUser);
        setSelectedApplicant(null);
      }
    } catch (err: any) {
      alert(`Gagal memperbarui status: ${err?.message || 'Terjadi kesalahan'}`);
    } finally {
      setProcessingId(null);
    }
  };

  const handleSendWhatsApp = (target: AdminUserData) => {
    const cleanPhone = (target.phone || '').replace(/[^0-9]/g, '');
    const formattedPhone = cleanPhone.startsWith('0') ? '62' + cleanPhone.slice(1) : cleanPhone;
    const roleLabel = ROLES[target.role]?.label || target.role;
    const accessDesc =
      target.role === 'volunteer'
        ? 'jadwal kegiatan, absensi, dan dokumentasi volunteer'
        : target.role === 'collaboration'
        ? 'dashboard kolaborasi, manajemen proyek, dan dokumen MoU'
        : target.role === 'partner'
        ? 'dashboard mitra, program kemitraan, leads rujukan, dan laporan komisi'
        : 'dashboard mengajar, materi, dan jadwal kelas';
    const text = encodeURIComponent(
      `Halo Kak ${target.name}! 🎉\n\nSelamat, pendaftaran Anda sebagai *${roleLabel}* di Sobat Ceria telah *DISETUJUI* oleh Admin.\n\nAnda sekarang dapat login ke platform Sobat Ceria di http://localhost:8082 untuk mulai mengakses ${accessDesc}.\n\nSalam hangat,\n*Tim Sobat Ceria*`
    );
    Linking.openURL(`https://wa.me/${formattedPhone}?text=${text}`).catch(() => {});
  };

  const handleSendEmail = (target: AdminUserData) => {
    const roleLabel = ROLES[target.role]?.label || target.role;
    const accessDesc =
      target.role === 'volunteer'
        ? 'dashboard volunteer, jadwal kegiatan, dan absensi'
        : target.role === 'collaboration'
        ? 'dashboard kolaborasi, proyek bersama, dan dokumen MoU'
        : target.role === 'partner'
        ? 'dashboard mitra, program kemitraan, leads rujukan, dan komisi'
        : 'dashboard, modul kelas, dan presensi murid';
    const subject = encodeURIComponent(`Pendaftaran ${roleLabel} Sobat Ceria Telah Disetujui 🎉`);
    const body = encodeURIComponent(
      `Halo Kak ${target.name},\n\nSelamat! Pendaftaran Anda sebagai ${roleLabel} di platform Sobat Ceria telah ditinjau dan DISETUJUI oleh Admin.\n\nAnda sekarang dapat login ke akun Sobat Ceria menggunakan email ini (${target.email}) untuk mengakses ${accessDesc}.\n\nJika ada pertanyaan, silakan hubungi tim kami via WhatsApp di 0812-3456-7890.\n\nSelamat bergabung di ekosistem Sobat Ceria!\n\nSalam hangat,\nTim Sobat Ceria`
    );
    Linking.openURL(`mailto:${target.email}?subject=${subject}&body=${body}`).catch(() => {});
  };

  // Metrics
  const pendingCount = users.filter((u) => u.status === 'pending').length;
  const activeCount = users.filter((u) => u.status === 'active').length;
  const teacherCount = users.filter((u) => u.role === 'teacher').length;
  const volunteerCount = users.filter((u) => u.role === 'volunteer').length;
  const partnerCount = users.filter((u) => u.role === 'partner' || u.role === 'collaboration').length;

  // Filter & Search
  const filteredUsers = users.filter((u) => {
    // Tab filter
    if (activeTab === 'pending' && u.status !== 'pending') return false;
    if (activeTab === 'teacher' && u.role !== 'teacher') return false;
    if (activeTab === 'volunteer' && u.role !== 'volunteer') return false;
    if (activeTab === 'partner' && u.role !== 'partner') return false;
    if (activeTab === 'collaboration' && u.role !== 'collaboration') return false;
    if (activeTab === 'parent' && u.role !== 'parent') return false;

    // Search query
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchName = u.name.toLowerCase().includes(q);
      const matchEmail = u.email.toLowerCase().includes(q);
      const matchPhone = u.phone.toLowerCase().includes(q);
      return matchName || matchEmail || matchPhone;
    }
    return true;
  });

  return (
    <ScrollView
      className="flex-1 bg-[#FAF7F2]"
      contentContainerStyle={{ padding: 24, paddingBottom: 50 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View className="flex-row items-center justify-between mb-6 flex-wrap gap-4">
        <View>
          <Text className="text-xl md:text-2xl font-black text-[#132A5E]">
            Kelola Pengguna & Approval Role
          </Text>
          <Text className="text-xs text-gray-500 font-medium mt-1">
            Pantau dan verifikasi pendaftaran Guru, Relawan, Mitra, dan Kolaborator baru
          </Text>
        </View>

        <TouchableOpacity
          onPress={loadUsers}
          className="bg-white border border-gray-200 px-3.5 py-2 rounded-xl flex-row items-center gap-2 shadow-xs hover:bg-gray-50 transition"
        >
          <Feather name="refresh-cw" size={13} color="#4B5563" />
          <Text className="text-xs font-bold text-gray-700">Segarkan Data</Text>
        </TouchableOpacity>
      </View>

      {/* Metric Cards Banner */}
      <View className="grid grid-cols-2 md:grid-cols-4 gap-3.5 mb-6">
        <View className="bg-white rounded-2xl p-4 border border-amber-200 shadow-xs flex-row items-center gap-3">
          <View className="w-11 h-11 rounded-xl bg-amber-50 items-center justify-center shrink-0">
            <Feather name="clock" size={20} color="#D97706" />
          </View>
          <View>
            <Text className="text-2xl font-black text-amber-700">{pendingCount}</Text>
            <Text className="text-[10px] font-bold text-amber-800 uppercase tracking-wide">
              Menunggu Review
            </Text>
          </View>
        </View>

        <View className="bg-white rounded-2xl p-4 border border-emerald-100 shadow-xs flex-row items-center gap-3">
          <View className="w-11 h-11 rounded-xl bg-emerald-50 items-center justify-center shrink-0">
            <Feather name="check-circle" size={20} color="#059669" />
          </View>
          <View>
            <Text className="text-2xl font-black text-[#132A5E]">{activeCount}</Text>
            <Text className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">
              Akun Aktif
            </Text>
          </View>
        </View>

        <View className="bg-white rounded-2xl p-4 border border-purple-100 shadow-xs flex-row items-center gap-3">
          <View className="w-11 h-11 rounded-xl bg-purple-50 items-center justify-center shrink-0">
            <Feather name="users" size={20} color="#7C3AED" />
          </View>
          <View>
            <Text className="text-2xl font-black text-[#132A5E]">{teacherCount + volunteerCount}</Text>
            <Text className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">
              Guru & Relawan
            </Text>
          </View>
        </View>

        <View className="bg-white rounded-2xl p-4 border border-blue-100 shadow-xs flex-row items-center gap-3">
          <View className="w-11 h-11 rounded-xl bg-blue-50 items-center justify-center shrink-0">
            <Feather name="briefcase" size={20} color="#2563EB" />
          </View>
          <View>
            <Text className="text-2xl font-black text-[#132A5E]">{partnerCount}</Text>
            <Text className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">
              Mitra & Collab
            </Text>
          </View>
        </View>
      </View>

      {/* Filter Tabs & Search Bar */}
      <View className="bg-white rounded-2xl p-3 border border-gray-100 shadow-xs mb-4 flex-col md:flex-row items-center justify-between gap-3">
        {/* Tabs */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row gap-1.5 w-full md:w-auto">
          {[
            { key: 'all', label: 'Semua User' },
            { key: 'pending', label: `Perlu Review (${pendingCount})`, isAlert: pendingCount > 0 },
            { key: 'teacher', label: 'Guru / Tutor' },
            { key: 'volunteer', label: 'Volunteer' },
            { key: 'partner', label: 'Mitra' },
            { key: 'collaboration', label: 'Kolaborasi' },
            { key: 'parent', label: 'Orang Tua' },
          ].map((tab) => {
            const isSelected = activeTab === tab.key;
            return (
              <TouchableOpacity
                key={tab.key}
                onPress={() => setActiveTab(tab.key as FilterTab)}
                className={`px-3.5 py-1.5 rounded-xl flex-row items-center gap-1.5 transition ${
                  isSelected
                    ? tab.isAlert
                      ? 'bg-amber-500 text-white shadow-xs'
                      : 'bg-[#132A5E] text-white shadow-xs'
                    : tab.isAlert
                    ? 'bg-amber-50 border border-amber-200'
                    : 'bg-gray-50 hover:bg-gray-100'
                }`}
              >
                <Text
                  className={`text-xs font-bold ${
                    isSelected
                      ? 'text-white'
                      : tab.isAlert
                      ? 'text-amber-800 font-extrabold'
                      : 'text-gray-600'
                  }`}
                >
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Search Input */}
        <View className="w-full md:w-64 bg-gray-50 border border-gray-200 rounded-xl px-3 py-1.5 flex-row items-center gap-2">
          <Feather name="search" size={14} color="#9CA3AF" />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Cari nama, email, wa..."
            placeholderTextColor="#9CA3AF"
            className="text-xs text-gray-800 flex-1 font-medium"
          />
          {search ? (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Feather name="x" size={13} color="#9CA3AF" />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      {/* Table / List User */}
      <View className="bg-white rounded-3xl border border-gray-100 shadow-xs overflow-hidden">
        {loading ? (
          <View className="py-16 items-center justify-center">
            <ActivityIndicator size="large" color="#132A5E" />
            <Text className="text-xs text-gray-500 font-medium mt-3">Memuat data pengguna...</Text>
          </View>
        ) : filteredUsers.length === 0 ? (
          <View className="py-16 items-center justify-center">
            <Feather name="inbox" size={36} color="#D1D5DB" />
            <Text className="text-sm font-bold text-gray-500 mt-2">Tidak ada pengguna ditemukan</Text>
            <Text className="text-xs text-gray-400 mt-0.5">Coba ubah tab filter atau kata kunci pencarian</Text>
          </View>
        ) : (
          filteredUsers.map((u, i) => {
            const roleMeta = ROLES[u.role] || ROLES.parent;
            const isPending = u.status === 'pending';
            const isProcessing = processingId === u.id;

            return (
              <View
                key={u.id}
                className={`flex-col md:flex-row md:items-center justify-between p-4 md:px-6 md:py-4.5 gap-3 ${
                  i < filteredUsers.length - 1 ? 'border-b border-gray-100' : ''
                } ${isPending ? 'bg-amber-50/20' : ''}`}
              >
                {/* User Identity */}
                <View className="flex-row items-center gap-3.5 flex-1">
                  <View
                    className="w-12 h-12 rounded-2xl items-center justify-center shrink-0 shadow-2xs"
                    style={{ backgroundColor: `${roleMeta.color}18` }}
                  >
                    <Feather name={roleMeta.icon as any} size={22} color={roleMeta.color} />
                  </View>
                  <View className="flex-1">
                    <View className="flex-row items-center gap-2 flex-wrap">
                      <Text className="text-sm font-extrabold text-[#162E5C]">{u.name}</Text>
                      {/* Role Pill */}
                      <View className="px-2 py-0.5 rounded-full" style={{ backgroundColor: `${roleMeta.color}15` }}>
                        <Text className="text-[10px] font-black" style={{ color: roleMeta.color }}>
                          {roleMeta.label}
                        </Text>
                      </View>
                      {/* Status Pill */}
                      <View
                        className={`px-2 py-0.5 rounded-full ${
                          u.status === 'pending'
                            ? 'bg-amber-100 border border-amber-300'
                            : u.status === 'active'
                            ? 'bg-emerald-50 border border-emerald-200'
                            : 'bg-rose-50 border border-rose-200'
                        }`}
                      >
                        <Text
                          className={`text-[9px] font-black uppercase tracking-wider ${
                            u.status === 'pending'
                              ? 'text-amber-800'
                              : u.status === 'active'
                              ? 'text-emerald-700'
                              : 'text-rose-700'
                          }`}
                        >
                          {u.status === 'pending'
                            ? 'Menunggu Review'
                            : u.status === 'active'
                            ? 'Aktif'
                            : 'Ditolak'}
                        </Text>
                      </View>
                    </View>

                    <View className="flex-row items-center gap-3 mt-1 flex-wrap">
                      <Text className="text-[11px] text-gray-500 font-medium flex-row items-center gap-1">
                        <Feather name="mail" size={11} color="#9CA3AF" /> {u.email}
                      </Text>
                      <Text className="text-[11px] text-gray-500 font-medium flex-row items-center gap-1">
                        <Feather name="phone" size={11} color="#9CA3AF" /> {u.phone}
                      </Text>
                    </View>

                    {/* Role Specific Details Preview if available */}
                    {u.details ? (
                      <View className="mt-1.5 flex-row items-center gap-2 flex-wrap">
                        {Object.entries(u.details).map(([k, val]) => (
                          <View key={k} className="bg-gray-100 px-2 py-0.5 rounded-md">
                            <Text className="text-[10px] text-gray-600 font-semibold">
                              {k === 'specialization' ? 'Keahlian: ' : k === 'city' ? 'Kota: ' : ''}
                              {String(val)}
                            </Text>
                          </View>
                        ))}
                      </View>
                    ) : null}
                  </View>
                </View>

                {/* Actions per Row */}
                <View className="flex-row items-center gap-2 self-end md:self-center shrink-0">
                  {isProcessing ? (
                    <ActivityIndicator size="small" color="#132A5E" />
                  ) : isPending ? (
                    /* Tombol Approval Cepat */
                    <>
                      <TouchableOpacity
                        onPress={() => setSelectedApplicant(u)}
                        className="bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-xl flex-row items-center gap-1.5 active:scale-95 transition"
                      >
                        <Feather name="eye" size={13} color="#4B5563" />
                        <Text className="text-gray-700 text-xs font-bold">Detail</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        onPress={() => handleUpdateStatus(u, 'active')}
                        className="bg-emerald-600 hover:bg-emerald-700 px-3.5 py-1.5 rounded-xl flex-row items-center gap-1.5 shadow-xs active:scale-95 transition"
                      >
                        <Feather name="check" size={14} color="#FFFFFF" />
                        <Text className="text-white text-xs font-bold">Setujui (Approve)</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        onPress={() => handleUpdateStatus(u, 'rejected')}
                        className="bg-gray-100 hover:bg-rose-50 px-3 py-1.5 rounded-xl flex-row items-center gap-1.5 active:scale-95 transition"
                      >
                        <Feather name="x" size={13} color="#EF4444" />
                        <Text className="text-rose-600 text-xs font-bold">Tolak</Text>
                      </TouchableOpacity>
                    </>
                  ) : u.status === 'active' ? (
                    /* Tombol Ubah Status bila sudah aktif */
                    <TouchableOpacity
                      onPress={() => handleUpdateStatus(u, 'rejected')}
                      className="bg-gray-50 hover:bg-rose-50 px-3 py-1.5 rounded-xl flex-row items-center gap-1.5 border border-gray-200 active:scale-95 transition"
                    >
                      <Feather name="slash" size={12} color="#6B7280" />
                      <Text className="text-gray-600 text-[11px] font-semibold">Nonaktifkan</Text>
                    </TouchableOpacity>
                  ) : (
                    /* Tombol Aktifkan Kembali jika Ditolak */
                    <TouchableOpacity
                      onPress={() => handleUpdateStatus(u, 'active')}
                      className="bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-xl flex-row items-center gap-1.5 border border-emerald-200 active:scale-95 transition"
                    >
                      <Feather name="rotate-ccw" size={12} color="#059669" />
                      <Text className="text-emerald-700 text-[11px] font-semibold">Aktifkan Kembali</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            );
          })
        )}
      </View>

      {/* 1. MODAL DETAIL KUALIFIKASI PELAMAR (GURU / LAINNYA) */}
      <Modal
        visible={!!selectedApplicant}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedApplicant(null)}
      >
        <View className="flex-1 bg-black/60 items-center justify-center p-4">
          <View className="bg-white w-full max-w-lg rounded-[2.5rem] overflow-hidden shadow-2xl p-6">
            {selectedApplicant && (
              <>
                <View className="flex-row items-center justify-between pb-4 border-b border-gray-100 mb-4">
                  <View className="flex-row items-center gap-3">
                    <View
                      className="w-12 h-12 rounded-2xl items-center justify-center"
                      style={{ backgroundColor: `${ROLES[selectedApplicant.role]?.color || '#8B22C0'}18` }}
                    >
                      <Feather
                        name={(ROLES[selectedApplicant.role]?.icon as any) || 'user'}
                        size={22}
                        color={ROLES[selectedApplicant.role]?.color || '#8B22C0'}
                      />
                    </View>
                    <View>
                      <View
                        className="px-2.5 py-0.5 rounded-full self-start mb-1"
                        style={{ backgroundColor: `${ROLES[selectedApplicant.role]?.color || '#8B22C0'}18` }}
                      >
                        <Text
                          className="text-[9px] font-black uppercase tracking-wider"
                          style={{ color: ROLES[selectedApplicant.role]?.color || '#8B22C0' }}
                        >
                          Pelamar {ROLES[selectedApplicant.role]?.label}
                        </Text>
                      </View>
                      <Text className="text-base font-black text-[#162E5C]">{selectedApplicant.name}</Text>
                    </View>
                  </View>
                  <TouchableOpacity
                    onPress={() => setSelectedApplicant(null)}
                    className="w-8 h-8 rounded-full bg-gray-100 items-center justify-center"
                  >
                    <Feather name="x" size={16} color="#6B7280" />
                  </TouchableOpacity>
                </View>

                {/* Info Kontak */}
                <View className="bg-gray-50 rounded-2xl p-4 mb-4 flex-col gap-2">
                  <View className="flex-row items-center justify-between">
                    <Text className="text-xs text-gray-500 font-medium">Email Pelamar</Text>
                    <Text className="text-xs font-bold text-gray-800">{selectedApplicant.email}</Text>
                  </View>
                  <View className="flex-row items-center justify-between">
                    <Text className="text-xs text-gray-500 font-medium">WhatsApp</Text>
                    <Text className="text-xs font-bold text-gray-800">{selectedApplicant.phone}</Text>
                  </View>
                  <View className="flex-row items-center justify-between">
                    <Text className="text-xs text-gray-500 font-medium">Status Akun</Text>
                    <Text className="text-xs font-bold text-amber-600">Menunggu Review</Text>
                  </View>
                </View>

                {/* Kualifikasi Khusus Guru */}
                {selectedApplicant.role === 'teacher' && (
                  <View className="mb-5 flex-col gap-3">
                    <Text className="text-xs font-black uppercase tracking-wider text-gray-400">
                      Data Kualifikasi Guru
                    </Text>

                    <View className="bg-purple-50/50 border border-purple-100 rounded-2xl p-4 flex-col gap-2.5">
                      <View>
                        <Text className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">
                          Bidang Spesialisasi Ajar
                        </Text>
                        <Text className="text-xs font-black text-purple-900 mt-0.5">
                          {selectedApplicant.details?.specialization || 'Sensory Play & Calistung'}
                        </Text>
                      </View>

                      <View className="grid grid-cols-2 gap-3 pt-2 border-t border-purple-100/60">
                        <View>
                          <Text className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">
                            Pendidikan Terakhir
                          </Text>
                          <Text className="text-xs font-bold text-gray-800 mt-0.5">
                            {selectedApplicant.details?.education || 'S1 PGPAUD'}
                          </Text>
                        </View>
                        <View>
                          <Text className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">
                            Pengalaman Mengajar
                          </Text>
                          <Text className="text-xs font-bold text-gray-800 mt-0.5">
                            {selectedApplicant.details?.experienceYears || 1} Tahun
                          </Text>
                        </View>
                      </View>

                      {selectedApplicant.details?.notes ? (
                        <View className="pt-2 border-t border-purple-100/60">
                          <Text className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">
                            Catatan Portofolio
                          </Text>
                          <Text className="text-xs text-gray-700 font-medium mt-0.5">
                            {selectedApplicant.details.notes}
                          </Text>
                        </View>
                      ) : null}
                    </View>
                  </View>
                )}

                {/* Kualifikasi Khusus Volunteer */}
                {selectedApplicant.role === 'volunteer' && (
                  <View className="mb-5 flex-col gap-3">
                    <Text className="text-xs font-black uppercase tracking-wider text-gray-400">
                      Data Profil Volunteer
                    </Text>

                    <View className="bg-amber-50/60 border border-amber-200/70 rounded-2xl p-4 flex-col gap-2.5">
                      <View className="grid grid-cols-2 gap-3">
                        <View>
                          <Text className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">
                            Domisili / Kota
                          </Text>
                          <Text className="text-xs font-black text-amber-900 mt-0.5">
                            {selectedApplicant.details?.city || '-'}
                          </Text>
                        </View>
                        <View>
                          <Text className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">
                            Status / Pekerjaan
                          </Text>
                          <Text className="text-xs font-bold text-gray-800 mt-0.5">
                            {selectedApplicant.details?.occupation || '-'}
                          </Text>
                        </View>
                      </View>

                      <View className="pt-2 border-t border-amber-200/50">
                        <Text className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">
                          Ketersediaan Waktu
                        </Text>
                        <Text className="text-xs font-bold text-gray-800 mt-0.5">
                          {selectedApplicant.details?.availability || '-'}
                        </Text>
                      </View>

                      {selectedApplicant.details?.motivation ? (
                        <View className="pt-2 border-t border-amber-200/50">
                          <Text className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">
                            Motivasi Bergabung
                          </Text>
                          <Text className="text-xs text-gray-700 font-medium mt-0.5">
                            {selectedApplicant.details.motivation}
                          </Text>
                        </View>
                      ) : null}
                    </View>
                  </View>
                )}

                {/* Kualifikasi Khusus Collaboration */}
                {selectedApplicant.role === 'collaboration' && (
                  <View className="mb-5 flex-col gap-3">
                    <Text className="text-xs font-black uppercase tracking-wider text-gray-400">
                      Data Profil Kolaborasi
                    </Text>

                    <View className="bg-sky-50/70 border border-sky-200/70 rounded-2xl p-4 flex-col gap-2.5">
                      <View>
                        <Text className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">
                          Nama Instansi / Lembaga / Komunitas
                        </Text>
                        <Text className="text-xs font-black text-sky-950 mt-0.5">
                          {selectedApplicant.details?.institutionName || '-'}
                        </Text>
                      </View>

                      <View className="pt-2 border-t border-sky-200/50">
                        <Text className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">
                          Bentuk Kolaborasi
                        </Text>
                        <Text className="text-xs font-bold text-gray-800 mt-0.5">
                          {selectedApplicant.details?.projectType || '-'}
                        </Text>
                      </View>

                      {selectedApplicant.details?.proposalNote ? (
                        <View className="pt-2 border-t border-sky-200/50">
                          <Text className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">
                            Ringkasan Ide / Proposal
                          </Text>
                          <Text className="text-xs text-gray-700 font-medium mt-0.5">
                            {selectedApplicant.details.proposalNote}
                          </Text>
                        </View>
                      ) : null}
                    </View>
                  </View>
                )}

                {/* Kualifikasi Khusus Mitra (Partner) */}
                {selectedApplicant.role === 'partner' && (
                  <View className="mb-5 flex-col gap-3">
                    <Text className="text-xs font-black uppercase tracking-wider text-gray-400">
                      Data Profil Mitra
                    </Text>

                    <View className="bg-emerald-50/70 border border-emerald-200/70 rounded-2xl p-4 flex-col gap-2.5">
                      <View>
                        <Text className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">
                          Nama Brand / Klinik / Sekolah
                        </Text>
                        <Text className="text-xs font-black text-emerald-950 mt-0.5">
                          {selectedApplicant.details?.brandName || '-'}
                        </Text>
                      </View>

                      <View className="pt-2 border-t border-emerald-200/50">
                        <Text className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">
                          Jenis Kemitraan
                        </Text>
                        <Text className="text-xs font-bold text-gray-800 mt-0.5">
                          {selectedApplicant.details?.businessType || '-'}
                        </Text>
                      </View>

                      {selectedApplicant.details?.websiteSocial ? (
                        <View className="pt-2 border-t border-emerald-200/50">
                          <Text className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">
                            Website / Instagram Bisnis
                          </Text>
                          <Text className="text-xs text-gray-700 font-medium mt-0.5">
                            {selectedApplicant.details.websiteSocial}
                          </Text>
                        </View>
                      ) : null}
                    </View>
                  </View>
                )}

                {/* Action Buttons */}
                <View className="flex-row gap-2.5 pt-2">
                  <TouchableOpacity
                    onPress={() => handleUpdateStatus(selectedApplicant, 'active')}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 py-3 rounded-2xl items-center justify-center flex-row gap-2 shadow-xs active:scale-98 transition"
                  >
                    <Feather name="check" size={16} color="#FFFFFF" />
                    <Text className="text-white text-xs font-black">Setujui & Kirim Notif</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => handleUpdateStatus(selectedApplicant, 'rejected')}
                    className="bg-rose-50 hover:bg-rose-100 px-4 py-3 rounded-2xl items-center justify-center active:scale-98 transition"
                  >
                    <Text className="text-rose-600 text-xs font-bold">Tolak</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>

      {/* 2. MODAL NOTIFIKASI SUKSES SETUJUI + KIRIM KABAR WHATSAPP & EMAIL */}
      <Modal
        visible={!!approvedApplicant}
        transparent
        animationType="fade"
        onRequestClose={() => setApprovedApplicant(null)}
      >
        <View className="flex-1 bg-black/60 items-center justify-center p-4">
          <View className="bg-white w-full max-w-md rounded-[2.5rem] overflow-hidden shadow-2xl p-6 text-center items-center">
            {approvedApplicant && (
              <>
                <View className="w-16 h-16 rounded-full bg-emerald-50 border-2 border-emerald-500 items-center justify-center mb-3">
                  <Feather name="check-circle" size={32} color="#059669" />
                </View>

                <Text className="text-xl font-black text-[#162E5C] text-center mb-1">
                  Akun Berhasil Disetujui! 🎉
                </Text>

                <Text className="text-xs text-gray-600 font-medium text-center leading-relaxed mb-5 max-w-sm">
                  Akun <Text className="font-bold text-[#162E5C]">{approvedApplicant.name}</Text> sekarang sudah{' '}
                  <Text className="font-bold text-emerald-600">Aktif</Text> sebagai{' '}
                  <Text className="font-bold">{ROLES[approvedApplicant.role]?.label}</Text>.
                  Kirim kabar gembira ini ke pelamar:
                </Text>

                {/* Option 1: WhatsApp */}
                <TouchableOpacity
                  onPress={() => handleSendWhatsApp(approvedApplicant)}
                  className="w-full bg-[#25D366] hover:bg-[#1ebd59] py-3.5 rounded-2xl items-center justify-center shadow-xs flex-row gap-2 active:scale-98 transition mb-2.5"
                >
                  <Feather name="message-circle" size={16} color="#FFFFFF" />
                  <Text className="text-white text-xs font-black">📲 Kirim Kabar via WhatsApp</Text>
                </TouchableOpacity>

                {/* Option 2: Email */}
                <TouchableOpacity
                  onPress={() => handleSendEmail(approvedApplicant)}
                  className="w-full bg-white border border-gray-200 hover:bg-gray-50 py-3 rounded-2xl items-center justify-center flex-row gap-2 active:scale-98 transition mb-3"
                >
                  <Feather name="mail" size={15} color="#4B5563" />
                  <Text className="text-gray-700 text-xs font-bold">✉️ Kirim Email Notifikasi</Text>
                </TouchableOpacity>

                {/* Tutup */}
                <TouchableOpacity
                  onPress={() => setApprovedApplicant(null)}
                  className="py-2 items-center"
                >
                  <Text className="text-xs text-gray-400 font-bold">Selesai & Tutup</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}
