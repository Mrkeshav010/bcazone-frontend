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
  const [activeTab, setActiveTab] = useState('ai');
  const [iframeUrl, setIframeUrl] = useState('');
  const [iframeTitle, setIframeTitle] = useState('');
  const [videoIds, setVideoIds] = useState([]);
  const [videoLoading, setVideoLoading] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);

  const search = async () => {
    if (!subject.trim() && !topic.trim()) { toast.error('Enter subject or topic!'); return; }
    setLoading(true);
    setAiLoading(true);
    setUploadedNotes([]);
    setAiNotes('');
    setSearched(true);
    setIframeUrl('');
    setActiveTab('ai');
    setVideoIds([]);
    setSelectedVideo(null);

    try {
      const { data } = await api.get(`/notes?year=${year}&subject=${subject}`);
      setUploadedNotes(data);
    } catch {
      toast.error('Error fetching uploaded notes');
    } finally {
      setLoading(false);
    }

    try {
      const { data } = await api.post('/ai/notes', { year, subject, topic });
      setAiNotes(data.notes);
    } catch {
      setAiNotes('Could not load AI notes.');
    } finally {
      setAiLoading(false);
    }
  };

  const openSlideShare = () => {
    const q = `BCA ${year ? year + ' year' : ''} ${subject} ${topic} notes`;
    setIframeUrl(`https://www.slideshare.net/search/slideshow?searchfrom=header&q=${encodeURIComponent(q)}`);
    setIframeTitle('📄 PDF Notes — SlideShare');
    setActiveTab('iframe');
  };

  const loadVideos = async () => {
    setActiveTab('videos');
    if (videoIds.length > 0) return;
    setVideoLoading(true);
    try {
      const q = `BCA ${year ? year + ' year' : ''} ${subject} ${topic} lecture`;
      const { data } = await api.post('/ai/videos', { query: q });
      setVideoIds(data.videos);
      if (data.videos.length > 0) setSelectedVideo(data.videos[0]);
    } catch {
      toast.error('Could not load videos');
    } finally {
      setVideoLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-5xl mx-auto py-10 px-4">
        <h2 className="text-2xl font-bold text-indigo-700 mb-2">Find Notes</h2>
        <p className="text-gray-500 mb-6">AI-powered — Enter subject or topic, get complete notes instantly</p>

        {/* Search Bar */}
        <div className="flex gap-3 mb-6 flex-wrap">
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

        {/* Tabs */}
        {searched && (
          <div className="flex gap-2 flex-wrap mb-6">
            <button onClick={() => setActiveTab('ai')}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${activeTab === 'ai' ? 'bg-indigo-600 text-white' : 'bg-white text-indigo-600 border border-indigo-200'}`}>
              🤖 AI Notes
            </button>
            <button onClick={openSlideShare}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${activeTab === 'iframe' ? 'bg-red-500 text-white' : 'bg-white text-red-500 border border-red-200'}`}>
              📄 SlideShare Notes
            </button>
            <button onClick={loadVideos}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${activeTab === 'videos' ? 'bg-red-600 text-white' : 'bg-white text-red-600 border border-red-300'}`}>
              ▶️ Video Lectures
            </button>
            <button onClick={() => setActiveTab('uploaded')}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${activeTab === 'uploaded' ? 'bg-indigo-600 text-white' : 'bg-white text-indigo-600 border border-indigo-200'}`}>
              📁 Uploaded Notes {uploadedNotes.length > 0 && `(${uploadedNotes.length})`}
            </button>
          </div>
        )}

        {/* AI Notes Tab */}
        {activeTab === 'ai' && (
          <>
            {aiLoading && (
              <div className="text-center py-10">
                <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-indigo-600 font-medium">AI is generating notes for you...</p>
              </div>
            )}
            {!aiLoading && aiNotes && (
              <div className="card">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-2xl"></span>
                  <h3 className="text-lg font-bold text-indigo-700">AI Generated Notes</h3>
                </div>
                <div className="text-sm text-gray-700 leading-relaxed space-y-3">
                  {aiNotes.split('\n').map((line, i) => {
                    if (line.startsWith('## ')) return (
                      <h3 key={i} className="text-lg font-bold text-indigo-700 border-b border-indigo-100 pb-1 mt-4">
                        {line.replace('## ', '')}
                      </h3>
                    );
                    if (line.match(/^\d+\./)) return <p key={i} className="ml-4 text-gray-700">{line}</p>;
                    if (line.startsWith('- ')) return <p key={i} className="ml-4 text-gray-600">• {line.replace('- ', '')}</p>;
                    if (line.trim() === '') return <div key={i} className="h-1" />;
                    return <p key={i} className="text-gray-700">{line.replace(/\*\*/g, '')}</p>;
                  })}
                </div>
              </div>
            )}
          </>
        )}

        {/* SlideShare Iframe Tab */}
        {activeTab === 'iframe' && iframeUrl && (
          <div className="card p-0 overflow-hidden">
            <div className="bg-red-500 text-white px-4 py-3 flex items-center justify-between">
              <span className="font-semibold text-sm">{iframeTitle}</span>
              <button onClick={() => setActiveTab('ai')}
                className="text-white hover:text-red-200 font-bold text-lg">×</button>
            </div>
            <iframe
              src={iframeUrl}
              width="100%"
              height="600px"
              style={{ border: 0 }}
              title={iframeTitle}
              allowFullScreen
            />
          </div>
        )}

        {/* Video Lectures Tab */}
        {activeTab === 'videos' && (
          <div className="card">
            <h3 className="text-lg font-bold text-red-600 mb-4">▶️ Video Lectures</h3>
            {videoLoading && (
              <div className="text-center py-10">
                <div className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-red-500 font-medium">Loading best video lectures...</p>
              </div>
            )}
            {!videoLoading && selectedVideo && (
              <div>
                {/* Main Video Player */}
                <div className="rounded-xl overflow-hidden mb-4" style={{ height: '400px' }}>
                  <iframe
                    width="100%"
                    height="400"
                    src={`https://www.youtube-nocookie.com/embed/${selectedVideo.id}?autoplay=1&rel=0`}
                    title={selectedVideo.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    style={{ border: 0 }}
                  />
                </div>
                <p className="font-semibold text-gray-800 mb-4">{selectedVideo.title}</p>

                {/* Video List */}
                <div className="grid grid-cols-1 gap-3">
                  {videoIds.map((video, i) => (
                    <div key={i}
                      onClick={() => setSelectedVideo(video)}
                      className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${selectedVideo.id === video.id ? 'bg-red-50 border-2 border-red-400' : 'bg-gray-50 hover:bg-red-50 border-2 border-transparent'}`}>
                      <img src={`https://img.youtube.com/vi/${video.id}/mqdefault.jpg`}
                        alt={video.title} className="w-24 h-16 rounded-lg object-cover" />
                      <div>
                        <p className="text-sm font-medium text-gray-800 line-clamp-2">{video.title}</p>
                        <p className="text-xs text-gray-400 mt-1">{video.channel}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {!videoLoading && videoIds.length === 0 && (
              <div className="text-center py-8 text-gray-400">
                <p className="text-4xl mb-2">📺</p>
                <p>No videos found. Try different subject or topic.</p>
              </div>
            )}
          </div>
        )}

        {/* Uploaded Notes Tab */}
        {activeTab === 'uploaded' && (
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
                    {note.topic && <p className="text-sm text-indigo-500 mt-1"> Topic: {note.topic}</p>}
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