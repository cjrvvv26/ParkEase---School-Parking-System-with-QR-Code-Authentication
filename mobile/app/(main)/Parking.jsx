import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSelector } from 'react-redux';
import {
  ChevronLeft,
  MapPin,
  Clock,
  ParkingSquare,
  Navigation,
} from 'lucide-react-native';
import { Pressable, Text, View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import useApiRequest from '../hooks/useApiRequest';
import { getOccupiedSlotLocation } from '../services/slotService';
import { useState, useEffect } from 'react';
import MapRenderer from '../components/DynamicMap';

export default function Parking() {
  const router = useRouter();
  const { state } = useLocalSearchParams();
  const { user } = useSelector((state) => state.auth);
  const { loading, error, execute } = useApiRequest();
  const [haveSlot, setHaveSlot] = useState(false);
  const [mapData, setMapData] = useState(undefined);
  const [slotData, setSlotData] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!user) return;
    const getSlotLocation = async () => {
      setHaveSlot(false);
      const res = await execute(getOccupiedSlotLocation, user._id);
      if (res?.status === 200) {
        console.log(res);

        setHaveSlot(true);
        setSlotData(res.data.slot);
        setMapData({
          map: res.data.map,
          shapes: res.data.shapes,
          slotId: res.data.slot.slotId._id,
        });
      }
    };
    getSlotLocation();
  }, []);

  useEffect(() => {
    if (state) setMessage(state);
  }, [state]);

  useEffect(() => {
    const timer = setTimeout(() => setMessage(''), 3000);
    return () => clearTimeout(timer);
  }, [message]);

  return (
    <SafeAreaView
      edges={['top']}
      style={{ backgroundColor: '#f9fafb', flex: 1 }}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 32 }}
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
            My Parking
          </Text>
          <View style={{ width: 38 }} />
        </View>

        {/* Toast message */}
        {message ? (
          <View
            style={{
              marginHorizontal: 20,
              marginBottom: 12,
              backgroundColor: '#f0ebff',
              borderRadius: 12,
              padding: 12,
              borderWidth: 1,
              borderColor: '#c4b5fd',
              flexDirection: 'row',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <Navigation color='#8e51ff' size={16} />
            <Text
              style={{
                fontFamily: 'Poppins600',
                fontSize: 13,
                color: '#8e51ff',
                flex: 1,
              }}
            >
              {message}
            </Text>
          </View>
        ) : null}

        {/* Map Card */}
        <View
          style={{
            marginHorizontal: 20,
            marginBottom: 16,
            backgroundColor: '#fff',
            borderRadius: 20,
            borderWidth: 1,
            borderColor: '#e5e7eb',
            overflow: 'hidden',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.06,
            shadowRadius: 8,
            elevation: 3,
          }}
        >
          {/* Map header */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 8,
              paddingHorizontal: 16,
              paddingVertical: 12,
              borderBottomWidth: 1,
              borderBottomColor: '#f3f4f6',
            }}
          >
            <View
              style={{
                backgroundColor: '#f0ebff',
                padding: 6,
                borderRadius: 8,
              }}
            >
              <MapPin color='#8e51ff' size={14} />
            </View>
            <Text
              style={{
                fontFamily: 'Poppins600',
                fontSize: 13,
                color: '#0e0e11',
                flex: 1,
              }}
            >
              {mapData?.map?.name ? `${mapData.map.name} Area` : 'Parking Area'}
            </Text>
            {haveSlot && (
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
                    fontFamily: 'Poppins600',
                    fontSize: 11,
                    color: '#16a34a',
                  }}
                >
                  Occupied
                </Text>
              </View>
            )}
          </View>

          {/* Map body */}
          <View style={{ height: 240, position: 'relative' }}>
            {mapData ? (
              <>
                {/* You indicator */}
                <View
                  style={{
                    position: 'absolute',
                    right: 12,
                    top: 8,
                    zIndex: 10,
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 6,
                    backgroundColor: 'rgba(255,255,255,0.9)',
                    paddingHorizontal: 8,
                    paddingVertical: 4,
                    borderRadius: 20,
                    borderWidth: 1,
                    borderColor: '#e9e0ff',
                  }}
                >
                  <View
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: 5,
                      backgroundColor: '#8e51ff',
                    }}
                  />
                  <Text
                    style={{
                      fontFamily: 'Poppins600',
                      fontSize: 11,
                      color: '#8e51ff',
                    }}
                  >
                    You
                  </Text>
                </View>
                <MapRenderer data={mapData} />
              </>
            ) : (
              <View
                style={{
                  flex: 1,
                  backgroundColor: '#f3f4f6',
                  margin: 12,
                  borderRadius: 12,
                }}
              />
            )}
          </View>
        </View>
        <View
          style={{
            marginHorizontal: 20,
            backgroundColor: '#fff',
            borderRadius: 20,
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
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 8,
              paddingHorizontal: 16,
              paddingVertical: 12,
              borderBottomWidth: 1,
              borderBottomColor: '#f3f4f6',
            }}
          >
            <View
              style={{
                backgroundColor: '#f0ebff',
                padding: 6,
                borderRadius: 8,
              }}
            >
              <ParkingSquare color='#8e51ff' size={14} />
            </View>
            <Text
              style={{
                fontFamily: 'Poppins600',
                fontSize: 13,
                color: '#0e0e11',
              }}
            >
              Slot Details
            </Text>
          </View>

          <View style={{ flexDirection: 'row', padding: 16, gap: 12 }}>
            {/* Label */}
            <View
              style={{
                flex: 1,
                backgroundColor: '#f9fafb',
                borderRadius: 14,
                padding: 14,
                borderWidth: 1,
                borderColor: '#e5e7eb',
              }}
            >
              <Text
                style={{
                  fontFamily: 'Poppins400',
                  fontSize: 11,
                  color: '#9ca3af',
                  marginBottom: 4,
                }}
              >
                Slot Label
              </Text>
              {slotData ? (
                <Text
                  style={{
                    fontFamily: 'Poppins700',
                    fontSize: 20,
                    color: '#8e51ff',
                  }}
                >
                  {slotData?.slotId?.metadata?.label}
                </Text>
              ) : (
                <View
                  style={{
                    height: 24,
                    backgroundColor: '#e5e7eb',
                    borderRadius: 6,
                    marginTop: 4,
                  }}
                />
              )}
            </View>

            {/* Entry Time */}
            <View
              style={{
                flex: 1,
                backgroundColor: '#f9fafb',
                borderRadius: 14,
                padding: 14,
                borderWidth: 1,
                borderColor: '#e5e7eb',
              }}
            >
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 4,
                  marginBottom: 4,
                }}
              >
                <Clock color='#9ca3af' size={11} />
                <Text
                  style={{
                    fontFamily: 'Poppins400',
                    fontSize: 11,
                    color: '#9ca3af',
                  }}
                >
                  Entry Time
                </Text>
              </View>
              {slotData?.entryTime ? (
                <Text
                  style={{
                    fontFamily: 'Poppins700',
                    fontSize: 16,
                    color: '#0e0e11',
                  }}
                >
                  {new Date(slotData.entryTime).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true,
                  })}
                </Text>
              ) : (
                <View
                  style={{
                    height: 24,
                    backgroundColor: '#e5e7eb',
                    borderRadius: 6,
                    marginTop: 4,
                  }}
                />
              )}
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
