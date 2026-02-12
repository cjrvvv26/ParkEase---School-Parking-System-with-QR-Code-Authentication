import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";

// Icons (inline SVGs for no dependency)
const SearchIcon = () => (
  <svg
    className="w-5 h-5 text-gray-400 absolute top-2 left-3"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
    />
  </svg>
);

const SendIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path d="M10.894 2.553a.75.75 0 00-1.788 0l-7 14a.75.75 0 001.359.906l1.07-2.14H13.37l1.07 2.14a.75.75 0 001.359-.906l-7-14zM12.896 6.553L10 11.86 7.104 6.553h5.792z" />
  </svg>
);

const PlusIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path d="M10.5 1.5H9.5V9H1.5V10.5H9V18.5H10.5V10.5H18.5V9H10.5V1.5Z" />
  </svg>
);

export default function Chat() {
  const { user } = useSelector((state) => state.auth || {});
  const [conversations, setConversations] = useState([
    {
      id: 1,
      name: "Super Admin",
      avatar: "https://via.placeholder.com/40?text=SA",
      lastMessage: "See you tomorrow!",
      timestamp: "2:30 PM",
      unread: 2,
      role: "Admin",
    },
    {
      id: 2,
      name: "John Guard",
      avatar: "https://via.placeholder.com/40?text=JG",
      lastMessage: "Thanks for the update",
      timestamp: "1:15 PM",
      unread: 0,
      role: "Guard",
    },
    {
      id: 3,
      name: "Maria Student",
      avatar: "https://via.placeholder.com/40?text=MS",
      lastMessage: "Can I get a parking slot?",
      timestamp: "Yesterday",
      unread: 1,
      role: "Student",
    },
  ]);

  const [selectedConversation, setSelectedConversation] = useState(
    conversations[0],
  );
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "Super Admin",
      senderRole: "Admin",
      text: "Hello! How are you?",
      timestamp: "10:30 AM",
      isOwn: false,
    },
    {
      id: 2,
      sender: user?.name || "You",
      senderRole: "Admin",
      text: "Hi! I'm doing great. How about you?",
      timestamp: "10:31 AM",
      isOwn: true,
    },
    {
      id: 3,
      sender: "Super Admin",
      senderRole: "Admin",
      text: "Great! Just wanted to check on the parking system updates.",
      timestamp: "10:32 AM",
      isOwn: false,
    },
    {
      id: 4,
      sender: user?.name || "You",
      senderRole: "Admin",
      text: "Yes, everything is running smoothly. No issues so far.",
      timestamp: "10:33 AM",
      isOwn: true,
    },
    {
      id: 5,
      sender: "Super Admin",
      senderRole: "Admin",
      text: "See you tomorrow!",
      timestamp: "2:30 PM",
      isOwn: false,
    },
  ]);

  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const message = {
      id: messages.length + 1,
      sender: user?.name || "You",
      senderRole: user?.role || "Admin",
      text: newMessage,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      isOwn: true,
    };

    setMessages([...messages, message]);
    setNewMessage("");

    // TODO: Dispatch action to send message to backend/WebSocket
    // Example: dispatch(sendMessage({ conversationId: selectedConversation.id, text: newMessage }))
  };

  const filteredConversations = conversations.filter((conv) =>
    conv.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="flex h-[calc(100vh-104px)] bg-gray-100">
      {/* Sidebar - Conversations List */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-700 mb-4">Chats</h1>

          {/* Search Bar */}
          <div className="relative">
            <SearchIcon />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-full text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">
          {filteredConversations.length > 0 ? (
            filteredConversations.map((conv) => (
              <div
                key={conv.id}
                onClick={() => setSelectedConversation(conv)}
                className={`p-4 border-b border-gray-100 cursor-pointer transition ${
                  selectedConversation.id === conv.id
                    ? "bg-violet-50"
                    : "hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center gap-3">
                  {/* Avatar */}
                  <div className="relative flex-shrink-0">
                    <img
                      src={conv.avatar}
                      alt={conv.name}
                      onError={(e) =>
                        (e.currentTarget.src = `https://via.placeholder.com/40?text=${conv.name[0]}`)
                      }
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                  </div>

                  {/* Conversation Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-gray-700">
                        {conv.name}
                      </h3>
                      <span className="text-xs text-gray-400">
                        {conv.timestamp}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 truncate mt-1">
                      {conv.lastMessage}
                    </p>
                    <span className="text-xs text-gray-400 mt-1">
                      {conv.role}
                    </span>
                  </div>

                  {/* Unread Badge */}
                  {conv.unread > 0 && (
                    <div className="flex-shrink-0 bg-violet-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                      {conv.unread}
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="p-4 text-center text-gray-400">
              <p>No conversations found</p>
            </div>
          )}
        </div>

        {/* New Conversation Button */}
        <div className="p-4 border-t border-gray-200">
          <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition font-semibold">
            <PlusIcon />
            New Chat
          </button>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-white">
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <div className="border-b border-gray-200 p-4 bg-white shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={selectedConversation.avatar}
                    alt={selectedConversation.name}
                    onError={(e) =>
                      (e.currentTarget.src = `https://via.placeholder.com/40?text=${selectedConversation.name[0]}`)
                    }
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h2 className="font-semibold text-gray-700">
                      {selectedConversation.name}
                    </h2>
                    <p className="text-sm text-gray-500">
                      <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                      Active now
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 hover:bg-gray-100 rounded-full transition">
                    <svg
                      className="w-6 h-6 text-gray-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 00-.684.908l.42 5.01a1 1 0 00.99.99h2.95l-.01.01a1 1 0 00.02-1.41L9.5 9m0 0a2 2 0 012-2h3.28a1 1 0 00-.684.908l.42 5.01a1 1 0 00.99.99h2.95l-.01.01a1 1 0 00.02-1.41"
                      />
                    </svg>
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-full transition">
                    <svg
                      className="w-6 h-6 text-gray-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 max-h-full">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.isOwn ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      msg.isOwn
                        ? "bg-violet-600 text-white rounded-br-none"
                        : "bg-gray-200 text-gray-900 rounded-bl-none"
                    }`}
                  >
                    <p className="text-sm">{msg.text}</p>
                    <p
                      className={`text-xs mt-1 ${msg.isOwn ? "text-violet-100" : "text-gray-600"}`}
                    >
                      {msg.timestamp}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="border-t border-gray-200 bg-white p-4">
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Aa"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="flex-1 px-4 py-2 bg-gray-100 rounded-full border-none focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
                <button
                  type="submit"
                  disabled={!newMessage.trim()}
                  className="px-4 py-2 bg-violet-600 text-white rounded-full hover:bg-violet-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
                >
                  <SendIcon />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">
              Select a conversation to start messaging
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
