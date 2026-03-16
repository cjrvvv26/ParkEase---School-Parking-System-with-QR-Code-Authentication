import { Link, useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { Text, View, TextInput, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { verifyOtp } from '../services/authService';
import useApiRequest from '../hooks/useApiRequest';

export default function OTPVerification() {
  const router = useRouter();
  const { error, loading, execute } = useApiRequest();
  const [allowedResend, setAllowedResend] = useState(false);
  const [credentials, setCredentials] = useState({
    email: '',
    inputOtp: null,
    type: 'login',
    platform: 'mobile',
  });

  useEffect(() => {
    const checkVerification = async () => {
      const hasVerification = await AsyncStorage.getItem('hasVerification');
      const email = await AsyncStorage.getItem('email');
      setCredentials((prev) => ({ ...prev, email }));

      if (hasVerification === 'false' || !hasVerification)
        return router.replace('/SignIn');
    };

    checkVerification();
  }, []);

  const handleVerification = async () => {
    const res = await execute(verifyOtp, credentials);

    if (res?.status === 200) {
      await AsyncStorage.removeItem('hasVerification');
      await AsyncStorage.setItem('token', res.data.user.token);

      router.replace('/(main)/Home');
    }
  };

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
          value={credentials.inputOtp}
          onChangeText={(num) =>
            setCredentials((prev) => ({ ...prev, inputOtp: num }))
          }
          keyboardType='number-pad'
          className='border border-gray-400 rounded-lg p-4 w-full'
        />
      </View>
      <View className='flex justify-between w-full flex-row items-center mt-[8px]'>
        {!allowedResend ? (
          <Text
            style={{ marginLeft: 40 }}
            className='font-poppins text-gray-400 mb-10'
          >
            Resend code in: 50s
          </Text>
        ) : (
          <Pressable style={{ marginLeft: 40 }}>
            <Text className='font-poppins text-violet-500 underline mb-10'>
              Resend Code
            </Text>
          </Pressable>
        )}
        {!error && (
          <Text
            style={{ marginRight: 40 }}
            className='text-red-500 font-poppins self-start ml-[40px]'
          >
            {error}
          </Text>
        )}
      </View>
      <Pressable
        disabled={loading}
        onPress={handleVerification}
        className={`${loading ? 'opacity-80' : ''} bg-violet-500 rounded-lg py-4 active:opacity-80 flex items-center justify-center`}
        style={{ width: 300 }}
      >
        <Text className='font-poppins text-white'>
          {loading ? 'Processing...' : 'Verify'}
        </Text>
      </Pressable>
      <Link
        onPress={async () => await AsyncStorage.removeItem('hasVerification')}
        disabled={loading}
        href={'/SignIn'}
        className='bg-gray-100 active:bg-gray-50 rounded-lg py-4 mt-5 active:opacity-80 flex items-center justify-center'
        style={{ width: 300 }}
      >
        <Text className='font-poppins text-center text-gray-400'>Cancel</Text>
      </Link>
    </SafeAreaView>
  );
}
