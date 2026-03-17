import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TrendingUp, Car, Clock, CheckCircle, XCircle, BarChart2 } from 'lucide-react-native';
import Svg, { Rect, Text as SvgText, Line } from 'react-native-svg';
import useTheme from '../hooks/useTheme';

const BAR_DATA = [
  { label: 'Mon', value: 18 }, { label: 'Tue', value: 25 }, { label: 'Wed', value: 30 },
  { label: 'Thu', value: 22 }, { label: 'Fri', value: 35 }, { label: 'Sat', value: 12 }, { label: 'Sun', value: 8 },
];

const RECENT = [
  { label: 'Slot A-01', sub: 'Occupied by student', time: '2m ago', status: 'occupied' },
  { label: 'Slot B-03', sub: 'Released', time: '15m ago', status: 'released' },
  { label: 'Slot A-05', sub: 'Occupied by faculty', time: '32m ago', status: 'occupied' },
  { label: 'Slot C-02', sub: 'Released', time: '1h ago', status: 'released' },
  { label: 'Slot B-07', sub: 'Occupied by student', time: '1h ago', status: 'occupied' },
];

function StatCard({ icon: Icon, label, value, iconBg, iconColor, sub, subColor, t }) {
  return (
    <View style={{ flex: 1, backgroundColor: t.card, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: t.cardBorder }}>
      <View style={{ backgroundColor: iconBg, padding: 9, borderRadius: 12, alignSelf: 'flex-start', marginBottom: 10 }}>
        <Icon color={iconColor} size={18} />
      </View>
      <Text style={{ fontFamily: 'Poppins700', fontSize: 22, color: t.text }}>{value}</Text>
      <Text style={{ fontFamily: 'Poppins500', fontSize: 12, color: t.textMuted, marginTop: 2 }}>{label}</Text>
      {sub && <Text style={{ fontFamily: 'Poppins500', fontSize: 11, color: subColor, marginTop: 4 }}>{sub}</Text>}
    </View>
  );
}

function BarChart({ t }) {
  const chartW = 320, chartH = 140, barW = 28;
  const gap = (chartW - BAR_DATA.length * barW) / (BAR_DATA.length + 1);
  const maxVal = Math.max(...BAR_DATA.map((d) => d.value));
  return (
    <Svg width={chartW} height={chartH + 24}>
      {[0, 0.5, 1].map((pct, i) => (
        <Line key={i} x1={0} y1={chartH - pct * chartH} x2={chartW} y2={chartH - pct * chartH} stroke={t.divider} strokeWidth={1} />
      ))}
      {BAR_DATA.map((d, i) => {
        const barH = (d.value / maxVal) * (chartH - 16);
        const x = gap + i * (barW + gap);
        const y = chartH - barH;
        return (
          <Svg key={i}>
            <Rect x={x} y={y} width={barW} height={barH} rx={6} fill={d.value === maxVal ? t.primary : t.primaryBorder} />
            <SvgText x={x + barW / 2} y={chartH + 16} textAnchor='middle' fontSize={10} fontFamily='Poppins500' fill={t.textMuted}>{d.label}</SvgText>
          </Svg>
        );
      })}
    </Svg>
  );
}

export default function Analytics() {
  const { t } = useTheme();

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: t.bg }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={{ paddingHorizontal: 20, paddingTop: 24, paddingBottom: 8 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <View style={{ backgroundColor: t.primaryLight, padding: 10, borderRadius: 14 }}>
              <TrendingUp color={t.primary} size={20} />
            </View>
            <View>
              <Text style={{ fontFamily: 'Poppins700', fontSize: 20, color: t.text }}>Analytics</Text>
              <Text style={{ fontFamily: 'Poppins400', fontSize: 12, color: t.textMuted }}>Parking overview</Text>
            </View>
          </View>
        </View>

        {/* Stat Cards Row 1 */}
        <View style={{ flexDirection: 'row', gap: 12, marginHorizontal: 20, marginTop: 20 }}>
          <StatCard icon={Car} label='Total Slots' value='48' iconBg={t.primaryLight} iconColor={t.primary} t={t} />
          <StatCard icon={CheckCircle} label='Available' value='19' iconBg={t.greenBg} iconColor={t.green} sub='↑ 3 from yesterday' subColor={t.green} t={t} />
        </View>

        {/* Stat Cards Row 2 */}
        <View style={{ flexDirection: 'row', gap: 12, marginHorizontal: 20, marginTop: 12 }}>
          <StatCard icon={XCircle} label='Occupied' value='29' iconBg={t.redBg} iconColor={t.red} sub='60% occupancy' subColor={t.red} t={t} />
          <StatCard icon={Clock} label='Avg. Duration' value='1.4h' iconBg={t.amberBg} iconColor={t.amber} sub='Per session today' subColor={t.amber} t={t} />
        </View>

        {/* Occupancy Rate */}
        <View style={{ marginHorizontal: 20, marginTop: 20, backgroundColor: t.card, borderRadius: 16, padding: 18, borderWidth: 1, borderColor: t.cardBorder }}>
          <Text style={{ fontFamily: 'Poppins600', fontSize: 14, color: t.text, marginBottom: 12 }}>Occupancy Rate</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <View style={{ flex: 1, height: 10, backgroundColor: t.bgSecondary, borderRadius: 99, overflow: 'hidden' }}>
              <View style={{ width: '60%', height: '100%', backgroundColor: t.primary, borderRadius: 99 }} />
            </View>
            <Text style={{ fontFamily: 'Poppins600', fontSize: 13, color: t.primary }}>60%</Text>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 }}>
            <Text style={{ fontFamily: 'Poppins400', fontSize: 11, color: t.textFaint }}>0%</Text>
            <Text style={{ fontFamily: 'Poppins400', fontSize: 11, color: t.textFaint }}>100%</Text>
          </View>
        </View>

        {/* Weekly Bar Chart */}
        <View style={{ marginHorizontal: 20, marginTop: 16, backgroundColor: t.card, borderRadius: 16, padding: 18, borderWidth: 1, borderColor: t.cardBorder }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <Text style={{ fontFamily: 'Poppins600', fontSize: 14, color: t.text }}>Weekly Scans</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: t.primary }} />
              <Text style={{ fontFamily: 'Poppins400', fontSize: 11, color: t.textMuted }}>Peak day</Text>
            </View>
          </View>
          <View style={{ alignItems: 'center' }}>
            <BarChart t={t} />
          </View>
        </View>

        {/* Recent Activity */}
        <View style={{ marginHorizontal: 20, marginTop: 16 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <BarChart2 color={t.primary} size={16} />
            <Text style={{ fontFamily: 'Poppins600', fontSize: 14, color: t.text }}>Recent Activity</Text>
          </View>
          <View style={{ backgroundColor: t.card, borderRadius: 16, borderWidth: 1, borderColor: t.cardBorder, overflow: 'hidden' }}>
            {RECENT.map((item, idx) => (
              <View key={idx} style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 13, borderBottomWidth: idx < RECENT.length - 1 ? 1 : 0, borderBottomColor: t.divider }}>
                <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: item.status === 'occupied' ? t.red : t.green, marginRight: 12 }} />
                <View style={{ flex: 1 }}>
                  <Text style={{ fontFamily: 'Poppins600', fontSize: 13, color: t.text }}>{item.label}</Text>
                  <Text style={{ fontFamily: 'Poppins400', fontSize: 11, color: t.textMuted, marginTop: 1 }}>{item.sub}</Text>
                </View>
                <Text style={{ fontFamily: 'Poppins400', fontSize: 11, color: t.textFaint }}>{item.time}</Text>
              </View>
            ))}
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}
