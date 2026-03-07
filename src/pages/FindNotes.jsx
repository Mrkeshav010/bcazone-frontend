import { useState } from 'react';
import Navbar from '../components/Navbar';
import api from '../utils/api';
import toast from 'react-hot-toast';

const FindNotes = () => {
  const [mode, setMode] = useState('filter');
  const [year, setYear] = useState('');
  const [subject, setSubject] = useState('');
  const [topic, setTopic] = useState('');
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);

  const search = async () => {
    setLoading(true);
    try {
      let url = mode === 'topic' ? `/notes/topic?topic=${topic}` : `/notes?year=${year}&subject=${subject}`;
      const { data } = await api.get(url);
      setNotes(data);
    } catch { toast.error('Error'); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-4xl mx-auto py-10 px-4">
        <h2 className="text-2xl font-bold text-indigo-700 mb-4">Find Notes</h2>

        <div className="flex gap-3 mb-6">
          <button className={`px-4 py-2 rounded-lg font-medium ${mode === 'filter' ? 'bg-indigo-600 text-white' : 'bg-gray-200'}`}
            onClick={() => setMode('filter')}>By Year & Subject</button>
          <button className={`px-4 py-2 rounded-lg font-medium ${mode === 'topic' ? 'bg-indigo-600 text-white' : 'bg-gray-200'}`}
            onClick={() => setMode('topic')}>By Topic</button>
        </div>

        {mode === 'filter' ? (
          <div className="flex gap-3 mb-6 flex-wrap">
            <select className="input w-auto" value={year} onChange={e => setYear(e.target.value)}>
              <option value="">Select Year</option>
              <option value="1st">1st Year</option>
              <option value="2nd">2nd Year</option>
              <option value="3rd">3rd Year</option>
            </select>
            <input className="input flex-1" placeholder="Subject name..." value={subject}
              onChange={e => setSubject(e.target.value)} />
            <button className="btn-primary" onClick={search}>Search</button>
          </div>
        ) : (
          <div className="flex gap-3 mb-6">
            <input className="input flex-1" placeholder="Enter topic name..." value={topic}
              onChange={e => setTopic(e.target.value)} />
            <button className="btn-primary" onClick={search}>Search</button>
          </div>
        )}

        {loading && <p className="text-indigo-600 text-center">Searching...</p>}

        <div className="space-y-4">
          {notes.map(note => (
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
          {!loading && notes.length === 0 && <p className="text-center text-gray-400">No notes found.</p>}
        </div>
      </div>
    </div>
  );
};

export default FindNotes;