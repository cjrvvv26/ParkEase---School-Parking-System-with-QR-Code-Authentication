import {
  View,
  Text,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { KeyRound, Eye, EyeOff, Check, X } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';
import useTheme from '../hooks/useTheme';

const RULES = [
  { label: 'At least 8 characters', test: (p) => p.length >= 8 },
  { label: 'One uppercase letter', test: (p) => /[A-Z]/.test(p) },
  { label: 'One number', test: (p) => /[0-9]/.test(p) },
  { label: 'One special character', test: (p) => /[^A-Za-z0-9]/.test(p) },
];

export default function ResetPassword() {
  const router = useRouter();
  const { t } = useTheme();
  const [email, setEmail] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState({
    new: false,
    confirm: false,
  });
  const [touched, setTouched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const init = async () => {
      const fp_email = await AsyncStorage.getItem('fp_email');
      const fp_token = await AsyncStorage.getItem('fp_reset_token');
      if (!fp_email || !fp_token) {
        router.replace('/Recovery');
        return;
      }
      setEmail(fp_email);
      setResetToken(fp_token);
    };
    init();
  }, []);

  const allRulesPassed = RULES.every((r) => r.test(password));
  const passwordsMatch = confirm !== '' && password === confirm;
  const canSubmit = allRulesPassed && passwordsMatch && !loading;

  const handleReset = async () => {
    setTouched(true);
    if (!canSubmit) return;
    setLoading(true);
    setError('');
    try {
      await api.patch('auth/forgot-password/reset', {
        email,
        resetToken,
        password,
      });
      await AsyncStorage.removeItem('fp_email');
      await AsyncStorage.removeItem('fp_reset_token');
      router.replace({
        pathname: '/SignIn',
        params: { message: 'Password reset successfully! Please sign in.' },
      });
    } catch (e) {
      setError(e.response?.data?.error || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const confirmBorderColor = () => {
    if (!touched || !confirm) return t.cardBorder;
    return passwordsMatch ? '#4ade80' : '#fca5a5';
  };

  const confirmBg = () => {
    if (!touched || !confirm) return t.inputBg;
    return passwordsMatch ? '#f0fdf4' : '#fef2f2';
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
              <KeyRound color='#fff' size={40} strokeWidth={1.5} />
            </View>
            <Text
              style={{
                fontFamily: 'Poppins700',
                fontSize: 26,
                color: '#fff',
                letterSpacing: 0.3,
              }}
            >
              Reset Password
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
              Create a strong new password for your account
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
              New Password
            </Text>
            <Text
              style={{
                fontFamily: 'Poppins400',
                fontSize: 13,
                color: t.textMuted,
                marginBottom: 28,
              }}
            >
              Make sure it's something you'll remember
            </Text>

            {/* New password */}
            <Text
              style={{
                fontFamily: 'Poppins600',
                fontSize: 13,
                color: t.text,
                marginBottom: 8,
              }}
            >
              New Password
            </Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: t.inputBg,
                borderRadius: 14,
                borderWidth: 1,
                borderColor: t.cardBorder,
                paddingHorizontal: 14,
                gap: 10,
                marginBottom: 14,
              }}
            >
              <TextInput
                value={password}
                onChangeText={(v) => {
                  setPassword(v);
                  setTouched(true);
                }}
                secureTextEntry={!showPassword.new}
                placeholder='Enter new password'
                placeholderTextColor={t.textFaint}
                style={{
                  flex: 1,
                  fontFamily: 'Poppins400',
                  fontSize: 14,
                  color: t.text,
                  paddingVertical: 14,
                }}
              />
              <Pressable
                onPress={() => setShowPassword((p) => ({ ...p, new: !p.new }))}
                hitSlop={8}
              >
                {showPassword.new ? (
                  <Eye color={t.textFaint} size={20} strokeWidth={1.5} />
                ) : (
                  <EyeOff color={t.textFaint} size={20} strokeWidth={1.5} />
                )}
              </Pressable>
            </View>

            {/* Rules checklist */}
            {(touched || password.length > 0) && (
              <View
                style={{
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  gap: 8,
                  marginBottom: 20,
                }}
              >
                {RULES.map((r) => {
                  const pass = r.test(password);
                  return (
                    <View
                      key={r.label}
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 4,
                        width: '47%',
                      }}
                    >
                      {pass ? (
                        <Check color='#16a34a' size={13} />
                      ) : (
                        <X color='#9ca3af' size={13} />
                      )}
                      <Text
                        style={{
                          fontFamily: 'Poppins400',
                          fontSize: 11,
                          color: pass ? '#16a34a' : '#9ca3af',
                          flex: 1,
                        }}
                      >
                        {r.label}
                      </Text>
                    </View>
                  );
                })}
              </View>
            )}

            {/* Confirm password */}
            <Text
              style={{
                fontFamily: 'Poppins600',
                fontSize: 13,
                color: t.text,
                marginBottom: 8,
              }}
            >
              Confirm Password
            </Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: confirmBg(),
                borderRadius: 14,
                borderWidth: 1,
                borderColor: confirmBorderColor(),
                paddingHorizontal: 14,
                gap: 10,
                marginBottom: 6,
              }}
            >
              <TextInput
                value={confirm}
                onChangeText={setConfirm}
                secureTextEntry={!showPassword.confirm}
                placeholder='Confirm new password'
                placeholderTextColor={t.textFaint}
                style={{
                  flex: 1,
                  fontFamily: 'Poppins400',
                  fontSize: 14,
                  color: t.text,
                  paddingVertical: 14,
                }}
              />
              <Pressable
                onPress={() =>
                  setShowPassword((p) => ({ ...p, confirm: !p.confirm }))
                }
                hitSlop={8}
              >
                {showPassword.confirm ? (
                  <Eye color={t.textFaint} size={20} strokeWidth={1.5} />
                ) : (
                  <EyeOff color={t.textFaint} size={20} strokeWidth={1.5} />
                )}
              </Pressable>
            </View>

            {touched && confirm !== '' && (
              <Text
                style={{
                  fontFamily: 'Poppins400',
                  fontSize: 12,
                  color: passwordsMatch ? '#16a34a' : '#ef4444',
                  marginBottom: 8,
                }}
              >
                {passwordsMatch ? 'Passwords match' : 'Passwords do not match'}
              </Text>
            )}

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

            {/* Submit */}
            <Pressable
              onPress={handleReset}
              disabled={!canSubmit}
              style={{
                backgroundColor: canSubmit ? '#8e51ff' : '#e5e7eb',
                borderRadius: 14,
                paddingVertical: 16,
                alignItems: 'center',
                marginBottom: 14,
                shadowColor: '#8e51ff',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: canSubmit ? 0.3 : 0,
                shadowRadius: 8,
                elevation: canSubmit ? 6 : 0,
              }}
            >
              <Text
                style={{
                  fontFamily: 'Poppins600',
                  fontSize: 15,
                  color: canSubmit ? '#fff' : '#9ca3af',
                }}
              >
                {loading ? 'Resetting...' : 'Reset Password'}
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
