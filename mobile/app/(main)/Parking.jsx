import { useRouter } from 'expo-router';
import { useSelector } from 'react-redux';
import { ChevronLeft } from 'lucide-react-native';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import useApiRequest from '../hooks/useApiRequest';
import { getOccupiedSlotLocation } from '../services/slotService';
import { useState, useEffect } from 'react';
import MapRenderer from '../components/DynamicMap';

export default function Parking() {
  const router = useRouter();
  const { user } = useSelector((state) => state.auth);
  const { loading, error, execute } = useApiRequest();
  const [haveSlot, setHaveSlot] = useState(false);
  const [mapData, setMapData] = useState(undefined);
  const [slotData, setSlotData] = useState(null);

  useEffect(() => {
    if (!user) return;
    const getSlotLocation = async () => {
      setHaveSlot(false);
      const res = await execute(getOccupiedSlotLocation, user._id);
      if (res?.status === 200) {
        setHaveSlot(true);
        setSlotData(res.data.slot);
        setMapData({ map: res.data.map, shapes: res.data.shapes });
      }
    };

    getSlotLocation();
  }, []);

  return (
    <SafeAreaView
      edges={['top']}
      className='bg-gray-50 flex flex-col gap-5 flex-1'
    >
      {/* Header */}
      <View className='flex flex-row relative items-top justify-between mx-5 py-5'>
        <Pressable onPress={() => router.push('/Home')} className=''>
          <ChevronLeft color={'#0e0e11'} size={25} />
        </Pressable>
        <Text className='left-1/2 text-[#0e0e11] font-poppins-bold text-2xl top-5 -translate-x-1/2 absolute'>
          Parking
        </Text>
      </View>
      {/* Parking View */}
      <View className='min-h-52 border border-gray-200 rounded-lg bg-white mx-5 flex flex-col'>
        <Text className='py-3 text-sm border-b border-b-gray-200 font-poppins-medium text-[#71717a] px-5 mb-2'>
          {mapData && mapData.map.name} Area View
        </Text>
        <View className='flex-1 relative w-full'>
          {/* Indicator */}
          <View className='flex gap-2 flex-row items-center absolute right-5'>
            <View className='h-6 w-6 rounded-full bg-violet-100 flex items-center justify-center'>
              <View className='h-4 w-4 rounded-full bg-violet-200 flex items-center justify-center'>
                <View className='h-2 w-2 rounded-full bg-violet-300'></View>
              </View>
            </View>
            <Text className='font-poppins text-xs text-violet-400'>You</Text>
          </View>
          {/* Map */}
          {mapData && <MapRenderer data={mapData} />}
        </View>
      </View>
      {/* Slot Details */}
      <View className='flex flex-col border border-gray-200 rounded-lg bg-white mx-5'>
        <Text className='py-3 text-sm border-b border-b-gray-200 font-poppins-medium text-[#71717a] px-5'>
          Slot Details
        </Text>

        {/* Data */}
        <View className='p-5 flex flex-row gap-10'>
          <View>
            <Text className='font-poppins text-xs text-[#71717a]'>Label</Text>
            <Text className='font-poppins-bold text-lg'>
              {slotData?.slotId?.metadata?.label}
            </Text>
          </View>

          <View>
            <Text className='font-poppins text-xs text-[#71717a]'>
              Entry Time
            </Text>
            <Text className='font-poppins-bold text-lg'>
              {slotData?.entryTime &&
                new Date(slotData.entryTime).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: true,
                })}
            </Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
