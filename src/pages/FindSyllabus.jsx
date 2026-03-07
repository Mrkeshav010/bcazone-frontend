import { useState } from 'react';
import Navbar from '../components/Navbar';
import api from '../utils/api';
import toast from 'react-hot-toast';

const FindSyllabus = () => {
  const [college, setCollege] = useState('');
  const [year, setYear] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const search = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/syllabus?college=${college}&year=${year}`);
      setResults(data);
    } catch { toast.error('Error'); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-4xl mx-auto py-10 px-4">
        <h2 className="text-2xl font-bold text-blue-700 mb-6">Find Syllabus</h2>
        <div className="flex gap-3 mb-8 flex-wrap">
          <input className="input flex-1" placeholder="College name..." value={college}
            onChange={e => setCollege(e.target.value)} />
          <select className="input w-auto" value={year} onChange={e => setYear(e.target.value)}>
            <option value="">All Years</option>
            <option value="1st">1st Year</option>
            <option value="2nd">2nd Year</option>
            <option value="3rd">3rd Year</option>
          </select>
          <button className="btn-primary" onClick={search}>Search</button>
        </div>
        <div className="space-y-4">
          {results.map(s => (
            <div key={s._id} className="card flex justify-between items-center">
              <div>
                <h3 className="font-bold text-lg">{s.college} — {s.year} Year</h3>
                {s.description && <p className="text-sm text-gray-500">{s.description}</p>}
                <p className="text-xs text-gray-400">By: {s.uploadedBy?.fullName}</p>
              </div>
              <a href={s.fileUrl} target="_blank" rel="noreferrer" className="btn-primary text-sm">View</a>
            </div>
          ))}
          {!loading && results.length === 0 && <p className="text-center text-gray-400">No syllabus found.</p>}
        </div>
      </div>
    </div>
  );
};

export default FindSyllabus;