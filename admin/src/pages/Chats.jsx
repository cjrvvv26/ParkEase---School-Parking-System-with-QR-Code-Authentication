import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { io } from "socket.io-client";
import axiosConfig from "../utils/axiosConfig";
import { Search, Send } from "lucide-react";

const BASE_URL = "http://localhost:5000";
let socket = null;
const getSocket = () => {
  if (!socket) socket = io(BASE_URL, { transports: ["websocket"], autoConnect: false });
  return socket;
};

const formatName = (name) =>
  name ? `${name.firstName} ${name.lastName}` : "Unknown";

const formatTime = (iso) =>
  iso
    ? new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : "";

export default function Chats() {
  const { user } = useSelector((s) => s.auth || {});
  const adminId = user?._id || user?.userId;

  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const messagesEndRef = useRef(null);

  // Load student/faculty list
  useEffect(() => {
    axiosConfig.get("/super-admin/chat-users").then((res) => setUsers(res.data));
  }, []);

  // Socket setup
  useEffect(() => {
    if (!adminId) return;
    const s = getSocket();
    s.connect();
    s.on("received_message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });
    return () => s.off("received_message");
  }, [adminId]);

  // Load history + join room when user selected
  useEffect(() => {
    if (!selected || !adminId) return;
    const chatId = [adminId, selected._id].sort().join("_");
    axiosConfig.get(`/super-admin/chat/${chatId}`).then((res) => setMessages(res.data));
    getSocket().emit("join room", chatId);
  }, [selected, adminId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!text.trim() || !selected || !adminId) return;
    const chatId = [adminId, selected._id].sort().join("_");
    getSocket().emit("send_message", {
      chatId,
      sender: adminId,
      receiver: selected._id,
      message: text.trim(),
    });
    setText("");
  };

  const filtered = users.filter((u) =>
    formatName(u.name).toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex h-[calc(100vh-104px)] bg-gray-100">
      {/* Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-700 mb-4">Chats</h1>
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute top-2.5 left-3" />
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-gray-100 rounded-full text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filtered.length === 0 ? (
            <p className="p-4 text-center text-sm text-gray-400">No users found</p>
          ) : (
            filtered.map((u) => {
              const chatId = adminId ? [adminId, u._id].sort().join("_") : null;
              const lastMsg = messages.filter((m) => m.chatId === chatId).at(-1);
              return (
                <div
                  key={u._id}
                  onClick={() => setSelected(u)}
                  className={`p-4 border-b border-gray-100 cursor-pointer transition ${
                    selected?._id === u._id ? "bg-violet-50" : "hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative flex-shrink-0">
                      {u.profileDetails?.url ? (
                        <img
                          src={u.profileDetails.url}
                          alt={formatName(u.name)}
                          className="w-11 h-11 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-11 h-11 rounded-full bg-violet-100 flex items-center justify-center text-violet-600 font-semibold text-sm">
                          {u.name?.firstName?.[0]?.toUpperCase() || "?"}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-semibold text-gray-700 text-sm truncate">
                          {formatName(u.name)}
                        </p>
                      </div>
                      <p className="text-xs text-gray-400 capitalize">{u.role}</p>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-white">
        {selected ? (
          <>
            {/* Header */}
            <div className="border-b border-gray-200 p-4 bg-white shadow-sm flex items-center gap-3">
              {selected.profileDetails?.url ? (
                <img
                  src={selected.profileDetails.url}
                  alt={formatName(selected.name)}
                  className="w-11 h-11 rounded-full object-cover"
                />
              ) : (
                <div className="w-11 h-11 rounded-full bg-violet-100 flex items-center justify-center text-violet-600 font-semibold">
                  {selected.name?.firstName?.[0]?.toUpperCase() || "?"}
                </div>
              )}
              <div>
                <p className="font-semibold text-gray-700">{formatName(selected.name)}</p>
                <p className="text-xs text-gray-400 capitalize">{selected.role}</p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
              {messages.map((msg, i) => {
                const isOwn =
                  msg.sender === adminId ||
                  msg.sender?._id === adminId ||
                  msg.sender?.toString() === adminId?.toString();
                return (
                  <div key={msg._id || i} className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl text-sm ${
                        isOwn
                          ? "bg-violet-600 text-white rounded-br-none"
                          : "bg-gray-200 text-gray-900 rounded-bl-none"
                      }`}
                    >
                      <p>{msg.message}</p>
                      <p className={`text-xs mt-1 ${isOwn ? "text-violet-200" : "text-gray-500"}`}>
                        {formatTime(msg.createdAt)}
                      </p>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="border-t border-gray-200 bg-white p-4">
              <form onSubmit={handleSend} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Aa"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="flex-1 px-4 py-2 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
                <button
                  type="submit"
                  disabled={!text.trim()}
                  className="px-4 py-2 bg-violet-600 text-white rounded-full hover:bg-violet-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">
            Select a conversation to start messaging
          </div>
        )}
      </div>
    </div>
  );
}
