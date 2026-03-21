import { useRouter } from 'expo-router';
import { ChevronLeft, Eye, EyeOff, Lock, CheckCircle, Circle } from 'lucide-react-native';
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
            <EyeOff color={t.textFaint} size={16} />
          ) : (
            <Eye color={t.textFaint} size={16} />
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
  const [current, setCurrent] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
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

  const handleSubmit = async () => {
    setSaving(true);
    setError('');
    try {
      await changePassword({ currentPassword: current, newPassword: newPass });
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to change password');
    } finally {
      setSaving(false);
    }
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
                onChangeText={setCurrent}
                show={showCurrent}
                onToggle={() => setShowCurrent(!showCurrent)}
                t={t}
              />
              <PasswordInput
                label='New Password'
                value={newPass}
                onChangeText={setNewPass}
                show={showNew}
                onToggle={() => setShowNew(!showNew)}
                t={t}
              />

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
                    onChangeText={setConfirm}
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
                      <EyeOff color={t.textFaint} size={16} />
                    ) : (
                      <Eye color={t.textFaint} size={16} />
                    )}
                  </Pressable>
                </View>
              </View>

              {error ? (
                <Text
                  style={{
                    fontFamily: 'Poppins400',
                    fontSize: 12,
                    color: '#ef4444',
                    textAlign: 'center',
                    marginBottom: 12,
                  }}
                >
                  {error}
                </Text>
              ) : null}

              <Pressable
                onPress={handleSubmit}
                disabled={!canSubmit || saving}
                style={{
                  backgroundColor: canSubmit && !saving ? t.primary : t.primaryBorder,
                  borderRadius: 16,
                  paddingVertical: 16,
                  alignItems: 'center',
                  shadowColor: t.primary,
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: canSubmit && !saving ? 0.3 : 0,
                  shadowRadius: 8,
                  elevation: canSubmit && !saving ? 6 : 0,
                }}
              >
                {saving ? (
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
