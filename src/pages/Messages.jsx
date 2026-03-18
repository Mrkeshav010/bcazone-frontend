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
  const socketRef = useRef(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    socketRef.current = io(SOCKET_URL, { query: { userId: user._id } });
    socketRef.current.on('receiveMessage', (msg) => {
      setMessages(prev => [...prev, msg]);
    });
    return () => socketRef.current.disconnect();
  }, [user]);

  useEffect(() => {
    fetchInbox();
  }, []);

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
  }, [messages]);

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
      if (status === 'accepted') {
        toast.success(`Connected with ${senderName}!`);
        fetchInbox();
      } else {
        toast.success('Request rejected');
      }
    } catch {
      toast.error('Error updating request');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-5xl mx-auto py-6 px-4 flex gap-4" style={{ height: 'calc(100vh - 70px)' }}>

        {/* Sidebar */}
        <div className="w-72 bg-white rounded-2xl shadow flex flex-col overflow-hidden flex-shrink-0">

          {/* Tabs */}
          <div className="flex border-b border-gray-100">
            <button onClick={() => setActiveTab('chats')}
              className={`flex-1 py-3 text-sm font-semibold transition-all ${activeTab === 'chats' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500'}`}>
              Chats {inbox.length > 0 && `(${inbox.length})`}
            </button>
            <button onClick={() => setActiveTab('requests')}
              className={`flex-1 py-3 text-sm font-semibold transition-all relative ${activeTab === 'requests' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500'}`}>
              Requests
              {requests.length > 0 && (
                <span className="ml-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                  {requests.length}
                </span>
              )}
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-3">

            {/* Chats Tab */}
            {activeTab === 'chats' && (
              <>
                {inbox.length === 0 ? (
                  <div className="text-center py-10 text-gray-400">
                    <p className="text-3xl mb-2">💬</p>
                    <p className="text-sm">No conversations yet</p>
                    <p className="text-xs mt-1">Connect with someone to start chatting</p>
                  </div>
                ) : (
                  inbox.map(item => {
                    const other = item.sender._id === user._id ? item.receiver : item.sender;
                    return (
                      <div key={item._id} onClick={() => setSelectedUser(other)}
                        className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer hover:bg-indigo-50 transition mb-1 ${selectedUser?._id === other._id ? 'bg-indigo-100' : ''}`}>
                        <img
                          src={other.profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(other.fullName || 'U')}&background=4f46e5&color=fff`}
                          className="w-10 h-10 rounded-full object-cover border-2 border-indigo-200"
                          alt={other.fullName}
                        />
                        <div>
                          <p className="font-semibold text-sm text-gray-800">{other.fullName}</p>
                          <p className="text-xs text-gray-400">{other.college || 'BCA Student'}</p>
                        </div>
                      </div>
                    );
                  })
                )}
              </>
            )}

            {/* Requests Tab */}
            {activeTab === 'requests' && (
              <>
                {requests.length === 0 ? (
                  <div className="text-center py-10 text-gray-400">
                    <p className="text-3xl mb-2">📭</p>
                    <p className="text-sm">No pending requests</p>
                  </div>
                ) : (
                  requests.map(r => (
                    <div key={r._id} className="bg-gray-50 rounded-xl p-3 mb-3">
                      <div className="flex items-center gap-3 mb-3">
                        <img
                          src={r.sender.profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(r.sender.fullName || 'U')}&background=4f46e5&color=fff`}
                          className="w-10 h-10 rounded-full object-cover border-2 border-indigo-200"
                          alt={r.sender.fullName}
                        />
                        <div>
                          <p className="font-semibold text-sm text-gray-800">{r.sender.fullName}</p>
                          <p className="text-xs text-gray-400">{r.sender.college || 'BCA Student'}</p>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 mb-3">wants to connect with you</p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleRequest(r._id, 'accepted', r.sender.fullName)}
                          className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white text-xs py-2 rounded-lg font-semibold transition">
                          Accept
                        </button>
                        <button
                          onClick={() => handleRequest(r._id, 'rejected', r.sender.fullName)}
                          className="flex-1 bg-gray-200 hover:bg-red-100 hover:text-red-600 text-gray-600 text-xs py-2 rounded-lg font-semibold transition">
                          Reject
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </>
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 bg-white rounded-2xl shadow flex flex-col overflow-hidden">
          {selectedUser ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-100 flex items-center gap-3 bg-white">
                <img
                  src={selectedUser.profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedUser.fullName || 'U')}&background=4f46e5&color=fff`}
                  className="w-10 h-10 rounded-full object-cover border-2 border-indigo-200"
                  alt={selectedUser.fullName}
                />
                <div>
                  <p className="font-bold text-gray-800">{selectedUser.fullName}</p>
                  <p className="text-xs text-gray-400">{selectedUser.college || 'BCA Student'}</p>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-gray-50">
                {messages.length === 0 && (
                  <div className="text-center py-10 text-gray-400">
                    <p className="text-3xl mb-2">👋</p>
                    <p className="text-sm">Say hello to {selectedUser.fullName}!</p>
                  </div>
                )}
                {messages.map((m, i) => {
                  const isMe = m.sender === user._id || m.sender?._id === user._id;
                  return (
                    <div key={i} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-xs px-4 py-2 rounded-2xl text-sm shadow-sm ${isMe ? 'bg-indigo-600 text-white' : 'bg-white text-gray-800'}`}>
                        {m.text}
                        <p className={`text-xs mt-1 ${isMe ? 'text-indigo-200' : 'text-gray-400'}`}>
                          {new Date(m.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  );
                })}
                <div ref={bottomRef} />
              </div>

              {/* Input */}
              <div className="p-4 border-t border-gray-100 flex gap-3 bg-white">
                <input className="input flex-1" placeholder="Type a message..."
                  value={text} onChange={e => setText(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && sendMsg()} />
                <button className="btn-primary px-6" onClick={sendMsg}>Send</button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
              <p className="text-5xl mb-4">💬</p>
              <p className="font-semibold text-gray-500">Select a conversation</p>
              <p className="text-sm mt-1">Choose someone from the left to start chatting</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Messages;