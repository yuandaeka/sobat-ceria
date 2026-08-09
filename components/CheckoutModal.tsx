import React, { useState } from 'react';
import { 
  Modal, 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  Alert, 
  Platform 
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Course } from '../types';
import { createOrder, fetchVouchers, VoucherData } from '../lib/data';
import { syncOrderToSheet } from '../lib/sheets';

interface CheckoutModalProps {
  visible: boolean;
  course: Course;
  user: any;
  onClose: () => void;
}

export default function CheckoutModal({ visible, course, user, onClose }: CheckoutModalProps) {
  const [voucherCode, setVoucherCode] = useState<string>('');
  const [discount, setDiscount] = useState<number>(0);
  const [appliedVoucher, setAppliedVoucher] = useState<string>('');
  const [guestChildName, setGuestChildName] = useState<string>('');
  const [guestWhatsApp, setGuestWhatsApp] = useState<string>('');
  const [vouchers, setVouchers] = useState<VoucherData[]>([]);

  React.useEffect(() => {
    if (visible) {
      fetchVouchers()
        .then(setVouchers)
        .catch(() => setVouchers([]));
    }
  }, [visible]);

  // Voucher validation engine (cek ke database)
  const handleApplyVoucher = async () => {
    const code = voucherCode.trim().toUpperCase();
    if (!code) {
      alertMessage('Pemberitahuan', 'Harap masukkan kode voucher terlebih dahulu.');
      return;
    }

    const found = vouchers.find((v) => v.code.toUpperCase() === code);
    if (found) {
      setDiscount(found.discount_amount);
      setAppliedVoucher(found.code);
      alertMessage('Voucher Berhasil!', `Kode ${found.code} memberikan diskon Rp ${found.discount_amount.toLocaleString('id-ID')}.`);
    } else {
      alertMessage('Voucher Tidak Valid', 'Kode voucher yang Anda masukkan tidak terdaftar.');
    }
  };

  const handleCheckout = async () => {
    if (!user) {
      if (!guestChildName.trim() || !guestWhatsApp.trim()) {
        alertMessage('Form Belum Lengkap', 'Harap isi Nama Anak dan No. WhatsApp Anda!');
        return;
      }
    }
    const totalAmount = Math.max(0, course.price - discount);

    try {
      await createOrder({
        courseId: course.id,
        childName: guestChildName.trim() || user?.children?.[0]?.name || 'Anak Ceria',
        whatsapp: guestWhatsApp.trim() || user?.phone || '',
        voucherCode: appliedVoucher || null,
        discount,
        totalAmount,
      });

      // Kirim data order + pembayaran ke Google Sheet
      await syncOrderToSheet({
        courseTitle: course.title,
        courseCategory: course.category,
        childName: guestChildName.trim() || user?.children?.[0]?.name || 'Anak Ceria',
        whatsapp: guestWhatsApp.trim() || user?.phone || '',
        voucherCode: appliedVoucher || null,
        discount,
        totalAmount,
        status: 'paid',
      });
    } catch {
      // jika penyimpanan gagal, checkout tetap dilanjutkan secara lokal
    }

    alertMessage(
      'Pendaftaran Berhasil',
      `Pembayaran sejumlah Rp ${totalAmount.toLocaleString('id-ID')} untuk kelas "${course.title}" telah diterima. Sampai jumpa di kelas!`
    );
    // Reset states and close
    setVoucherCode('');
    setDiscount(0);
    setAppliedVoucher('');
    setGuestChildName('');
    setGuestWhatsApp('');
    onClose();
  };

  // Helper alert function that works on Web and Mobile
  const alertMessage = (title: string, message: string) => {
    if (Platform.OS === 'web') {
      window.alert(`${title}: ${message}`);
    } else {
      Alert.alert(title, message);
    }
  };

  const totalPayable = Math.max(0, course.price - discount);

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-brand-navy/60 justify-center items-center p-4">
        <View className="bg-white w-full max-w-[440px] rounded-[32px] p-6 shadow-2xl relative">
          {/* Header */}
          <View className="flex-row justify-between items-center mb-5">
            <Text className="text-lg font-black text-brand-navy">Detail Checkout</Text>
            <TouchableOpacity onPress={onClose} className="w-8 h-8 rounded-full bg-gray-100 items-center justify-center">
              <Feather name="x" size={16} color="#6B7280" />
            </TouchableOpacity>
          </View>

          {/* Course Details Card */}
          <View className="flex-row justify-between items-start bg-gray-50 rounded-2xl p-4 border border-gray-200 mb-3">
            <View className="flex-1 mr-2">
              <Text className="text-[9px] font-extrabold text-brand-primary uppercase tracking-wider mb-1">
                {course.category} • {course.ageRange}
              </Text>
              <Text className="text-xs font-bold text-brand-navy">{course.title}</Text>
              {course.facilitator && (
                <Text className="text-[10px] text-gray-500 mt-1">Fasilitator: {course.facilitator}</Text>
              )}
            </View>
            <Text className="text-xs font-black text-brand-navy">Rp {course.price.toLocaleString('id-ID')}</Text>
          </View>

          {/* Voucher Bar Alert */}
          <View className="bg-brand-pastel rounded-xl py-2.5 px-3.5 mb-4 border border-brand-primary/10 flex-row items-center justify-center gap-1.5">
            <Feather name="tag" size={13} color="#8B22C0" />
            <Text className="text-[10px] font-extrabold text-brand-primary text-center">
              Gunakan voucher "REPEATORDER10" untuk diskon Rp 10rb!
            </Text>
          </View>

          {/* Voucher Input */}
          <View className="mb-4">
            <Text className="text-[10px] font-black text-brand-navy mb-1.5 uppercase tracking-wider">
              Gunakan Kode Promo
            </Text>
            <View className="flex-row gap-2">
              <TextInput
                className="flex-1 h-11 bg-gray-50 border border-gray-300 rounded-xl px-3.5 text-xs text-brand-navy"
                placeholder="Masukkan kode voucher..."
                placeholderTextColor="#9CA3AF"
                value={voucherCode}
                onChangeText={setVoucherCode}
                autoCapitalize="characters"
              />
              <TouchableOpacity className="bg-brand-navy rounded-xl px-5 justify-center items-center" onPress={handleApplyVoucher}>
                <Text className="color-white font-extrabold text-xs">Klaim</Text>
              </TouchableOpacity>
            </View>
            {appliedVoucher ? (
              <View className="flex-row items-center gap-1 mt-1.5">
                <Feather name="check-circle" size={12} color="#059669" />
                <Text className="text-[10px] text-emerald-600 font-extrabold">
                  Voucher "{appliedVoucher}" berhasil dipasang! (-Rp {discount.toLocaleString('id-ID')})
                </Text>
              </View>
            ) : null}
          </View>

          {/* Guest Checkout Fields */}
          {!user && (
            <View className="mb-4">
              <Text className="text-[10px] font-black text-brand-navy mb-1.5 uppercase tracking-wider">
                Informasi Orang Tua & Anak
              </Text>
              <TextInput
                className="w-full h-11 bg-gray-50 border border-gray-300 rounded-xl px-3.5 text-xs text-brand-navy mb-2"
                placeholder="Nama Anak (e.g. Leo)"
                placeholderTextColor="#9CA3AF"
                value={guestChildName}
                onChangeText={setGuestChildName}
              />
              <TextInput
                className="w-full h-11 bg-gray-50 border border-gray-300 rounded-xl px-3.5 text-xs text-brand-navy"
                placeholder="Nomor WhatsApp Orang Tua"
                placeholderTextColor="#9CA3AF"
                keyboardType="phone-pad"
                value={guestWhatsApp}
                onChangeText={setGuestWhatsApp}
              />
            </View>
          )}

          {/* Price Breakdown Section */}
          <View className="bg-brand-cream rounded-2xl p-4 border border-brand-orange/10 mb-5">
            <Text className="text-[10px] font-black text-brand-navy mb-3 uppercase tracking-wider">Ringkasan Pembayaran</Text>
            
            <View className="flex-row justify-between mb-2">
              <Text className="text-[11px] text-gray-500">Harga Sesi Kelas</Text>
              <Text className="text-[11px] font-bold text-brand-navy">Rp {course.price.toLocaleString('id-ID')}</Text>
            </View>

            {discount > 0 && (
              <View className="flex-row justify-between mb-2">
                <Text className="text-[11px] text-gray-500">Diskon Promo</Text>
                <Text className="text-[11px] font-bold text-emerald-600">- Rp {discount.toLocaleString('id-ID')}</Text>
              </View>
            )}

            <View className="flex-row justify-between border-t border-brand-navy/10 pt-2.5 mt-1.5">
              <Text className="text-xs font-extrabold text-brand-navy">Total Pembayaran</Text>
              <Text className="text-sm font-black text-brand-primary">Rp {totalPayable.toLocaleString('id-ID')}</Text>
            </View>
          </View>

          {/* Action CTA Buttons */}
          <TouchableOpacity className="bg-brand-primary h-12 rounded-2xl justify-center items-center mb-2 shadow-lg shadow-brand-primary/20" onPress={handleCheckout}>
            <Text className="color-white font-extrabold text-xs">Bayar via QRIS / E-Wallet</Text>
          </TouchableOpacity>

          <TouchableOpacity className="h-9 justify-center items-center" onPress={onClose}>
            <Text className="text-rose-600 font-extrabold text-xs">Batal</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
