import { useRouter } from 'expo-router';
import { ChevronLeft, Moon, Sun } from 'lucide-react-native';
import { useState } from 'react';
import { View, Text, ScrollView, Pressable, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Settings() {
  const router = useRouter();
  return (
    <SafeAreaView edges={['top']} className='bg-gray-50 flex-1'>
      <ScrollView contentContainerClassName='flex flex-col gap-5'>
        {/* Header */}
        <View className='flex flex-row relative items-center justify-between mx-5 py-5'>
          <Pressable onPress={() => router.push('/Home')} className=''>
            <ChevronLeft color={'#0e0e11'} size={25} />
          </Pressable>
          <Text className='left-1/2 font-poppins-bold text-2xl -translate-x-1/2 absolute'>
            Settings
          </Text>
        </View>
        {/* Themes */}
        <View className='flex flex-col gap-3 mx-5'>
          {/* Theme Header */}
          <View className='flex flex-col gap-1'>
            <Text className='font-poppins-medium text-[#0e0e11] text-xl'>
              Themes
            </Text>
            <Text className='font-poppins text-[#71717a]'>
              You can choose your theme preference.
            </Text>
          </View>
          {/* Light Theme */}
          <View className='flex flex-row active:opacity-80 items-center gap-3 bg-white rounded-lg p-4 border border-gray-200'>
            <Sun color={'#71717a'} />
            <Text className='font-poppins text-[#71717a]'>Light Theme</Text>
          </View>
          {/* Dark Theme */}
          <View className='bg-[#18181b] active:opacity-80 flex flex-row gap-3 items-center rounded-lg p-4 border border-[#1a1aaa]'>
            <Moon color={'white'} strokeWidth={1.5} />
            <Text className='font-poppins text-white'>Dark Theme</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
