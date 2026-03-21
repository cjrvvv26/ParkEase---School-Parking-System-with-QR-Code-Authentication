import {
  View, Text, TextInput, Pressable,
  KeyboardAvoidingView, Platform, ScrollView,
} from 'react-native';
import { useState, useEffect, useRef } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ShieldCheck, Mail } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';
import useTheme from '../hooks/useTheme';

const DIGITS = 6;
const COUNTDOWN = 60;

export default function ForgotOTP() {
  const router = useRouter();
  const { t } = useTheme();
  const [email, setEmail] = useState('');
  const [digits, setDigits] = useState(Array(DIGITS).fill(''));
  const [countdown, setCountdown] = useState(COUNTDOWN);
  const [canResend, setCanResend] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const inputRefs = useRef([]);

  useEffect(() => {
    const init = async () => {
      const fp_email = await AsyncStorage.getItem('fp_email');
      if (!fp_email) { router.replace('/Recovery'); return; }
      setEmail(fp_email);
    };
    init();
  }, []);

  useEffect(() => {
    if (canResend || countdown === 0) { setCanResend(true); return; }
    const id = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(id);
  }, [countdown, canResend]);

  const handleDigitChange = (text, index) => {
    const cleaned = text.replace(/[^0-9]/g, '').slice(-1);
    const next = [...digits];
    next[index] = cleaned;
    setDigits(next);
    setError('');
    if (cleaned && index < DIGITS - 1) inputRefs.current[index + 1]?.focus();
    if (next.every((d) => d !== '')) verify(next.join(''));
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const verify = async (code) => {
    setLoading(true);
    setError('');
    try {
      const res = await api.post('auth/forgot-password/verify-otp', { email, otp: code });
      await AsyncStorage.setItem('fp_reset_token', res.data.resetToken);
      router.replace('/ResetPassword');
    } catch (e) {
      setError(e.response?.data?.error || 'Incorrect OTP. Try again.');
      setDigits(Array(DIGITS).fill(''));
      setTimeout(() => inputRefs.current[0]?.focus(), 100);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!canResend) return;
    try {
      await api.post('auth/forgot-password/send-otp', { email });
      setDigits(Array(DIGITS).fill(''));
      setCountdown(COUNTDOWN);
      setCanResend(false);
      setError('');
      setTimeout(() => inputRefs.current[0]?.focus(), 100);
    } catch (e) {
      setError(e.response?.data?.error || 'Failed to resend');
    }
  };

  const maskedEmail = email ? email.replace(/(.{2}).+(@.+)/, '$1•••$2') : '•••@•••';

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#8e51ff' }}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps='handled' showsVerticalScrollIndicator={false}>

          {/* Hero */}
          <View style={{ alignItems: 'center', justifyContent: 'center', paddingTop: 48, paddingBottom: 40, gap: 12 }}>
            <View style={{ backgroundColor: 'rgba(255,255,255,0.2)', padding: 18, borderRadius: 24, marginBottom: 4 }}>
              <ShieldCheck color='#fff' size={40} strokeWidth={1.5} />
            </View>
            <Text style={{ fontFamily: 'Poppins700', fontSize: 26, color: '#fff', letterSpacing: 0.3 }}>Check Your Email</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Mail color='rgba(255,255,255,0.7)' size={14} />
              <Text style={{ fontFamily: 'Poppins400', fontSize: 13, color: 'rgba(255,255,255,0.75)' }}>
                Code sent to {maskedEmail}
              </Text>
            </View>
          </View>

          {/* Card */}
          <View style={{ flex: 1, backgroundColor: t.card, borderTopLeftRadius: 32, borderTopRightRadius: 32, paddingHorizontal: 28, paddingTop: 36, paddingBottom: 40 }}>

            <Text style={{ fontFamily: 'Poppins700', fontSize: 22, color: t.text, marginBottom: 4 }}>Enter OTP Code</Text>
            <Text style={{ fontFamily: 'Poppins400', fontSize: 13, color: t.textMuted, marginBottom: 32 }}>
              Enter the 6-digit code sent to your email
            </Text>

            {/* Digit boxes */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 28 }}>
              {digits.map((digit, i) => (
                <TextInput
                  key={i}
                  ref={(r) => (inputRefs.current[i] = r)}
                  value={digit}
                  onChangeText={(v) => handleDigitChange(v, i)}
                  onKeyPress={(e) => handleKeyPress(e, i)}
                  keyboardType='number-pad'
                  maxLength={1}
                  selectTextOnFocus
                  editable={!loading}
                  style={{
                    width: 46, height: 56, borderRadius: 14,
                    borderWidth: 1.5,
                    borderColor: error ? '#fca5a5' : digit ? '#8e51ff' : '#e5e7eb',
                    backgroundColor: error ? '#fef2f2' : digit ? '#f0ebff' : '#f9fafb',
                    textAlign: 'center', fontFamily: 'Poppins700', fontSize: 22, color: '#0e0e11',
                  }}
                />
              ))}
            </View>

            {/* Resend */}
            <View style={{ alignItems: 'center', marginBottom: 28 }}>
              {canResend ? (
                <Pressable onPress={handleResend}>
                  <Text style={{ fontFamily: 'Poppins600', fontSize: 14, color: '#8e51ff', textDecorationLine: 'underline' }}>
                    Resend Code
                  </Text>
                </Pressable>
              ) : (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Text style={{ fontFamily: 'Poppins400', fontSize: 13, color: t.textMuted }}>Resend code in</Text>
                  <View style={{ backgroundColor: '#f0ebff', paddingHorizontal: 10, paddingVertical: 3, borderRadius: 99 }}>
                    <Text style={{ fontFamily: 'Poppins600', fontSize: 13, color: '#8e51ff' }}>{countdown}s</Text>
                  </View>
                </View>
              )}
            </View>

            {/* Error */}
            {error ? (
              <View style={{ backgroundColor: '#fee2e2', borderRadius: 12, padding: 12, marginBottom: 16 }}>
                <Text style={{ fontFamily: 'Poppins400', fontSize: 13, color: '#dc2626', textAlign: 'center' }}>{error}</Text>
              </View>
            ) : <View style={{ height: 16 }} />}

            {/* Cancel */}
            <Pressable
              onPress={async () => {
                await AsyncStorage.removeItem('fp_email');
                router.replace('/Recovery');
              }}
              style={({ pressed }) => ({ backgroundColor: pressed ? t.inputBg : 'transparent', borderRadius: 14, paddingVertical: 15, alignItems: 'center', borderWidth: 1, borderColor: t.cardBorder })}
            >
              <Text style={{ fontFamily: 'Poppins500', fontSize: 14, color: t.textMuted }}>Cancel</Text>
            </Pressable>

          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
