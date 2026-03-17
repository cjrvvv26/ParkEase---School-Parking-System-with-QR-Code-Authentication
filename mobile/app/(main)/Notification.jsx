import { useRouter } from 'expo-router';
import { ChevronLeft, Bell, CheckCheck } from 'lucide-react-native';
import { useState } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const FILTERS = ['All', 'Unread', 'Read'];

export default function Notification() {
  const router = useRouter();
  const [selectedOption, setSelectedOption] = useState('All');

  return (
    <SafeAreaView edges={['top']} className='bg-gray-50 flex-1'>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View
          style={{
            flexDirection: 'row',
            position: 'relative',
            alignItems: 'center',
            paddingHorizontal: 20,
            paddingTop: 20,
            paddingBottom: 20,
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
              position: 'absolute',
              left: 20,
              top: 15,
              zIndex: 1,
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
            Notifications
          </Text>
        </View>

        {/* Filter Tabs */}
        <View
          style={{
            flexDirection: 'row',
            marginHorizontal: 20,
            backgroundColor: '#f3f4f6',
            borderRadius: 12,
            padding: 4,
            marginBottom: 16,
          }}
        >
          {FILTERS.map((label) => (
            <Pressable
              key={label}
              onPress={() => setSelectedOption(label)}
              style={{
                flex: 1,
                paddingVertical: 8,
                borderRadius: 10,
                alignItems: 'center',
                backgroundColor:
                  selectedOption === label ? '#8e51ff' : 'transparent',
                shadowColor:
                  selectedOption === label ? '#8e51ff' : 'transparent',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2,
                shadowRadius: 4,
                elevation: selectedOption === label ? 3 : 0,
              }}
            >
              <Text
                style={{
                  fontFamily: 'Poppins600',
                  fontSize: 13,
                  color: selectedOption === label ? '#fff' : '#71717a',
                }}
              >
                {label}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Notification Items */}
        <View style={{ marginHorizontal: 20, gap: 10 }}>
          {[
            {
              title: 'Account Updated',
              message:
                'Your account has been successfully updated by the admin.',
              time: '2m ago',
              read: false,
            },
            {
              title: 'Payment Verified',
              message:
                "Your payment has been verified. You're now eligible for an exclusive slot.",
              time: '1h ago',
              read: false,
            },
            {
              title: 'Slot Available',
              message: 'A new parking slot has opened up in Building A.',
              time: '3h ago',
              read: true,
            },
            {
              title: 'Semester Started',
              message:
                'The new semester has officially started. Check your slot status.',
              time: 'Yesterday',
              read: true,
            },
          ]
            .filter((n) => {
              if (selectedOption === 'Unread') return !n.read;
              if (selectedOption === 'Read') return n.read;
              return true;
            })
            .map((notif, i) => (
              <Pressable
                key={i}
                className='active:opacity-80'
                style={{
                  backgroundColor: '#fff',
                  borderRadius: 16,
                  padding: 16,
                  flexDirection: 'row',
                  alignItems: 'flex-start',
                  gap: 12,
                  borderWidth: 1,
                  borderColor: notif.read ? '#e5e7eb' : '#e9e0ff',
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.04,
                  shadowRadius: 4,
                  elevation: 1,
                }}
              >
                {/* Icon */}
                <View
                  style={{
                    backgroundColor: notif.read ? '#f3f4f6' : '#f0ebff',
                    padding: 10,
                    borderRadius: 12,
                  }}
                >
                  <Bell color={notif.read ? '#9ca3af' : '#8e51ff'} size={18} />
                </View>
                {/* Content */}
                <View style={{ flex: 1 }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: 4,
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: 'Poppins600',
                        fontSize: 14,
                        color: '#0e0e11',
                      }}
                    >
                      {notif.title}
                    </Text>
                    <Text
                      style={{
                        fontFamily: 'Poppins400',
                        fontSize: 11,
                        color: '#9ca3af',
                      }}
                    >
                      {notif.time}
                    </Text>
                  </View>
                  <Text
                    style={{
                      fontFamily: 'Poppins400',
                      fontSize: 13,
                      color: '#71717a',
                      lineHeight: 18,
                    }}
                    numberOfLines={2}
                  >
                    {notif.message}
                  </Text>
                </View>
                {/* Unread dot */}
                {!notif.read && (
                  <View
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: '#8e51ff',
                      marginTop: 4,
                    }}
                  />
                )}
              </Pressable>
            ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
