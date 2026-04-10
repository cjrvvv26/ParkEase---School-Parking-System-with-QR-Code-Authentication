import { useEffect } from 'react';
import { login } from './features/authSlicer';
import { getData } from './services/authService';
import { useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View } from 'react-native';
import useApiRequest from './hooks/useApiRequest';
import { useRouter } from 'expo-router';
import { useFonts } from 'expo-font';

export default function Index() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { execute } = useApiRequest();
  const [loaded] = useFonts({
    Poppins: require('./assets/fonts/Poppins-Regular.ttf'),
    Poppins500: require('./assets/fonts/Poppins-Medium.ttf'),
    Poppins600: require('./assets/fonts/Poppins-SemiBold.ttf'),
    PoppinsBold: require('./assets/fonts/Poppins-Bold.ttf'),
  });

  useEffect(() => {
    if (!loaded) return;

    const checkUserSession = async () => {
      const token = await AsyncStorage.getItem('token');

      if (!token) {
        router.replace('/(auth)/SignIn');
        return;
      }

      const res = await execute(getData, token);

      if (res?.status === 200) {
        dispatch(login({ user: res.data }));
        if (!res.data.termsAccepted) {
          router.replace('/(main)/TermsAndConditions');
        } else {
          router.replace('/(main)/Home');
        }
      } else {
        await AsyncStorage.removeItem('token');
        router.replace('/(auth)/SignIn');
      }
    };

    checkUserSession();
  }, [loaded]);

  return (
    <View className='flex h-full items-center justify-center'>
      <View className='border-2 border-t-2 border-t-blue-500 animate-spin h-14 w-14 rounded-full border-blue-200'></View>
    </View>
  );
}

//DARK THEME SETUP
// import { View, Text, Pressable } from 'react-native';
// import { useColorScheme } from 'nativewind';
// import { SafeAreaView } from 'react-native-safe-area-context';

// export default function signin() {
//   const { colorScheme, toggleColorScheme } = useColorScheme();
//   return (
//     <SafeAreaView edges={['top', 'bottom']} className='h-full'>
//       <View className='flex-1 items-center justify-center bg-white dark:bg-black'>
//         <Text className='text-black dark:text-white'>
//           Current: {colorScheme}
//         </Text>

//         <Pressable onPress={toggleColorScheme}>
//           <Text className='text-blue-500'>Toggle Theme</Text>
//         </Pressable>
//       </View>
//     </SafeAreaView>
//   );
// }
