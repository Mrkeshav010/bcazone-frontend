import { useState } from 'react';
import Navbar from '../components/Navbar';
import api from '../utils/api';
import toast from 'react-hot-toast';

const CURRENT_YEAR = new Date().getFullYear();

const FindQPapers = () => {
  const [year, setYear] = useState('');
  const [subject, setSubject] = useState('');
  const [examYear, setExamYear] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [aiPaper, setAiPaper] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [activeTab, setActiveTab] = useState('ai');

  const isValidExamYear = (y) => {
    const num = parseInt(y);
    return !isNaN(num) && num >= 2000 && num < CURRENT_YEAR;
  };

  const search = async () => {
    if (!subject.trim()) { toast.error('Enter subject name!'); return; }
    if (examYear && !isValidExamYear(examYear)) {
      toast.error(`Exam year must be between 2000 and ${CURRENT_YEAR - 1}!`);
      return;
    }
    setLoading(true);
    setAiLoading(true);
    setResults([]);
    setAiPaper('');
    setSearched(true);
    setActiveTab('ai');

    try {
      const { data } = await api.get(`/questionpapers?year=${year}&subject=${subject}&examYear=${examYear}`);
      setResults(data);
    } catch {
      toast.error('Error fetching uploaded papers');
    } finally {
      setLoading(false);
    }

    try {
      const { data } = await api.post('/ai/qpapers', { year, subject, examYear: isValidExamYear(examYear) ? examYear : '' });
      setAiPaper(data.qpaper);
    } catch {
      toast.error('Could not generate question paper. Try again!');
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-4xl mx-auto py-10 px-4">
        <h2 className="text-2xl font-bold text-blue-700 mb-2">Previous Question Papers</h2>
        <p className="text-gray-500 mb-6">AI-powered — Get previous year question papers instantly</p>

        {/* Search Bar */}
        <div className="flex gap-3 mb-8 flex-wrap">
          <select className="input w-auto" value={year} onChange={e => setYear(e.target.value)}>
            <option value="">BCA Year</option>
            <option value="1st">1st Year</option>
            <option value="2nd">2nd Year</option>
            <option value="3rd">3rd Year</option>
          </select>
          <input className="input flex-1" placeholder="Subject name... (e.g. Data Structures)"
            value={subject} onChange={e => setSubject(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && search()} />
          <input
            className="input w-36"
            placeholder="Exam Year e.g. 2023"
            value={examYear}
            maxLength={4}
            onChange={e => {
              const val = e.target.value.replace(/\D/g, '');
              setExamYear(val);
            }} />
          <button className="btn-primary px-6" onClick={search} disabled={aiLoading || loading}>
            {aiLoading || loading ? 'Searching...' : 'Search'}
          </button>
        </div>

        {/* Tabs */}
        {searched && (
          <div className="flex gap-2 flex-wrap mb-6">
            <button onClick={() => setActiveTab('ai')}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${activeTab === 'ai' ? 'bg-blue-600 text-white' : 'bg-white text-blue-600 border border-blue-200'}`}>
              🤖 AI Question Paper
            </button>
            <button onClick={() => setActiveTab('uploaded')}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${activeTab === 'uploaded' ? 'bg-blue-600 text-white' : 'bg-white text-blue-600 border border-blue-200'}`}>
              📁 Uploaded Papers {results.length > 0 && `(${results.length})`}
            </button>
          </div>
        )}

        {/* AI Question Paper Tab */}
        {activeTab === 'ai' && (
          <>
            {aiLoading && (
              <div className="text-center py-10">
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-blue-600 font-medium">AI is generating question paper for you...</p>
              </div>
            )}
            {!aiLoading && aiPaper && (
              <div className="card">
                {/* Header */}
                <div style={{ background: 'linear-gradient(135deg, #1d4ed8, #4f46e5)' }} className="p-6 rounded-xl text-white mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                      <span className="text-blue-600 font-black text-xs">BCA</span>
                    </div>
                    <span className="font-bold">BCAzone</span>
                    <span className="text-xs bg-white bg-opacity-20 px-2 py-1 rounded-full">AI Generated</span>
                  </div>
                  <h3 className="text-xl font-black">{subject} — Question Paper</h3>
                  <p className="text-sm opacity-90 mt-1">
                    Utkal University
                    {year && ` • BCA ${year} Year`}
                    {isValidExamYear(examYear) && ` • Exam Year: ${examYear}`}
                  </p>
                  <div className="flex gap-2 mt-3 flex-wrap text-xs">
                    <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full">📝 Previous Year Pattern</span>
                    <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full">⚡ BCAzone Exclusive</span>
                  </div>
                </div>

                {/* Question Paper Content */}
                <div className="text-sm text-gray-700 leading-relaxed space-y-3">
                  {aiPaper.split('\n').map((line, i) => {
                    if (line.startsWith('## ')) return (
                      <div key={i} className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold text-base mt-4">
                        {line.replace('## ', '')}
                      </div>
                    );
                    if (line.match(/^\d+\./)) return (
                      <div key={i} className="flex gap-2 p-3 bg-gray-50 rounded-lg border-l-4 border-blue-300">
                        <span className="text-blue-600 font-bold flex-shrink-0">{line.split('.')[0]}.</span>
                        <p className="text-gray-700">{line.split('.').slice(1).join('.').trim()}</p>
                      </div>
                    );
                    if (line.startsWith('- ')) return (
                      <p key={i} className="ml-4 text-gray-600">• {line.replace('- ', '')}</p>
                    );
                    if (line.trim() === '') return <div key={i} className="h-2" />;
                    return <p key={i} className="text-gray-700">{line.replace(/\*\*/g, '')}</p>;
                  })}
                </div>

                {/* Footer */}
                <div className="text-center mt-6 pt-4 border-t border-gray-200">
                  <p className="text-xs text-gray-400">Generated by BCAzone AI • bcazone-frontend.vercel.app • For BCA Students</p>
                </div>
              </div>
            )}
          </>
        )}

        {/* Uploaded Papers Tab */}
        {activeTab === 'uploaded' && (
          <div>
            <h3 className="text-lg font-bold text-gray-700 mb-3">📁 Uploaded Question Papers</h3>
            <div className="space-y-4">
              {loading && (
                <div className="text-center py-6">
                  <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
                </div>
              )}
              {!loading && results.map(p => (
                <div key={p._id} className="card flex justify-between items-center hover:shadow-lg transition-all">
                  <div>
                    <h3 className="font-bold text-lg text-blue-700">{p.subject} — {p.year} Year ({p.examYear})</h3>
                    {p.description && <p className="text-sm text-gray-500 mt-1">{p.description}</p>}
                    <p className="text-xs text-gray-400 mt-1">College: {p.college} | By: {p.uploadedBy?.fullName}</p>
                  </div>
                  <a href={p.fileUrl} target="_blank" rel="noreferrer"
                    className="btn-primary text-sm flex items-center gap-1">
                    📥 View
                  </a>
                </div>
              ))}
              {!loading && results.length === 0 && (
                <div className="text-center py-8 text-gray-400 bg-white rounded-2xl">
                  <p className="text-4xl mb-2">📭</p>
                  <p className="font-medium">No uploaded papers found.</p>
                  <p className="text-sm mt-1">Be the first to upload!</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!searched && (
          <div className="text-center py-16 text-gray-400">
            <p className="text-5xl mb-4">📄</p>
            <p className="font-medium">Enter subject name and click Search</p>
            <p className="text-sm mt-1">AI will generate question paper instantly!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FindQPapers;