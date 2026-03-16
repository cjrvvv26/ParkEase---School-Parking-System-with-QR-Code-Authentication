import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { useSelector } from 'react-redux';
import { Text, View, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Bell, ParkingSquare, Settings, User } from 'lucide-react-native';
import { getSemester } from '../services/semesterService';
import useApiRequest from '../hooks/useApiRequest';
import { getAvailableSlots } from '../services/slotService';

const centerNavData = [
  { icon: <User color={'#ffff'} />, label: 'Profile', to: '/Account' },
  { icon: <Settings color={'#ffff'} />, label: 'Settings', to: '/Settings' },
  {
    icon: <ParkingSquare color={'#ffff'} />,
    label: 'Parking',
    to: '/Parking',
  },
];

export default function Home() {
  const router = useRouter();
  const [semester, setSemester] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const { user } = useSelector((state) => state.auth);
  const { loading, error, execute } = useApiRequest();

  useEffect(() => {
    const fetchData = async () => {
      const semesterData = await execute(getSemester);
      const slotsData = await execute(getAvailableSlots);
      console.log(error);
      console.log(slotsData);

      if (semesterData?.status === 200 && slotsData?.status === 200)
        setAvailableSlots(slotsData.data);
      return setSemester(semesterData.data.data);
    };

    fetchData();
  }, []);

  return (
    <SafeAreaView edges={['top']} className='bg-gray-50 flex-1'>
      <ScrollView
        className='flex-1 '
        contentContainerClassName='flex flex-col gap-5'
      >
        {/* Header */}
        <View className='w-full pt-5 px-5 flex flex-row items-center justify-between'>
          {/* User Info */}
          <View className='flex flex-row gap-3 items-center'>
            <View>
              <Text className='text-2xl text-[#0e0e11] font-poppins-bold'>
                Welcome back, {user.name?.firstName?.split(' ')[0]}!
              </Text>
              <Text className='font-poppins-medium text-lg text-[#71717a]'>
                View and manage your account
              </Text>
            </View>
          </View>
          {/* Notification */}
          <Pressable
            onPress={() => router.push('/Notification')}
            className='border border-[#c6b1ff] shadow-sm active:opacity-80 bg-[#8e51ff] p-3 rounded-full'
          >
            <View>
              <Bell color={'#ffff'} size={25} />
            </View>
          </Pressable>
        </View>
        {/* Semester Status */}
        {error === 'No active semester found' ? (
          <View className='p-5 rounded-lg border border-gray-200 bg-white shadow-sm mx-5'>
            <Text className='font-poppins-medium text-lg text-[#71717a]'>
              No Active Semester
            </Text>
          </View>
        ) : (
          semester && (
            <View className='bg-white border border-gray-200 p-5 mx-5 rounded-lg shadow-sm'>
              <Text className='font-poppins-medium text-lg text-[#71717a]'>
                Current Semester
              </Text>
              <Text className='font-poppins-bold mb-5 truncate text-xl text-[#0e0e11] '>
                {semester.name}
              </Text>
              <View className='border border-[#d7d7da] rounded-lg'>
                {/* Header */}
                <View className='flex flex-row border-b border-b-gray-200'>
                  <Text className='flex-1 p-2 font-poppins-medium border-r text-[#71717a] border-r-gray-200'>
                    Start At
                  </Text>
                  <Text className='flex-1 p-2 font-poppins-medium text-[#71717a]'>
                    Ends At
                  </Text>
                </View>
                {/* Data */}
                <View className='flex flex-row'>
                  <Text className='flex-1 p-2 font-poppins-medium border-r border-r-gray-200'>
                    {semester.startDate}
                  </Text>
                  <Text className='flex-1 p-2 font-poppins-medium '>
                    {semester.endDate}
                  </Text>
                </View>
              </View>
            </View>
          )
        )}
        {/* Additional Navigation */}
        <View className='mx-5 p-3 flex flex-row justify-evenly rounded-xl gap-5 bg-violet-50'>
          {centerNavData.map((nav, i) => (
            <Pressable
              onPress={() => router.push(nav.to)}
              key={i}
              className='flex flex-col gap-1 items-center'
            >
              <View className='bg-[#8e51ff] p-4 rounded-full shadow-sm shadow-gray-400'>
                {nav.icon}
              </View>
              <Text className='font-poppins text-[#310b6a]'>{nav.label}</Text>
            </Pressable>
          ))}
        </View>
        {/* Available Slots */}
        <View className='flex flex-1 flex-col gap-3  border border-gray-200 bg-white p-5 rounded-ss-3xl rounded-es-3xl shadow-sm mx-5'>
          {/* Header */}
          <View className='flex flex-row items-center justify-between'>
            <Text className='text-xl text-[#0e0e011] font-poppins-bold'>
              Available Slots
            </Text>
          </View>
          {/* Slots */}
          {availableSlots &&
            availableSlots.map((slot, _) => (
              <View
                key={slot._id}
                className='flex items-center bg-gray-50 rounded-lg px-5 justify-between'
              >
                <View className='flex flex-col py-2 w-full'>
                  <Text className='text-[#310b6a] font-poppins-medium text-lg'>
                    {slot.slotId.metadata.label}
                  </Text>
                  <Text className='text-[#71717a] font-poppins text-base'>
                    {slot.slotId.mapId.name}
                  </Text>
                </View>
              </View>
            ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
