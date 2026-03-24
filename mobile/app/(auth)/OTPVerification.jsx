import { useRouter } from 'expo-router';
import { useState, useEffect, useRef } from 'react';
import {
  Text,
  View,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ShieldCheck, Mail } from 'lucide-react-native';
import { useDispatch } from 'react-redux';
import { verifyOtp, resendOtp } from '../services/authService';
import { login } from '../features/authSlicer';
import useApiRequest from '../hooks/useApiRequest';
import api from '../services/api';

const COUNTDOWN = 60;
const DIGITS = 6;

export default function OTPVerification() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { error, loading, execute } = useApiRequest();

  const [digits, setDigits] = useState(Array(DIGITS).fill(''));
  const [countdown, setCountdown] = useState(COUNTDOWN);
  const [canResend, setCanResend] = useState(false);
  const [email, setEmail] = useState('');
  const inputRefs = useRef([]);

  // Load email + guard route
  useEffect(() => {
    const init = async () => {
      const hasVerification = await AsyncStorage.getItem('hasVerification');
      const storedEmail = await AsyncStorage.getItem('email');
      setEmail(storedEmail ?? '');
      if (hasVerification === 'false' || !hasVerification)
        return router.replace('/SignIn');
    };
    init();
  }, []);

  // Countdown timer
  useEffect(() => {
    if (canResend) return;
    if (countdown === 0) {
      setCanResend(true);
      return;
    }
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown, canResend]);

  const handleDigitChange = (text, index) => {
    const cleaned = text.replace(/[^0-9]/g, '').slice(-1);
    const next = [...digits];
    next[index] = cleaned;
    setDigits(next);
    if (cleaned && index < DIGITS - 1) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerification = async () => {
    const otp = digits.join('');
    const res = await execute(verifyOtp, {
      email,
      inputOtp: otp,
      type: 'login',
      platform: 'mobile',
    });
    if (res?.status === 200) {
      await AsyncStorage.removeItem('hasVerification');
      await AsyncStorage.setItem('token', res.data.user.token);
      dispatch(login({ user: res.data.user }));
      if (!res.data.user.termsAccepted) {
        router.replace('/(main)/TermsAndConditions');
      } else {
        router.replace('/(main)/Home');
      }
    }
  };

  const handleResend = async () => {
    if (!canResend) return;
    await execute(resendOtp, { email, type: 'login' });
    setDigits(Array(DIGITS).fill(''));
    setCountdown(COUNTDOWN);
    setCanResend(false);
    inputRefs.current[0]?.focus();
  };

  const maskedEmail = email
    ? email.replace(/(.{2}).+(@.+)/, '$1•••$2')
    : '•••@•••';

  const isFilled = digits.every((d) => d !== '');

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#8e51ff' }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps='handled'
          showsVerticalScrollIndicator={false}
        >
          {/* Hero */}
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              paddingTop: 48,
              paddingBottom: 40,
              gap: 12,
            }}
          >
            <View
              style={{
                backgroundColor: 'rgba(255,255,255,0.2)',
                padding: 18,
                borderRadius: 24,
                marginBottom: 4,
              }}
            >
              <ShieldCheck color='#fff' size={40} strokeWidth={1.5} />
            </View>
            <Text
              style={{
                fontFamily: 'Poppins700',
                fontSize: 26,
                color: '#fff',
                letterSpacing: 0.3,
              }}
            >
              Verify Your Identity
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Mail color='rgba(255,255,255,0.7)' size={14} />
              <Text
                style={{
                  fontFamily: 'Poppins400',
                  fontSize: 13,
                  color: 'rgba(255,255,255,0.75)',
                }}
              >
                Code sent to {maskedEmail}
              </Text>
            </View>
          </View>

          {/* Form Card */}
          <View
            style={{
              flex: 1,
              backgroundColor: '#fff',
              borderTopLeftRadius: 32,
              borderTopRightRadius: 32,
              paddingHorizontal: 28,
              paddingTop: 36,
              paddingBottom: 40,
            }}
          >
            <Text
              style={{
                fontFamily: 'Poppins700',
                fontSize: 22,
                color: '#0e0e11',
                marginBottom: 4,
              }}
            >
              Enter OTP Code
            </Text>
            <Text
              style={{
                fontFamily: 'Poppins400',
                fontSize: 13,
                color: '#71717a',
                marginBottom: 32,
              }}
            >
              Enter the 6-digit code from your email
            </Text>

            {/* 6-digit boxes */}
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginBottom: 28,
              }}
            >
              {digits.map((digit, i) => (
                <TextInput
                  key={i}
                  ref={(r) => (inputRefs.current[i] = r)}
                  value={digit}
                  onChangeText={(t) => handleDigitChange(t, i)}
                  onKeyPress={(e) => handleKeyPress(e, i)}
                  keyboardType='number-pad'
                  maxLength={1}
                  selectTextOnFocus
                  style={{
                    width: 46,
                    height: 56,
                    borderRadius: 14,
                    borderWidth: 1.5,
                    borderColor: digit ? '#8e51ff' : '#e5e7eb',
                    backgroundColor: digit ? '#f0ebff' : '#f9fafb',
                    textAlign: 'center',
                    fontFamily: 'Poppins700',
                    fontSize: 22,
                    color: '#0e0e11',
                  }}
                />
              ))}
            </View>

            {/* Countdown / Resend */}
            <View style={{ alignItems: 'center', marginBottom: 28 }}>
              {canResend ? (
                <Pressable onPress={handleResend}>
                  <Text
                    style={{
                      fontFamily: 'Poppins600',
                      fontSize: 14,
                      color: '#8e51ff',
                      textDecorationLine: 'underline',
                    }}
                  >
                    Resend Code
                  </Text>
                </Pressable>
              ) : (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Text
                    style={{
                      fontFamily: 'Poppins400',
                      fontSize: 13,
                      color: '#71717a',
                    }}
                  >
                    Resend code in
                  </Text>
                  <View
                    style={{
                      backgroundColor: '#f0ebff',
                      paddingHorizontal: 10,
                      paddingVertical: 3,
                      borderRadius: 99,
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: 'Poppins600',
                        fontSize: 13,
                        color: '#8e51ff',
                      }}
                    >
                      {countdown}s
                    </Text>
                  </View>
                </View>
              )}
            </View>

            {/* Error */}
            {error ? (
              <View
                style={{
                  backgroundColor: '#fee2e2',
                  borderRadius: 12,
                  padding: 12,
                  marginBottom: 16,
                }}
              >
                <Text
                  style={{
                    fontFamily: 'Poppins400',
                    fontSize: 13,
                    color: '#dc2626',
                    textAlign: 'center',
                  }}
                >
                  {error}
                </Text>
              </View>
            ) : (
              <View style={{ height: 16 }} />
            )}

            {/* Verify Button */}
            <Pressable
              disabled={loading || !isFilled}
              onPress={handleVerification}
              style={{
                backgroundColor: loading || !isFilled ? '#c4b5fd' : '#8e51ff',
                borderRadius: 14,
                paddingVertical: 16,
                alignItems: 'center',
                marginBottom: 14,
                shadowColor: '#8e51ff',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: loading || !isFilled ? 0 : 0.3,
                shadowRadius: 8,
                elevation: loading || !isFilled ? 0 : 6,
              }}
            >
              <Text
                style={{ fontFamily: 'Poppins600', fontSize: 15, color: '#fff' }}
              >
                {loading ? 'Verifying...' : 'Verify'}
              </Text>
            </Pressable>

            {/* Cancel */}
            <Pressable
              disabled={loading}
              onPress={async () => {
                try {
                  await api.delete('auth/cancel-verification', { data: { email } });
                } catch (_) {}
                await AsyncStorage.removeItem('hasVerification');
                router.replace('/SignIn');
              }}
              style={({ pressed }) => ({
                backgroundColor: pressed ? '#f3f4f6' : '#f9fafb',
                borderRadius: 14,
                paddingVertical: 15,
                alignItems: 'center',
                borderWidth: 1,
                borderColor: '#e5e7eb',
              })}
            >
              <Text
                style={{ fontFamily: 'Poppins500', fontSize: 14, color: '#71717a' }}
              >
                Cancel
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
