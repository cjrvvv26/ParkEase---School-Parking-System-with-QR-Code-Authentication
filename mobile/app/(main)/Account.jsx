import { useRouter } from 'expo-router';
import { ChevronLeft, Camera, UserRound, Mail, Phone, Hash, BookOpen, GraduationCap } from 'lucide-react-native';
import { useState, useEffect } from 'react';
import { View, Text, ScrollView, Pressable, Image, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';

function InfoField({ icon: Icon, label, value, editable = false, onChangeText }) {
  return (
    <View style={{ marginBottom: 16 }}>
      <Text
        style={{
          fontFamily: 'Poppins600',
          fontSize: 12,
          color: '#9ca3af',
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
          backgroundColor: editable ? '#fff' : '#f9fafb',
          borderRadius: 14,
          borderWidth: 1,
          borderColor: editable ? '#c4b5fd' : '#e5e7eb',
          paddingHorizontal: 14,
          paddingVertical: 12,
          gap: 10,
        }}
      >
        <Icon color={editable ? '#8e51ff' : '#9ca3af'} size={16} />
        <TextInput
          value={value || ''}
          editable={editable}
          onChangeText={onChangeText}
          style={{
            flex: 1,
            fontFamily: 'Poppins500',
            fontSize: 14,
            color: editable ? '#0e0e11' : '#71717a',
            padding: 0,
          }}
        />
      </View>
    </View>
  );
}

export default function Account() {
  const router = useRouter();
  const [edit, setEdit] = useState(false);
  const [formData, setFormData] = useState({});
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user) setFormData(user);
  }, [user]);

  const roleColor = {
    student: { bg: '#eff6ff', text: '#2563eb', border: '#bfdbfe' },
    faculty: { bg: '#f0fdf4', text: '#16a34a', border: '#bbf7d0' },
    guard: { bg: '#fff7ed', text: '#ea580c', border: '#fed7aa' },
  };
  const rc = roleColor[user?.role] || roleColor.student;

  return (
    <SafeAreaView edges={['top', 'bottom']} className='bg-gray-50 flex-1'>
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
            className='active:opacity-70'
            style={{
              backgroundColor: '#fff',
              padding: 8,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: '#e5e7eb',
            }}
          >
            <ChevronLeft color='#0e0e11' size={22} />
          </Pressable>
          <Text
            style={{
              flex: 1,
              textAlign: 'center',
              fontFamily: 'Poppins700',
              fontSize: 20,
              color: '#0e0e11',
            }}
          >
            Profile
          </Text>
          <Pressable
            onPress={() => setEdit(!edit)}
            className='active:opacity-70'
            style={{
              backgroundColor: edit ? '#f0ebff' : '#fff',
              paddingHorizontal: 14,
              paddingVertical: 8,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: edit ? '#c4b5fd' : '#e5e7eb',
            }}
          >
            <Text
              style={{
                fontFamily: 'Poppins600',
                fontSize: 13,
                color: edit ? '#8e51ff' : '#71717a',
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
            backgroundColor: '#fff',
            borderRadius: 24,
            borderWidth: 1,
            borderColor: '#e5e7eb',
            marginBottom: 20,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.06,
            shadowRadius: 8,
            elevation: 3,
          }}
        >
          {/* Avatar */}
          <View style={{ position: 'relative', marginBottom: 14 }}>
            {user?.profileDetails?.url ? (
              <Image
                source={{ uri: user.profileDetails.url }}
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: 50,
                  borderWidth: 3,
                  borderColor: '#8e51ff',
                }}
              />
            ) : (
              <View
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: 50,
                  backgroundColor: '#f0ebff',
                  borderWidth: 3,
                  borderColor: '#8e51ff',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <UserRound size={52} strokeWidth={1} color='#8e51ff' />
              </View>
            )}
            {edit && (
              <Pressable
                className='active:opacity-70'
                style={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  backgroundColor: '#8e51ff',
                  padding: 8,
                  borderRadius: 20,
                  borderWidth: 2,
                  borderColor: '#fff',
                }}
              >
                <Camera size={14} color='#fff' />
              </Pressable>
            )}
          </View>

          {/* Name & badges */}
          <Text
            style={{
              fontFamily: 'Poppins700',
              fontSize: 18,
              color: '#0e0e11',
              marginBottom: 6,
            }}
          >
            {user?.name?.firstName} {user?.name?.lastName}
          </Text>
          <Text
            style={{
              fontFamily: 'Poppins400',
              fontSize: 13,
              color: '#71717a',
              marginBottom: 12,
            }}
          >
            @{user?.username}
          </Text>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <View
              style={{
                backgroundColor: '#f0ebff',
                paddingHorizontal: 12,
                paddingVertical: 4,
                borderRadius: 20,
                borderWidth: 1,
                borderColor: '#c4b5fd',
              }}
            >
              <Text
                style={{
                  fontFamily: 'Poppins600',
                  fontSize: 12,
                  color: '#8e51ff',
                }}
              >
                Verified
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
            backgroundColor: '#fff',
            borderRadius: 20,
            padding: 20,
            borderWidth: 1,
            borderColor: '#e5e7eb',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.05,
            shadowRadius: 6,
            elevation: 2,
          }}
        >
          <Text
            style={{
              fontFamily: 'Poppins700',
              fontSize: 15,
              color: '#0e0e11',
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
            onChangeText={(v) =>
              setFormData({ ...formData, name: { ...formData.name, firstName: v } })
            }
          />
          {(user?.role === 'student' || user?.role === 'faculty') && (
            <InfoField
              icon={UserRound}
              label='Middle Name'
              value={formData?.name?.middleName}
              editable={edit}
              onChangeText={(v) =>
                setFormData({ ...formData, name: { ...formData.name, middleName: v } })
              }
            />
          )}
          <InfoField
            icon={UserRound}
            label='Last Name'
            value={formData?.name?.lastName}
            editable={edit}
            onChangeText={(v) =>
              setFormData({ ...formData, name: { ...formData.name, lastName: v } })
            }
          />
          <InfoField
            icon={Mail}
            label='Email'
            value={formData?.email}
            editable={false}
          />
          <InfoField
            icon={Phone}
            label='Phone Number'
            value={formData?.phoneNo}
            editable={edit}
            onChangeText={(v) => setFormData({ ...formData, phoneNo: v })}
          />
          {user?.role === 'student' && (
            <>
              <InfoField
                icon={Hash}
                label='Student No.'
                value={formData?.studentNo}
                editable={false}
              />
              <InfoField
                icon={BookOpen}
                label='Course'
                value={formData?.course?.name}
                editable={false}
              />
              <InfoField
                icon={GraduationCap}
                label='Year Level'
                value={formData?.yearLevel}
                editable={false}
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
            backgroundColor: '#fff',
            borderTopWidth: 1,
            borderTopColor: '#e5e7eb',
          }}
        >
          <Pressable
            className='active:opacity-80'
            style={{
              backgroundColor: '#8e51ff',
              borderRadius: 16,
              paddingVertical: 16,
              alignItems: 'center',
              shadowColor: '#8e51ff',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 6,
            }}
          >
            <Text
              style={{
                fontFamily: 'Poppins600',
                fontSize: 15,
                color: '#fff',
              }}
            >
              Save Changes
            </Text>
          </Pressable>
        </View>
      )}
    </SafeAreaView>
  );
}
