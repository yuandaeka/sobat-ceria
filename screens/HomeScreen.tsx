import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TextInput, 
  TouchableOpacity, 
  Image, 
  Modal, 
  Platform,
  Linking
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { BookItem, Course } from '../types';
import CheckoutModal from '../components/CheckoutModal';
import { fetchCourses } from '../lib/data';

const bannerImg = require('../assets/online_learning_banner.png');

// --- MOCK BOOK CATALOG DATA (Matching Image & Sobat Ceria Educational Focus) ---
export const MOCK_BOOKS: BookItem[] = [
  {
    id: 'b1',
    title: 'Door To Door',
    author: 'Edward Humes',
    category: 'Extracurricular reading / Growing',
    rating: 4.5,
    reviewsCount: 289,
    pages: 289,
    coverType: 'Hard',
    language: 'English',
    price: 65000,
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600',
    description: 'Hooked unlocks consumer psychologies and reveals the "Hook Model" – a four-step process used by modern start-ups to build habit-forming products and services.',
    isTrending: true,
    ownerInfo: {
      name: 'Edward Humes',
      role: 'Penulis & Edukator Tumbuh Kembang',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
      location: 'Penerbit Lab FKIP UMS'
    }
  },
  {
    id: 'b2',
    title: 'In A Land Of Paper Gods',
    author: 'Rebecca MacKenzie',
    category: 'Parenting & Emosi',
    rating: 4.9,
    reviewsCount: 342,
    pages: 320,
    coverType: 'Hard',
    language: 'Indonesia',
    price: 59000,
    image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600',
    description: 'Panduan komprehensif mengasah kepekaan emosional dan imajinasi anak usia dini melalui pendekatan pengasuhan intuitif & dongeng interaktif.',
    isBestSeller: true,
    ownerInfo: {
      name: 'Rebecca MacKenzie',
      role: 'Penulis Buku Anak Best Seller',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200',
      location: 'Sobat Ceria Publishing'
    }
  },
  {
    id: 'b3',
    title: 'Tattle Tale',
    author: 'Sarah J. Naughton',
    category: 'Karakter & Kejujuran',
    rating: 4.8,
    reviewsCount: 198,
    pages: 210,
    coverType: 'Soft',
    language: 'Indonesia',
    price: 49000,
    image: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=600',
    description: 'Buku edukasi interaktif tentang kejujuran dan persahabatan anak-anak yang dibungkus dengan ilustrasi warna-warni memikat.',
    isBestSeller: true,
    ownerInfo: {
      name: 'Sarah J. Naughton',
      role: 'Psikolog Anak & Ilustrator',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200',
      location: 'Tim Psikologi FKIP UMS'
    }
  },
  {
    id: 'b4',
    title: 'The Time Space Handbook',
    author: 'Handbook Press',
    category: 'Sains & Eksplorasi',
    rating: 4.7,
    reviewsCount: 412,
    pages: 180,
    coverType: 'Hard',
    language: 'Indonesia',
    price: 75000,
    image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600',
    description: 'Eksplorasi ruang dan waktu untuk memicu rasa ingin tahu alami anak terhadap ilmu pengetahuan, alam semesta, dan logika alam.',
    isBestSeller: true,
    ownerInfo: {
      name: 'Bunda Sarah, M.Psi',
      role: 'Fasilitator Science Class',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200',
      location: 'Sobat Ceria Science Lab'
    }
  },
  {
    id: 'b5',
    title: 'The Queen\'s Heart',
    author: 'Kimberly Thorne',
    category: 'Fabel & Nilai Moral',
    rating: 5.0,
    reviewsCount: 156,
    pages: 160,
    coverType: 'Soft',
    language: 'Indonesia',
    price: 55000,
    image: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=600',
    description: 'Kisah dongeng modern yang mendidik anak tentang rasa empati, kebaikan hati, dan empati sosial dalam keseharian.',
    isBestSeller: true,
    ownerInfo: {
      name: 'Kimberly Thorne',
      role: 'Pengarang Cerita Dongeng Anak',
      avatar: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=200',
      location: 'Penerbit Edukasi Ceria'
    }
  },
  {
    id: 'b6',
    title: 'Sensory Motoric & Brain Growth',
    author: 'Tim Psikolog FKIP UMS',
    category: 'Stimulasi Motorik',
    rating: 4.9,
    reviewsCount: 520,
    pages: 240,
    coverType: 'Hard',
    language: 'Indonesia',
    price: 85000,
    image: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=600',
    description: 'Panduan stimulasi fisik, motorik kasar, dan taktil bagi anak usia 2-7 tahun untuk mendukung keaktifan sel saraf otak.',
    isTrending: true,
    ownerInfo: {
      name: 'Dr. Anita, Sp.A',
      role: 'Dokter Spesialis Anak & Konsultan',
      avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200',
      location: 'Lab FKIP UMS Floor 2'
    }
  }
];

export default function HomeScreen({ user, navigation }: { user: any; navigation?: any }) {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [selectedBook, setSelectedBook] = useState<BookItem | null>(null);
  const [detailModalVisible, setDetailModalVisible] = useState<boolean>(false);
  const [detailTab, setDetailTab] = useState<'about' | 'owner'>('about');
  const [isExpandedDesc, setIsExpandedDesc] = useState<boolean>(false);
  
  // Checkout Modal state
  const [selectedCourseForCheckout, setSelectedCourseForCheckout] = useState<Course | null>(null);
  const [checkoutModalVisible, setCheckoutModalVisible] = useState<boolean>(false);

  // Convert BookItem to Course object for CheckoutModal compatibility
  const handleBuyNow = (book: BookItem) => {
    const courseAdapter: Course = {
      id: book.id,
      title: `Buku: ${book.title}`,
      category: book.category,
      ageRange: book.ageRange || 'Semua Usia',
      price: book.price,
      seats: 50,
      image: book.image,
      description: book.description,
      facilitator: book.ownerInfo?.name || book.author
    };
    setSelectedCourseForCheckout(courseAdapter);
    setCheckoutModalVisible(true);
  };

  return (
    <SafeAreaView style={{ flex: 1 }} className="bg-[#FAFDFB]">
      {/* --- TOP HEADER (Discover & Search Button) --- */}
      <View className="px-5 pt-3 pb-3 bg-white flex-row items-center justify-between border-b border-rose-50">
        <Text className="text-2xl font-black text-[#1F2937] tracking-tight">Discover</Text>
        
        <TouchableOpacity 
          className="w-10 h-10 rounded-2xl bg-[#D82B5A] items-center justify-center shadow-xs active:scale-95 transition-transform"
          onPress={() => setIsSearchOpen(!isSearchOpen)}
        >
          <Feather name={isSearchOpen ? 'x' : 'search'} size={18} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* --- EXPANDABLE SEARCH BAR --- */}
      {isSearchOpen && (
        <View className="px-5 py-3 bg-white border-b border-gray-100">
          <View className="bg-[#FDECF2] rounded-2xl px-4 flex-row items-center border border-[#F6D4E0]">
            <Feather name="search" size={16} color="#D82B5A" className="mr-2" />
            <TextInput
              className="flex-1 h-11 text-xs font-semibold text-gray-800"
              placeholder="Cari judul buku, penulis, atau topik..."
              placeholderTextColor="#C97B95"
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoFocus
            />
            {searchQuery !== '' && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Feather name="x-circle" size={16} color="#C97B95" />
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}

      <ScrollView 
        contentContainerStyle={{ paddingBottom: 110 }} 
        showsVerticalScrollIndicator={false}
        className="flex-1"
      >
        {/* --- FEATURED BANNER ("Kelas Belajar Sambil Bermain") --- */}
        <View className="px-5 pt-4 pb-2">
          <View className="bg-gradient-to-br from-[#D82B5A] to-[#B01E49] rounded-3xl p-5 shadow-sm relative overflow-hidden flex-row items-center justify-between min-h-[140px]" style={{ backgroundColor: '#D82B5A' }}>
            {/* Background Decorative Circles matching splash layout */}
            <View className="absolute -top-10 -left-10 w-32 h-32 rounded-full bg-white/10" />
            <View className="absolute -bottom-8 -right-8 w-28 h-28 rounded-full bg-white/10" />

            {/* Left Content Column */}
            <View className="flex-1 pr-3 z-10 justify-center">
              <View className="bg-white/20 self-start px-3 py-1 rounded-full mb-2.5 border border-white/30">
                <Text className="text-white text-[9px] font-black uppercase tracking-wider">Program Stimulasi Terpadu</Text>
              </View>
              <Text className="text-xl md:text-2xl font-black text-white leading-tight mb-1.5">
                Kelas Belajar Sambil Bermain
              </Text>
              <Text className="text-[11px] text-rose-100 font-medium mb-3.5 leading-snug">
                Metode inklusif berbasis Mindfulness & Family Co-Creation untuk anak usia 2–7 tahun.
              </Text>

              <TouchableOpacity 
                className="bg-white rounded-full px-4 py-2 self-start shadow-xs active:scale-95 transition-transform flex-row items-center gap-1.5"
                onPress={() => navigation?.navigate('Kelas')}
              >
                <Text className="text-xs font-extrabold text-[#B01E49]">Jelajahi 8 Kelas Resmi</Text>
                <Feather name="arrow-right" size={13} color="#B01E49" />
              </TouchableOpacity>
            </View>

            {/* Right Graphic/Illustration */}
            <View className="w-24 h-24 md:w-28 md:h-28 z-10 items-center justify-center">
              <Image 
                source={bannerImg} 
                className="w-full h-full object-contain" 
                style={{ width: '100%', height: '100%', borderRadius: 16 }}
                resizeMode="contain"
              />
            </View>
          </View>

          {/* Carousel Pagination Dots */}
          <View className="flex-row justify-center items-center gap-1.5 mt-3">
            <View className="w-4 h-1.5 rounded-full bg-[#D82B5A]" />
            <View className="w-1.5 h-1.5 rounded-full bg-gray-300" />
            <View className="w-1.5 h-1.5 rounded-full bg-gray-300" />
          </View>
        </View>

        {/* --- SECTION 1: PROGRAM KELAS --- */}
        <View className="mt-4">
          <View className="px-5 flex-row items-center justify-between mb-3">
            <Text className="text-lg font-black text-[#1F2937]">Program Kelas</Text>
            <TouchableOpacity onPress={() => navigation?.navigate('Kelas')}>
              <Text className="text-xs font-bold text-[#D82B5A]">Lihat Semua</Text>
            </TouchableOpacity>
          </View>

          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            contentContainerStyle={{ paddingHorizontal: 20, gap: 16 }}
          >
            {[
              {
                id: 'p-seminar',
                title: 'Seminar Parenting',
                subtitle: 'Edukasi Orang Tua',
                age: 'Untuk Ortu',
                price: 49000,
                image: require('../assets/dokumentasi sobat/seminarparenting-program.jpeg'),
              },
              {
                id: 'p-science',
                title: 'Science Class',
                subtitle: 'Eksperimen STEAM',
                age: 'Usia 3-7 Thn',
                price: 69000,
                image: require('../assets/dokumentasi sobat/program-science.jpeg'),
              },
              {
                id: 'p-cooking',
                title: 'Cooking Class',
                subtitle: 'Kemandirian & Life Skill',
                age: 'Usia 3-7 Thn',
                price: 85000,
                image: require('../assets/dokumentasi sobat/cooking-program.jpeg'),
              },
              {
                id: 'p-outbond',
                title: 'Outbond Ceria',
                subtitle: 'Permainan Fisik Aktif',
                age: 'Usia 2-7 Thn',
                price: 69000,
                image: require('../assets/dokumentasi sobat/outbondceria-program.jpeg'),
              },
            ].map((program) => (
              <TouchableOpacity
                key={program.id}
                className="w-44 active:scale-95 transition-transform"
                onPress={() => navigation?.navigate('Kelas')}
              >
                {/* Program Cover Image */}
                <View className="w-44 h-32 rounded-2xl overflow-hidden shadow-sm bg-gray-100 border border-gray-100 relative">
                  <Image 
                    source={program.image} 
                    className="w-full h-full object-cover" 
                    style={{ width: '100%', height: '100%' }} 
                  />
                  <View className="absolute top-2 right-2 bg-[#D82B5A] px-1.5 py-0.5 rounded-full shadow-xs">
                    <Text className="text-[8px] font-black text-white">Kelas</Text>
                  </View>
                </View>

                {/* Subtitle */}
                <Text 
                  className="text-[11px] text-gray-500 font-semibold mt-2.5" 
                  numberOfLines={1}
                >
                  {program.subtitle}
                </Text>

                {/* Title */}
                <Text 
                  className="text-xs font-black text-gray-900 leading-tight mt-0.5" 
                  numberOfLines={1}
                >
                  {program.title}
                </Text>

                {/* Price */}
                <View className="flex-row items-center gap-1 mt-1">
                  <Text className="text-[10px] font-extrabold text-[#D82B5A]">
                    Rp {program.price.toLocaleString('id-ID')}
                  </Text>
                  <Text className="text-[9px] text-gray-400 font-medium ml-0.5">• {program.age}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* --- SECTION 2: KELAS TERDEKAT --- */}
        <View className="mt-6 px-5">
          <Text className="text-lg font-black text-[#1F2937] mb-3">Kelas Terdekat</Text>

          <TouchableOpacity
            className="bg-[#FDECF2] rounded-2xl p-3.5 mb-3 border border-[#F6D4E0] flex-row items-center justify-between shadow-xs active:scale-98 transition-transform"
            onPress={() => navigation?.navigate('Kelas')}
          >
            <View className="flex-row items-center gap-3.5 flex-1 pr-2">
              <View className="w-14 h-18 rounded-xl overflow-hidden shadow-xs bg-gray-200 border border-rose-100">
                <Image 
                  source={require('../assets/dokumentasi sobat/program-science.jpeg')} 
                  className="w-full h-full object-cover" 
                  style={{ width: '100%', height: '100%' }} 
                />
              </View>

              <View className="flex-1">
                <Text className="text-sm font-black text-gray-900 leading-snug">Science Class</Text>
                <Text className="text-[11px] text-gray-600 font-medium mt-1" numberOfLines={1}>
                  Eksperimen sains sederhana berbasis STEAM
                </Text>
                
                <View className="flex-row items-center gap-2 mt-2">
                  <View className="bg-white/80 px-2 py-0.5 rounded-md border border-rose-200/60 flex-row items-center gap-1">
                    <Feather name="calendar" size={10} color="#B01E49" />
                    <Text className="text-[10px] font-black text-gray-800">24 Agu 2026</Text>
                  </View>
                  <Text className="text-[10px] font-extrabold text-[#B01E49]">
                    Rp 69.000
                  </Text>
                </View>
              </View>
            </View>

            <View className="w-8 h-8 rounded-full bg-white items-center justify-center shadow-xs border border-rose-100">
              <Feather name="chevron-right" size={16} color="#D82B5A" />
            </View>
          </TouchableOpacity>
        </View>

        {/* --- SECTION 3: AKSES CEPAT FITUR APLIKASI --- */}
        <View className="mt-6 px-5">
          <Text className="text-lg font-black text-[#1F2937] mb-3">Akses Cepat Fitur Aplikasi</Text>

          <View className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {/* 1. Screening STPPA */}
            <TouchableOpacity
              className="bg-white p-4 rounded-[2rem] border border-gray-100 shadow-xs items-center text-center active:scale-95 transition-transform"
              onPress={() => navigation?.navigate('Screening')}
            >
              <View className="w-11 h-11 rounded-2xl bg-[#2DA9E9]/15 border border-[#2DA9E9]/30 items-center justify-center mb-2.5">
                <Feather name="activity" size={20} color="#2DA9E9" />
              </View>
              <Text className="text-xs font-black text-[#1F2937]">Screening STPPA</Text>
              <Text className="text-[10px] text-gray-500 mt-0.5">6 Aspek Anak</Text>
            </TouchableOpacity>

            {/* 2. Kelas */}
            <TouchableOpacity
              className="bg-white p-4 rounded-[2rem] border border-gray-100 shadow-xs items-center text-center active:scale-95 transition-transform"
              onPress={() => navigation?.navigate('Kelas')}
            >
              <View className="w-11 h-11 rounded-2xl bg-[#D82B5A]/15 border border-[#D82B5A]/30 items-center justify-center mb-2.5">
                <Feather name="shopping-bag" size={20} color="#D82B5A" />
              </View>
              <Text className="text-xs font-black text-[#1F2937]">8 Program Kelas</Text>
              <Text className="text-[9px] text-gray-500 mt-0.5">Stimulasi Terpadu</Text>
            </TouchableOpacity>

            {/* 3. Worksheet PDF */}
            <TouchableOpacity
              className="bg-white p-4 rounded-[2rem] border border-gray-100 shadow-xs items-center text-center active:scale-95 transition-transform"
              onPress={() => navigation?.navigate('Worksheet')}
            >
              <View className="w-11 h-11 rounded-2xl bg-[#30B864]/15 border border-[#30B864]/30 items-center justify-center mb-2.5">
                <Feather name="file-text" size={20} color="#30B864" />
              </View>
              <Text className="text-xs font-black text-[#1F2937]">Worksheet PDF</Text>
              <Text className="text-[9px] text-gray-500 mt-0.5">Gratis Printable</Text>
            </TouchableOpacity>

            {/* 4. Dokumentasi */}
            <TouchableOpacity
              className="bg-white p-4 rounded-[2rem] border border-gray-100 shadow-xs items-center text-center active:scale-95 transition-transform"
              onPress={() => {
                if (Platform.OS === 'web') {
                  window.open('https://www.instagram.com/sobatceria__?igsh=ZzFmMW5jcXZ6ampp', '_blank');
                } else {
                  Linking.openURL('https://www.instagram.com/sobatceria__?igsh=ZzFmMW5jcXZ6ampp');
                }
              }}
            >
              <View className="w-11 h-11 rounded-2xl bg-[#F77712]/15 border border-[#F77712]/30 items-center justify-center mb-2.5">
                <Feather name="image" size={20} color="#F77712" />
              </View>
              <Text className="text-xs font-black text-[#1F2937]">Dokumentasi</Text>
              <Text className="text-[9px] text-gray-500 mt-0.5">Foto & Video Activity</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* --- SECTION 4: MENGAPA SOBAT CERIA --- */}
        <View className="px-5 mt-1">
          <View className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-xs mb-6 active:scale-98 transition-transform">
            <View className="flex-row items-center gap-2 mb-2">
              <Feather name="heart" size={18} color="#D82B5A" />
              <Text className="text-base font-extrabold text-[#1F2937]">Mengapa Sobat Ceria Fun Learning?</Text>
            </View>
            <Text className="text-xs text-gray-600 leading-relaxed mb-4 font-medium">
              Program kami memadukan stimulasi sensorik-motorik, kelas kriya, komunikasi, serta pemantauan intensif oleh psikolog anak & fasilitator PAUD. Kami mendukung penuh tumbuh kembang emas bebas kecanduan gadget.
            </Text>
            <View className="flex-row flex-wrap gap-2">
              <View className="bg-[#30B864]/10 px-3 py-1 rounded-full border border-[#30B864]/20">
                <Text className="text-[10px] font-black text-[#30B864]">Inklusif (ABK Welcome)</Text>
              </View>
              <View className="bg-[#5A3B8B]/10 px-3 py-1 rounded-full border border-[#5A3B8B]/20">
                <Text className="text-[10px] font-black text-[#5A3B8B]">Mindfulness Kids</Text>
              </View>
              <View className="bg-[#F77712]/10 px-3 py-1 rounded-full border border-[#F77712]/20">
                <Text className="text-[10px] font-black text-[#F77712]">Family Co-Creation</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* --- INTERACTIVE BOOK DETAILS MODAL (Matching Image Right Screen) --- */}
      {selectedBook && (
        <Modal
          visible={detailModalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setDetailModalVisible(false)}
        >
          <View className="flex-1 bg-black/50 justify-end md:justify-center md:items-center">
            <View className="bg-white w-full md:w-[480px] max-h-[90%] rounded-t-[2.5rem] md:rounded-[2.5rem] overflow-hidden flex-col shadow-2xl relative">
              
              {/* Modal Green Header Curve */}
              <View className="bg-[#D82B5A] pt-6 pb-16 px-6 relative items-center justify-center">
                {/* Close Button (X) at Top Right */}
                <TouchableOpacity 
                  className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/20 items-center justify-center active:scale-95 z-20"
                  onPress={() => setDetailModalVisible(false)}
                >
                  <Feather name="x" size={18} color="#FFFFFF" />
                </TouchableOpacity>

                {/* Decorative background shapes */}
                <View className="absolute top-2 left-4 w-20 h-20 rounded-full bg-white/10" />
                <View className="absolute -bottom-6 right-6 w-24 h-24 rounded-full bg-white/10" />
              </View>

              {/* Overlapping Floating Book Cover Image */}
              <View className="items-center -mt-20 z-10">
                <View className="w-28 h-40 rounded-2xl overflow-hidden shadow-2xl bg-white border-2 border-white">
                  <Image 
                    source={{ uri: selectedBook.image }} 
                    className="w-full h-full object-cover" 
                    style={{ width: '100%', height: '100%' }} 
                  />
                </View>
              </View>

              {/* Book Info Header */}
              <View className="items-center px-6 pt-3 pb-2">
                <Text className="text-xs font-bold text-gray-500">{selectedBook.author}</Text>
                <Text className="text-xl font-black text-[#1F2937] text-center mt-0.5 leading-tight">
                  {selectedBook.title}
                </Text>
              </View>

              {/* Segmented Control Tabs ("About Book" vs "Owner's Info") */}
              <View className="flex-row border-b border-gray-100 px-6 mt-1">
                <TouchableOpacity 
                  className={`flex-1 py-2.5 items-center border-b-2 ${
                    detailTab === 'about' ? 'border-[#D82B5A]' : 'border-transparent'
                  }`}
                  onPress={() => setDetailTab('about')}
                >
                  <Text className={`text-xs font-black ${detailTab === 'about' ? 'text-[#D82B5A]' : 'text-gray-400'}`}>
                    About Book
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  className={`flex-1 py-2.5 items-center border-b-2 ${
                    detailTab === 'owner' ? 'border-[#D82B5A]' : 'border-transparent'
                  }`}
                  onPress={() => setDetailTab('owner')}
                >
                  <Text className={`text-xs font-black ${detailTab === 'owner' ? 'text-[#D82B5A]' : 'text-gray-400'}`}>
                    Owner's Info
                  </Text>
                </TouchableOpacity>
              </View>

              <ScrollView className="p-6 flex-1" showsVerticalScrollIndicator={false}>
                {detailTab === 'about' ? (
                  <View>
                    {/* STATS PILL BOX CONTAINER (4 columns with soft mint bg) */}
                    <View className="bg-[#FDECF2] border border-[#F6D4E0] rounded-2xl p-3.5 flex-row justify-between items-center mb-5">
                      <View className="items-center flex-1">
                        <Text className="text-sm font-black text-gray-900">{selectedBook.rating}</Text>
                        <Text className="text-[10px] font-semibold text-gray-500 mt-0.5">Rating</Text>
                      </View>
                      
                      <View className="w-px h-7 bg-rose-200/60" />

                      <View className="items-center flex-1">
                        <Text className="text-sm font-black text-gray-900">{selectedBook.pages}</Text>
                        <Text className="text-[10px] font-semibold text-gray-500 mt-0.5">Pages</Text>
                      </View>

                      <View className="w-px h-7 bg-rose-200/60" />

                      <View className="items-center flex-1">
                        <Text className="text-sm font-black text-gray-900">{selectedBook.coverType}</Text>
                        <Text className="text-[10px] font-semibold text-gray-500 mt-0.5">Cover</Text>
                      </View>

                      <View className="w-px h-7 bg-rose-200/60" />

                      <View className="items-center flex-1">
                        <Text className="text-sm font-black text-gray-900">{selectedBook.language}</Text>
                        <Text className="text-[10px] font-semibold text-gray-500 mt-0.5">Language</Text>
                      </View>
                    </View>

                    {/* Description Section */}
                    <Text className="text-sm font-black text-[#1F2937] mb-2">Description</Text>
                    <Text 
                      className="text-xs text-gray-600 font-medium leading-relaxed"
                      numberOfLines={isExpandedDesc ? undefined : 3}
                    >
                      {selectedBook.description}
                    </Text>

                    <TouchableOpacity 
                      className="mt-1 self-start"
                      onPress={() => setIsExpandedDesc(!isExpandedDesc)}
                    >
                      <Text className="text-xs font-black text-[#D82B5A]">
                        {isExpandedDesc ? 'Show Less' : 'Read More'}
                      </Text>
                    </TouchableOpacity>

                    {/* Additional Details */}
                    <View className="mt-4 pt-4 border-t border-gray-100">
                      <View className="flex-row justify-between items-center mb-2">
                        <Text className="text-xs text-gray-500 font-medium">Kategori & Topik</Text>
                        <Text className="text-xs font-bold text-[#1F2937]">{selectedBook.category}</Text>
                      </View>
                      <View className="flex-row justify-between items-center">
                        <Text className="text-xs text-gray-500 font-medium">Harga Resmi</Text>
                        <Text className="text-sm font-black text-[#D82B5A]">Rp {selectedBook.price.toLocaleString('id-ID')}</Text>
                      </View>
                    </View>
                  </View>
                ) : (
                  <View>
                    {/* Owner / Author Info Card */}
                    <View className="flex-row items-center gap-3.5 bg-gray-50 p-4 rounded-2xl border border-gray-100 mb-4">
                      <Image 
                        source={{ uri: selectedBook.ownerInfo?.avatar || selectedBook.image }}
                        className="w-14 h-14 rounded-full border border-rose-200" 
                      />
                      <View className="flex-1">
                        <Text className="text-sm font-black text-gray-900">{selectedBook.ownerInfo?.name || selectedBook.author}</Text>
                        <Text className="text-xs font-semibold text-[#D82B5A] mt-0.5">{selectedBook.ownerInfo?.role || 'Fasilitator Sobat Ceria'}</Text>
                        <Text className="text-[10px] text-gray-500 font-medium mt-1">{selectedBook.ownerInfo?.location || 'Lab FKIP UMS Lantai 2'}</Text>
                      </View>
                    </View>

                    <Text className="text-xs text-gray-600 font-medium leading-relaxed">
                      Buku ini dikurasi secara profesional oleh tim fasilitator & psikolog tumbuh kembang anak untuk memberikan stimulasi yang aman, menyenangkan, dan efektif sesuai jenjang usia si kecil.
                    </Text>
                  </View>
                )}
              </ScrollView>

              {/* STICKY BOTTOM ACTION BUTTON ("Buy Now") */}
              <View className="p-5 bg-white border-t border-gray-100">
                <TouchableOpacity 
                  className="bg-[#D82B5A] py-3.5 rounded-full items-center justify-center shadow-md active:scale-95 transition-transform"
                  onPress={() => {
                    setDetailModalVisible(false);
                    handleBuyNow(selectedBook);
                  }}
                >
                  <Text className="text-white text-sm font-black tracking-wide">Buy Now</Text>
                </TouchableOpacity>
              </View>

            </View>
          </View>
        </Modal>
      )}

      {/* Interactive Checkout Modal */}
      {selectedCourseForCheckout && (
        <CheckoutModal
          visible={checkoutModalVisible}
          course={selectedCourseForCheckout}
          user={user}
          onClose={() => {
            setCheckoutModalVisible(false);
            setSelectedCourseForCheckout(null);
          }}
        />
      )}
    </SafeAreaView>
  );
}
