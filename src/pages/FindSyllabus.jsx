import { useState } from 'react';
import Navbar from '../components/Navbar';
import api from '../utils/api';
import toast from 'react-hot-toast';

const FindSyllabus = () => {
  const [college, setCollege] = useState('');
  const [year, setYear] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [aiSyllabus, setAiSyllabus] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const search = async () => {
    if (!college.trim()) { toast.error('College name daalo!'); return; }
    setLoading(true);
    setAiLoading(true);
    setResults([]);
    setAiSyllabus('');
    setSearched(true);

    // DB search
    try {
      const { data } = await api.get(`/syllabus?college=${college}&year=${year}`);
      setResults(data);
    } catch {
      toast.error('Error fetching uploaded syllabus');
    } finally {
      setLoading(false);
    }

    // AI search
    try {
      const { data } = await api.post('/ai/syllabus', { college, year });
      setAiSyllabus(data.syllabus);
    } catch {
      setAiSyllabus('Could not load AI syllabus.');
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-4xl mx-auto py-10 px-4">
        <h2 className="text-2xl font-bold text-blue-700 mb-2">Find Syllabus</h2>
        <p className="text-gray-500 mb-6">AI-powered — College name likho, poora syllabus milega</p>

        <div className="flex gap-3 mb-8 flex-wrap">
          <input className="input flex-1" placeholder="College name... (e.g. Utkal University)"
            value={college} onChange={e => setCollege(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && search()} />
          <select className="input w-auto" value={year} onChange={e => setYear(e.target.value)}>
            <option value="">All Years</option>
            <option value="1st">1st Year</option>
            <option value="2nd">2nd Year</option>
            <option value="3rd">3rd Year</option>
          </select>
          <button className="btn-primary px-6" onClick={search} disabled={aiLoading || loading}>
            {aiLoading || loading ? 'Searching...' : 'Search'}
          </button>
        </div>

        {/* AI Syllabus */}
        {aiLoading && (
          <div className="text-center py-10">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-blue-600 font-medium">AI syllabus dhundh raha hai...</p>
          </div>
        )}

        {!aiLoading && aiSyllabus && (
          <div className="card mb-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">🤖</span>
              <h3 className="text-lg font-bold text-blue-700">AI Generated Syllabus</h3>
              <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">Powered by Groq AI</span>
            </div>
            <div className="prose max-w-none text-sm text-gray-700 whitespace-pre-line leading-relaxed">
              {aiSyllabus}
            </div>
          </div>
        )}

        {/* Uploaded Syllabus */}
        {searched && (
          <div>
            <h3 className="text-lg font-bold text-gray-700 mb-3">📁 Uploaded Syllabus</h3>
            <div className="space-y-4">
              {loading && (
                <div className="text-center py-6">
                  <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
                </div>
              )}
              {!loading && results.map(s => (
                <div key={s._id} className="card flex justify-between items-center">
                  <div>
                    <h3 className="font-bold text-lg">{s.college} — {s.year} Year</h3>
                    {s.description && <p className="text-sm text-gray-500">{s.description}</p>}
                    <p className="text-xs text-gray-400">By: {s.uploadedBy?.fullName}</p>
                  </div>
                  <a href={s.fileUrl} target="_blank" rel="noreferrer" className="btn-primary text-sm">View</a>
                </div>
              ))}
              {!loading && results.length === 0 && (
                <div className="text-center py-6 text-gray-400">
                  <p>No uploaded syllabus found for this college.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {!searched && (
          <div className="text-center py-16 text-gray-400">
            <p className="text-5xl mb-4">📚</p>
            <p>College name likhke Search karo</p>
            <p className="text-sm mt-1">AI turant syllabus dhundh dega!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FindSyllabus;