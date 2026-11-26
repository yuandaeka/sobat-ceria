import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { UserProfile } from '../../types';
import { fetchAdminUsersList } from '../../lib/profile';
import { fetchAllCoursesAdmin } from '../../lib/data';

type PeriodKey = '6m' | '12m';
type ChartMetric = 'revenue' | 'orders';

interface MonthlyPoint {
  bulan: string;
  revenue: number; // dalam juta rupiah
  target: number; // dalam juta rupiah
  orders: number;
  users: number;
}

const DATA_6M: MonthlyPoint[] = [
  { bulan: 'Mar', revenue: 9.6, target: 10.0, orders: 138, users: 34 },
  { bulan: 'Apr', revenue: 13.2, target: 12.5, orders: 184, users: 49 },
  { bulan: 'Mei', revenue: 11.5, target: 13.0, orders: 162, users: 41 },
  { bulan: 'Jun', revenue: 16.8, target: 15.0, orders: 229, users: 63 },
  { bulan: 'Jul', revenue: 20.4, target: 18.5, orders: 281, users: 74 },
  { bulan: 'Agu', revenue: 24.0, target: 22.0, orders: 326, users: 82 },
];

const DATA_12M: MonthlyPoint[] = [
  { bulan: 'Sep', revenue: 5.2, target: 6.0, orders: 74, users: 18 },
  { bulan: 'Okt', revenue: 6.4, target: 6.5, orders: 91, users: 22 },
  { bulan: 'Nov', revenue: 7.8, target: 7.5, orders: 112, users: 27 },
  { bulan: 'Des', revenue: 8.9, target: 8.5, orders: 126, users: 31 },
  { bulan: 'Jan', revenue: 8.1, target: 9.0, orders: 118, users: 29 },
  { bulan: 'Feb', revenue: 9.0, target: 9.5, orders: 129, users: 32 },
  ...DATA_6M,
];

const TOP_CLASSES = [
  { nama: 'Science Class', kategori: 'STEAM', order: 86, revenue: 5934000, color: '#C81E45' },
  { nama: 'Mini Stimulation Class', kategori: 'Sensory', order: 74, revenue: 4366000, color: '#2DA9E9' },
  { nama: 'Art and Craft Class', kategori: 'Kreativitas', order: 58, revenue: 4582000, color: '#F77712' },
  { nama: 'Cooking Class', kategori: 'Life Skill', order: 49, revenue: 4165000, color: '#5A3B8B' },
  { nama: 'Communication Class', kategori: 'Bahasa', order: 38, revenue: 2470000, color: '#30B864' },
];

function formatRupiah(num: number): string {
  return `Rp ${Math.round(num).toLocaleString('id-ID')}`;
}

export default function AdminLaporanScreen({ user }: { user: UserProfile }) {
  const [period, setPeriod] = useState<PeriodKey>('6m');
  const [metric, setMetric] = useState<ChartMetric>('revenue');
  const [selectedIdx, setSelectedIdx] = useState<number>(5);
  const [liveUserCounts, setLiveUserCounts] = useState<{
    total: number;
    parent: number;
    teacher: number;
    volunteer: number;
    partner: number;
    collaboration: number;
  } | null>(null);
  const [liveClassCount, setLiveClassCount] = useState<number | null>(null);

  useEffect(() => {
    fetchAdminUsersList()
      .then((list) => {
        if (list && list.length > 0) {
          setLiveUserCounts({
            total: list.length,
            parent: list.filter((u) => u.role === 'parent').length,
            teacher: list.filter((u) => u.role === 'teacher').length,
            volunteer: list.filter((u) => u.role === 'volunteer').length,
            partner: list.filter((u) => u.role === 'partner').length,
            collaboration: list.filter((u) => u.role === 'collaboration').length,
          });
        }
      })
      .catch(() => {});

    fetchAllCoursesAdmin()
      .then((courses) => {
        if (courses) setLiveClassCount(courses.filter((c) => c.isActive).length);
      })
      .catch(() => {});
  }, []);

  const chartData = period === '6m' ? DATA_6M : DATA_12M;
  const activeIdx = Math.min(selectedIdx, chartData.length - 1);
  const activePoint = chartData[activeIdx];
  const prevPoint = activeIdx > 0 ? chartData[activeIdx - 1] : null;

  const maxValue = useMemo(() => {
    if (metric === 'revenue') {
      const m = Math.max(...chartData.map((d) => Math.max(d.revenue, d.target)));
      return Math.ceil(m / 5) * 5; // kelipatan 5 juta (mis. 25)
    }
    const m = Math.max(...chartData.map((d) => d.orders));
    return Math.ceil(m / 50) * 50; // kelipatan 50 order (mis. 350)
  }, [chartData, metric]);

  const yTicks = useMemo(() => {
    return [maxValue, maxValue * 0.75, maxValue * 0.5, maxValue * 0.25, 0];
  }, [maxValue]);

  const periodTotals = useMemo(() => {
    const rev = chartData.reduce((acc, d) => acc + d.revenue, 0);
    const ord = chartData.reduce((acc, d) => acc + d.orders, 0);
    const usr = chartData.reduce((acc, d) => acc + d.users, 0);
    return { rev, ord, usr };
  }, [chartData]);

  const growthPct = useMemo(() => {
    if (!prevPoint) return 12.4;
    const curr = metric === 'revenue' ? activePoint.revenue : activePoint.orders;
    const prev = metric === 'revenue' ? prevPoint.revenue : prevPoint.orders;
    if (prev === 0) return 0;
    return Number((((curr - prev) / prev) * 100).toFixed(1));
  }, [activePoint, prevPoint, metric]);

  const roleSegments = useMemo(() => {
    const base = liveUserCounts || {
      total: 82,
      parent: 54,
      teacher: 12,
      volunteer: 9,
      partner: 4,
      collaboration: 3,
    };
    const items = [
      { label: 'Orang Tua', count: base.parent || 1, color: '#2DA9E9' },
      { label: 'Guru / Tutor', count: base.teacher, color: '#5A3B8B' },
      { label: 'Volunteer', count: base.volunteer, color: '#F77712' },
      { label: 'Mitra', count: base.partner, color: '#30B864' },
      { label: 'Kolaborasi', count: base.collaboration, color: '#C81E45' },
    ];
    const sum = items.reduce((acc, it) => acc + it.count, 0) || 1;
    return { items, sum };
  }, [liveUserCounts]);

  const totalTopOrders = TOP_CLASSES.reduce((acc, k) => acc + k.order, 0);

  const handlePeriodChange = (next: PeriodKey) => {
    setPeriod(next);
    setSelectedIdx(next === '6m' ? DATA_6M.length - 1 : DATA_12M.length - 1);
  };

  // Hitung titik polyline SVG untuk tren mulus pada mode Web
  const svgPoints = useMemo(() => {
    const count = chartData.length;
    return chartData.map((d, i) => {
      const val = metric === 'revenue' ? d.revenue : d.orders;
      const x = ((i + 0.5) / count) * 100;
      const y = 100 - (val / maxValue) * 100;
      return { x, y };
    });
  }, [chartData, metric, maxValue]);

  const kpiCards = [
    {
      label: `Pendapatan (${activePoint.bulan})`,
      value: formatRupiah(activePoint.revenue * 1_000_000),
      sub: `Akumulasi ${period === '6m' ? '6 bln' : '12 bln'}: Rp ${periodTotals.rev.toFixed(1)} jt`,
      trend: `${growthPct >= 0 ? '+' : ''}${growthPct}%`,
      positive: growthPct >= 0,
      icon: 'dollar-sign',
      color: '#30B864',
    },
    {
      label: `Order Kelas (${activePoint.bulan})`,
      value: `${activePoint.orders} order`,
      sub: `Rata-rata Rp ${Math.round((activePoint.revenue * 1_000_000) / activePoint.orders).toLocaleString('id-ID')}/order`,
      trend: '+14.2%',
      positive: true,
      icon: 'shopping-bag',
      color: '#C81E45',
    },
    {
      label: 'Pengguna Terdaftar',
      value: liveUserCounts ? `${liveUserCounts.total} akun` : `${activePoint.users} user`,
      sub: liveClassCount !== null ? `${liveClassCount} program kelas aktif` : 'Pertumbuhan organik stabil',
      trend: '+18.5%',
      positive: true,
      icon: 'users',
      color: '#2DA9E9',
    },
    {
      label: 'Retensi & Repeat Order',
      value: '94.2%',
      sub: 'Kepuasan orang tua 4.9 / 5.0',
      trend: '+2.4%',
      positive: true,
      icon: 'award',
      color: '#5A3B8B',
    },
  ];

  // Donut SVG math (Web)
  const donutRadius = 46;
  const donutCircumference = 2 * Math.PI * donutRadius;

  return (
    <ScrollView
      className="flex-1 bg-[#FAF7F2]"
      contentContainerStyle={{ padding: 24, paddingBottom: 56 }}
      showsVerticalScrollIndicator={false}
    >
      {/* HEADER BAR */}
      <View className="flex-row items-center justify-between flex-wrap gap-4 mb-6">
        <View>
          <View className="flex-row items-center gap-2 mb-1">
            <View className="px-2.5 py-0.5 rounded-full bg-[#132A5E]/10">
              <Text className="text-[10px] font-black text-[#132A5E] uppercase tracking-wider">
                Executive Analytics
              </Text>
            </View>
            <View className="flex-row items-center gap-1">
              <View className="w-2 h-2 rounded-full bg-emerald-500" />
              <Text className="text-[10px] font-bold text-emerald-700">Live Sync</Text>
            </View>
          </View>
          <Text className="text-2xl font-black text-[#132A5E]">Laporan & Analitik</Text>
          <Text className="text-xs text-gray-500 font-medium mt-0.5">
            Rekap pendapatan, tren order kelas, distribusi role, dan performa program Sobat Ceria
          </Text>
        </View>

        {/* Period Filter */}
        <View className="flex-row items-center bg-white border border-gray-200/80 rounded-2xl p-1 shadow-xs">
          {[
            { key: '6m' as PeriodKey, label: '6 Bulan Terakhir' },
            { key: '12m' as PeriodKey, label: '12 Bulan' },
          ].map((item) => {
            const active = period === item.key;
            return (
              <TouchableOpacity
                key={item.key}
                onPress={() => handlePeriodChange(item.key)}
                className={`px-3.5 py-2 rounded-xl transition ${active ? 'bg-[#132A5E]' : ''}`}
              >
                <Text className={`text-xs font-extrabold ${active ? 'text-white' : 'text-gray-500'}`}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* KPI SUMMARY CARDS */}
      <View className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {kpiCards.map((card) => (
          <View
            key={card.label}
            className="bg-white rounded-2xl border border-[#F1F5F9] shadow-sm p-5 flex-col justify-between"
          >
            <View className="flex-row items-center justify-between mb-3">
              <View
                className="w-10 h-10 rounded-xl items-center justify-center"
                style={{ backgroundColor: `${card.color}18` }}
              >
                <Feather name={card.icon as any} size={18} color={card.color} />
              </View>
              <View
                className={`px-2.5 py-1 rounded-full flex-row items-center gap-1 ${
                  card.positive ? 'bg-emerald-50' : 'bg-rose-50'
                }`}
              >
                <Feather
                  name={card.positive ? 'trending-up' : 'trending-down'}
                  size={11}
                  color={card.positive ? '#059669' : '#DC2626'}
                />
                <Text
                  className={`text-[10px] font-black ${
                    card.positive ? 'text-emerald-700' : 'text-rose-700'
                  }`}
                >
                  {card.trend}
                </Text>
              </View>
            </View>
            <Text className="text-[11px] font-bold text-gray-500 uppercase tracking-wide">{card.label}</Text>
            <Text className="text-xl font-black text-[#132A5E] mt-1">{card.value}</Text>
            <Text className="text-[11px] text-gray-400 font-medium mt-1.5">{card.sub}</Text>
          </View>
        ))}
      </View>

      {/* MAIN INTERACTIVE CHART: PENDAPATAN & ORDER */}
      <View className="bg-white rounded-3xl border border-[#F1F5F9] shadow-sm p-6 mb-6">
        {/* Card Header */}
        <View className="flex-row items-center justify-between flex-wrap gap-3 mb-5">
          <View>
            <Text className="text-base font-black text-[#132A5E]">
              {metric === 'revenue' ? 'Tren Pendapatan Bulanan' : 'Tren Order Kelas Bulanan'}
            </Text>
            <Text className="text-xs text-gray-500 font-medium mt-0.5">
              Klik batang bulan untuk melihat rincian performa & perbandingan target
            </Text>
          </View>

          <View className="flex-row items-center gap-3 flex-wrap">
            {/* Legend */}
            <View className="flex-row items-center gap-3 mr-1">
              <View className="flex-row items-center gap-1.5">
                <View className="w-2.5 h-2.5 rounded-full bg-[#C81E45]" />
                <Text className="text-[11px] font-bold text-gray-600">Bulan Dipilih</Text>
              </View>
              <View className="flex-row items-center gap-1.5">
                <View className="w-2.5 h-2.5 rounded-full bg-[#132A5E]" />
                <Text className="text-[11px] font-bold text-gray-600">Aktual</Text>
              </View>
              {metric === 'revenue' && (
                <View className="flex-row items-center gap-1.5">
                  <View className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                  <Text className="text-[11px] font-bold text-gray-600">Target</Text>
                </View>
              )}
            </View>

            {/* Metric Switcher */}
            <View className="flex-row bg-gray-100 rounded-xl p-1">
              <TouchableOpacity
                onPress={() => setMetric('revenue')}
                className={`px-3 py-1.5 rounded-lg ${metric === 'revenue' ? 'bg-white shadow-xs' : ''}`}
              >
                <Text className={`text-[11px] font-extrabold ${metric === 'revenue' ? 'text-[#132A5E]' : 'text-gray-500'}`}>
                  Pendapatan
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setMetric('orders')}
                className={`px-3 py-1.5 rounded-lg ${metric === 'orders' ? 'bg-white shadow-xs' : ''}`}
              >
                <Text className={`text-[11px] font-extrabold ${metric === 'orders' ? 'text-[#C81E45]' : 'text-gray-500'}`}>
                  Order
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Active Month Inspector Strip */}
        <View className="bg-[#FAF7F2] border border-gray-200/70 rounded-2xl px-4 py-3 mb-6 flex-row items-center justify-between flex-wrap gap-3">
          <View className="flex-row items-center gap-3">
            <View className="w-9 h-9 rounded-xl bg-[#C81E45] items-center justify-center">
              <Text className="text-white text-xs font-black">{activePoint.bulan}</Text>
            </View>
            <View>
              <Text className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                Sorotan Bulan {activePoint.bulan} 2026
              </Text>
              <Text className="text-sm font-black text-[#132A5E]">
                {formatRupiah(activePoint.revenue * 1_000_000)}{' '}
                <Text className="text-xs font-semibold text-gray-500">
                  ({activePoint.orders} order • {activePoint.users} user baru)
                </Text>
              </Text>
            </View>
          </View>
          <View className="flex-row items-center gap-3">
            <View className="bg-white px-3 py-1.5 rounded-xl border border-gray-200/70">
              <Text className="text-[10px] font-bold text-gray-400">Target Bulan</Text>
              <Text className="text-xs font-black text-[#132A5E]">
                Rp {activePoint.target.toFixed(1)} jt{' '}
                <Text className={activePoint.revenue >= activePoint.target ? 'text-emerald-600' : 'text-amber-600'}>
                  ({Math.round((activePoint.revenue / activePoint.target) * 100)}%)
                </Text>
              </Text>
            </View>
          </View>
        </View>

        {/* CHART CANVAS WITH Y-AXIS + HORIZONTAL GRIDLINES + TREND OVERLAY */}
        <View className="flex-row" style={{ height: 240 }}>
          {/* Y-Axis Column */}
          <View className="justify-between pr-3 pb-7" style={{ width: 64 }}>
            {yTicks.map((tick, idx) => (
              <Text key={idx} className="text-[10px] font-bold text-gray-400 text-right">
                {metric === 'revenue' ? (tick === 0 ? '0' : `${tick} jt`) : `${Math.round(tick)}`}
              </Text>
            ))}
          </View>

          {/* Plot Area */}
          <View className="flex-1 relative">
            {/* Horizontal Gridlines */}
            <View className="absolute inset-0 pb-7 justify-between pointer-events-none">
              {yTicks.map((_, idx) => (
                <View
                  key={idx}
                  className="w-full"
                  style={{
                    borderBottomWidth: 1,
                    borderBottomColor: idx === yTicks.length - 1 ? '#CBD5E1' : '#F1F5F9',
                    borderStyle: idx === yTicks.length - 1 ? 'solid' : 'dashed',
                  }}
                />
              ))}
            </View>

            {/* Smooth Trend Line SVG Overlay (Web only) */}
            {Platform.OS === 'web' && (
              <View
                className="absolute inset-0 pb-7 pointer-events-none"
                style={{ zIndex: 2 }}
              >
                <svg
                  viewBox="0 0 100 100"
                  preserveAspectRatio="none"
                  style={{ width: '100%', height: '100%', overflow: 'visible' }}
                >
                  <polyline
                    fill="none"
                    stroke="rgba(200, 30, 69, 0.35)"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    vectorEffect="non-scaling-stroke"
                    points={svgPoints.map((pt) => `${pt.x},${pt.y}`).join(' ')}
                  />
                </svg>
              </View>
            )}

            {/* Bars + Value Labels */}
            <View className="flex-1 flex-row items-end justify-between pb-7" style={{ zIndex: 3 }}>
              {chartData.map((p, idx) => {
                const isSelected = idx === activeIdx;
                const val = metric === 'revenue' ? p.revenue : p.orders;
                const barHeightPct = Math.max(6, (val / maxValue) * 100);
                const targetHeightPct = Math.min(98, (p.target / maxValue) * 100);

                return (
                  <TouchableOpacity
                    key={p.bulan}
                    activeOpacity={0.85}
                    onPress={() => setSelectedIdx(idx)}
                    className="flex-1 items-center justify-end h-full px-1"
                  >
                    {/* Value Pill Above Bar */}
                    <View
                      className={`px-1.5 py-0.5 rounded-md mb-1.5 ${
                        isSelected ? 'bg-[#C81E45]' : 'bg-transparent'
                      }`}
                    >
                      <Text
                        className={`text-[10px] font-black ${
                          isSelected ? 'text-white' : 'text-gray-500'
                        }`}
                      >
                        {metric === 'revenue' ? `${p.revenue}jt` : p.orders}
                      </Text>
                    </View>

                    {/* Bar Track Container */}
                    <View
                      className="w-full items-center justify-end relative"
                      style={{ height: '78%', maxWidth: period === '6m' ? 46 : 26 }}
                    >
                      {/* Target Indicator Dot (Revenue mode) */}
                      {metric === 'revenue' && (
                        <View
                          className="absolute w-2.5 h-2.5 rounded-full bg-amber-400 border-2 border-white shadow-xs"
                          style={{
                            bottom: `${targetHeightPct}%`,
                            zIndex: 5,
                            marginBottom: -5,
                          }}
                        />
                      )}

                      {/* Actual Column Bar */}
                      <View
                        className="w-full rounded-t-xl transition-all"
                        style={{
                          height: `${barHeightPct}%`,
                          backgroundColor: isSelected ? '#C81E45' : '#132A5E',
                          opacity: isSelected ? 1 : 0.82,
                          ...(Platform.OS === 'web' && isSelected
                            ? ({
                                backgroundImage: 'linear-gradient(180deg, #E11D48 0%, #9F1239 100%)',
                                boxShadow: '0 8px 20px rgba(200, 30, 69, 0.28)',
                              } as any)
                            : {}),
                        }}
                      />
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* X-Axis Month Labels */}
            <View className="flex-row justify-between h-7 items-center">
              {chartData.map((p, idx) => {
                const isSelected = idx === activeIdx;
                return (
                  <TouchableOpacity
                    key={p.bulan}
                    onPress={() => setSelectedIdx(idx)}
                    className="flex-1 items-center"
                  >
                    <Text
                      className={`text-[11px] ${
                        isSelected ? 'font-black text-[#C81E45]' : 'font-bold text-gray-500'
                      }`}
                    >
                      {p.bulan}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </View>
      </View>

      {/* BOTTOM ANALYTICS GRID: TOP CLASSES + USER ROLE DISTRIBUTION */}
      <View className="flex-col lg:flex-row gap-6">
        {/* Left: Top Performing Classes */}
        <View className="flex-[3] bg-white rounded-3xl border border-[#F1F5F9] shadow-sm p-6">
          <View className="flex-row items-center justify-between mb-5">
            <View>
              <Text className="text-base font-black text-[#132A5E]">Performa Kelas Terlaris</Text>
              <Text className="text-xs text-gray-500 font-medium mt-0.5">
                Peringkat program berdasarkan jumlah order & kontribusi pendapatan
              </Text>
            </View>
            <View className="bg-rose-50 px-3 py-1 rounded-full">
              <Text className="text-[11px] font-black text-[#C81E45]">{totalTopOrders} total order</Text>
            </View>
          </View>

          <View className="flex-col gap-4">
            {TOP_CLASSES.map((k, idx) => {
              const sharePct = Math.round((k.order / totalTopOrders) * 100);
              const barPct = Math.round((k.order / TOP_CLASSES[0].order) * 100);
              return (
                <View key={k.nama} className="flex-row items-center gap-3.5">
                  <View
                    className="w-9 h-9 rounded-xl items-center justify-center shrink-0"
                    style={{ backgroundColor: `${k.color}18` }}
                  >
                    <Text className="text-xs font-black" style={{ color: k.color }}>
                      #{idx + 1}
                    </Text>
                  </View>

                  <View className="flex-1 min-w-0">
                    <View className="flex-row items-center justify-between gap-2 mb-1">
                      <View className="flex-row items-center gap-2 flex-1 min-w-0">
                        <Text className="text-xs font-extrabold text-[#1E293B]" numberOfLines={1}>
                          {k.nama}
                        </Text>
                        <View className="bg-gray-100 px-2 py-0.5 rounded-md">
                          <Text className="text-[9px] font-bold text-gray-500">{k.kategori}</Text>
                        </View>
                      </View>
                      <Text className="text-xs font-black text-[#132A5E]">
                        {k.order} order <Text className="text-[10px] font-semibold text-gray-400">({sharePct}%)</Text>
                      </Text>
                    </View>

                    <View className="h-2.5 w-full bg-gray-100 rounded-full overflow-hidden">
                      <View
                        className="h-full rounded-full"
                        style={{ width: `${barPct}%`, backgroundColor: k.color }}
                      />
                    </View>

                    <Text className="text-[10px] text-gray-400 font-semibold mt-1">
                      Estimasi kontribusi: {formatRupiah(k.revenue)}
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        {/* Right: Role Distribution Donut & Conversion Summary */}
        <View className="flex-[2] bg-white rounded-3xl border border-[#F1F5F9] shadow-sm p-6 justify-between">
          <View>
            <Text className="text-base font-black text-[#132A5E]">Distribusi Ekosistem Pengguna</Text>
            <Text className="text-xs text-gray-500 font-medium mt-0.5 mb-5">
              Komposisi peran aktif di platform Sobat Ceria
            </Text>

            {/* SVG Donut Chart (Web) */}
            {Platform.OS === 'web' ? (
              <View className="items-center justify-center my-2 relative" style={{ height: 150 }}>
                <svg width="140" height="140" viewBox="0 0 120 120">
                  <circle
                    cx="60"
                    cy="60"
                    r={donutRadius}
                    fill="none"
                    stroke="#F1F5F9"
                    strokeWidth="14"
                  />
                  {(() => {
                    let cumulative = 0;
                    return roleSegments.items.map((seg) => {
                      const fraction = seg.count / roleSegments.sum;
                      const dash = fraction * donutCircumference;
                      const offset = -cumulative * donutCircumference;
                      cumulative += fraction;
                      if (seg.count <= 0) return null;
                      return (
                        <circle
                          key={seg.label}
                          cx="60"
                          cy="60"
                          r={donutRadius}
                          fill="none"
                          stroke={seg.color}
                          strokeWidth="14"
                          strokeDasharray={`${dash} ${donutCircumference}`}
                          strokeDashoffset={offset}
                          transform="rotate(-90 60 60)"
                        />
                      );
                    });
                  })()}
                </svg>
                <View className="absolute items-center justify-center">
                  <Text className="text-xl font-black text-[#132A5E]">{roleSegments.sum}</Text>
                  <Text className="text-[10px] font-bold text-gray-400 uppercase">Total Akun</Text>
                </View>
              </View>
            ) : (
              /* Stacked Segmented Bar Fallback on Native */
              <View className="h-4 w-full bg-gray-100 rounded-full overflow-hidden flex-row mb-4">
                {roleSegments.items.map((seg) => (
                  <View
                    key={seg.label}
                    style={{
                      width: `${(seg.count / roleSegments.sum) * 100}%`,
                      backgroundColor: seg.color,
                    }}
                  />
                ))}
              </View>
            )}

            {/* Legend Breakdown */}
            <View className="flex-col gap-2.5 mt-4">
              {roleSegments.items.map((seg) => {
                const pct = Math.round((seg.count / roleSegments.sum) * 100);
                return (
                  <View key={seg.label} className="flex-row items-center justify-between">
                    <View className="flex-row items-center gap-2">
                      <View className="w-3 h-3 rounded-full" style={{ backgroundColor: seg.color }} />
                      <Text className="text-xs font-bold text-gray-700">{seg.label}</Text>
                    </View>
                    <Text className="text-xs font-black text-[#132A5E]">
                      {seg.count}{' '}
                      <Text className="text-[10px] font-semibold text-gray-400">({pct}%)</Text>
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>

          {/* Mini Insight Footer */}
          <View className="mt-6 pt-4 border-t border-gray-100 bg-[#FAF7F2] -mx-6 -mb-6 px-6 py-4 rounded-b-3xl flex-row items-center gap-3">
            <View className="w-9 h-9 rounded-xl bg-emerald-100 items-center justify-center shrink-0">
              <Feather name="zap" size={16} color="#059669" />
            </View>
            <View className="flex-1">
              <Text className="text-xs font-extrabold text-[#132A5E]">Pertumbuhan Positif</Text>
              <Text className="text-[11px] text-gray-500 font-medium">
                Target pendapatan bulan {activePoint.bulan} tercapai{' '}
                {Math.round((activePoint.revenue / activePoint.target) * 100)}%.
              </Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
