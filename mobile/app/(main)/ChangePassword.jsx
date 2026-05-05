import { useRouter } from 'expo-router';
import { ChevronLeft, Eye, EyeOff, Lock, CheckCircle, Circle, XCircle, AlertCircle } from 'lucide-react-native';
import { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { changePassword } from '../services/authService';
import useApiRequest from '../hooks/useApiRequest';
import useTheme from '../hooks/useTheme';

function PasswordInput({ label, value, onChangeText, show, onToggle, t }) {
  return (
    <View style={{ marginBottom: 16 }}>
      <Text
        style={{
          fontFamily: 'Poppins600',
          fontSize: 12,
          color: t.textFaint,
          marginBottom: 6,
          textTransform: 'uppercase',
          letterSpacing: 0.6,
        }}
      >
        {label}
      </Text>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: t.card,
          borderRadius: 14,
          borderWidth: 1,
          borderColor: t.primaryBorder,
          paddingHorizontal: 14,
          paddingVertical: 12,
          gap: 10,
        }}
      >
        <Lock color={t.primary} size={16} />
        <TextInput
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={!show}
          style={{
            flex: 1,
            fontFamily: 'Poppins500',
            fontSize: 14,
            color: t.text,
            padding: 0,
          }}
          placeholderTextColor={t.textFaint}
        />
        <Pressable onPress={onToggle}>
          {show ? (
            <Eye color={t.textFaint} size={16} />
          ) : (
            <EyeOff color={t.textFaint} size={16} />
          )}
        </Pressable>
      </View>
    </View>
  );
}

function Rule({ pass, label, t }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 }}>
      {pass ? (
        <CheckCircle size={14} color='#16a34a' />
      ) : (
        <Circle size={14} color={t.textFaint} />
      )}
      <Text
        style={{
          fontFamily: 'Poppins400',
          fontSize: 12,
          color: pass ? '#16a34a' : t.textFaint,
        }}
      >
        {label}
      </Text>
    </View>
  );
}

export default function ChangePassword() {
  const router = useRouter();
  const { t } = useTheme();
  const { loading, error, execute } = useApiRequest();
  const [current, setCurrent] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [success, setSuccess] = useState(false);

  const rules = {
    length: newPass.length >= 8,
    upper: /[A-Z]/.test(newPass),
    number: /[0-9]/.test(newPass),
    special: /[^A-Za-z0-9]/.test(newPass),
  };
  const allRules = Object.values(rules).every(Boolean);
  const confirmMatch = confirm.length > 0 && confirm === newPass;
  const canSubmit = current.length > 0 && allRules && confirmMatch;

  const validate = () => {
    const e = {};
    if (!current) e.current = 'Current password is required.';
    if (!newPass) e.new = 'New password is required.';
    else if (!allRules) e.new = 'Password does not meet all requirements.';
    if (!confirm) e.confirm = 'Please confirm your new password.';
    else if (confirm !== newPass) e.confirm = 'Passwords do not match.';
    setFieldErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setFieldErrors({});
    const res = await execute(changePassword, { currentPassword: current, newPassword: newPass });
    if (res?.status === 200) setSuccess(true);
  };

  return (
    <SafeAreaView edges={['top', 'bottom']} style={{ flex: 1, backgroundColor: t.bg }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 20,
            paddingTop: 20,
            paddingBottom: 16,
          }}
        >
          <Pressable
            onPress={() => router.back()}
            style={{
              backgroundColor: t.headerBtn,
              padding: 8,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: t.headerBtnBorder,
            }}
          >
            <ChevronLeft color={t.text} size={22} />
          </Pressable>
          <Text
            style={{
              flex: 1,
              textAlign: 'center',
              fontFamily: 'Poppins700',
              fontSize: 20,
              color: t.text,
            }}
          >
            Change Password
          </Text>
          <View style={{ width: 38 }} />
        </View>

        <View
          style={{
            marginHorizontal: 20,
            backgroundColor: t.card,
            borderRadius: 20,
            padding: 20,
            borderWidth: 1,
            borderColor: t.cardBorder,
          }}
        >
          {success ? (
            <View style={{ alignItems: 'center', paddingVertical: 24, gap: 12 }}>
              <CheckCircle size={48} color='#16a34a' />
              <Text style={{ fontFamily: 'Poppins700', fontSize: 16, color: t.text }}>
                Password Changed!
              </Text>
              <Text style={{ fontFamily: 'Poppins400', fontSize: 13, color: t.textMuted, textAlign: 'center' }}>
                Your password has been updated successfully.
              </Text>
              <Pressable
                onPress={() => router.back()}
                style={{
                  marginTop: 8,
                  backgroundColor: t.primary,
                  borderRadius: 14,
                  paddingVertical: 12,
                  paddingHorizontal: 32,
                }}
              >
                <Text style={{ fontFamily: 'Poppins600', fontSize: 14, color: '#fff' }}>
                  Go Back
                </Text>
              </Pressable>
            </View>
          ) : (
            <>
              <PasswordInput
                label='Current Password'
                value={current}
                onChangeText={(v) => { setCurrent(v.replace(/ /g, '')); setFieldErrors((p) => ({ ...p, current: '' })); }}
                show={showCurrent}
                onToggle={() => setShowCurrent(!showCurrent)}
                t={t}
              />
              {fieldErrors.current ? (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: -10, marginBottom: 12 }}>
                  <XCircle size={12} color='#ef4444' />
                  <Text style={{ fontFamily: 'Poppins400', fontSize: 12, color: '#ef4444' }}>{fieldErrors.current}</Text>
                </View>
              ) : null}
              <PasswordInput
                label='New Password'
                value={newPass}
                onChangeText={(v) => { setNewPass(v.replace(/ /g, '')); setFieldErrors((p) => ({ ...p, new: '' })); }}
                show={showNew}
                onToggle={() => setShowNew(!showNew)}
                t={t}
              />
              {fieldErrors.new ? (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: -10, marginBottom: 12 }}>
                  <XCircle size={12} color='#ef4444' />
                  <Text style={{ fontFamily: 'Poppins400', fontSize: 12, color: '#ef4444' }}>{fieldErrors.new}</Text>
                </View>
              ) : null}

              {/* Rules */}
              {newPass.length > 0 && (
                <View
                  style={{
                    backgroundColor: t.inputBg,
                    borderRadius: 12,
                    padding: 14,
                    marginBottom: 16,
                  }}
                >
                  <Rule pass={rules.length} label='At least 8 characters' t={t} />
                  <Rule pass={rules.upper} label='One uppercase letter' t={t} />
                  <Rule pass={rules.number} label='One number' t={t} />
                  <Rule pass={rules.special} label='One special character' t={t} />
                </View>
              )}

              <View style={{ marginBottom: 16 }}>
                <Text
                  style={{
                    fontFamily: 'Poppins600',
                    fontSize: 12,
                    color: t.textFaint,
                    marginBottom: 6,
                    textTransform: 'uppercase',
                    letterSpacing: 0.6,
                  }}
                >
                  Confirm New Password
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    backgroundColor: t.card,
                    borderRadius: 14,
                    borderWidth: 1,
                    borderColor:
                      confirm.length > 0
                        ? confirmMatch
                          ? '#16a34a'
                          : '#ef4444'
                        : t.primaryBorder,
                    paddingHorizontal: 14,
                    paddingVertical: 12,
                    gap: 10,
                  }}
                >
                  <Lock
                    color={
                      confirm.length > 0
                        ? confirmMatch
                          ? '#16a34a'
                          : '#ef4444'
                        : t.primary
                    }
                    size={16}
                  />
                  <TextInput
                    value={confirm}
                    onChangeText={(v) => setConfirm(v.replace(/ /g, ''))}
                    secureTextEntry={!showConfirm}
                    style={{
                      flex: 1,
                      fontFamily: 'Poppins500',
                      fontSize: 14,
                      color: t.text,
                      padding: 0,
                    }}
                    placeholderTextColor={t.textFaint}
                  />
                  <Pressable onPress={() => setShowConfirm(!showConfirm)}>
                    {showConfirm ? (
                      <Eye color={t.textFaint} size={16} />
                    ) : (
                      <EyeOff color={t.textFaint} size={16} />
                    )}
                  </Pressable>
                </View>
              </View>

              {error ? (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#fef2f2', borderRadius: 10, padding: 12, marginBottom: 12, borderWidth: 1, borderColor: '#fecaca' }}>
                  <AlertCircle size={14} color='#ef4444' />
                  <Text style={{ fontFamily: 'Poppins400', fontSize: 12, color: '#dc2626', flex: 1 }}>{error}</Text>
                </View>
              ) : null}

              <Pressable
                onPress={handleSubmit}
                disabled={!canSubmit || loading}
                style={{
                  backgroundColor: canSubmit && !loading ? t.primary : t.primaryBorder,
                  borderRadius: 16,
                  paddingVertical: 16,
                  alignItems: 'center',
                  shadowColor: t.primary,
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: canSubmit && !loading ? 0.3 : 0,
                  shadowRadius: 8,
                  elevation: canSubmit && !loading ? 6 : 0,
                }}
              >
                {loading ? (
                  <ActivityIndicator color='#fff' />
                ) : (
                  <Text style={{ fontFamily: 'Poppins600', fontSize: 15, color: '#fff' }}>
                    Update Password
                  </Text>
                )}
              </Pressable>
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
