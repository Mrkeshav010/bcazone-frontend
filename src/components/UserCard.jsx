import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { FaEnvelope, FaUniversity, FaMapMarkerAlt } from 'react-icons/fa';
import { useState } from 'react';

const UserCard = ({ user: targetUser, showMessageBtn = true }) => {
  const { user } = useAuth();
  const [reqSent, setReqSent] = useState(false);
  const isOwn = user?._id === targetUser?._id;

  const sendRequest = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/messages/request/${targetUser._id}`);
      setReqSent(true);
      toast.success('Message request sent!');
    } catch {
      toast.error('Error sending request');
    }
  };

  if (!targetUser) return null;

  return (
    <div className="card hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5 fade-up">
      <Link to={`/profile/${targetUser._id}`} className="flex items-center gap-3 mb-3">
        <div className="relative">
          <img
            src={targetUser.profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(targetUser.fullName)}&background=1565C0&color=fff&size=80`}
            alt={targetUser.fullName}
            className="w-14 h-14 rounded-full object-cover border-2 border-blue-200"
          />
          {targetUser.isAdmin && (
            <span className="absolute -top-1 -right-1 bg-yellow-400 text-black text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">A</span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-bold text-base font-heading text-blue-900 truncate">{targetUser.fullName}</h3>
            {targetUser.isAdmin && (
              <span className="bg-yellow-100 text-yellow-700 text-xs px-1.5 py-0.5 rounded-full font-bold">ADMIN</span>
            )}
          </div>
          {targetUser.college && (
            <p className="text-blue-500 text-xs flex items-center gap-1 mt-0.5">
              <FaUniversity size={10} /> {targetUser.college}
            </p>
          )}
          {(targetUser.city || targetUser.state) && (
            <p className="text-gray-400 text-xs flex items-center gap-1">
              <FaMapMarkerAlt size={10} /> {[targetUser.city, targetUser.state].filter(Boolean).join(', ')}
            </p>
          )}
        </div>
      </Link>

      {targetUser.year && (
        <span className="inline-block bg-blue-50 text-blue-600 text-xs px-2.5 py-1 rounded-full font-semibold mb-3">
          {targetUser.year} Year
        </span>
      )}

      {targetUser.bio && (
        <p className="text-gray-500 text-sm mb-3 line-clamp-2">{targetUser.bio}</p>
      )}

      {targetUser.skills?.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {targetUser.skills.slice(0, 3).map(skill => (
            <span key={skill} className="bg-blue-50 text-blue-700 text-xs px-2 py-0.5 rounded-full border border-blue-100">
              {skill}
            </span>
          ))}
          {targetUser.skills.length > 3 && (
            <span className="text-xs text-gray-400">+{targetUser.skills.length - 3} more</span>
          )}
        </div>
      )}

      {!isOwn && showMessageBtn && (
        <div className="flex gap-2 mt-2">
          {reqSent ? (
            <span className="text-sm text-yellow-600 font-medium flex items-center gap-1">⏳ Request Sent</span>
          ) : (
            <button onClick={sendRequest}
              className="btn-primary text-sm flex items-center gap-1.5 py-1.5 px-3">
              <FaEnvelope size={12} /> Message
            </button>
          )}
          <Link to={`/profile/${targetUser._id}`}
            className="btn-secondary text-sm py-1.5 px-3">
            View Profile
          </Link>
        </div>
      )}

      {isOwn && (
        <Link to={`/profile/${targetUser._id}`}
          className="btn-secondary text-sm py-1.5 px-3 inline-block text-center w-full">
          My Profile
        </Link>
      )}
    </div>
  );
};

export default UserCard;