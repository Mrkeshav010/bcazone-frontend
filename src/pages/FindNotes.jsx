import { useState } from 'react';
import Navbar from '../components/Navbar';
import api from '../utils/api';
import toast from 'react-hot-toast';

const BCA_VIDEOS = {
  default: [
    { id: 'xkjELLEM6Uo', title: 'Data Structures Full Course', channel: "Jenny's Lectures" },
    { id: 'RBSGKlAvoiM', title: 'Data Structures & Algorithms', channel: 'freeCodeCamp' },
    { id: 'zg9ih6SVACc', title: 'C Programming Full Course', channel: 'freeCodeCamp' },
    { id: 'KJgsSFOSQv0', title: 'C++ Full Course', channel: 'freeCodeCamp' },
    { id: 'rfscVS0vtbw', title: 'Learn Python Full Course', channel: 'freeCodeCamp' },
    { id: 'Ke90Tje7VS0', title: 'React JS Full Course', channel: 'freeCodeCamp' },
  ],
  'data structures': [
    { id: 'RBSGKlAvoiM', title: 'Data Structures Full Course', channel: 'freeCodeCamp' },
    { id: 'B31LgI4Y4DQ', title: 'Data Structures Easy to Advanced', channel: 'freeCodeCamp' },
    { id: 'pkYVOmU3MgA', title: 'Linked List | Data Structures', channel: "Jenny's Lectures" },
    { id: 'pYT9F8_LFTM', title: 'Stack Data Structure', channel: "Jenny's Lectures" },
    { id: 'haivV8_SgkE', title: 'Queue Data Structure', channel: "Jenny's Lectures" },
    { id: 'oSWTXtMglKE', title: 'Binary Tree Data Structure', channel: "Jenny's Lectures" },
  ],
  'dbms': [
    { id: 'T7AxowNQG_M', title: 'DBMS Full Course', channel: 'Gate Smashers' },
    { id: 'kBdlM6hNDAE', title: 'Database Management System', channel: 'Gate Smashers' },
    { id: 'ztHopE5bqbE', title: 'SQL Full Course', channel: 'freeCodeCamp' },
    { id: 'HXV3zeQKqGY', title: 'SQL Tutorial Full Course', channel: 'freeCodeCamp' },
    { id: 'p3qvj9hO_Bo', title: 'MySQL Tutorial for Beginners', channel: 'Programming with Mosh' },
    { id: '7S_tz1z_5bA', title: 'MySQL Tutorial', channel: 'Programming with Mosh' },
  ],
  'operating system': [
    { id: 'mXw9ruZaxzw', title: 'Operating System Full Course', channel: 'Gate Smashers' },
    { id: 'vBURTt97EkA', title: 'OS Full Course - Process Management', channel: 'Gate Smashers' },
    { id: 'GjNp0bBcjyQ', title: 'Operating Systems Crash Course', channel: 'Crash Course' },
    { id: 'qlH4-oHnBb8', title: 'Process Synchronization', channel: 'Gate Smashers' },
    { id: 'LSkjN4bBCU8', title: 'Memory Management in OS', channel: 'Gate Smashers' },
    { id: 'Qkbguf79bKU', title: 'CPU Scheduling Algorithms', channel: 'Gate Smashers' },
  ],
  'networking': [
    { id: 'qiQR5rTSshw', title: 'Computer Networks Full Course', channel: 'Gate Smashers' },
    { id: 'IPvYjXCsTg8', title: 'Computer Networking Course', channel: 'freeCodeCamp' },
    { id: '3QhU9jd03a0', title: 'TCP/IP Model Explained', channel: 'Gate Smashers' },
    { id: 'AEaKrq3SpW8', title: 'Subnetting Explained', channel: 'PowerCert' },
    { id: 'OxiY4yf6GGg', title: 'Network Protocols Explained', channel: 'Gate Smashers' },
    { id: 'keeqnciDVOo', title: 'OSI Model Explained', channel: 'TechTerms' },
  ],
  'c programming': [
    { id: 'KJgsSFOSQv0', title: 'C Programming Full Course', channel: 'freeCodeCamp' },
    { id: 'zg9ih6SVACc', title: 'C Programming Tutorial', channel: 'freeCodeCamp' },
    { id: 'e9Eds2Rc_x8', title: 'C Programming Pointers', channel: "Jenny's Lectures" },
    { id: 'zuegQmMdy8M', title: 'C Programming Arrays', channel: "Jenny's Lectures" },
    { id: 'mUQZ1qmKlLg', title: 'C Programming Functions', channel: "Jenny's Lectures" },
    { id: 'Bz4MxDeEM6k', title: 'C Programming Strings', channel: "Jenny's Lectures" },
  ],
  'python': [
    { id: 'rfscVS0vtbw', title: 'Python Full Course for Beginners', channel: 'freeCodeCamp' },
    { id: '_uQrJ0TkZlc', title: 'Python Tutorial Full Course', channel: 'Programming with Mosh' },
    { id: 'kqtD5dpn9C8', title: 'Python for Beginners', channel: 'Programming with Mosh' },
    { id: 'ZDa-Z5JzLYM', title: 'Python OOP Tutorial', channel: 'Corey Schafer' },
    { id: 'HGOBQPFzWKo', title: 'Python Django Full Course', channel: 'freeCodeCamp' },
    { id: 'Z1RJmh_OqeA', title: 'Learn Python', channel: 'freeCodeCamp' },
  ],
  'java': [
    { id: 'eIrMbAQSU34', title: 'Java Full Course', channel: 'Programming with Mosh' },
    { id: 'grEKMHGYyns', title: 'Java Tutorial for Beginners', channel: 'Programming with Mosh' },
    { id: 'A74TOX803D0', title: 'Java OOP Concepts', channel: 'Programming with Mosh' },
    { id: 'GoXwIVyNvX0', title: 'Java Collections Framework', channel: "Jenny's Lectures" },
    { id: 'xk4_1vDrzzo', title: 'Java Multithreading', channel: "Jenny's Lectures" },
    { id: 'Ae-r8hsbPUo', title: 'Java Exception Handling', channel: "Jenny's Lectures" },
  ],
};

const PDF_SOURCES = [
  { name: 'GeeksForGeeks', desc: 'Best CS notes with examples & code', icon: '💻', color: 'bg-green-50 border-green-200', btn: 'bg-green-600',
    getUrl: (s) => `https://www.geeksforgeeks.org/${s.toLowerCase().replace(/ /g, '-')}` },
  { name: 'JavaTPoint', desc: 'Complete BCA subject tutorials', icon: '📖', color: 'bg-orange-50 border-orange-200', btn: 'bg-orange-500',
    getUrl: (s) => `https://www.javatpoint.com/${s.toLowerCase().replace(/ /g, '-')}` },
  { name: 'TutorialsPoint', desc: 'Free programming & CS tutorials', icon: '📝', color: 'bg-blue-50 border-blue-200', btn: 'bg-blue-600',
    getUrl: (s) => `https://www.tutorialspoint.com/${s.toLowerCase().replace(/ /g, '_')}` },
  { name: 'W3Schools', desc: 'Easy programming tutorials', icon: '🌐', color: 'bg-purple-50 border-purple-200', btn: 'bg-purple-600',
    getUrl: () => `https://www.w3schools.com` },
  { name: 'NPTEL', desc: 'Free IIT/NIT lecture notes', icon: '🎓', color: 'bg-indigo-50 border-indigo-200', btn: 'bg-indigo-600',
    getUrl: () => `https://nptel.ac.in/courses` },
  { name: 'IGNOU eGyanKosh', desc: 'Free official BCA study material', icon: '📚', color: 'bg-teal-50 border-teal-200', btn: 'bg-teal-600',
    getUrl: () => `https://egyankosh.ac.in` },
];

const getVideos = (subject, topic) => {
  const key = (subject + ' ' + topic).toLowerCase();
  for (const k of Object.keys(BCA_VIDEOS)) {
    if (k !== 'default' && key.includes(k)) return BCA_VIDEOS[k];
  }
  return BCA_VIDEOS.default;
};

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
  const [videoIds, setVideoIds] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [iframeUrl, setIframeUrl] = useState('');
  const [iframeTitle, setIframeTitle] = useState('');

  const search = async () => {
    if (!subject.trim() && !topic.trim()) { toast.error('Enter subject or topic!'); return; }
    setLoading(true);
    setAiLoading(true);
    setUploadedNotes([]);
    setAiNotes('');
    setSearched(true);
    setActiveTab('ai');
    setVideoIds([]);
    setSelectedVideo(null);
    setIframeUrl('');

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

  const loadVideos = () => {
    const videos = getVideos(subject, topic);
    setVideoIds(videos);
    setSelectedVideo(videos[0]);
    setActiveTab('videos');
  };

  const openSource = (url, name) => {
    setIframeUrl(url);
    setIframeTitle(name);
    setActiveTab('iframe');
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
            {[
              { key: 'ai', label: '🤖 AI Notes', color: 'indigo' },
              { key: 'pdf', label: '📄 PDF Notes', color: 'orange' },
              { key: 'videos', label: '▶️ Video Lectures', color: 'red' },
              { key: 'uploaded', label: `📁 Uploaded ${uploadedNotes.length > 0 ? `(${uploadedNotes.length})` : ''}`, color: 'indigo' },
            ].map(tab => (
              <button key={tab.key}
                onClick={() => tab.key === 'videos' ? loadVideos() : setActiveTab(tab.key)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${activeTab === tab.key || (tab.key === 'pdf' && activeTab === 'iframe')
                  ? `bg-${tab.color}-600 text-white`
                  : `bg-white text-${tab.color}-600 border border-${tab.color}-200`}`}>
                {tab.label}
              </button>
            ))}
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
                  <span className="text-2xl">🤖</span>
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

        {/* PDF Notes Tab */}
        {activeTab === 'pdf' && (
          <div className="card">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">📄</span>
              <h3 className="text-lg font-bold text-orange-600">PDF Study Materials</h3>
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-semibold">BCAzone Curated</span>
            </div>
            <p className="text-gray-500 text-sm mb-6">Best study resources for <strong>{subject} {topic && `— ${topic}`}</strong></p>
            <div className="grid grid-cols-1 gap-3">
              {PDF_SOURCES.map((source, i) => (
                <div key={i} className={`flex items-center justify-between p-4 rounded-xl border-2 ${source.color} hover:shadow-md transition-all`}>
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{source.icon}</span>
                    <div>
                      <p className="font-bold text-gray-800">{source.name}</p>
                      <p className="text-xs text-gray-500">{source.desc}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => openSource(source.getUrl(subject), source.name)}
                    className={`${source.btn} text-white px-4 py-2 rounded-xl text-sm font-semibold hover:opacity-90 transition-all`}>
                    Open →
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Iframe Tab — opens inside BCAzone */}
        {activeTab === 'iframe' && iframeUrl && (
          <div className="rounded-2xl overflow-hidden shadow-lg">
            <div className="bg-indigo-700 text-white px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-lg">📚</span>
                <span className="font-bold text-sm">BCAzone — {iframeTitle}</span>
                <span className="text-xs bg-white text-indigo-700 px-2 py-0.5 rounded-full font-semibold">Study Resource</span>
              </div>
              <button onClick={() => setActiveTab('pdf')}
                className="text-white hover:text-red-300 font-bold text-xl">×</button>
            </div>
            <iframe
              src={iframeUrl}
              width="100%"
              height="650px"
              style={{ border: 0 }}
              title={iframeTitle}
              allowFullScreen
            />
          </div>
        )}

        {/* Video Lectures Tab */}
        {activeTab === 'videos' && (
          <div className="card">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">▶️</span>
              <h3 className="text-lg font-bold text-red-600">Video Lectures</h3>
              <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full font-semibold">BCAzone Picks</span>
            </div>
            <p className="text-gray-500 text-sm mb-4">Best lectures for <strong>{subject} {topic && `— ${topic}`}</strong></p>
            {selectedVideo && (
              <div>
                <div className="rounded-xl overflow-hidden mb-3 shadow-md">
                  <iframe
                    width="100%"
                    height="420"
                    src={`https://www.youtube-nocookie.com/embed/${selectedVideo.id}?rel=0&modestbranding=1`}
                    title={selectedVideo.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    style={{ border: 0 }}
                  />
                </div>
                <p className="font-bold text-gray-800 mb-1">{selectedVideo.title}</p>
                <p className="text-xs text-gray-400 mb-5">📺 {selectedVideo.channel}</p>
                <h4 className="font-semibold text-gray-700 mb-3">More Lectures:</h4>
                <div className="grid grid-cols-1 gap-3">
                  {videoIds.map((video, i) => (
                    <div key={i} onClick={() => setSelectedVideo(video)}
                      className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all border-2 ${selectedVideo.id === video.id ? 'bg-red-50 border-red-400' : 'bg-gray-50 hover:bg-red-50 border-transparent hover:border-red-200'}`}>
                      <div className="relative flex-shrink-0">
                        <img src={`https://img.youtube.com/vi/${video.id}/mqdefault.jpg`}
                          alt={video.title} className="w-28 h-16 rounded-lg object-cover" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="bg-black bg-opacity-50 rounded-full w-8 h-8 flex items-center justify-center">
                            <span className="text-white text-xs">▶</span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-800">{video.title}</p>
                        <p className="text-xs text-gray-400 mt-1">📺 {video.channel}</p>
                      </div>
                    </div>
                  ))}
                </div>
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