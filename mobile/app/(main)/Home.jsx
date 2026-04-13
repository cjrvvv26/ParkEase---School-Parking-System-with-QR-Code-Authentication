import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'expo-router';
import { useSelector, useDispatch } from 'react-redux';
import { Text, View, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from 'expo-router';
import {
  Bell,
  ParkingSquare,
  Settings,
  User,
  TrendingUp,
  MapPin,
  Calendar,
  ChevronRight,
  LogIn,
  LogOut,
} from 'lucide-react-native';
import { getSemester } from '../services/semesterService';
import { getAvailableSlots } from '../services/slotService';
import { getData } from '../services/authService';
import useApiRequest from '../hooks/useApiRequest';
import useTheme from '../hooks/useTheme';
import { login } from '../features/authSlicer';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Home() {
  const router = useRouter();
  const [semester, setSemester] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const { t } = useTheme();
  const { loading, error, execute } = useApiRequest();

  useEffect(() => {
    if (!user?._id) return;
    const fetchData = async () => {
      const [semesterData, slotsData] = await Promise.all([
        execute(getSemester),
        execute(getAvailableSlots),
      ]);
      if (semesterData?.status === 200) setSemester(semesterData.data?.data ?? null);
      if (slotsData?.status === 200) setAvailableSlots(slotsData.data ?? []);
    };
    fetchData();
  }, [user?._id]);

  useFocusEffect(
    useCallback(() => {
      const refreshUser = async () => {
        const token = await AsyncStorage.getItem('token');
        if (!token) return;
        const res = await execute(getData, token);
        if (res?.status === 200) {
          dispatch(login({ user: { ...res.data, termsAccepted: res.data.termsAccepted ?? true } }));
        }
      };
      refreshUser();
    }, [])
  );

  if (!user?._id) return null;

  const centerNavData = [
    { icon: User, label: 'Profile', to: '/Account' },
    { icon: Settings, label: 'Settings', to: '/Settings' },
    ...(user.role !== 'guard'
      ? [{ icon: ParkingSquare, label: 'Parking', to: '/Parking' }]
      : [{ icon: TrendingUp, label: 'Analytics', to: '/Analytics' }]),
  ];

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: t.bg }}>
      <ScrollView
        className='flex-1'
        contentContainerStyle={{ paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View
          style={{
            paddingTop: 24,
            paddingHorizontal: 20,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <View>
            <Text
              style={{ fontSize: 22, color: t.text, fontFamily: 'Poppins700' }}
            >
              Welcome back,
            </Text>
            <Text
              style={{
                fontSize: 22,
                color: t.primary,
                fontFamily: 'Poppins700',
              }}
            >
              {(typeof user.name === 'string' ? user.name : user.name?.firstName ?? '')?.split(' ')[0]}!
            </Text>
            <Text
              style={{
                fontFamily: 'Poppins400',
                fontSize: 13,
                color: t.textMuted,
                marginTop: 2,
              }}
            >
              View and manage your account
            </Text>
          </View>
          <Pressable
            onPress={() => router.push('/Notification')}
            style={{
              backgroundColor: t.primary,
              padding: 12,
              borderRadius: 50,
              shadowColor: t.primary,
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 6,
            }}
          >
            <Bell color='#fff' size={22} />
          </Pressable>
        </View>

        {/* In-School Status Banner — student & faculty only */}
        {(user.role === 'student' || user.role === 'faculty') && (
          <View style={{ marginHorizontal: 20, marginTop: 16 }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 12,
                borderRadius: 16,
                padding: 16,
                borderWidth: 1,
                backgroundColor: user.entryTime ? '#f0fdf4' : '#fef9ec',
                borderColor: user.entryTime ? '#bbf7d0' : '#fde68a',
              }}
            >
              <View
                style={{
                  padding: 10,
                  borderRadius: 12,
                  backgroundColor: user.entryTime ? '#dcfce7' : '#fef3c7',
                }}
              >
                {user.entryTime
                  ? <LogIn color='#16a34a' size={20} strokeWidth={1.5} />
                  : <LogOut color='#d97706' size={20} strokeWidth={1.5} />}
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontFamily: 'Poppins600', fontSize: 14, color: user.entryTime ? '#15803d' : '#92400e' }}>
                  {user.entryTime ? 'You are in school' : 'You are not in school'}
                </Text>
                <Text style={{ fontFamily: 'Poppins400', fontSize: 12, color: user.entryTime ? '#16a34a' : '#d97706', marginTop: 2 }}>
                  {user.entryTime
                    ? `Entry recorded at ${new Date(user.entryTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`
                    : 'Scan your QR code at the gate to enter'}
                </Text>
              </View>
              <View
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: 5,
                  backgroundColor: user.entryTime ? '#22c55e' : '#f59e0b',
                }}
              />
            </View>
          </View>
        )}

        {/* Semester Card */}
        <View style={{ marginHorizontal: 20, marginTop: 20 }}>
          {error === 'No active semester found' ? (
            <View
              style={{
                backgroundColor: t.card,
                borderRadius: 16,
                padding: 20,
                borderWidth: 1,
                borderColor: t.cardBorder,
              }}
            >
              <View
                style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}
              >
                <View
                  style={{
                    backgroundColor: t.amberBg,
                    padding: 8,
                    borderRadius: 10,
                  }}
                >
                  <Calendar color='#d97706' size={18} />
                </View>
                <Text
                  style={{
                    fontFamily: 'Poppins500',
                    fontSize: 14,
                    color: t.textMuted,
                  }}
                >
                  No Active Semester
                </Text>
              </View>
            </View>
          ) : (
            semester && (
              <View
                style={{
                  backgroundColor: t.primary,
                  borderRadius: 20,
                  padding: 20,
                  shadowColor: t.primary,
                  shadowOffset: { width: 0, height: 6 },
                  shadowOpacity: 0.35,
                  shadowRadius: 12,
                  elevation: 8,
                }}
              >
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 6,
                    marginBottom: 10,
                  }}
                >
                  <Calendar color='rgba(255,255,255,0.7)' size={14} />
                  <Text
                    style={{
                      color: 'rgba(255,255,255,0.7)',
                      fontFamily: 'Poppins500',
                      fontSize: 12,
                    }}
                  >
                    Current Semester
                  </Text>
                </View>
                <Text
                  style={{
                    color: '#fff',
                    fontFamily: 'Poppins700',
                    fontSize: 18,
                    marginBottom: 16,
                  }}
                  numberOfLines={1}
                >
                  {semester.name}
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    backgroundColor: 'rgba(255,255,255,0.15)',
                    borderRadius: 12,
                    overflow: 'hidden',
                  }}
                >
                  <View style={{ flex: 1, padding: 12 }}>
                    <Text
                      style={{
                        color: 'rgba(255,255,255,0.6)',
                        fontSize: 11,
                        fontFamily: 'Poppins500',
                      }}
                    >
                      Starts
                    </Text>
                    <Text
                      style={{
                        color: '#fff',
                        fontSize: 13,
                        fontFamily: 'Poppins600',
                        marginTop: 2,
                      }}
                    >
                      {semester.startDate}
                    </Text>
                  </View>
                  <View
                    style={{
                      width: 1,
                      backgroundColor: 'rgba(255,255,255,0.2)',
                    }}
                  />
                  <View style={{ flex: 1, padding: 12 }}>
                    <Text
                      style={{
                        color: 'rgba(255,255,255,0.6)',
                        fontSize: 11,
                        fontFamily: 'Poppins500',
                      }}
                    >
                      Ends
                    </Text>
                    <Text
                      style={{
                        color: '#fff',
                        fontSize: 13,
                        fontFamily: 'Poppins600',
                        marginTop: 2,
                      }}
                    >
                      {semester.endDate}
                    </Text>
                  </View>
                </View>
              </View>
            )
          )}
        </View>

        {/* Quick Access */}
        <View style={{ marginHorizontal: 20, marginTop: 20 }}>
          <Text
            style={{
              fontFamily: 'Poppins700',
              fontSize: 15,
              color: t.text,
              marginBottom: 12,
            }}
          >
            Quick Access
          </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
            {centerNavData.map((nav, i) => (
              <Pressable
                key={i}
                onPress={() => router.push(nav.to)}
                style={{
                  width:
                    i === centerNavData.length - 1 &&
                    centerNavData.length % 2 !== 0
                      ? '100%'
                      : '48%',
                  backgroundColor: t.card,
                  borderRadius: 16,
                  padding: 16,
                  borderWidth: 1,
                  borderColor: t.cardBorder,
                  shadowColor: t.primary,
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.08,
                  shadowRadius: 6,
                  elevation: 2,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 10,
                  }}
                >
                  <View
                    style={{
                      backgroundColor: t.primaryLight,
                      padding: 10,
                      borderRadius: 12,
                    }}
                  >
                    <nav.icon color={t.primary} size={20} />
                  </View>
                  <Text
                    style={{
                      fontFamily: 'Poppins600',
                      fontSize: 13,
                      color: t.text,
                    }}
                  >
                    {nav.label}
                  </Text>
                </View>
                <ChevronRight color={t.primaryBorder} size={16} />
              </Pressable>
            ))}
          </View>
        </View>

        {/* Available Slots */}
        <View style={{ marginHorizontal: 20, marginTop: 20 }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 12,
            }}
          >
            <Text
              style={{ fontFamily: 'Poppins700', fontSize: 15, color: t.text }}
            >
              Available Slots
            </Text>
            <View
              style={{
                backgroundColor: t.primaryLight,
                paddingHorizontal: 10,
                paddingVertical: 4,
                borderRadius: 20,
              }}
            >
              <Text
                style={{
                  color: t.primary,
                  fontSize: 12,
                  fontFamily: 'Poppins600',
                }}
              >
                {availableSlots.length} open
              </Text>
            </View>
          </View>

          {loading ? (
            <View
              style={{
                backgroundColor: t.card,
                borderRadius: 16,
                padding: 20,
                borderWidth: 1,
                borderColor: t.cardBorder,
              }}
            >
              {[1, 2, 3].map((k) => (
                <View
                  key={k}
                  style={{
                    height: 52,
                    backgroundColor: t.skeletonBg,
                    borderRadius: 10,
                    marginBottom: 8,
                  }}
                />
              ))}
            </View>
          ) : availableSlots.length === 0 ? (
            <View
              style={{
                backgroundColor: t.card,
                borderRadius: 16,
                padding: 24,
                borderWidth: 1,
                borderColor: t.cardBorder,
                alignItems: 'center',
              }}
            >
              <MapPin color={t.textFaint} size={32} />
              <Text
                style={{
                  color: t.textFaint,
                  fontFamily: 'Poppins500',
                  marginTop: 8,
                  fontSize: 13,
                }}
              >
                No available slots right now
              </Text>
            </View>
          ) : (
            <View
              style={{
                backgroundColor: t.card,
                borderRadius: 16,
                borderWidth: 1,
                borderColor: t.cardBorder,
                overflow: 'hidden',
              }}
            >
              {availableSlots.map((slot, idx) => (
                <View
                  key={slot._id}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingHorizontal: 16,
                    paddingVertical: 14,
                    borderBottomWidth: idx < availableSlots.length - 1 ? 1 : 0,
                    borderBottomColor: t.divider,
                  }}
                >
                  <View
                    style={{
                      backgroundColor: t.primaryLight,
                      padding: 8,
                      borderRadius: 10,
                      marginRight: 12,
                    }}
                  >
                    <MapPin color={t.primary} size={16} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        color: t.text,
                        fontFamily: 'Poppins600',
                        fontSize: 14,
                      }}
                    >
                      {slot.slotId?.metadata?.label ?? 'Slot'}
                    </Text>
                    <Text
                      style={{
                        color: t.textMuted,
                        fontFamily: 'Poppins400',
                        fontSize: 12,
                        marginTop: 1,
                      }}
                    >
                      {slot.slotId?.mapId?.name ?? 'Unknown Area'}
                    </Text>
                  </View>
                  <View
                    style={{
                      backgroundColor: t.greenBg,
                      paddingHorizontal: 8,
                      paddingVertical: 3,
                      borderRadius: 20,
                    }}
                  >
                    <Text
                      style={{
                        color: t.green,
                        fontSize: 11,
                        fontFamily: 'Poppins600',
                      }}
                    >
                      Open
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
