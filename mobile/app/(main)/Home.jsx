import { useState } from 'react';
import { Text, View, Button, Image, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Bell } from 'lucide-react-native';
export default function Home() {
  return (
    <SafeAreaView
      edges={['top']}
      className='bg-gray-100 h-full flex flex-col gap-5'
    >
      {/* Header */}
      <View className='w-full pt-5 px-5 flex flex-row items-center justify-between'>
        {/* User Info */}
        <View className='flex flex-row gap-3 items-center'>
          <View>
            <Text className='text-2xl text-[#0e0e11] font-poppins-bold'>
              Welcome back, Clarence!
            </Text>
            <Text className='font-poppins-medium text-lg text-[#71717a]'>
              View and manage your account
            </Text>
          </View>
        </View>
        {/* Notification */}
        <Pressable className='shadow-md active:opacity-80 bg-white p-3 rounded-full'>
          <View>
            <Bell color={'#0e0e11'} size={25} />
          </View>
        </Pressable>
      </View>
      {/* Semester Status */}
      <View className='bg-white p-5 mx-5 rounded-lg shadow-md'>
        <Text className='font-poppins-medium text-lg text-[#71717a]'>
          Current Semester
        </Text>
        <Text className='font-poppins-bold mb-5 truncate text-xl text-[#0e0e11] '>
          2nd Semester (Jan - Mar 2026)
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
          <View className='flex flex-row border-b border-b-gray-200'>
            <Text className='flex-1 p-2 font-poppins-medium border-r border-r-gray-200'>
              01-25-23
            </Text>
            <Text className='flex-1 p-2 font-poppins-medium '>01-25-23</Text>
          </View>
        </View>
      </View>
      {/* Slot Status */}
      <View className='border border-[#aa85ff] mx-5 p-5 rounded-lg gap-5 shadow-md shadow-[#aa85ff] bg-violet-500'>
        <Text className='font-poppins-bold text-lg text-[#310b6a]'>
          GET YOUR EXCLUSIVE SLOT
        </Text>
        <Pressable className='bg-violet-600 active:opacity-80 rounded-md flex items-center justify-center py-4'>
          <Text className='text-white font-poppins-medium'>Verify Account</Text>
        </Pressable>
      </View>
      {/* Available Slots */}
      <View className='flex flex-col gap-3 bg-white p-5 rounded-ss-3xl rounded-es-3xl shadow-md mx-5 flex-1'>
        {/* Header */}
        <View className='flex flex-row items-center justify-between'>
          <Text className='text-xl text-[#0e0e011] font-poppins-bold'>
            Available Slots
          </Text>
        </View>
        {/* Slots */}
        <View className='flex items-center bg-gray-100 rounded-lg px-5 justify-between'>
          <View className='flex flex-col py-2 w-full'>
            <Text className='text-[#0e0e11] font-poppins-medium text-lg'>
              MX-1231FA
            </Text>
            <Text className='text-[#71717a] font-poppins text-base'>
              Admin Bldg
            </Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
