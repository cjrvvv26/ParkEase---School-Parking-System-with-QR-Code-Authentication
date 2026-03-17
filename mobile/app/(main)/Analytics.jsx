import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TrendingUp, Car, Clock, CheckCircle, XCircle, BarChart2 } from 'lucide-react-native';
import Svg, { Rect, Text as SvgText, Line } from 'react-native-svg';

const PALETTE = {
  primary: '#8e51ff',
  primaryLight: '#f0ebff',
  primaryBorder: '#c4b5fd',
  dark: '#0e0e11',
  muted: '#71717a',
  border: '#e5e7eb',
  bg: '#f8f7ff',
  white: '#fff',
  green: '#16a34a',
  greenBg: '#dcfce7',
  red: '#dc2626',
  redBg: '#fee2e2',
  amber: '#d97706',
  amberBg: '#fef3c7',
};

const BAR_DATA = [
  { label: 'Mon', value: 18 },
  { label: 'Tue', value: 25 },
  { label: 'Wed', value: 30 },
  { label: 'Thu', value: 22 },
  { label: 'Fri', value: 35 },
  { label: 'Sat', value: 12 },
  { label: 'Sun', value: 8 },
];

const RECENT = [
  { label: 'Slot A-01', sub: 'Occupied by student', time: '2m ago', status: 'occupied' },
  { label: 'Slot B-03', sub: 'Released', time: '15m ago', status: 'released' },
  { label: 'Slot A-05', sub: 'Occupied by faculty', time: '32m ago', status: 'occupied' },
  { label: 'Slot C-02', sub: 'Released', time: '1h ago', status: 'released' },
  { label: 'Slot B-07', sub: 'Occupied by student', time: '1h ago', status: 'occupied' },
];

function StatCard({ icon: Icon, label, value, iconBg, iconColor, sub, subColor }) {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: PALETTE.white,
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: PALETTE.border,
        shadowColor: '#8e51ff',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.07,
        shadowRadius: 6,
        elevation: 2,
      }}
    >
      <View style={{ backgroundColor: iconBg, padding: 9, borderRadius: 12, alignSelf: 'flex-start', marginBottom: 10 }}>
        <Icon color={iconColor} size={18} />
      </View>
      <Text style={{ fontFamily: 'Poppins700', fontSize: 22, color: PALETTE.dark }}>{value}</Text>
      <Text style={{ fontFamily: 'Poppins500', fontSize: 12, color: PALETTE.muted, marginTop: 2 }}>{label}</Text>
      {sub && (
        <Text style={{ fontFamily: 'Poppins500', fontSize: 11, color: subColor ?? PALETTE.green, marginTop: 4 }}>
          {sub}
        </Text>
      )}
    </View>
  );
}

function BarChart() {
  const chartW = 320;
  const chartH = 140;
  const barW = 28;
  const gap = (chartW - BAR_DATA.length * barW) / (BAR_DATA.length + 1);
  const maxVal = Math.max(...BAR_DATA.map((d) => d.value));

  return (
    <Svg width={chartW} height={chartH + 24}>
      {/* Gridlines */}
      {[0, 0.5, 1].map((t, i) => {
        const y = chartH - t * chartH;
        return (
          <Line key={i} x1={0} y1={y} x2={chartW} y2={y} stroke='#f3f4f6' strokeWidth={1} />
        );
      })}
      {BAR_DATA.map((d, i) => {
        const barH = (d.value / maxVal) * (chartH - 16);
        const x = gap + i * (barW + gap);
        const y = chartH - barH;
        const isTop = d.value === maxVal;
        return (
          <Svg key={i}>
            <Rect
              x={x}
              y={y}
              width={barW}
              height={barH}
              rx={6}
              fill={isTop ? PALETTE.primary : PALETTE.primaryBorder}
            />
            <SvgText
              x={x + barW / 2}
              y={chartH + 16}
              textAnchor='middle'
              fontSize={10}
              fontFamily='Poppins500'
              fill={PALETTE.muted}
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
  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: PALETTE.bg }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={{ paddingHorizontal: 20, paddingTop: 24, paddingBottom: 8 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <View style={{ backgroundColor: PALETTE.primaryLight, padding: 10, borderRadius: 14 }}>
              <TrendingUp color={PALETTE.primary} size={20} />
            </View>
            <View>
              <Text style={{ fontFamily: 'Poppins700', fontSize: 20, color: PALETTE.dark }}>Analytics</Text>
              <Text style={{ fontFamily: 'Poppins400', fontSize: 12, color: PALETTE.muted }}>Parking overview</Text>
            </View>
          </View>
        </View>

        {/* Stat Cards Row 1 */}
        <View style={{ flexDirection: 'row', gap: 12, marginHorizontal: 20, marginTop: 20 }}>
          <StatCard
            icon={Car}
            label='Total Slots'
            value='48'
            iconBg={PALETTE.primaryLight}
            iconColor={PALETTE.primary}
          />
          <StatCard
            icon={CheckCircle}
            label='Available'
            value='19'
            iconBg={PALETTE.greenBg}
            iconColor={PALETTE.green}
            sub='↑ 3 from yesterday'
            subColor={PALETTE.green}
          />
        </View>

        {/* Stat Cards Row 2 */}
        <View style={{ flexDirection: 'row', gap: 12, marginHorizontal: 20, marginTop: 12 }}>
          <StatCard
            icon={XCircle}
            label='Occupied'
            value='29'
            iconBg={PALETTE.redBg}
            iconColor={PALETTE.red}
            sub='60% occupancy'
            subColor={PALETTE.red}
          />
          <StatCard
            icon={Clock}
            label='Avg. Duration'
            value='1.4h'
            iconBg={PALETTE.amberBg}
            iconColor={PALETTE.amber}
            sub='Per session today'
            subColor={PALETTE.amber}
          />
        </View>

        {/* Occupancy Rate Bar */}
        <View
          style={{
            marginHorizontal: 20,
            marginTop: 20,
            backgroundColor: PALETTE.white,
            borderRadius: 16,
            padding: 18,
            borderWidth: 1,
            borderColor: PALETTE.border,
            shadowColor: '#8e51ff',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.06,
            shadowRadius: 6,
            elevation: 2,
          }}
        >
          <Text style={{ fontFamily: 'Poppins600', fontSize: 14, color: PALETTE.dark, marginBottom: 12 }}>
            Occupancy Rate
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <View style={{ flex: 1, height: 10, backgroundColor: '#f3f4f6', borderRadius: 99, overflow: 'hidden' }}>
              <View style={{ width: '60%', height: '100%', backgroundColor: PALETTE.primary, borderRadius: 99 }} />
            </View>
            <Text style={{ fontFamily: 'Poppins600', fontSize: 13, color: PALETTE.primary }}>60%</Text>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 }}>
            <Text style={{ fontFamily: 'Poppins400', fontSize: 11, color: PALETTE.muted }}>0%</Text>
            <Text style={{ fontFamily: 'Poppins400', fontSize: 11, color: PALETTE.muted }}>100%</Text>
          </View>
        </View>

        {/* Weekly Bar Chart */}
        <View
          style={{
            marginHorizontal: 20,
            marginTop: 16,
            backgroundColor: PALETTE.white,
            borderRadius: 16,
            padding: 18,
            borderWidth: 1,
            borderColor: PALETTE.border,
            shadowColor: '#8e51ff',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.06,
            shadowRadius: 6,
            elevation: 2,
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <Text style={{ fontFamily: 'Poppins600', fontSize: 14, color: PALETTE.dark }}>Weekly Scans</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: PALETTE.primary }} />
              <Text style={{ fontFamily: 'Poppins400', fontSize: 11, color: PALETTE.muted }}>Peak day</Text>
            </View>
          </View>
          <View style={{ alignItems: 'center' }}>
            <BarChart />
          </View>
        </View>

        {/* Recent Activity */}
        <View style={{ marginHorizontal: 20, marginTop: 16 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <BarChart2 color={PALETTE.primary} size={16} />
            <Text style={{ fontFamily: 'Poppins600', fontSize: 14, color: PALETTE.dark }}>Recent Activity</Text>
          </View>
          <View
            style={{
              backgroundColor: PALETTE.white,
              borderRadius: 16,
              borderWidth: 1,
              borderColor: PALETTE.border,
              overflow: 'hidden',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.04,
              shadowRadius: 6,
              elevation: 2,
            }}
          >
            {RECENT.map((item, idx) => (
              <View
                key={idx}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingHorizontal: 16,
                  paddingVertical: 13,
                  borderBottomWidth: idx < RECENT.length - 1 ? 1 : 0,
                  borderBottomColor: '#f3f4f6',
                }}
              >
                <View
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: item.status === 'occupied' ? PALETTE.red : PALETTE.green,
                    marginRight: 12,
                  }}
                />
                <View style={{ flex: 1 }}>
                  <Text style={{ fontFamily: 'Poppins600', fontSize: 13, color: PALETTE.dark }}>{item.label}</Text>
                  <Text style={{ fontFamily: 'Poppins400', fontSize: 11, color: PALETTE.muted, marginTop: 1 }}>{item.sub}</Text>
                </View>
                <Text style={{ fontFamily: 'Poppins400', fontSize: 11, color: PALETTE.muted }}>{item.time}</Text>
              </View>
            ))}
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}
