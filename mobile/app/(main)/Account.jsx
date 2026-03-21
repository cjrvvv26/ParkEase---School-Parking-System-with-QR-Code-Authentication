import { useRouter } from 'expo-router';
import {
  UserRound,
  Mail,
  Phone,
  Hash,
  BookOpen,
  GraduationCap,
  ChevronLeft,
} from 'lucide-react-native';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import useTheme from '../hooks/useTheme';

function InfoField({ icon: Icon, label, value, t }) {
  return (
    <View style={{ marginBottom: 16 }}>
      <Text
        style={{
          fontFamily: 'Poppins600',
          fontSize: 12,
          color: t.textFaint,
          marginBottom: 6,
          textTransform: 'uppercase',
          letterSpacing: 0.6,
        }}
      >
        {label}
      </Text>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: t.inputBg,
          borderRadius: 14,
          borderWidth: 1,
          borderColor: t.cardBorder,
          paddingHorizontal: 14,
          paddingVertical: 12,
          gap: 10,
        }}
      >
        <Icon color={t.textFaint} size={16} />
        <Text
          style={{
            flex: 1,
            fontFamily: 'Poppins500',
            fontSize: 14,
            color: t.textMuted,
          }}
        >
          {value || '—'}
        </Text>
      </View>
    </View>
  );
}

export default function Account() {
  const router = useRouter();
  const { user } = useSelector((state) => state.auth);
  const { t } = useTheme();

  const roleColor = {
    student: { bg: '#eff6ff', text: '#2563eb', border: '#bfdbfe' },
    faculty: { bg: '#f0fdf4', text: '#16a34a', border: '#bbf7d0' },
    guard: { bg: '#fff7ed', text: '#ea580c', border: '#fed7aa' },
  };
  const rc = roleColor[user?.role] || roleColor.student;

  return (
    <SafeAreaView edges={['top', 'bottom']} style={{ flex: 1, backgroundColor: t.bg }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 20,
            paddingTop: 20,
            paddingBottom: 16,
          }}
        >
          <Pressable
            onPress={() => router.push('/Home')}
            style={{
              backgroundColor: t.headerBtn,
              padding: 8,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: t.headerBtnBorder,
            }}
          >
            <ChevronLeft color={t.text} size={22} />
          </Pressable>
          <Text
            style={{
              flex: 1,
              textAlign: 'center',
              fontFamily: 'Poppins700',
              fontSize: 20,
              color: t.text,
            }}
          >
            Profile
          </Text>
          <View style={{ width: 38 }} />
        </View>

        {/* Profile Hero */}
        <View
          style={{
            alignItems: 'center',
            paddingVertical: 28,
            marginHorizontal: 20,
            backgroundColor: t.card,
            borderRadius: 24,
            borderWidth: 1,
            borderColor: t.cardBorder,
            marginBottom: 20,
          }}
        >
          {user?.profileDetails?.url ? (
            <Image
              source={{ uri: user.profileDetails.url }}
              style={{
                width: 100,
                height: 100,
                borderRadius: 50,
                borderWidth: 3,
                borderColor: t.primary,
                marginBottom: 14,
              }}
            />
          ) : (
            <View
              style={{
                width: 100,
                height: 100,
                borderRadius: 50,
                backgroundColor: t.primaryLight,
                borderWidth: 3,
                borderColor: t.primary,
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 14,
              }}
            >
              <UserRound size={52} strokeWidth={1} color={t.primary} />
            </View>
          )}
          <Text
            style={{
              fontFamily: 'Poppins700',
              fontSize: 18,
              color: t.text,
              marginBottom: 4,
            }}
          >
            {user?.name?.firstName} {user?.name?.lastName}
          </Text>
          <Text
            style={{
              fontFamily: 'Poppins400',
              fontSize: 13,
              color: t.textMuted,
              marginBottom: 12,
            }}
          >
            @{user?.username}
          </Text>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <View
              style={{
                backgroundColor: user?.emailVerified ? t.primaryLight : '#fef3c7',
                paddingHorizontal: 12,
                paddingVertical: 4,
                borderRadius: 20,
                borderWidth: 1,
                borderColor: user?.emailVerified ? t.primaryBorder : '#d97706',
              }}
            >
              <Text
                style={{
                  fontFamily: 'Poppins600',
                  fontSize: 12,
                  color: user?.emailVerified ? t.primary : '#d97706',
                }}
              >
                {user?.emailVerified ? 'Verified' : 'Not Verified'}
              </Text>
            </View>
            <View
              style={{
                backgroundColor: rc.bg,
                paddingHorizontal: 12,
                paddingVertical: 4,
                borderRadius: 20,
                borderWidth: 1,
                borderColor: rc.border,
              }}
            >
              <Text style={{ fontFamily: 'Poppins600', fontSize: 12, color: rc.text }}>
                {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}
              </Text>
            </View>
          </View>
        </View>

        {/* Info Fields */}
        <View
          style={{
            marginHorizontal: 20,
            backgroundColor: t.card,
            borderRadius: 20,
            padding: 20,
            borderWidth: 1,
            borderColor: t.cardBorder,
          }}
        >
          <Text
            style={{
              fontFamily: 'Poppins700',
              fontSize: 15,
              color: t.text,
              marginBottom: 16,
            }}
          >
            Personal Information
          </Text>
          <InfoField icon={UserRound} label='First Name' value={user?.name?.firstName} t={t} />
          {(user?.role === 'student' || user?.role === 'faculty') && (
            <InfoField icon={UserRound} label='Middle Name' value={user?.name?.middleName} t={t} />
          )}
          <InfoField icon={UserRound} label='Last Name' value={user?.name?.lastName} t={t} />
          <InfoField icon={Mail} label='Email' value={user?.email} t={t} />
          <InfoField icon={Phone} label='Phone Number' value={user?.phoneNo} t={t} />
          {user?.role === 'student' && (
            <>
              <InfoField icon={Hash} label='Student No.' value={user?.studentNo} t={t} />
              <InfoField icon={BookOpen} label='Course' value={user?.course?.name} t={t} />
              <InfoField icon={GraduationCap} label='Year Level' value={user?.yearLevel} t={t} />
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
