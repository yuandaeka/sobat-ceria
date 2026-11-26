import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  ActivityIndicator,
  Platform,
  Alert,
  Image,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { UserProfile } from '../../types';
import {
  AdminCourseData,
  fetchAllCoursesAdmin,
  createCourse,
  updateCourse,
  deleteCourse,
  uploadCourseImage,
} from '../../lib/data';

export default function AdminKelasScreen({ user }: { user: UserProfile }) {
  const [courses, setCourses] = useState<AdminCourseData[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<AdminCourseData | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  // Form fields
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [ageRange, setAgeRange] = useState('');
  const [price, setPrice] = useState('');
  const [seats, setSeats] = useState('10');
  const [facilitator, setFacilitator] = useState('');
  const [image, setImage] = useState('');
  const [description, setDescription] = useState('');
  const [isActive, setIsActive] = useState(true);

  const loadCourses = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const data = await fetchAllCoursesAdmin();
      setCourses(data);
    } catch (err: any) {
      setErrorMsg(err?.message || 'Gagal memuat daftar kelas dari Supabase.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCourses();
  }, []);

  const openAddModal = () => {
    setEditingCourse(null);
    setTitle('');
    setCategory('');
    setAgeRange('2-5 Thn');
    setPrice('65000');
    setSeats('10');
    setFacilitator('Tim Fasilitator Sobat Ceria');
    setImage('');
    setDescription('');
    setIsActive(true);
    setFormError(null);
    setModalOpen(true);
  };

  const openEditModal = (course: AdminCourseData) => {
    setEditingCourse(course);
    setTitle(course.title);
    setCategory(course.category);
    setAgeRange(course.ageRange);
    setPrice(String(course.price));
    setSeats(String(course.seats));
    setFacilitator(course.facilitator || '');
    setImage(course.image || '');
    setDescription(course.description || '');
    setIsActive(course.isActive);
    setFormError(null);
    setModalOpen(true);
  };

  const handleSave = async () => {
    setFormError(null);
    if (!title.trim() || !category.trim() || !ageRange.trim()) {
      setFormError('Nama Kelas, Kategori, dan Rentang Usia wajib diisi.');
      return;
    }

    const numericPrice = parseInt(price.replace(/[^0-9]/g, ''), 10);
    if (isNaN(numericPrice)) {
      setFormError('Harga harus berupa angka yang valid.');
      return;
    }
    const numericSeats = parseInt(seats.replace(/[^0-9]/g, ''), 10) || 10;

    setSaving(true);
    try {
      if (editingCourse) {
        await updateCourse(editingCourse.id, {
          title,
          category,
          ageRange,
          price: numericPrice,
          seats: numericSeats,
          facilitator,
          image,
          description,
          isActive,
        });
      } else {
        await createCourse({
          title,
          category,
          ageRange,
          price: numericPrice,
          seats: numericSeats,
          facilitator,
          image,
          description,
          isActive,
        });
      }
      setModalOpen(false);
      await loadCourses();
    } catch (err: any) {
      setFormError(
        err?.message || 'Gagal menyimpan kelas. Pastikan migrasi RLS 0005_courses_admin_crud.sql sudah dijalankan.'
      );
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (course: AdminCourseData) => {
    setTogglingId(course.id);
    try {
      const nextActive = !course.isActive;
      await updateCourse(course.id, { isActive: nextActive });
      setCourses((prev) =>
        prev.map((c) => (c.id === course.id ? { ...c, isActive: nextActive } : c))
      );
    } catch (err: any) {
      setErrorMsg(err?.message || 'Gagal mengubah status kelas.');
    } finally {
      setTogglingId(null);
    }
  };

  const handlePickImageFromFolder = () => {
    if (Platform.OS !== 'web' || typeof document === 'undefined') {
      Alert.alert('Info', 'Pilih foto dari folder saat ini tersedia di versi Web Admin.');
      return;
    }

    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e: any) => {
      const file: File | undefined = e?.target?.files?.[0];
      if (!file) return;

      if (file.size > 5 * 1024 * 1024) {
        setFormError('Ukuran foto maksimal 5 MB.');
        return;
      }

      setFormError(null);
      setUploadingImage(true);
      try {
        const publicUrl = await uploadCourseImage(file, file.name);
        setImage(publicUrl);
      } catch (err: any) {
        setFormError(
          err?.message ||
            'Gagal mengunggah foto. Pastikan bucket Storage "course-images" sudah dibuat (jalankan 0006_storage_course_images.sql).'
        );
      } finally {
        setUploadingImage(false);
      }
    };
    input.click();
  };

  const confirmDelete = (course: AdminCourseData) => {
    const executeDelete = async () => {
      setSaving(true);
      try {
        await deleteCourse(course.id);
        setModalOpen(false);
        await loadCourses();
      } catch (err: any) {
        setFormError(err?.message || 'Gagal menghapus kelas.');
      } finally {
        setSaving(false);
      }
    };

    if (Platform.OS === 'web') {
      if (window.confirm(`Hapus kelas "${course.title}" secara permanen?`)) {
        executeDelete();
      }
    } else {
      Alert.alert('Hapus Kelas', `Hapus kelas "${course.title}" secara permanen?`, [
        { text: 'Batal', style: 'cancel' },
        { text: 'Hapus', style: 'destructive', onPress: executeDelete },
      ]);
    }
  };

  const activeCount = courses.filter((c) => c.isActive).length;

  return (
    <ScrollView
      className="flex-1 bg-[#FAF7F2]"
      contentContainerStyle={{ padding: 24, paddingBottom: 48 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View className="flex-row items-center justify-between mb-6 flex-wrap gap-3">
        <View>
          <Text className="text-xl font-extrabold text-[#132A5E]">Kelola Kelas</Text>
          <Text className="text-xs text-gray-500 font-medium mt-0.5">
            Tambah, ubah, aktifkan/nonaktifkan program kelas ({activeCount} tampil di web beranda)
          </Text>
        </View>
        <View className="flex-row items-center gap-2">
          <TouchableOpacity
            onPress={loadCourses}
            className="bg-white border border-gray-200 px-3.5 py-2.5 rounded-xl flex-row items-center gap-1.5 shadow-xs hover:bg-gray-50 transition"
          >
            <Feather name="refresh-cw" size={13} color="#4B5563" />
            <Text className="text-xs font-bold text-gray-700">Segarkan</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={openAddModal}
            className="bg-[#C81E45] px-4 py-2.5 rounded-xl flex-row items-center gap-2 shadow-sm hover:bg-[#9F1239] transition active:scale-95"
          >
            <Feather name="plus" size={14} color="#FFFFFF" />
            <Text className="text-white text-xs font-bold">Tambah Kelas</Text>
          </TouchableOpacity>
        </View>
      </View>

      {errorMsg && (
        <View className="bg-rose-50 border border-rose-200 rounded-2xl p-3.5 mb-4 flex-row items-center gap-2.5">
          <Feather name="alert-circle" size={16} color="#DC2626" />
          <Text className="text-xs text-rose-700 font-semibold flex-1">{errorMsg}</Text>
        </View>
      )}

      {/* List Container */}
      <View className="bg-white rounded-2xl border border-[#F1F5F9] shadow-sm overflow-hidden">
        {loading ? (
          <View className="py-12 items-center justify-center">
            <ActivityIndicator size="small" color="#C81E45" />
            <Text className="text-xs text-gray-500 font-medium mt-2">Memuat daftar kelas...</Text>
          </View>
        ) : courses.length === 0 ? (
          <View className="py-12 items-center justify-center px-6">
            <Feather name="book-open" size={32} color="#CBD5E1" />
            <Text className="text-sm font-bold text-gray-700 mt-3">Belum ada kelas</Text>
            <Text className="text-xs text-gray-500 text-center mt-1">
              Klik tombol "+ Tambah Kelas" di kanan atas untuk menambahkan program baru.
            </Text>
          </View>
        ) : (
          courses.map((k, i) => (
            <View
              key={k.id}
              className={`flex-row items-center gap-3.5 px-5 py-4 ${
                i < courses.length - 1 ? 'border-b border-[#F1F5F9]' : ''
              }`}
            >
              <View className="w-11 h-11 rounded-xl bg-gray-50 items-center justify-center shrink-0">
                <Feather name="book-open" size={19} color="#162E5C" />
              </View>

              <View className="flex-1 min-w-0">
                <View className="flex-row items-center gap-2 flex-wrap">
                  <Text className="text-sm font-extrabold text-[#1E293B]" numberOfLines={1}>
                    {k.title}
                  </Text>
                  <View className="bg-[#162E5C]/10 px-2 py-0.5 rounded-md">
                    <Text className="text-[10px] font-bold text-[#162E5C]">{k.category}</Text>
                  </View>
                </View>
                <Text className="text-[11px] text-gray-500 font-medium mt-0.5" numberOfLines={1}>
                  Rp {k.price.toLocaleString('id-ID')} • {k.ageRange} • Kuota {k.seats} kursi
                </Text>
              </View>

              {/* Toggle Status Aktif/Nonaktif */}
              <TouchableOpacity
                onPress={() => handleToggleActive(k)}
                disabled={togglingId === k.id}
                className={`px-3 py-1 rounded-full ${k.isActive ? 'bg-emerald-50 border border-emerald-200' : 'bg-gray-100 border border-gray-200'}`}
              >
                {togglingId === k.id ? (
                  <ActivityIndicator size="small" color="#059669" />
                ) : (
                  <Text className={`text-[10px] font-bold ${k.isActive ? 'text-emerald-700' : 'text-gray-500'}`}>
                    {k.isActive ? 'Aktif' : 'Nonaktif'}
                  </Text>
                )}
              </TouchableOpacity>

              {/* Edit Button */}
              <TouchableOpacity
                onPress={() => openEditModal(k)}
                className="w-9 h-9 rounded-full bg-[#C81E45]/10 items-center justify-center hover:bg-[#C81E45]/20 transition"
              >
                <Feather name="edit-3" size={15} color="#C81E45" />
              </TouchableOpacity>

              {/* Delete Button */}
              <TouchableOpacity
                onPress={() => confirmDelete(k)}
                className="w-9 h-9 rounded-full bg-gray-100 items-center justify-center hover:bg-rose-50 transition"
              >
                <Feather name="trash-2" size={15} color="#EF4444" />
              </TouchableOpacity>
            </View>
          ))
        )}
      </View>

      {/* MODAL TAMBAH / EDIT KELAS */}
      <Modal
        visible={modalOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setModalOpen(false)}
      >
        <View className="flex-1 bg-black/60 items-center justify-center p-4">
          <View className="bg-white w-full max-w-lg rounded-[2rem] overflow-hidden shadow-2xl max-h-[90vh]">
            {/* Modal Header */}
            <View className="px-6 py-4 border-b border-gray-100 flex-row items-center justify-between bg-[#FAF6F0]/60">
              <Text className="text-base font-black text-[#132A5E]">
                {editingCourse ? 'Ubah Program Kelas' : 'Tambah Program Kelas Baru'}
              </Text>
              <TouchableOpacity
                onPress={() => setModalOpen(false)}
                className="w-8 h-8 rounded-full bg-gray-100 items-center justify-center"
              >
                <Feather name="x" size={16} color="#4B5563" />
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={{ padding: 24 }} showsVerticalScrollIndicator={false}>
              {formError && (
                <View className="bg-rose-50 border border-rose-200 rounded-xl p-3 mb-4 flex-row items-center gap-2">
                  <Feather name="alert-circle" size={15} color="#DC2626" />
                  <Text className="text-xs text-rose-700 font-semibold flex-1">{formError}</Text>
                </View>
              )}

              <View className="flex-col gap-3.5">
                <View>
                  <Text className="text-xs font-bold text-gray-700 mb-1">Nama Program Kelas *</Text>
                  <TextInput
                    value={title}
                    onChangeText={setTitle}
                    placeholder="Contoh: Montessori Playgroup Class"
                    placeholderTextColor="#9CA3AF"
                    className="bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-800 font-medium"
                  />
                </View>

                <View className="flex-row gap-3">
                  <View className="flex-1">
                    <Text className="text-xs font-bold text-gray-700 mb-1">Kategori / Label Badge *</Text>
                    <TextInput
                      value={category}
                      onChangeText={setCategory}
                      placeholder="Contoh: Sensory Play"
                      placeholderTextColor="#9CA3AF"
                      className="bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-800 font-medium"
                    />
                  </View>
                  <View className="flex-1">
                    <Text className="text-xs font-bold text-gray-700 mb-1">Rentang Usia *</Text>
                    <TextInput
                      value={ageRange}
                      onChangeText={setAgeRange}
                      placeholder="Contoh: Usia 2-4 Thn"
                      placeholderTextColor="#9CA3AF"
                      className="bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-800 font-medium"
                    />
                  </View>
                </View>

                <View className="flex-row gap-3">
                  <View className="flex-1">
                    <Text className="text-xs font-bold text-gray-700 mb-1">Harga (Rp) *</Text>
                    <TextInput
                      value={price}
                      onChangeText={setPrice}
                      keyboardType="numeric"
                      placeholder="65000"
                      placeholderTextColor="#9CA3AF"
                      className="bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-800 font-medium"
                    />
                  </View>
                  <View className="flex-1">
                    <Text className="text-xs font-bold text-gray-700 mb-1">Kuota Kursi</Text>
                    <TextInput
                      value={seats}
                      onChangeText={setSeats}
                      keyboardType="numeric"
                      placeholder="10"
                      placeholderTextColor="#9CA3AF"
                      className="bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-800 font-medium"
                    />
                  </View>
                </View>

                <View>
                  <Text className="text-xs font-bold text-gray-700 mb-1">Fasilitator / Pengajar</Text>
                  <TextInput
                    value={facilitator}
                    onChangeText={setFacilitator}
                    placeholder="Contoh: Bunda Sarah, M.Psi"
                    placeholderTextColor="#9CA3AF"
                    className="bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-800 font-medium"
                  />
                </View>

                <View>
                  <Text className="text-xs font-bold text-gray-700 mb-1.5">Foto Kelas</Text>

                  {image ? (
                    <View className="w-full h-36 rounded-2xl overflow-hidden border border-gray-200 mb-2.5 relative bg-gray-100">
                      <Image
                        source={{ uri: image }}
                        style={{ width: '100%', height: '100%' }}
                        resizeMode="cover"
                      />
                      <TouchableOpacity
                        onPress={() => setImage('')}
                        className="absolute top-2 right-2 bg-black/65 px-2.5 py-1 rounded-full flex-row items-center gap-1"
                      >
                        <Feather name="x" size={12} color="#FFFFFF" />
                        <Text className="text-white text-[10px] font-bold">Hapus</Text>
                      </TouchableOpacity>
                    </View>
                  ) : null}

                  <TouchableOpacity
                    onPress={handlePickImageFromFolder}
                    disabled={uploadingImage}
                    className="bg-[#132A5E]/5 border border-dashed border-[#132A5E]/30 rounded-xl py-3 px-4 flex-row items-center justify-center gap-2 mb-2 hover:bg-[#132A5E]/10 transition"
                  >
                    {uploadingImage ? (
                      <>
                        <ActivityIndicator size="small" color="#132A5E" />
                        <Text className="text-xs font-bold text-[#132A5E]">Mengunggah ke Supabase...</Text>
                      </>
                    ) : (
                      <>
                        <Feather name="upload" size={14} color="#132A5E" />
                        <Text className="text-xs font-bold text-[#132A5E]">
                          {image ? 'Ganti Foto dari Folder' : 'Pilih Foto dari Folder'}
                        </Text>
                      </>
                    )}
                  </TouchableOpacity>

                  <TextInput
                    value={image}
                    onChangeText={setImage}
                    placeholder="Atau tempel URL foto: https://..."
                    placeholderTextColor="#9CA3AF"
                    autoCapitalize="none"
                    className="bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 text-[11px] text-gray-700 font-medium"
                  />
                </View>

                <View>
                  <Text className="text-xs font-bold text-gray-700 mb-1">Deskripsi Singkat</Text>
                  <TextInput
                    value={description}
                    onChangeText={setDescription}
                    multiline
                    numberOfLines={3}
                    placeholder="Jelaskan manfaat dan aktivitas utama kelas..."
                    placeholderTextColor="#9CA3AF"
                    className="bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-800 font-medium"
                  />
                </View>

                {/* Status Aktif Toggle */}
                <TouchableOpacity
                  onPress={() => setIsActive(!isActive)}
                  className="flex-row items-center justify-between bg-gray-50 border border-gray-200 rounded-xl px-4 py-3"
                >
                  <View>
                    <Text className="text-xs font-bold text-[#132A5E]">Tampilkan di Web Beranda</Text>
                    <Text className="text-[10px] text-gray-500">
                      Jika nonaktif, kelas disembunyikan dari halaman utama
                    </Text>
                  </View>
                  <View className={`px-3 py-1 rounded-full ${isActive ? 'bg-emerald-600' : 'bg-gray-300'}`}>
                    <Text className="text-white text-[10px] font-black">{isActive ? 'AKTIF' : 'NONAKTIF'}</Text>
                  </View>
                </TouchableOpacity>
              </View>

              {/* Modal Actions */}
              <View className="flex-row gap-2.5 mt-6">
                {editingCourse && (
                  <TouchableOpacity
                    onPress={() => confirmDelete(editingCourse)}
                    disabled={saving}
                    className="bg-rose-50 border border-rose-200 px-4 py-3 rounded-xl items-center justify-center"
                  >
                    <Feather name="trash-2" size={16} color="#DC2626" />
                  </TouchableOpacity>
                )}

                <TouchableOpacity
                  onPress={handleSave}
                  disabled={saving}
                  className="flex-1 bg-[#C81E45] hover:bg-[#9F1239] py-3 rounded-xl items-center justify-center flex-row gap-2 shadow-sm"
                >
                  {saving ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <>
                      <Feather name="save" size={15} color="#FFFFFF" />
                      <Text className="text-white text-xs font-black">
                        {editingCourse ? 'Simpan Perubahan' : 'Simpan Kelas Baru'}
                      </Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}
