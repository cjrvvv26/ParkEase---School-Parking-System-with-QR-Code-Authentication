import { useCallback, useEffect, useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  TrendingUp,
  Car,
  Clock,
  CheckCircle,
  XCircle,
  BarChart2,
  Lock,
} from 'lucide-react-native';
import Svg, { Rect, Text as SvgText, Line } from 'react-native-svg';
import { useFocusEffect } from 'expo-router';
import { useSelector } from 'react-redux';
import {
  getSystemSummary,
  getWeeklyScans,
  getRecentActivity,
  getAvgParkingByHour,
} from '../services/reportService';
import useTheme from '../hooks/useTheme';

const EMPTY_BAR_DATA = [
  { label: 'Mon', value: 0 },
  { label: 'Tue', value: 0 },
  { label: 'Wed', value: 0 },
  { label: 'Thu', value: 0 },
  { label: 'Fri', value: 0 },
  { label: 'Sat', value: 0 },
  { label: 'Sun', value: 0 },
];

const PLACEHOLDER_RECENT = [];

function StatCard({
  icon: Icon,
  label,
  value,
  iconBg,
  iconColor,
  sub,
  subColor,
  t,
}) {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: t.card,
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: t.cardBorder,
      }}
    >
      <View
        style={{
          backgroundColor: iconBg,
          padding: 9,
          borderRadius: 12,
          alignSelf: 'flex-start',
          marginBottom: 10,
        }}
      >
        <Icon color={iconColor} size={18} />
      </View>
      <Text style={{ fontFamily: 'Poppins700', fontSize: 22, color: t.text }}>
        {value}
      </Text>
      <Text
        style={{
          fontFamily: 'Poppins500',
          fontSize: 12,
          color: t.textMuted,
          marginTop: 2,
        }}
      >
        {label}
      </Text>
      {sub && (
        <Text
          style={{
            fontFamily: 'Poppins500',
            fontSize: 11,
            color: subColor,
            marginTop: 4,
          }}
        >
          {sub}
        </Text>
      )}
    </View>
  );
}

function BarChart({ t, data = [] }) {
  const chartW = 320,
    chartH = 140,
    barW = 28;
  const chartData = data.length ? data : EMPTY_BAR_DATA;
  const gap = (chartW - chartData.length * barW) / (chartData.length + 1);
  const maxVal = Math.max(...chartData.map((d) => d.value), 1);
  return (
    <Svg width={chartW} height={chartH + 24}>
      {[0, 0.5, 1].map((pct, i) => (
        <Line
          key={i}
          x1={0}
          y1={chartH - pct * chartH}
          x2={chartW}
          y2={chartH - pct * chartH}
          stroke={t.divider}
          strokeWidth={1}
        />
      ))}
      {chartData.map((d, i) => {
        const barH = (d.value / maxVal) * (chartH - 16);
        const x = gap + i * (barW + gap);
        const y = chartH - barH;
        return (
          <Svg key={i}>
            <Rect
              x={x}
              y={y}
              width={barW}
              height={barH}
              rx={6}
              fill={d.value === maxVal ? t.primary : t.primaryBorder}
            />
            <SvgText
              x={x + barW / 2}
              y={chartH + 16}
              textAnchor='middle'
              fontSize={10}
              fontFamily='Poppins500'
              fill={t.textMuted}
            >
              {d.label}
            </SvgText>
          </Svg>
        );
      })}
    </Svg>
  );
}

export default function Analytics() {
  const { t } = useTheme();
  const { user } = useSelector((s) => s.auth);
  const [stats, setStats] = useState({
    totalSlots: 0,
    available: 0,
    occupied: 0,
    avgDuration: '0.0h',
  });
  const [barData, setBarData] = useState(EMPTY_BAR_DATA);
  const [recentActivity, setRecentActivity] = useState(PLACEHOLDER_RECENT);
  const [loadingAnalytics, setLoadingAnalytics] = useState(true);

  const loadAnalytics = async () => {
    setLoadingAnalytics(true);

    const [summaryRes, weeklyRes, recentRes, avgRes] = await Promise.all(
      [
        getSystemSummary(),
        getWeeklyScans(),
        getRecentActivity(),
        getAvgParkingByHour(),
      ].map((p) => p.catch((err) => undefined)),
    );

    console.log('[Analytics] API payloads', {
      summary:
        summaryRes?.status === 200 ? summaryRes.data : summaryRes?.status,
      weekly: weeklyRes?.status === 200 ? weeklyRes.data : weeklyRes?.status,
      recent: recentRes?.status === 200 ? recentRes.data : recentRes?.status,
      avg: avgRes?.status === 200 ? avgRes.data : avgRes?.status,
    });

    if (summaryRes?.status === 200 && summaryRes.data) {
      const { data, occupiedSlots, availableSlots, totalCreatedSlots } =
        summaryRes.data;
      const totalFromData = data?.find(
        (item) => item.title === 'Total Slots',
      )?.data;
      const availableFromData = data?.find(
        (item) => item.title === 'Total Available',
      )?.data;
      const occupiedFromData = data?.find(
        (item) => item.title === 'Total Occupied',
      )?.data;

      setStats((current) => ({
        ...current,
        totalSlots: totalCreatedSlots ?? totalFromData ?? 0,
        available: availableSlots ?? availableFromData ?? 0,
        occupied: occupiedSlots ?? occupiedFromData ?? 0,
      }));
    }

    const weeklyData =
      weeklyRes?.status === 200 ? weeklyRes.data?.data || weeklyRes.data : null;
    if (weeklyData) {
      const labels = weeklyData.labels || [];
      const values = weeklyData.values || [];
      setBarData(
        labels.length
          ? labels.map((label, index) => ({
              label,
              value: values[index] ?? 0,
            }))
          : EMPTY_BAR_DATA,
      );
    } else {
      setBarData(EMPTY_BAR_DATA);
    }

    const recentData =
      recentRes?.status === 200 ? recentRes.data?.data || recentRes.data : null;
    if (Array.isArray(recentData)) {
      setRecentActivity(recentData);
    } else {
      setRecentActivity(PLACEHOLDER_RECENT);
    }

    const avgData =
      avgRes?.status === 200 ? avgRes.data?.data || avgRes.data : null;
    if (avgData?.values?.length) {
      const values = avgData.values || [];
      const averageMinutes =
        values.reduce((sum, next) => sum + Number(next || 0), 0) /
        values.length;
      setStats((current) => ({
        ...current,
        avgDuration: `${(averageMinutes / 60).toFixed(1)}h`,
      }));
    }

    setLoadingAnalytics(false);
  };

  useEffect(() => {
    let mounted = true;

    if (!user?._id) return;

    if (mounted) {
      loadAnalytics();
    }

    const interval = setInterval(() => {
      if (mounted) loadAnalytics();
    }, 60000);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [user?._id]);

  useFocusEffect(
    useCallback(() => {
      loadAnalytics();
    }, [user?._id]),
  );

  if (user?.role === 'guard' && !user?.permissions?.canViewAnalytics) {
    return (
      <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: t.bg }}>
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            paddingHorizontal: 32,
            gap: 16,
          }}
        >
          <View
            style={{
              backgroundColor: t.primaryLight,
              padding: 20,
              borderRadius: 99,
            }}
          >
            <Lock color={t.primary} size={32} />
          </View>
          <Text
            style={{
              fontFamily: 'Poppins700',
              fontSize: 18,
              color: t.text,
              textAlign: 'center',
            }}
          >
            Access Restricted
          </Text>
          <Text
            style={{
              fontFamily: 'Poppins400',
              fontSize: 13,
              color: t.textMuted,
              textAlign: 'center',
              lineHeight: 20,
            }}
          >
            You don't have permission to view analytics. Please contact your
            administrator.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: t.bg }}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View
          style={{ paddingHorizontal: 20, paddingTop: 24, paddingBottom: 8 }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <View
              style={{
                backgroundColor: t.primaryLight,
                padding: 10,
                borderRadius: 14,
              }}
            >
              <TrendingUp color={t.primary} size={20} />
            </View>
            <View>
              <Text
                style={{
                  fontFamily: 'Poppins700',
                  fontSize: 20,
                  color: t.text,
                }}
              >
                Analytics
              </Text>
              <Text
                style={{
                  fontFamily: 'Poppins400',
                  fontSize: 12,
                  color: t.textMuted,
                }}
              >
                Parking overview
              </Text>
            </View>
          </View>
        </View>

        {/* Stat Cards Row 1 */}
        <View
          style={{
            flexDirection: 'row',
            gap: 12,
            marginHorizontal: 20,
            marginTop: 20,
          }}
        >
          <StatCard
            icon={Car}
            label='Total Slots'
            value={stats.totalSlots}
            iconBg={t.primaryLight}
            iconColor={t.primary}
            t={t}
          />
          <StatCard
            icon={CheckCircle}
            label='Available'
            value={stats.available}
            iconBg={t.greenBg}
            iconColor={t.green}
            sub='Live availability'
            subColor={t.green}
            t={t}
          />
        </View>

        {/* Stat Cards Row 2 */}
        <View
          style={{
            flexDirection: 'row',
            gap: 12,
            marginHorizontal: 20,
            marginTop: 12,
          }}
        >
          <StatCard
            icon={XCircle}
            label='Occupied'
            value={stats.occupied}
            iconBg={t.redBg}
            iconColor={t.red}
            sub='Live occupancy'
            subColor={t.red}
            t={t}
          />
          <StatCard
            icon={Clock}
            label='Avg. Duration'
            value={stats.avgDuration}
            iconBg={t.amberBg}
            iconColor={t.amber}
            sub='Average parked time'
            subColor={t.amber}
            t={t}
          />
        </View>

        {/* Occupancy Rate */}
        <View
          style={{
            marginHorizontal: 20,
            marginTop: 20,
            backgroundColor: t.card,
            borderRadius: 16,
            padding: 18,
            borderWidth: 1,
            borderColor: t.cardBorder,
          }}
        >
          <Text
            style={{
              fontFamily: 'Poppins600',
              fontSize: 14,
              color: t.text,
              marginBottom: 12,
            }}
          >
            Occupancy Rate
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <View
              style={{
                flex: 1,
                height: 10,
                backgroundColor: t.bgSecondary,
                borderRadius: 99,
                overflow: 'hidden',
              }}
            >
              <View
                style={{
                  width: `${Math.min(
                    100,
                    stats.totalSlots > 0
                      ? Math.round((stats.occupied / stats.totalSlots) * 100)
                      : 0,
                  )}%`,
                  height: '100%',
                  backgroundColor: t.primary,
                  borderRadius: 99,
                }}
              />
            </View>
            <Text
              style={{
                fontFamily: 'Poppins600',
                fontSize: 13,
                color: t.primary,
              }}
            >
              {stats.totalSlots > 0
                ? `${Math.round((stats.occupied / stats.totalSlots) * 100)}%`
                : '0%'}
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: 8,
            }}
          >
            <Text
              style={{
                fontFamily: 'Poppins400',
                fontSize: 11,
                color: t.textFaint,
              }}
            >
              0%
            </Text>
            <Text
              style={{
                fontFamily: 'Poppins400',
                fontSize: 11,
                color: t.textFaint,
              }}
            >
              100%
            </Text>
          </View>
        </View>

        {/* Weekly Bar Chart */}
        <View
          style={{
            marginHorizontal: 20,
            marginTop: 16,
            backgroundColor: t.card,
            borderRadius: 16,
            padding: 18,
            borderWidth: 1,
            borderColor: t.cardBorder,
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 16,
            }}
          >
            <Text
              style={{ fontFamily: 'Poppins600', fontSize: 14, color: t.text }}
            >
              Weekly Scans
            </Text>
            <View
              style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}
            >
              <View
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: t.primary,
                }}
              />
              <Text
                style={{
                  fontFamily: 'Poppins400',
                  fontSize: 11,
                  color: t.textMuted,
                }}
              >
                Peak day
              </Text>
            </View>
          </View>
          <View style={{ alignItems: 'center' }}>
            {barData.every((item) => item.value === 0) ? (
              <View style={{ paddingVertical: 30 }}>
                <Text
                  style={{
                    fontFamily: 'Poppins400',
                    fontSize: 12,
                    color: t.textMuted,
                  }}
                >
                  No scan activity yet. Data will appear here when scans occur.
                </Text>
              </View>
            ) : (
              <BarChart t={t} data={barData} />
            )}
          </View>
        </View>

        {/* Recent Activity */}
        <View style={{ marginHorizontal: 20, marginTop: 16 }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 8,
              marginBottom: 12,
            }}
          >
            <BarChart2 color={t.primary} size={16} />
            <Text
              style={{ fontFamily: 'Poppins600', fontSize: 14, color: t.text }}
            >
              Recent Activity
            </Text>
          </View>
          <View
            style={{
              backgroundColor: t.card,
              borderRadius: 16,
              borderWidth: 1,
              borderColor: t.cardBorder,
              overflow: 'hidden',
            }}
          >
            {recentActivity.length === 0 ? (
              <View
                style={{
                  paddingVertical: 30,
                  alignItems: 'center',
                }}
              >
                <Text
                  style={{
                    fontFamily: 'Poppins400',
                    fontSize: 12,
                    color: t.textMuted,
                    textAlign: 'center',
                  }}
                >
                  No recent parking activity found yet.
                </Text>
              </View>
            ) : (
              recentActivity.map((item, idx) => (
                <View
                  key={idx}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingHorizontal: 16,
                    paddingVertical: 13,
                    borderBottomWidth: idx < recentActivity.length - 1 ? 1 : 0,
                    borderBottomColor: t.divider,
                  }}
                >
                  <View
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: 4,
                      backgroundColor:
                        item.status === 'occupied' ? t.red : t.green,
                      marginRight: 12,
                    }}
                  />
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        fontFamily: 'Poppins600',
                        fontSize: 13,
                        color: t.text,
                      }}
                    >
                      {item.label}
                    </Text>
                    <Text
                      style={{
                        fontFamily: 'Poppins400',
                        fontSize: 11,
                        color: t.textMuted,
                        marginTop: 1,
                      }}
                    >
                      {item.sub}
                    </Text>
                  </View>
                  <Text
                    style={{
                      fontFamily: 'Poppins400',
                      fontSize: 11,
                      color: t.textFaint,
                    }}
                  >
                    {item.time}
                  </Text>
                </View>
              ))
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
