import { useState } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ShieldCheck } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../features/authSlicer';
import { acceptTerms } from '../services/authService';
import useApiRequest from '../hooks/useApiRequest';
import useTheme from '../hooks/useTheme';

const SECTIONS = [
  {
    title: '1. Acceptance of Terms',
    body: 'By accessing and using the School Parking System, you agree to be bound by these Terms and Conditions. If you do not agree, you may not use the application.',
  },
  {
    title: '2. Use of the System',
    body: 'This system is exclusively for authorized students and faculty of the institution. Your account is personal and non-transferable. You are responsible for all activity under your account.',
  },
  {
    title: '3. QR Code & Parking Slots',
    body: 'Your QR code is used to record entry and exit from school premises. Misuse of QR codes, including sharing or tampering, may result in account suspension.',
  },
  {
    title: '4. Data Privacy',
    body: 'We collect and process your personal information (name, email, motorcycle details) solely for parking management purposes. Your data will not be shared with third parties without your consent, except as required by law.',
  },
  {
    title: '5. Account Responsibility',
    body: 'You must keep your login credentials secure. Report any unauthorized access immediately. The institution is not liable for losses resulting from failure to protect your credentials.',
  },
  {
    title: '6. Violations & Penalties',
    body: 'Violations of parking rules tracked through this system may result in penalties, suspension of parking privileges, or disciplinary action in accordance with institutional policies.',
  },
  {
    title: '7. Changes to Terms',
    body: 'The institution reserves the right to update these terms at any time. Continued use of the system after changes constitutes acceptance of the revised terms.',
  },
];

export default function TermsAndConditions() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);
  const { t } = useTheme();
  const { loading, execute } = useApiRequest();
  const [scrolledToBottom, setScrolledToBottom] = useState(false);

  const handleScroll = ({ nativeEvent }) => {
    const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
    const isBottom =
      layoutMeasurement.height + contentOffset.y >= contentSize.height - 32;
    if (isBottom) setScrolledToBottom(true);
  };

  const handleAccept = async () => {
    const res = await execute(acceptTerms);
    if (res?.status === 200) {
      dispatch(login({ user: { ...user, termsAccepted: true } }));
      router.replace('/(main)/Home');
    }
  };

  return (
    <SafeAreaView
      edges={['top', 'bottom']}
      style={{ flex: 1, backgroundColor: t.bg }}
    >
      {/* Header */}
      <View
        style={{
          paddingHorizontal: 24,
          paddingTop: 24,
          paddingBottom: 16,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 12,
        }}
      >
        <View
          style={{
            backgroundColor: t.primaryLight,
            padding: 10,
            borderRadius: 12,
          }}
        >
          <ShieldCheck color={t.primary} size={22} strokeWidth={1.5} />
        </View>
        <View>
          <Text
            style={{ fontFamily: 'Poppins700', fontSize: 18, color: t.text }}
          >
            Terms & Conditions
          </Text>
          <Text
            style={{
              fontFamily: 'Poppins400',
              fontSize: 12,
              color: t.textMuted,
            }}
          >
            Please read carefully before continuing
          </Text>
        </View>
      </View>

      {/* Scrollable content */}
      <ScrollView
        style={{ flex: 1, paddingHorizontal: 24 }}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={{
            backgroundColor: t.card,
            borderRadius: 16,
            borderWidth: 1,
            borderColor: t.cardBorder,
            padding: 20,
            marginBottom: 16,
          }}
        >
          <Text
            style={{
              fontFamily: 'Poppins400',
              fontSize: 13,
              color: t.textMuted,
              lineHeight: 20,
              marginBottom: 16,
            }}
          >
            Welcome to the School Parking System. These terms govern your use of
            the application. Scroll to the bottom to accept.
          </Text>
          {SECTIONS.map((s, i) => (
            <View
              key={i}
              style={{ marginBottom: i < SECTIONS.length - 1 ? 20 : 0 }}
            >
              <Text
                style={{
                  fontFamily: 'Poppins600',
                  fontSize: 13,
                  color: t.text,
                  marginBottom: 6,
                }}
              >
                {s.title}
              </Text>
              <Text
                style={{
                  fontFamily: 'Poppins400',
                  fontSize: 13,
                  color: t.textMuted,
                  lineHeight: 20,
                }}
              >
                {s.body}
              </Text>
            </View>
          ))}
        </View>

        {!scrolledToBottom && (
          <Text
            style={{
              textAlign: 'center',
              fontFamily: 'Poppins400',
              fontSize: 12,
              color: t.textFaint,
              marginBottom: 16,
            }}
          >
            Scroll down to read all terms
          </Text>
        )}
      </ScrollView>

      {/* Accept button */}
      <View
        style={{
          paddingHorizontal: 24,
          paddingTop: 12,
          paddingBottom: 8,
          borderTopWidth: 1,
          borderTopColor: t.cardBorder,
        }}
      >
        <Pressable
          onPress={handleAccept}
          disabled={!scrolledToBottom || loading}
          style={{
            backgroundColor:
              scrolledToBottom && !loading ? t.primary : t.cardBorder,
            borderRadius: 14,
            paddingVertical: 16,
            alignItems: 'center',
            shadowColor: t.primary,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: scrolledToBottom ? 0.3 : 0,
            shadowRadius: 8,
            elevation: scrolledToBottom ? 6 : 0,
          }}
        >
          <Text
            style={{
              fontFamily: 'Poppins600',
              fontSize: 15,
              color: scrolledToBottom && !loading ? '#fff' : t.textFaint,
            }}
          >
            {loading ? 'Accepting...' : 'I Accept the Terms & Conditions'}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
