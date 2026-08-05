import React, { useState, useMemo } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TextInput, 
  TouchableOpacity, 
  Image, 
  Platform 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { Course } from '../types';
import CheckoutModal from '../components/CheckoutModal';

// Mock Data Courses inside the catalog (8 Official Programs)
const MOCK_COURSES: Course[] = [
  {
    id: '1',
    title: 'Mini Stimulation Class',
    category: 'Mini Stimulation',
    ageRange: '2-3 Thn',
    price: 59000,
    seats: 12,
    image: 'https://images.unsplash.com/photo-1596464716127-f2a82984de30?w=600',
    description: 'Sensory motor stimulation, melatih fokus & pemecahan masalah sederhana berbasis latihan fisik.',
    facilitator: 'Bunda Sarah, M.Psi'
  },
  {
    id: '2',
    title: 'Communication Class',
    category: 'Communication',
    ageRange: '2-4 Thn',
    price: 65000,
    seats: 4,
    image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600',
    description: 'Interaksi teman sebaya untuk mengatasi speech delay dan melatih kepercayaan diri anak dalam berkomunikasi.',
    facilitator: 'Bunda Sarah, M.Psi'
  },
  {
    id: '3',
    title: 'Seminar Parenting',
    category: 'Parenting',
    ageRange: 'Ortu',
    price: 49000,
    seats: 25,
    image: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=600',
    description: 'Wadah edukasi interaktif untuk orang tua mengenai stimulasi golden age, emosi anak, & pencegahan kecanduan gadget.',
    facilitator: 'Dr. Anita, Sp.A & Tim Psikolog'
  },
  {
    id: '4',
    title: 'Art and Craft Class',
    category: 'Art & Craft',
    ageRange: '2-5 Thn',
    price: 79000,
    seats: 8,
    image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600',
    description: 'Kriya tangan ramah anak, eksplorasi media warna, & gunting tempel untuk mengasah kreativitas dan motorik halus.',
    facilitator: 'Kak Rian, S.Sn'
  },
  {
    id: '5',
    title: 'Science Class',
    category: 'Science Class',
    ageRange: '3-7 Thn',
    price: 69000,
    seats: 15,
    image: 'https://images.unsplash.com/photo-1530210124550-912dc1381cb8?w=600',
    description: 'Eksperimen sains aman dan menyenangkan untuk memicu rasa ingin tahu alami serta berpikir kritis si kecil.',
    facilitator: 'Kak Rian, S.Sn'
  },
  {
    id: '6',
    title: 'Pottery Class',
    category: 'Pottery Class',
    ageRange: '3-7 Thn',
    price: 75000,
    seats: 6,
    image: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=600',
    description: 'Pembentukan media tanah liat alami untuk melatih kesabaran, koordinasi jemari tangan, serta imajinasi spasial.',
    facilitator: 'Kak Rian, S.Sn'
  },
  {
    id: '7',
    title: 'Cooking Class',
    category: 'Cooking Class',
    ageRange: '3-7 Thn',
    price: 85000,
    seats: 10,
    image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=600',
    description: 'Kreasi makanan sehat sederhana untuk melatih kemandirian, pengenalan tekstur bahan, & kebersihan anak.',
    facilitator: 'Bunda Sarah, M.Psi'
  },
  {
    id: '8',
    title: 'Sensory & Movement Class',
    category: 'Sensory Play',
    ageRange: '2-6 Thn',
    price: 69000,
    seats: 12,
    image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600',
    description: 'Permainan fisik aktif, rintangan motorik kasar, serta stimulasi taktil untuk perkembangan olah tubuh anak.',
    facilitator: 'Tim Fasilitator Sobat Ceria'
  }
];

export default function CatalogScreen({ user }: { user: any }) {
  const [selectedAge, setSelectedAge] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  // Age Filter Options
  const ageFilters = ['All', '2-3 Thn', '3-5 Thn', '5-7 Thn'];

  // Filter logic based on age tab and search bar query
  const filteredCourses = useMemo(() => {
    return MOCK_COURSES.filter(course => {
      const matchesAge = selectedAge === 'All' || course.ageRange.includes(selectedAge.split(' ')[0]);
      const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            course.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesAge && matchesSearch;
    });
  }, [selectedAge, searchQuery]);

  return (
    <SafeAreaView style={{ flex: 1 }} className="bg-[#FAF6F0]">
      {/* Search Header Wrapper */}
      <View className="px-5 pt-4 pb-4 bg-white border-b border-gray-100 shadow-xs">
        <View className="flex-row items-center gap-2 mb-1">
          <View className="w-2.5 h-2.5 rounded-full bg-[#D82B5A]" />
          <Text className="text-lg md:text-xl font-extrabold text-[#162E5C]">Katalog 8 Program Kelas</Text>
        </View>
        <Text className="text-xs text-gray-500 font-medium mb-3">
          Pilih kelas stimulasi terpadu untuk buah hati Anda (Laboratorium FKIP UMS).
        </Text>
        
        {/* Search Bar */}
        <View className="bg-gray-50 rounded-2xl px-4 border border-gray-200 flex-row items-center">
          <Feather name="search" size={16} color="#9CA3AF" className="mr-2" />
          <TextInput
            className="flex-1 h-11 text-xs text-[#162E5C] font-medium"
            placeholder="Cari kelas berdasarkan nama atau kategori..."
            placeholderTextColor="#888"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Age Filters Navigation Row */}
      <View className="py-3 bg-white/50 border-b border-gray-100">
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16 }}>
          {ageFilters.map((age) => (
            <TouchableOpacity
              key={age}
              className={`rounded-full px-5 py-2 mr-2 border shadow-xs transition-transform active:scale-95 ${
                selectedAge === age 
                  ? 'bg-[#D82B5A] border-[#D82B5A]' 
                  : 'bg-white border-gray-200'
              }`}
              onPress={() => setSelectedAge(age)}
            >
              <Text className={`text-xs font-extrabold ${selectedAge === age ? 'text-white' : 'text-[#162E5C]'}`}>
                {age === 'All' ? 'Semua Jenjang Usia' : age}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Catalog Listing Grid */}
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 110 }} showsVerticalScrollIndicator={false} className="max-w-5xl mx-auto w-full">
        {filteredCourses.length > 0 ? (
          <View className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredCourses.map((course) => (
              <View 
                key={course.id} 
                className="bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-xs flex-col justify-between card-hover-effect"
              >
                <View>
                  <View className="w-full h-44 overflow-hidden relative img-zoom-container">
                    <Image source={{ uri: course.image }} className="w-full h-full object-cover" style={{ width: '100%', height: '100%' }} />
                    <View className="absolute top-3 left-3 bg-[#162E5C] px-3 py-1 rounded-full shadow-xs">
                      <Text className="text-[10px] font-black text-white">{course.category}</Text>
                    </View>
                    <View className="absolute top-3 right-3 bg-[#D82B5A] px-3 py-1 rounded-full shadow-xs">
                      <Text className="text-[10px] font-black text-white">{course.ageRange}</Text>
                    </View>
                  </View>

                  <View className="p-5">
                    <Text className="text-base font-extrabold text-[#162E5C] mb-1.5">{course.title}</Text>
                    <Text className="text-xs text-gray-600 leading-relaxed font-medium mb-3">{course.description}</Text>

                    {/* Facilitator info */}
                    {course.facilitator && (
                      <View className="flex-row items-center gap-1.5 mb-3 bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                        <Feather name="user" size={13} color="#D82B5A" />
                        <Text className="text-xs text-gray-600 font-medium">
                          Fasilitator: <Text className="font-extrabold text-[#162E5C]">{course.facilitator}</Text>
                        </Text>
                      </View>
                    )}

                    {/* Kuota Indicator */}
                    <View className="mb-1">
                      {course.seats <= 4 ? (
                        <View className="bg-amber-50 border border-amber-200 px-3 py-1 rounded-full flex-row items-center gap-1.5 self-start">
                          <Feather name="alert-circle" size={12} color="#D97706" />
                          <Text className="text-[10px] font-black text-amber-700">
                            Sisa Kuota Sedikit! Tersisa {course.seats} kursi
                          </Text>
                        </View>
                      ) : (
                        <View className="bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full flex-row items-center gap-1.5 self-start">
                          <Feather name="check-circle" size={12} color="#059669" />
                          <Text className="text-[10px] font-black text-emerald-700">
                            Tersedia: {course.seats} kursi
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>
                </View>

                {/* Price & Action Button */}
                <View className="flex-row justify-between items-center px-5 py-4 bg-gray-50 border-t border-gray-100">
                  <View>
                    <Text className="text-[9px] font-black text-gray-400 uppercase tracking-wider">Harga per Sesi</Text>
                    <Text className="text-base font-extrabold text-[#D82B5A]">
                      Rp {course.price.toLocaleString('id-ID')}
                    </Text>
                  </View>
                  
                  <TouchableOpacity 
                    className="bg-[#D82B5A] py-2.5 px-5 rounded-full shadow-md hover:bg-[#B01E49] transition-transform active:scale-95 flex-row items-center gap-1.5"
                    onPress={() => {
                      setSelectedCourse(course);
                      setModalVisible(true);
                    }}
                  >
                    <Text className="text-white font-extrabold text-xs">Daftar Kelas</Text>
                    <Feather name="arrow-right" size={14} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        ) : (
          <View className="items-center pt-16">
            <Feather name="search" size={32} color="#9CA3AF" />
            <Text className="text-base font-extrabold text-[#162E5C] mt-2">Kelas tidak ditemukan</Text>
            <Text className="text-xs text-gray-500 mt-1">Coba gunakan filter usia atau kata kunci lain!</Text>
          </View>
        )}
      </ScrollView>

      {/* Interactive Checkout Modal */}
      {selectedCourse && (
        <CheckoutModal
          visible={modalVisible}
          course={selectedCourse}
          user={user}
          onClose={() => {
            setModalVisible(false);
            setSelectedCourse(null);
          }}
        />
      )}
    </SafeAreaView>
  );
}
