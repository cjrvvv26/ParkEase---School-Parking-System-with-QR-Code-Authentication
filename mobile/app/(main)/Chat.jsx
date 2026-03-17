import { useRouter } from 'expo-router';
import { ChevronLeft, Send, UserRound } from 'lucide-react-native';
import { useState, useRef } from 'react';
import { View, Text, ScrollView, Pressable, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import useTheme from '../hooks/useTheme';

const MOCK_MESSAGES = [
  { id: 1, from: 'admin', text: 'Hello! How can I help you today?', time: '9:00 AM' },
  { id: 2, from: 'user', text: "Hi! I have a question about my parking slot.", time: '9:01 AM' },
  { id: 3, from: 'admin', text: "Sure, go ahead! I'm here to assist you.", time: '9:01 AM' },
  { id: 4, from: 'user', text: "My slot assignment hasn't been updated yet after payment.", time: '9:03 AM' },
  { id: 5, from: 'admin', text: "I'll check that for you right away. Please give me a moment.", time: '9:04 AM' },
];

function Bubble({ msg, isUser, t }) {
  return (
    <View style={{ flexDirection: isUser ? 'row-reverse' : 'row', alignItems: 'flex-end', gap: 8, marginBottom: 12, paddingHorizontal: 16 }}>
      <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: isUser ? t.primaryLight : t.bgSecondary, alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, borderColor: isUser ? t.primaryBorder : t.cardBorder }}>
        <UserRound size={16} color={isUser ? t.primary : t.textFaint} strokeWidth={1.5} />
      </View>
      <View style={{ maxWidth: '72%' }}>
        <View style={{ backgroundColor: isUser ? t.primary : t.card, borderRadius: 18, borderBottomRightRadius: isUser ? 4 : 18, borderBottomLeftRadius: isUser ? 18 : 4, paddingHorizontal: 14, paddingVertical: 10, borderWidth: 1, borderColor: isUser ? '#7c3aed' : t.cardBorder }}>
          <Text style={{ fontFamily: 'Poppins400', fontSize: 14, color: isUser ? '#fff' : t.text, lineHeight: 20 }}>{msg.text}</Text>
        </View>
        <Text style={{ fontFamily: 'Poppins400', fontSize: 11, color: t.textFaint, marginTop: 4, textAlign: isUser ? 'right' : 'left' }}>{msg.time}</Text>
      </View>
    </View>
  );
}

export default function Chat() {
  const router = useRouter();
  const { user } = useSelector((state) => state.auth);
  const { t } = useTheme();
  const [messages, setMessages] = useState(MOCK_MESSAGES);
  const [input, setInput] = useState('');
  const scrollRef = useRef(null);

  const handleSend = () => {
    if (!input.trim()) return;
    const newMsg = { id: messages.length + 1, from: 'user', text: input.trim(), time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }) };
    setMessages((prev) => [...prev, newMsg]);
    setInput('');
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
  };

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
          {messages.map((msg) => <Bubble key={msg.id} msg={msg} isUser={msg.from === 'user'} t={t} />)}
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
            style={{ backgroundColor: input.trim() ? t.primary : t.bgSecondary, width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', shadowColor: t.primary, shadowOffset: { width: 0, height: 3 }, shadowOpacity: input.trim() ? 0.3 : 0, shadowRadius: 6, elevation: input.trim() ? 4 : 0 }}
          >
            <Send color={input.trim() ? '#fff' : t.textFaint} size={18} />
          </Pressable>
        </View>

      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
