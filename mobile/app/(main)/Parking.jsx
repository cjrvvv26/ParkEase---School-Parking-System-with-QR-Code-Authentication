import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSelector } from 'react-redux';
import { ChevronLeft, MapPin, Clock, ParkingSquare, Navigation } from 'lucide-react-native';
import { Pressable, Text, View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import useApiRequest from '../hooks/useApiRequest';
import { getOccupiedSlotLocation } from '../services/slotService';
import { useState, useEffect } from 'react';
import MapRenderer from '../components/DynamicMap';
import useTheme from '../hooks/useTheme';

export default function Parking() {
  const router = useRouter();
  const { state } = useLocalSearchParams();
  const { user } = useSelector((state) => state.auth);
  const { loading, error, execute } = useApiRequest();
  const { t } = useTheme();
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
        setHaveSlot(true);
        setSlotData(res.data.slot);
        setMapData({ map: res.data.map, shapes: res.data.shapes, slotId: res.data.slot.slotId._id });
      }
    };
    getSlotLocation();
  }, []);

  useEffect(() => { if (state) setMessage(state); }, [state]);
  useEffect(() => {
    const timer = setTimeout(() => setMessage(''), 3000);
    return () => clearTimeout(timer);
  }, [message]);

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: t.bg }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>

        {/* Header */}
        <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 20, paddingBottom: 16 }}>
          <Pressable onPress={() => router.push('/Home')} style={{ backgroundColor: t.headerBtn, padding: 8, borderRadius: 12, borderWidth: 1, borderColor: t.headerBtnBorder }}>
            <ChevronLeft color={t.text} size={22} />
          </Pressable>
          <Text style={{ flex: 1, textAlign: 'center', fontFamily: 'Poppins700', fontSize: 20, color: t.text }}>My Parking</Text>
          <View style={{ width: 38 }} />
        </View>

        {/* Toast */}
        {message ? (
          <View style={{ marginHorizontal: 20, marginBottom: 12, backgroundColor: t.primaryLight, borderRadius: 12, padding: 12, borderWidth: 1, borderColor: t.primaryBorder, flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Navigation color={t.primary} size={16} />
            <Text style={{ fontFamily: 'Poppins600', fontSize: 13, color: t.primary, flex: 1 }}>{message}</Text>
          </View>
        ) : null}

        {/* Map Card */}
        <View style={{ marginHorizontal: 20, marginBottom: 16, backgroundColor: t.card, borderRadius: 20, borderWidth: 1, borderColor: t.cardBorder, overflow: 'hidden' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: t.divider }}>
            <View style={{ backgroundColor: t.primaryLight, padding: 6, borderRadius: 8 }}>
              <MapPin color={t.primary} size={14} />
            </View>
            <Text style={{ fontFamily: 'Poppins600', fontSize: 13, color: t.text, flex: 1 }}>
              {mapData?.map?.name ? `${mapData.map.name} Area` : 'Parking Area'}
            </Text>
            {haveSlot && (
              <View style={{ backgroundColor: t.greenBg, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20 }}>
                <Text style={{ fontFamily: 'Poppins600', fontSize: 11, color: t.green }}>Occupied</Text>
              </View>
            )}
          </View>
          <View style={{ height: 240, position: 'relative' }}>
            {mapData ? (
              <>
                <View style={{ position: 'absolute', right: 12, top: 8, zIndex: 10, flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(255,255,255,0.9)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 20, borderWidth: 1, borderColor: t.primaryBorder }}>
                  <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: t.primary }} />
                  <Text style={{ fontFamily: 'Poppins600', fontSize: 11, color: t.primary }}>You</Text>
                </View>
                <MapRenderer data={mapData} />
              </>
            ) : (
              <View style={{ flex: 1, backgroundColor: t.skeletonBg, margin: 12, borderRadius: 12 }} />
            )}
          </View>
        </View>

        {/* Slot Details */}
        <View style={{ marginHorizontal: 20, backgroundColor: t.card, borderRadius: 20, borderWidth: 1, borderColor: t.cardBorder, overflow: 'hidden' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: t.divider }}>
            <View style={{ backgroundColor: t.primaryLight, padding: 6, borderRadius: 8 }}>
              <ParkingSquare color={t.primary} size={14} />
            </View>
            <Text style={{ fontFamily: 'Poppins600', fontSize: 13, color: t.text }}>Slot Details</Text>
          </View>
          <View style={{ flexDirection: 'row', padding: 16, gap: 12 }}>
            <View style={{ flex: 1, backgroundColor: t.inputBg, borderRadius: 14, padding: 14, borderWidth: 1, borderColor: t.cardBorder }}>
              <Text style={{ fontFamily: 'Poppins400', fontSize: 11, color: t.textFaint, marginBottom: 4 }}>Slot Label</Text>
              {slotData ? (
                <Text style={{ fontFamily: 'Poppins700', fontSize: 20, color: t.primary }}>{slotData?.slotId?.metadata?.label}</Text>
              ) : (
                <View style={{ height: 24, backgroundColor: t.skeletonBg, borderRadius: 6, marginTop: 4 }} />
              )}
            </View>
            <View style={{ flex: 1, backgroundColor: t.inputBg, borderRadius: 14, padding: 14, borderWidth: 1, borderColor: t.cardBorder }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 4 }}>
                <Clock color={t.textFaint} size={11} />
                <Text style={{ fontFamily: 'Poppins400', fontSize: 11, color: t.textFaint }}>Entry Time</Text>
              </View>
              {slotData?.entryTime ? (
                <Text style={{ fontFamily: 'Poppins700', fontSize: 16, color: t.text }}>
                  {new Date(slotData.entryTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
                </Text>
              ) : (
                <View style={{ height: 24, backgroundColor: t.skeletonBg, borderRadius: 6, marginTop: 4 }} />
              )}
            </View>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}
