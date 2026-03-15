import { Link, useRouter } from 'expo-router';
import { Text, View, TextInput, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function OTPVerification() {
  const router = useRouter();
  return (
    <SafeAreaView className='flex-1 flex flex-col bg-white items-center justify-center'>
      <View style={{ marginBottom: 20 }} className='items-center'>
        <Text className='font-poppins-bold text-2xl text-gray-700'>
          OTP Verification
        </Text>
        <Text className='font-poppins text-base text-gray-400'>
          Check your email to see the code.
        </Text>
      </View>

      <View
        className='flex-row gap-2 justify-center items-center'
        style={{ width: 300 }}
      >
        <TextInput
          keyboardType='number-pad'
          className='border border-gray-400 rounded-lg p-4 w-full'
        />
      </View>
      <Text
        style={{ alignSelf: 'flex-start', marginLeft: 80, marginTop: 8 }}
        className='font-poppins text-red-500 mb-10'
      >
        Resend Code in: 50s
      </Text>
      <Pressable
        onPress={() => router.replace('/(main)/Home')}
        className='bg-violet-500 rounded-lg py-4 active:opacity-80 flex items-center justify-center'
        style={{ width: 300 }}
      >
        <Text className='font-poppins text-white'>Verify</Text>
      </Pressable>
      <Link
        href={'/SignIn'}
        className='bg-gray-100 active:bg-gray-50 rounded-lg py-4 mt-5 active:opacity-80 flex items-center justify-center'
        style={{ width: 300 }}
      >
        <Text className='font-poppins text-center text-gray-400'>Cancel</Text>
      </Link>
    </SafeAreaView>
  );
}
