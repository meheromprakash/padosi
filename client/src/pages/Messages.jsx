import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AppLayout from '../components/AppLayout';
import { formatTime } from '../utils/dateUtils';
import { useAuth } from '../hooks/useAuth';
import { useSocket } from '../hooks/useSocket';
import api from '../api/axios';
import TopBar from '../components/TopBar';

export default function Messages() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { emit, on } = useSocket();
  
  const [conversations, setConversations] = useState([]);
  const [conversationsLoading, setConversationsLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [partnerTyping, setPartnerTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Fetch active conversations (threads list)
  const fetchConversations = useCallback(async () => {
    try {
      setConversationsLoading(true);
      const { data } = await api.get('/messages/conversations');
      setConversations(data.conversations || []);
    } catch (err) {
      console.error('Failed to load conversations:', err);
    } finally {
      setConversationsLoading(false);
    }
  }, []);

  // Fetch message history with a partner
  const fetchMessages = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const { data } = await api.get(`/messages/${userId}`);
      setMessages(data.messages || []);
    } catch (err) {
      console.error('Failed to fetch messages:', err);
      setMessages([]);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Load conversations on mount/partner switch
  useEffect(() => {
    fetchConversations();
  }, [userId, fetchConversations]);

  // Load messages and listen to sockets
  useEffect(() => {
    fetchMessages();

    if (!userId) return;

    const cleanupReceive = on('message:receive', (msg) => {
      // Append if it's from the active partner
      if (msg.senderId === userId || msg.receiverId === userId) {
        setMessages((prev) => {
          // Avoid duplicate messages if already optimistically added
          if (prev.some((m) => m._id === msg._id)) return prev;
          return [...prev, msg];
        });
      }
      // Reload conversations list to show correct latest message & unread badge
      fetchConversations();
    });

    const cleanupTypingStart = on('typing:start', ({ senderId }) => {
      if (senderId === userId) {
        setPartnerTyping(true);
      }
    });

    const cleanupTypingStop = on('typing:stop', ({ senderId }) => {
      if (senderId === userId) {
        setPartnerTyping(false);
      }
    });

    return () => {
      cleanupReceive();
      cleanupTypingStart();
      cleanupTypingStop();
    };
  }, [userId, fetchMessages, fetchConversations, on]);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, partnerTyping]);

  // Send message handler
  const sendMessage = async () => {
    if (!newMsg.trim() || !userId) return;
    const contentStr = newMsg.trim();
    setNewMsg('');

    // Emit stop typing
    emit('typing:stop', { receiverId: userId });

    const optimisticId = `optimistic-${Date.now()}`;
    const optimistic = {
      _id: optimisticId,
      content: contentStr,
      senderId: user?._id,
      receiverId: userId,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, optimistic]);

    try {
      const { data } = await api.post('/messages', {
        receiverId: userId,
        content: contentStr,
      });

      // Update optimistic message with real message
      setMessages((prev) =>
        prev.map((m) => (m._id === optimisticId ? data.message : m))
      );

      // Refresh conversations list to update latest msg
      fetchConversations();
    } catch (err) {
      console.error('Failed to send message:', err);
      // Remove optimistic message on error
      setMessages((prev) => prev.filter((m) => m._id !== optimisticId));
    }
  };

  // Handle typing input trigger
  const handleInputChange = (e) => {
    setNewMsg(e.target.value);
    if (!userId) return;

    // Send typing start
    emit('typing:start', { receiverId: userId });

    // Set timeout to clear typing stop after 2s of no input
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      emit('typing:stop', { receiverId: userId });
    }, 2000);
  };

  const chatPartner = conversations.find((c) => c.userId === userId) || { name: 'Neighbor' };

  // Render threads list panel
  const renderThreads = () => (
    <div className="flex flex-col h-full bg-surface-container-lowest rounded-2xl border border-outline-variant/10 overflow-hidden shadow-[0px_4px_12px_rgba(31,41,55,0.05)]">
      <div className="p-4 border-b border-outline-variant/10">
        <h2 className="font-headline-sm text-headline-sm font-bold text-on-surface">Conversations</h2>
      </div>
      <div className="flex-1 overflow-y-auto divide-y divide-outline-variant/10">
        {conversationsLoading && conversations.length === 0 && (
          <div className="text-center py-8 text-outline text-xs">Loading conversations...</div>
        )}
        {!conversationsLoading && conversations.length === 0 && (
          <div className="text-center py-8 text-outline text-xs">No active chats yet.</div>
        )}
        {conversations.map((conv) => {
          const isActive = conv.userId === userId;
          const partnerInitials = conv.name.charAt(0).toUpperCase();
          const unreadNum = parseInt(conv.unread) || 0;
          return (
            <button
              key={conv.userId}
              onClick={() => navigate(`/messages/${conv.userId}`)}
              className={`w-full flex items-center gap-3 px-4 py-4 transition-colors text-left ${isActive ? 'bg-[#F3F5F4]' : 'hover:bg-[#F3F5F4]/50'}`}
            >
              <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center font-bold text-primary shrink-0 overflow-hidden">
                {conv.avatar ? (
                  <img src={conv.avatar} alt={conv.name} className="w-full h-full object-cover rounded-full" />
                ) : (
                  partnerInitials
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm text-on-surface">{conv.name}</p>
                <p className="text-xs text-outline truncate mt-0.5">{conv.lastMessage || 'Sent a message'}</p>
              </div>
              <div className="flex flex-col items-end gap-1 flex-shrink-0">
                <span className="text-[10px] text-outline font-medium">{formatTime(conv.time)}</span>
                {unreadNum > 0 && (
                  <span className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px] font-bold bg-primary">
                    {unreadNum}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <AppLayout noRightPanel rightPanel={null}>
      <TopBar />

      {/* Desktop dual pane layout */}
      <div className="hidden md:grid grid-cols-12 gap-6 h-[calc(100vh-64px)] p-6 md:pt-20">
        <div className="col-span-4 h-full">
          {renderThreads()}
        </div>

        <div className="col-span-8 h-full flex flex-col bg-surface-container-lowest rounded-2xl border border-outline-variant/10 overflow-hidden shadow-[0px_4px_12px_rgba(31,41,55,0.05)]">
          {userId ? (
            <>
              <div className="px-6 py-4 border-b border-outline-variant/10 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center font-bold text-primary overflow-hidden shrink-0">
                  {chatPartner.avatar ? (
                    <img src={chatPartner.avatar} alt={chatPartner.name} className="w-full h-full object-cover rounded-full" />
                  ) : (
                    chatPartner.name.charAt(0).toUpperCase()
                  )}
                </div>
                <div>
                  <p className="font-bold text-sm text-on-surface">{chatPartner.name}</p>
                  <p className="text-[11px] text-[#137333] font-bold">Online</p>
                </div>
                <div className="ml-auto flex items-center gap-2">
                  <button className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-surface-container text-on-surface-variant transition-colors">
                    <span className="material-symbols-outlined text-[20px]">phone</span>
                  </button>
                  <button className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-surface-container text-on-surface-variant transition-colors">
                    <span className="material-symbols-outlined text-[20px]">more_horiz</span>
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 bg-[#F3F5F4]/30">
                {loading && <div className="text-center text-sm text-outline">Loading messages...</div>}
                {messages.length === 0 && !loading && (
                  <div className="text-center py-12">
                    <p className="text-outline text-sm">Start a conversation with {chatPartner.name}</p>
                  </div>
                )}
                {messages.map((msg) => {
                  const isMine = msg.senderId === user?._id || msg.senderId === 'me';
                  return (
                    <div key={msg._id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[70%] px-4 py-2.5 rounded-2xl text-sm ${isMine ? 'bg-primary text-on-primary rounded-br-sm shadow-sm' : 'bg-surface-container-high text-on-surface rounded-bl-sm border border-outline-variant/10'}`}>
                        <p className="leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                        <p className="text-[9px] mt-1 text-right opacity-70">
                          {formatTime(msg.createdAt)}
                        </p>
                      </div>
                    </div>
                  );
                })}
                {partnerTyping && (
                  <div className="flex justify-start">
                    <div className="bg-surface-container-high text-on-surface-variant rounded-2xl rounded-bl-sm px-4 py-2 text-xs italic">
                      Typing...
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              <div className="p-4 border-t border-outline-variant/10 flex items-center gap-3">
                <input
                  value={newMsg}
                  onChange={handleInputChange}
                  onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                  placeholder="Type a message..."
                  className="w-full bg-[#F3F5F4] border-none rounded-xl py-3 px-4 font-body-sm text-body-sm focus:ring-2 focus:ring-primary transition-all text-on-surface flex-1"
                />
                <button
                  onClick={sendMessage}
                  disabled={!newMsg.trim()}
                  className="w-11 h-11 bg-primary text-on-primary rounded-xl flex items-center justify-center disabled:opacity-50 flex-shrink-0 active:scale-95 transition-all text-white"
                >
                  <span className="material-symbols-outlined">send</span>
                </button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-[#F3F5F4]/10">
              <div className="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center text-primary mb-4">
                <span className="material-symbols-outlined text-[32px]">chat</span>
              </div>
              <h3 className="font-bold text-lg text-on-surface">Your Messages</h3>
              <p className="text-sm text-outline max-w-sm mt-1">Select a conversation from the list to start chatting with your neighbors.</p>
            </div>
          )}
        </div>
      </div>

      {/* Mobile single pane view */}
      <div className="md:hidden flex flex-col h-[calc(100vh-64px)] pb-16 pt-16">
        {!userId ? (
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="px-4 py-4 border-b border-outline-variant/10 flex-shrink-0 bg-surface-container-lowest">
              <h1 className="font-headline-md text-headline-sm font-bold text-on-surface">Messages</h1>
            </div>
            <div className="flex-1 overflow-y-auto divide-y divide-outline-variant/10 bg-surface-container-lowest">
              {conversationsLoading && conversations.length === 0 && (
                <div className="text-center py-8 text-outline text-xs">Loading conversations...</div>
              )}
              {!conversationsLoading && conversations.length === 0 && (
                <div className="text-center py-8 text-outline text-xs">No active chats yet.</div>
              )}
              {conversations.map((conv) => (
                <button
                  key={conv.userId}
                  onClick={() => navigate(`/messages/${conv.userId}`)}
                  className="w-full flex items-center gap-3 px-4 py-4 hover:bg-[#F3F5F4]/50 transition-colors text-left"
                >
                  <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center font-bold text-primary shrink-0 overflow-hidden">
                    {conv.avatar ? (
                      <img src={conv.avatar} alt={conv.name} className="w-full h-full object-cover rounded-full" />
                    ) : (
                      conv.name.charAt(0).toUpperCase()
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm text-on-surface">{conv.name}</p>
                    <p className="text-xs text-outline truncate mt-0.5">{conv.lastMessage || 'Sent a message'}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    <span className="text-[10px] text-outline font-medium">{formatTime(conv.time)}</span>
                    {parseInt(conv.unread) > 0 && (
                      <span className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px] font-bold bg-primary">
                        {conv.unread}
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col overflow-hidden bg-surface-container-lowest">
            <div className="px-4 py-3 border-b border-outline-variant/10 flex items-center gap-3 bg-surface-container-lowest flex-shrink-0">
              <button
                onClick={() => navigate('/messages')}
                className="p-2 -ml-2 rounded-xl hover:bg-surface-container text-on-surface"
              >
                <span className="material-symbols-outlined">arrow_back</span>
              </button>
              <div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center font-bold text-primary text-xs overflow-hidden shrink-0">
                {chatPartner.avatar ? (
                  <img src={chatPartner.avatar} alt={chatPartner.name} className="w-full h-full object-cover rounded-full" />
                ) : (
                  chatPartner.name.charAt(0).toUpperCase()
                )}
              </div>
              <div>
                <p className="font-bold text-sm text-on-surface">{chatPartner.name}</p>
                <p className="text-[11px] text-[#137333] font-bold">Online</p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-[#F3F5F4]/30">
              {loading && <div className="text-center text-sm text-outline">Loading messages...</div>}
              {messages.length === 0 && !loading && (
                <div className="text-center py-12">
                  <p className="text-outline text-sm">Start a conversation with {chatPartner.name}</p>
                </div>
              )}
              {messages.map((msg) => {
                const isMine = msg.senderId === user?._id || msg.senderId === 'me';
                return (
                  <div key={msg._id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm ${isMine ? 'bg-primary text-on-primary rounded-br-sm shadow-sm' : 'bg-surface-container-high text-on-surface rounded-bl-sm border border-outline-variant/10'}`}>
                      <p className="leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                      <p className="text-[9px] mt-1 text-right opacity-70">
                        {formatTime(msg.createdAt)}
                      </p>
                    </div>
                  </div>
                );
              })}
              {partnerTyping && (
                <div className="flex justify-start">
                  <div className="bg-surface-container-high text-on-surface-variant rounded-2xl rounded-bl-sm px-4 py-2 text-xs italic">
                    Typing...
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-3 border-t border-outline-variant/10 bg-surface-container-lowest flex items-center gap-2 flex-shrink-0">
              <input
                value={newMsg}
                onChange={handleInputChange}
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                placeholder="Type a message..."
                className="w-full bg-[#F3F5F4] border-none rounded-xl py-3 px-4 font-body-sm text-body-sm focus:ring-2 focus:ring-primary transition-all text-on-surface flex-1"
              />
              <button
                onClick={sendMessage}
                disabled={!newMsg.trim()}
                className="w-10 h-10 bg-primary text-on-primary rounded-xl flex items-center justify-center disabled:opacity-50 flex-shrink-0 active:scale-95 transition-all text-white"
              >
                <span className="material-symbols-outlined">send</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
