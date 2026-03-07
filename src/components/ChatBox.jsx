import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { FaPaperPlane, FaTimes } from 'react-icons/fa';

let socket;

const ChatBox = ({ otherUser, onClose }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const bottomRef = useRef(null);

  useEffect(() => {
    socket = io('http://localhost:5000', { query: { userId: user._id } });
    socket.on('receiveMessage', (msg) => {
      setMessages(prev => [...prev, msg]);
    });

    // Load existing conversation
    api.get(`/messages/conversation/${otherUser._id}`).then(r => setMessages(r.data));

    return () => socket.disconnect();
  }, [otherUser._id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMsg = async () => {
    if (!text.trim()) return;
    try {
      await api.post(`/messages/send/${otherUser._id}`, { text });
      socket.emit('sendMessage', { to: otherUser._id, from: user._id, text });
      setMessages(prev => [...prev, { sender: { _id: user._id }, text, createdAt: new Date() }]);
      setText('');
    } catch (err) {
      console.error('Send error:', err);
    }
  };

  const isOwn = (msg) => {
    const sid = msg.sender?._id || msg.sender;
    return sid === user._id || sid?.toString() === user._id?.toString();
  };

  return (
    <div className="fixed bottom-6 right-6 w-80 bg-white rounded-2xl shadow-2xl border border-blue-100 flex flex-col z-50"
      style={{ height: '420px' }}>

      {/* Header */}
      <div className="bg-gradient-to-r from-blue-700 to-blue-500 text-white p-3 rounded-t-2xl flex items-center gap-3">
        <div className="relative">
          <img
            src={otherUser.profilePic || `https://ui-avatars.com/api/?name=${otherUser.fullName}&background=1565C0&color=fff`}
            className="w-9 h-9 rounded-full object-cover border-2 border-white"
            alt=""
          />
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-white online-dot" />
        </div>
        <div className="flex-1">
          <p className="font-bold text-sm font-heading">{otherUser.fullName}</p>
          <p className="text-xs text-blue-200">{otherUser.college}</p>
        </div>
        <button onClick={onClose} className="hover:bg-white/20 rounded-full p-1 transition">
          <FaTimes size={14} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-blue-50/30">
        {messages.length === 0 && (
          <p className="text-center text-xs text-gray-400 mt-6">Start the conversation! 👋</p>
        )}
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${isOwn(msg) ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[75%] px-3 py-2 rounded-2xl text-sm font-body leading-relaxed ${
              isOwn(msg)
                ? 'bg-gradient-to-br from-blue-600 to-blue-500 text-white rounded-br-sm'
                : 'bg-white text-gray-800 border border-blue-100 rounded-bl-sm shadow-sm'
            }`}>
              {msg.text}
              <p className={`text-xs mt-0.5 ${isOwn(msg) ? 'text-blue-200' : 'text-gray-400'}`}>
                {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="p-3 border-t border-blue-100 flex gap-2 bg-white rounded-b-2xl">
        <input
          className="input flex-1 text-sm py-2"
          placeholder="Type a message..."
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMsg()}
        />
        <button
          onClick={sendMsg}
          className="btn-primary p-2.5 rounded-xl"
          disabled={!text.trim()}
        >
          <FaPaperPlane size={14} />
        </button>
      </div>
    </div>
  );
};

export default ChatBox;