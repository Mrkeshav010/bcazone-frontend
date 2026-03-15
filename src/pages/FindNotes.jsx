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

  const openGooglePDF = () => {
    const query = `BCA ${year ? year + ' year' : ''} ${subject} ${topic} notes filetype:pdf`;
    window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, '_blank');
  };

  const openGoogleNotes = () => {
    const query = `BCA ${year ? year + ' year' : ''} ${subject} ${topic} notes site:slideshare.net OR site:scribd.com OR site:studocu.com`;
    window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, '_blank');
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
            <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🤖</span>
                <h3 className="text-lg font-bold text-indigo-700">AI Generated Notes</h3>
              </div>
              {/* PDF & Notes Buttons */}
              <div className="flex gap-2 flex-wrap">
                <button onClick={openGooglePDF}
                  className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all">
                  📄 Find PDF Notes on Google
                </button>
                <button onClick={openGoogleNotes}
                  className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all">
                  📚 Find on Slideshare / Scribd
                </button>
              </div>
            </div>

            {/* Formatted Notes */}
            <div className="text-sm text-gray-700 leading-relaxed space-y-4">
              {aiNotes.split('\n').map((line, i) => {
                if (line.startsWith('## ')) return (
                  <h3 key={i} className="text-lg font-bold text-indigo-700 border-b border-indigo-100 pb-1 mt-4">
                    {line.replace('## ', '')}
                  </h3>
                );
                if (line.startsWith('**') && line.endsWith('**')) return (
                  <p key={i} className="font-semibold text-gray-800">{line.replace(/\*\*/g, '')}</p>
                );
                if (line.match(/^\d+\./)) return (
                  <p key={i} className="ml-4 text-gray-700">{line}</p>
                );
                if (line.startsWith('- ')) return (
                  <p key={i} className="ml-4 text-gray-600">• {line.replace('- ', '')}</p>
                );
                if (line.trim() === '') return <div key={i} className="h-1" />;
                return <p key={i} className="text-gray-700">{line}</p>;
              })}
            </div>
          </div>
        )}

        {/* Uploaded Notes */}
        {searched && (
          <div>
            <h3 className="text-lg font-bold text-gray-700 mb-3">📁 Uploaded Notes by Students</h3>
            <div className="space-y-4">
              {loading && (
                <div className="text-center py-6">
                  <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
                </div>
              )}
              {!loading && uploadedNotes.map(note => (
                <div key={note._id} className="card flex items-start justify-between gap-4 hover:shadow-lg transition-all">
                  <div>
                    <h3 className="font-bold text-lg text-indigo-700">{note.subject} — {note.year} Year</h3>
                    {note.topic && <p className="text-sm text-indigo-500 mt-1">📌 Topic: {note.topic}</p>}
                    {note.description && <p className="text-gray-600 text-sm mt-1">{note.description}</p>}
                    <p className="text-xs text-gray-400 mt-2">Uploaded by: {note.uploadedBy?.fullName} — {note.uploadedBy?.college}</p>
                  </div>
                  <a href={note.fileUrl} target="_blank" rel="noreferrer"
                    className="btn-primary text-sm whitespace-nowrap flex items-center gap-1">
                    📥 View / Download
                  </a>
                </div>
              ))}
              {!loading && uploadedNotes.length === 0 && (
                <div className="text-center py-8 text-gray-400 bg-white rounded-2xl">
                  <p className="text-4xl mb-2">📭</p>
                  <p className="font-medium">No uploaded notes found for this subject.</p>
                  <p className="text-sm mt-1">Be the first to upload notes!</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!searched && (
          <div className="text-center py-16 text-gray-400">
            <p className="text-5xl mb-4">📝</p>
            <p className="font-medium">Enter subject or topic and click Search</p>
            <p className="text-sm mt-1">AI will generate complete notes instantly!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FindNotes;