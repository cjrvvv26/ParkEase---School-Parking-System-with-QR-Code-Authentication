import { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { io } from 'socket.io-client';
import axiosConfig from '../utils/axiosConfig';
import { Search, Send } from 'lucide-react';
import useDark from '../hooks/useDark';

const BASE_URL = 'http://localhost:5000';
let socket = null;
const getSocket = () => {
  if (!socket)
    socket = io(BASE_URL, { transports: ['websocket'], autoConnect: false });
  return socket;
};
const connectSocket = () =>
  new Promise((resolve) => {
    const s = getSocket();
    if (s.connected) return resolve(s);
    s.once('connect', () => resolve(s));
    s.connect();
  });

const formatName = (name) =>
  name ? `${name.firstName} ${name.lastName}` : 'Unknown';

const formatTime = (iso) =>
  iso
    ? new Date(iso).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      })
    : '';

export default function Chats() {
  const { dark, border } = useDark();
  const { user } = useSelector((s) => s.auth || {});
  const adminId = user?._id || user?.userId;

  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  // Per-conversation message cache: { [chatId]: Message[] }
  const [msgMap, setMsgMap] = useState({});
  const [text, setText] = useState('');
  const messagesEndRef = useRef(null);

  const getChatId = (userId) =>
    adminId && userId ? [adminId, userId].sort().join('_') : null;

  const currentChatId = selected ? getChatId(selected._id) : null;
  const messages = currentChatId ? (msgMap[currentChatId] ?? []) : [];

  const appendMessage = (msg) => {
    const cid = msg.chatId;
    if (!cid) return;
    setMsgMap((prev) => {
      const existing = prev[cid] ?? [];
      if (existing.some((m) => m._id && m._id === msg._id)) return prev;
      return { ...prev, [cid]: [...existing, msg] };
    });
  };

  // Load user list
  useEffect(() => {
    axiosConfig
      .get('/super-admin/chat-users')
      .then((res) => setUsers(res.data));
  }, []);

  // Socket setup — connect once, listen for all incoming messages
  useEffect(() => {
    if (!adminId) return;
    const s = getSocket();
    const handler = (msg) => {
      appendMessage(msg);
      // Bubble the sender to the top of the user list
      const senderId = msg.sender?.toString();
      if (senderId && senderId !== adminId?.toString()) {
        setUsers((prev) => {
          const idx = prev.findIndex((u) => u._id?.toString() === senderId);
          if (idx <= 0) return prev;
          const updated = [...prev];
          const [user] = updated.splice(idx, 1);
          return [user, ...updated];
        });
      }
    };
    s.on('received_message', handler);
    connectSocket();
    return () => s.off('received_message', handler);
  }, [adminId]);

  // When a user is selected: join their room + load history if not cached
  useEffect(() => {
    if (!selected || !adminId) return;
    const chatId = getChatId(selected._id);
    connectSocket().then((s) => s.emit('join room', chatId));
    if (!msgMap[chatId]) {
      axiosConfig
        .get(`/super-admin/chat/${chatId}`)
        .then((res) => setMsgMap((prev) => ({ ...prev, [chatId]: res.data })));
    }
  }, [selected, adminId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!text.trim() || !selected || !adminId) return;
    const chatId = getChatId(selected._id);
    getSocket().emit('send_message', {
      chatId,
      sender: adminId,
      receiver: selected._id,
      message: text.trim(),
    });
    setText('');
  };

  const filtered = users.filter((u) =>
    formatName(u.name).toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div
      className={`flex h-[calc(100vh-104px)] ${dark ? 'bg-[#1a1a1a]' : 'bg-gray-100'}`}
    >
      {/* Sidebar */}
      <div
        className={`w-80 rounded-ss-xl rounded-es-xl border-r ${border} flex flex-col ${dark ? 'bg-[#242424]' : 'bg-white'}`}
      >
        <div className={`p-4 border-b ${border}`}>
          <h1
            className={`text-2xl font-bold mb-4 ${dark ? 'text-gray-100' : 'text-gray-700'}`}
          >
            Chats
          </h1>
          <div className='relative'>
            <Search className='w-4 h-4 text-gray-400 absolute top-2.5 left-3' />
            <input
              type='text'
              placeholder='Search...'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={`w-full pl-9 pr-4 py-2 rounded-full text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 ${dark ? 'bg-[#2f2f2f] text-gray-200' : 'bg-gray-100'}`}
            />
          </div>
        </div>

        <div className='flex-1 overflow-y-auto'>
          {filtered.length === 0 ? (
            <p className='p-4 text-center text-sm text-gray-400'>
              No users found
            </p>
          ) : (
            filtered.map((u) => {
              const chatId = getChatId(u._id);
              const lastMsg = chatId ? (msgMap[chatId] ?? []).at(-1) : null;
              return (
                <div
                  key={u._id}
                  onClick={() => setSelected(u)}
                  className={`p-4 border-b cursor-pointer transition ${border} ${
                    selected?._id === u._id
                      ? dark
                        ? 'bg-blue-500/10'
                        : 'bg-blue-50'
                      : dark
                        ? 'hover:bg-[#2f2f2f]'
                        : 'hover:bg-gray-50'
                  }`}
                >
                  <div className='flex items-center gap-3'>
                    <div className='relative flex-shrink-0'>
                      {u.profileDetails?.url ? (
                        <img
                          src={u.profileDetails.url}
                          alt={formatName(u.name)}
                          className='w-11 h-11 rounded-full object-cover'
                        />
                      ) : (
                        <div className='w-11 h-11 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-sm'>
                          {u.name?.firstName?.[0]?.toUpperCase() || '?'}
                        </div>
                      )}
                    </div>
                    <div className='flex-1 min-w-0'>
                      <p
                        className={`font-semibold text-sm truncate ${dark ? 'text-gray-200' : 'text-gray-700'}`}
                      >
                        {formatName(u.name)}
                      </p>
                      {lastMsg ? (
                        <p className='text-xs text-gray-400 truncate'>
                          {lastMsg.message}
                        </p>
                      ) : (
                        <p className='text-xs text-gray-400 capitalize'>
                          {u.role}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div
        className={`flex-1 flex flex-col rounded-se-xl rounded-ee-xl ${dark ? 'bg-[#242424]' : 'bg-white'}`}
      >
        {selected ? (
          <>
            {/* Header */}
            <div
              className={`border-b p-4 rounded-se-xl shadow-sm flex items-center gap-3 ${border} ${dark ? 'bg-[#242424]' : 'bg-white'}`}
            >
              {selected.profileDetails?.url ? (
                <img
                  src={selected.profileDetails.url}
                  alt={formatName(selected.name)}
                  className='w-11 h-11 rounded-full object-cover'
                />
              ) : (
                <div className='w-11 h-11 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold'>
                  {selected.name?.firstName?.[0]?.toUpperCase() || '?'}
                </div>
              )}
              <div>
                <p
                  className={`font-semibold ${dark ? 'text-gray-100' : 'text-gray-700'}`}
                >
                  {formatName(selected.name)}
                </p>
                <p className='text-xs text-gray-400 capitalize'>
                  {selected.role}
                </p>
              </div>
            </div>

            {/* Messages */}
            <div
              className={`flex-1 overflow-y-auto p-4 space-y-3 ${dark ? 'bg-[#1a1a1a]' : 'bg-gray-50'}`}
            >
              {messages.map((msg, i) => {
                const isOwn = msg.sender?.toString() === adminId?.toString();
                return (
                  <div
                    key={msg._id || i}
                    className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl text-sm ${
                        isOwn
                          ? 'bg-blue-600 text-white rounded-br-none'
                          : dark
                            ? 'bg-[#2f2f2f] text-gray-200 rounded-bl-none'
                            : 'bg-gray-200 text-gray-900 rounded-bl-none'
                      }`}
                    >
                      <p>{msg.message}</p>
                      <p
                        className={`text-xs mt-1 ${isOwn ? 'text-blue-200' : 'text-gray-500'}`}
                      >
                        {formatTime(msg.createdAt)}
                      </p>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div
              className={`border-t p-4 rounded-ee-xl ${border} ${dark ? 'bg-[#242424]' : 'bg-white'}`}
            >
              <form onSubmit={handleSend} className='flex gap-2'>
                <input
                  type='text'
                  placeholder='Aa'
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className={`flex-1 px-4 py-2 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${dark ? 'bg-[#2f2f2f] text-gray-200 placeholder-gray-500' : 'bg-gray-100'}`}
                />
                <button
                  type='submit'
                  disabled={!text.trim()}
                  className='px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition'
                >
                  <Send className='w-4 h-4' />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className='flex-1 flex items-center justify-center text-gray-400 text-sm'>
            Select a conversation to start messaging
          </div>
        )}
      </div>
    </div>
  );
}
