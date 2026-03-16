import { Tabs } from 'expo-router';
import '../global.css';
import { Home, MessageCircleQuestionMark, Scan } from 'lucide-react-native';
import { Pressable, View } from 'react-native';

function ScanButton({ children, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        flex: 1,
        alignItems: 'center',
      }}
    >
      {/* Floating Icon */}
      <View
        style={{
          position: 'absolute',
          top: -30,
          width: 65,
          height: 65,
          borderRadius: 32,
          backgroundColor: '#8b5cf6',
          justifyContent: 'center',
          alignItems: 'center',
          elevation: 5,
          borderWidth: 1,
          borderColor: '#c6b1ff',
        }}
      >
        <Scan name='scan' size={28} color='white' />
      </View>

      {/* Label */}
      <View style={{ marginTop: 7 }}>{children}</View>
    </Pressable>
  );
}

export default function MainLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#8e51ff',
        tabBarInactiveTintColor: '#0e0e11',
        tabBarStyle: {
          height: 80,
          paddingBottom: 20,
        },
        tabBarLabelStyle: {
          fontFamily: 'Poppins500',
          fontSize: 12,
        },
      }}
    >
      <Tabs.Screen
        name='Home'
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
        }}
      />

      <Tabs.Screen
        name='Scan'
        options={{
          title: 'Scan',
          tabBarIcon: () => null,
          tabBarButton: (props) => <ScanButton {...props} />,
        }}
      />

      <Tabs.Screen
        name='Chat'
        options={{
          title: 'Support',
          tabBarStyle: { display: 'none' },
          tabBarIcon: ({ color, size }) => (
            <MessageCircleQuestionMark size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name='Account'
        options={{ href: null, tabBarStyle: { display: 'none' } }}
      />
      <Tabs.Screen name='Analytics' options={{ href: null }} />
      <Tabs.Screen name='Settings' options={{ href: null }} />
      <Tabs.Screen name='Notification' options={{ href: null }} />
    </Tabs>
  );
}
