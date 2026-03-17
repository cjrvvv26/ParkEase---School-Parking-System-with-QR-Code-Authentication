import { ChevronLeft, QrCode, RotateCcw, ScanLine } from 'lucide-react-native';
import { View, Text, Pressable, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { verifyScannedSlot } from '../services/slotService';
import useApiRequest from '../hooks/useApiRequest';

const PALETTE = {
  primary: '#8e51ff',
  primaryLight: '#f0ebff',
  primaryBorder: '#c4b5fd',
  dark: '#0e0e11',
  muted: '#71717a',
  border: '#e5e7eb',
  white: '#fff',
};

export default function Scan() {
  const router = useRouter();
  const [scanned, setScanned] = useState(false);
  const [displayQR, toggleDisplayQR] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const { user } = useSelector((state) => state.auth);

  const { loading, error, execute } = useApiRequest();

  if (!permission) return <View />;

  if (!permission.granted) {
    return (
      <SafeAreaView
        edges={['top']}
        style={{
          flex: 1,
          backgroundColor: '#f8f7ff',
          alignItems: 'center',
          justifyContent: 'center',
          paddingHorizontal: 32,
        }}
      >
        <View
          style={{
            backgroundColor: PALETTE.primaryLight,
            padding: 20,
            borderRadius: 24,
            marginBottom: 20,
          }}
        >
          <ScanLine color={PALETTE.primary} size={48} />
        </View>
        <Text
          style={{
            fontFamily: 'Poppins700',
            fontSize: 18,
            color: PALETTE.dark,
            textAlign: 'center',
            marginBottom: 8,
          }}
        >
          Camera Access Needed
        </Text>
        <Text
          style={{
            fontFamily: 'Poppins400',
            fontSize: 13,
            color: PALETTE.muted,
            textAlign: 'center',
            marginBottom: 28,
          }}
        >
          ParkEase needs camera permission to scan QR codes.
        </Text>
        <Pressable
          onPress={requestPermission}
          style={{
            backgroundColor: PALETTE.primary,
            paddingHorizontal: 32,
            paddingVertical: 14,
            borderRadius: 14,
            shadowColor: PALETTE.primary,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 6,
          }}
        >
          <Text
            style={{
              fontFamily: 'Poppins600',
              fontSize: 14,
              color: PALETTE.white,
            }}
          >
            Grant Permission
          </Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  const handleScan = async ({ data }) => {
    setScanned(true);
    const slotId = data.match(/SLOT:(.+)/);
    const res = await execute(verifyScannedSlot, {
      slotId: slotId[1],
      userId: user._id,
    });
    if (error) return console.log(error);
    if (res?.status === 200) console.log(res);
    return router.replace({
      pathname: '/Parking',
      params: { state: res.data.message },
    });
  };

  const isStudent = user.role === 'student' || user.role === 'faculty';
  const title = isStudent ? 'Scan Slot QR' : 'Scan Student QR';
  const subtitle = isStudent
    ? 'Point camera at a parking slot QR code'
    : 'Point camera at a student QR code';

  return (
    <SafeAreaView
      edges={['top']}
      style={{ flex: 1, backgroundColor: '#f8f7ff' }}
    >
      {/* Header */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 20,
          paddingTop: 16,
          paddingBottom: 20,
          gap: 12,
        }}
      >
        <Pressable
          onPress={() => router.push('/Home')}
          style={{
            backgroundColor: PALETTE.white,
            padding: 10,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: PALETTE.border,
          }}
        >
          <ChevronLeft color={PALETTE.dark} size={20} />
        </Pressable>
        <View>
          <Text
            style={{
              fontFamily: 'Poppins700',
              fontSize: 18,
              color: PALETTE.dark,
            }}
          >
            {title}
          </Text>
          <Text
            style={{
              fontFamily: 'Poppins400',
              fontSize: 12,
              color: PALETTE.muted,
            }}
          >
            {subtitle}
          </Text>
        </View>
      </View>

      {/* Camera / QR Display */}
      <View style={{ marginHorizontal: 20 }}>
        {displayQR ? (
          <View
            style={{
              height: 340,
              backgroundColor: PALETTE.white,
              borderRadius: 24,
              borderWidth: 1,
              borderColor: PALETTE.border,
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
            }}
          >
            {user?.QRCode ? (
              <Image
                source={{ uri: user.QRCode }}
                style={{ width: 240, height: 240 }}
                resizeMode='contain'
              />
            ) : (
              <View style={{ alignItems: 'center', gap: 12 }}>
                <View
                  style={{
                    backgroundColor: PALETTE.primaryLight,
                    padding: 16,
                    borderRadius: 20,
                  }}
                >
                  <QrCode color={PALETTE.primary} size={36} />
                </View>
                <Text
                  style={{
                    fontFamily: 'Poppins500',
                    fontSize: 13,
                    color: PALETTE.muted,
                  }}
                >
                  Account not yet verified
                </Text>
              </View>
            )}
          </View>
        ) : (
          <View
            style={{
              height: 340,
              borderRadius: 24,
              overflow: 'hidden',
              borderWidth: 2,
              borderColor: scanned ? PALETTE.primary : PALETTE.primaryBorder,
            }}
          >
            <CameraView
              style={{ flex: 1 }}
              barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
              onBarcodeScanned={scanned ? undefined : handleScan}
            />
            {/* Scan overlay */}
            <View
              style={{
                position: 'absolute',
                inset: 0,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              {/* Corner brackets */}
              {[
                { top: 24, left: 24, borderTopWidth: 3, borderLeftWidth: 3 },
                { top: 24, right: 24, borderTopWidth: 3, borderRightWidth: 3 },
                {
                  bottom: 24,
                  left: 24,
                  borderBottomWidth: 3,
                  borderLeftWidth: 3,
                },
                {
                  bottom: 24,
                  right: 24,
                  borderBottomWidth: 3,
                  borderRightWidth: 3,
                },
              ].map((style, i) => (
                <View
                  key={i}
                  style={{
                    position: 'absolute',
                    width: 28,
                    height: 28,
                    borderColor: scanned ? PALETTE.primary : '#fff',
                    borderRadius: 3,
                    ...style,
                  }}
                />
              ))}
              <ScanLine
                color={scanned ? PALETTE.primary : 'rgba(255,255,255,0.6)'}
                size={180}
                strokeWidth={0.8}
              />
            </View>
            {/* Status pill */}
            <View
              style={{
                position: 'absolute',
                bottom: 16,
                alignSelf: 'center',
                backgroundColor: scanned ? PALETTE.primary : 'rgba(0,0,0,0.45)',
                paddingHorizontal: 16,
                paddingVertical: 6,
                borderRadius: 99,
              }}
            >
              <Text
                style={{
                  fontFamily: 'Poppins500',
                  fontSize: 12,
                  color: '#fff',
                }}
              >
                {scanned ? 'QR Detected' : 'Align QR code within frame'}
              </Text>
            </View>
          </View>
        )}
      </View>

      {/* Error */}
      {error && (
        <View
          style={{
            marginHorizontal: 20,
            marginTop: 12,
            backgroundColor: '#fee2e2',
            borderRadius: 12,
            padding: 12,
          }}
        >
          <Text
            style={{ fontFamily: 'Poppins500', fontSize: 12, color: '#dc2626' }}
          >
            {error}
          </Text>
        </View>
      )}

      {/* Divider */}
      <View
        style={{
          marginHorizontal: 20,
          marginTop: 24,
          marginBottom: 20,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 12,
        }}
      >
        <View style={{ flex: 1, height: 1, backgroundColor: PALETTE.border }} />
        <Text
          style={{
            fontFamily: 'Poppins400',
            fontSize: 12,
            color: PALETTE.muted,
          }}
        >
          OR
        </Text>
        <View style={{ flex: 1, height: 1, backgroundColor: PALETTE.border }} />
      </View>

      {/* Action Buttons */}
      <View style={{ marginHorizontal: 20, gap: 12 }}>
        {scanned && (
          <Pressable
            onPress={() => setScanned(false)}
            android_ripple={{ color: '#7c3aed' }}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
              backgroundColor: PALETTE.primary,
              paddingVertical: 15,
              borderRadius: 14,
              shadowColor: PALETTE.primary,
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 6,
            }}
          >
            <RotateCcw color='#fff' size={18} />
            <Text style={{ fontFamily: 'Poppins600', fontSize: 14, color: '#fff' }}>
              Scan Again
            </Text>
          </Pressable>
        )}

        <Pressable
          onPress={() => toggleDisplayQR((v) => !v)}
          android_ripple={{ color: PALETTE.primaryBorder }}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
            backgroundColor: PALETTE.primaryLight,
            paddingVertical: 15,
            borderRadius: 14,
            borderWidth: 1.5,
            borderColor: PALETTE.primaryBorder,
          }}
        >
          {displayQR ? (
            <>
              <ScanLine color={PALETTE.primary} size={18} />
              <Text style={{ fontFamily: 'Poppins600', fontSize: 14, color: PALETTE.primary }}>
                Scan QR Code
              </Text>
            </>
          ) : (
            <>
              <QrCode color={PALETTE.primary} size={18} />
              <Text style={{ fontFamily: 'Poppins600', fontSize: 14, color: PALETTE.primary }}>
                Display My QR
              </Text>
            </>
          )}
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
