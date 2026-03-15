import { useEffect } from 'react';
import { Text, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useFonts } from 'expo-font';

export default function Index() {
  const router = useRouter();
  const [loaded] = useFonts({
    Poppins: require('./assets/fonts/Poppins-Regular.ttf'),
    Poppins500: require('./assets/fonts/Poppins-Medium.ttf'),
    Poppins600: require('./assets/fonts/Poppins-SemiBold.ttf'),
    PoppinsBold: require('./assets/fonts/Poppins-Bold.ttf'),
  });

  useEffect(() => {
    const checkUser = async () => {
      const token = await AsyncStorage.getItem('token');

      if (token) {
        return router.replace('/(main)/Home');
      }
      router.replace('/(auth)/SignIn');
    };

    if (loaded) {
      checkUser();
    }
  }, [loaded]);

  return (
    <View>
      <Text>Loading...</Text>
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
