import {
  View,
  Text,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Image,
} from 'react-native';
import { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Mail, ChevronLeft, UserCircle } from 'lucide-react-native';
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
  const debounced = useDebounce(email, 600);

  useEffect(() => {
    if (!debounced) {
      setAccountInfo(null);
      setError('');
      return;
    }
    setError('');
    setAccountInfo(null);
    const check = async () => {
      setChecking(true);
      try {
        const res = await api.post('super-admin/check-account', {
          email: debounced,
        });
        if (res.data?.exists) {
          setAccountInfo(res.data.account);
        } else {
          setError('No account found with that email');
        }
      } catch (e) {
        setAccountInfo(null);
        if (e.response?.status === 404) {
          setError('No account found with that email');
        }
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
      await api.post('auth/forgot-password/send-otp', { email: email.trim() });
      await AsyncStorage.setItem('fp_email', email.trim());
      router.push('/ForgotOTP');
    } catch (e) {
      setError(e.response?.data?.error || 'Failed to send code');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#3b82f6' }}>
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
              paddingVertical: 48,
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
              <Mail color='#fff' size={40} strokeWidth={1.5} />
            </View>
            <Text
              style={{
                fontFamily: 'Poppins700',
                fontSize: 26,
                color: '#fff',
                letterSpacing: 0.3,
              }}
            >
              Forgot Password
            </Text>
            <Text
              style={{
                fontFamily: 'Poppins400',
                fontSize: 13,
                color: 'rgba(255,255,255,0.75)',
                textAlign: 'center',
                paddingHorizontal: 32,
              }}
            >
              Enter your email and we'll send a verification code
            </Text>
          </View>

          {/* Card */}
          <View
            style={{
              flex: 1,
              backgroundColor: t.card,
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
                color: t.text,
                marginBottom: 4,
              }}
            >
              Find your account
            </Text>
            <Text
              style={{
                fontFamily: 'Poppins400',
                fontSize: 13,
                color: t.textMuted,
                marginBottom: 24,
              }}
            >
              We'll verify your identity before resetting
            </Text>

            {/* Email input */}
            <Text
              style={{
                fontFamily: 'Poppins600',
                fontSize: 13,
                color: t.text,
                marginBottom: 8,
              }}
            >
              Email Address
            </Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: t.inputBg,
                borderRadius: 14,
                borderWidth: 1,
                borderColor: accountInfo ? '#3b82f6' : t.cardBorder,
                paddingHorizontal: 14,
                gap: 10,
                marginBottom: 8,
              }}
            >
              <Mail color={t.textFaint} size={18} />
              <TextInput
                value={email}
                onChangeText={(v) => {
                  setEmail(v);
                  setError('');
                  setAccountInfo(null);
                }}
                placeholder='Enter your email address'
                placeholderTextColor={t.textFaint}
                keyboardType='email-address'
                autoCapitalize='none'
                style={{
                  flex: 1,
                  fontFamily: 'Poppins400',
                  fontSize: 14,
                  color: t.text,
                  paddingVertical: 14,
                }}
              />
              {checking && <ActivityIndicator size='small' color='#3b82f6' />}
            </View>

            {error ? (
              <Text
                style={{
                  fontFamily: 'Poppins400',
                  fontSize: 12,
                  color: '#ef4444',
                  marginBottom: 12,
                }}
              >
                {error}
              </Text>
            ) : (
              <View style={{ height: 12 }} />
            )}

            {/* Account preview */}
            {accountInfo && (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 12,
                  padding: 14,
                  backgroundColor: '#dbeafe',
                  borderRadius: 16,
                  borderWidth: 1,
                  borderColor: '#93c5fd',
                  marginBottom: 20,
                }}
              >
                {accountInfo.profileDetails?.url ? (
                  <Image
                    source={{ uri: accountInfo.profileDetails.url }}
                    style={{ width: 46, height: 46, borderRadius: 23 }}
                  />
                ) : (
                  <View
                    style={{
                      width: 46,
                      height: 46,
                      borderRadius: 23,
                      backgroundColor: '#bfdbfe',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <UserCircle color='#3b82f6' size={28} strokeWidth={1.5} />
                  </View>
                )}
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontFamily: 'Poppins600',
                      fontSize: 14,
                      color: '#1e3a5f',
                    }}
                  >
                    {accountInfo.fullName || accountInfo.username}
                  </Text>
                  <Text
                    style={{
                      fontFamily: 'Poppins400',
                      fontSize: 12,
                      color: '#2563eb',
                    }}
                  >
                    {accountInfo.username}
                  </Text>
                </View>
                <View
                  style={{
                    backgroundColor: '#bfdbfe',
                    paddingHorizontal: 8,
                    paddingVertical: 3,
                    borderRadius: 99,
                  }}
                >
                  <Text
                    style={{
                      fontFamily: 'Poppins600',
                      fontSize: 10,
                      color: '#1d4ed8',
                      textTransform: 'capitalize',
                    }}
                  >
                    {accountInfo.role}
                  </Text>
                </View>
              </View>
            )}

            {/* Send button */}
            <Pressable
              onPress={handleSend}
              disabled={!accountInfo || loading}
              style={{
                backgroundColor:
                  accountInfo && !loading ? '#3b82f6' : '#e5e7eb',
                borderRadius: 14,
                paddingVertical: 16,
                alignItems: 'center',
                marginBottom: 14,
                shadowColor: '#3b82f6',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: accountInfo && !loading ? 0.3 : 0,
                shadowRadius: 8,
                elevation: accountInfo && !loading ? 6 : 0,
              }}
            >
              {loading ? (
                <ActivityIndicator color='#fff' size='small' />
              ) : (
                <Text
                  style={{
                    fontFamily: 'Poppins600',
                    fontSize: 15,
                    color: accountInfo && !loading ? '#fff' : '#9ca3af',
                  }}
                >
                  Send Verification Code
                </Text>
              )}
            </Pressable>

            {/* Back */}
            <Pressable
              onPress={() => router.back()}
              className='self-center w-full justify-center flex flex-row items-center gap-3 rounded-lg px-4 py-4'
              style={({ pressed }) => ({
                backgroundColor: pressed ? t.inputBg : 'transparent',
                borderRadius: 14,
                paddingVertical: 15,
                borderWidth: 1,
                borderColor: t.cardBorder,
              })}
            >
              <ChevronLeft color={t.textMuted} size={16} />
              <Text
                style={{
                  fontFamily: 'Poppins500',
                  fontSize: 14,
                  color: t.textMuted,
                }}
              >
                Back to Sign In
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
