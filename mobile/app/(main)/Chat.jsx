import { useRouter } from 'expo-router';
import { ChevronLeft, Send } from 'lucide-react-native';
import { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Image,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Chat() {
  const [inputHeight, setInputHeight] = useState(40);
  const router = useRouter();
  return (
    <SafeAreaView
      edges={['top', 'bottom']}
      className='bg-gray-50 overflow-hidden flex-1'
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View className='flex flex-1 flex-col'>
          {/* Header */}
          <View className='flex flex-row relative items-top justify-between mx-5 py-5'>
            <Pressable onPress={() => router.push('/Home')} className=''>
              <ChevronLeft color={'#0e0e11'} size={25} />
            </Pressable>
            <Text className='left-1/2 text-[#0e0e11] font-poppins-bold text-2xl top-5 -translate-x-1/2 absolute'>
              Support Chat
            </Text>
          </View>
          {/* Content Header */}
          <View className='flex border-y border-y-gray-200 px-5 py-3'>
            <View className='flex flex-row items-center gap-3'>
              <Image className='h-16 w-16 rounded-full object-contain border-2 border-violet-500 bg-white' />
              <View className='flex flex-col'>
                <Text className='font-poppins-bold text-lg text-[#0e0e011]'>
                  John Doe
                </Text>
                <Text className='font-poppins-medium text-[#71717a]'>
                  Super Admin
                </Text>
              </View>
            </View>
          </View>
          {/* Conversation */}
          <ScrollView
            style={{ marginHorizontal: 20 }}
            showsVerticalScrollIndicator={false}
            contentContainerClassName='flex py-2 flex-col gap-5 pb-30'
          >
            {/* Student Chats */}
            <View
              style={{ alignSelf: 'flex-end' }}
              className='flex gap-3 self-end flex-row'
            >
              <View className='flex flex-col'>
                {/* Message */}
                <View className='bg-violet-500 border border-[#aa85ff] p-3 rounded-lg self-start'>
                  <Text className='text-white font-poppins-medium w-52'>
                    Hello!aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
                  </Text>
                </View>
                {/* Date and time */}
                <Text className='font-poppins text-[#71717a]'>1hr ago</Text>
              </View>
              <Image className='h-16 w-16 rounded-full object-contain border-2 border-violet-500 bg-white' />
            </View>
            <View
              style={{ alignSelf: 'flex-end' }}
              className='flex gap-3 self-end flex-row'
            >
              <View className='flex flex-col'>
                {/* Message */}
                <View className='bg-violet-500 border border-[#aa85ff] p-3 rounded-lg self-start'>
                  <Text className='text-white font-poppins-medium w-52'>
                    Hello!aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
                  </Text>
                </View>
                {/* Date and time */}
                <Text className='font-poppins text-[#71717a]'>1hr ago</Text>
              </View>
              <Image className='h-16 w-16 rounded-full object-contain border-2 border-violet-500 bg-white' />
            </View>
            <View
              style={{ alignSelf: 'flex-end' }}
              className='flex gap-3 self-end flex-row'
            >
              <View className='flex flex-col'>
                {/* Message */}
                <View className='bg-violet-500 border border-[#aa85ff] p-3 rounded-lg self-start'>
                  <Text className='text-white font-poppins-medium w-52'>
                    Hello!aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
                  </Text>
                </View>
                {/* Date and time */}
                <Text className='font-poppins text-[#71717a]'>1hr ago</Text>
              </View>
              <Image className='h-16 w-16 rounded-full object-contain border-2 border-violet-500 bg-white' />
            </View>
            {/* Super Admin Chats */}
            <View className='flex items-start gap-3 flex-row'>
              <Image className='h-16 w-16 rounded-full object-contain border-2 border-violet-500 bg-white' />
              <View className='flex flex-col'>
                {/* Message */}
                <View className='bg-violet-500 border border-[#aa85ff] p-3 rounded-lg self-start'>
                  <Text className='text-white font-poppins-medium w-52'>
                    Hello!aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
                  </Text>
                </View>
                {/* Date and time */}
                <Text className='font-poppins text-[#71717a]'>1hr ago</Text>
              </View>
            </View>
          </ScrollView>
          {/* Button Message */}
          <View className='flex flex-row pt-5 gap-12 items-start border-t border-t-gray-200'>
            <TextInput
              placeholder='Type a message...'
              placeholderTextColor='#e0e0e0'
              multiline
              onContentSizeChange={(e) => {
                setInputHeight(Math.min(120, e.nativeEvent.contentSize.height));
              }}
              className='bg-violet-500 left-5 flex-1 p-4 font-poppins-medium text-white rounded-md border border-[#aa85ff]'
            />
            <Pressable className='bg-violet-500 right-5 rounded-full p-4'>
              <Send color={'white'} size={25} />
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
