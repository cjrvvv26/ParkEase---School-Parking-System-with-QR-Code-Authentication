import {
  View,
  Text,
  Pressable,
  TextInput,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Eye, EyeOff, Mail, Lock, ParkingSquare } from 'lucide-react-native';
import GoogleIcon from '../assets/images/google.webp';
import { Link, useRouter } from 'expo-router';
import { login } from '../services/authService';
import useApiRequest from '../hooks/useApiRequest';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SignIn() {
  const router = useRouter();
  const { error, setError, loading, execute } = useApiRequest();
  const [showPassword, setShowPassword] = useState(false);
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
    platform: 'mobile',
  });

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
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(credentials.email))
      return setError('Invalid email address');

    const data = await execute(login, credentials);
    if (data?.status === 200) {
      await AsyncStorage.setItem('email', credentials.email);
      await AsyncStorage.setItem('hasVerification', 'true');
      return router.replace('/OTPVerification');
    }
  };

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
              <ParkingSquare color='#fff' size={40} strokeWidth={1.5} />
            </View>
            <Text
              style={{
                fontFamily: 'Poppins700',
                fontSize: 28,
                color: '#fff',
                letterSpacing: 0.3,
              }}
            >
              ParkEase
            </Text>
            <Text
              style={{
                fontFamily: 'Poppins400',
                fontSize: 14,
                color: 'rgba(255,255,255,0.75)',
              }}
            >
              School Parking System
            </Text>
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
                fontSize: 24,
                color: '#0e0e11',
                marginBottom: 4,
              }}
            >
              Welcome back
            </Text>
            <Text
              style={{
                fontFamily: 'Poppins400',
                fontSize: 14,
                color: '#71717a',
                marginBottom: 28,
              }}
            >
              Sign in to access your account
            </Text>

            {/* Email */}
            <View style={{ marginBottom: 16 }}>
              <Text
                style={{
                  fontFamily: 'Poppins600',
                  fontSize: 13,
                  color: '#374151',
                  marginBottom: 8,
                }}
              >
                Email Address
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: '#f9fafb',
                  borderRadius: 14,
                  borderWidth: 1,
                  borderColor: '#e5e7eb',
                  paddingHorizontal: 14,
                  gap: 10,
                }}
              >
                <Mail color='#9ca3af' size={18} />
                <TextInput
                  value={credentials.email}
                  onChangeText={(text) =>
                    setCredentials((prev) => ({ ...prev, email: text }))
                  }
                  placeholder='you@school.edu'
                  placeholderTextColor='#d1d5db'
                  keyboardType='email-address'
                  autoCapitalize='none'
                  style={{
                    flex: 1,
                    fontFamily: 'Poppins400',
                    fontSize: 14,
                    color: '#0e0e11',
                    paddingVertical: 14,
                  }}
                />
              </View>
            </View>

            {/* Password */}
            <View style={{ marginBottom: 8 }}>
              <Text
                style={{
                  fontFamily: 'Poppins600',
                  fontSize: 13,
                  color: '#374151',
                  marginBottom: 8,
                }}
              >
                Password
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: '#f9fafb',
                  borderRadius: 14,
                  borderWidth: 1,
                  borderColor: '#e5e7eb',
                  paddingHorizontal: 14,
                  gap: 10,
                }}
              >
                <Lock color='#9ca3af' size={18} />
                <TextInput
                  value={credentials.password}
                  onChangeText={(text) =>
                    setCredentials((prev) => ({ ...prev, password: text }))
                  }
                  secureTextEntry={!showPassword}
                  placeholder='••••••••'
                  placeholderTextColor='#d1d5db'
                  style={{
                    flex: 1,
                    fontFamily: 'Poppins400',
                    fontSize: 14,
                    color: '#0e0e11',
                    paddingVertical: 14,
                  }}
                />
                <Pressable
                  onPress={() => setShowPassword(!showPassword)}
                  hitSlop={8}
                >
                  {showPassword ? (
                    <Eye color='#9ca3af' size={20} strokeWidth={1.5} />
                  ) : (
                    <EyeOff color='#9ca3af' size={20} strokeWidth={1.5} />
                  )}
                </Pressable>
              </View>
            </View>

            {/* Error */}
            {error ? (
              <Text
                style={{
                  fontFamily: 'Poppins400',
                  fontSize: 13,
                  color: '#ef4444',
                  marginBottom: 12,
                  marginTop: 4,
                }}
              >
                {error}
              </Text>
            ) : (
              <View style={{ height: 20 }} />
            )}

            {/* Sign In Button */}
            <Pressable
              disabled={loading}
              onPress={handleRegistration}
              style={{
                backgroundColor: loading ? '#c4b5fd' : '#8e51ff',
                borderRadius: 14,
                paddingVertical: 16,
                alignItems: 'center',
                marginBottom: 24,
                shadowColor: '#8e51ff',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: loading ? 0 : 0.3,
                shadowRadius: 8,
                elevation: loading ? 0 : 6,
              }}
            >
              <Text
                style={{
                  fontFamily: 'Poppins600',
                  fontSize: 15,
                  color: '#fff',
                }}
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </Text>
            </Pressable>

            {/* Divider */}
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 24,
                gap: 12,
              }}
            >
              <View style={{ flex: 1, height: 1, backgroundColor: '#e5e7eb' }} />
              <Text
                style={{
                  fontFamily: 'Poppins400',
                  fontSize: 13,
                  color: '#9ca3af',
                }}
              >
                or continue with
              </Text>
              <View style={{ flex: 1, height: 1, backgroundColor: '#e5e7eb' }} />
            </View>

            {/* Google */}
            <Pressable
              className='active:opacity-70'
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 10,
                borderWidth: 1,
                borderColor: '#e5e7eb',
                borderRadius: 14,
                paddingVertical: 14,
                marginBottom: 28,
                backgroundColor: '#fff',
              }}
            >
              <Image
                source={GoogleIcon}
                style={{ width: 20, height: 20 }}
                resizeMode='contain'
              />
              <Text
                style={{
                  fontFamily: 'Poppins600',
                  fontSize: 14,
                  color: '#374151',
                }}
              >
                Google
              </Text>
            </Pressable>

            {/* Footer */}
            <Text
              style={{
                textAlign: 'center',
                fontFamily: 'Poppins400',
                fontSize: 13,
                color: '#9ca3af',
              }}
            >
              Can't sign in?{' '}
              <Link href='/Recovery'>
                <Text
                  style={{
                    fontFamily: 'Poppins600',
                    color: '#8e51ff',
                  }}
                >
                  Get help
                </Text>
              </Link>
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
