import React, { useState, useEffect, useMemo } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View, Text, TouchableOpacity, ScrollView, Platform, Dimensions, Image, Linking } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Feather } from '@expo/vector-icons';
import { supabase } from './lib/supabase';
import { fetchUserProfile, clearProfileRole } from './lib/profile';
import { fetchCourses } from './lib/data';
import { LANDING_TEXT, LandingLang } from './lib/i18n';
import { syncProfileToSheet } from './lib/sheets';

const logoImg = require('./assets/sobatceria.png');

// Import Screens (Auth)
import LoginScreen from './screens/auth/LoginScreen';
import RoleSelectionScreen from './screens/auth/RoleSelectionScreen';
import RoleRegisterModal from './screens/auth/RoleRegisterModal';
import PendingApprovalScreen from './screens/auth/PendingApprovalScreen';

// Import Screens (Orang Tua)
import ParentDashboard from './screens/parent/ParentDashboard';

// Import Screens (Role Lainnya)
import VolunteerDashboard from './screens/volunteer/VolunteerDashboard';
import TeacherDashboard from './screens/teacher/TeacherDashboard';
import CollaborationDashboard from './screens/collaboration/CollaborationDashboard';
import PartnerDashboard from './screens/partner/PartnerDashboard';
import AdminDashboard from './screens/admin/AdminDashboard';

// Import Types
import { UserProfile, Course } from './types';

// Mapping foto lokal resmi untuk 8 program default agar tampilan tetap tajam saat dipakai bersama Supabase
const LOCAL_COURSE_IMAGES: { match: RegExp; src: any }[] = [
  { match: /mini\s*stimulation/i, src: require('./assets/dokumentasi sobat/ministimulation-program.jpeg') },
  { match: /communication/i, src: require('./assets/dokumentasi sobat/communication-program.jpeg') },
  { match: /parenting|seminar/i, src: require('./assets/dokumentasi sobat/seminarparenting-program.jpeg') },
  { match: /art/i, src: require('./assets/dokumentasi sobat/program-art.jpeg') },
  { match: /science/i, src: require('./assets/dokumentasi sobat/program-science.jpeg') },
  { match: /pottery|poetry/i, src: require('./assets/dokumentasi sobat/poetry-program.jpeg') },
  { match: /cooking/i, src: require('./assets/dokumentasi sobat/cooking-program.jpeg') },
  { match: /outbond|sensory\s*&\s*movement/i, src: require('./assets/dokumentasi sobat/outbondceria-program.jpeg') },
];

const DEFAULT_LANDING_COURSES: Course[] = [
  { id: 'def-1', title: 'Mini Stimulation Class', category: 'Mini Stimulation', ageRange: 'Usia 2-3 Thn', price: 59000, seats: 12, image: '', description: 'Melatih seluruh aspek perkembangan melalui permainan edukatif.' },
  { id: 'def-2', title: 'Communication Class', category: 'Communication', ageRange: 'Usia 2-4 Thn', price: 65000, seats: 4, image: '', description: 'Mengembangkan kemampuan komunikasi, bahasa, dan public speaking anak.' },
  { id: 'def-3', title: 'Seminar Parenting', category: 'Parenting', ageRange: 'Untuk Ortu', price: 49000, seats: 25, image: '', description: 'Edukasi interaktif bersama para ahli untuk membantu orang tua memahami dan mendampingi tumbuh kembang anak secara optimal.' },
  { id: 'def-4', title: 'Art and Craft Class', category: 'Art & Craft', ageRange: 'Usia 2-5 Thn', price: 79000, seats: 8, image: '', description: 'Mengembangkan kreativitas, motorik halus, dan imajinasi.' },
  { id: 'def-5', title: 'Science Class', category: 'Science Class', ageRange: 'Usia 3-7 Thn', price: 69000, seats: 15, image: '', description: 'Eksperimen sains sederhana berbasis STEAM.' },
  { id: 'def-6', title: 'Pottery Class', category: 'Pottery Class', ageRange: 'Usia 3-7 Thn', price: 75000, seats: 6, image: '', description: 'Mengembangkan kreativitas, konsentrasi, koordinasi tangan, dan regulasi emosi.' },
  { id: 'def-7', title: 'Cooking Class', category: 'Cooking Class', ageRange: 'Usia 3-7 Thn', price: 85000, seats: 10, image: '', description: 'Melatih kemandirian, life skill, numerasi, dan sensorik.' },
  { id: 'def-8', title: 'Outbond Ceria', category: 'Outbond Ceria', ageRange: 'Usia 2-6 Thn', price: 69000, seats: 12, image: '', description: 'Permainan fisik aktif & rintangan motorik kasar anak.' },
];

const AGE_COLORS = ['#2DA9E9', '#5A3B8B', '#30B864', '#F77712'];

function resolveCourseImage(course: Course): any | null {
  const img = (course.image || '').trim();
  // Jika Admin mengisi URL foto custom (bukan URL placeholder unsplash bawaan seed), pakai URL tersebut
  if (img && !img.includes('images.unsplash.com')) {
    return { uri: img };
  }
  const haystack = `${course.title} ${course.category}`;
  const matched = LOCAL_COURSE_IMAGES.find((m) => m.match.test(haystack));
  if (matched) return matched.src;
  if (img) return { uri: img };
  return null;
}

// --- ROLE-BASED DASHBOARD ROUTER ---
function RoleDashboard({ user, setUser }: { user: UserProfile; setUser: (u: UserProfile | null) => void }) {
  const onLogout = () => setUser(null);

  const onSwitchRole = async () => {
    try {
      const { data } = await supabase.auth.getUser();
      if (data.user) await clearProfileRole(data.user.id);
    } catch {
      // best-effort: tetap lanjutkan ke pemilihan role
    }
    setUser({ ...user, role: null });
  };

  switch (user.role) {
    case 'volunteer':
      return <VolunteerDashboard user={user} onLogout={onLogout} onSwitchRole={onSwitchRole} />;
    case 'teacher':
      return <TeacherDashboard user={user} onLogout={onLogout} onSwitchRole={onSwitchRole} />;
    case 'collaboration':
      return <CollaborationDashboard user={user} onLogout={onLogout} onSwitchRole={onSwitchRole} />;
    case 'partner':
      return <PartnerDashboard user={user} onLogout={onLogout} onSwitchRole={onSwitchRole} />;
    case 'admin':
      return <AdminDashboard user={user} onLogout={onLogout} onSwitchRole={onSwitchRole} />;
    case 'parent':
    default:
      return <ParentDashboard user={user} setUser={setUser} onSwitchRole={onSwitchRole} />;
  }
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
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [roleRegisterTarget, setRoleRegisterTarget] = useState<'volunteer' | 'teacher' | 'collaboration' | 'partner' | null>(null);
  const [landingCourses, setLandingCourses] = useState<Course[]>(DEFAULT_LANDING_COURSES);
  const [lang, setLang] = useState<LandingLang>(() => {
    if (Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
      const saved = window.localStorage.getItem('sc_lang');
      if (saved === 'en' || saved === 'id' || saved === 'th') return saved;
    }
    return 'id';
  });

  const handleChangeLang = (nextLang: LandingLang) => {
    setLang(nextLang);
    if (Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem('sc_lang', nextLang);
    }
  };

  const t = LANDING_TEXT[lang];

  // Muat daftar kelas aktif dari Supabase untuk katalog web awal setiap kali masuk landing view
  useEffect(() => {
    if (viewMode !== 'landing') return;
    let active = true;
    fetchCourses()
      .then((list) => {
        if (active && list && list.length > 0) {
          setLandingCourses(list);
        }
      })
      .catch(() => {
        // pertahankan fallback default jika offline
      });
    return () => {
      active = false;
    };
  }, [viewMode]);

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

  // --- RENDER FULL WEB APP MODE (Full-Width Web Layout) ---
  if (viewMode === 'app') {
    return (
      <SafeAreaProvider>
        <StatusBar style="dark" />
        <View className="flex-1 bg-brand-cream relative">
          {/* Main App Workspace (full-width web layout) */}
          <View className="flex-1 w-full bg-brand-cream">
            {/* Wajib login dulu sebelum masuk aplikasi */}
            {!user ? (
              <LoginScreen
                onLogin={(profile) => setUser(profile)}
                onBack={() => setViewMode('landing')}
              />
            ) : !user.role ? (
              <RoleSelectionScreen user={user} onSelect={(role) => setUser({ ...user, role })} />
            ) : user.status === 'pending' ? (
              <PendingApprovalScreen
                user={user}
                onLogout={async () => {
                  await supabase.auth.signOut().catch(() => {});
                  setUser(null);
                }}
                onStatusUpdated={(updated) => setUser(updated)}
              />
            ) : (
              <RoleDashboard user={user} setUser={setUser} />
            )}
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

          {/* Nav Menu Desktop (Utama: Tentang Kami, Aplikasi Screening, Class Toolkit, Join Us) */}
          {isDesktop && (
            <View className="flex-row items-center gap-8">
              <TouchableOpacity onPress={() => scrollToSection('tentang-kami')}>
                <Text className="text-sm font-bold text-gray-700 hover:text-[#D82B5A] transition">{t.nav.about}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => scrollToSection('screening-stppa')}>
                <Text className="text-sm font-bold text-gray-700 hover:text-[#D82B5A] transition">{t.nav.screening}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => scrollToSection('class-toolkit')}>
                <Text className="text-sm font-bold text-gray-700 hover:text-[#D82B5A] transition">{t.nav.toolkit}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => scrollToSection('join-us')}>
                <Text className="text-sm font-bold text-gray-700 hover:text-[#D82B5A] transition">{t.nav.joinUs}</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Right Header Controls: Language Switcher + Menu Toggle */}
          <View className="flex-row items-center gap-2.5 shrink-0">
            <View className="flex-row items-center bg-gray-100 rounded-full p-1 border border-gray-200/80">
              <Feather name="globe" size={12} color="#162E5C" style={{ marginLeft: 6, marginRight: 3 }} />
              <TouchableOpacity
                onPress={() => handleChangeLang('id')}
                className={`px-2 py-1 rounded-full transition ${lang === 'id' ? 'bg-white shadow-xs' : ''}`}
              >
                <Text className={`text-[11px] font-black ${lang === 'id' ? 'text-[#162E5C]' : 'text-gray-500'}`}>ID</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleChangeLang('en')}
                className={`px-2 py-1 rounded-full transition ${lang === 'en' ? 'bg-white shadow-xs' : ''}`}
              >
                <Text className={`text-[11px] font-black ${lang === 'en' ? 'text-[#D82B5A]' : 'text-gray-500'}`}>EN</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleChangeLang('th')}
                className={`px-2 py-1 rounded-full transition ${lang === 'th' ? 'bg-white shadow-xs' : ''}`}
              >
                <Text className={`text-[11px] font-black ${lang === 'th' ? 'text-[#5A3B8B]' : 'text-gray-500'}`}>TH</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              className="bg-[#D82B5A] px-5 py-2.5 rounded-full shadow-md items-center justify-center hover:bg-[#B01E49] transition shrink-0 flex-row items-center gap-2"
              onPress={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Feather name={isMenuOpen ? "x" : "menu"} size={16} color="#FFFFFF" />
              <Text className="text-white font-extrabold text-xs md:text-sm tracking-wide">{t.nav.menu}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* DROPDOWN / FULL NAV OPTIONS MENU */}
        {isMenuOpen && (
          <>
            {/* Backdrop overlay for closing on click outside */}
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => setIsMenuOpen(false)}
              style={{
                position: 'fixed' as any,
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(15, 23, 42, 0.35)',
                zIndex: 60,
              }}
            />

            {/* Menu Popover Container */}
            <View
              style={{
                position: 'fixed' as any,
                top: 68,
                right: isDesktop ? 64 : 16,
                zIndex: 70,
                maxWidth: 360,
                width: '90%',
              }}
              className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-5 overflow-hidden"
            >
              {/* Header inside Menu */}
              <View className="flex-row items-center justify-between pb-3 border-b border-gray-100 mb-2">
                <View className="flex-row items-center gap-2">
                  <View className="w-7 h-7 rounded-full bg-[#D82B5A]/10 items-center justify-center">
                    <Feather name="grid" size={14} color="#D82B5A" />
                  </View>
                  <Text className="text-xs font-black text-[#162E5C] tracking-wide uppercase">{t.menu.title}</Text>
                </View>
                <TouchableOpacity
                  onPress={() => setIsMenuOpen(false)}
                  className="w-7 h-7 rounded-full bg-gray-100 items-center justify-center hover:bg-gray-200"
                >
                  <Feather name="x" size={14} color="#6B7280" />
                </TouchableOpacity>
              </View>

              {/* Menu Options: Katalog Kelas, Screening STPPA, Worksheet Gratis, Testimoni, Why Us */}
              <View className="flex-col gap-1">
                <TouchableOpacity
                  className="flex-row items-center justify-between p-3 rounded-2xl hover:bg-rose-50 transition"
                  onPress={() => {
                    scrollToSection('katalog-kelas');
                    setIsMenuOpen(false);
                  }}
                >
                  <View className="flex-row items-center gap-3">
                    <View className="w-9 h-9 rounded-xl bg-[#D82B5A]/10 items-center justify-center">
                      <Feather name="book-open" size={16} color="#D82B5A" />
                    </View>
                    <View>
                      <Text className="text-xs font-extrabold text-[#162E5C]">{t.menu.catalogTitle}</Text>
                      <Text className="text-[10px] text-gray-500 font-medium">{t.menu.catalogSub}</Text>
                    </View>
                  </View>
                  <Feather name="chevron-right" size={14} color="#D82B5A" />
                </TouchableOpacity>

                <TouchableOpacity
                  className="flex-row items-center justify-between p-3 rounded-2xl hover:bg-sky-50 transition"
                  onPress={() => {
                    scrollToSection('screening-stppa');
                    setIsMenuOpen(false);
                  }}
                >
                  <View className="flex-row items-center gap-3">
                    <View className="w-9 h-9 rounded-xl bg-[#2DA9E9]/15 items-center justify-center">
                      <Feather name="activity" size={16} color="#2DA9E9" />
                    </View>
                    <View>
                      <Text className="text-xs font-extrabold text-[#162E5C]">{t.menu.screeningTitle}</Text>
                      <Text className="text-[10px] text-gray-500 font-medium">{t.menu.screeningSub}</Text>
                    </View>
                  </View>
                  <Feather name="chevron-right" size={14} color="#2DA9E9" />
                </TouchableOpacity>

                <TouchableOpacity
                  className="flex-row items-center justify-between p-3 rounded-2xl hover:bg-purple-50 transition"
                  onPress={() => {
                    scrollToSection('worksheet-gratis');
                    setIsMenuOpen(false);
                  }}
                >
                  <View className="flex-row items-center gap-3">
                    <View className="w-9 h-9 rounded-xl bg-[#5A3B8B]/15 items-center justify-center">
                      <Feather name="gift" size={16} color="#5A3B8B" />
                    </View>
                    <View>
                      <Text className="text-xs font-extrabold text-[#162E5C]">{t.menu.worksheetTitle}</Text>
                      <Text className="text-[10px] text-gray-500 font-medium">{t.menu.worksheetSub}</Text>
                    </View>
                  </View>
                  <Feather name="chevron-right" size={14} color="#5A3B8B" />
                </TouchableOpacity>

                <TouchableOpacity
                  className="flex-row items-center justify-between p-3 rounded-2xl hover:bg-amber-50 transition"
                  onPress={() => {
                    scrollToSection('testimoni');
                    setIsMenuOpen(false);
                  }}
                >
                  <View className="flex-row items-center gap-3">
                    <View className="w-9 h-9 rounded-xl bg-[#F59E0B]/15 items-center justify-center">
                      <Feather name="star" size={16} color="#D97706" />
                    </View>
                    <View>
                      <Text className="text-xs font-extrabold text-[#162E5C]">{t.menu.testimoniTitle}</Text>
                      <Text className="text-[10px] text-gray-500 font-medium">{t.menu.testimoniSub}</Text>
                    </View>
                  </View>
                  <Feather name="chevron-right" size={14} color="#D97706" />
                </TouchableOpacity>

                <TouchableOpacity
                  className="flex-row items-center justify-between p-3 rounded-2xl hover:bg-emerald-50 transition"
                  onPress={() => {
                    scrollToSection('why-us');
                    setIsMenuOpen(false);
                  }}
                >
                  <View className="flex-row items-center gap-3">
                    <View className="w-9 h-9 rounded-xl bg-[#30B864]/15 items-center justify-center">
                      <Feather name="award" size={16} color="#30B864" />
                    </View>
                    <View>
                      <Text className="text-xs font-extrabold text-[#162E5C]">{t.menu.whyUsTitle}</Text>
                      <Text className="text-[10px] text-gray-500 font-medium">{t.menu.whyUsSub}</Text>
                    </View>
                  </View>
                  <Feather name="chevron-right" size={14} color="#30B864" />
                </TouchableOpacity>
              </View>

              {/* Pengaturan Bahasa / Language Setting inside Menu */}
              <View className="mt-2 pt-2.5 border-t border-gray-100 flex-row items-center justify-between px-1">
                <View className="flex-row items-center gap-2">
                  <Feather name="globe" size={14} color="#162E5C" />
                  <Text className="text-xs font-bold text-[#162E5C]">{t.menu.langLabel}</Text>
                </View>
                <View className="flex-row bg-gray-100 p-0.5 rounded-full border border-gray-200">
                  <TouchableOpacity
                    onPress={() => handleChangeLang('id')}
                    className={`px-2.5 py-1 rounded-full ${lang === 'id' ? 'bg-white shadow-xs' : ''}`}
                  >
                    <Text className={`text-[10px] font-black ${lang === 'id' ? 'text-[#162E5C]' : 'text-gray-500'}`}>ID</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleChangeLang('en')}
                    className={`px-2.5 py-1 rounded-full ${lang === 'en' ? 'bg-white shadow-xs' : ''}`}
                  >
                    <Text className={`text-[10px] font-black ${lang === 'en' ? 'text-[#D82B5A]' : 'text-gray-500'}`}>EN</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleChangeLang('th')}
                    className={`px-2.5 py-1 rounded-full ${lang === 'th' ? 'bg-white shadow-xs' : ''}`}
                  >
                    <Text className={`text-[10px] font-black ${lang === 'th' ? 'text-[#5A3B8B]' : 'text-gray-500'}`}>TH</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Mobile Extended Nav (Tentang Kami, Class Toolkit, Join Us) */}
              {!isDesktop && (
                <View className="mt-2 pt-2 border-t border-gray-100 flex-col gap-1">
                  <TouchableOpacity
                    className="p-2.5 rounded-xl hover:bg-gray-50 flex-row items-center justify-between"
                    onPress={() => {
                      scrollToSection('tentang-kami');
                      setIsMenuOpen(false);
                    }}
                  >
                    <Text className="text-xs font-bold text-gray-700">{t.nav.about}</Text>
                    <Feather name="arrow-up-right" size={12} color="#9CA3AF" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    className="p-2.5 rounded-xl hover:bg-gray-50 flex-row items-center justify-between"
                    onPress={() => {
                      scrollToSection('class-toolkit');
                      setIsMenuOpen(false);
                    }}
                  >
                    <Text className="text-xs font-bold text-gray-700">{t.menu.toolkitNav}</Text>
                    <Feather name="arrow-up-right" size={12} color="#9CA3AF" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    className="p-2.5 rounded-xl hover:bg-gray-50 flex-row items-center justify-between"
                    onPress={() => {
                      scrollToSection('join-us');
                      setIsMenuOpen(false);
                    }}
                  >
                    <Text className="text-xs font-bold text-gray-700">{t.menu.joinUsNav}</Text>
                    <Feather name="arrow-up-right" size={12} color="#9CA3AF" />
                  </TouchableOpacity>
                </View>
              )}

              {/* Direct App Launch Button */}
              <View className="mt-3 pt-3 border-t border-gray-100">
                <TouchableOpacity
                  className="w-full bg-[#D82B5A] py-2.5 rounded-full items-center justify-center shadow-xs hover:bg-[#B01E49] transition flex-row items-center gap-2"
                  onPress={() => {
                    setViewMode('app');
                    setIsMenuOpen(false);
                  }}
                >
                  <Feather name="smartphone" size={14} color="#FFFFFF" />
                  <Text className="text-white font-extrabold text-xs">{t.menu.openApp}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </>
        )}

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
                      objectPosition: idx === 4 ? 'center 1000%' : 'center center',
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
                    {t.hero.title}
                  </Text>

                  <Text className="text-xs md:text-base text-white/95 font-medium leading-relaxed mb-8">
                    {t.hero.subtitle}
                  </Text>

                  <View className="flex-row flex-wrap items-center gap-4">
                    <TouchableOpacity
                      className="bg-white px-7 py-3 rounded-full shadow-lg hover:bg-gray-100 transition flex-row items-center gap-2"
                      onPress={() => {
                        const url = 'https://sccreening-sobatceria.vercel.app/';
                        if (Platform.OS === 'web' && typeof window !== 'undefined') {
                          window.open(url, '_blank', 'noopener,noreferrer');
                        } else {
                          Linking.openURL(url).catch(() => {});
                        }
                      }}
                    >
                      <Feather name="activity" size={16} color="#D82B5A" />
                      <Text className="text-[#D82B5A] font-extrabold text-xs md:text-sm">{t.hero.btnScreening}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      className="border-2 border-white px-7 py-2.5 rounded-full hover:bg-white/10 transition"
                      onPress={() => scrollToSection('pendaftaran')}
                    >
                      <Text className="text-white font-extrabold text-xs md:text-sm">{t.hero.btnTrial}</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              {/* Right Column: Clear Photo View with Rounded-BR Corner & Badge Overlay */}
              <View className="w-full md:w-1/2 h-[380px] md:h-auto min-h-[440px] relative justify-end p-6 z-10 rounded-br-none md:rounded-br-[4.5rem]">
                <View className="absolute bottom-6 right-8 bg-black/50 backdrop-blur-md px-4 py-2 rounded-full border border-white/30 z-20 flex-row items-center gap-2">
                  <Text className="text-white text-[11px] font-extrabold">{t.hero.badge}</Text>
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
                <Text className="text-[#D82B5A] text-lg font-serif italic mb-1">{t.about.eyebrow}</Text>
                <Text className="text-2xl md:text-4xl font-extrabold text-[#162E5C] mb-4">
                  {t.about.title}
                </Text>
                <Text className="text-xs md:text-sm text-gray-600 leading-relaxed font-medium mb-4">
                  {t.about.p1}
                </Text>
                <Text className="text-xs md:text-sm text-gray-600 leading-relaxed font-medium mb-4">
                  {t.about.p2}
                </Text>
                <Text className="text-xs md:text-sm text-gray-600 leading-relaxed font-medium mb-6">
                  {t.about.p3}
                </Text>
                <View className="flex-row items-center gap-4">
                  <TouchableOpacity
                    className="bg-[#162E5C] px-5 py-2.5 rounded-full shadow-sm hover:bg-[#0B2B64] transition"
                    onPress={() => setViewMode('app')}
                  >
                    <Text className="text-white font-extrabold text-xs">{t.about.cta}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </ScrollRevealSection>

          {/* SECTION 3: VISI & MISI (Interactive Card Reveal) */}
          <ScrollRevealSection className="max-w-7xl mx-auto px-4 md:px-12 py-12 md:py-16">
            <View className="bg-[#162E5C] rounded-[2.5rem] p-8 md:p-14 text-white shadow-xl flex-col md:flex-row items-center gap-10 card-solid-hover">
              <View className="flex-1">
                <Text className="text-[#FFD100] text-lg font-serif italic mb-2">{t.vision.eyebrow}</Text>
                <Text className="text-2xl md:text-3xl font-extrabold text-white mb-4">
                  {t.vision.title}
                </Text>

                <View className="mb-6">
                  <Text className="text-xs font-black uppercase text-[#FFD100] tracking-wider mb-1">{t.vision.visionLabel}</Text>
                  <Text className="text-xs md:text-sm text-gray-200 leading-relaxed font-medium">
                    {t.vision.visionText}
                  </Text>
                </View>

                <View>
                  <Text className="text-xs font-black uppercase text-[#FFD100] tracking-wider mb-2">{t.vision.missionLabel}</Text>
                  <View className="flex-col gap-1.5">
                    {t.vision.missions.map((m, i) => (
                      <Text key={i} className="text-xs md:text-sm text-gray-200 leading-relaxed font-medium">• {m}</Text>
                    ))}
                  </View>
                </View>

                <View className="mt-6">
                  <Text className="text-xs font-black uppercase text-[#FFD100] tracking-wider mb-1">{t.vision.locationLabel}</Text>
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

          {/* SECTION 5: PROGRAM KELAS RESMI (Dinamis dari Supabase / Admin Kelola Kelas) */}
          <ScrollRevealSection className="max-w-7xl mx-auto px-4 md:px-12 py-12 md:py-16">
            <View id="katalog-kelas" nativeID="katalog-kelas" className="items-center text-center mb-12">
              <Text className="text-[#D82B5A] text-lg font-serif italic mb-1 text-center">{t.catalog.eyebrow}</Text>
              <Text className="text-2xl md:text-4xl font-extrabold text-[#162E5C] text-center">
                {landingCourses.length} {t.catalog.titleSuffix}
              </Text>
            </View>

            {/* Official Program Cards Grid */}
            <View className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {landingCourses.map((course, idx) => {
                const imgSource = resolveCourseImage(course);
                const ageColor = AGE_COLORS[idx % AGE_COLORS.length];
                const isSeminar = /seminar|parenting/i.test(course.title);
                return (
                  <View
                    key={course.id}
                    className="bg-white rounded-[2rem] p-5 border border-gray-100 shadow-sm flex-col justify-between card-hover-effect"
                  >
                    <View>
                      <View className="w-full h-40 rounded-[1.5rem] overflow-hidden mb-4 relative img-zoom-container bg-[#FAF6F0] items-center justify-center">
                        {imgSource ? (
                          <Image
                            source={imgSource}
                            className="w-full h-full object-cover"
                            style={{
                              width: '100%',
                              height: '100%',
                              ...(isSeminar ? ({ objectPosition: 'center 1000%' } as any) : {}),
                            }}
                          />
                        ) : (
                          <View className="items-center justify-center">
                            <Feather name="book-open" size={32} color="#162E5C" />
                          </View>
                        )}
                        <View className="absolute top-2.5 left-2.5 bg-[#162E5C] px-2.5 py-1 rounded-lg">
                          <Text className="text-[9px] font-black text-white">
                            {idx + 1}. {course.category}
                          </Text>
                        </View>
                      </View>
                      <Text className="text-base font-extrabold text-[#162E5C] mb-1.5">{course.title}</Text>
                      <Text className="text-xs text-gray-600 leading-relaxed mb-4 font-medium">
                        {course.description || t.catalog.defaultDesc}
                      </Text>
                    </View>
                    <View className="flex-row items-center justify-between pt-3 border-t border-gray-100">
                      <Text className="text-[10px] font-bold" style={{ color: ageColor }}>
                        {course.ageRange}
                      </Text>
                      <Text className="text-xs font-black text-[#D82B5A]">
                        Rp {Number(course.price || 0).toLocaleString('id-ID')}
                      </Text>
                    </View>
                  </View>
                );
              })}
            </View>

            {/* CTA Button to Full App Catalog */}
            <View className="items-center mt-10">
              <TouchableOpacity
                className="bg-[#D82B5A] px-8 py-3.5 rounded-full shadow-lg hover:bg-[#B01E49] transition-transform active:scale-95 flex-row items-center gap-2"
                onPress={() => setViewMode('app')}
              >
                <Text className="text-white font-extrabold text-xs md:text-sm">{t.catalog.cta}</Text>
                <Feather name="arrow-right" size={16} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </ScrollRevealSection>

          {/* SECTION: SCREENING STPPA DIGITAL (Preview Sekilas Teaser) */}
          <ScrollRevealSection className="max-w-7xl mx-auto px-4 md:px-12 py-12 md:py-16">
            <View id="screening-stppa" nativeID="screening-stppa" className="bg-white rounded-[2.5rem] p-8 md:p-14 border-2 border-[#2DA9E9]/30 shadow-md flex-col md:flex-row items-center gap-10 card-hover-effect">
              <View className="flex-1">
                <View className="bg-[#2DA9E9]/15 self-start px-3.5 py-1 rounded-full mb-3 border border-[#2DA9E9]/30">
                  <Text className="text-[#2DA9E9] text-[11px] font-black uppercase tracking-wider">{t.screening.badge}</Text>
                </View>
                <Text className="text-2xl md:text-4xl font-extrabold text-[#162E5C] mb-4">
                  {t.screening.title}
                </Text>
                <Text className="text-xs md:text-sm text-gray-600 leading-relaxed font-medium mb-6">
                  {t.screening.desc}
                </Text>
                <TouchableOpacity
                  className="bg-[#2DA9E9] px-7 py-3 rounded-full shadow-md hover:bg-[#1E8EC7] transition-transform active:scale-95 self-start flex-row items-center gap-2"
                  onPress={() => setViewMode('app')}
                >
                  <Text className="text-white font-extrabold text-xs md:text-sm">{t.screening.cta}</Text>
                  <Feather name="arrow-right" size={16} color="#FFFFFF" />
                </TouchableOpacity>
              </View>

              {/* Visual Card Preview */}
              <View className="w-full md:w-2/5 bg-[#F0F8FF] rounded-[2rem] p-6 border border-[#2DA9E9]/20 shadow-sm flex-col gap-3">
                <View className="flex-row justify-between items-center bg-white p-3 rounded-xl border border-gray-100 shadow-xs">
                  <Text className="text-xs font-bold text-[#162E5C]">{t.screening.card1Title}</Text>
                  <Text className="text-xs font-black text-[#30B864]">{t.screening.card1Val}</Text>
                </View>
                <View className="flex-row justify-between items-center bg-white p-3 rounded-xl border border-gray-100 shadow-xs">
                  <Text className="text-xs font-bold text-[#162E5C]">{t.screening.card2Title}</Text>
                  <Text className="text-xs font-black text-[#2DA9E9]">{t.screening.card2Val}</Text>
                </View>
                <View className="flex-row justify-between items-center bg-white p-3 rounded-xl border border-gray-100 shadow-xs">
                  <Text className="text-xs font-bold text-[#162E5C]">{t.screening.card3Title}</Text>
                  <Text className="text-xs font-black text-[#F77712]">{t.screening.card3Val}</Text>
                </View>
              </View>
            </View>
          </ScrollRevealSection>

          {/* SECTION: WORKSHEET GRATIS PRINTABLE (Preview Sekilas Teaser) */}
          <ScrollRevealSection className="max-w-7xl mx-auto px-4 md:px-12 py-12 md:py-16">
            <View id="worksheet-gratis" nativeID="worksheet-gratis" className="bg-[#5A3B8B] rounded-[2.5rem] p-8 md:p-14 text-white shadow-xl flex-col md:flex-row items-center gap-10 card-solid-hover">
              <View className="flex-1">
                <View className="bg-white/20 self-start px-3.5 py-1 rounded-full mb-3 border border-white/30">
                  <Text className="text-[#FFD100] text-[11px] font-black uppercase tracking-wider">{t.worksheet.badge}</Text>
                </View>
                <Text className="text-2xl md:text-4xl font-extrabold text-white mb-4">
                  {t.worksheet.title}
                </Text>
                <Text className="text-xs md:text-sm text-gray-200 leading-relaxed font-medium mb-6">
                  {t.worksheet.desc}
                </Text>
                <TouchableOpacity
                  className="bg-[#FFD100] px-7 py-3 rounded-full shadow-md hover:bg-[#E6BC00] transition-transform active:scale-95 self-start flex-row items-center gap-2"
                  onPress={() => setViewMode('app')}
                >
                  <Text className="text-[#162E5C] font-extrabold text-xs md:text-sm">{t.worksheet.cta}</Text>
                  <Feather name="download" size={16} color="#162E5C" />
                </TouchableOpacity>
              </View>

              {/* Visual Preview Badge */}
              <View className="w-full md:w-2/5 bg-white/10 rounded-[2rem] p-6 border border-white/20 flex-col gap-3">
                <View className="flex-row items-center gap-3 bg-white/15 p-3 rounded-xl">
                  <Feather name="file-text" size={20} color="#FFD100" />
                  <View>
                    <Text className="text-xs font-extrabold text-white">{t.worksheet.item1Title}</Text>
                    <Text className="text-[10px] text-gray-300">{t.worksheet.item1Sub}</Text>
                  </View>
                </View>
                <View className="flex-row items-center gap-3 bg-white/15 p-3 rounded-xl">
                  <Feather name="edit-3" size={20} color="#30B864" />
                  <View>
                    <Text className="text-xs font-extrabold text-white">{t.worksheet.item2Title}</Text>
                    <Text className="text-[10px] text-gray-300">{t.worksheet.item2Sub}</Text>
                  </View>
                </View>
              </View>
            </View>
          </ScrollRevealSection>

          {/* SECTION: CLASS TOOLKIT FRANCHISE (PILAR 3) - TEPAT DI BAWAH WORKSHEET */}
          <ScrollRevealSection className="max-w-7xl mx-auto px-4 md:px-12 py-12 md:py-16">
            <View id="class-toolkit" nativeID="class-toolkit" className="bg-white rounded-[2.5rem] p-8 md:p-14 border border-gray-100 shadow-sm card-hover-effect">
              {/* Header Penjelasan Class Toolkit Franchise */}
              <View className="items-center text-center max-w-3xl mx-auto mb-12">
                <View className="bg-[#D82B5A]/10 self-center px-4 py-1.5 rounded-full mb-3 border border-[#D82B5A]/20">
                  <Text className="text-[#D82B5A] text-xs font-black uppercase tracking-wider text-center">{t.toolkit.badge}</Text>
                </View>
                <Text className="text-2xl md:text-4xl font-extrabold text-[#162E5C] mb-4 text-center">
                  {t.toolkit.title}
                </Text>
                <Text className="text-xs md:text-sm text-gray-600 leading-relaxed font-medium text-center">
                  {t.toolkit.desc}
                </Text>
              </View>

              {/* 3 Paket Franchise Grid */}
              <View className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Paket 1: Starter Toolkit */}
                <View className="bg-[#FAF6F0] rounded-[2rem] p-7 border border-gray-200/80 flex-col justify-between hover:shadow-md transition">
                  <View>
                    <View className="w-12 h-12 rounded-2xl bg-[#5A3B8B]/15 items-center justify-center mb-4">
                      <Feather name="box" size={24} color="#5A3B8B" />
                    </View>
                    <Text className="text-[11px] font-black uppercase tracking-wider text-[#5A3B8B] mb-1">Paket Komunitas / Pop-Up</Text>
                    <Text className="text-xl font-extrabold text-[#162E5C] mb-2">Starter Toolkit</Text>
                    <Text className="text-xs text-gray-600 font-medium leading-relaxed mb-5">
                      Cocok untuk guru privat, komunitas orang tua, atau kelas stimulasi berkala berskala kecil.
                    </Text>

                    <View className="border-t border-gray-200/70 pt-4 mb-6 flex-col gap-2.5">
                      <View className="flex-row items-center gap-2">
                        <Feather name="check" size={14} color="#30B864" />
                        <Text className="text-xs font-semibold text-gray-700">2 Modul Tematik Pilihan</Text>
                      </View>
                      <View className="flex-row items-center gap-2">
                        <Feather name="check" size={14} color="#30B864" />
                        <Text className="text-xs font-semibold text-gray-700">Sensory Starter Kit (10 Anak)</Text>
                      </View>
                      <View className="flex-row items-center gap-2">
                        <Feather name="check" size={14} color="#30B864" />
                        <Text className="text-xs font-semibold text-gray-700">Buku Panduan Ajar & SOP Dasar</Text>
                      </View>
                      <View className="flex-row items-center gap-2">
                        <Feather name="check" size={14} color="#30B864" />
                        <Text className="text-xs font-semibold text-gray-700">Screening Perkembangan STPPA Dasar</Text>
                      </View>
                    </View>
                  </View>

                  <TouchableOpacity
                    className="w-full bg-[#162E5C] py-3 rounded-full items-center justify-center shadow-xs hover:bg-[#0B2B64] transition active:scale-95 flex-row items-center gap-2"
                    onPress={() => {}}
                  >
                    <Text className="text-white font-extrabold text-xs">Lihat Lebih Lanjut</Text>
                    <Feather name="arrow-right" size={14} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>

                {/* Paket 2: Pro Growth Hub (Featured) */}
                <View className="bg-[#162E5C] rounded-[2rem] p-7 text-white shadow-xl relative overflow-hidden flex-col justify-between border-2 border-[#D82B5A]">
                  <View className="absolute top-4 right-4 bg-[#D82B5A] px-3 py-1 rounded-full">
                    <Text className="text-[10px] font-black text-white uppercase tracking-wider">Paling Populer</Text>
                  </View>

                  <View>
                    <View className="w-12 h-12 rounded-2xl bg-[#D82B5A]/30 items-center justify-center mb-4">
                      <Feather name="zap" size={24} color="#FF7B9E" />
                    </View>
                    <Text className="text-[11px] font-black uppercase tracking-wider text-[#FFD100] mb-1">Paket Playgroup / Daycare</Text>
                    <Text className="text-xl font-extrabold text-white mb-2">Pro Growth Hub</Text>
                    <Text className="text-xs text-gray-200 font-medium leading-relaxed mb-5">
                      Pilihan terlengkap untuk bimbingan belajar, daycare, atau sentra stimulasi tumbuh kembang mandiri.
                    </Text>

                    <View className="border-t border-white/15 pt-4 mb-6 flex-col gap-2.5">
                      <View className="flex-row items-center gap-2">
                        <Feather name="check" size={14} color="#FFD100" />
                        <Text className="text-xs font-semibold text-white">Lengkap 8 Modul Kelas Resmi</Text>
                      </View>
                      <View className="flex-row items-center gap-2">
                        <Feather name="check" size={14} color="#FFD100" />
                        <Text className="text-xs font-semibold text-white">Full Sensory & STEAM Kits (30 Anak)</Text>
                      </View>
                      <View className="flex-row items-center gap-2">
                        <Feather name="check" size={14} color="#FFD100" />
                        <Text className="text-xs font-semibold text-white">Akses Aplikasi Screening AI & Dashboard</Text>
                      </View>
                      <View className="flex-row items-center gap-2">
                        <Feather name="check" size={14} color="#FFD100" />
                        <Text className="text-xs font-semibold text-white">Pelatihan & Sertifikasi 2 Fasilitator</Text>
                      </View>
                      <View className="flex-row items-center gap-2">
                        <Feather name="check" size={14} color="#FFD100" />
                        <Text className="text-xs font-semibold text-white">Starter Brand Kit & Brosur Promosi</Text>
                      </View>
                    </View>
                  </View>

                  <TouchableOpacity
                    className="w-full bg-[#D82B5A] py-3 rounded-full items-center justify-center shadow-md hover:bg-[#B01E49] transition active:scale-95 flex-row items-center gap-2"
                    onPress={() => {}}
                  >
                    <Text className="text-white font-extrabold text-xs">Lihat Lebih Lanjut</Text>
                    <Feather name="arrow-right" size={14} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>

                {/* Paket 3: Enterprise Center */}
                <View className="bg-[#FAF6F0] rounded-[2rem] p-7 border border-gray-200/80 flex-col justify-between hover:shadow-md transition">
                  <View>
                    <View className="w-12 h-12 rounded-2xl bg-[#30B864]/15 items-center justify-center mb-4">
                      <Feather name="award" size={24} color="#30B864" />
                    </View>
                    <Text className="text-[11px] font-black uppercase tracking-wider text-[#30B864] mb-1">Paket Sekolah / Center Mitra</Text>
                    <Text className="text-xl font-extrabold text-[#162E5C] mb-2">Enterprise Partner</Text>
                    <Text className="text-xs text-gray-600 font-medium leading-relaxed mb-5">
                      Kemitraan strategis institusional untuk sekolah TK/PAUD, klinik tumbuh kembang, dan pusat edukasi anak.
                    </Text>

                    <View className="border-t border-gray-200/70 pt-4 mb-6 flex-col gap-2.5">
                      <View className="flex-row items-center gap-2">
                        <Feather name="check" size={14} color="#30B864" />
                        <Text className="text-xs font-semibold text-gray-700">Lisensi Area / Wilayah Eksklusif</Text>
                      </View>
                      <View className="flex-row items-center gap-2">
                        <Feather name="check" size={14} color="#30B864" />
                        <Text className="text-xs font-semibold text-gray-700">Inventaris Kit Lengkap (50+ Anak)</Text>
                      </View>
                      <View className="flex-row items-center gap-2">
                        <Feather name="check" size={14} color="#30B864" />
                        <Text className="text-xs font-semibold text-gray-700">Supervisi Psikolog & Dokter Anak</Text>
                      </View>
                      <View className="flex-row items-center gap-2">
                        <Feather name="check" size={14} color="#30B864" />
                        <Text className="text-xs font-semibold text-gray-700">Pelatihan & Monitoring Terpadu</Text>
                      </View>
                      <View className="flex-row items-center gap-2">
                        <Feather name="check" size={14} color="#30B864" />
                        <Text className="text-xs font-semibold text-gray-700">Pembaruan Modul Berkala Otomatis</Text>
                      </View>
                    </View>
                  </View>

                  <TouchableOpacity
                    className="w-full bg-[#162E5C] py-3 rounded-full items-center justify-center shadow-xs hover:bg-[#0B2B64] transition active:scale-95 flex-row items-center gap-2"
                    onPress={() => {}}
                  >
                    <Text className="text-white font-extrabold text-xs">Lihat Lebih Lanjut</Text>
                    <Feather name="arrow-right" size={14} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </ScrollRevealSection>

          {/* SECTION: JOIN US (PILAR 4) - TEPAT DI BAWAH CLASS TOOLKIT */}
          <ScrollRevealSection className="max-w-7xl mx-auto px-4 md:px-12 py-12 md:py-16">
            <View id="join-us" nativeID="join-us" className="items-center text-center mb-12">
              <View className="bg-[#D82B5A]/10 self-center px-4 py-1.5 rounded-full mb-3 border border-[#D82B5A]/20">
                <Text className="text-[#D82B5A] text-xs font-black uppercase tracking-wider text-center">{t.joinUs.badge}</Text>
              </View>
              <Text className="text-2xl md:text-4xl font-extrabold text-[#162E5C] mb-3 text-center">
                {t.joinUs.title}
              </Text>
              <Text className="text-xs md:text-sm text-gray-600 font-medium max-w-2xl mx-auto leading-relaxed text-center">
                {t.joinUs.desc}
              </Text>
            </View>

            {/* 4 Pilihan Pendaftaran Grid (Volunteer, Tutor/Guru, Collaboration, Mitra) */}
            <View className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* 1. Volunteer */}
              <View className="bg-white rounded-[2rem] p-6 border border-gray-100 shadow-sm flex-col justify-between card-hover-effect">
                <View>
                  <View className="w-12 h-12 rounded-2xl bg-[#FFD100]/25 items-center justify-center mb-4">
                    <Feather name="heart" size={24} color="#B45309" />
                  </View>
                  <View className="bg-[#FFD100]/20 self-start px-2.5 py-0.5 rounded-full mb-2">
                    <Text className="text-[#B45309] text-[9px] font-black uppercase tracking-wider">{t.joinUs.vTag}</Text>
                  </View>
                  <Text className="text-lg font-extrabold text-[#162E5C] mb-2">{t.joinUs.vTitle}</Text>
                  <Text className="text-xs text-gray-600 leading-relaxed font-medium mb-6">
                    {t.joinUs.vDesc}
                  </Text>
                </View>
                <TouchableOpacity
                  className="w-full bg-[#162E5C] py-2.5 rounded-full items-center justify-center shadow-xs hover:bg-[#0B2B64] transition active:scale-95 flex-row items-center gap-1.5"
                  onPress={() => setRoleRegisterTarget('volunteer')}
                >
                  <Text className="text-white font-extrabold text-xs">{t.joinUs.btn}</Text>
                  <Feather name="arrow-right" size={14} color="#FFFFFF" />
                </TouchableOpacity>
              </View>

              {/* 2. Tutor / Guru */}
              <View className="bg-white rounded-[2rem] p-6 border border-gray-100 shadow-sm flex-col justify-between card-hover-effect">
                <View>
                  <View className="w-12 h-12 rounded-2xl bg-[#5A3B8B]/15 items-center justify-center mb-4">
                    <Feather name="users" size={24} color="#5A3B8B" />
                  </View>
                  <View className="bg-[#5A3B8B]/10 self-start px-2.5 py-0.5 rounded-full mb-2">
                    <Text className="text-[#5A3B8B] text-[9px] font-black uppercase tracking-wider">{t.joinUs.tTag}</Text>
                  </View>
                  <Text className="text-lg font-extrabold text-[#162E5C] mb-2">{t.joinUs.tTitle}</Text>
                  <Text className="text-xs text-gray-600 leading-relaxed font-medium mb-6">
                    {t.joinUs.tDesc}
                  </Text>
                </View>
                <TouchableOpacity
                  className="w-full bg-[#5A3B8B] py-2.5 rounded-full items-center justify-center shadow-xs hover:bg-[#472c72] transition active:scale-95 flex-row items-center gap-1.5"
                  onPress={() => setRoleRegisterTarget('teacher')}
                >
                  <Text className="text-white font-extrabold text-xs">{t.joinUs.btn}</Text>
                  <Feather name="arrow-right" size={14} color="#FFFFFF" />
                </TouchableOpacity>
              </View>

              {/* 3. Collaboration */}
              <View className="bg-white rounded-[2rem] p-6 border border-gray-100 shadow-sm flex-col justify-between card-hover-effect">
                <View>
                  <View className="w-12 h-12 rounded-2xl bg-[#2DA9E9]/15 items-center justify-center mb-4">
                    <Feather name="share-2" size={24} color="#2DA9E9" />
                  </View>
                  <View className="bg-[#2DA9E9]/10 self-start px-2.5 py-0.5 rounded-full mb-2">
                    <Text className="text-[#2DA9E9] text-[9px] font-black uppercase tracking-wider">{t.joinUs.cTag}</Text>
                  </View>
                  <Text className="text-lg font-extrabold text-[#162E5C] mb-2">{t.joinUs.cTitle}</Text>
                  <Text className="text-xs text-gray-600 leading-relaxed font-medium mb-6">
                    {t.joinUs.cDesc}
                  </Text>
                </View>
                <TouchableOpacity
                  className="w-full bg-[#2DA9E9] py-2.5 rounded-full items-center justify-center shadow-xs hover:bg-[#1E8EC7] transition active:scale-95 flex-row items-center gap-1.5"
                  onPress={() => setRoleRegisterTarget('collaboration')}
                >
                  <Text className="text-white font-extrabold text-xs">{t.joinUs.btn}</Text>
                  <Feather name="arrow-right" size={14} color="#FFFFFF" />
                </TouchableOpacity>
              </View>

              {/* 4. Mitra */}
              <View className="bg-white rounded-[2rem] p-6 border border-gray-100 shadow-sm flex-col justify-between card-hover-effect">
                <View>
                  <View className="w-12 h-12 rounded-2xl bg-[#30B864]/15 items-center justify-center mb-4">
                    <Feather name="shield" size={24} color="#30B864" />
                  </View>
                  <View className="bg-[#30B864]/10 self-start px-2.5 py-0.5 rounded-full mb-2">
                    <Text className="text-[#30B864] text-[9px] font-black uppercase tracking-wider">{t.joinUs.pTag}</Text>
                  </View>
                  <Text className="text-lg font-extrabold text-[#162E5C] mb-2">{t.joinUs.pTitle}</Text>
                  <Text className="text-xs text-gray-600 leading-relaxed font-medium mb-6">
                    {t.joinUs.pDesc}
                  </Text>
                </View>
                <TouchableOpacity
                  className="w-full bg-[#30B864] py-2.5 rounded-full items-center justify-center shadow-xs hover:bg-[#25944f] transition active:scale-95 flex-row items-center gap-1.5"
                  onPress={() => setRoleRegisterTarget('partner')}
                >
                  <Text className="text-white font-extrabold text-xs">{t.joinUs.btn}</Text>
                  <Feather name="arrow-right" size={14} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Mitra Logo Badges Grid */}
            <View className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-6 md:p-10 mt-10">
              <Text className="text-xs font-black uppercase tracking-wider text-gray-400 text-center mb-6">{t.joinUs.mitraTitle}</Text>
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

          {/* SECTION 6: FASILITAS & FITUR EKOSISTEM (Interactive Hover Cards) */}
          <ScrollRevealSection className="max-w-7xl mx-auto px-4 md:px-12 py-12 md:py-16">
            <View className="text-center mb-12">
              <Text className="text-[#D82B5A] text-lg font-serif italic mb-1 text-center">{t.facilities.eyebrow}</Text>
              <Text className="text-2xl md:text-4xl font-extrabold text-[#162E5C] text-center">
                {t.facilities.title}
              </Text>
            </View>

            <View className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {t.facilities.items.map((item, idx) => {
                const iconNames = ['users', 'gift', 'activity', 'message-circle', 'home'] as const;
                const colors = ['#5A3B8B', '#D82B5A', '#2DA9E9', '#30B864', '#F77712'];
                const color = colors[idx % colors.length];
                return (
                  <View key={idx} className="bg-white p-7 rounded-[2rem] border border-gray-100 shadow-sm flex-row items-start gap-5 card-hover-effect">
                    <View className="w-12 h-12 rounded-2xl items-center justify-center shrink-0" style={{ backgroundColor: `${color}26` }}>
                      <Feather name={iconNames[idx % iconNames.length]} size={24} color={color} />
                    </View>
                    <View className="flex-1">
                      <Text className="text-base font-extrabold text-[#162E5C] mb-1">{item.title}</Text>
                      <Text className="text-xs text-gray-600 leading-relaxed font-medium">
                        {item.desc}
                      </Text>
                    </View>
                  </View>
                );
              })}
            </View>
          </ScrollRevealSection>

          {/* SECTION 7: KEUNGGULAN KAMI (Interactive Solid Lift Cards) */}
          <ScrollRevealSection className="max-w-7xl mx-auto px-4 md:px-12 py-12 md:py-16">
            <View id="why-us" nativeID="why-us" className="text-center mb-12">
              <Text className="text-[#D82B5A] text-lg font-serif italic mb-1 text-center">{t.whyUs.eyebrow}</Text>
              <Text className="text-2xl md:text-4xl font-extrabold text-[#162E5C] text-center">
                {t.whyUs.title}
              </Text>
            </View>

            <View className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {t.whyUs.cards.map((card, idx) => {
                const bgColors = ['#F77712', '#5A3B8B', '#D82B5A', '#30B864', '#2DA9E9', '#162E5C'];
                const icons = ['book-open', 'activity', 'message-circle', 'heart', 'wind', 'users'] as const;
                return (
                  <View
                    key={idx}
                    className="rounded-[2.5rem] p-8 text-white shadow-md flex-col justify-between min-h-[240px] card-solid-hover"
                    style={{ backgroundColor: bgColors[idx % bgColors.length] }}
                  >
                    <View>
                      <Text className="text-xl font-black text-white mb-3">{card.title}</Text>
                      <Text className="text-xs text-white/95 leading-relaxed font-medium">
                        {card.desc}
                      </Text>
                    </View>
                    <View className="w-10 h-10 rounded-full bg-white/20 items-center justify-center self-end mt-4">
                      <Feather name={icons[idx % icons.length]} size={20} color="#FFFFFF" />
                    </View>
                  </View>
                );
              })}
            </View>
          </ScrollRevealSection>

          {/* SECTION 8: KATA ORANG TUA (Interactive Testimonial Card) */}
          <ScrollRevealSection className="max-w-7xl mx-auto px-4 md:px-12 py-12 md:py-16">
            <View className="text-center mb-12">
              <Text className="text-[#D82B5A] text-lg font-serif italic mb-1 text-center">{t.testimonials.eyebrow}</Text>
              <Text className="text-2xl md:text-4xl font-extrabold text-[#162E5C] text-center">
                {t.testimonials.title}
              </Text>
            </View>

            <View className="max-w-3xl mx-auto bg-white rounded-[2.5rem] p-6 md:p-12 border-2 border-[#5A3B8B]/40 shadow-sm relative card-hover-effect">
              <View className="flex-row gap-1 mb-4">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Feather key={s} name="star" size={16} color="#FFD100" />
                ))}
              </View>

              <Text className="text-base md:text-lg font-medium text-[#162E5C] leading-relaxed mb-6">
                {currentTestimonial.text}
              </Text>

              <View className="flex-col sm:flex-row sm:items-center justify-between gap-4 pt-6 border-t border-gray-100">
                <View className="flex-row items-center gap-3.5 flex-1 min-w-0">
                  <Image
                    source={{ uri: currentTestimonial.avatar }}
                    className="w-12 h-12 rounded-full border-2 border-[#5A3B8B] shrink-0"
                    style={{ width: 48, height: 48, borderRadius: 24 }}
                  />
                  <View className="flex-1 min-w-0">
                    <Text className="font-extrabold text-[#162E5C] text-sm">{currentTestimonial.name}</Text>
                    <Text className="text-xs text-[#D82B5A] font-bold mt-0.5">{currentTestimonial.role}</Text>
                  </View>
                </View>

                {/* Controls */}
                <View className="flex-row gap-2 self-end sm:self-auto shrink-0">
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
                <Text className="text-[#D82B5A] text-lg font-serif italic mb-1 text-center">{t.form.eyebrow}</Text>
                <Text className="text-2xl md:text-3xl font-extrabold text-[#162E5C] mb-2 text-center">
                  {t.form.title}
                </Text>
                <Text className="text-xs text-gray-500 font-medium text-center">
                  {t.form.subtitle}
                </Text>
              </View>

              <View className="flex-col gap-4">
                <View>
                  <Text className="text-xs font-bold text-gray-700 mb-1.5">{t.form.parentLabel}</Text>
                  <View className="bg-gray-50 border border-gray-200 rounded-full px-4 py-3">
                    <Text className="text-xs text-gray-400">{t.form.parentPh}</Text>
                  </View>
                </View>

                <View className="flex-col md:flex-row gap-4">
                  <View className="flex-1">
                    <Text className="text-xs font-bold text-gray-700 mb-1.5">{t.form.waLabel}</Text>
                    <View className="bg-gray-50 border border-gray-200 rounded-full px-4 py-3">
                      <Text className="text-xs text-gray-400">+62 812-3456-7890</Text>
                    </View>
                  </View>
                  <View className="flex-1">
                    <Text className="text-xs font-bold text-gray-700 mb-1.5">{t.form.childLabel}</Text>
                    <View className="bg-gray-50 border border-gray-200 rounded-full px-4 py-3">
                      <Text className="text-xs text-gray-400">{t.form.childPh}</Text>
                    </View>
                  </View>
                </View>

                <View>
                  <Text className="text-xs font-bold text-gray-700 mb-1.5">{t.form.programLabel} *</Text>
                  <View className="bg-gray-50 border border-gray-200 rounded-full px-4 py-3 flex-row justify-between items-center">
                    <Text className="text-xs text-gray-700 font-semibold">Mini Stimulation / Sensory Class</Text>
                    <Feather name="chevron-down" size={16} color="#6B7280" />
                  </View>
                </View>

                <TouchableOpacity
                  className="bg-[#D82B5A] py-3.5 rounded-full items-center justify-center shadow-md hover:bg-[#B01E49] transition-transform active:scale-98 hover:shadow-lg mt-4"
                  onPress={() => setViewMode('app')}
                >
                  <Text className="text-white font-extrabold text-sm tracking-wide">{t.form.cta}</Text>
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
                  {t.footer.desc}
                </Text>
              </View>

              <View className="flex-row flex-wrap gap-12">
                <View>
                  <Text className="text-xs font-black text-white uppercase tracking-widest mb-3">{t.footer.programCol}</Text>
                  <Text className="text-xs text-gray-300 mb-2">{t.nav.about}</Text>
                  <Text className="text-xs text-gray-300 mb-2">{t.menu.catalogTitle}</Text>
                  <Text className="text-xs text-gray-300">{t.nav.toolkit}</Text>
                </View>
                <View>
                  <Text className="text-xs font-black text-white uppercase tracking-widest mb-3">{t.footer.appCol}</Text>
                  <Text className="text-xs text-gray-300 mb-2">{t.menu.screeningTitle}</Text>
                  <Text className="text-xs text-gray-300 mb-2">{t.menu.worksheetTitle}</Text>
                  <Text className="text-xs text-gray-300">Voucher Repeat Order</Text>
                </View>
                <View>
                  <Text className="text-xs font-black text-white uppercase tracking-widest mb-3">{t.footer.contactCol}</Text>
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
                {t.footer.copyright}
              </Text>
              <Text className="text-[10px] text-gray-400 font-medium">
                Solo Raya, Jawa Tengah, Indonesia
              </Text>
            </View>
          </View>
        </ScrollView>

        {/* Modal Registrasi Khusus Role Mitra / Guru / Volunteer / Collaboration */}
        <RoleRegisterModal
          role={roleRegisterTarget}
          onClose={() => setRoleRegisterTarget(null)}
        />
      </View>
    </SafeAreaProvider>
  );
}
