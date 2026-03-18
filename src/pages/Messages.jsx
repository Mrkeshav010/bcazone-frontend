import { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import Navbar from '../components/Navbar';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const SOCKET_URL = import.meta.env.VITE_API_URL || 'https://bcazone-backend.onrender.com';

const Messages = () => {
  const { user } = useAuth();
  const [inbox, setInbox] = useState([]);
  const [requests, setRequests] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [activeTab, setActiveTab] = useState('chats');
  const [isTyping, setIsTyping] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [selectedMsg, setSelectedMsg] = useState(null);
  const socketRef = useRef(null);
  const bottomRef = useRef(null);
  const typingTimeout = useRef(null);
  const holdTimeout = useRef(null);

  useEffect(() => {
    socketRef.current = io(SOCKET_URL, { query: { userId: user._id } });
    socketRef.current.on('receiveMessage', (msg) => {
      setMessages(prev => [...prev, msg]);
    });
    socketRef.current.on('typing', ({ from }) => {
      if (selectedUser && from === selectedUser._id) {
        setIsTyping(true);
        clearTimeout(typingTimeout.current);
        typingTimeout.current = setTimeout(() => setIsTyping(false), 2000);
      }
    });
    return () => socketRef.current.disconnect();
  }, [user, selectedUser]);

  useEffect(() => { fetchInbox(); }, []);

  const fetchInbox = async () => {
    try {
      const [inboxRes, reqRes] = await Promise.all([
        api.get('/messages/inbox'),
        api.get('/messages/requests')
      ]);
      setInbox(inboxRes.data);
      setRequests(reqRes.data);
    } catch { }
  };

  useEffect(() => {
    if (selectedUser) {
      api.get(`/messages/conversation/${selectedUser._id}`).then(r => setMessages(r.data));
    }
  }, [selectedUser]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleTyping = (val) => {
    setText(val);
    if (selectedUser) {
      socketRef.current.emit('typing', { to: selectedUser._id, from: user._id });
    }
  };

  const sendMsg = async () => {
    if (!text.trim()) return;
    try {
      socketRef.current.emit('sendMessage', { to: selectedUser._id, from: user._id, text });
      await api.post(`/messages/send/${selectedUser._id}`, { text });
      setMessages(prev => [...prev, { sender: user._id, text, createdAt: new Date() }]);
      setText('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not send message');
    }
  };

  const handleRequest = async (id, status, senderName) => {
    try {
      await api.put(`/messages/request/${id}`, { status });
      setRequests(prev => prev.filter(r => r._id !== id));
      if (status === 'accepted') { toast.success(`Connected with ${senderName}!`); fetchInbox(); }
      else toast.success('Request rejected');
    } catch { toast.error('Error updating request'); }
  };

  const selectUser = (other) => { setSelectedUser(other); setShowChat(true); setSelectedMsg(null); };

  const deleteMessage = async (msgId, idx) => {
    try {
      await api.delete(`/messages/message/${msgId}`);
      setMessages(prev => prev.filter((_, i) => i !== idx));
      setSelectedMsg(null);
      toast.success('Message deleted');
    } catch { toast.error('Could not delete message'); }
  };

  const handleMsgHoldStart = (m, i, isMe) => {
    if (!isMe) return;
    holdTimeout.current = setTimeout(() => {
      setSelectedMsg({ id: m._id, idx: i });
    }, 600);
  };

  const handleMsgHoldEnd = () => {
    clearTimeout(holdTimeout.current);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Navbar />

      {/* Delete Modal */}
      {selectedMsg && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center px-4"
          onClick={() => setSelectedMsg(null)}>
          <div className="bg-white rounded-2xl shadow-xl p-5 w-72" onClick={e => e.stopPropagation()}>
            <p className="font-bold text-gray-800 mb-2 text-center">Delete Message?</p>
            <p className="text-sm text-gray-500 text-center mb-4">This message will be deleted permanently.</p>
            <div className="flex gap-3">
              <button onClick={() => setSelectedMsg(null)}
                className="flex-1 py-2 bg-gray-100 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-200 transition">
                Cancel
              </button>
              <button onClick={() => deleteMessage(selectedMsg.id, selectedMsg.idx)}
                className="flex-1 py-2 bg-red-500 rounded-xl text-sm font-semibold text-white hover:bg-red-600 transition">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 max-w-5xl w-full mx-auto px-2 md:px-4 py-4 flex gap-3 overflow-hidden"
        style={{ height: 'calc(100vh - 64px)' }}>

        {/* Sidebar */}
        <div className={`${showChat ? 'hidden md:flex' : 'flex'} w-full md:w-72 bg-white rounded-2xl shadow flex-col overflow-hidden flex-shrink-0`}>
          <div className="flex border-b border-gray-100 flex-shrink-0">
            <button onClick={() => setActiveTab('chats')}
              className={`flex-1 py-3 text-sm font-semibold transition-all ${activeTab === 'chats' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500'}`}>
              Chats {inbox.length > 0 && `(${inbox.length})`}
            </button>
            <button onClick={() => setActiveTab('requests')}
              className={`flex-1 py-3 text-sm font-semibold transition-all ${activeTab === 'requests' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500'}`}>
              Requests
              {requests.length > 0 && (
                <span className="ml-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">{requests.length}</span>
              )}
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-3">
            {activeTab === 'chats' && (
              inbox.length === 0 ? (
                <div className="text-center py-10 text-gray-400">
                  <p className="text-3xl mb-2">💬</p>
                  <p className="text-sm">No conversations yet</p>
                  <p className="text-xs mt-1">Connect with someone to start chatting</p>
                </div>
              ) : inbox.map(item => {
                const other = item.sender._id === user._id ? item.receiver : item.sender;
                return (
                  <div key={item._id} onClick={() => selectUser(other)}
                    className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer hover:bg-indigo-50 transition mb-1 ${selectedUser?._id === other._id ? 'bg-indigo-100' : ''}`}>
                    <img src={other.profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(other.fullName || 'U')}&background=4f46e5&color=fff`}
                      className="w-10 h-10 rounded-full object-cover border-2 border-indigo-200 flex-shrink-0" alt={other.fullName} />
                    <div className="min-w-0">
                      <p className="font-semibold text-sm text-gray-800 truncate">{other.fullName}</p>
                      <p className="text-xs text-gray-400 truncate">{other.college || 'BCA Student'}</p>
                    </div>
                  </div>
                );
              })
            )}

            {activeTab === 'requests' && (
              requests.length === 0 ? (
                <div className="text-center py-10 text-gray-400">
                  <p className="text-3xl mb-2">📭</p>
                  <p className="text-sm">No pending requests</p>
                </div>
              ) : requests.map(r => (
                <div key={r._id} className="bg-gray-50 rounded-xl p-3 mb-3">
                  <div className="flex items-center gap-3 mb-2">
                    <img src={r.sender.profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(r.sender.fullName || 'U')}&background=4f46e5&color=fff`}
                      className="w-10 h-10 rounded-full object-cover border-2 border-indigo-200 flex-shrink-0" alt={r.sender.fullName} />
                    <div className="min-w-0">
                      <p className="font-semibold text-sm text-gray-800 truncate">{r.sender.fullName}</p>
                      <p className="text-xs text-gray-400 truncate">{r.sender.college || 'BCA Student'}</p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mb-2">wants to connect with you</p>
                  <div className="flex gap-2">
                    <button onClick={() => handleRequest(r._id, 'accepted', r.sender.fullName)}
                      className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white text-xs py-2 rounded-lg font-semibold transition">
                      Accept
                    </button>
                    <button onClick={() => handleRequest(r._id, 'rejected', r.sender.fullName)}
                      className="flex-1 bg-gray-200 hover:bg-red-100 hover:text-red-600 text-gray-600 text-xs py-2 rounded-lg font-semibold transition">
                      Reject
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className={`${showChat ? 'flex' : 'hidden md:flex'} flex-1 bg-white rounded-2xl shadow flex-col overflow-hidden min-w-0`}>
          {selectedUser ? (
            <>
              <div className="p-3 md:p-4 border-b border-gray-100 flex items-center gap-3 bg-white flex-shrink-0">
                <button onClick={() => setShowChat(false)} className="md:hidden p-1 text-indigo-600 font-bold text-lg">←</button>
                <img src={selectedUser.profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedUser.fullName || 'U')}&background=4f46e5&color=fff`}
                  className="w-9 h-9 rounded-full object-cover border-2 border-indigo-200 flex-shrink-0" alt={selectedUser.fullName} />
                <div className="min-w-0">
                  <p className="font-bold text-gray-800 text-sm truncate">{selectedUser.fullName}</p>
                  {isTyping ? (
                    <p className="text-xs text-green-500 font-medium">typing...</p>
                  ) : (
                    <p className="text-xs text-gray-400 truncate">{selectedUser.college || 'BCA Student'}</p>
                  )}
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-3 md:p-4 space-y-2 bg-gray-50">
                {messages.length === 0 && (
                  <div className="text-center py-10 text-gray-400">
                    <p className="text-3xl mb-2">👋</p>
                    <p className="text-sm">Say hello to {selectedUser.fullName}!</p>
                  </div>
                )}
                {messages.map((m, i) => {
                  const isMe = m.sender === user._id || m.sender?._id === user._id;
                  const isSelected = selectedMsg?.idx === i;
                  return (
                    <div key={i} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                      <div
                        className={`max-w-[75%] px-3 py-2 rounded-2xl text-sm shadow-sm cursor-pointer select-none transition-all ${
                          isMe ? 'bg-indigo-600 text-white' : 'bg-white text-gray-800'
                        } ${isSelected ? 'opacity-70 scale-95' : ''}`}
                        onMouseDown={() => handleMsgHoldStart(m, i, isMe)}
                        onMouseUp={handleMsgHoldEnd}
                        onMouseLeave={handleMsgHoldEnd}
                        onTouchStart={() => handleMsgHoldStart(m, i, isMe)}
                        onTouchEnd={handleMsgHoldEnd}
                        onContextMenu={(e) => { e.preventDefault(); if (isMe) setSelectedMsg({ id: m._id, idx: i }); }}
                      >
                        <p>{m.text}</p>
                        <p className={`text-xs mt-1 ${isMe ? 'text-indigo-200' : 'text-gray-400'}`}>
                          {new Date(m.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  );
                })}

                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-white px-4 py-2 rounded-2xl shadow-sm flex items-center gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                )}
                <div ref={bottomRef} />
              </div>

              <div className="p-3 md:p-4 border-t border-gray-100 flex gap-2 bg-white flex-shrink-0">
                <input className="input flex-1 text-sm" placeholder="Type a message..."
                  value={text} onChange={e => handleTyping(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && sendMsg()} />
                <button className="btn-primary px-4 md:px-6 text-sm" onClick={sendMsg}>Send</button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
              <p className="text-5xl mb-4">💬</p>
              <p className="font-semibold text-gray-500">Select a conversation</p>
              <p className="text-sm mt-1 text-center px-4">Choose someone from the left to start chatting</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Messages;