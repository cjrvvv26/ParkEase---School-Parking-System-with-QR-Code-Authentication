import { Tabs } from 'expo-router';
import '../global.css';
import {
  Home,
  MessageCircleQuestionMark,
  Scan,
  TrendingUp,
} from 'lucide-react-native';
import { Pressable, View, Text } from 'react-native';
import { useSelector } from 'react-redux';
import useTheme from '../hooks/useTheme';

function ScanButton({ onPress, accessibilityState }) {
  const focused = accessibilityState?.selected;
  return (
    <Pressable
      onPress={onPress}
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-end',
        paddingBottom: 12,
      }}
    >
      <View
        style={{
          position: 'absolute',
          top: -28,
          width: 60,
          height: 60,
          borderRadius: 30,
          backgroundColor: focused ? '#2563eb' : '#3b82f6',
          justifyContent: 'center',
          alignItems: 'center',
          shadowColor: '#3b82f6',
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: 0.45,
          shadowRadius: 10,
          elevation: 8,
          borderWidth: 3,
          borderColor: '#fff',
        }}
      >
        <Scan size={24} color='#fff' />
      </View>
      <Text
        style={{
          fontFamily: 'Poppins500',
          fontSize: 11,
          color: focused ? '#3b82f6' : '#71717a',
          marginTop: 33,
          marginBottom: 25,
        }}
      >
        Scan
      </Text>
    </Pressable>
  );
}

function TabIcon({ icon: Icon, focused }) {
  const { t } = useTheme();
  return (
    <View
      style={{ alignItems: 'center', justifyContent: 'center', paddingTop: 4 }}
    >
      <View
        style={{
          backgroundColor: focused ? t.tabIconActiveBg : 'transparent',
          borderRadius: 12,
          paddingHorizontal: 14,
          paddingVertical: 5,
          marginBottom: 2,
        }}
      >
        <Icon size={22} color={focused ? t.primary : t.tabIconInactive} />
      </View>
    </View>
  );
}

export default function MainLayout() {
  const { t } = useTheme();
  const { user } = useSelector((s) => s.auth);
  const isGuard = user?.role === 'guard';
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: t.primary,
        tabBarInactiveTintColor: t.tabIconInactive,
        tabBarStyle: {
          height: 105,
          paddingBottom: 0,
          paddingTop: 0,
          backgroundColor: t.tabBar,
          borderTopWidth: 1,
          borderTopColor: t.tabBarBorder,
          shadowColor: '#3b82f6',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.08,
          shadowRadius: 12,
          elevation: 12,
        },
        tabBarLabelStyle: {
          fontFamily: 'Poppins500',
          fontSize: 11,
          marginTop: 0,
        },
        tabBarItemStyle: { paddingVertical: 8 },
      }}
    >
      <Tabs.Screen
        name='Home'
        options={{
          title: 'Home',
          tabBarIcon: ({ focused }) => (
            <TabIcon icon={Home} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name='Scan'
        options={{
          title: 'Scan',
          tabBarIcon: () => null,
          tabBarLabel: () => null,
          tabBarButton: (props) => <ScanButton {...props} />,
        }}
      />
      <Tabs.Screen
        name='Chat'
        options={{
          title: 'Support',
          href: isGuard ? null : undefined,
          tabBarStyle: { display: 'none' },
          tabBarIcon: ({ focused }) => (
            <TabIcon icon={MessageCircleQuestionMark} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name='Account'
        options={{ href: null, tabBarStyle: { display: 'none' } }}
      />
      <Tabs.Screen
        name='ChangePassword'
        options={{ href: null, tabBarStyle: { display: 'none' } }}
      />
      <Tabs.Screen
        name='TermsAndConditions'
        options={{ href: null, tabBarStyle: { display: 'none' } }}
      />
      <Tabs.Screen
        name='Analytics'
        options={{
          title: 'Analytics',
          href: isGuard ? undefined : null,
          tabBarIcon: ({ focused }) => (
            <TabIcon icon={TrendingUp} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen name='Settings' options={{ href: null }} />
      <Tabs.Screen name='Notification' options={{ href: null }} />
      <Tabs.Screen name='Parking' options={{ href: null }} />
    </Tabs>
  );
}
