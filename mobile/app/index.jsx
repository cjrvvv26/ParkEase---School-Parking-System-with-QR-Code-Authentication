import { useEffect } from 'react';
import { Text, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const token = await AsyncStorage.getItem('token');

      console.log(token);

      router.replace('/(main)/Account');
    };

    checkUser();
  }, []);

  return (
    <View>
      <Text>Loading...</Text>
    </View>
  );
}
