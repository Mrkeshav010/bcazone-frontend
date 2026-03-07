import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import toast from 'react-hot-toast';

const CreateProfile = () => {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    college: '', year: '', education: '', bio: '',
    city: '', state: '', phone: '', skills: '',
  });
  const [profilePic, setProfilePic] = useState(null);
  const [preview, setPreview] = useState('');
  const [loading, setLoading] = useState(false);

  const handleImg = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePic(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (k === 'skills') {
          formData.append(k, JSON.stringify(
            v.split(',').map(s => s.trim()).filter(Boolean)
          ));
        } else {
          formData.append(k, v);
        }
      });
      if (profilePic) formData.append('profilePic', profilePic);

      const { data } = await api.put('/users/update', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      login({ ...user, ...data, token: user.token, isProfileComplete: true });
      toast.success('Profile saved!');
      navigate('/home');
    } catch (err) {
      toast.error('Failed to save profile');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-3xl font-bold text-blue-700 mb-2">Create Your Profile</h2>
        <p className="text-gray-500 mb-6">Complete your BCAzone profile</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Profile Picture */}
          <div className="flex items-center gap-4 mb-4">
            <img
              src={preview || `https://ui-avatars.com/api/?name=${user?.fullName || 'U'}&background=1565C0&color=fff&size=80`}
              alt="preview"
              className="w-20 h-20 rounded-full object-cover border-4 border-blue-400"
            />
            <label className="btn-secondary cursor-pointer text-sm px-4 py-2">
              Upload Photo
              <input type="file" accept="image/*" onChange={handleImg} className="hidden" />
            </label>
          </div>

          <div>
            <label className="text-sm text-gray-600 font-semibold">Bio</label>
            <textarea className="input mt-1" rows={3} placeholder="About yourself..."
              value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} />
          </div>

          {[
            { key: 'college', label: 'College Name', placeholder: 'e.g. NIIS College' },
            { key: 'education', label: 'Education', placeholder: '12th PCM / Arts...' },
            { key: 'city', label: 'City', placeholder: 'Your City' },
            { key: 'state', label: 'State', placeholder: 'Your State' },
            { key: 'phone', label: 'Phone (optional)', placeholder: '10-digit number' },
            { key: 'skills', label: 'Skills (comma separated)', placeholder: 'C, Java, Python...' },
          ].map(({ key, label, placeholder }) => (
            <div key={key}>
              <label className="text-sm text-gray-600 font-semibold">{label}</label>
              <input className="input mt-1" placeholder={placeholder}
                value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} />
            </div>
          ))}

          <div>
            <label className="text-sm text-gray-600 font-semibold">BCA Year</label>
            <select className="input mt-1" value={form.year}
              onChange={e => setForm({ ...form, year: e.target.value })}>
              <option value="">Select Year</option>
              <option value="1st">1st Year</option>
              <option value="2nd">2nd Year</option>
              <option value="3rd">3rd Year</option>
            </select>
          </div>

          <button className="btn-primary w-full py-3 text-lg" disabled={loading}>
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Saving...
              </span>
            ) : 'Save Profile & Continue'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateProfile;