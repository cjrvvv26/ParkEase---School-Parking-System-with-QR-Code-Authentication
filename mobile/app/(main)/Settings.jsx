import { useRouter } from 'expo-router';
import {
  ChevronLeft,
  Moon,
  Sun,
  ChevronRight,
  LogOut,
  Shield,
  Bell,
  HelpCircle,
} from 'lucide-react-native';
import { useState } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Settings() {
  const router = useRouter();
  const [theme, setTheme] = useState('light');

  return (
    <SafeAreaView edges={['top']} className='bg-gray-50 flex-1'>
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
            className='active:opacity-70'
            style={{
              backgroundColor: '#fff',
              padding: 8,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: '#e5e7eb',
            }}
          >
            <ChevronLeft color='#0e0e11' size={22} />
          </Pressable>
          <Text
            style={{
              flex: 1,
              textAlign: 'center',
              fontFamily: 'Poppins700',
              fontSize: 20,
              color: '#0e0e11',
            }}
          >
            Settings
          </Text>
          <View style={{ width: 38 }} />
        </View>

        {/* Theme Section */}
        <View style={{ marginHorizontal: 20, marginBottom: 24 }}>
          <Text
            style={{
              fontFamily: 'Poppins600',
              fontSize: 13,
              color: '#9ca3af',
              marginBottom: 10,
              textTransform: 'uppercase',
              letterSpacing: 0.8,
            }}
          >
            Appearance
          </Text>
          <View
            style={{
              backgroundColor: '#fff',
              borderRadius: 16,
              borderWidth: 1,
              borderColor: '#e5e7eb',
              overflow: 'hidden',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.05,
              shadowRadius: 6,
              elevation: 2,
            }}
          >
            {/* Light */}
            <Pressable
              onPress={() => setTheme('light')}
              className='active:opacity-70'
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                padding: 16,
                borderBottomWidth: 1,
                borderBottomColor: '#f3f4f6',
                backgroundColor: theme === 'light' ? '#faf8ff' : '#fff',
              }}
            >
              <View
                style={{
                  backgroundColor: theme === 'light' ? '#f0ebff' : '#f3f4f6',
                  padding: 10,
                  borderRadius: 12,
                  marginRight: 14,
                }}
              >
                <Sun
                  color={theme === 'light' ? '#8e51ff' : '#9ca3af'}
                  size={20}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontFamily: 'Poppins600',
                    fontSize: 14,
                    color: theme === 'light' ? '#0e0e11' : '#71717a',
                  }}
                >
                  Light Theme
                </Text>
                <Text
                  style={{
                    fontFamily: 'Poppins400',
                    fontSize: 12,
                    color: '#9ca3af',
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
                  borderColor: theme === 'light' ? '#8e51ff' : '#d1d5db',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {theme === 'light' && (
                  <View
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: 5,
                      backgroundColor: '#8e51ff',
                    }}
                  />
                )}
              </View>
            </Pressable>

            {/* Dark */}
            <Pressable
              onPress={() => setTheme('dark')}
              className='active:opacity-70'
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                padding: 16,
                backgroundColor: theme === 'dark' ? '#1a1025' : '#fff',
              }}
            >
              <View
                style={{
                  backgroundColor: theme === 'dark' ? '#2d1f4a' : '#f3f4f6',
                  padding: 10,
                  borderRadius: 12,
                  marginRight: 14,
                }}
              >
                <Moon
                  color={theme === 'dark' ? '#c4b5fd' : '#9ca3af'}
                  size={20}
                  strokeWidth={1.5}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontFamily: 'Poppins600',
                    fontSize: 14,
                    color: theme === 'dark' ? '#f3f4f6' : '#71717a',
                  }}
                >
                  Dark Theme
                </Text>
                <Text
                  style={{
                    fontFamily: 'Poppins400',
                    fontSize: 12,
                    color: theme === 'dark' ? '#6b7280' : '#9ca3af',
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
                  borderColor: theme === 'dark' ? '#8e51ff' : '#d1d5db',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {theme === 'dark' && (
                  <View
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: 5,
                      backgroundColor: '#8e51ff',
                    }}
                  />
                )}
              </View>
            </Pressable>
          </View>
        </View>

        {/* Logout */}
        <View style={{ marginHorizontal: 20 }}>
          <Pressable
            className='active:opacity-70'
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
              backgroundColor: '#fff5f5',
              borderRadius: 16,
              padding: 16,
              borderWidth: 1,
              borderColor: '#fecaca',
            }}
          >
            <LogOut color='#ef4444' size={18} />
            <Text
              style={{
                fontFamily: 'Poppins600',
                fontSize: 14,
                color: '#ef4444',
              }}
            >
              Log Out
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
