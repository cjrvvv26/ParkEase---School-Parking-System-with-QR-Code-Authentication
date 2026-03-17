import { useRouter } from 'expo-router';
import {
  ChevronLeft,
  Camera,
  UserRound,
  Mail,
  Phone,
  Hash,
  BookOpen,
  GraduationCap,
} from 'lucide-react-native';
import { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Image,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector, useDispatch } from 'react-redux';
import { login } from '../features/authSlicer';
import { updateProfile } from '../services/authService';
import useTheme from '../hooks/useTheme';

function InfoField({
  icon: Icon,
  label,
  value,
  editable = false,
  onChangeText,
  t,
}) {
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
          backgroundColor: editable ? t.card : t.inputBg,
          borderRadius: 14,
          borderWidth: 1,
          borderColor: editable ? t.primaryBorder : t.cardBorder,
          paddingHorizontal: 14,
          paddingVertical: 12,
          gap: 10,
        }}
      >
        <Icon color={editable ? t.primary : t.textFaint} size={16} />
        <TextInput
          value={value || ''}
          editable={editable}
          onChangeText={onChangeText}
          style={{
            flex: 1,
            fontFamily: 'Poppins500',
            fontSize: 14,
            color: editable ? t.text : t.textMuted,
            padding: 0,
          }}
        />
      </View>
    </View>
  );
}

export default function Account() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [edit, setEdit] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [formData, setFormData] = useState({});
  const { user } = useSelector((state) => state.auth);
  const { t } = useTheme();

  useEffect(() => {
    if (user) setFormData(user);
  }, [user]);

  const handleSave = async () => {
    setSaving(true);
    setSaveError('');
    try {
      const res = await updateProfile({
        name: formData.name,
        phoneNo: formData.phoneNo,
      });
      dispatch(login({ user: res.data.user }));
      setEdit(false);
    } catch (err) {
      setSaveError(err.response?.data?.error || 'Failed to save changes');
    } finally {
      setSaving(false);
    }
  };

  const roleColor = {
    student: { bg: '#eff6ff', text: '#2563eb', border: '#bfdbfe' },
    faculty: { bg: '#f0fdf4', text: '#16a34a', border: '#bbf7d0' },
    guard: { bg: '#fff7ed', text: '#ea580c', border: '#fed7aa' },
  };
  const rc = roleColor[user?.role] || roleColor.student;

  return (
    <SafeAreaView
      edges={['top', 'bottom']}
      style={{ flex: 1, backgroundColor: t.bg }}
    >
      <ScrollView
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
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
          <Pressable
            onPress={() => setEdit(!edit)}
            style={{
              backgroundColor: edit ? t.primaryLight : t.headerBtn,
              paddingHorizontal: 14,
              paddingVertical: 8,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: edit ? t.primaryBorder : t.headerBtnBorder,
            }}
          >
            <Text
              style={{
                fontFamily: 'Poppins600',
                fontSize: 13,
                color: edit ? t.primary : t.textMuted,
              }}
            >
              {edit ? 'Cancel' : 'Edit'}
            </Text>
          </Pressable>
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
          <View style={{ position: 'relative', marginBottom: 14 }}>
            {user?.profileDetails?.url ? (
              <Image
                source={{ uri: user.profileDetails.url }}
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: 50,
                  borderWidth: 3,
                  borderColor: t.primary,
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
                }}
              >
                <UserRound size={52} strokeWidth={1} color={t.primary} />
              </View>
            )}
            {edit && (
              <Pressable
                style={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  backgroundColor: t.primary,
                  padding: 8,
                  borderRadius: 20,
                  borderWidth: 2,
                  borderColor: t.card,
                }}
              >
                <Camera size={14} color='#fff' />
              </Pressable>
            )}
          </View>
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
                backgroundColor: user.emailVerified
                  ? t.primaryLight
                  : '#fef3c7',
                paddingHorizontal: 12,
                paddingVertical: 4,
                borderRadius: 20,
                borderWidth: 1,
                borderColor: user.emailVerified ? t.primaryBorder : '#d97706',
              }}
            >
              <Text
                style={{
                  fontFamily: 'Poppins600',
                  fontSize: 12,
                  color: user.emailVerified ? t.primary : '#d97706',
                }}
              >
                {user.emailVerified ? 'Verified' : 'Not Verified'}
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
              <Text
                style={{
                  fontFamily: 'Poppins600',
                  fontSize: 12,
                  color: rc.text,
                }}
              >
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
          <InfoField
            icon={UserRound}
            label='First Name'
            value={formData?.name?.firstName}
            editable={edit}
            t={t}
            onChangeText={(v) =>
              setFormData({
                ...formData,
                name: { ...formData.name, firstName: v },
              })
            }
          />
          {(user?.role === 'student' || user?.role === 'faculty') && (
            <InfoField
              icon={UserRound}
              label='Middle Name'
              value={formData?.name?.middleName}
              editable={edit}
              t={t}
              onChangeText={(v) =>
                setFormData({
                  ...formData,
                  name: { ...formData.name, middleName: v },
                })
              }
            />
          )}
          <InfoField
            icon={UserRound}
            label='Last Name'
            value={formData?.name?.lastName}
            editable={edit}
            t={t}
            onChangeText={(v) =>
              setFormData({
                ...formData,
                name: { ...formData.name, lastName: v },
              })
            }
          />
          <InfoField
            icon={Mail}
            label='Email'
            value={formData?.email}
            editable={false}
            t={t}
          />
          <InfoField
            icon={Phone}
            label='Phone Number'
            value={formData?.phoneNo}
            editable={edit}
            t={t}
            onChangeText={(v) => setFormData({ ...formData, phoneNo: v })}
          />
          {user?.role === 'student' && (
            <>
              <InfoField
                icon={Hash}
                label='Student No.'
                value={formData?.studentNo}
                editable={false}
                t={t}
              />
              <InfoField
                icon={BookOpen}
                label='Course'
                value={formData?.course?.name}
                editable={false}
                t={t}
              />
              <InfoField
                icon={GraduationCap}
                label='Year Level'
                value={formData?.yearLevel}
                editable={false}
                t={t}
              />
            </>
          )}
        </View>
      </ScrollView>

      {/* Save Button */}
      {edit && (
        <View
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            padding: 20,
            backgroundColor: t.card,
            borderTopWidth: 1,
            borderTopColor: t.cardBorder,
          }}
        >
          {saveError ? (
            <Text style={{ fontFamily: 'Poppins400', fontSize: 12, color: '#ef4444', textAlign: 'center', marginBottom: 8 }}>
              {saveError}
            </Text>
          ) : null}
          <Pressable
            onPress={handleSave}
            disabled={saving}
            style={{
              backgroundColor: saving ? t.primaryBorder : t.primary,
              borderRadius: 16,
              paddingVertical: 16,
              alignItems: 'center',
              shadowColor: t.primary,
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: saving ? 0 : 0.3,
              shadowRadius: 8,
              elevation: saving ? 0 : 6,
            }}
          >
            {saving ? (
              <ActivityIndicator color='#fff' />
            ) : (
              <Text style={{ fontFamily: 'Poppins600', fontSize: 15, color: '#fff' }}>
                Save Changes
              </Text>
            )}
          </Pressable>
        </View>
      )}
    </SafeAreaView>
  );
}
