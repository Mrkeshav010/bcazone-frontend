import { useState } from 'react';
import Navbar from '../components/Navbar';
import api from '../utils/api';
import toast from 'react-hot-toast';

const FindQPapers = () => {
  const [year, setYear] = useState('');
  const [subject, setSubject] = useState('');
  const [examYear, setExamYear] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const search = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/questionpapers?year=${year}&subject=${subject}&examYear=${examYear}`);
      setResults(data);
    } catch { toast.error('Error'); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-4xl mx-auto py-10 px-4">
        <h2 className="text-2xl font-bold text-blue-700 mb-6">Previous Question Papers</h2>
        <div className="flex gap-3 mb-8 flex-wrap">
          <select className="input w-auto" value={year} onChange={e => setYear(e.target.value)}>
            <option value="">BCA Year</option>
            <option value="1st">1st Year</option>
            <option value="2nd">2nd Year</option>
            <option value="3rd">3rd Year</option>
          </select>
          <input className="input flex-1" placeholder="Subject name..." value={subject}
            onChange={e => setSubject(e.target.value)} />
          <input className="input w-36" placeholder="Exam Year e.g. 2023" value={examYear}
            onChange={e => setExamYear(e.target.value)} />
          <button className="btn-primary" onClick={search}>Search</button>
        </div>
        <div className="space-y-4">
          {results.map(p => (
            <div key={p._id} className="card flex justify-between items-center">
              <div>
                <h3 className="font-bold text-lg">{p.subject} — {p.year} Year ({p.examYear})</h3>
                {p.description && <p className="text-sm text-gray-500">{p.description}</p>}
                <p className="text-xs text-gray-400">College: {p.college} | By: {p.uploadedBy?.fullName}</p>
              </div>
              <a href={p.fileUrl} target="_blank" rel="noreferrer" className="btn-primary text-sm">View</a>
            </div>
          ))}
          {!loading && results.length === 0 && <p className="text-center text-gray-400">No papers found.</p>}
        </div>
      </div>
    </div>
  );
};

export default FindQPapers;
