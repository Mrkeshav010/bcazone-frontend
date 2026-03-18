import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { FaLinkedin, FaGithub, FaEnvelope, FaBan, FaEdit } from 'react-icons/fa';

const Profile = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [uploadedNotes, setUploadedNotes] = useState([]);
  const [uploadedSyllabus, setUploadedSyllabus] = useState([]);
  const [uploadedQPapers, setUploadedQPapers] = useState([]);
  const [reqStatus, setReqStatus] = useState(null);
  const [activeTab, setActiveTab] = useState('notes');

  useEffect(() => {
    fetchProfile();
    fetchUploads();
  }, [id]);

  const fetchProfile = async () => {
    try {
      const { data } = await api.get(`/users/${id}`);
      setProfile(data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error loading profile');
    }
  };

  const fetchUploads = async () => {
    try {
      const [notes, syllabus, qpapers] = await Promise.all([
        api.get(`/notes?uploadedBy=${id}`),
        api.get(`/syllabus?uploadedBy=${id}`),
        api.get(`/questionpapers?uploadedBy=${id}`),
      ]);
      setUploadedNotes(notes.data);
      setUploadedSyllabus(syllabus.data);
      setUploadedQPapers(qpapers.data);
    } catch { }
  };

  const sendRequest = async () => {
    try {
      await api.post(`/messages/request/${id}`);
      setReqStatus('pending');
      toast.success('Message request sent!');
    } catch { toast.error('Error sending request'); }
  };

  const blockUser = async () => {
    try {
      await api.post(`/users/block/${id}`);
      toast.success('User blocked');
    } catch { toast.error('Error'); }
  };

  if (!profile) return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="flex items-center justify-center py-20">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    </div>
  );

  const isOwn = user?._id === id;
  const totalUploads = uploadedNotes.length + uploadedSyllabus.length + uploadedQPapers.length;

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-3xl mx-auto py-8 px-4">

        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6">

          {/* Cover */}
          <div style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed)' }} className="h-24" />

          <div className="px-6 pb-6">
            <div className="flex items-end justify-between -mt-12 mb-4 flex-wrap gap-3">
              <img
                src={profile.profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.fullName || 'U')}&background=4f46e5&color=fff&size=100`}
                className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                alt={profile.fullName}
              />
              <div className="flex gap-2 flex-wrap">
                {isOwn ? (
                  <button onClick={() => navigate('/create-profile')}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition">
                    <FaEdit size={14} /> Edit Profile
                  </button>
                ) : (
                  <>
                    {reqStatus === 'pending' ? (
                      <span className="text-sm text-yellow-600 bg-yellow-50 px-4 py-2 rounded-xl font-semibold">
                        Request Sent ⏳
                      </span>
                    ) : (
                      <button onClick={sendRequest}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition">
                        <FaEnvelope size={14} /> Connect
                      </button>
                    )}
                    <button onClick={blockUser}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-600 rounded-xl text-sm font-semibold hover:bg-red-50 hover:text-red-500 transition">
                      <FaBan size={14} /> Block
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Name & Info */}
            <div className="mb-4">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-2xl font-black text-gray-800">{profile.fullName}</h2>
                {profile.isAdmin && (
                  <span className="bg-yellow-400 text-black text-xs px-2 py-0.5 rounded-full font-bold">ADMIN</span>
                )}
              </div>
              <p className="text-indigo-600 font-semibold text-sm mt-1">
                {profile.college} {profile.year && `• ${profile.year} Year`}
              </p>
              {profile.bio && <p className="text-gray-600 mt-2 text-sm">{profile.bio}</p>}

              <div className="flex gap-4 mt-2 flex-wrap text-sm text-gray-500">
                {profile.city && <span>📍 {profile.city}{profile.state && `, ${profile.state}`}</span>}
                {profile.education && <span>🎓 {profile.education}</span>}
              </div>
            </div>

            {/* Stats */}
            <div className="flex gap-6 py-4 border-t border-b border-gray-100 mb-4">
              <div className="text-center">
                <p className="text-xl font-black text-indigo-700">{totalUploads}</p>
                <p className="text-xs text-gray-500">Total Uploads</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-black text-indigo-700">{uploadedNotes.length}</p>
                <p className="text-xs text-gray-500">Notes</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-black text-indigo-700">{uploadedSyllabus.length}</p>
                <p className="text-xs text-gray-500">Syllabus</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-black text-indigo-700">{uploadedQPapers.length}</p>
                <p className="text-xs text-gray-500">Q Papers</p>
              </div>
            </div>

            {/* Skills */}
            {profile.skills?.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {profile.skills.map(s => (
                  <span key={s} className="bg-indigo-100 text-indigo-700 text-xs px-3 py-1 rounded-full font-semibold">{s}</span>
                ))}
              </div>
            )}

            {/* Social Links */}
            <div className="flex gap-4">
              {profile.linkedin && (
                <a href={profile.linkedin} target="_blank" rel="noreferrer"
                  className="flex items-center gap-1 text-blue-600 text-sm font-semibold hover:underline">
                  <FaLinkedin size={18} /> LinkedIn
                </a>
              )}
              {profile.github && (
                <a href={profile.github} target="_blank" rel="noreferrer"
                  className="flex items-center gap-1 text-gray-800 text-sm font-semibold hover:underline">
                  <FaGithub size={18} /> GitHub
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Uploads Tabs */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="flex border-b border-gray-100">
            {[
              { key: 'notes', label: `Notes (${uploadedNotes.length})` },
              { key: 'syllabus', label: `Syllabus (${uploadedSyllabus.length})` },
              { key: 'qpapers', label: `Q Papers (${uploadedQPapers.length})` },
            ].map(tab => (
              <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                className={`flex-1 py-3 text-sm font-semibold transition-all ${
                  activeTab === tab.key
                    ? 'text-indigo-600 border-b-2 border-indigo-600'
                    : 'text-gray-500 hover:text-indigo-500'
                }`}>
                {tab.label}
              </button>
            ))}
          </div>

          <div className="p-4 space-y-3">
            {activeTab === 'notes' && (
              uploadedNotes.length === 0 ? (
                <p className="text-center text-gray-400 py-8">No notes uploaded yet.</p>
              ) : uploadedNotes.map(n => (
                <div key={n._id} className="flex justify-between items-center p-3 bg-gray-50 rounded-xl hover:bg-indigo-50 transition">
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">{n.subject} — {n.year} Year</p>
                    {n.topic && <p className="text-xs text-indigo-500">Topic: {n.topic}</p>}
                  </div>
                  <a href={n.fileUrl} target="_blank" rel="noreferrer"
                    className="text-xs bg-indigo-600 text-white px-3 py-1.5 rounded-lg font-semibold hover:bg-indigo-700">
                    View
                  </a>
                </div>
              ))
            )}

            {activeTab === 'syllabus' && (
              uploadedSyllabus.length === 0 ? (
                <p className="text-center text-gray-400 py-8">No syllabus uploaded yet.</p>
              ) : uploadedSyllabus.map(s => (
                <div key={s._id} className="flex justify-between items-center p-3 bg-gray-50 rounded-xl hover:bg-indigo-50 transition">
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">{s.college} — {s.year} Year</p>
                    {s.description && <p className="text-xs text-gray-500">{s.description}</p>}
                  </div>
                  <a href={s.fileUrl} target="_blank" rel="noreferrer"
                    className="text-xs bg-indigo-600 text-white px-3 py-1.5 rounded-lg font-semibold hover:bg-indigo-700">
                    View
                  </a>
                </div>
              ))
            )}

            {activeTab === 'qpapers' && (
              uploadedQPapers.length === 0 ? (
                <p className="text-center text-gray-400 py-8">No question papers uploaded yet.</p>
              ) : uploadedQPapers.map(q => (
                <div key={q._id} className="flex justify-between items-center p-3 bg-gray-50 rounded-xl hover:bg-indigo-50 transition">
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">{q.subject} — {q.year} Year ({q.examYear})</p>
                    {q.description && <p className="text-xs text-gray-500">{q.description}</p>}
                  </div>
                  <a href={q.fileUrl} target="_blank" rel="noreferrer"
                    className="text-xs bg-indigo-600 text-white px-3 py-1.5 rounded-lg font-semibold hover:bg-indigo-700">
                    View
                  </a>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;