import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { FaLinkedin, FaGithub, FaEnvelope, FaBan } from 'react-icons/fa';

const Profile = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [notes, setNotes] = useState([]);
  const [reqStatus, setReqStatus] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await api.get(`/users/${id}`);
        setProfile(data);
      } catch (err) {
        toast.error(err.response?.data?.message || 'Error');
      }
    };
    fetchProfile();
  }, [id]);

  const sendRequest = async () => {
    try {
      await api.post(`/messages/request/${id}`);
      setReqStatus('pending');
      toast.success('Message request sent!');
    } catch { toast.error('Error'); }
  };

  const blockUser = async () => {
    try {
      await api.post(`/users/block/${id}`);
      toast.success('User blocked');
    } catch { toast.error('Error'); }
  };

  if (!profile) return <div className="min-h-screen flex items-center justify-center"><p>Loading...</p></div>;

  const isOwn = user?._id === id;

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-3xl mx-auto py-10 px-4">
        <div className="card mb-6">
          <div className="flex items-start gap-6 flex-wrap">
            <img src={profile.profilePic || 'https://via.placeholder.com/100'}
              className="w-24 h-24 rounded-full object-cover border-4 border-indigo-500" alt="" />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-bold">{profile.fullName}</h2>
                {profile.isAdmin && (
                  <span className="bg-yellow-400 text-black text-xs px-2 py-0.5 rounded-full font-bold">ADMIN</span>
                )}
              </div>
              <p className="text-gray-500">{profile.college} — {profile.year} Year</p>
              <p className="text-gray-600 mt-2">{profile.bio}</p>
              <div className="flex gap-4 mt-3 flex-wrap text-sm text-gray-500">
                {profile.city && <span>📍 {profile.city}, {profile.state}</span>}
                {profile.education && <span>🎓 {profile.education}</span>}
              </div>
              {profile.skills?.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {profile.skills.map(s => (
                    <span key={s} className="bg-indigo-100 text-indigo-700 text-xs px-3 py-1 rounded-full">{s}</span>
                  ))}
                </div>
              )}
              <div className="flex gap-4 mt-4">
                {profile.linkedin && <a href={profile.linkedin} target="_blank" rel="noreferrer" className="text-blue-600"><FaLinkedin size={22} /></a>}
                {profile.github && <a href={profile.github} target="_blank" rel="noreferrer" className="text-gray-800"><FaGithub size={22} /></a>}
              </div>
            </div>
          </div>

          {!isOwn && (
            <div className="flex gap-3 mt-4">
              {reqStatus === 'pending'
                ? <span className="text-sm text-yellow-600">Request Sent ⏳</span>
                : <button className="btn-primary flex items-center gap-2" onClick={sendRequest}><FaEnvelope /> Send Message</button>
              }
              <button className="btn-secondary flex items-center gap-2" onClick={blockUser}><FaBan /> Block</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;