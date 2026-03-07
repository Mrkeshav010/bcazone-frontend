import { useState } from 'react';
import Navbar from '../components/Navbar';
import api from '../utils/api';
import toast from 'react-hot-toast';

const FindCollege = () => {
  const [location, setLocation] = useState('');
  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState({});

  const search = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/colleges?location=${location}`);
      setColleges(data);
    } catch { toast.error('Error fetching colleges'); }
    finally { setLoading(false); }
  };

  const submitFeedback = async (id) => {
    try {
      await api.post(`/colleges/${id}/feedback`, feedback[id]);
      toast.success('Feedback submitted!');
    } catch { toast.error('Error'); }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-4xl mx-auto py-10 px-4">
        <h2 className="text-2xl font-bold text-blue-700 mb-6">Find BCA Colleges</h2>
        <div className="flex gap-3 mb-8">
          <input className="input flex-1" placeholder="Enter city or state..." value={location}
            onChange={e => setLocation(e.target.value)} />
          <button className="btn-primary px-6" onClick={search}>Search</button>
        </div>
        {loading && <p className="text-center text-blue-600">Searching...</p>}
        <div className="space-y-4">
          {colleges.map(col => (
            <div key={col._id} className="card">
              <h3 className="text-xl font-bold text-blue-700">{col.name}</h3>
              <p className="text-gray-600">{col.address}, {col.city}, {col.state}</p>
              <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-500">
                {col.affiliation && <span>🏛 {col.affiliation}</span>}
                {col.fees && <span>💰 {col.fees}</span>}
                {col.seats && <span>🪑 Seats: {col.seats}</span>}
                {col.rating > 0 && <span>⭐ {col.rating}/5</span>}
              </div>
              <div className="mt-4 border-t pt-4">
                <p className="font-semibold text-sm mb-2">Leave Feedback</p>
                <input className="input mb-2" placeholder="Your comment..."
                  onChange={e => setFeedback({ ...feedback, [col._id]: { ...feedback[col._id], comment: e.target.value } })} />
                <select className="input mb-2"
                  onChange={e => setFeedback({ ...feedback, [col._id]: { ...feedback[col._id], rating: parseInt(e.target.value) } })}>
                  <option value="">Rate this college</option>
                  {[1,2,3,4,5].map(n => <option key={n} value={n}>{n} ⭐</option>)}
                </select>
                <button className="btn-primary text-sm" onClick={() => submitFeedback(col._id)}>Submit</button>
              </div>
            </div>
          ))}
          {!loading && colleges.length === 0 && <p className="text-center text-gray-400">No colleges found.</p>}
        </div>
      </div>
    </div>
  );
};

export default FindCollege;