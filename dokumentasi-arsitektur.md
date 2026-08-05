// App.tsx - Main Entry Point for Expo (Cross Platform: Web, Android, iOS)
import React, { useState } from 'react';
import { 
  StyleSheet, Text, View, TouchabelOpacity, ScrollView, 
  TextInput, Image, FlatList, Modal, SafeAreaView, Platform, Alert 
} from 'react-native';

// --- TYPES & INTERFACES ---
interface Child {
  name: string;
  age: number;
}

interface UserProfile {
  parentName: string;
  email: string;
  phone: string;
  children: Child[];
}

interface Course {
  id: string;
  title: string;
  category: string;
  ageRange: string;
  price: number;
  seats: number;
  image: string;
  description: string;
}

// --- MOCK DATA ---
const COURSES: Course[] = [
  {
    id: '1',
    title: 'Creative Play Lab',
    category: 'Mini Stimulation',
    ageRange: '2-3 Thn',
    price: 59000,
    seats: 12,
    image: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=600',
    description: 'Stimulasi sensori motorik & pemecahan masalah sederhana berbasis mindfulness.'
  },
  {
    id: '2',
    title: 'Little Artists Workshop',
    category: 'Art & Craft',
    ageRange: '4-5 Thn',
    price: 79000,
    seats: 10,
    image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600',
    description: 'Eksplorasi warna, tanah liat lokal, dan kriya tangan ramah lingkungan.'
  },
  {
    id: '3',
    title: 'Mini STEM Explorers',
    category: 'Science Class',
    ageRange: '5-6 Thn',
    price: 69000,
    seats: 15,
    image: 'https://images.unsplash.com/photo-1530210124550-912dc1381cb8?w=600',
    description: 'Eksperimen sains sederhana berbasis STEAM untuk memicu rasa ingin tahu.'
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'catalog' | 'screening' | 'rewards'>('home');
  const [user, setUser] = useState<UserProfile | null>(null);

  // Auth Form State
  const [parentName, setParentName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [childName, setChildName] = useState('');
  const [childAge, setChildAge] = useState('');

  // Cart & Voucher State
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [voucherCode, setVoucherCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [checkoutModalVisible, setCheckoutModalVisible] = useState(false);

  // Handle Login
  const handleLogin = () => {
    if (!parentName || !email || !phone) {
      alert('Harap isi Nama, Email, dan Nomor Telefon!');
      return;
    }
    setUser({
      parentName,
      email,
      phone,
      children: [{ name: childName || 'Anak Ceria', age: parseInt(childAge) || 4 }]
    });
  };

  // Voucher Engine (Claim Discount)
  const applyVoucher = () => {
    if (voucherCode.toUpperCase() === 'REPEATORDER10') {
      setDiscount(10000);
      alert('Berhasil! Voucher Repeat Order Rp10.000 berhasil dipasang.');
    } else if (voucherCode.toUpperCase() === 'SOBATCERIA20') {
      setDiscount(20000);
      alert('Selamat! Diskon Spesial Rp20.000 berhasil diklaim.');
    } else {
      alert('Kode Voucher tidak valid.');
    }
  };

  // Process Checkout
  const handleCheckout = () => {
    alert(`Pembayaran Berhasil! Terima kasih ${user?.parentName}. Pendaftaran kelas ${selectedCourse?.title} telah tersimpan.`);
    setCheckoutModalVisible(false);
    setSelectedCourse(null);
    setVoucherCode('');
    setDiscount(0);
  };

  // --- RENDER LOGIN SCREEN ---
  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.authContainer}>
          <Text style={styles.logoText}>SOBAT CERIA</Text>
          <Text style={styles.subLogoText}>Fun & Inclusive Kids Learning</Text>
          
          <View style={styles.cardAuth}>
            <Text style={styles.authTitle}>Login / Pendaftaran Orang Tua</Text>
            
            <Text style={styles.label}>Nama Orang Tua / Wali</Text>
            <TextInput style={styles.input} placeholder="e.g. Bunda Dinda" value={parentName} onChangeText={setParentName} />
            
            <Text style={styles.label}>Email</Text>
            <TextInput style={styles.input} placeholder="email@domain.com" keyboardType="email-address" value={email} onChangeText={setEmail} />
            
            <Text style={styles.label}>No. WhatsApp / Telefon</Text>
            <TextInput style={styles.input} placeholder="08123456789" keyboardType="phone-pad" value={phone} onChangeText={setPhone} />
            
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <View style={{ flex: 2 }}>
                <Text style={styles.label}>Nama Anak</Text>
                <TextInput style={styles.input} placeholder="Leo" value={childName} onChangeText={setChildName} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.label}>Usia (Thn)</Text>
                <TextInput style={styles.input} placeholder="5" keyboardType="numeric" value={childAge} onChangeText={setChildAge} />
              </View>
            </View>

            <TouchableOpacity style={styles.btnPrimary} onPress={handleLogin}>
              <Text style={styles.btnPrimaryText}>Masuk ke Platform Ceria</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // --- MAIN APP RENDER ---
  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER NAVBAR */}
      <View style={styles.headerNav}>
        <View>
          <Text style={styles.brandTitle}>SOBAT CERIA</Text>
          <Text style={styles.welcomeUser}>Halo, {user.parentName} ({user.children[0].name})</Text>
        </View>
        <TouchableOpacity style={styles.badgeAppBtn} onPress={() => alert('Aplikasi Mobile Siap Dipakai di Android & iOS!')}>
          <Text style={styles.badgeAppText}>📱 Native App Active</Text>
        </TouchableOpacity>
      </View>

      {/* BODY CONTENT BASED ON TAB */}
      <ScrollView style={{ flex: 1, padding: 16 }}>
        {activeTab === 'home' && (
          <View>
            {/* HERO BANNER */}
            <View style={styles.heroCard}>
              <Text style={styles.heroTitle}>Kelas Stimulasi Tumbuh Kembang Inklusif</Text>
              <Text style={styles.heroSub}>Berbasis Mindfulness & Family Co-Creation di Solo Raya</Text>
              <TouchableOpacity style={styles.btnWhite} onPress={() => setActiveTab('catalog')}>
                <Text style={styles.btnWhiteText}>Lihat Katalog & Jadwal</Text>
              </TouchableOpacity>
            </View>

            {/* QUICK LINK ACTION CARDS */}
            <Text style={styles.sectionTitle}>Akses Cepat Fitur</Text>
            <View style={styles.quickGrid}>
              <TouchableOpacity style={[styles.quickBox, { backgroundColor: '#E2F1F8' }]} onPress={() => setActiveTab('screening')}>
                <Text style={styles.quickIcon}>📊</Text>
                <Text style={styles.quickText}>Hasil Screening</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.quickBox, { backgroundColor: '#DDF5E6' }]} onPress={() => setActiveTab('rewards')}>
                <Text style={styles.quickIcon}>📄</Text>
                <Text style={styles.quickText}>Claim Worksheet</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.quickBox, { backgroundColor: '#FCEEE2' }]} onPress={() => alert('Membuka Link Drive Dokumentasi Foto/Video Event...')}>
                <Text style={styles.quickIcon}>📸</Text>
                <Text style={styles.quickText}>Dokumentasi</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {activeTab === 'catalog' && (
          <View>
            <Text style={styles.sectionTitle}>Katalog Kelas & Event (Shopee Style)</Text>
            <Text style={styles.sectionSub}>Pilih kelas favorit untuk si kecil dan klaim voucher diskon!</Text>

            {COURSES.map((course) => (
              <View key={course.id} style={styles.courseCard}>
                <Image source={{ uri: course.image }} style={styles.courseImg} />
                <View style={{ padding: 12 }}>
                  <Text style={styles.courseCategory}>{course.category} • Usia {course.ageRange}</Text>
                  <Text style={styles.courseTitle}>{course.title}</Text>
                  <Text style={styles.courseDesc}>{course.description}</Text>
                  
                  <View style={styles.courseFooter}>
                    <Text style={styles.coursePrice}>Rp {course.price.toLocaleString('id-ID')}</Text>
                    <TouchableOpacity 
                      style={styles.btnBuy} 
                      onPress={() => {
                        setSelectedCourse(course);
                        setCheckoutModalVisible(true);
                      }}>
                      <Text style={styles.btnBuyText}>Daftar Sekarang</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}

        {activeTab === 'screening' && (
          <View>
            <Text style={styles.sectionTitle}>Hasil Screening & Evaluasi (STPPA)</Text>
            <Text style={styles.sectionSub}>Perkembangan Anak: {user.children[0].name} (5 Tahun)</Text>

            <View style={styles.screeningCard}>
              <Text style={styles.scoreHeader}>📌 Laporan Observasi Terakhir</Text>
              <View style={styles.scoreRow}>
                <Text style={styles.scoreLabel}>Motorik Halus & Kasar:</Text>
                <Text style={styles.scoreBadge}>Berkembang Sesuai Harapan (BSH)</Text>
              </View>
              <View style={styles.scoreRow}>
                <Text style={styles.scoreLabel}>Kemampuan Bicara / Bahasa:</Text>
                <Text style={styles.scoreBadgeWarning}>Mulai Berkembang (MB)</Text>
              </View>
              <View style={styles.scoreRow}>
                <Text style={styles.scoreLabel}>Sosial Emosional & Regilasi:</Text>
                <Text style={styles.scoreBadge}>Berkembang Sesuai Harapan (BSH)</Text>
              </View>

              <Text style={{ marginTop: 12, fontWeight: 'bold', color: '#1B254B' }}>Catatan Fasilitator / Psikolog:</Text>
              <Text style={{ color: '#555', fontSize: 13, marginTop: 4 }}>
                "Anak sangat aktif dalam kegiatan kolaboratif. Disarankan melanjutkan stimulasi di Communication Class & latihan pernapasan mindfulness di rumah."
              </Text>
            </View>
          </View>
        )}

        {activeTab === 'rewards' && (
          <View>
            <Text style={styles.sectionTitle}>Klaim Worksheet & Diskon Repeat Order</Text>
            
            {/* WORKSHEET DOWNLOAD */}
            <View style={styles.rewardCard}>
              <Text style={styles.rewardTitle}>📄 Printable Worksheet Gratis</Text>
              <Text style={styles.rewardSub}>Lembar aktivitas melatih fokus & motorik halus di rumah.</Text>
              <TouchableOpacity style={styles.btnOutline} onPress={() => alert('Mengunduh File PDF Worksheet Sobat Ceria...')}>
                <Text style={styles.btnOutlineText}>Download PDF Worksheet</Text>
              </TouchableOpacity>
            </View>

            {/* VOUCHER REPEAT ORDER */}
            <View style={styles.rewardCard}>
              <Text style={styles.rewardTitle}>🎟️ Kode Voucher Repeat Order Anda</Text>
              <Text style={styles.rewardSub}>Gunakan kode di bawah saat checkout kelas berikutnya:</Text>
              <View style={styles.voucherCodeBox}>
                <Text style={styles.voucherCodeText}>REPEATORDER10</Text>
              </View>
              <Text style={{ fontSize: 11, color: '#777', marginTop: 4 }}>*Diskon Rp10.000 untuk semua kelas tematik.</Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* CHECKOUT MODAL (SHOPEE STYLE) */}
      <Modal visible={checkoutModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Checkout Kelas</Text>
            {selectedCourse && (
              <View>
                <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#1B254B' }}>{selectedCourse.title}</Text>
                <Text style={{ color: '#666', marginBottom: 12 }}>Harga Normal: Rp {selectedCourse.price.toLocaleString('id-ID')}</Text>

                {/* VOUCHER CLAIM INPUT */}
                <Text style={styles.label}>Punya Kode Voucher Diskon?</Text>
                <View style={{ flexDirection: 'row', gap: 8, marginBottom: 12 }}>
                  <TextInput 
                    style={[styles.input, { flex: 1, marginBottom: 0 }]} 
                    placeholder="Masukkan KODE (e.g. REPEATORDER10)" 
                    value={voucherCode}
                    onChangeText={setVoucherCode}
                  />
                  <TouchableOpacity style={styles.btnApplyVoucher} onPress={applyVoucher}>
                    <Text style={{ color: '#fff', fontWeight: 'bold' }}>Klaim</Text>
                  </TouchableOpacity>
                </View>

                {/* PRICE BREAKDOWN */}
                <View style={styles.priceBreakdown}>
                  <View style={styles.priceRow}>
                    <Text>Subtotal:</Text>
                    <Text>Rp {selectedCourse.price.toLocaleString('id-ID')}</Text>
                  </View>
                  <View style={styles.priceRow}>
                    <Text>Diskon Voucher:</Text>
                    <Text style={{ color: 'green' }}>- Rp {discount.toLocaleString('id-ID')}</Text>
                  </View>
                  <View style={[styles.priceRow, { borderTopWidth: 1, borderColor: '#ccc', paddingTop: 6, marginTop: 6 }]}>
                    <Text style={{ fontWeight: 'bold', fontSize: 16 }}>Total Bayar:</Text>
                    <Text style={{ fontWeight: 'bold', fontSize: 16, color: '#8B22C0' }}>
                      Rp {Math.max(0, selectedCourse.price - discount).toLocaleString('id-ID')}
                    </Text>
                  </View>
                </View>

                <TouchableOpacity style={styles.btnPrimary} onPress={handleCheckout}>
                  <Text style={styles.btnPrimaryText}>Bayar via QRIS / E-Wallet</Text>
                </TouchableOpacity>

                <TouchableOpacity style={{ marginTop: 10, alignItems: 'center' }} onPress={() => setCheckoutModalVisible(false)}>
                  <Text style={{ color: 'red', fontWeight: 'bold' }}>Batal</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </Modal>

      {/* BOTTOM TAB NAVIGATION */}
      <View style={styles.bottomTab}>
        <TouchableOpacity style={styles.tabItem} onPress={() => setActiveTab('home')}>
          <Text style={[styles.tabIcon, activeTab === 'home' && styles.tabActive]}>🏠</Text>
          <Text style={[styles.tabLabel, activeTab === 'home' && styles.tabActive]}>Beranda</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem} onPress={() => setActiveTab('catalog')}>
          <Text style={[styles.tabIcon, activeTab === 'catalog' && styles.tabActive]}>🛍️</Text>
          <Text style={[styles.tabLabel, activeTab === 'catalog' && styles.tabActive]}>Katalog</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem} onPress={() => setActiveTab('screening')}>
          <Text style={[styles.tabIcon, activeTab === 'screening' && styles.tabActive]}>📊</Text>
          <Text style={[styles.tabLabel, activeTab === 'screening' && styles.tabActive]}>Screening</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem} onPress={() => setActiveTab('rewards')}>
          <Text style={[styles.tabIcon, activeTab === 'rewards' && styles.tabActive]}>🎁</Text>
          <Text style={[styles.tabLabel, activeTab === 'rewards' && styles.tabActive]}>Worksheet</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// --- STYLESHEET (Tailwind-like Clean Styling) ---
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAF6F0' },
  authContainer: { padding: 24, justifyContent: 'center', minHeight: '100%' },
  logoText: { fontSize: 32, fontWeight: '900', color: '#8B22C0', textAlign: 'center' },
  subLogoText: { fontSize: 14, fontWeight: '600', color: '#1B254B', textAlign: 'center', marginBottom: 24 },
  cardAuth: { backgroundColor: '#fff', padding: 20, borderRadius: 24, elevation: 4, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 8 },
  authTitle: { fontSize: 18, fontWeight: 'bold', color: '#1B254B', marginBottom: 16, textAlign: 'center' },
  label: { fontSize: 12, fontWeight: 'bold', color: '#1B254B', marginBottom: 4 },
  input: { backgroundColor: '#F5F5F5', borderWidth: 1, borderColor: '#E0E0E0', borderRadius: 12, padding: 12, marginBottom: 12, fontSize: 14 },
  btnPrimary: { backgroundColor: '#8B22C0', padding: 14, borderRadius: 16, alignItems: 'center', marginTop: 8 },
  btnPrimaryText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
  headerNav: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#eee' },
  brandTitle: { fontSize: 18, fontWeight: '900', color: '#8B22C0' },
  welcomeUser: { fontSize: 11, fontWeight: '600', color: '#666' },
  badgeAppBtn: { backgroundColor: '#F4EBF7', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 12 },
  badgeAppText: { fontSize: 10, fontWeight: 'bold', color: '#8B22C0' },
  heroCard: { backgroundColor: '#1B254B', padding: 20, borderRadius: 24, marginBottom: 20 },
  heroTitle: { fontSize: 20, fontWeight: 'bold', color: '#fff', marginBottom: 6 },
  heroSub: { fontSize: 12, color: '#ddd', marginBottom: 16 },
  btnWhite: { backgroundColor: '#fff', paddingVertical: 10, paddingHorizontal: 16, borderRadius: 12, alignSelf: 'flex-start' },
  btnWhiteText: { color: '#1B254B', fontWeight: 'bold', fontSize: 12 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#1B254B', marginBottom: 4 },
  sectionSub: { fontSize: 12, color: '#666', marginBottom: 16 },
  quickGrid: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  quickBox: { flex: 1, padding: 16, borderRadius: 16, alignItems: 'center' },
  quickIcon: { fontSize: 24, marginBottom: 6 },
  quickText: { fontSize: 11, fontWeight: 'bold', color: '#1B254B', textAlign: 'center' },
  courseCard: { backgroundColor: '#fff', borderRadius: 20, overflow: 'hidden', marginBottom: 16, elevation: 2 },
  courseImg: { width: '100%', height: 140 },
  courseCategory: { fontSize: 11, fontWeight: 'bold', color: '#8B22C0', marginBottom: 4 },
  courseTitle: { fontSize: 16, fontWeight: 'bold', color: '#1B254B', marginBottom: 4 },
  courseDesc: { fontSize: 12, color: '#666', marginBottom: 12 },
  courseFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#f0f0f0', paddingTop: 10 },
  coursePrice: { fontSize: 16, fontWeight: '900', color: '#1B254B' },
  btnBuy: { backgroundColor: '#FF5E3A', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 12 },
  btnBuyText: { color: '#fff', fontWeight: 'bold', fontSize: 12 },
  screeningCard: { backgroundColor: '#fff', padding: 16, borderRadius: 20, elevation: 2 },
  scoreHeader: { fontSize: 14, fontWeight: 'bold', color: '#8B22C0', marginBottom: 12 },
  scoreRow: { marginBottom: 8 },
  scoreLabel: { fontSize: 12, color: '#333' },
  scoreBadge: { fontSize: 11, fontWeight: 'bold', color: 'green', backgroundColor: '#DDF5E6', padding: 4, borderRadius: 6, alignSelf: 'flex-start', marginTop: 2 },
  scoreBadgeWarning: { fontSize: 11, fontWeight: 'bold', color: '#d97706', backgroundColor: '#fef3c7', padding: 4, borderRadius: 6, alignSelf: 'flex-start', marginTop: 2 },
  rewardCard: { backgroundColor: '#fff', padding: 16, borderRadius: 20, marginBottom: 12, elevation: 2 },
  rewardTitle: { fontSize: 14, fontWeight: 'bold', color: '#1B254B' },
  rewardSub: { fontSize: 12, color: '#666', marginBottom: 10 },
  btnOutline: { borderWidth: 1.5, borderColor: '#8B22C0', padding: 10, borderRadius: 12, alignItems: 'center' },
  btnOutlineText: { color: '#8B22C0', fontWeight: 'bold', fontSize: 12 },
  voucherCodeBox: { backgroundColor: '#F4EBF7', borderStyle: 'dashed', borderWidth: 1.5, borderColor: '#8B22C0', padding: 10, borderRadius: 10, alignItems: 'center' },
  voucherCodeText: { fontSize: 16, fontWeight: '900', color: '#8B22C0', letterSpacing: 1 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 },
  modalContent: { backgroundColor: '#fff', borderRadius: 24, padding: 20 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: '#1B254B', marginBottom: 12 },
  btnApplyVoucher: { backgroundColor: '#1B254B', paddingHorizontal: 16, justifyContent: 'center', borderRadius: 12 },
  priceBreakdown: { backgroundColor: '#F8F9FA', padding: 12, borderRadius: 12, marginBottom: 16 },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  bottomTab: { flexDirection: 'row', backgroundColor: '#fff', paddingVertical: 10, borderTopWidth: 1, borderTopColor: '#eee' },
  tabItem: { flex: 1, alignItems: 'center' },
  tabIcon: { fontSize: 20, opacity: 0.5 },
  tabLabel: { fontSize: 10, color: '#888', fontWeight: 'bold', marginTop: 2 },
  tabActive: { opacity: 1, color: '#8B22C0' }
});