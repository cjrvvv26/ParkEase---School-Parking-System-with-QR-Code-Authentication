import { ChevronLeft, QrCode, RotateCcw, ScanLine } from 'lucide-react-native';
import { View, Text, Pressable, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { guardScan, verifyScannedSlot } from '../services/slotService';
import useApiRequest from '../hooks/useApiRequest';
import useTheme from '../hooks/useTheme';

export default function Scan() {
  const router = useRouter();
  const [scanned, setScanned] = useState(false);
  const [displayQR, toggleDisplayQR] = useState(false);
  const [scanResult, setScanResult] = useState('');
  const [permission, requestPermission] = useCameraPermissions();
  const [scanDisabled, setScanDisabled] = useState(false);
  const { user } = useSelector((state) => state.auth);

  const { loading, error, execute } = useApiRequest();
  const { t } = useTheme();

  if (!permission) return <View />;

  if (!permission.granted) {
    return (
      <SafeAreaView
        edges={['top']}
        style={{
          flex: 1,
          backgroundColor: t.bg,
          alignItems: 'center',
          justifyContent: 'center',
          paddingHorizontal: 32,
        }}
      >
        <View
          style={{
            backgroundColor: t.primaryLight,
            padding: 20,
            borderRadius: 24,
            marginBottom: 20,
          }}
        >
          <ScanLine color={t.primary} size={48} />
        </View>
        <Text
          style={{
            fontFamily: 'Poppins700',
            fontSize: 18,
            color: t.text,
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
            color: t.textMuted,
            textAlign: 'center',
            marginBottom: 28,
          }}
        >
          ParkEase needs camera permission to scan QR codes.
        </Text>
        <Pressable
          onPress={requestPermission}
          style={{
            backgroundColor: t.primary,
            paddingHorizontal: 32,
            paddingVertical: 14,
            borderRadius: 14,
            shadowColor: t.primary,
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
              color: '#fff',
            }}
          >
            Grant Permission
          </Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  const handleScan = async ({ data }) => {
    if (scanDisabled) return;

    setScanned(true);
    setScanDisabled(true);
    setScanResult('');

    const delayMs = 1200;
    await new Promise((resolve) => setTimeout(resolve, delayMs));

    const pattern = user.role === 'guard' ? /PARKEASE_USER:(.+)/ : /SLOT:(.+)/;
    const match = data.match(pattern);
    if (!match) {
      setScanResult('Invalid QR code. Try again.');
      setTimeout(() => {
        setScanned(false);
        setScanDisabled(false);
      }, 1200);
      return;
    }

    if (user.role === 'guard') {
      const res = await execute(guardScan, {
        qrData: data,
        guardId: user._id,
      });
      if (res?.status === 200) setScanResult(res.data.message);
    } else {
      const res = await execute(verifyScannedSlot, {
        slotId: match[1],
        userId: user._id,
      });
      if (res?.status === 200)
        return router.replace({
          pathname: '/Parking',
          params: { state: res.data.message },
        });
    }

    const cooldownMs = 3000;
    setTimeout(() => {
      setScanned(false);
      setScanDisabled(false);
    }, cooldownMs);
  };

  const isGuard = user.role === 'guard';
  const title = isGuard ? 'Scan User QR' : 'Scan Slot QR';
  const subtitle = isGuard
    ? 'Point camera at a student or faculty QR code'
    : 'Point camera at a parking slot QR code';

  return (
    <SafeAreaView
      edges={['top']}
      style={{ flex: 1, backgroundColor: t.bg }}
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
            backgroundColor: t.headerBtn,
            padding: 10,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: t.headerBtnBorder,
          }}
        >
          <ChevronLeft color={t.text} size={20} />
        </Pressable>
        <View>
          <Text
            style={{
              fontFamily: 'Poppins700',
              fontSize: 18,
              color: t.text,
            }}
          >
            {title}
          </Text>
          <Text
            style={{
              fontFamily: 'Poppins400',
              fontSize: 12,
              color: t.textMuted,
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
              backgroundColor: t.card,
              borderRadius: 24,
              borderWidth: 1,
              borderColor: t.cardBorder,
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
            }}
          >
            {user?.QRCode?.url ? (
              <Image
                source={{ uri: user.QRCode.url }}
                style={{ width: 240, height: 240 }}
                resizeMode='contain'
              />
            ) : (
              <View style={{ alignItems: 'center', gap: 12 }}>
                <View
                  style={{
                    backgroundColor: t.primaryLight,
                    padding: 16,
                    borderRadius: 20,
                  }}
                >
                  <QrCode color={t.primary} size={36} />
                </View>
                <Text
                  style={{
                    fontFamily: 'Poppins500',
                    fontSize: 13,
                    color: t.textMuted,
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
              borderColor: scanned ? t.primary : t.primaryBorder,
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
                    borderColor: scanned ? t.primary : '#fff',
                    borderRadius: 3,
                    ...style,
                  }}
                />
              ))}
              <ScanLine
                color={scanned ? t.primary : 'rgba(255,255,255,0.6)'}
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
                backgroundColor: scanned ? t.primary : 'rgba(0,0,0,0.45)',
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

      {/* Guard scan result */}
      {scanResult ? (
        <View
          style={{
            marginHorizontal: 20,
            marginTop: 12,
            backgroundColor: '#d1fae5',
            borderRadius: 12,
            padding: 12,
            borderWidth: 1,
            borderColor: '#6ee7b7',
          }}
        >
          <Text
            style={{
              fontFamily: 'Poppins600',
              fontSize: 13,
              color: '#065f46',
              textAlign: 'center',
            }}
          >
            {scanResult}
          </Text>
        </View>
      ) : null}

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
        <View style={{ flex: 1, height: 1, backgroundColor: t.divider }} />
        <Text
          style={{
            fontFamily: 'Poppins400',
            fontSize: 12,
            color: t.textMuted,
          }}
        >
          OR
        </Text>
        <View style={{ flex: 1, height: 1, backgroundColor: t.divider }} />
      </View>

      {/* Action Buttons */}
      <View style={{ marginHorizontal: 20, gap: 12 }}>
        {scanned && (
          <Pressable
            onPress={() => {
              setScanned(false);
              setScanResult('');
            }}
            disabled={scanDisabled}
            android_ripple={{ color: '#2563eb' }}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
              backgroundColor: scanDisabled ? '#9ca3af' : t.primary,
              paddingVertical: 15,
              borderRadius: 14,
              shadowColor: t.primary,
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 6,
            }}
          >
            <RotateCcw color='#fff' size={18} />
            <Text
              style={{ fontFamily: 'Poppins600', fontSize: 14, color: '#fff' }}
            >
              {scanDisabled ? 'Cooldown...' : 'Scan Again'}
            </Text>
          </Pressable>
        )}

        {!isGuard && (
          <Pressable
            onPress={() => toggleDisplayQR((v) => !v)}
            android_ripple={{ color: t.primaryBorder }}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
              backgroundColor: t.primaryLight,
              paddingVertical: 15,
              borderRadius: 14,
              borderWidth: 1.5,
              borderColor: t.primaryBorder,
            }}
          >
            {displayQR ? (
              <>
                <ScanLine color={t.primary} size={18} />
                <Text
                  style={{
                    fontFamily: 'Poppins600',
                    fontSize: 14,
                    color: t.primary,
                  }}
                >
                  Scan QR Code
                </Text>
              </>
            ) : (
              <>
                <QrCode color={t.primary} size={18} />
                <Text
                  style={{
                    fontFamily: 'Poppins600',
                    fontSize: 14,
                    color: t.primary,
                  }}
                >
                  Display My QR
                </Text>
              </>
            )}
          </Pressable>
        )}
      </View>
    </SafeAreaView>
  );
}
