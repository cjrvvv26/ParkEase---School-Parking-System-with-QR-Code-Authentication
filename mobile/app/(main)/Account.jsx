import { useRouter } from 'expo-router';
import { ChevronLeft, PencilLine, UserRound } from 'lucide-react-native';
import { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Image,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';

export default function Account() {
  const router = useRouter();
  const [originalData, setOriginalData] = useState({});
  const [edit, toggleEdit] = useState(false);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    setOriginalData(user);
  }, []);

  return (
    <SafeAreaView edges={['top', 'bottom']} className='bg-gray-100 flex-1'>
      <ScrollView contentContainerClassName='flex flex-col gap-5'>
        {/* Header */}
        <View className='flex flex-row relative items-top justify-between h-40 mx-5 py-5'>
          <Pressable onPress={() => router.push('/Home')} className=''>
            <ChevronLeft color={'#0e0e11'} size={25} />
          </Pressable>
          <Text className='left-1/2 text-[#0e0e11] font-poppins-bold text-2xl top-5 -translate-x-1/2 absolute'>
            Profile
          </Text>
        </View>

        {/* Info */}
        <View className='flex items-center bg-white rounded-ss-3xl rounded-es-3xl shadow-md shadow-black'>
          {/* Upper Info */}
          <View className='flex -top-20 items-center'>
            {/* Profile */}
            <View className='relative '>
              {user.profileDetails?.url ? (
                <Image
                  source={{ uri: user.profileDetails.url }}
                  className='border-4 bg-white border-violet-500 rounded-full h-40 w-40'
                />
              ) : (
                <View className='border-4 border-violet-500 rounded-full bg-violet-100 h-40 w-40 flex items-center justify-center'>
                  <UserRound size={100} strokeWidth={1} color={'#8b5cf6'} />
                </View>
              )}
              <Pressable className='absolute active:bg-violet-400 rounded-full p-3 bg-violet-500 right-0 bottom-0'>
                <PencilLine size={20} color={'white'} />
              </Pressable>
            </View>
            {/* Name */}
            <View className='flex flex-col mt-3 items-center'>
              <Text className='font-poppins-bold text-xl text-[#0e0e11]'>
                {user.name.firstName + ' ' + user.name.lastName}
              </Text>
              <View className='flex flex-row items-center gap-3'>
                <Text className='font-medium text-lg text-[#71717a]'>
                  {user.username}
                </Text>
                <Text className='text-[#8e51ff] p-2 text-xs border border-[#8e51ff] rounded-full bg-violet-100 font-poppins-medium'>
                  Verified
                </Text>
                <Text className='font-medium text-xs p-2 text-green-500 border border-green-500 rounded-full bg-green-100'>
                  {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                </Text>
              </View>
            </View>
          </View>
          {/* Bottom Info */}
          <View className='flex flex-col self-start -mt-10 pb-36 gap-5 w-full'>
            {Array.from({ length: 10 }, (v, k) => (
              <View key={k} className='flex mx-5 flex-col gap-1'>
                <Text className='text-[#0e0e11] font-poppins-medium'>
                  First Name
                </Text>
                <TextInput
                  value='Clarence'
                  className='font-poppins text-lg p-4 text-[#71717a] border bg-gray-50 border-[#d7d7da] w-full rounded-full'
                />
                {/* READ ONLY */}
                {/* <Text className='p-4 font-poppins text-lg text-[#71717a]'>
                  Clarence
                </Text> */}
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
      <Pressable className='p-4 mb-5 absolute bottom-10 left-5 right-5 bg-violet-500 flex items-center justify-center rounded-full'>
        <Text className='font-poppins-medium text-lg text-white'>
          Save Changes
        </Text>
      </Pressable>
    </SafeAreaView>
  );
}
