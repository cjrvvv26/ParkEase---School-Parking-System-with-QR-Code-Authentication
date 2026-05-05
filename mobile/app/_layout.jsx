import { Stack, usePathname } from 'expo-router';
import { Provider } from 'react-redux';
import store from './store';
import './global.css';
import { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { getSocket, connectSocket } from './services/socketService';
import usePushNotifications, { scheduleLocalNotification } from './hooks/usePushNotifications';

function AppContent() {
  const { user } = useSelector((state) => state.auth);
  const pathname = usePathname();
  const pathnameRef = useRef(pathname);
  usePushNotifications();

  useEffect(() => {
    pathnameRef.current = pathname;
  }, [pathname]);

  useEffect(() => {
    if (!user?._id) return;

    let mounted = true;
    const socket = getSocket();

    const handleNotification = (notif) => {
      if (!mounted) return;
      scheduleLocalNotification(notif.title, notif.message, { type: 'notification', id: notif._id });
    };

    const handleMessage = (msg) => {
      if (!mounted) return;
      if (msg.sender?.toString() === user._id?.toString()) return;
      // Don't push if user is already on the Chat screen
      if (pathnameRef.current?.includes('Chat')) return;
      scheduleLocalNotification('New Message', msg.message, { type: 'chat' });
    };

    const rejoin = () => {
      socket.emit('join_user', user._id);
    };

    socket.on('new_notification', handleNotification);
    socket.on('received_message', handleMessage);
    socket.on('connect', rejoin);

    connectSocket().then(() => {
      socket.emit('join_user', user._id);
    });

    return () => {
      mounted = false;
      socket.off('new_notification', handleNotification);
      socket.off('received_message', handleMessage);
      socket.off('connect', rejoin);
    };
  }, [user?._id]);

  return <Stack screenOptions={{ headerShown: false }} />;
}

export default function MainLayout() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}
