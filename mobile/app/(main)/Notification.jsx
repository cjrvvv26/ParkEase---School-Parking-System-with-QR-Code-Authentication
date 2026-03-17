import { useRouter } from 'expo-router';
import { ChevronLeft, Bell } from 'lucide-react-native';
import { useState } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import useTheme from '../hooks/useTheme';

const FILTERS = ['All', 'Unread', 'Read'];

const MOCK = [
  { title: 'Account Updated', message: 'Your account has been successfully updated by the admin.', time: '2m ago', read: false },
  { title: 'Payment Verified', message: "Your payment has been verified. You're now eligible for an exclusive slot.", time: '1h ago', read: false },
  { title: 'Slot Available', message: 'A new parking slot has opened up in Building A.', time: '3h ago', read: true },
  { title: 'Semester Started', message: 'The new semester has officially started. Check your slot status.', time: 'Yesterday', read: true },
];

export default function Notification() {
  const router = useRouter();
  const [selectedOption, setSelectedOption] = useState('All');
  const { t } = useTheme();

  const filtered = MOCK.filter((n) => {
    if (selectedOption === 'Unread') return !n.read;
    if (selectedOption === 'Read') return n.read;
    return true;
  });

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: t.bg }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 32 }} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 20, paddingBottom: 20 }}>
          <Pressable
            onPress={() => router.push('/Home')}
            style={{ backgroundColor: t.headerBtn, padding: 8, borderRadius: 12, borderWidth: 1, borderColor: t.headerBtnBorder, position: 'absolute', left: 20, top: 15, zIndex: 1 }}
          >
            <ChevronLeft color={t.text} size={22} />
          </Pressable>
          <Text style={{ flex: 1, textAlign: 'center', fontFamily: 'Poppins700', fontSize: 20, color: t.text }}>Notifications</Text>
        </View>

        {/* Filter Tabs */}
        <View style={{ flexDirection: 'row', marginHorizontal: 20, backgroundColor: t.filterBar, borderRadius: 12, padding: 4, marginBottom: 16 }}>
          {FILTERS.map((label) => (
            <Pressable
              key={label}
              onPress={() => setSelectedOption(label)}
              style={{
                flex: 1, paddingVertical: 8, borderRadius: 10, alignItems: 'center',
                backgroundColor: selectedOption === label ? t.primary : 'transparent',
                shadowColor: selectedOption === label ? t.primary : 'transparent',
                shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4,
                elevation: selectedOption === label ? 3 : 0,
              }}
            >
              <Text style={{ fontFamily: 'Poppins600', fontSize: 13, color: selectedOption === label ? '#fff' : t.textMuted }}>
                {label}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Items */}
        <View style={{ marginHorizontal: 20, gap: 10 }}>
          {filtered.map((notif, i) => (
            <Pressable
              key={i}
              style={{
                backgroundColor: t.card, borderRadius: 16, padding: 16,
                flexDirection: 'row', alignItems: 'flex-start', gap: 12,
                borderWidth: 1, borderColor: notif.read ? t.cardBorder : t.cardBorderActive,
              }}
            >
              <View style={{ backgroundColor: notif.read ? t.bgSecondary : t.primaryLight, padding: 10, borderRadius: 12 }}>
                <Bell color={notif.read ? t.textFaint : t.primary} size={18} />
              </View>
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                  <Text style={{ fontFamily: 'Poppins600', fontSize: 14, color: t.text }}>{notif.title}</Text>
                  <Text style={{ fontFamily: 'Poppins400', fontSize: 11, color: t.textFaint }}>{notif.time}</Text>
                </View>
                <Text style={{ fontFamily: 'Poppins400', fontSize: 13, color: t.textMuted, lineHeight: 18 }} numberOfLines={2}>
                  {notif.message}
                </Text>
              </View>
              {!notif.read && <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: t.primary, marginTop: 4 }} />}
            </Pressable>
          ))}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}
