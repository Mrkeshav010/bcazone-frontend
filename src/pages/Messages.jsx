import { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import Navbar from '../components/Navbar';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Messages = () => {
  const { user } = useAuth();
  const [inbox, setInbox] = useState([]);
  const [requests, setRequests] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const socketRef = useRef(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    socketRef.current = io('http://localhost:5000', { query: { userId: user._id } });
    socketRef.current.on('receiveMessage', (msg) => {
      setMessages(prev => [...prev, msg]);
    });
    return () => socketRef.current.disconnect();
  }, [user]);

  useEffect(() => {
    const fetchInbox = async () => {
      try {
        const [inboxRes, reqRes] = await Promise.all([api.get('/messages/inbox'), api.get('/messages/requests')]);
        setInbox(inboxRes.data);
        setRequests(reqRes.data);
      } catch {}
    };
    fetchInbox();
  }, []);

  useEffect(() => {
    if (selectedUser) {
      api.get(`/messages/conversation/${selectedUser._id}`).then(r => setMessages(r.data));
    }
  }, [selectedUser]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const sendMsg = async () => {
    if (!text.trim()) return;
    socketRef.current.emit('sendMessage', { to: selectedUser._id, from: user._id, text });
    await api.post(`/messages/send/${selectedUser._id}`, { text });
    setMessages(prev => [...prev, { sender: user._id, text, createdAt: new Date() }]);
    setText('');
  };

  const handleRequest = async (id, status) => {
    await api.put(`/messages/request/${id}`, { status });
    setRequests(prev => prev.filter(r => r._id !== id));
    toast.success(status === 'accepted' ? 'Accepted!' : 'Rejected');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-5xl mx-auto py-6 px-4 flex gap-4" style={{ height: 'calc(100vh - 70px)' }}>
        {/* Sidebar */}
        <div className="w-72 bg-white rounded-2xl shadow p-4 overflow-y-auto">
          {requests.length > 0 && (
            <div className="mb-4">
              <h3 className="font-bold text-sm text-gray-500 mb-2">Message Requests</h3>
              {requests.map(r => (
                <div key={r._id} className="flex items-center gap-2 mb-2">
                  <img src={r.sender.profilePic || 'https://via.placeholder.com/32'} className="w-8 h-8 rounded-full" />
                  <span className="text-sm flex-1">{r.sender.fullName}</span>
                  <button onClick={() => handleRequest(r._id, 'accepted')} className="text-green-500 text-xs">✓</button>
                  <button onClick={() => handleRequest(r._id, 'rejected')} className="text-red-500 text-xs">✗</button>
                </div>
              ))}
            </div>
          )}
          <h3 className="font-bold text-sm text-gray-500 mb-2">Conversations</h3>
          {inbox.map(item => {
            const other = item.sender._id === user._id ? item.receiver : item.sender;
            return (
              <div key={item._id} onClick={() => setSelectedUser(other)}
                className={`flex items-center gap-3 p-2 rounded-xl cursor-pointer hover:bg-indigo-50 ${selectedUser?._id === other._id ? 'bg-indigo-100' : ''}`}>
                <img src={other.profilePic || 'https://via.placeholder.com/36'} className="w-10 h-10 rounded-full object-cover" />
                <div>
                  <p className="font-semibold text-sm">{other.fullName}</p>
                  <p className="text-xs text-gray-400">{other.college}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Chat */}
        <div className="flex-1 bg-white rounded-2xl shadow flex flex-col overflow-hidden">
          {selectedUser ? (
            <>
              <div className="p-4 border-b flex items-center gap-3">
                <img src={selectedUser.profilePic || 'https://via.placeholder.com/40'} className="w-10 h-10 rounded-full" />
                <span className="font-bold">{selectedUser.fullName}</span>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-2">
                {messages.map((m, i) => (
                  <div key={i} className={`flex ${m.sender === user._id || m.sender?._id === user._id ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-xs px-4 py-2 rounded-2xl text-sm ${m.sender === user._id || m.sender?._id === user._id ? 'bg-indigo-600 text-white' : 'bg-gray-100'}`}>
                      {m.text}
                    </div>
                  </div>
                ))}
                <div ref={bottomRef} />
              </div>
              <div className="p-4 border-t flex gap-3">
                <input className="input flex-1" placeholder="Type a message..." value={text}
                  onChange={e => setText(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && sendMsg()} />
                <button className="btn-primary" onClick={sendMsg}>Send</button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-400">
              Select a conversation to start chatting
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Messages;