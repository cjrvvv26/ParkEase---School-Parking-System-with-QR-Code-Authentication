import { useRouter } from 'expo-router';
import { ChevronLeft, Bell, BellOff, Trash2 } from 'lucide-react-native';
import { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, Pressable, ActivityIndicator, RefreshControl, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import useTheme from '../hooks/useTheme';
import { getNotifications, markAsRead, deleteNotification } from '../services/notificationService';

const FILTERS = ['All', 'Unread', 'Read'];
const TYPE_MAP = { All: 'all', Unread: 'unread', Read: 'read' };

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString();
}

export default function Notification() {
  const router = useRouter();
  const { t } = useTheme();
  const user = useSelector((s) => s.auth.user);

  const [filter, setFilter] = useState('All');
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const fetchNotifications = useCallback(async (isRefresh = false) => {
    if (!user?._id) return;
    try {
      isRefresh ? setRefreshing(true) : setLoading(true);
      setError(null);
      const res = await getNotifications(user._id, { type: TYPE_MAP[filter], limit: 50 });
      setNotifications(res.data.notifications || []);
    } catch (e) {
      setError('Failed to load notifications.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user?._id, filter]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const handlePress = async (notif) => {
    if (notif.read) return;
    try {
      await markAsRead(notif._id);
      setNotifications((prev) =>
        prev.map((n) => (n._id === notif._id ? { ...n, read: true } : n))
      );
    } catch (_) {}
  };

  const handleDelete = (notif) => {
    Alert.alert('Delete Notification', 'Remove this notification?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete', style: 'destructive',
        onPress: async () => {
          try {
            await deleteNotification(notif._id);
            setNotifications((prev) => prev.filter((n) => n._id !== notif._id));
          } catch (_) {}
        },
      },
    ]);
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: t.bg }}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => fetchNotifications(true)}
            tintColor={t.primary}
            colors={[t.primary]}
          />
        }
      >
        {/* Header */}
        <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 20, paddingBottom: 20 }}>
          <Pressable
            onPress={() => router.push('/Home')}
            style={{ backgroundColor: t.headerBtn, padding: 8, borderRadius: 12, borderWidth: 1, borderColor: t.headerBtnBorder, position: 'absolute', left: 20, top: 15, zIndex: 1 }}
          >
            <ChevronLeft color={t.text} size={22} />
          </Pressable>
          <View style={{ flex: 1, alignItems: 'center' }}>
            <Text style={{ fontFamily: 'Poppins700', fontSize: 20, color: t.text }}>Notifications</Text>
            {unreadCount > 0 && (
              <Text style={{ fontFamily: 'Poppins400', fontSize: 12, color: t.textMuted, marginTop: 2 }}>
                {unreadCount} unread
              </Text>
            )}
          </View>
        </View>

        {/* Filter Tabs */}
        <View style={{ flexDirection: 'row', marginHorizontal: 20, backgroundColor: t.filterBar, borderRadius: 12, padding: 4, marginBottom: 16 }}>
          {FILTERS.map((label) => (
            <Pressable
              key={label}
              onPress={() => setFilter(label)}
              style={{
                flex: 1, paddingVertical: 8, borderRadius: 10, alignItems: 'center',
                backgroundColor: filter === label ? t.primary : 'transparent',
                elevation: filter === label ? 3 : 0,
              }}
            >
              <Text style={{ fontFamily: 'Poppins600', fontSize: 13, color: filter === label ? '#fff' : t.textMuted }}>
                {label}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Content */}
        <View style={{ marginHorizontal: 20, gap: 10 }}>
          {loading ? (
            <View style={{ paddingTop: 60, alignItems: 'center' }}>
              <ActivityIndicator size="large" color={t.primary} />
            </View>
          ) : error ? (
            <View style={{ paddingTop: 60, alignItems: 'center', gap: 8 }}>
              <BellOff color={t.textFaint} size={36} strokeWidth={1.5} />
              <Text style={{ fontFamily: 'Poppins400', fontSize: 14, color: t.textFaint }}>{error}</Text>
              <Pressable onPress={() => fetchNotifications()} style={{ marginTop: 4, paddingHorizontal: 20, paddingVertical: 8, backgroundColor: t.primaryLight, borderRadius: 10 }}>
                <Text style={{ fontFamily: 'Poppins600', fontSize: 13, color: t.primary }}>Retry</Text>
              </Pressable>
            </View>
          ) : notifications.length === 0 ? (
            <View style={{ paddingTop: 60, alignItems: 'center', gap: 8 }}>
              <BellOff color={t.textFaint} size={36} strokeWidth={1.5} />
              <Text style={{ fontFamily: 'Poppins600', fontSize: 15, color: t.text }}>No notifications</Text>
              <Text style={{ fontFamily: 'Poppins400', fontSize: 13, color: t.textFaint }}>
                {filter === 'Unread' ? "You're all caught up!" : 'Nothing here yet.'}
              </Text>
            </View>
          ) : (
            notifications.map((notif) => (
              <Pressable
                key={notif._id}
                onPress={() => handlePress(notif)}
                onLongPress={() => handleDelete(notif)}
                style={{
                  backgroundColor: t.card, borderRadius: 16, padding: 16,
                  flexDirection: 'row', alignItems: 'flex-start', gap: 12,
                  borderWidth: 1, borderColor: notif.read ? t.cardBorder : t.cardBorderActive,
                }}
              >
                <View style={{ backgroundColor: notif.read ? t.bgSecondary : t.primaryLight, padding: 10, borderRadius: 12 }}>
                  <Bell color={notif.read ? t.textFaint : t.primary} size={18} />
                </View>
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                    <Text style={{ fontFamily: 'Poppins600', fontSize: 14, color: t.text, flex: 1, marginRight: 8 }} numberOfLines={1}>
                      {notif.title}
                    </Text>
                    <Text style={{ fontFamily: 'Poppins400', fontSize: 11, color: t.textFaint }}>
                      {timeAgo(notif.createdAt)}
                    </Text>
                  </View>
                  <Text style={{ fontFamily: 'Poppins400', fontSize: 13, color: t.textMuted, lineHeight: 18 }} numberOfLines={2}>
                    {notif.message}
                  </Text>
                  {!notif.read && (
                    <Text style={{ fontFamily: 'Poppins500', fontSize: 11, color: t.primary, marginTop: 6 }}>
                      Tap to mark as read
                    </Text>
                  )}
                </View>
                {!notif.read && (
                  <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: t.primary, marginTop: 4, flexShrink: 0 }} />
                )}
              </Pressable>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
