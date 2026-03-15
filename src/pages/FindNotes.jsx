import { useState } from 'react';
import Navbar from '../components/Navbar';
import api from '../utils/api';
import toast from 'react-hot-toast';

const FindNotes = () => {
  const [year, setYear] = useState('');
  const [subject, setSubject] = useState('');
  const [topic, setTopic] = useState('');
  const [uploadedNotes, setUploadedNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [aiNotes, setAiNotes] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const search = async () => {
    if (!subject.trim() && !topic.trim()) { toast.error('Enter subject or topic!'); return; }
    setLoading(true);
    setAiLoading(true);
    setUploadedNotes([]);
    setAiNotes('');
    setSearched(true);

    // DB search
    try {
      const { data } = await api.get(`/notes?year=${year}&subject=${subject}`);
      setUploadedNotes(data);
    } catch {
      toast.error('Error fetching uploaded notes');
    } finally {
      setLoading(false);
    }

    // AI search
    try {
      const { data } = await api.post('/ai/notes', { year, subject, topic });
      setAiNotes(data.notes);
    } catch {
      setAiNotes('Could not load AI notes.');
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-4xl mx-auto py-10 px-4">
        <h2 className="text-2xl font-bold text-indigo-700 mb-2">Find Notes</h2>
        <p className="text-gray-500 mb-6">AI-powered — Enter subject or topic, get complete notes instantly</p>

        {/* Search Bar */}
        <div className="flex gap-3 mb-8 flex-wrap">
          <select className="input w-auto" value={year} onChange={e => setYear(e.target.value)}>
            <option value="">All Years</option>
            <option value="1st">1st Year</option>
            <option value="2nd">2nd Year</option>
            <option value="3rd">3rd Year</option>
          </select>
          <input className="input flex-1" placeholder="Subject name... (e.g. Data Structures)"
            value={subject} onChange={e => setSubject(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && search()} />
          <input className="input flex-1" placeholder="Topic name... (e.g. Binary Tree)"
            value={topic} onChange={e => setTopic(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && search()} />
          <button className="btn-primary px-6" onClick={search} disabled={aiLoading || loading}>
            {aiLoading || loading ? 'Searching...' : 'Search'}
          </button>
        </div>

        {/* AI Notes Loading */}
        {aiLoading && (
          <div className="text-center py-10">
            <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-indigo-600 font-medium">AI is generating notes for you...</p>
          </div>
        )}

        {/* AI Notes */}
        {!aiLoading && aiNotes && (
          <div className="card mb-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">🤖</span>
              <h3 className="text-lg font-bold text-indigo-700">AI Generated Notes</h3>
            </div>
            <div className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">
              {aiNotes}
            </div>
          </div>
        )}

        {/* Uploaded Notes */}
        {searched && (
          <div>
            <h3 className="text-lg font-bold text-gray-700 mb-3">📁 Uploaded Notes</h3>
            <div className="space-y-4">
              {loading && (
                <div className="text-center py-6">
                  <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
                </div>
              )}
              {!loading && uploadedNotes.map(note => (
                <div key={note._id} className="card flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-bold text-lg">{note.subject} — {note.year} Year</h3>
                    {note.topic && <p className="text-sm text-indigo-500">Topic: {note.topic}</p>}
                    {note.description && <p className="text-gray-600 text-sm">{note.description}</p>}
                    <p className="text-xs text-gray-400 mt-1">By: {note.uploadedBy?.fullName} — {note.uploadedBy?.college}</p>
                  </div>
                  <a href={note.fileUrl} target="_blank" rel="noreferrer"
                    className="btn-primary text-sm whitespace-nowrap">View / Download</a>
                </div>
              ))}
              {!loading && uploadedNotes.length === 0 && (
                <div className="text-center py-6 text-gray-400">
                  <p>No uploaded notes found for this subject.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!searched && (
          <div className="text-center py-16 text-gray-400">
            <p className="text-5xl mb-4">📝</p>
            <p>Enter subject or topic and click Search</p>
            <p className="text-sm mt-1">AI will generate complete notes instantly!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FindNotes;