import {
  ChevronLeft,
  QrCode,
  RotateCcw,
  Scan,
  ScanLine,
} from 'lucide-react-native';
import { View, Text, Pressable, Button } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { verifyScannedSlot } from '../services/slotService';
import useApiRequest from '../hooks/useApiRequest';

export default function Scann() {
  const router = useRouter();
  const [scanned, setScanned] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const { user } = useSelector((state) => state.auth);
  const { loading, error, execute } = useApiRequest();

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View>
        <Text>You need camera permission</Text>
        <Button title='Grant Permission' onPress={requestPermission} />
      </View>
    );
  }

  const handleScan = async ({ data }) => {
    setScanned(true);
    console.log('QR DATA:', data);
    const slotId = data.match(/SLOT:(.+)/);

    const res = await execute(verifyScannedSlot, {
      slotId: slotId[1],
      userId: user._id,
    });

    if (error) return console.log(error);

    if (res?.status === 200) return console.log(res);
  };

  return (
    <SafeAreaView
      edges={['top']}
      className='flex flex-1 flex-col gap-5 bg-gray-50'
    >
      {/* Header */}
      <View className='flex flex-row relative items-top justify-between mx-5 py-5'>
        <Pressable onPress={() => router.push('/Home')} className=''>
          <ChevronLeft color={'#0e0e11'} size={25} />
        </Pressable>
        <Text className='left-1/2 text-[#0e0e11] font-poppins-bold text-2xl top-5 -translate-x-1/2 absolute'>
          {user.role === 'student' || user.role === 'faculty'
            ? 'Scan Slot QR Code'
            : 'Scan Student QR Code'}
        </Text>
      </View>
      {/* Camera */}
      <View className='h-96 mx-5 rounded-3xl'>
        <View
          style={{
            position: 'absolute',
            left: 0,
            zIndex: 2,
            right: 0,
            top: 0,
            bottom: 0,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <ScanLine
            color={scanned ? '#8e15f6' : 'white'}
            size={300}
            strokeWidth={0.5}
          />
        </View>
        <CameraView
          style={{
            flex: 1,
            borderRadius: 24,
            borderColor: '#8e15f6',
            borderWidth: 2,
            overflow: 'hidden',
          }}
          barcodeScannerSettings={{
            barcodeTypes: ['qr'],
          }}
          onBarcodeScanned={scanned ? undefined : handleScan}
        />
      </View>

      {error && <Text className='font-poppins text-red-500 ml-5'>{error}</Text>}
      <View className='mx-5 mb-5 relative'>
        <Text className='px-4 font-poppins text-gray-400 bg-gray-50 left-1/2 absolute top-1/2 -translate-x-1/2 -translate-y-1/2'>
          OR
        </Text>
      </View>
      {scanned && (
        <Pressable
          onPress={() => setScanned(false)}
          className='flex active:bg-violet-300 flex-row gap-3 items-center justify-center bg-violet-400 px-6 py-4 mx-5 rounded-md'
        >
          <RotateCcw color={'white'} />
          <Text className='text-white font-poppins-medium'>Scan Again</Text>
        </Pressable>
      )}
      <Pressable className='flex active:opacity-80 flex-row items-center bg-violet-500 rounded-md gap-3 py-4 justify-center mx-5'>
        <QrCode color={'white'} />
        <Text className='text-white font-medium text-lg'>Display QR Code</Text>
      </Pressable>
    </SafeAreaView>
  );
}
