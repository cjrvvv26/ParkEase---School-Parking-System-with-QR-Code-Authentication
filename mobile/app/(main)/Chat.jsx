import { useRouter } from 'expo-router';
import { ChevronLeft, Send, UserRound } from 'lucide-react-native';
import { useState, useRef, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, Pressable, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import useTheme from '../hooks/useTheme';
import { getSuperAdminId, getChatMessages } from '../services/chatService';
import { getSocket, connectSocket } from '../services/socketService';

function Bubble({ msg, isUser, t }) {
  const time = msg.createdAt
    ? new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })
    : msg.time ?? '';
  return (
    <View style={{ flexDirection: isUser ? 'row-reverse' : 'row', alignItems: 'flex-end', gap: 8, marginBottom: 12, paddingHorizontal: 16 }}>
      <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: isUser ? t.primaryLight : t.card, alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, borderColor: isUser ? t.primaryBorder : t.cardBorder }}>
        <UserRound size={16} color={isUser ? t.primary : t.textFaint} strokeWidth={1.5} />
      </View>
      <View style={{ maxWidth: '72%' }}>
        <View style={{ backgroundColor: isUser ? t.primary : t.card, borderRadius: 18, borderBottomRightRadius: isUser ? 4 : 18, borderBottomLeftRadius: isUser ? 18 : 4, paddingHorizontal: 14, paddingVertical: 10, borderWidth: 1, borderColor: isUser ? '#7c3aed' : t.cardBorder }}>
          <Text style={{ fontFamily: 'Poppins400', fontSize: 14, color: isUser ? '#fff' : t.text, lineHeight: 20 }}>{msg.message}</Text>
        </View>
        <Text style={{ fontFamily: 'Poppins400', fontSize: 11, color: t.textFaint, marginTop: 4, textAlign: isUser ? 'right' : 'left' }}>{time}</Text>
      </View>
    </View>
  );
}

export default function Chat() {
  const router = useRouter();
  const { user } = useSelector((state) => state.auth);
  const { t } = useTheme();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [adminId, setAdminId] = useState(null);
  const [chatId, setChatId] = useState(null);
  const scrollRef = useRef(null);

  const currentRoomRef = useRef(null);

  // Build deterministic chatId from two user IDs sorted
  const buildChatId = (a, b) => [a, b].sort().join('_');

  useEffect(() => {
    const socket = getSocket();

    const handler = (msg) => {
      setMessages((prev) =>
        prev.some((m) => m._id && m._id === msg._id) ? prev : [...prev, msg]
      );
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
    };

    const rejoin = () => {
      if (currentRoomRef.current) socket.emit('join room', currentRoomRef.current);
    };

    socket.on('received_message', handler);
    socket.on('connect', rejoin);

    const init = async () => {
      const res = await getSuperAdminId();
      if (!res?.data?._id) return;

      const saId = res.data._id;
      setAdminId(saId);
      const id = buildChatId(user._id, saId);
      setChatId(id);
      currentRoomRef.current = id;

      const history = await getChatMessages(id);
      if (history?.data) setMessages(history.data);

      // connectSocket resolves immediately if already connected
      await connectSocket();
      socket.emit('join room', id);
    };
    init();

    return () => {
      socket.off('received_message', handler);
      socket.off('connect', rejoin);
    };
  }, []);

  const handleSend = useCallback(() => {
    if (!input.trim() || !chatId || !adminId) return;
    const socket = getSocket();
    const payload = {
      chatId,
      sender: user._id,
      receiver: adminId,
      message: input.trim(),
    };
    socket.emit('send_message', payload);
    setInput('');
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
  }, [input, chatId, adminId]);

  return (
    <SafeAreaView edges={['top', 'bottom']} style={{ flex: 1, backgroundColor: t.bg }}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>

        {/* Header */}
        <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, backgroundColor: t.card, borderBottomWidth: 1, borderBottomColor: t.divider }}>
          <Pressable onPress={() => router.push('/Home')} style={{ backgroundColor: t.inputBg, padding: 8, borderRadius: 12, borderWidth: 1, borderColor: t.cardBorder, marginRight: 12 }}>
            <ChevronLeft color={t.text} size={20} />
          </Pressable>
          <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: t.primaryLight, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: t.primaryBorder, marginRight: 10 }}>
            <UserRound size={20} color={t.primary} strokeWidth={1.5} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontFamily: 'Poppins700', fontSize: 15, color: t.text }}>Support</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
              <View style={{ width: 7, height: 7, borderRadius: 4, backgroundColor: '#22c55e' }} />
              <Text style={{ fontFamily: 'Poppins400', fontSize: 12, color: t.textMuted }}>Super Admin • Online</Text>
            </View>
          </View>
        </View>

        {/* Messages */}
        <ScrollView
          ref={scrollRef}
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingTop: 16, paddingBottom: 8 }}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: false })}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: 16, marginBottom: 16, gap: 10 }}>
            <View style={{ flex: 1, height: 1, backgroundColor: t.divider }} />
            <Text style={{ fontFamily: 'Poppins400', fontSize: 11, color: t.textFaint }}>Today</Text>
            <View style={{ flex: 1, height: 1, backgroundColor: t.divider }} />
          </View>
          {messages.map((msg, i) => (
            <Bubble
              key={msg._id ?? i}
              msg={msg}
              isUser={msg.sender?.toString() === user._id?.toString()}
              t={t}
            />
          ))}
        </ScrollView>

        {/* Input Bar */}
        <View style={{ flexDirection: 'row', alignItems: 'flex-end', paddingHorizontal: 16, paddingVertical: 12, backgroundColor: t.card, borderTopWidth: 1, borderTopColor: t.divider, gap: 10 }}>
          <View style={{ flex: 1, backgroundColor: t.inputBg, borderRadius: 20, borderWidth: 1, borderColor: t.cardBorder, paddingHorizontal: 16, paddingVertical: 10, minHeight: 44, maxHeight: 120, justifyContent: 'center' }}>
            <TextInput
              value={input}
              onChangeText={setInput}
              placeholder='Type a message...'
              placeholderTextColor={t.textFaint}
              multiline
              style={{ fontFamily: 'Poppins400', fontSize: 14, color: t.text, padding: 0 }}
            />
          </View>
          <Pressable
            onPress={handleSend}
            style={{ backgroundColor: input.trim() ? t.primary : t.skeletonBg, width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', shadowColor: t.primary, shadowOffset: { width: 0, height: 3 }, shadowOpacity: input.trim() ? 0.3 : 0, shadowRadius: 6, elevation: input.trim() ? 4 : 0 }}
          >
            <Send color={input.trim() ? '#fff' : t.textFaint} size={18} />
          </Pressable>
        </View>

      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
