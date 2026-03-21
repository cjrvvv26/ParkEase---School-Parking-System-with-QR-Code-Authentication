import {
  View, Text, TextInput, Pressable,
  KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator,
} from 'react-native';
import { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Mail, ChevronLeft, CircleUserIcon } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';
import useTheme from '../hooks/useTheme';

function useDebounce(value, delay) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

export default function Recovery() {
  const router = useRouter();
  const { t } = useTheme();
  const [email, setEmail] = useState('');
  const [accountInfo, setAccountInfo] = useState(null);
  const [checking, setChecking] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const debounced = useDebounce(email, 500);

  useEffect(() => {
    if (!debounced) { setAccountInfo(null); setError(''); return; }
    setError('');
    setAccountInfo(null);
    const check = async () => {
      setChecking(true);
      try {
        const res = await api.post('super-admin/check-account', { email: debounced });
        setAccountInfo(res.data?.exists ? res.data.account : null);
        if (!res.data?.exists) setError('No account found with that email');
      } catch (_) {
        setAccountInfo(null);
      } finally {
        setChecking(false);
      }
    };
    check();
  }, [debounced]);

  const handleSend = async () => {
    if (!accountInfo || loading) return;
    setLoading(true);
    setError('');
    try {
      await api.post('auth/forgot-password/send-otp', { email });
      await AsyncStorage.setItem('fp_email', email);
      router.push('/ForgotOTP');
    } catch (e) {
      setError(e.response?.data?.error || 'Failed to send code');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#8e51ff' }}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps='handled' showsVerticalScrollIndicator={false}>

          {/* Hero */}
          <View style={{ alignItems: 'center', justifyContent: 'center', paddingVertical: 48, gap: 12 }}>
            <View style={{ backgroundColor: 'rgba(255,255,255,0.2)', padding: 18, borderRadius: 24, marginBottom: 4 }}>
              <Mail color='#fff' size={40} strokeWidth={1.5} />
            </View>
            <Text style={{ fontFamily: 'Poppins700', fontSize: 26, color: '#fff', letterSpacing: 0.3 }}>Forgot Password</Text>
            <Text style={{ fontFamily: 'Poppins400', fontSize: 13, color: 'rgba(255,255,255,0.75)', textAlign: 'center', paddingHorizontal: 32 }}>
              Enter your email and we'll send a verification code
            </Text>
          </View>

          {/* Card */}
          <View style={{ flex: 1, backgroundColor: t.card, borderTopLeftRadius: 32, borderTopRightRadius: 32, paddingHorizontal: 28, paddingTop: 36, paddingBottom: 40 }}>

            <Text style={{ fontFamily: 'Poppins700', fontSize: 22, color: t.text, marginBottom: 4 }}>Find your account</Text>
            <Text style={{ fontFamily: 'Poppins400', fontSize: 13, color: t.textMuted, marginBottom: 28 }}>We'll verify your identity before resetting</Text>

            {/* Account preview */}
            <View style={{ minHeight: 72, marginBottom: 20 }}>
              {checking && email ? (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, backgroundColor: t.inputBg, borderRadius: 16, borderWidth: 1, borderColor: t.cardBorder }}>
                  <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: t.cardBorder }} />
                  <View style={{ gap: 6, flex: 1 }}>
                    <View style={{ height: 12, width: 120, borderRadius: 6, backgroundColor: t.cardBorder }} />
                    <View style={{ height: 10, width: 80, borderRadius: 5, backgroundColor: t.cardBorder }} />
                  </View>
                  <ActivityIndicator size='small' color='#8e51ff' />
                </View>
              ) : accountInfo ? (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, backgroundColor: '#f0ebff', borderRadius: 16, borderWidth: 1, borderColor: '#d8b4fe' }}>
                  <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: '#ddd6fe', alignItems: 'center', justifyContent: 'center' }}>
                    <CircleUserIcon color='#8e51ff' size={26} strokeWidth={1.5} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontFamily: 'Poppins600', fontSize: 14, color: '#3b0764' }}>{accountInfo.fullName}</Text>
                    <Text style={{ fontFamily: 'Poppins400', fontSize: 12, color: '#7c3aed' }}>{accountInfo.username}</Text>
                  </View>
                </View>
              ) : null}
            </View>

            {/* Email input */}
            <Text style={{ fontFamily: 'Poppins600', fontSize: 13, color: t.text, marginBottom: 8 }}>Email Address</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: t.inputBg, borderRadius: 14, borderWidth: 1, borderColor: t.cardBorder, paddingHorizontal: 14, gap: 10, marginBottom: 8 }}>
              <Mail color={t.textFaint} size={18} />
              <TextInput
                value={email}
                onChangeText={(v) => { setEmail(v); setError(''); }}
                placeholder='Enter your email address'
                placeholderTextColor={t.textFaint}
                keyboardType='email-address'
                autoCapitalize='none'
                style={{ flex: 1, fontFamily: 'Poppins400', fontSize: 14, color: t.text, paddingVertical: 14 }}
              />
            </View>

            {error ? (
              <Text style={{ fontFamily: 'Poppins400', fontSize: 12, color: '#ef4444', marginBottom: 16 }}>{error}</Text>
            ) : <View style={{ height: 16 }} />}

            {/* Send button */}
            <Pressable
              onPress={handleSend}
              disabled={!accountInfo || loading}
              style={{
                backgroundColor: accountInfo && !loading ? '#8e51ff' : '#e5e7eb',
                borderRadius: 14, paddingVertical: 16, alignItems: 'center', marginBottom: 14,
                shadowColor: '#8e51ff', shadowOffset: { width: 0, height: 4 },
                shadowOpacity: accountInfo && !loading ? 0.3 : 0, shadowRadius: 8,
                elevation: accountInfo && !loading ? 6 : 0,
              }}
            >
              <Text style={{ fontFamily: 'Poppins600', fontSize: 15, color: accountInfo && !loading ? '#fff' : '#9ca3af' }}>
                {loading ? 'Sending...' : 'Send Verification Code'}
              </Text>
            </Pressable>

            {/* Back */}
            <Pressable
              onPress={() => router.back()}
              style={({ pressed }) => ({ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: pressed ? t.inputBg : 'transparent', borderRadius: 14, paddingVertical: 15, borderWidth: 1, borderColor: t.cardBorder })}
            >
              <ChevronLeft color={t.textMuted} size={16} />
              <Text style={{ fontFamily: 'Poppins500', fontSize: 14, color: t.textMuted }}>Back to Sign In</Text>
            </Pressable>

          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
