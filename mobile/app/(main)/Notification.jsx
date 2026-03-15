import { useRouter } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { useState } from 'react';
import { View, Text, ScrollView, Pressable, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Notification() {
  const router = useRouter();
  const [selectedOption, setSelectedOption] = useState('All');
  return (
    <SafeAreaView edges={['top']} className='bg-gray-50 flex-1'>
      <ScrollView contentContainerClassName='flex flex-col gap-5'>
        {/* Header */}
        <View className='flex flex-row relative items-center justify-between mx-5 py-5'>
          <Pressable onPress={() => router.push('/Home')} className=''>
            <ChevronLeft color={'#0e0e11'} size={25} />
          </Pressable>
          <Text className='left-1/2 font-poppins-bold text-2xl -translate-x-1/2 absolute'>
            Notifications
          </Text>
        </View>
        {/* Buttons */}
        <View className='bg-gray-100 p-3 self-start ml-5 rounded-lg flex flex-row gap-3'>
          {['All', 'Unread', 'Read'].map((label, k) => (
            <Pressable
              key={k}
              onPress={() => setSelectedOption(label)}
              className={`${selectedOption === label ? 'bg-violet-500' : 'bg-white'} shadow-md shadow-gray-200 py-2 px-4 rounded-lg active:opacity-80`}
            >
              <Text
                className={`${selectedOption === label ? 'text-white' : 'text-[#71717a]'} font-poppins-medium`}
              >
                {label}
              </Text>
            </Pressable>
          ))}
        </View>
        {/* Data */}
        <View className='flex flex-col mx-5'>
          <View className='flex flex-row bg-gray-100 justify-between rounded-lg p-4 items-center active:opacity-80'>
            {/* Info */}
            <View className='flex flex-row gap-2'>
              <Image className='h-14 w-14 object-contain rounded-full' />
              <View className='flex flex-col'>
                <Text className='font-poppins-medium text-base text-[#0e0e11]'>
                  Clarence James Valle
                </Text>
                <Text className='font-poppins-medium line-clamp-1 w-72 text-nowrap text-ellipsis text-base text-[#71717a]'>
                  Your account has been updated
                </Text>
              </View>
            </View>
            {/* Stats */}
            <View className='h-3 w-3 rounded-full bg-violet-500'></View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
