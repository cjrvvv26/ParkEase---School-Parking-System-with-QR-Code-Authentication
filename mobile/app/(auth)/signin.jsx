import { View, Text, Pressable, TextInput, Image, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Eye, EyeOff, Mail, Lock, ParkingSquare, CheckCircle } from 'lucide-react-native';
import GoogleIcon from '../assets/images/google.webp';
import { Link, useRouter, useLocalSearchParams } from 'expo-router';
import { login } from '../services/authService';
import useApiRequest from '../hooks/useApiRequest';
import AsyncStorage from '@react-native-async-storage/async-storage';
import useTheme from '../hooks/useTheme';
import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session/providers/google';
import { useDispatch } from 'react-redux';
import { login as loginAction } from '../features/authSlicer';
import api from '../services/api';

WebBrowser.maybeCompleteAuthSession();

const GOOGLE_CLIENT_ID = '376193942979-6hs98pha8pv81g19g7klssvpjf58s4js.apps.googleusercontent.com';

export default function SignIn() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { message } = useLocalSearchParams();
  const { error, setError, loading, execute } = useApiRequest();
  const { t } = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const [toast, setToast] = useState('');
  const [googleLoading, setGoogleLoading] = useState(false);
  const [credentials, setCredentials] = useState({ email: '', password: '', platform: 'mobile' });

  const [request, response, promptAsync] = AuthSession.useAuthRequest({
    androidClientId: GOOGLE_CLIENT_ID,
    iosClientId: GOOGLE_CLIENT_ID,
    webClientId: GOOGLE_CLIENT_ID,
  });

  // Handle Google OAuth response
  useEffect(() => {
    if (response?.type !== 'success') return;
    const { access_token } = response.params;
    const handleGoogle = async () => {
      setGoogleLoading(true);
      try {
        const res = await api.post('auth/google', { access_token, type: 'login', platform: 'mobile' });
        if (res?.status === 200) {
          await AsyncStorage.setItem('email', res.data.email);
          await AsyncStorage.setItem('hasVerification', 'true');
          router.replace('/OTPVerification');
        }
      } catch (e) {
        setError(e.response?.data?.error || 'Google sign in failed');
      } finally {
        setGoogleLoading(false);
      }
    };
    handleGoogle();
  }, [response]);

  // Show logout toast for 3s
  useEffect(() => {
    if (!message) return;
    setToast(message);
    const timer = setTimeout(() => setToast(''), 3000);
    return () => clearTimeout(timer);
  }, [message]);

  useEffect(() => {
    const checkVerification = async () => {
      const hasVerification = await AsyncStorage.getItem('hasVerification');
      if (hasVerification === 'true') return router.replace('/OTPVerification');
    };
    checkVerification();
  }, []);

  const handleRegistration = async () => {
    const hasEmptyValue = Object.values(credentials).every((c) => !c);
    if (hasEmptyValue) return setError('All fields must be filled.');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(credentials.email)) return setError('Invalid email address');
    const data = await execute(login, credentials);
    if (data?.status === 200) {
      await AsyncStorage.setItem('email', credentials.email);
      await AsyncStorage.setItem('hasVerification', 'true');
      return router.replace('/OTPVerification');
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#8e51ff' }}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps='handled' showsVerticalScrollIndicator={false}>

          {/* Hero — always purple */}
          <View style={{ alignItems: 'center', justifyContent: 'center', paddingVertical: 48, gap: 12 }}>
            <View style={{ backgroundColor: 'rgba(255,255,255,0.2)', padding: 18, borderRadius: 24, marginBottom: 4 }}>
              <ParkingSquare color='#fff' size={40} strokeWidth={1.5} />
            </View>
            <Text style={{ fontFamily: 'Poppins700', fontSize: 28, color: '#fff', letterSpacing: 0.3 }}>ParkEase</Text>
            <Text style={{ fontFamily: 'Poppins400', fontSize: 14, color: 'rgba(255,255,255,0.75)' }}>School Parking System</Text>
          </View>

          {/* Form Card */}
          <View style={{ flex: 1, backgroundColor: t.card, borderTopLeftRadius: 32, borderTopRightRadius: 32, paddingHorizontal: 28, paddingTop: 36, paddingBottom: 40 }}>

            {/* Logout toast */}
            {toast ? (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: '#dcfce7', borderRadius: 12, padding: 12, marginBottom: 20, borderWidth: 1, borderColor: '#bbf7d0' }}>
                <CheckCircle color='#16a34a' size={16} />
                <Text style={{ fontFamily: 'Poppins500', fontSize: 13, color: '#15803d', flex: 1 }}>{toast}</Text>
              </View>
            ) : null}

            <Text style={{ fontFamily: 'Poppins700', fontSize: 24, color: t.text, marginBottom: 4 }}>Welcome back</Text>
            <Text style={{ fontFamily: 'Poppins400', fontSize: 14, color: t.textMuted, marginBottom: 28 }}>Sign in to access your account</Text>

            {/* Email */}
            <View style={{ marginBottom: 16 }}>
              <Text style={{ fontFamily: 'Poppins600', fontSize: 13, color: t.text, marginBottom: 8 }}>Email Address</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: t.inputBg, borderRadius: 14, borderWidth: 1, borderColor: t.cardBorder, paddingHorizontal: 14, gap: 10 }}>
                <Mail color={t.textFaint} size={18} />
                <TextInput
                  value={credentials.email}
                  onChangeText={(text) => setCredentials((prev) => ({ ...prev, email: text }))}
                  placeholder='you@school.edu'
                  placeholderTextColor={t.textFaint}
                  keyboardType='email-address'
                  autoCapitalize='none'
                  style={{ flex: 1, fontFamily: 'Poppins400', fontSize: 14, color: t.text, paddingVertical: 14 }}
                />
              </View>
            </View>

            {/* Password */}
            <View style={{ marginBottom: 8 }}>
              <Text style={{ fontFamily: 'Poppins600', fontSize: 13, color: t.text, marginBottom: 8 }}>Password</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: t.inputBg, borderRadius: 14, borderWidth: 1, borderColor: t.cardBorder, paddingHorizontal: 14, gap: 10 }}>
                <Lock color={t.textFaint} size={18} />
                <TextInput
                  value={credentials.password}
                  onChangeText={(text) => setCredentials((prev) => ({ ...prev, password: text }))}
                  secureTextEntry={!showPassword}
                  placeholder='••••••••'
                  placeholderTextColor={t.textFaint}
                  style={{ flex: 1, fontFamily: 'Poppins400', fontSize: 14, color: t.text, paddingVertical: 14 }}
                />
                <Pressable onPress={() => setShowPassword(!showPassword)} hitSlop={8}>
                  {showPassword ? <Eye color={t.textFaint} size={20} strokeWidth={1.5} /> : <EyeOff color={t.textFaint} size={20} strokeWidth={1.5} />}
                </Pressable>
              </View>
            </View>

            {/* Error */}
            {error ? (
              <Text style={{ fontFamily: 'Poppins400', fontSize: 13, color: t.red, marginBottom: 12, marginTop: 4 }}>{error}</Text>
            ) : (
              <View style={{ height: 20 }} />
            )}

            {/* Sign In */}
            <Pressable
              disabled={loading}
              onPress={handleRegistration}
              style={{ backgroundColor: loading ? '#c4b5fd' : t.primary, borderRadius: 14, paddingVertical: 16, alignItems: 'center', marginBottom: 24, shadowColor: t.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: loading ? 0 : 0.3, shadowRadius: 8, elevation: loading ? 0 : 6 }}
            >
              <Text style={{ fontFamily: 'Poppins600', fontSize: 15, color: '#fff' }}>{loading ? 'Signing in...' : 'Sign In'}</Text>
            </Pressable>

            {/* Divider */}
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 24, gap: 12 }}>
              <View style={{ flex: 1, height: 1, backgroundColor: t.cardBorder }} />
              <Text style={{ fontFamily: 'Poppins400', fontSize: 13, color: t.textFaint }}>or continue with</Text>
              <View style={{ flex: 1, height: 1, backgroundColor: t.cardBorder }} />
            </View>

            {/* Google */}
            <Pressable
              disabled={!request || googleLoading}
              onPress={() => promptAsync()}
              style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, borderWidth: 1, borderColor: t.cardBorder, borderRadius: 14, paddingVertical: 14, marginBottom: 28, backgroundColor: t.card, opacity: !request || googleLoading ? 0.6 : 1 }}>
              <Image source={GoogleIcon} style={{ width: 20, height: 20 }} resizeMode='contain' />
              <Text style={{ fontFamily: 'Poppins600', fontSize: 14, color: t.text }}>{googleLoading ? 'Signing in...' : 'Google'}</Text>
            </Pressable>

            {/* Footer */}
            <Text style={{ textAlign: 'center', fontFamily: 'Poppins400', fontSize: 13, color: t.textFaint }}>
              Can't sign in?{' '}
              <Link href='/Recovery'>
                <Text style={{ fontFamily: 'Poppins600', color: t.primary }}>Get help</Text>
              </Link>
            </Text>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
