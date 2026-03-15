import { View, Text, Pressable, TextInput, Image } from 'react-native';
import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Eye, EyeClosed } from 'lucide-react-native';
import GoogleIcon from '../assets/images/google.webp';
import { Link, useRouter } from 'expo-router';
import { login } from '../services/authService';
import useApiRequest from '../hooks/useApiRequest';

export default function SignIn() {
  const router = useRouter();
  const { error, setError, loading, execute } = useApiRequest();
  const [showPassword, setShowPassword] = useState(false);
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
    platform: 'mobile',
  });

  const handleRegistration = async () => {
    const hasEmptyValue = Object.values(credentials).every((c) => !c);

    if (hasEmptyValue) {
      return setError('All fields must be filled.');
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(credentials.email)) {
      return setError('Invalid email address');
    }

    const data = await execute(login, credentials);

    if (data?.message === 'Successfully sent OTP') {
      return router.push('/(main)/Account');
    }
  };

  return (
    <SafeAreaView
      edges={['top']}
      className='h-full bg-violet-500 flex flex-col'
    >
      <View className='h-64 flex flex-col items-center justify-center gap-3'>
        <Text className='font-poppins-bold text-[#310b6a] text-4xl'>
          School Parking
        </Text>
        <Text className='font-poppins-bold text-[#310b6a] text-4xl'>
          System
        </Text>
      </View>
      <View className='flex-1 flex flex-col gap-10 rounded-ss-[30px] rounded-es-[30px] drop-shadow-2xl px-14 items-center justify-top pt-16 bg-white h-32'>
        <View className='flex flex-col items-center'>
          <Text className='text-3xl font-poppins-bold text-gray-700'>
            Sign In
          </Text>
          <Text className='text-lg text-gray-400 font-poppins '>
            to access your account
          </Text>
        </View>
        {/* Form */}
        <View className='flex flex-col w-full gap-5'>
          <View className='flex flex-col gap-1'>
            <Text className='text-gray-700 text-base font-poppins'>
              Email address
            </Text>
            <TextInput
              value={credentials.email}
              onChangeText={(text) =>
                setCredentials((prev) => ({ ...prev, email: text }))
              }
              className='border text-base font-poppins border-gray-400 rounded-lg bg-gray-50 p-4'
            />
          </View>
          <View className='flex flex-col gap-1 relative'>
            {!showPassword ? (
              <Eye
                size={28}
                strokeWidth={1.5}
                color={'gray'}
                onTouchEnd={() => setShowPassword(true)}
                style={{
                  position: 'absolute',
                  zIndex: 1,
                  right: 16,
                  bottom: 12,
                }}
              />
            ) : (
              <EyeClosed
                size={28}
                strokeWidth={1.5}
                color={'gray'}
                onTouchEnd={() => setShowPassword(false)}
                style={{
                  position: 'absolute',
                  zIndex: 1,
                  right: 16,
                  bottom: 12,
                }}
              />
            )}
            <Text className='text-gray-700 text-base font-poppins'>
              Password
            </Text>
            <TextInput
              value={credentials.password}
              onChangeText={(text) =>
                setCredentials((prev) => ({ ...prev, password: text }))
              }
              secureTextEntry={showPassword}
              className='border text-base font-poppins border-gray-400 rounded-lg bg-gray-50 p-4'
            />
            {error && (
              <Text className='text-red-500 absolute -bottom-8 font-poppins'>
                {error || 'Invalid Credentials'}
              </Text>
            )}
          </View>
          <Pressable
            onPress={() => {
              //handleRegistration;
              router.replace('./OTPVerification');
            }}
            className='w-full flex active:opacity-80 items-center mt-5 bg-violet-500 rounded-lg py-4'
          >
            <Text className='text-white font-poppins'>Continue</Text>
          </Pressable>
          <View className='border-b my-5 border-gray-400 w-full relative'>
            <Text className='px-4 font-poppins text-gray-400 bg-white left-1/2 absolute top-1/2 -translate-x-1/2 -translate-y-1/2'>
              OR
            </Text>
          </View>
          <View className='flex w-full items-center'>
            <Pressable className='flex items-center active:opacity-80 justify-center rounded-full'>
              <Image source={GoogleIcon} className='h-10 w-10 object-contain' />
            </Pressable>
          </View>
          <Text className='text-center font-poppins text-gray-400 absolute left-1/2 -translate-x-1/2 -bottom-20 mt-5'>
            Can't sign in?{' '}
            <Link href='/Account' className='active:opacity-80'>
              <Text className='text-violet-500'>Go here</Text>
            </Link>
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
