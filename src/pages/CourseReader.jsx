import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api from '../utils/api';
import toast from 'react-hot-toast';

const COURSE_TITLES = {
  'python': 'Python Programming',
  'java': 'Java Programming',
  'c-programming': 'C Programming',
  'cpp': 'C++ Programming',
  'web-development': 'Full Stack Web Development',
  'data-structures': 'Data Structures & Algorithms',
  'data-science': 'Data Science with Python',
  'dsa': 'DSA for Interviews',
  'cybersecurity': 'Cyber Security & Ethical Hacking',
  'android': 'Android App Development',
  'cloud': 'Cloud Computing with AWS/Azure',
  'devops': 'DevOps Engineering',
};

const COURSE_PAGES = {
  'python': 80,
  'java': 85,
  'c-programming': 70,
  'cpp': 75,
  'web-development': 110,
  'data-structures': 90,
  'data-science': 95,
  'dsa': 85,
  'cybersecurity': 80,
  'android': 85,
  'cloud': 75,
  'devops': 75,
};

const CourseReader = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageContent, setPageContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [completedPages, setCompletedPages] = useState(() => {
    const saved = localStorage.getItem(`course_${courseId}_completed`);
    return saved ? JSON.parse(saved) : [];
  });

  const TOTAL_PAGES = COURSE_PAGES[courseId] || 80;
  const courseTitle = COURSE_TITLES[courseId] || courseId;
  const progress = Math.round((completedPages.length / TOTAL_PAGES) * 100);

  useEffect(() => { loadPage(currentPage); }, [currentPage]);

  const loadPage = async (page) => {
    setLoading(true);
    setPageContent('');
    try {
      const { data } = await api.post('/ai/course-page', { courseId, courseTitle, page, totalPages: TOTAL_PAGES });
      setPageContent(data.content);
    } catch {
      toast.error('Could not load page. Try again!');
    } finally {
      setLoading(false);
    }
  };

  const markCompleted = () => {
    if (!completedPages.includes(currentPage)) {
      const updated = [...completedPages, currentPage];
      setCompletedPages(updated);
      localStorage.setItem(`course_${courseId}_completed`, JSON.stringify(updated));
    }
    if (currentPage < TOTAL_PAGES) setCurrentPage(currentPage + 1);
  };

  const allCompleted = completedPages.length >= TOTAL_PAGES;

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-4xl mx-auto py-6 px-4">
        <div className="bg-white rounded-2xl shadow p-4 mb-6">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <button onClick={() => navigate('/courses')} className="text-indigo-600 text-sm font-semibold mb-1">
                Back to Courses
              </button>
              <h2 className="text-xl font-black text-indigo-700">{courseTitle}</h2>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Page {currentPage} of {TOTAL_PAGES}</p>
              <p className="text-xs text-indigo-600 font-semibold">{progress}% Complete</p>
            </div>
          </div>
          <div className="mt-3 bg-gray-200 rounded-full h-2">
            <div className="bg-indigo-600 h-2 rounded-full transition-all" style={{ width: `${progress}%` }} />
          </div>
          <div className="mt-3 flex flex-wrap gap-1">
            {Array.from({ length: TOTAL_PAGES }, (_, i) => i + 1).map(p => (
              <button key={p} onClick={() => setCurrentPage(p)}
                className={`w-7 h-7 rounded-lg text-xs font-bold transition-all ${
                  p === currentPage ? 'bg-indigo-600 text-white' :
                  completedPages.includes(p) ? 'bg-green-500 text-white' :
                  'bg-gray-100 text-gray-600 hover:bg-indigo-100'
                }`}>{p}</button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6">
          <div style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed)' }} className="p-6 text-white">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <span className="text-indigo-600 font-black text-xs">BCA</span>
              </div>
              <span className="font-bold">BCAzone</span>
              <span className="text-xs bg-white bg-opacity-20 px-2 py-1 rounded-full">Course Material</span>
            </div>
            <h3 className="text-xl font-black">{courseTitle}</h3>
            <p className="text-sm opacity-90 mt-1">Page {currentPage} of {TOTAL_PAGES}</p>
          </div>
          <div className="p-6">
            {loading ? (
              <div className="text-center py-16">
                <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-indigo-600 font-medium">Loading page {currentPage}...</p>
              </div>
            ) : (
              <div className="text-sm text-gray-700 leading-relaxed space-y-3">
                {pageContent.split('\n').map((line, i) => {
                  if (line.startsWith('## ')) return <h3 key={i} className="text-lg font-black text-indigo-700 border-b border-indigo-100 pb-2 mt-4">{line.replace('## ', '')}</h3>;
                  if (line.startsWith('### ')) return <h4 key={i} className="text-base font-bold text-gray-800 mt-3">{line.replace('### ', '')}</h4>;
                  if (line.startsWith('```')) return null;
                  if (line.match(/^\d+\./)) return (
                    <div key={i} className="flex gap-2 p-3 bg-indigo-50 rounded-lg">
                      <span className="text-indigo-600 font-bold flex-shrink-0">{line.split('.')[0]}.</span>
                      <p>{line.split('.').slice(1).join('.').trim()}</p>
                    </div>
                  );
                  if (line.startsWith('- ')) return <p key={i} className="ml-4 text-gray-600">• {line.replace('- ', '')}</p>;
                  if (line.includes('=') || line.includes('(') || line.includes('{')) return (
                    <div key={i} className="bg-gray-900 text-green-400 px-4 py-2 rounded-lg font-mono text-xs">{line}</div>
                  );
                  if (line.trim() === '') return <div key={i} className="h-2" />;
                  return <p key={i} className="text-gray-700">{line.replace(/\*\*/g, '')}</p>;
                })}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between gap-3">
          <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}
            className="px-6 py-3 bg-white border-2 border-indigo-200 text-indigo-600 rounded-xl font-semibold disabled:opacity-40 hover:bg-indigo-50 transition-all">
            Previous
          </button>
          <p className="text-sm text-gray-500">{currentPage} / {TOTAL_PAGES}</p>
          {currentPage === TOTAL_PAGES ? (
            allCompleted ? (
              <button onClick={() => navigate(`/courses/${courseId}/exam`)}
                className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold transition-all">
                Get Certificate
              </button>
            ) : (
              <button onClick={markCompleted}
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold transition-all">
                Mark Complete
              </button>
            )
          ) : (
            <button onClick={markCompleted}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold transition-all">
              Next Page
            </button>
          )}
        </div>

        {allCompleted && (
          <div className="mt-6 text-center bg-green-50 border-2 border-green-300 rounded-2xl p-6">
            <p className="text-2xl mb-2">🎉</p>
            <p className="font-bold text-green-700 text-lg">Course Completed!</p>
            <p className="text-gray-500 text-sm mb-4">You have completed all {TOTAL_PAGES} pages!</p>
            <button onClick={() => navigate(`/courses/${courseId}/exam`)}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl font-bold transition-all">
              Take Exam & Get Certificate
            </button>
          </div>
        )}
        <div className="text-center mt-6">
          <p className="text-xs text-gray-400">BCAzone Course Material • AI Generated • For BCA Students</p>
        </div>
      </div>
    </div>
  );
};

export default CourseReader;