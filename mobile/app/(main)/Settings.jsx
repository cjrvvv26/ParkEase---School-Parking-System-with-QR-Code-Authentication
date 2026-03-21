import { useRouter } from 'expo-router';
import { Moon, Sun, ChevronLeft, LogOut, KeyRound, ChevronRight } from 'lucide-react-native';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch } from 'react-redux';
import { setTheme } from '../features/themeSlicer';
import { logout } from '../features/authSlicer';
import useTheme from '../hooks/useTheme';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Settings() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { t, mode } = useTheme();

  const handleLogout = async () => {
    router.replace({ pathname: '/(auth)/SignIn', params: { message: 'Signed out successfully.' } });
    await AsyncStorage.removeItem('token');
    dispatch(logout());
  };

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: t.bg }}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
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
            onPress={() => router.push('/Home')}
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
            Settings
          </Text>
          <View style={{ width: 38 }} />
        </View>

        {/* Appearance */}
        <View style={{ marginHorizontal: 20, marginBottom: 24 }}>
          <Text
            style={{
              fontFamily: 'Poppins600',
              fontSize: 13,
              color: t.textFaint,
              marginBottom: 10,
              textTransform: 'uppercase',
              letterSpacing: 0.8,
            }}
          >
            Appearance
          </Text>
          <View
            style={{
              backgroundColor: t.card,
              borderRadius: 16,
              borderWidth: 1,
              borderColor: t.cardBorder,
              overflow: 'hidden',
            }}
          >
            {/* Light */}
            <Pressable
              onPress={() => dispatch(setTheme('light'))}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                padding: 16,
                borderBottomWidth: 1,
                borderBottomColor: t.divider,
                backgroundColor: mode === 'light' ? t.primaryLight : t.card,
              }}
            >
              <View
                style={{
                  backgroundColor:
                    mode === 'light' ? t.primaryLight : t.bgSecondary,
                  padding: 10,
                  borderRadius: 12,
                  marginRight: 14,
                }}
              >
                <Sun
                  color={mode === 'light' ? t.primary : t.textFaint}
                  size={20}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontFamily: 'Poppins600',
                    fontSize: 14,
                    color: mode === 'light' ? t.text : t.textMuted,
                  }}
                >
                  Light Theme
                </Text>
                <Text
                  style={{
                    fontFamily: 'Poppins400',
                    fontSize: 12,
                    color: t.textFaint,
                    marginTop: 1,
                  }}
                >
                  Clean and bright interface
                </Text>
              </View>
              <View
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: 10,
                  borderWidth: 2,
                  borderColor: mode === 'light' ? t.primary : t.cardBorder,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {mode === 'light' && (
                  <View
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: 5,
                      backgroundColor: t.primary,
                    }}
                  />
                )}
              </View>
            </Pressable>

            {/* Dark */}
            <Pressable
              onPress={() => dispatch(setTheme('dark'))}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                padding: 16,
                backgroundColor: mode === 'dark' ? '#1a1025' : t.card,
              }}
            >
              <View
                style={{
                  backgroundColor: mode === 'dark' ? '#2d1f4a' : t.bgSecondary,
                  padding: 10,
                  borderRadius: 12,
                  marginRight: 14,
                }}
              >
                <Moon
                  color={mode === 'dark' ? t.primaryBorder : t.textFaint}
                  size={20}
                  strokeWidth={1.5}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontFamily: 'Poppins600',
                    fontSize: 14,
                    color: mode === 'dark' ? '#f3f0ff' : t.textMuted,
                  }}
                >
                  Dark Theme
                </Text>
                <Text
                  style={{
                    fontFamily: 'Poppins400',
                    fontSize: 12,
                    color: mode === 'dark' ? '#6b7280' : t.textFaint,
                    marginTop: 1,
                  }}
                >
                  Easy on the eyes at night
                </Text>
              </View>
              <View
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: 10,
                  borderWidth: 2,
                  borderColor: mode === 'dark' ? t.primary : t.cardBorder,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {mode === 'dark' && (
                  <View
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: 5,
                      backgroundColor: t.primary,
                    }}
                  />
                )}
              </View>
            </Pressable>
          </View>
        </View>

        {/* Security */}
        <View style={{ marginHorizontal: 20, marginBottom: 24 }}>
          <Text
            style={{
              fontFamily: 'Poppins600',
              fontSize: 13,
              color: t.textFaint,
              marginBottom: 10,
              textTransform: 'uppercase',
              letterSpacing: 0.8,
            }}
          >
            Security
          </Text>
          <View
            style={{
              backgroundColor: t.card,
              borderRadius: 16,
              borderWidth: 1,
              borderColor: t.cardBorder,
            }}
          >
            <Pressable
              onPress={() => router.push('/ChangePassword')}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                padding: 16,
              }}
            >
              <View
                style={{
                  backgroundColor: t.primaryLight,
                  padding: 10,
                  borderRadius: 12,
                  marginRight: 14,
                }}
              >
                <KeyRound color={t.primary} size={20} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontFamily: 'Poppins600', fontSize: 14, color: t.text }}>
                  Change Password
                </Text>
                <Text style={{ fontFamily: 'Poppins400', fontSize: 12, color: t.textFaint, marginTop: 1 }}>
                  Update your account password
                </Text>
              </View>
              <ChevronRight color={t.textFaint} size={18} />
            </Pressable>
          </View>
        </View>

        {/* Logout */}
        <View style={{ marginHorizontal: 20 }}>
          <Pressable
            onPress={handleLogout}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
              backgroundColor: t.redBg,
              borderRadius: 16,
              padding: 16,
              borderWidth: 1,
              borderColor: mode === 'dark' ? '#7f1d1d' : '#fecaca',
            }}
          >
            <LogOut color={t.red} size={18} />
            <Text
              style={{ fontFamily: 'Poppins600', fontSize: 14, color: t.red }}
            >
              Log Out
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
