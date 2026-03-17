import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { useSelector } from 'react-redux';
import { Text, View, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Bell,
  ParkingSquare,
  Settings,
  User,
  TrendingUp,
  MapPin,
  Calendar,
  ChevronRight,
} from 'lucide-react-native';
import { getSemester } from '../services/semesterService';
import useApiRequest from '../hooks/useApiRequest';
import { getAvailableSlots } from '../services/slotService';

export default function Home() {
  const router = useRouter();
  const [semester, setSemester] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const { user } = useSelector((state) => state.auth);
  console.log(user);

  const { loading, error, execute } = useApiRequest();

  useEffect(() => {
    const fetchData = async () => {
      const semesterData = await execute(getSemester);
      const slotsData = await execute(getAvailableSlots);
      if (semesterData?.status === 200 && slotsData?.status === 200)
        setAvailableSlots(slotsData.data);
      return setSemester(semesterData.data.data);
    };
    fetchData();
  }, []);

  const centerNavData = [
    { icon: User, label: 'Profile', to: '/Account', bg: '#8e51ff' },
    { icon: Settings, label: 'Settings', to: '/Settings', bg: '#8e51ff' },
    ...(user.role === 'guard'
      ? [
          {
            icon: ParkingSquare,
            label: 'Parking',
            to: '/Parking',
            bg: '#8e51ff',
          },
        ]
      : []),

    ...(user.role !== 'guard'
      ? [
          {
            icon: TrendingUp,
            label: 'Analytics',
            to: '/Analytics',
            bg: '#8e51ff',
          },
        ]
      : []),
  ];

  return (
    <SafeAreaView edges={['top']} className='bg-gray-50 flex-1'>
      <ScrollView
        className='flex-1'
        contentContainerStyle={{ paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className='w-full pt-6 px-5 flex flex-row items-center justify-between'>
          <View>
            <Text className='text-2xl text-[#0e0e11] font-poppins-bold'>
              Welcome back,
            </Text>
            <Text className='text-2xl text-[#8e51ff] font-poppins-bold'>
              {user.name?.firstName?.split(' ')[0]}!
            </Text>
            <Text className='font-poppins text-sm text-[#71717a] mt-1'>
              View and manage your account
            </Text>
          </View>
          <Pressable
            onPress={() => router.push('/Notification')}
            className='active:opacity-70'
            style={{
              backgroundColor: '#8e51ff',
              padding: 12,
              borderRadius: 50,
              shadowColor: '#8e51ff',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 6,
            }}
          >
            <Bell color='#fff' size={22} />
          </Pressable>
        </View>

        {/* Semester Card */}
        <View className='mx-5 mt-6'>
          {error === 'No active semester found' ? (
            <View
              style={{
                backgroundColor: '#fff',
                borderRadius: 16,
                padding: 20,
                borderWidth: 1,
                borderColor: '#e5e7eb',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.06,
                shadowRadius: 8,
                elevation: 2,
              }}
            >
              <View className='flex flex-row items-center gap-3'>
                <View
                  style={{
                    backgroundColor: '#fef3c7',
                    padding: 8,
                    borderRadius: 10,
                  }}
                >
                  <Calendar color='#d97706' size={18} />
                </View>
                <Text className='font-poppins-medium text-[#71717a]'>
                  No Active Semester
                </Text>
              </View>
            </View>
          ) : (
            semester && (
              <View
                style={{
                  backgroundColor: '#8e51ff',
                  borderRadius: 20,
                  padding: 20,
                  shadowColor: '#8e51ff',
                  shadowOffset: { width: 0, height: 6 },
                  shadowOpacity: 0.35,
                  shadowRadius: 12,
                  elevation: 8,
                }}
              >
                <View className='flex flex-row items-center gap-2 mb-3'>
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

        {/* Quick Nav Grid */}
        <View className='mx-5 mt-6'>
          <Text className='font-poppins-bold text-[#0e0e11] text-base mb-3'>
            Quick Access
          </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
            {centerNavData.map((nav, i) => (
              <Pressable
                key={i}
                onPress={() => router.push(nav.to)}
                style={{
                  width: i === 2 ? '100%' : '48%', // 3rd item full width
                  backgroundColor: '#fff',
                  borderRadius: 16,
                  padding: 16,
                  borderWidth: 1,
                  borderColor: '#f0ebff',
                  shadowColor: '#8e51ff',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.08,
                  shadowRadius: 6,
                  elevation: 2,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  // remove flex: 1
                }}
              >
                <View
                  style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}
                >
                  <View
                    style={{
                      backgroundColor: '#f0ebff',
                      padding: 10,
                      borderRadius: 12,
                    }}
                  >
                    <nav.icon color='#8e51ff' size={20} />
                  </View>
                  <Text
                    style={{
                      fontFamily: 'Poppins600',
                      fontSize: 13,
                      color: '#0e0e11',
                    }}
                  >
                    {nav.label}
                  </Text>
                </View>
                <ChevronRight color='#c4b5fd' size={16} />
              </Pressable>
            ))}
          </View>
        </View>

        {/* Available Slots */}
        <View className='mx-5 mt-6'>
          <View className='flex flex-row items-center justify-between mb-3'>
            <Text className='font-poppins-bold text-[#0e0e11] text-base'>
              Available Slots
            </Text>
            <View
              style={{
                backgroundColor: '#f0ebff',
                paddingHorizontal: 10,
                paddingVertical: 4,
                borderRadius: 20,
              }}
            >
              <Text
                style={{
                  color: '#8e51ff',
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
                backgroundColor: '#fff',
                borderRadius: 16,
                padding: 20,
                borderWidth: 1,
                borderColor: '#e5e7eb',
              }}
            >
              {[1, 2, 3].map((k) => (
                <View
                  key={k}
                  style={{
                    height: 52,
                    backgroundColor: '#f3f4f6',
                    borderRadius: 10,
                    marginBottom: 8,
                  }}
                />
              ))}
            </View>
          ) : availableSlots.length === 0 ? (
            <View
              style={{
                backgroundColor: '#fff',
                borderRadius: 16,
                padding: 24,
                borderWidth: 1,
                borderColor: '#e5e7eb',
                alignItems: 'center',
              }}
            >
              <MapPin color='#d1d5db' size={32} />
              <Text
                style={{
                  color: '#9ca3af',
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
              {availableSlots.map((slot, idx) => (
                <View
                  key={slot._id}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingHorizontal: 16,
                    paddingVertical: 14,
                    borderBottomWidth: idx < availableSlots.length - 1 ? 1 : 0,
                    borderBottomColor: '#f3f4f6',
                  }}
                >
                  <View
                    style={{
                      backgroundColor: '#f0ebff',
                      padding: 8,
                      borderRadius: 10,
                      marginRight: 12,
                    }}
                  >
                    <MapPin color='#8e51ff' size={16} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        color: '#0e0e11',
                        fontFamily: 'Poppins600',
                        fontSize: 14,
                      }}
                    >
                      {slot.slotId.metadata.label}
                    </Text>
                    <Text
                      style={{
                        color: '#71717a',
                        fontFamily: 'Poppins400',
                        fontSize: 12,
                        marginTop: 1,
                      }}
                    >
                      {slot.slotId.mapId.name}
                    </Text>
                  </View>
                  <View
                    style={{
                      backgroundColor: '#dcfce7',
                      paddingHorizontal: 8,
                      paddingVertical: 3,
                      borderRadius: 20,
                    }}
                  >
                    <Text
                      style={{
                        color: '#16a34a',
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
