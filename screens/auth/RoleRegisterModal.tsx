import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  Alert,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { registerRoleUser } from '../../lib/profile';

type RegisterableRole = 'volunteer' | 'teacher' | 'collaboration' | 'partner';

interface RoleRegisterModalProps {
  role: RegisterableRole | null;
  onClose: () => void;
  onSuccess?: () => void;
}

interface RoleConfig {
  label: string;
  badge: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  bgColor: string;
}

const ROLE_CONFIGS: Record<RegisterableRole, RoleConfig> = {
  volunteer: {
    label: 'Relawan Anak',
    badge: 'RELAWAN ANAK',
    title: 'Daftar Volunteer Sobat Ceria',
    description: 'Bagi mahasiswa, pegiat anak, atau siapa saja yang berjiwa sosial untuk mendampingi kegiatan bermain edukatif.',
    icon: 'heart',
    color: '#B45309',
    bgColor: '#FFD10025',
  },
  teacher: {
    label: 'Tenaga Pendidik',
    badge: 'TENAGA PENDIDIK',
    title: 'Daftar Guru / Tutor Sobat Ceria',
    description: 'Bagi sarjana/praktisi PAUD, Psikologi, dan Pendidikan Khusus. Modul stimulasi siap ajar & jadwal fleksibel.',
    icon: 'users',
    color: '#5A3B8B',
    bgColor: '#5A3B8B1A',
  },
  collaboration: {
    label: 'Project & Media',
    badge: 'PROJECT & MEDIA',
    title: 'Daftar Kolaborasi Program',
    description: 'Terbuka untuk brand edukasi anak, komunitas parenting, event organizer, media, maupun program CSR.',
    icon: 'share-2',
    color: '#2DA9E9',
    bgColor: '#2DA9E91A',
  },
  partner: {
    label: 'Klinis & Sekolah',
    badge: 'KLINIS & SEKOLAH',
    title: 'Daftar Mitra Sobat Ceria',
    description: 'Sinergi rujukan bersama psikolog anak, dokter spesialis, terapis wicara & sensori, serta kolaborasi kelas TK/PAUD.',
    icon: 'shield',
    color: '#30B864',
    bgColor: '#30B8641A',
  },
};

export default function RoleRegisterModal({ role, onClose, onSuccess }: RoleRegisterModalProps) {
  if (!role) return null;
  const config = ROLE_CONFIGS[role];

  // Common fields
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Role-specific fields
  // Volunteer
  const [city, setCity] = useState('');
  const [occupation, setOccupation] = useState('');
  const [availability, setAvailability] = useState('Sabtu & Minggu');
  const [motivation, setMotivation] = useState('');

  // Teacher
  const [education, setEducation] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [experienceYears, setExperienceYears] = useState('1');
  const [teacherNotes, setTeacherNotes] = useState('');

  // Collaboration
  const [institutionName, setInstitutionName] = useState('');
  const [projectType, setProjectType] = useState('');
  const [proposalNote, setProposalNote] = useState('');

  // Partner
  const [brandName, setBrandName] = useState('');
  const [businessType, setBusinessType] = useState('');
  const [websiteSocial, setWebsiteSocial] = useState('');

  // Status state
  const [submitting, setSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async () => {
    setErrorMessage(null);

    // Validasi umum
    if (!fullName.trim() || !phone.trim() || !email.trim() || !password.trim()) {
      setErrorMessage('Harap lengkapi semua data identitas utama (Nama, WhatsApp, Email, & Password).');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password minimal terdiri dari 6 karakter.');
      return;
    }

    // Role-specific payload data
    let roleData: Record<string, any> = {};

    if (role === 'volunteer') {
      if (!city.trim()) {
        setErrorMessage('Harap isi domisili/kota Anda.');
        return;
      }
      roleData = { city, occupation, availability, motivation };
    } else if (role === 'teacher') {
      if (!specialization.trim() || !education.trim()) {
        setErrorMessage('Harap isi pendidikan terakhir & bidang spesialisasi ajar.');
        return;
      }
      roleData = { education, specialization, experienceYears, notes: teacherNotes };
    } else if (role === 'collaboration') {
      if (!institutionName.trim() || !projectType.trim()) {
        setErrorMessage('Harap isi nama instansi/komunitas dan bentuk kolaborasi.');
        return;
      }
      roleData = { institutionName, projectType, proposalNote };
    } else if (role === 'partner') {
      if (!brandName.trim() || !businessType.trim()) {
        setErrorMessage('Harap isi nama brand/klinik/sekolah dan jenis kemitraan.');
        return;
      }
      roleData = { brandName, businessType, websiteSocial };
    }

    setSubmitting(true);
    try {
      await registerRoleUser({
        fullName: fullName.trim(),
        phone: phone.trim(),
        email: email.trim(),
        password: password.trim(),
        role,
        roleData,
      });

      setIsSuccess(true);
      if (onSuccess) onSuccess();
    } catch (err: any) {
      const msg = err?.message || 'Terjadi kesalahan saat mendaftar. Silakan coba beberapa saat lagi.';
      setErrorMessage(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleResetAndClose = () => {
    setIsSuccess(false);
    setErrorMessage(null);
    onClose();
  };

  return (
    <Modal visible={!!role} animationType="fade" transparent onRequestClose={handleResetAndClose}>
      <View className="flex-1 bg-black/60 items-center justify-center p-3 md:p-6">
        <View className="bg-white w-full max-w-xl rounded-[2.5rem] overflow-hidden shadow-2xl max-h-[92vh] flex-col">
          {/* Modal Header */}
          <View className="px-6 pt-6 pb-4 border-b border-gray-100 flex-row items-center justify-between bg-[#FAF6F0]/60">
            <View className="flex-row items-center gap-3">
              <View
                className="w-12 h-12 rounded-2xl items-center justify-center shadow-xs"
                style={{ backgroundColor: config.bgColor }}
              >
                <Feather name={config.icon as any} size={22} color={config.color} />
              </View>
              <View>
                <View className="self-start px-2.5 py-0.5 rounded-full mb-1" style={{ backgroundColor: config.bgColor }}>
                  <Text className="text-[9px] font-black uppercase tracking-wider" style={{ color: config.color }}>
                    {config.badge}
                  </Text>
                </View>
                <Text className="text-lg font-black text-[#162E5C]">{config.title}</Text>
              </View>
            </View>
            <TouchableOpacity
              onPress={handleResetAndClose}
              className="w-9 h-9 rounded-full bg-gray-100 items-center justify-center hover:bg-gray-200 transition"
            >
              <Feather name="x" size={18} color="#4B5563" />
            </TouchableOpacity>
          </View>

          {/* Modal Body */}
          <ScrollView
            contentContainerStyle={{ padding: 24, paddingBottom: 32 }}
            showsVerticalScrollIndicator={false}
          >
            {isSuccess ? (
              /* Success Confirmation Card */
              <View className="items-center py-6 text-center">
                <View className="w-20 h-20 rounded-full bg-emerald-50 border-2 border-emerald-500 items-center justify-center mb-4 shadow-sm">
                  <Feather name="check-circle" size={40} color="#10B981" />
                </View>
                <Text className="text-2xl font-black text-[#162E5C] text-center mb-2">
                  Pendaftaran Berhasil Dikirim! 🎉
                </Text>
                <Text className="text-xs text-gray-600 font-medium text-center max-w-md leading-relaxed mb-6">
                  Terima kasih <Text className="font-bold text-[#162E5C]">{fullName}</Text>. Data pendaftaran Anda
                  sebagai <Text className="font-bold" style={{ color: config.color }}>{config.label}</Text> telah masuk
                  ke sistem kami dengan status <Text className="font-bold text-amber-600">Menunggu Review</Text>.
                </Text>

                <View className="w-full bg-[#FAF6F0] rounded-2xl p-4 border border-gray-200/60 mb-6">
                  <Text className="text-[11px] font-extrabold text-[#162E5C] mb-1.5 flex-row items-center gap-1.5">
                    <Feather name="info" size={13} color="#162E5C" /> Apa langkah selanjutnya?
                  </Text>
                  <Text className="text-[11px] text-gray-600 leading-relaxed font-medium">
                    1. Tim Admin Sobat Ceria akan meninjau kualifikasi dan portofolio Anda (estimasi 1x24 jam).{'\n'}
                    2. Tim kami akan menghubungi Anda via WhatsApp di <Text className="font-bold">{phone}</Text> untuk
                    konfirmasi jadwal & briefing.{'\n'}
                    3. Setelah disetujui, akun Anda dapat login ke dashboard role {config.label}.
                  </Text>
                </View>

                <TouchableOpacity
                  onPress={handleResetAndClose}
                  className="w-full bg-[#162E5C] py-3.5 rounded-full items-center justify-center shadow-md active:scale-98 transition"
                >
                  <Text className="text-white text-xs font-black">Selesai & Kembali ke Beranda</Text>
                </TouchableOpacity>
              </View>
            ) : (
              /* Registration Form */
              <View className="flex-col gap-4">
                <Text className="text-xs text-gray-500 font-medium leading-relaxed">
                  {config.description}
                </Text>

                {errorMessage ? (
                  <View className="bg-rose-50 border border-rose-200 rounded-2xl p-3 flex-row items-center gap-2.5">
                    <Feather name="alert-circle" size={16} color="#E11D48" />
                    <Text className="text-xs text-rose-700 font-semibold flex-1">{errorMessage}</Text>
                  </View>
                ) : null}

                {/* Bagian 1: Identitas Akun */}
                <View className="pt-2">
                  <Text className="text-[11px] font-black uppercase tracking-wider text-gray-400 mb-2">
                    1. Identitas Akun Utama
                  </Text>

                  <View className="flex-col gap-3">
                    <View>
                      <Text className="text-xs font-bold text-gray-700 mb-1">
                        Nama Lengkap {role === 'partner' || role === 'collaboration' ? '(Nama PIC)' : ''} *
                      </Text>
                      <TextInput
                        value={fullName}
                        onChangeText={setFullName}
                        placeholder="Contoh: Kak Zahra Nurul"
                        placeholderTextColor="#9CA3AF"
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-800 font-medium"
                      />
                    </View>

                    <View className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <View>
                        <Text className="text-xs font-bold text-gray-700 mb-1">Nomor WhatsApp Aktif *</Text>
                        <TextInput
                          value={phone}
                          onChangeText={setPhone}
                          keyboardType="phone-pad"
                          placeholder="08123456789"
                          placeholderTextColor="#9CA3AF"
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-800 font-medium"
                        />
                      </View>
                      <View>
                        <Text className="text-xs font-bold text-gray-700 mb-1">Alamat Email *</Text>
                        <TextInput
                          value={email}
                          onChangeText={setEmail}
                          keyboardType="email-address"
                          autoCapitalize="none"
                          placeholder="email@anda.com"
                          placeholderTextColor="#9CA3AF"
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-800 font-medium"
                        />
                      </View>
                    </View>

                    <View>
                      <Text className="text-xs font-bold text-gray-700 mb-1">Kata Sandi (Password) *</Text>
                      <TextInput
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                        placeholder="Minimal 6 karakter"
                        placeholderTextColor="#9CA3AF"
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-800 font-medium"
                      />
                    </View>
                  </View>
                </View>

                {/* Bagian 2: Data Spesifik Role */}
                <View className="pt-3 border-t border-gray-100">
                  <Text className="text-[11px] font-black uppercase tracking-wider text-gray-400 mb-2">
                    2. Data Kualifikasi & Profil {config.label}
                  </Text>

                  {/* Form Spesifik Volunteer */}
                  {role === 'volunteer' && (
                    <View className="flex-col gap-3">
                      <View className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <View>
                          <Text className="text-xs font-bold text-gray-700 mb-1">Domisili / Kota Asal *</Text>
                          <TextInput
                            value={city}
                            onChangeText={setCity}
                            placeholder="Contoh: Jakarta Selatan"
                            placeholderTextColor="#9CA3AF"
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-800 font-medium"
                          />
                        </View>
                        <View>
                          <Text className="text-xs font-bold text-gray-700 mb-1">Status / Pekerjaan</Text>
                          <TextInput
                            value={occupation}
                            onChangeText={setOccupation}
                            placeholder="Contoh: Mahasiswa Psikologi S1"
                            placeholderTextColor="#9CA3AF"
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-800 font-medium"
                          />
                        </View>
                      </View>

                      <View>
                        <Text className="text-xs font-bold text-gray-700 mb-1">Ketersediaan Waktu Pendampingan</Text>
                        <TextInput
                          value={availability}
                          onChangeText={setAvailability}
                          placeholder="Contoh: Sabtu & Minggu, Hari Libur"
                          placeholderTextColor="#9CA3AF"
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-800 font-medium"
                        />
                      </View>

                      <View>
                        <Text className="text-xs font-bold text-gray-700 mb-1">Motivasi Bergabung (Singkat)</Text>
                        <TextInput
                          value={motivation}
                          onChangeText={setMotivation}
                          multiline
                          numberOfLines={2}
                          placeholder="Ceritakan ketertarikan Anda mendampingi anak-anak..."
                          placeholderTextColor="#9CA3AF"
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-800 font-medium"
                        />
                      </View>
                    </View>
                  )}

                  {/* Form Spesifik Tutor / Guru */}
                  {role === 'teacher' && (
                    <View className="flex-col gap-3">
                      <View className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <View>
                          <Text className="text-xs font-bold text-gray-700 mb-1">Pendidikan Terakhir / Jurusan *</Text>
                          <TextInput
                            value={education}
                            onChangeText={setEducation}
                            placeholder="Contoh: S1 PGPAUD / S1 Psikologi"
                            placeholderTextColor="#9CA3AF"
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-800 font-medium"
                          />
                        </View>
                        <View>
                          <Text className="text-xs font-bold text-gray-700 mb-1">Pengalaman Mengajar (Tahun)</Text>
                          <TextInput
                            value={experienceYears}
                            onChangeText={setExperienceYears}
                            keyboardType="numeric"
                            placeholder="Contoh: 2"
                            placeholderTextColor="#9CA3AF"
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-800 font-medium"
                          />
                        </View>
                      </View>

                      <View>
                        <Text className="text-xs font-bold text-gray-700 mb-1">Bidang Spesialisasi Ajar *</Text>
                        <TextInput
                          value={specialization}
                          onChangeText={setSpecialization}
                          placeholder="Contoh: Sensory Play, Calistung Ceria, STEM Usia Dini"
                          placeholderTextColor="#9CA3AF"
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-800 font-medium"
                        />
                      </View>

                      <View>
                        <Text className="text-xs font-bold text-gray-700 mb-1">Catatan Portofolio / Sertifikasi</Text>
                        <TextInput
                          value={teacherNotes}
                          onChangeText={setTeacherNotes}
                          multiline
                          numberOfLines={2}
                          placeholder="Pengalaman mengajar di TK / sertifikasi Montessori..."
                          placeholderTextColor="#9CA3AF"
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-800 font-medium"
                        />
                      </View>
                    </View>
                  )}

                  {/* Form Spesifik Collaboration */}
                  {role === 'collaboration' && (
                    <View className="flex-col gap-3">
                      <View>
                        <Text className="text-xs font-bold text-gray-700 mb-1">Nama Instansi / Lembaga / Komunitas *</Text>
                        <TextInput
                          value={institutionName}
                          onChangeText={setInstitutionName}
                          placeholder="Contoh: Komunitas Ibu Cerdas / Universitas X"
                          placeholderTextColor="#9CA3AF"
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-800 font-medium"
                        />
                      </View>

                      <View>
                        <Text className="text-xs font-bold text-gray-700 mb-1">Bentuk Kolaborasi yang Ditawarkan *</Text>
                        <TextInput
                          value={projectType}
                          onChangeText={setProjectType}
                          placeholder="Contoh: Program CSR, Seminar Parenting, Media Partner"
                          placeholderTextColor="#9CA3AF"
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-800 font-medium"
                        />
                      </View>

                      <View>
                        <Text className="text-xs font-bold text-gray-700 mb-1">Ringkasan Ide / Proposal Kegiatan</Text>
                        <TextInput
                          value={proposalNote}
                          onChangeText={setProposalNote}
                          multiline
                          numberOfLines={2}
                          placeholder="Tuliskan gambaran singkat rencana kolaborasi..."
                          placeholderTextColor="#9CA3AF"
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-800 font-medium"
                        />
                      </View>
                    </View>
                  )}

                  {/* Form Spesifik Partner */}
                  {role === 'partner' && (
                    <View className="flex-col gap-3">
                      <View>
                        <Text className="text-xs font-bold text-gray-700 mb-1">Nama Brand / Usaha / Klinik / Sekolah *</Text>
                        <TextInput
                          value={brandName}
                          onChangeText={setBrandName}
                          placeholder="Contoh: Klinik Tumbuh Kembang Sehat / TK Mutiara"
                          placeholderTextColor="#9CA3AF"
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-800 font-medium"
                        />
                      </View>

                      <View>
                        <Text className="text-xs font-bold text-gray-700 mb-1">Jenis Kemitraan *</Text>
                        <TextInput
                          value={businessType}
                          onChangeText={setBusinessType}
                          placeholder="Contoh: Franchise Toolkit, Lokasi/Venue Kelas, Sinergi Medis"
                          placeholderTextColor="#9CA3AF"
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-800 font-medium"
                        />
                      </View>

                      <View>
                        <Text className="text-xs font-bold text-gray-700 mb-1">Website / Instagram Bisnis</Text>
                        <TextInput
                          value={websiteSocial}
                          onChangeText={setWebsiteSocial}
                          placeholder="Contoh: @klinik.sehat atau www.klinik.com"
                          placeholderTextColor="#9CA3AF"
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-800 font-medium"
                        />
                      </View>
                    </View>
                  )}
                </View>

                {/* Submit Action */}
                <View className="pt-4">
                  <TouchableOpacity
                    onPress={handleSubmit}
                    disabled={submitting}
                    className="w-full py-3.5 rounded-full items-center justify-center shadow-md flex-row items-center gap-2 active:scale-98 transition"
                    style={{ backgroundColor: config.color }}
                  >
                    {submitting ? (
                      <ActivityIndicator size="small" color="#FFFFFF" />
                    ) : (
                      <>
                        <Text className="text-white text-xs font-black">Kirim Formulir Pendaftaran</Text>
                        <Feather name="arrow-right" size={14} color="#FFFFFF" />
                      </>
                    )}
                  </TouchableOpacity>
                  <Text className="text-[10px] text-gray-400 font-medium text-center mt-2.5">
                    Dengan mendaftar, data Anda akan diverifikasi secara aman oleh tim Sobat Ceria.
                  </Text>
                </View>
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
