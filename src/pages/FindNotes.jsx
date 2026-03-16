import { useState, useRef } from 'react';
import Navbar from '../components/Navbar';
import api from '../utils/api';
import toast from 'react-hot-toast';

const BCA_VIDEOS = {
  default: [
    { id: 'RBSGKlAvoiM', title: 'Data Structures & Algorithms Full Course', channel: 'freeCodeCamp' },
    { id: 'zg9ih6SVACc', title: 'C Programming Full Course', channel: 'freeCodeCamp' },
    { id: 'rfscVS0vtbw', title: 'Learn Python Full Course', channel: 'freeCodeCamp' },
    { id: 'KJgsSFOSQv0', title: 'C++ Full Course', channel: 'freeCodeCamp' },
    { id: 'Ke90Tje7VS0', title: 'React JS Full Course', channel: 'freeCodeCamp' },
    { id: 'eIrMbAQSU34', title: 'Java Full Course', channel: 'Programming with Mosh' },
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
    { id: 'vBURTt97EkA', title: 'OS - Process Management', channel: 'Gate Smashers' },
    { id: 'qlH4-oHnBb8', title: 'Process Synchronization', channel: 'Gate Smashers' },
    { id: 'LSkjN4bBCU8', title: 'Memory Management in OS', channel: 'Gate Smashers' },
    { id: 'Qkbguf79bKU', title: 'CPU Scheduling Algorithms', channel: 'Gate Smashers' },
    { id: 'GjNp0bBcjyQ', title: 'Operating Systems Crash Course', channel: 'Crash Course' },
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
  const [pdfData, setPdfData] = useState(null);
  const [pdfLoading, setPdfLoading] = useState(false);
  const pdfRef = useRef();

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
    setPdfData(null);

    try {
      const { data } = await api.get(`/notes?year=${year}&subject=${subject}`);
      setUploadedNotes(data);
    } catch { toast.error('Error fetching uploaded notes'); }
    finally { setLoading(false); }

    try {
      const { data } = await api.post('/ai/notes', { year, subject, topic });
      setAiNotes(data.notes);
    } catch { setAiNotes('Could not load AI notes.'); }
    finally { setAiLoading(false); }
  };

  const generatePDF = async () => {
    setActiveTab('pdf');
    if (pdfData) return;
    setPdfLoading(true);
    try {
      const { data } = await api.post('/ai/generate-pdf', { year, subject, topic });
      setPdfData(data);
    } catch { toast.error('Could not generate PDF'); }
    finally { setPdfLoading(false); }
  };

  const downloadPDF = () => {
    const content = pdfRef.current;
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>BCAzone — ${pdfData.title}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: 'Segoe UI', Arial, sans-serif; color: #1f2937; background: white; }
            .page { max-width: 800px; margin: 0 auto; padding: 40px; }
            .header { background: linear-gradient(135deg, #4f46e5, #7c3aed); color: white; padding: 30px; border-radius: 12px; margin-bottom: 30px; }
            .header h1 { font-size: 28px; font-weight: bold; margin-bottom: 8px; }
            .header p { font-size: 14px; opacity: 0.9; }
            .badge { display: inline-block; background: rgba(255,255,255,0.2); padding: 4px 12px; border-radius: 20px; font-size: 12px; margin-top: 10px; }
            .intro { background: #f0f9ff; border-left: 4px solid #4f46e5; padding: 16px; border-radius: 8px; margin-bottom: 24px; line-height: 1.7; }
            .section { margin-bottom: 28px; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden; }
            .section-header { background: #4f46e5; color: white; padding: 12px 20px; font-size: 16px; font-weight: bold; }
            .section-body { padding: 20px; }
            .section-body p { line-height: 1.8; color: #374151; margin-bottom: 12px; }
            .code-block { background: #1f2937; color: #a5f3fc; padding: 16px; border-radius: 8px; font-family: monospace; font-size: 13px; white-space: pre-wrap; margin: 12px 0; }
            .diagram { background: #f3f4f6; border: 2px dashed #d1d5db; padding: 16px; border-radius: 8px; font-family: monospace; font-size: 12px; white-space: pre-wrap; margin: 12px 0; }
            .key-points { margin-top: 12px; }
            .key-points li { padding: 6px 0; padding-left: 20px; position: relative; color: #374151; line-height: 1.6; }
            .key-points li::before { content: "✓"; position: absolute; left: 0; color: #4f46e5; font-weight: bold; }
            .questions { background: #fef3c7; border-radius: 12px; padding: 20px; margin-bottom: 24px; }
            .questions h3 { color: #92400e; font-size: 16px; font-weight: bold; margin-bottom: 12px; }
            .questions li { padding: 6px 0; color: #78350f; line-height: 1.6; }
            .summary { background: linear-gradient(135deg, #ecfdf5, #d1fae5); border-radius: 12px; padding: 20px; margin-bottom: 24px; }
            .summary h3 { color: #065f46; font-size: 16px; font-weight: bold; margin-bottom: 10px; }
            .footer { text-align: center; padding: 20px; color: #9ca3af; font-size: 12px; border-top: 1px solid #e5e7eb; margin-top: 30px; }
            @media print { body { print-color-adjust: exact; -webkit-print-color-adjust: exact; } }
          </style>
        </head>
        <body>
          <div class="page">
            ${content.innerHTML}
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => { printWindow.print(); }, 500);
  };

  const loadVideos = () => {
    const videos = getVideos(subject, topic);
    setVideoIds(videos);
    setSelectedVideo(videos[0]);
    setActiveTab('videos');
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
            <button onClick={generatePDF}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${activeTab === 'pdf' ? 'bg-violet-600 text-white' : 'bg-white text-violet-600 border border-violet-200'}`}>
              📥 Download PDF
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

        {/* PDF Generator Tab */}
        {activeTab === 'pdf' && (
          <div>
            {pdfLoading && (
              <div className="text-center py-16">
                <div className="w-16 h-16 border-4 border-violet-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-violet-600 font-bold text-lg">BCAzone AI is creating your PDF...</p>
                <p className="text-gray-400 text-sm mt-2">Generating detailed notes with examples & diagrams</p>
              </div>
            )}
            {!pdfLoading && pdfData && (
              <div>
                {/* Download Button */}
                <div className="flex justify-end mb-4">
                  <button onClick={downloadPDF}
                    className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg transition-all">
                    📥 Download PDF
                  </button>
                </div>

                {/* PDF Preview */}
                <div ref={pdfRef} className="bg-white rounded-2xl shadow-xl overflow-hidden">

                  {/* Header */}
                  <div style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed)' }} className="p-8 text-white">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
                        <span className="text-indigo-600 font-black text-sm">BCA</span>
                      </div>
                      <span className="font-bold text-lg">BCAzone</span>
                      <span className="text-xs bg-white bg-opacity-20 px-3 py-1 rounded-full">AI Generated Notes</span>
                    </div>
                    <h1 className="text-3xl font-black mb-2">{pdfData.title}</h1>
                    <p className="opacity-90">Subject: {pdfData.subject} {pdfData.year && `| Year: ${pdfData.year}`}</p>
                    <div className="flex gap-2 mt-3 flex-wrap">
                      <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-xs">📚 BCA Study Material</span>
                      <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-xs">🎯 Difficulty: {pdfData.difficulty}</span>
                      <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-xs">⚡ BCAzone Exclusive</span>
                    </div>
                  </div>

                  <div className="p-8">
                    {/* Introduction */}
                    <div className="bg-blue-50 border-l-4 border-indigo-500 p-5 rounded-r-xl mb-8">
                      <h3 className="font-bold text-indigo-700 mb-2">📖 Introduction</h3>
                      <p className="text-gray-700 leading-relaxed text-sm">{pdfData.introduction}</p>
                    </div>

                    {/* Sections */}
                    {pdfData.sections?.map((section, i) => (
                      <div key={i} className="mb-8 border border-gray-200 rounded-xl overflow-hidden">
                        <div className="bg-indigo-600 text-white px-6 py-3">
                          <h3 className="font-bold text-base">{i + 1}. {section.heading}</h3>
                        </div>
                        <div className="p-6">
                          <p className="text-gray-700 leading-relaxed text-sm mb-4">{section.content}</p>

                          {section.diagram && (
                            <div className="bg-gray-900 text-green-400 p-4 rounded-xl font-mono text-xs whitespace-pre-wrap mb-4 overflow-x-auto">
                              <p className="text-gray-500 text-xs mb-2">// Diagram</p>
                              {section.diagram}
                            </div>
                          )}

                          {section.code && (
                            <div className="bg-gray-900 text-cyan-300 p-4 rounded-xl font-mono text-xs whitespace-pre-wrap mb-4 overflow-x-auto">
                              <p className="text-gray-500 text-xs mb-2">// Code Example</p>
                              {section.code}
                            </div>
                          )}

                          {section.keyPoints?.length > 0 && (
                            <div className="bg-indigo-50 rounded-xl p-4">
                              <p className="font-semibold text-indigo-700 text-sm mb-2">✅ Key Points:</p>
                              <ul className="space-y-1">
                                {section.keyPoints.map((pt, j) => (
                                  <li key={j} className="text-sm text-gray-700 flex items-start gap-2">
                                    <span className="text-indigo-500 font-bold mt-0.5">→</span> {pt}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}

                    {/* Important Questions */}
                    {pdfData.importantQuestions?.length > 0 && (
                      <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-8">
                        <h3 className="font-bold text-amber-800 text-base mb-4">❓ Important Questions</h3>
                        <ol className="space-y-2">
                          {pdfData.importantQuestions.map((q, i) => (
                            <li key={i} className="text-sm text-amber-900 flex items-start gap-2">
                              <span className="font-bold text-amber-600 flex-shrink-0">Q{i + 1}.</span> {q}
                            </li>
                          ))}
                        </ol>
                      </div>
                    )}

                    {/* Summary */}
                    <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-6">
                      <h3 className="font-bold text-green-800 text-base mb-3">📋 Summary</h3>
                      <p className="text-gray-700 text-sm leading-relaxed">{pdfData.summary}</p>
                    </div>

                    {/* Footer */}
                    <div className="text-center pt-4 border-t border-gray-200">
                      <p className="text-xs text-gray-400">Generated by BCAzone AI • bcazone-frontend.vercel.app • For BCA Students</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
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
                  <iframe width="100%" height="420"
                    src={`https://www.youtube-nocookie.com/embed/${selectedVideo.id}?rel=0&modestbranding=1`}
                    title={selectedVideo.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen style={{ border: 0 }} />
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