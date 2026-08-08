import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { Course } from '../types';
import CheckoutModal from '../components/CheckoutModal';

// 8 Program Kelas Resmi dengan gambar aset
const PROGRAM_COURSES: Course[] = [
  {
    id: '1',
    title: 'Mini Stimulation Class',
    category: 'Mini Stimulation',
    ageRange: '2-3 Thn',
    price: 59000,
    seats: 12,
    image: 'minstim',
    description: 'Melatih seluruh aspek perkembangan melalui permainan edukatif.',
    facilitator: 'Bunda Sarah, M.Psi',
  },
  {
    id: '2',
    title: 'Communication Class',
    category: 'Communication',
    ageRange: '2-4 Thn',
    price: 65000,
    seats: 4,
    image: 'communication',
    description: 'Mengembangkan kemampuan komunikasi, bahasa, dan public speaking anak.',
    facilitator: 'Bunda Sarah, M.Psi',
  },
  {
    id: '3',
    title: 'Seminar Parenting',
    category: 'Parenting',
    ageRange: 'Ortu',
    price: 49000,
    seats: 25,
    image: 'seminarparenting',
    description: 'Edukasi interaktif bersama para ahli untuk membantu orang tua memahami dan mendampingi tumbuh kembang anak secara optimal.',
    facilitator: 'Dr. Anita, Sp.A & Tim Psikolog',
  },
  {
    id: '4',
    title: 'Art and Craft Class',
    category: 'Art & Craft',
    ageRange: '2-5 Thn',
    price: 79000,
    seats: 8,
    image: 'art',
    description: 'Mengembangkan kreativitas, motorik halus, dan imajinasi.',
    facilitator: 'Kak Rian, S.Sn',
  },
  {
    id: '5',
    title: 'Science Class',
    category: 'Science Class',
    ageRange: '3-7 Thn',
    price: 69000,
    seats: 15,
    image: 'science',
    description: 'Eksperimen sains sederhana berbasis STEAM.',
    facilitator: 'Kak Rian, S.Sn',
  },
  {
    id: '6',
    title: 'Pottery Class',
    category: 'Pottery Class',
    ageRange: '3-7 Thn',
    price: 75000,
    seats: 6,
    image: 'pottery',
    description: 'Mengembangkan kreativitas, konsentrasi, koordinasi tangan, dan regulasi emosi.',
    facilitator: 'Kak Rian, S.Sn',
  },
  {
    id: '7',
    title: 'Cooking Class',
    category: 'Cooking Class',
    ageRange: '3-7 Thn',
    price: 85000,
    seats: 10,
    image: 'cooking',
    description: 'Melatih kemandirian, life skill, numerasi, dan sensorik.',
    facilitator: 'Bunda Sarah, M.Psi',
  },
  {
    id: '8',
    title: 'Outbond Ceria',
    category: 'Outbond',
    ageRange: '2-7 Thn',
    price: 69000,
    seats: 12,
    image: 'outbond',
    description: 'Permainan fisik aktif & rintangan motorik kasar anak.',
    facilitator: 'Tim Fasilitator Sobat Ceria',
  },
];

const getProgramImage = (key: string) => {
  const images: Record<string, any> = {
    minstim: require('../assets/dokumentasi sobat/ministimulation-program.jpeg'),
    communication: require('../assets/dokumentasi sobat/communication-program.jpeg'),
    seminarparenting: require('../assets/dokumentasi sobat/seminarparenting-program.jpeg'),
    art: require('../assets/dokumentasi sobat/program-art.jpeg'),
    science: require('../assets/dokumentasi sobat/program-science.jpeg'),
    pottery: require('../assets/dokumentasi sobat/poetry-program.jpeg'),
    cooking: require('../assets/dokumentasi sobat/cooking-program.jpeg'),
    outbond: require('../assets/dokumentasi sobat/outbondceria-program.jpeg'),
  };
  return images[key];
};

export default function CatalogScreen({ navigation, user }: { navigation: any; user: any }) {
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  return (
    <SafeAreaView style={{ flex: 1 }} className="bg-[#FAFDFB]">
      <ScrollView contentContainerStyle={{ paddingBottom: 110 }} className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="px-5 pt-4 pb-4 bg-white border-b border-rose-50">
          <View className="flex-row items-center gap-2 mb-1">
            <View className="w-2.5 h-2.5 rounded-full bg-[#D82B5A]" />
            <Text className="text-lg md:text-xl font-extrabold text-[#1F2937]">Katalog 8 Program Kelas</Text>
          </View>
          <Text className="text-xs text-gray-500 font-medium">
            Pilih kelas stimulasi terpadu untuk buah hati Anda (Laboratorium FKIP UMS Lantai 2).
          </Text>
        </View>

        {/* Catalog Grid */}
        <View className="p-5 max-w-5xl mx-auto w-full">
          <View className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {PROGRAM_COURSES.map((course) => (
              <View
                key={course.id}
                className="bg-white rounded-[2rem] overflow-hidden border border-gray-100 shadow-xs flex-col justify-between"
              >
                <View>
                  <View className="w-full h-44 overflow-hidden relative">
                    <Image
                      source={getProgramImage(course.image)}
                      className="w-full h-full object-cover"
                      style={{ width: '100%', height: '100%' }}
                    />
                    <View className="absolute top-3 left-3 bg-[#1F2937] px-3 py-1 rounded-full shadow-xs">
                      <Text className="text-[10px] font-black text-white">{course.category}</Text>
                    </View>
                    <View className="absolute top-3 right-3 bg-[#D82B5A] px-3 py-1 rounded-full shadow-xs">
                      <Text className="text-[10px] font-black text-white">{course.ageRange}</Text>
                    </View>
                  </View>

                  <View className="p-5">
                    <Text className="text-base font-extrabold text-[#1F2937] mb-1.5">{course.title}</Text>
                    <Text className="text-xs text-gray-600 leading-relaxed font-medium mb-3">{course.description}</Text>

                    {course.facilitator && (
                      <View className="flex-row items-center gap-1.5 mb-3 bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                        <Feather name="user" size={13} color="#D82B5A" />
                        <Text className="text-xs text-gray-600 font-medium">
                          Fasilitator: <Text className="font-extrabold text-[#1F2937]">{course.facilitator}</Text>
                        </Text>
                      </View>
                    )}

                    <View className="mb-1">
                      {course.seats <= 4 ? (
                        <View className="bg-amber-50 border border-amber-200 px-3 py-1 rounded-full flex-row items-center gap-1.5 self-start">
                          <Feather name="alert-circle" size={12} color="#D97706" />
                          <Text className="text-[10px] font-black text-amber-700">
                            Sisa Kuota Sedikit! Tersisa {course.seats} kursi
                          </Text>
                        </View>
                      ) : (
                        <View className="bg-rose-50 border border-rose-200 px-3 py-1 rounded-full flex-row items-center gap-1.5 self-start">
                          <Feather name="check-circle" size={12} color="#059669" />
                          <Text className="text-[10px] font-black text-rose-700">
                            Tersedia: {course.seats} kursi
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>
                </View>

                <View className="flex-row justify-between items-center px-5 py-4 bg-gray-50 border-t border-gray-100">
                  <View>
                    <Text className="text-[9px] font-black text-gray-400 uppercase tracking-wider">Harga per Sesi</Text>
                    <Text className="text-base font-extrabold text-[#D82B5A]">
                      Rp {course.price.toLocaleString('id-ID')}
                    </Text>
                  </View>

                  <TouchableOpacity
                    className="bg-[#D82B5A] py-2.5 px-5 rounded-full shadow-md active:scale-95 transition-transform flex-row items-center gap-1.5"
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
        </View>
      </ScrollView>

      {/* Checkout Modal */}
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
