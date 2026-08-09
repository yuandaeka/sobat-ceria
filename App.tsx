import React, { useState, useEffect, useMemo } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, TouchableOpacity, ScrollView, Platform, Dimensions, Image, Linking } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Feather } from '@expo/vector-icons';
import { supabase } from './lib/supabase';
import { fetchUserProfile } from './lib/profile';
import { syncProfileToSheet } from './lib/sheets';

const logoImg = require('./assets/sobatceria.png');

// Import Screens
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import CatalogScreen from './screens/CatalogScreen';
import ScreeningScreen from './screens/ScreeningScreen';
import RewardScreen from './screens/RewardScreen';
import ProfileScreen from './screens/ProfileScreen';

// Import Types
import { UserProfile } from './types';

const Tab = createBottomTabNavigator();



// --- CORE APP STACK ---
function AppCore({ user, setUser }: { user: UserProfile | null; setUser: (u: UserProfile | null) => void }) {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarIcon: ({ focused }) => {
            let iconName: any = 'home';
            if (route.name === 'Beranda') {
              iconName = 'home';
            } else if (route.name === 'Kelas') {
              iconName = 'shopping-bag';
            } else if (route.name === 'Screening') {
              iconName = 'activity';
            } else if (route.name === 'Worksheet') {
              iconName = 'gift';
            } else if (route.name === 'Profil') {
              iconName = 'user';
            }
            return (
              <Feather
                name={iconName}
                size={18}
                color={focused ? '#D82B5A' : '#6B7280'}
              />
            );
          },
          tabBarActiveTintColor: '#D82B5A',
          tabBarInactiveTintColor: '#6B7280',
          tabBarStyle: {
            backgroundColor: '#FFFFFF',
            borderTopWidth: 0,
            height: 58,
            borderRadius: 22,
            position: 'absolute',
            bottom: 12,
            left: 12,
            right: 12,
            shadowColor: '#1B254B',
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.08,
            shadowRadius: 10,
            elevation: 3,
            paddingBottom: 0,
          },
          tabBarLabelStyle: {
            fontSize: 9,
            fontWeight: 'bold',
            marginTop: -2,
            marginBottom: 2,
          },
        })}
      >
        <Tab.Screen name="Beranda">
          {(props) => <HomeScreen {...props} user={user} />}
        </Tab.Screen>
        <Tab.Screen name="Kelas">
          {(props) => <CatalogScreen {...props} user={user} />}
        </Tab.Screen>
        <Tab.Screen name="Screening">
          {(props) => <ScreeningScreen {...props} user={user} />}
        </Tab.Screen>
        <Tab.Screen name="Worksheet">
          {(props) => <RewardScreen {...props} user={user} />}
        </Tab.Screen>
        <Tab.Screen name="Profil">
          {(props) => (
            <ProfileScreen
              {...props}
              user={user}
              onLogout={() => setUser(null)}
              onLogin={(profile) => setUser(profile)}
            />
          )}
        </Tab.Screen>
      </Tab.Navigator>
    </NavigationContainer>
  );
}

// TESTIMONIAL DATA ACCORDING TO PRD PERSONAS
const TESTIMONIALS = [
  {
    text: '"Sobat Ceria benar-benar jawaban untuk masalah kecanduan gadget anak saya. Sejak ikut kelas sensory & rutin dipantau via grafik STPPA, Arka jadi jauh lebih aktif bicaranya dan makin berani bersosialisasi. Voucher repeat order-nya juga hemat banget!"',
    name: 'Bunda Dinda & Arka (4 Thn)',
    role: 'Orang Tua Murid - Sesi Sensory Play',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150'
  },
  {
    text: '"Laporan hasil observasi screening STPPA-nya sangat lengkap! Dulu bingung perkembangan bahasa & emosi anak sudah sesuai usianya atau belum. Sekarang semua catatan fasilitator dan unduhan worksheet gratis bisa langsung diakses dari aplikasi Web/HP."',
    name: 'Mama Cut & Arkan (3 Thn)',
    role: 'Orang Tua Murid - Sesi Art & Craft',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150'
  },
  {
    text: '"Proses pendaftaran kelasnya transparan seperti belanja di Shopee. Pilihan jadwal jelas, bisa pakai kode promo REPEATORDER10, dan link foto/video event tersimpan rapi di galeri akun."',
    name: 'Ayah Dimas & Kirana (5 Thn)',
    role: 'Orang Tua Murid - Sesi Mini STEM',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150'
  }
];

export default function App() {
  const [viewMode, setViewMode] = useState<'landing' | 'app'>('landing');
  const [user, setUser] = useState<UserProfile | null>(null);
  const [screenWidth, setScreenWidth] = useState(Dimensions.get('window').width);
  const [testimonialIdx, setTestimonialIdx] = useState(0);

  // Load Supabase session on app start & listen to auth changes
  useEffect(() => {
    let mounted = true;

    // Web: proses token OAuth yang kembali di URL hash secara eksplisit
    // (lebih andal daripada detectSessionInUrl saja, yang bisa gagal karena race condition)
    // Return true jika ada token OAuth yang diproses (berarti baru selesai login Google).
    const processOAuthCallback = async (): Promise<boolean> => {
      if (Platform.OS !== 'web' || typeof window === 'undefined') return false;
      const hash = window.location.hash;
      if (!hash || !hash.includes('access_token')) return false;

      const params = new URLSearchParams(hash.substring(1));
      const accessToken = params.get('access_token');
      const refreshToken = params.get('refresh_token');

      if (accessToken && refreshToken) {
        await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });
        // Bersihkan hash agar token tidak menempel di URL
        window.history.replaceState({}, document.title, window.location.pathname + window.location.search);
        return true;
      }
      return false;
    };

    const loadProfileFromSession = async () => {
      // true = baru selesai login via OAuth (dari hash URL) → boleh langsung ke app
      const isFreshOAuth = await processOAuthCallback();
      const { data } = await supabase.auth.getSession();
      if (mounted && data.session?.user) {
        try {
          const { profile } = await fetchUserProfile(data.session.user.id);
          if (mounted) {
            setUser(profile);
            // Hanya pindah ke aplikasi jika benar-benar baru login via OAuth.
            // Jika hanya session tersimpan (buka link biasa), tetap di landing page.
            if (isFreshOAuth) setViewMode('app');
            syncProfileToSheet(profile);
          }
        } catch {
          // ignore profile sync errors on startup
        }
      }
    };

    loadProfileFromSession();

    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (mounted) {
        if (session?.user) {
          fetchUserProfile(session.user.id)
            .then(({ profile }) => {
              if (!mounted) return;
              setUser(profile);
              // Hanya pindah ke aplikasi saat event SIGNED_IN (user baru login),
              // bukan saat INITIAL_SESSION / TOKEN_REFRESHED (buka link biasa).
              if (event === 'SIGNED_IN') setViewMode('app');
              syncProfileToSheet(profile);
            })
            .catch(() => {});
        } else {
          setUser(null);
        }
      }
    });

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  // States for Hero Image Carousel & Interactive Calculator
  const [heroImageIdx, setHeroImageIdx] = useState(0);
  const [calcAge, setCalcAge] = useState<'0-2' | '3-4' | '5-6'>('3-4');
  const [calcTime, setCalcTime] = useState<'safe' | 'warn' | 'danger'>('warn');

  const HERO_IMAGES = [
    require('./assets/dokumentasi sobat/1.jpeg'),
    require('./assets/dokumentasi sobat/2.jpeg'),
    require('./assets/dokumentasi sobat/3.jpeg'),
    require('./assets/dokumentasi sobat/4.jpeg'),
    require('./assets/dokumentasi sobat/5.jpeg'),
  ];

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setScreenWidth(window.width);
    });
    return () => subscription.remove();
  }, []);

  // Automatic Carousel transition (4 seconds per photo)
  useEffect(() => {
    if (viewMode === 'landing') {
      const interval = setInterval(() => {
        setHeroImageIdx((prev) => (prev + 1) % HERO_IMAGES.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [viewMode]);

  const calcResult = useMemo(() => {
    if (calcAge === '0-2') {
      if (calcTime === 'safe') {
        return {
          status: 'Waspada 🟡',
          textColor: 'text-amber-800',
          descColor: 'text-amber-700',
          bg: 'bg-amber-50 border-amber-200',
          icon: 'alert-triangle' as const,
          iconColor: '#D97706',
          description: 'Usia di bawah 2 tahun direkomendasikan 0 screen time. Ganti dengan stimulasi taktil seperti sensory play.'
        };
      } else {
        return {
          status: 'Bahaya 🔴',
          textColor: 'text-rose-800',
          descColor: 'text-rose-700',
          bg: 'bg-rose-50 border-rose-250',
          icon: 'alert-octagon' as const,
          iconColor: '#DC2626',
          description: 'Sangat Berisiko! Paparan layar di bawah usia 2 tahun berisiko tinggi memicu speech delay dan gangguan fokus.'
        };
      }
    }

    if (calcTime === 'safe') {
      return {
        status: 'Aman 🟢',
        textColor: 'text-emerald-800',
        descColor: 'text-emerald-700',
        bg: 'bg-emerald-50 border-emerald-250',
        icon: 'check-circle' as const,
        iconColor: '#059669',
        description: 'Bagus! Durasi di bawah 1 jam aman untuk usia pra-sekolah. Lengkapi dengan kelas bersosialisasi dan kriya.'
      };
    } else if (calcTime === 'warn') {
      return {
        status: 'Waspada 🟡',
        textColor: 'text-amber-800',
        descColor: 'text-amber-700',
        bg: 'bg-amber-50 border-amber-200',
        icon: 'alert-triangle' as const,
        iconColor: '#D97706',
        description: 'Mendekati Batas Maksimal! Durasi 1-2 jam per hari dapat menurunkan konsentrasi anak. Imbangi dengan aktivitas kreatif.'
      };
    } else {
      return {
        status: 'Bahaya 🔴',
        textColor: 'text-rose-800',
        descColor: 'text-rose-700',
        bg: 'bg-rose-50 border-rose-250',
        icon: 'alert-octagon' as const,
        iconColor: '#DC2626',
        description: 'Waspada Gangguan Tumbuh Kembang! Screen time lebih dari 2 jam per hari memicu kecanduan gadget dan menutup ruang sosialisasi.'
      };
    }
  }, [calcAge, calcTime]);

  const isDesktop = screenWidth > 768 && Platform.OS === 'web';

  const scrollToSection = (sectionId: string) => {
    if (viewMode !== 'landing') {
      setViewMode('landing');
    }
    setTimeout(() => {
      if (Platform.OS === 'web' && typeof document !== 'undefined') {
        const el = document.getElementById(sectionId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    }, 60);
  };

  // --- INSTANT CONTAINER WITH SUBTLE INTERACTIVE HOVER ---
  const ScrollRevealSection = ({ children, className = '' }: { children: React.ReactNode; className?: string; delay?: number }) => {
    return (
      <View className={className}>
        {children}
      </View>
    );
  };

  const nextTestimonial = () => {
    setTestimonialIdx((prev) => (prev + 1) % TESTIMONIALS.length);
  };

  const prevTestimonial = () => {
    setTestimonialIdx((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  };

  // --- RENDER FULL WEB APP MODE (No Phone Frame) ---
  if (viewMode === 'app') {
    return (
      <SafeAreaProvider>
        <StatusBar style="dark" />
        <View className="flex-1 bg-brand-cream relative">
          {/* Main App Workspace (Clean Layout without Phone Frame) */}
          <View className="flex-1 w-full bg-brand-cream justify-center items-center">
            <View className="flex-1 w-full max-w-3xl bg-white shadow-sm overflow-hidden">
              {/* Wajib login dulu sebelum masuk aplikasi */}
              {!user ? (
                <LoginScreen onLogin={(profile) => setUser(profile)} />
              ) : (
                <AppCore user={user} setUser={setUser} />
              )}
            </View>
          </View>
        </View>
      </SafeAreaProvider>
    );
  }

  // --- RENDER LANDING PAGE EXPO WEB MODE ---
  const currentTestimonial = TESTIMONIALS[testimonialIdx];

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <View className="flex-1 bg-[#FAF6F0] relative">

        {/* HEADER NAVBAR (Full Width Flat Top Header — SMM Style) */}
        <View className="w-full bg-white border-b border-gray-100 py-3.5 px-6 md:px-16 z-50 sticky top-0 left-0 right-0 shadow-sm flex-row justify-between items-center">
          {/* Logo & Brand Name */}
          <TouchableOpacity
            className="flex-row items-center gap-3"
            onPress={() => setViewMode('landing')}
          >
            <View className="w-9 h-9 md:w-10 md:h-10 rounded-full overflow-hidden items-center justify-center p-0.5 border border-purple-100 bg-white shadow-sm">
              <Image
                source={logoImg}
                style={{ width: '100%', height: '100%', borderRadius: 999 }}
                resizeMode="contain"
              />
            </View>
            <Text className="text-lg md:text-xl font-extrabold tracking-wide text-[#162E5C]">
              SOBAT CERIA
            </Text>
          </TouchableOpacity>

          {/* Nav Menu Desktop */}
          {isDesktop && (
            <View className="flex-row items-center gap-8">
              <TouchableOpacity onPress={() => scrollToSection('tentang-kami')}>
                <Text className="text-sm font-bold text-[#D82B5A] hover:text-[#B01E49] transition">Tentang Kami</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => scrollToSection('katalog-kelas')}>
                <Text className="text-sm font-bold text-gray-700 hover:text-[#D82B5A] transition">Katalog Kelas</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => scrollToSection('screening-stppa')}>
                <Text className="text-sm font-bold text-gray-700 hover:text-[#D82B5A] transition">Screening STPPA</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => scrollToSection('worksheet-gratis')}>
                <Text className="text-sm font-bold text-gray-700 hover:text-[#D82B5A] transition">Worksheet Gratis</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Header CTA Button (SMM Crimson Pill) */}
          <TouchableOpacity
            className="bg-[#D82B5A] px-6 py-2.5 rounded-full shadow-md items-center justify-center hover:bg-[#B01E49] transition shrink-0"
            onPress={() => setViewMode('app')}
          >
            <Text className="text-white font-extrabold text-xs md:text-sm tracking-wide">Buka Aplikasi</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          className="flex-1 bg-[#FAF6F0]"
          showsVerticalScrollIndicator={false}
        >

          {/* HERO SECTION (SMM Format with 100% Full Background Photo + Left Pink Right-Fading Opacity Gradient + Rounded-BL & Rounded-BR Corners) */}
          <View className="w-full bg-[#FAF6F0] relative overflow-hidden">
            
            {/* 100% Full Width Background Photo Slideshow across entire Hero */}
            <View className="absolute inset-0 z-0 bg-black rounded-bl-none md:rounded-bl-[4.5rem] rounded-br-none md:rounded-br-[4.5rem] overflow-hidden">
              {HERO_IMAGES.map((img, idx) => (
                <View
                  key={idx}
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    opacity: heroImageIdx === idx ? 1 : 0,
                    transition: 'opacity 1.2s ease-in-out',
                    zIndex: heroImageIdx === idx ? 1 : 0,
                  } as any}
                >
                  <Image
                    source={img}
                    className="w-full h-full object-cover"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectPosition: idx === 4 ? 'center 80%' : 'center center',
                    } as any}
                    resizeMode="cover"
                  />
                </View>
              ))}
            </View>

            {/* Foreground Content Row */}
            <View className="w-full flex-col md:flex-row items-stretch min-h-[500px] md:min-h-[560px] relative z-10">
              
              {/* Left Column: Pink Banner with Right/Bottom-Fading Opacity Gradient & Rounded-BL Corner */}
              <View
                className="w-full md:w-1/2 p-6 md:p-14 lg:p-20 pb-16 md:pb-14 text-white flex-col justify-center relative rounded-bl-none md:rounded-bl-[4.5rem] z-20 overflow-hidden"
                style={isDesktop ? {
                  backgroundImage: 'linear-gradient(to right, rgba(216, 43, 90, 0.98) 0%, rgba(216, 43, 90, 0.88) 60%, rgba(216, 43, 90, 0.35) 88%, transparent 100%)',
                } as any : {
                  backgroundImage: 'linear-gradient(to bottom, rgba(216, 43, 90, 0.98) 0%, rgba(216, 43, 90, 0.92) 40%, rgba(216, 43, 90, 0.6) 70%, rgba(216, 43, 90, 0.2) 88%, rgba(216, 43, 90, 0) 100%)',
                } as any}
              >
                {/* Decorative Paper Airplane & Cloud Watermarks */}
                <View className="absolute top-10 left-10 opacity-15 pointer-events-none">
                  <Feather name="send" size={130} color="#FFFFFF" />
                </View>
                <View className="absolute bottom-6 right-8 opacity-15 pointer-events-none">
                  <Feather name="cloud" size={110} color="#FFFFFF" />
                </View>

                <View className="relative z-10 max-w-xl pt-10 md:pt-0">
                  <Text className="text-2xl md:text-4xl lg:text-[40px] font-black text-white leading-tight mb-5" style={{ lineHeight: '1.25em' } as any}>
                    Program Stimulasi Tumbuh Kembang Anak Usia Dini
                  </Text>

                  <Text className="text-xs md:text-base text-white/95 font-medium leading-relaxed mb-8">
                    Sobat Ceria Fun Learning menghadirkan kelas belajar sambil bermain yang inklusif berbasis Mindfulness & Family Co-Creation bersama fasilitator profesional.
                  </Text>

                  <View className="flex-row flex-wrap items-center gap-4">
                    <TouchableOpacity
                      className="bg-white px-7 py-3 rounded-full shadow-lg hover:bg-gray-100 transition"
                      onPress={() => setViewMode('app')}
                    >
                      <Text className="text-[#D82B5A] font-extrabold text-xs md:text-sm">Daftar Sekarang</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      className="border-2 border-white px-7 py-2.5 rounded-full hover:bg-white/10 transition"
                      onPress={() => setViewMode('app')}
                    >
                      <Text className="text-white font-extrabold text-xs md:text-sm">Daftar Kelas Trial</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              {/* Right Column: Clear Photo View with Rounded-BR Corner & Badge Overlay */}
              <View className="w-full md:w-1/2 h-[380px] md:h-auto min-h-[440px] relative justify-end p-6 z-10 rounded-br-none md:rounded-br-[4.5rem]">
                <View className="absolute bottom-6 right-8 bg-black/50 backdrop-blur-md px-4 py-2 rounded-full border border-white/30 z-20 flex-row items-center gap-2">
                  <Text className="text-white text-[11px] font-extrabold">Dokumentasi Aktivitas Sobat Ceria</Text>
                  <View className="flex-row gap-1">
                    {HERO_IMAGES.map((_, idx) => (
                      <View
                        key={idx}
                        className={`h-2 rounded-full transition-all duration-300 ${
                          heroImageIdx === idx ? 'w-4 bg-[#D82B5A]' : 'w-2 bg-white/70'
                        }`}
                      />
                    ))}
                  </View>
                </View>
              </View>

            </View>
          </View>

          {/* SECTION 1: MENGENAL SOBAT CERIA (Interactive Scroll Reveal & Hover Lift) */}
          <ScrollRevealSection className="max-w-7xl mx-auto px-4 md:px-12 py-12 md:py-16">
            <View id="tentang-kami" nativeID="tentang-kami" className="flex-col md:flex-row items-center gap-8 md:gap-12 bg-white rounded-[2.5rem] p-6 md:p-12 shadow-sm border border-gray-100 card-hover-effect">
              {/* Left Photo Frame */}
              <View className="w-full md:w-2/5 h-72 md:h-80 rounded-[2rem] overflow-hidden relative shadow-md img-zoom-container">
                <Image
                  source={require('./assets/dokumentasi sobat/tentang-sobat-ceria.jpeg')}
                  className="w-full h-full object-cover"
                  style={{ width: '100%', height: '100%' }}
                />
                <View className="absolute top-4 right-4 w-10 h-10 rounded-full bg-[#FFD100] items-center justify-center shadow-md">
                  <Feather name="smile" size={22} color="#162E5C" />
                </View>
              </View>

              {/* Right Text Content */}
              <View className="w-full md:w-3/5">
                <Text className="text-[#D82B5A] text-lg font-serif italic mb-1">Mengenal</Text>
                <Text className="text-2xl md:text-4xl font-extrabold text-[#162E5C] mb-4">
                  Tentang Sobat Ceria
                </Text>
                <Text className="text-xs md:text-sm text-gray-600 leading-relaxed font-medium mb-4">
                  Sobat Ceria merupakan layanan stimulasi tumbuh kembang anak usia 2–7 tahun yang menghadirkan pengalaman belajar menyenangkan melalui aktivitas eksploratif, kreatif, dan berbasis bermain.
                </Text>
                <Text className="text-xs md:text-sm text-gray-600 leading-relaxed font-medium mb-4">
                  Program kami dikembangkan berdasarkan Standar Tingkat Pencapaian Perkembangan Anak (STPPA), menggunakan pendekatan Child-Centered Exploration, Mindfulness, serta Family Co-Creation agar setiap anak memperoleh stimulasi yang sesuai dengan kebutuhan dan tahap perkembangannya.
                </Text>
                <Text className="text-xs md:text-sm text-gray-600 leading-relaxed font-medium mb-6">
                  Tidak hanya berfokus pada kemampuan akademik, Sobat Ceria juga mengembangkan kemampuan sosial emosional, komunikasi, kreativitas, motorik, hingga kemandirian anak melalui pengalaman belajar yang bermakna.
                </Text>
                <View className="flex-row items-center gap-4">
                  <TouchableOpacity
                    className="bg-[#162E5C] px-5 py-2.5 rounded-full shadow-sm hover:bg-[#0B2B64] transition"
                    onPress={() => setViewMode('app')}
                  >
                    <Text className="text-white font-extrabold text-xs">Pelajari Selengkapnya</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </ScrollRevealSection>

          {/* SECTION 3: VISI & MISI (Interactive Card Reveal) */}
          <ScrollRevealSection className="max-w-7xl mx-auto px-4 md:px-12 py-12 md:py-16">
            <View className="bg-[#162E5C] rounded-[2.5rem] p-8 md:p-14 text-white shadow-xl flex-col md:flex-row items-center gap-10 card-solid-hover">
              <View className="flex-1">
                <Text className="text-[#FFD100] text-lg font-serif italic mb-2">Visi & Misi</Text>
                <Text className="text-2xl md:text-3xl font-extrabold text-white mb-4">
                  Visi & Misi Kami
                </Text>

                <View className="mb-6">
                  <Text className="text-xs font-black uppercase text-[#FFD100] tracking-wider mb-1">VISI</Text>
                  <Text className="text-xs md:text-sm text-gray-200 leading-relaxed font-medium">
                    Menjadi pusat layanan stimulasi tumbuh kembang anak yang inovatif, inklusif, dan terpercaya dalam membangun generasi Indonesia yang sehat, percaya diri, kreatif, dan berkarakter.
                  </Text>
                </View>

                <View>
                  <Text className="text-xs font-black uppercase text-[#FFD100] tracking-wider mb-2">MISI</Text>
                  <View className="flex-col gap-1.5">
                    <Text className="text-xs md:text-sm text-gray-200 leading-relaxed font-medium">• Memberikan stimulasi perkembangan yang sesuai tahap usia anak.</Text>
                    <Text className="text-xs md:text-sm text-gray-200 leading-relaxed font-medium">• Mengembangkan pembelajaran yang menyenangkan melalui eksplorasi.</Text>
                    <Text className="text-xs md:text-sm text-gray-200 leading-relaxed font-medium">• Mengintegrasikan mindfulness dalam aktivitas belajar.</Text>
                    <Text className="text-xs md:text-sm text-gray-200 leading-relaxed font-medium">• Membangun kolaborasi aktif antara orang tua dan pendidik.</Text>
                    <Text className="text-xs md:text-sm text-gray-200 leading-relaxed font-medium">• Memberikan layanan yang ramah bagi seluruh anak termasuk ABK.</Text>
                    <Text className="text-xs md:text-sm text-gray-200 leading-relaxed font-medium">• Melakukan screening perkembangan secara berkala.</Text>
                  </View>
                </View>

                <View className="mt-6">
                  <Text className="text-xs font-black uppercase text-[#FFD100] tracking-wider mb-1">LOKASI UTAMA KELAS</Text>
                  <Text className="text-xs md:text-sm text-gray-200 leading-relaxed font-medium">
                    Lab Tumbuh Kembang FKIP UMS Lantai 2, Jl. A. Yani Tromol Pos 1 Pabelan, Sukoharjo.
                  </Text>
                </View>
              </View>

              {/* Right Image Frame */}
              <View className="w-full md:w-2/5 h-64 md:h-80 rounded-[2rem] overflow-hidden shadow-lg border-2 border-white/20 img-zoom-container">
                <Image
                  source={require('./assets/dokumentasi sobat/visi-misi.jpeg')}
                  className="w-full h-full object-cover"
                  style={{ width: '100%', height: '100%' }}
                />
              </View>
            </View>
          </ScrollRevealSection>

          {/* SECTION 4: JENJANG USIA PROGRAM (Interactive Cards with Zoom & Lift) */}
          <ScrollRevealSection className="max-w-7xl mx-auto px-4 md:px-12 py-12 md:py-16">
            <View className="text-center mb-12">
              <Text className="text-[#D82B5A] text-lg font-serif italic mb-1">Jenjang Usia</Text>
              <Text className="text-2xl md:text-4xl font-extrabold text-[#162E5C]">
                Fokus Program Menurut Usia (2–7 Tahun)
              </Text>
            </View>

            <View className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Level 1: Pre-Kinder */}
              <View className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-gray-100 flex-col items-center text-center card-hover-effect">
                <View className="w-full h-48 rounded-[1.8rem] overflow-hidden mb-6 img-zoom-container">
                  <Image
                    source={{ uri: 'https://images.unsplash.com/photo-1596464716127-f2a82984de30?w=600' }}
                    className="w-full h-full object-cover"
                    style={{ width: '100%', height: '100%' }}
                  />
                </View>
                <Text className="text-base font-extrabold text-[#162E5C] mb-2">Fokus Sensori & Bicara</Text>
                <Text className="text-xs text-gray-600 leading-relaxed font-medium">
                  Stimulasi taktil, eksplorasi tekstur, melatih koordinasi fisik dasar, dan menambah kosa kata pertama.
                </Text>
              </View>

              {/* Level 2: Kinder A */}
              <View className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-gray-100 flex-col items-center text-center card-hover-effect">
                <View className="w-full h-48 rounded-[1.8rem] overflow-hidden mb-6 img-zoom-container">
                  <Image
                    source={{ uri: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600' }}
                    className="w-full h-full object-cover"
                    style={{ width: '100%', height: '100%' }}
                  />
                </View>
                <Text className="text-base font-extrabold text-[#162E5C] mb-2">Eksplorasi & Bersosialisasi</Text>
                <Text className="text-xs text-gray-600 leading-relaxed font-medium">
                  Kriya tangan, motorik halus gunting tempel, permainan kelompok, serta pembentukan kesabaran.
                </Text>
              </View>

              {/* Level 3: Kinder B */}
              <View className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-gray-100 flex-col items-center text-center card-hover-effect">
                <View className="w-full h-48 rounded-[1.8rem] overflow-hidden mb-6 img-zoom-container">
                  <Image
                    source={{ uri: 'https://images.unsplash.com/photo-1530210124550-912dc1381cb8?w=600' }}
                    className="w-full h-full object-cover"
                    style={{ width: '100%', height: '100%' }}
                  />
                </View>
                <Text className="text-base font-extrabold text-[#162E5C] mb-2">Berpikir Kritis & STEM</Text>
                <Text className="text-xs text-gray-600 leading-relaxed font-medium">
                  Eksperimen sains sederhana, pemecahan masalah mandiri, dan persiapan matang memasuki jenjang sekolah.
                </Text>
              </View>
            </View>
          </ScrollRevealSection>

          {/* SECTION 5: 8 PROGRAM KELAS RESMI (Interactive Hover & Scroll Reveal) */}
          <ScrollRevealSection className="max-w-7xl mx-auto px-4 md:px-12 py-12 md:py-16">
            <View id="katalog-kelas" nativeID="katalog-kelas" className="text-center mb-12">
              <Text className="text-[#D82B5A] text-lg font-serif italic mb-1">Katalog Resmi</Text>
              <Text className="text-2xl md:text-4xl font-extrabold text-[#162E5C]">
                8 Program Kelas Stimulasi Terpadu
              </Text>
            </View>

            {/* 8 Official Program Cards Grid */}
            <View className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

              {/* 1. Mini Stimulation */}
              <View className="bg-white rounded-[2rem] p-5 border border-gray-100 shadow-sm flex-col justify-between card-hover-effect">
                <View>
                  <View className="w-full h-40 rounded-[1.5rem] overflow-hidden mb-4 relative img-zoom-container">
                    <Image source={require('./assets/dokumentasi sobat/ministimulation-program.jpeg')} className="w-full h-full object-cover" style={{ width: '100%', height: '100%' }} />
                    <View className="absolute top-2.5 left-2.5 bg-[#162E5C] px-2.5 py-1 rounded-lg">
                      <Text className="text-[9px] font-black text-white">1. Mini Stimulation</Text>
                    </View>
                  </View>
                  <Text className="text-base font-extrabold text-[#162E5C] mb-1.5">Mini Stimulation Class</Text>
                  <Text className="text-xs text-gray-600 leading-relaxed mb-4 font-medium">
                    Melatih seluruh aspek perkembangan melalui permainan edukatif.
                  </Text>
                </View>
                <View className="flex-row items-center justify-between pt-3 border-t border-gray-100">
                  <Text className="text-[10px] font-bold text-[#2DA9E9]">Usia 2-3 Thn</Text>
                  <Text className="text-xs font-black text-[#D82B5A]">Rp 59.000</Text>
                </View>
              </View>

              {/* 2. Communication */}
              <View className="bg-white rounded-[2rem] p-5 border border-gray-100 shadow-sm flex-col justify-between card-hover-effect">
                <View>
                  <View className="w-full h-40 rounded-[1.5rem] overflow-hidden mb-4 relative img-zoom-container">
                    <Image source={require('./assets/dokumentasi sobat/communication-program.jpeg')} className="w-full h-full object-cover" style={{ width: '100%', height: '100%' }} />
                    <View className="absolute top-2.5 left-2.5 bg-[#162E5C] px-2.5 py-1 rounded-lg">
                      <Text className="text-[9px] font-black text-white">2. Communication</Text>
                    </View>
                  </View>
                  <Text className="text-base font-extrabold text-[#162E5C] mb-1.5">Communication Class</Text>
                  <Text className="text-xs text-gray-600 leading-relaxed mb-4 font-medium">
                    Mengembangkan kemampuan komunikasi, bahasa, dan public speaking anak.
                  </Text>
                </View>
                <View className="flex-row items-center justify-between pt-3 border-t border-gray-100">
                  <Text className="text-[10px] font-bold text-[#5A3B8B]">Usia 2-4 Thn</Text>
                  <Text className="text-xs font-black text-[#D82B5A]">Rp 65.000</Text>
                </View>
              </View>

              {/* 3. Seminar Parenting */}
              <View className="bg-white rounded-[2rem] p-5 border border-gray-100 shadow-sm flex-col justify-between card-hover-effect">
                <View>
                  <View className="w-full h-40 rounded-[1.5rem] overflow-hidden mb-4 relative img-zoom-container">
                    <Image source={require('./assets/dokumentasi sobat/seminarparenting-program.jpeg')} className="w-full h-full object-cover" style={{ width: '100%', height: '100%', objectPosition: 'center 78%' } as any} />
                    <View className="absolute top-2.5 left-2.5 bg-[#162E5C] px-2.5 py-1 rounded-lg">
                      <Text className="text-[9px] font-black text-white">3. Seminar Parenting</Text>
                    </View>
                  </View>
                  <Text className="text-base font-extrabold text-[#162E5C] mb-1.5">Seminar Parenting</Text>
                  <Text className="text-xs text-gray-600 leading-relaxed mb-4 font-medium">
                    Edukasi interaktif bersama para ahli untuk membantu orang tua memahami dan mendampingi tumbuh kembang anak secara optimal.
                  </Text>
                </View>
                <View className="flex-row items-center justify-between pt-3 border-t border-gray-100">
                  <Text className="text-[10px] font-bold text-[#30B864]">Untuk Ortu</Text>
                  <Text className="text-xs font-black text-[#D82B5A]">Rp 49.000</Text>
                </View>
              </View>

              {/* 4. Art & Craft */}
              <View className="bg-white rounded-[2rem] p-5 border border-gray-100 shadow-sm flex-col justify-between card-hover-effect">
                <View>
                  <View className="w-full h-40 rounded-[1.5rem] overflow-hidden mb-4 relative img-zoom-container">
                    <Image source={require('./assets/dokumentasi sobat/program-art.jpeg')} className="w-full h-full object-cover" style={{ width: '100%', height: '100%' }} />
                    <View className="absolute top-2.5 left-2.5 bg-[#162E5C] px-2.5 py-1 rounded-lg">
                      <Text className="text-[9px] font-black text-white">4. Art & Craft</Text>
                    </View>
                  </View>
                  <Text className="text-base font-extrabold text-[#162E5C] mb-1.5">Art and Craft Class</Text>
                  <Text className="text-xs text-gray-600 leading-relaxed mb-4 font-medium">
                    Mengembangkan kreativitas, motorik halus, dan imajinasi.
                  </Text>
                </View>
                <View className="flex-row items-center justify-between pt-3 border-t border-gray-100">
                  <Text className="text-[10px] font-bold text-[#F77712]">Usia 2-5 Thn</Text>
                  <Text className="text-xs font-black text-[#D82B5A]">Rp 79.000</Text>
                </View>
              </View>

              {/* 5. Science Class */}
              <View className="bg-white rounded-[2rem] p-5 border border-gray-100 shadow-sm flex-col justify-between card-hover-effect">
                <View>
                  <View className="w-full h-40 rounded-[1.5rem] overflow-hidden mb-4 relative img-zoom-container">
                    <Image source={require('./assets/dokumentasi sobat/program-science.jpeg')} className="w-full h-full object-cover" style={{ width: '100%', height: '100%' }} />
                    <View className="absolute top-2.5 left-2.5 bg-[#162E5C] px-2.5 py-1 rounded-lg">
                      <Text className="text-[9px] font-black text-white">5. Science Class</Text>
                    </View>
                  </View>
                  <Text className="text-base font-extrabold text-[#162E5C] mb-1.5">Science Class</Text>
                  <Text className="text-xs text-gray-600 leading-relaxed mb-4 font-medium">
                    Eksperimen sains sederhana berbasis STEAM.
                  </Text>
                </View>
                <View className="flex-row items-center justify-between pt-3 border-t border-gray-100">
                  <Text className="text-[10px] font-bold text-[#F77712]">Usia 3-7 Thn</Text>
                  <Text className="text-xs font-black text-[#D82B5A]">Rp 69.000</Text>
                </View>
              </View>

              {/* 6. Pottery Class */}
              <View className="bg-white rounded-[2rem] p-5 border border-gray-100 shadow-sm flex-col justify-between card-hover-effect">
                <View>
                  <View className="w-full h-40 rounded-[1.5rem] overflow-hidden mb-4 relative img-zoom-container">
                    <Image source={require('./assets/dokumentasi sobat/poetry-program.jpeg')} className="w-full h-full object-cover" style={{ width: '100%', height: '100%' }} />
                    <View className="absolute top-2.5 left-2.5 bg-[#162E5C] px-2.5 py-1 rounded-lg">
                      <Text className="text-[9px] font-black text-white">6. Pottery Class</Text>
                    </View>
                  </View>
                  <Text className="text-base font-extrabold text-[#162E5C] mb-1.5">Pottery Class</Text>
                  <Text className="text-xs text-gray-600 leading-relaxed mb-4 font-medium">
                    Mengembangkan kreativitas, konsentrasi, koordinasi tangan, dan regulasi emosi.
                  </Text>
                </View>
                <View className="flex-row items-center justify-between pt-3 border-t border-gray-100">
                  <Text className="text-[10px] font-bold text-[#30B864]">Usia 3-7 Thn</Text>
                  <Text className="text-xs font-black text-[#D82B5A]">Rp 75.000</Text>
                </View>
              </View>

              {/* 7. Cooking Class */}
              <View className="bg-white rounded-[2rem] p-5 border border-gray-100 shadow-sm flex-col justify-between card-hover-effect">
                <View>
                  <View className="w-full h-40 rounded-[1.5rem] overflow-hidden mb-4 relative img-zoom-container">
                    <Image source={require('./assets/dokumentasi sobat/cooking-program.jpeg')} className="w-full h-full object-cover" style={{ width: '100%', height: '100%' }} />
                    <View className="absolute top-2.5 left-2.5 bg-[#162E5C] px-2.5 py-1 rounded-lg">
                      <Text className="text-[9px] font-black text-white">7. Cooking Class</Text>
                    </View>
                  </View>
                  <Text className="text-base font-extrabold text-[#162E5C] mb-1.5">Cooking Class</Text>
                  <Text className="text-xs text-gray-600 leading-relaxed mb-4 font-medium">
                    Melatih kemandirian, life skill, numerasi, dan sensorik.
                  </Text>
                </View>
                <View className="flex-row items-center justify-between pt-3 border-t border-gray-100">
                  <Text className="text-[10px] font-bold text-[#5A3B8B]">Usia 3-7 Thn</Text>
                  <Text className="text-xs font-black text-[#D82B5A]">Rp 85.000</Text>
                </View>
              </View>

              {/* 8. Outbond Ceria */}
              <View className="bg-white rounded-[2rem] p-5 border border-gray-100 shadow-sm flex-col justify-between card-hover-effect">
                <View>
                  <View className="w-full h-40 rounded-[1.5rem] overflow-hidden mb-4 relative img-zoom-container">
                    <Image source={require('./assets/dokumentasi sobat/outbondceria-program.jpeg')} className="w-full h-full object-cover" style={{ width: '100%', height: '100%' }} />
                    <View className="absolute top-2.5 left-2.5 bg-[#162E5C] px-2.5 py-1 rounded-lg">
                      <Text className="text-[9px] font-black text-white">8. Outbond Ceria</Text>
                    </View>
                  </View>
                  <Text className="text-base font-extrabold text-[#162E5C] mb-1.5">Outbond Ceria</Text>
                  <Text className="text-xs text-gray-600 leading-relaxed mb-4 font-medium">
                    Permainan fisik aktif & rintangan motorik kasar anak.
                  </Text>
                </View>
                <View className="flex-row items-center justify-between pt-3 border-t border-gray-100">
                  <Text className="text-[10px] font-bold text-[#2DA9E9]">Usia 2-6 Thn</Text>
                  <Text className="text-xs font-black text-[#D82B5A]">Rp 69.000</Text>
                </View>
              </View>

            </View>

            {/* CTA Button to Full App Catalog */}
            <View className="items-center mt-10">
              <TouchableOpacity
                className="bg-[#D82B5A] px-8 py-3.5 rounded-full shadow-lg hover:bg-[#B01E49] transition-transform active:scale-95 flex-row items-center gap-2"
                onPress={() => setViewMode('app')}
              >
                <Text className="text-white font-extrabold text-xs md:text-sm">Buka Aplikasi & Lihat Selengkapnya</Text>
                <Feather name="arrow-right" size={16} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </ScrollRevealSection>

          {/* SECTION: SCREENING STPPA DIGITAL (Preview Sekilas Teaser) */}
          <ScrollRevealSection className="max-w-7xl mx-auto px-4 md:px-12 py-12 md:py-16">
            <View id="screening-stppa" nativeID="screening-stppa" className="bg-white rounded-[2.5rem] p-8 md:p-14 border-2 border-[#2DA9E9]/30 shadow-md flex-col md:flex-row items-center gap-10 card-hover-effect">
              <View className="flex-1">
                <View className="bg-[#2DA9E9]/15 self-start px-3.5 py-1 rounded-full mb-3 border border-[#2DA9E9]/30">
                  <Text className="text-[#2DA9E9] text-[11px] font-black uppercase tracking-wider">Fitur Aplikasi Terpadu</Text>
                </View>
                <Text className="text-2xl md:text-4xl font-extrabold text-[#162E5C] mb-4">
                  Screening STPPA Digital Si Kecil
                </Text>
                <Text className="text-xs md:text-sm text-gray-600 leading-relaxed font-medium mb-6">
                  Pantau 6 Aspek Perkembangan Anak Usia 2–7 Tahun (Agama & Moral, Motorik, Kognitif, Bahasa, Sosial-Emosional, Seni) secara berkala dan terukur langsung dari smartphone Anda.
                </Text>
                <TouchableOpacity
                  className="bg-[#2DA9E9] px-7 py-3 rounded-full shadow-md hover:bg-[#1E8EC7] transition-transform active:scale-95 self-start flex-row items-center gap-2"
                  onPress={() => setViewMode('app')}
                >
                  <Text className="text-white font-extrabold text-xs md:text-sm">Coba Fitur Screening di Aplikasi</Text>
                  <Feather name="arrow-right" size={16} color="#FFFFFF" />
                </TouchableOpacity>
              </View>

              {/* Visual Card Preview */}
              <View className="w-full md:w-2/5 bg-[#F0F8FF] rounded-[2rem] p-6 border border-[#2DA9E9]/20 shadow-sm flex-col gap-3">
                <View className="flex-row justify-between items-center bg-white p-3 rounded-xl border border-gray-100 shadow-xs">
                  <Text className="text-xs font-bold text-[#162E5C]">Sensorik & Motorik Halus</Text>
                  <Text className="text-xs font-black text-[#30B864]">Optimal (88%)</Text>
                </View>
                <View className="flex-row justify-between items-center bg-white p-3 rounded-xl border border-gray-100 shadow-xs">
                  <Text className="text-xs font-bold text-[#162E5C]">Komunikasi & Kosa Kata</Text>
                  <Text className="text-xs font-black text-[#2DA9E9]">Sangat Baik (92%)</Text>
                </View>
                <View className="flex-row justify-between items-center bg-white p-3 rounded-xl border border-gray-100 shadow-xs">
                  <Text className="text-xs font-bold text-[#162E5C]">Kemandirian & Sosialisasi</Text>
                  <Text className="text-xs font-black text-[#F77712]">Perlu Stimulasi</Text>
                </View>
              </View>
            </View>
          </ScrollRevealSection>

          {/* SECTION: WORKSHEET GRATIS PRINTABLE (Preview Sekilas Teaser) */}
          <ScrollRevealSection className="max-w-7xl mx-auto px-4 md:px-12 py-12 md:py-16">
            <View id="worksheet-gratis" nativeID="worksheet-gratis" className="bg-[#5A3B8B] rounded-[2.5rem] p-8 md:p-14 text-white shadow-xl flex-col md:flex-row items-center gap-10 card-solid-hover">
              <View className="flex-1">
                <View className="bg-white/20 self-start px-3.5 py-1 rounded-full mb-3 border border-white/30">
                  <Text className="text-[#FFD100] text-[11px] font-black uppercase tracking-wider">Gratis Printable Material</Text>
                </View>
                <Text className="text-2xl md:text-4xl font-extrabold text-white mb-4">
                  Lembar Kerja & Worksheet Digital Gratis
                </Text>
                <Text className="text-xs md:text-sm text-gray-200 leading-relaxed font-medium mb-6">
                  Unduh ratusan lembar kerja interaktif siap cetak untuk pengayaan belajar anak di rumah (Latihan Gunting-Tempel, Tracing Huruf & Angka, Mewarnai, dan Modul Sensori).
                </Text>
                <TouchableOpacity
                  className="bg-[#FFD100] px-7 py-3 rounded-full shadow-md hover:bg-[#E6BC00] transition-transform active:scale-95 self-start flex-row items-center gap-2"
                  onPress={() => setViewMode('app')}
                >
                  <Text className="text-[#162E5C] font-extrabold text-xs md:text-sm">Unduh Worksheet di Aplikasi</Text>
                  <Feather name="download" size={16} color="#162E5C" />
                </TouchableOpacity>
              </View>

              {/* Visual Preview Badge */}
              <View className="w-full md:w-2/5 bg-white/10 rounded-[2rem] p-6 border border-white/20 flex-col gap-3">
                <View className="flex-row items-center gap-3 bg-white/15 p-3 rounded-xl">
                  <Feather name="file-text" size={20} color="#FFD100" />
                  <View>
                    <Text className="text-xs font-extrabold text-white">Worksheet Motorik Halus</Text>
                    <Text className="text-[10px] text-gray-300">Format Printable PDF High Res</Text>
                  </View>
                </View>
                <View className="flex-row items-center gap-3 bg-white/15 p-3 rounded-xl">
                  <Feather name="edit-3" size={20} color="#30B864" />
                  <View>
                    <Text className="text-xs font-extrabold text-white">Tracing Alphabet & Angka</Text>
                    <Text className="text-[10px] text-gray-300">Stimulasi Pra-Membaca & Menulis</Text>
                  </View>
                </View>
              </View>
            </View>
          </ScrollRevealSection>

          {/* SECTION 6: FASILITAS & FITUR EKOSISTEM (Interactive Hover Cards) */}
          <ScrollRevealSection className="max-w-7xl mx-auto px-4 md:px-12 py-12 md:py-16">
            <View className="text-center mb-12">
              <Text className="text-[#D82B5A] text-lg font-serif italic mb-1">Fasilitas</Text>
              <Text className="text-2xl md:text-4xl font-extrabold text-[#162E5C]">
                Layanan & Fitur Unggulan Sobat Ceria
              </Text>
            </View>

            <View className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Facility 1 */}
              <View className="bg-white p-7 rounded-[2rem] border border-gray-100 shadow-sm flex-row items-start gap-5 card-hover-effect">
                <View className="w-12 h-12 rounded-2xl bg-[#5A3B8B]/15 items-center justify-center shrink-0">
                  <Feather name="users" size={24} color="#5A3B8B" />
                </View>
                <View className="flex-1">
                  <Text className="text-base font-extrabold text-[#162E5C] mb-1">Kelas Tatap Muka</Text>
                  <Text className="text-xs text-gray-600 leading-relaxed font-medium">
                    Lingkungan belajar nyaman dengan jumlah anak terbatas sehingga setiap anak memperoleh perhatian yang optimal.
                  </Text>
                </View>
              </View>

              {/* Facility 2 */}
              <View className="bg-white p-7 rounded-[2rem] border border-gray-100 shadow-sm flex-row items-start gap-5 card-hover-effect">
                <View className="w-12 h-12 rounded-2xl bg-[#D82B5A]/15 items-center justify-center shrink-0">
                  <Feather name="gift" size={24} color="#D82B5A" />
                </View>
                <View className="flex-1">
                  <Text className="text-base font-extrabold text-[#162E5C] mb-1">Learning Kit</Text>
                  <Text className="text-xs text-gray-600 leading-relaxed font-medium">
                    Setiap peserta memperoleh learning kit sesuai tema pembelajaran yang dapat digunakan selama kegiatan maupun dibawa pulang untuk melanjutkan stimulasi di rumah.
                  </Text>
                </View>
              </View>

              {/* Facility 3 */}
              <View className="bg-white p-7 rounded-[2rem] border border-gray-100 shadow-sm flex-row items-start gap-5 card-hover-effect">
                <View className="w-12 h-12 rounded-2xl bg-[#2DA9E9]/15 items-center justify-center shrink-0">
                  <Feather name="activity" size={24} color="#2DA9E9" />
                </View>
                <View className="flex-1">
                  <Text className="text-base font-extrabold text-[#162E5C] mb-1">Screening Tumbuh Kembang</Text>
                  <Text className="text-xs text-gray-600 leading-relaxed font-medium">
                    Seluruh peserta mendapatkan screening perkembangan menggunakan instrumen observasi berdasarkan STPPA sehingga orang tua mengetahui capaian perkembangan anak secara objektif.
                  </Text>
                </View>
              </View>

              {/* Facility 4 */}
              <View className="bg-white p-7 rounded-[2rem] border border-gray-100 shadow-sm flex-row items-start gap-5 card-hover-effect">
                <View className="w-12 h-12 rounded-2xl bg-[#30B864]/15 items-center justify-center shrink-0">
                  <Feather name="message-circle" size={24} color="#30B864" />
                </View>
                <View className="flex-1">
                  <Text className="text-base font-extrabold text-[#162E5C] mb-1">Konsultasi Psikolog</Text>
                  <Text className="text-xs text-gray-600 leading-relaxed font-medium">
                    Orang tua memperoleh kesempatan konsultasi bersama psikolog atau tenaga profesional mengenai hasil perkembangan serta strategi stimulasi lanjutan.
                  </Text>
                </View>
              </View>

              {/* Facility 5 */}
              <View className="bg-white p-7 rounded-[2rem] border border-gray-100 shadow-sm flex-row items-start gap-5 card-hover-effect">
                <View className="w-12 h-12 rounded-2xl bg-[#F77712]/15 items-center justify-center shrink-0">
                  <Feather name="home" size={24} color="#F77712" />
                </View>
                <View className="flex-1">
                  <Text className="text-base font-extrabold text-[#162E5C] mb-1">Ruangan Ramah Anak</Text>
                  <Text className="text-xs text-gray-600 leading-relaxed font-medium">
                    Area bermain yang aman, bersih, nyaman, dan dirancang sesuai kebutuhan anak usia dini.
                  </Text>
                </View>
              </View>
            </View>
          </ScrollRevealSection>

          {/* SECTION 7: KEUNGGULAN KAMI (Interactive Solid Lift Cards) */}
          <ScrollRevealSection className="max-w-7xl mx-auto px-4 md:px-12 py-12 md:py-16">
            <View className="text-center mb-12">
              <Text className="text-[#D82B5A] text-lg font-serif italic mb-1">Keunggulan Kami</Text>
              <Text className="text-2xl md:text-4xl font-extrabold text-[#162E5C]">
                Mengapa Memilih Sobat Ceria Fun Learning
              </Text>
            </View>

            <View className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Card 1: Kurikulum Terpersonalisasi */}
              <View className="bg-[#F77712] rounded-[2.5rem] p-8 text-white shadow-md flex-col justify-between min-h-[240px] card-solid-hover">
                <View>
                  <Text className="text-xl font-black text-white mb-3">Kurikulum Terpersonalisasi berbasis STPPA</Text>
                  <Text className="text-xs text-white/95 leading-relaxed font-medium">
                    Program disusun sesuai indikator perkembangan nasional sehingga setiap aktivitas memiliki tujuan perkembangan yang jelas.
                  </Text>
                </View>
                <View className="w-10 h-10 rounded-full bg-white/20 items-center justify-center self-end mt-4">
                  <Feather name="book-open" size={20} color="#FFFFFF" />
                </View>
              </View>

              {/* Card 2: Free Screening Tumbuh Kembang */}
              <View className="bg-[#5A3B8B] rounded-[2.5rem] p-8 text-white shadow-md flex-col justify-between min-h-[240px] card-solid-hover">
                <View>
                  <Text className="text-xl font-black text-white mb-3">Free Screening Tumbuh Kembang</Text>
                  <Text className="text-xs text-white/95 leading-relaxed font-medium">
                    Monitoring perkembangan anak dilakukan secara berkala agar orang tua mengetahui potensi maupun area yang perlu distimulasi.
                  </Text>
                </View>
                <View className="w-10 h-10 rounded-full bg-white/20 items-center justify-center self-end mt-4">
                  <Feather name="activity" size={20} color="#FFFFFF" />
                </View>
              </View>

              {/* Card 3: Konsultasi Psikolog */}
              <View className="bg-[#D82B5A] rounded-[2.5rem] p-8 text-white shadow-md flex-col justify-between min-h-[240px] card-solid-hover">
                <View>
                  <Text className="text-xl font-black text-white mb-3">Konsultasi Psikolog</Text>
                  <Text className="text-xs text-white/95 leading-relaxed font-medium">
                    Voucher konsultasi psikolog diberikan sesuai paket tertentu sebagai follow up bagi orang tua.
                  </Text>
                </View>
                <View className="w-10 h-10 rounded-full bg-white/20 items-center justify-center self-end mt-4">
                  <Feather name="message-circle" size={20} color="#FFFFFF" />
                </View>
              </View>

              {/* Card 4: Inklusif */}
              <View className="bg-[#30B864] rounded-[2.5rem] p-8 text-white shadow-md flex-col justify-between min-h-[240px] card-solid-hover">
                <View>
                  <Text className="text-xl font-black text-white mb-3">Inklusif</Text>
                  <Text className="text-xs text-white/95 leading-relaxed font-medium">
                    Seluruh anak mendapatkan kesempatan belajar bersama tanpa diskriminasi.
                  </Text>
                </View>
                <View className="w-10 h-10 rounded-full bg-white/20 items-center justify-center self-end mt-4">
                  <Feather name="heart" size={20} color="#FFFFFF" />
                </View>
              </View>

              {/* Card 5: Mindfulness Activity */}
              <View className="bg-[#2DA9E9] rounded-[2.5rem] p-8 text-white shadow-md flex-col justify-between min-h-[240px] card-solid-hover">
                <View>
                  <Text className="text-xl font-black text-white mb-3">Mindfulness Activity</Text>
                  <Text className="text-xs text-white/95 leading-relaxed font-medium">
                    Melatih fokus, regulasi emosi, serta kemampuan mengelola diri sejak dini.
                  </Text>
                </View>
                <View className="w-10 h-10 rounded-full bg-white/20 items-center justify-center self-end mt-4">
                  <Feather name="wind" size={20} color="#FFFFFF" />
                </View>
              </View>

              {/* Card 6: Family Co-Creation */}
              <View className="bg-[#162E5C] rounded-[2.5rem] p-8 text-white shadow-md flex-col justify-between min-h-[240px] card-solid-hover">
                <View>
                  <Text className="text-xl font-black text-white mb-3">Family Co-Creation</Text>
                  <Text className="text-xs text-white/95 leading-relaxed font-medium">
                    Orang tua dilibatkan dalam proses pembelajaran agar stimulasi tetap berlanjut di rumah.
                  </Text>
                </View>
                <View className="w-10 h-10 rounded-full bg-white/20 items-center justify-center self-end mt-4">
                  <Feather name="users" size={20} color="#FFFFFF" />
                </View>
              </View>
            </View>
          </ScrollRevealSection>

          {/* SECTION: PROGRAM KOLABORASI / MITRA SOBAT CERIA */}
          <ScrollRevealSection className="max-w-7xl mx-auto px-4 md:px-12 py-12 md:py-16">
            <View className="text-center mb-12">
              <Text className="text-[#D82B5A] text-lg font-serif italic mb-1">Program Kolaborasi</Text>
              <Text className="text-2xl md:text-4xl font-extrabold text-[#162E5C]">
                Mitra Sobat Ceria
              </Text>
              <Text className="text-xs md:text-sm text-gray-500 font-medium mt-3 max-w-2xl mx-auto">
                Bersama sekolah, komunitas, dan mitra usaha terpercaya dalam mendampingi tumbuh kembang anak Indonesia.
              </Text>
            </View>

            {/* Mitra Slider Grid */}
            <View className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-6 md:p-10">
              <View className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {[
                  'TK Intan Permata',
                  'TK Aisyiyah Kampung Sewu',
                  'TK Alam Surya Mentari',
                  'Bebimart',
                  'TK Bintangku',
                  'TK IT Al Muhsin Klaten',
                ].map((mitra) => (
                  <View
                    key={mitra}
                    className="bg-[#FAF6F0] border border-gray-100 rounded-2xl px-4 py-5 items-center justify-center min-h-[90px] text-center card-hover-effect"
                  >
                    <Feather name="award" size={22} color="#D82B5A" className="mb-2" />
                    <Text className="text-[11px] font-extrabold text-[#162E5C] text-center leading-snug">
                      {mitra}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </ScrollRevealSection>

          {/* SECTION 8: KATA ORANG TUA (Interactive Testimonial Card) */}
          <ScrollRevealSection className="max-w-7xl mx-auto px-4 md:px-12 py-12 md:py-16">
            <View className="text-center mb-12">
              <Text className="text-[#D82B5A] text-lg font-serif italic mb-1">Kata Orang Tua</Text>
              <Text className="text-2xl md:text-4xl font-extrabold text-[#162E5C]">
                Tentang Sobat Ceria
              </Text>
            </View>

            <View className="max-w-3xl mx-auto bg-white rounded-[2.5rem] p-8 md:p-12 border-2 border-[#5A3B8B]/40 shadow-sm relative card-hover-effect">
              <View className="flex-row gap-1 mb-4">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Feather key={s} name="star" size={16} color="#FFD100" />
                ))}
              </View>

              <Text className="text-base md:text-lg font-medium text-[#162E5C] leading-relaxed mb-6">
                {currentTestimonial.text}
              </Text>

              <View className="flex-row items-center justify-between pt-6 border-t border-gray-100">
                <View className="flex-row items-center gap-4">
                  <Image
                    source={{ uri: currentTestimonial.avatar }}
                    className="w-12 h-12 rounded-full border-2 border-[#5A3B8B]"
                    style={{ width: 48, height: 48, borderRadius: 24 }}
                  />
                  <View>
                    <Text className="font-extrabold text-[#162E5C] text-sm">{currentTestimonial.name}</Text>
                    <Text className="text-xs text-[#D82B5A] font-bold mt-0.5">{currentTestimonial.role}</Text>
                  </View>
                </View>

                {/* Controls */}
                <View className="flex-row gap-2">
                  <TouchableOpacity
                    className="w-10 h-10 rounded-full border border-gray-200 bg-white items-center justify-center hover:bg-gray-50 shadow-sm transition-transform active:scale-95"
                    onPress={prevTestimonial}
                  >
                    <Feather name="arrow-left" size={16} color="#162E5C" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    className="w-10 h-10 rounded-full bg-[#D82B5A] items-center justify-center hover:bg-[#B01E49] shadow-sm transition-transform active:scale-95"
                    onPress={nextTestimonial}
                  >
                    <Feather name="arrow-right" size={16} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </ScrollRevealSection>

          {/* SECTION 9: FORMULIR PENDAFTARAN (Interactive Form Card) */}
          <ScrollRevealSection className="max-w-4xl mx-auto px-4 md:px-12 py-12 md:py-16">
            <View className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-md border border-gray-100 card-hover-effect">
              <View className="text-center mb-8">
                <Text className="text-[#D82B5A] text-lg font-serif italic mb-1">Daftar Sekarang</Text>
                <Text className="text-2xl md:text-3xl font-extrabold text-[#162E5C] mb-2">
                  Nikmati Pembelajaran Menyenangkan & Bermakna
                </Text>
                <Text className="text-xs text-gray-500 font-medium">
                  Isi formulir di bawah ini untuk memulai stimulasi tumbuh kembang si kecil.
                </Text>
              </View>

              <View className="flex-col gap-4">
                <View>
                  <Text className="text-xs font-bold text-gray-700 mb-1.5">Nama Orang Tua *</Text>
                  <View className="bg-gray-50 border border-gray-200 rounded-full px-4 py-3">
                    <Text className="text-xs text-gray-400">Contoh: Bunda Dinda</Text>
                  </View>
                </View>

                <View className="flex-col md:flex-row gap-4">
                  <View className="flex-1">
                    <Text className="text-xs font-bold text-gray-700 mb-1.5">Nomor WhatsApp *</Text>
                    <View className="bg-gray-50 border border-gray-200 rounded-full px-4 py-3">
                      <Text className="text-xs text-gray-400">+62 812-3456-7890</Text>
                    </View>
                  </View>
                  <View className="flex-1">
                    <Text className="text-xs font-bold text-gray-700 mb-1.5">Nama & Usia Anak *</Text>
                    <View className="bg-gray-50 border border-gray-200 rounded-full px-4 py-3">
                      <Text className="text-xs text-gray-400">Contoh: Arka (4 Tahun)</Text>
                    </View>
                  </View>
                </View>

                <View>
                  <Text className="text-xs font-bold text-gray-700 mb-1.5">Pilihan Program Kelas *</Text>
                  <View className="bg-gray-50 border border-gray-200 rounded-full px-4 py-3 flex-row justify-between items-center">
                    <Text className="text-xs text-gray-700 font-semibold">Mini Stimulation / Sensory Class</Text>
                    <Feather name="chevron-down" size={16} color="#6B7280" />
                  </View>
                </View>

                <TouchableOpacity
                  className="bg-[#D82B5A] py-3.5 rounded-full items-center justify-center shadow-md hover:bg-[#B01E49] transition-transform active:scale-98 hover:shadow-lg mt-4"
                  onPress={() => setViewMode('app')}
                >
                  <Text className="text-white font-extrabold text-sm tracking-wide">Kirim Pendaftaran</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollRevealSection>

          {/* SECTION 10: FOOTER (Clean White/Navy Layout + Sosmed Official) */}
          <View className="bg-[#162E5C] py-12 px-6 md:px-16 border-t border-[#162E5C] mt-8">
            <View className="max-w-7xl mx-auto flex-col md:flex-row justify-between items-start gap-8 mb-8">
              <View className="max-w-xs">
                <View className="flex-row items-center gap-2.5 mb-3">
                  <View className="w-8 h-8 rounded-full overflow-hidden bg-white p-0.5 border border-white/20 items-center justify-center">
                    <Image
                      source={logoImg}
                      style={{ width: '100%', height: '100%', borderRadius: 999 }}
                      resizeMode="contain"
                    />
                  </View>
                  <Text className="text-lg font-black text-white tracking-wider">SOBAT CERIA</Text>
                </View>
                <Text className="text-xs text-gray-300 leading-relaxed font-medium">
                  Platform terpadu stimulasi tumbuh kembang anak usia 2-7 tahun, kelas edukasi interaktif, serta pendampingan orang tua berdaya.
                </Text>
              </View>

              <View className="flex-row flex-wrap gap-12">
                <View>
                  <Text className="text-xs font-black text-white uppercase tracking-widest mb-3">Navigasi</Text>
                  <Text className="text-xs text-gray-300 mb-2">Beranda</Text>
                  <Text className="text-xs text-gray-300 mb-2">Tentang Kami</Text>
                  <Text className="text-xs text-gray-300">Katalog Kelas</Text>
                </View>
                <View>
                  <Text className="text-xs font-black text-white uppercase tracking-widest mb-3">Fitur Platform</Text>
                  <Text className="text-xs text-gray-300 mb-2">Screening STPPA</Text>
                  <Text className="text-xs text-gray-300 mb-2">Lembar Worksheet</Text>
                  <Text className="text-xs text-gray-300">Voucher Repeat Order</Text>
                </View>
                <View>
                  <Text className="text-xs font-black text-white uppercase tracking-widest mb-3">Lokasi & Kontak</Text>
                  <Text className="text-xs text-gray-300 mb-2 font-medium max-w-[220px]">
                    Lab Tumbuh Kembang FKIP UMS Lantai 2, Jl. A. Yani Tromol Pos 1 Pabelan, Sukoharjo
                  </Text>
                  <Text className="text-xs text-gray-300 mb-2">WhatsApp: +62 858-7633-2598</Text>
                  <Text className="text-xs text-gray-300 mb-3">Email: sobatceria25@gmail.com</Text>

                  {/* Official Colored Social Media Logos (Instagram & TikTok) */}
                  <View className="flex-row items-center gap-3 mt-1.5">
                    {/* Official Instagram Gradient Logo */}
                    <TouchableOpacity
                      className="w-9 h-9 rounded-xl items-center justify-center shadow-md transition-transform hover:scale-110"
                      style={{
                        backgroundImage: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
                      } as any}
                      onPress={() => Linking.openURL('https://www.instagram.com/sobatceria__?igsh=ZzFmMW5jcXZ6ampp')}
                    >
                      <Feather name="instagram" size={20} color="#FFFFFF" />
                    </TouchableOpacity>

                    {/* Official TikTok Logo */}
                    <TouchableOpacity
                      className="w-9 h-9 rounded-xl bg-black items-center justify-center shadow-md transition-transform hover:scale-110 border border-gray-800 p-1.5"
                      onPress={() => Linking.openURL('https://www.instagram.com/sobatceria__?igsh=ZzFmMW5jcXZ6ampp')}
                    >
                      <Image
                        source={{ uri: 'https://cdn-icons-png.flaticon.com/512/3046/3046124.png' }}
                        style={{ width: 22, height: 22 }}
                        resizeMode="contain"
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>

            <View className="max-w-7xl mx-auto pt-6 border-t border-white/15 flex-col md:flex-row justify-between items-center gap-4">
              <Text className="text-[10px] text-gray-400 font-medium">
                © 2026 SOBAT CERIA. Seluruh Hak Cipta Dilindungi. Didesain penuh cinta untuk tumbuh kembang si kecil.
              </Text>
              <Text className="text-[10px] text-gray-400 font-medium">
                Solo Raya, Jawa Tengah, Indonesia
              </Text>
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaProvider>
  );
}
