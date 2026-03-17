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

const PASS_MARK = 60;

const CourseExam = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState({});
  const [changeCounts, setChangeCounts] = useState({});
  const [lockedAnswers, setLockedAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const courseTitle = COURSE_TITLES[courseId] || courseId;

  useEffect(() => { loadExam(); }, []);

  const loadExam = async () => {
    setLoading(true);
    try {
      const { data } = await api.post('/ai/course-exam', { courseId, courseTitle });
      setQuestions(data.questions);
    } catch {
      toast.error('Could not load exam. Try again!');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (globalIdx, optIdx) => {
    // If locked — do nothing
    if (lockedAnswers[globalIdx]) return;

    const currentAnswer = answers[globalIdx];
    const currentCount = changeCounts[globalIdx] || 0;

    // First time selecting
    if (currentAnswer === undefined) {
      setAnswers(prev => ({ ...prev, [globalIdx]: optIdx }));
      setChangeCounts(prev => ({ ...prev, [globalIdx]: 1 }));
      return;
    }

    // Same answer clicked — do nothing
    if (currentAnswer === optIdx) return;

    // Allow max 2 changes — after 2nd change lock it
    if (currentCount >= 2) {
      // Lock the answer
      setLockedAnswers(prev => ({ ...prev, [globalIdx]: true }));
      toast.error('Answer locked! Maximum 2 changes allowed.');
      return;
    }

    // Change allowed
    setAnswers(prev => ({ ...prev, [globalIdx]: optIdx }));
    setChangeCounts(prev => ({ ...prev, [globalIdx]: currentCount + 1 }));

    // If this is 2nd change — lock after selection
    if (currentCount + 1 >= 2) {
      setLockedAnswers(prev => ({ ...prev, [globalIdx]: true }));
      toast('Answer locked after 2 changes!', { icon: '🔒' });
    }
  };

  const submitExam = () => {
    if (Object.keys(answers).length < questions.length) {
      toast.error('Please answer all questions!');
      return;
    }
    let correct = 0;
    questions.forEach((q, i) => { if (answers[i] === q.correct) correct++; });
    const totalScore = Math.round((correct / questions.length) * 100);
    setScore(totalScore);
    setSubmitted(true);
    localStorage.setItem(`course_${courseId}_score`, totalScore);
  };

  const passed = score >= PASS_MARK;

  if (loading) return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-indigo-600 font-bold text-lg">Preparing your exam...</p>
        <p className="text-gray-400 text-sm mt-1">Generating 50 questions from course content</p>
      </div>
    </div>
  );

  if (submitted) return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-2xl mx-auto py-10 px-4">
        <div className={`card text-center ${passed ? 'border-2 border-green-400' : 'border-2 border-red-400'}`}>
          <div className="text-6xl mb-4">{passed ? '🎉' : '😔'}</div>
          <h2 className="text-2xl font-black mb-2">{passed ? 'Congratulations!' : 'Better Luck Next Time!'}</h2>
          <div className={`text-5xl font-black mb-4 ${passed ? 'text-green-600' : 'text-red-500'}`}>{score}/100</div>
          <p className="text-gray-500 mb-6">
            {passed
              ? `You passed the ${courseTitle} exam! You can now collect your certificate.`
              : `You need ${PASS_MARK}+ marks to pass. You scored ${score}. Please retake the exam.`}
          </p>
          {passed ? (
            <button onClick={() => navigate(`/courses/${courseId}/certificate`)}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl font-bold text-lg transition-all">
              Collect Your Certificate
            </button>
          ) : (
            <button onClick={() => { setSubmitted(false); setAnswers({}); setChangeCounts({}); setLockedAnswers({}); loadExam(); }}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-bold transition-all">
              Retake Exam
            </button>
          )}
        </div>
      </div>
    </div>
  );

  const levels = [
    { label: 'Level 1 - Basic Questions', range: [0, 20], color: 'bg-green-600', desc: '20 Questions • 2 marks each' },
    { label: 'Level 2 - Intermediate Questions', range: [20, 35], color: 'bg-yellow-500', desc: '15 Questions • 2 marks each' },
    { label: 'Level 3 - Advanced Questions', range: [35, 50], color: 'bg-red-600', desc: '15 Questions • 2 marks each' },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-4xl mx-auto py-6 px-4">
        <div style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed)' }} className="rounded-2xl p-6 text-white mb-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <span className="text-indigo-600 font-black text-xs">BCA</span>
            </div>
            <span className="font-bold">BCAzone</span>
            <span className="text-xs bg-white bg-opacity-20 px-2 py-1 rounded-full">Certification Exam</span>
          </div>
          <h2 className="text-2xl font-black">{courseTitle}</h2>
          <p className="text-sm opacity-90 mt-1">50 Questions • 100 Marks • Pass: {PASS_MARK} marks</p>
          <div className="flex gap-2 mt-3 flex-wrap text-xs">
            <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full">Answered: {Object.keys(answers).length}/50</span>
            <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full">No Time Limit</span>
            <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full">🔒 Max 2 changes per question</span>
          </div>
        </div>

        {levels.map(level => (
          <div key={level.label} className="mb-8">
            <div className={`${level.color} text-white px-4 py-3 rounded-xl font-bold mb-4`}>
              {level.label}
              <span className="text-xs font-normal ml-2 opacity-80">{level.desc}</span>
            </div>
            <div className="space-y-4">
              {questions.slice(level.range[0], level.range[1]).map((q, idx) => {
                const globalIdx = level.range[0] + idx;
                const isLocked = lockedAnswers[globalIdx];
                const changeCount = changeCounts[globalIdx] || 0;
                return (
                  <div key={globalIdx} className={`bg-white rounded-xl p-5 shadow-sm border-2 transition-all ${
                    isLocked ? 'border-red-300 bg-red-50' :
                    answers[globalIdx] !== undefined ? 'border-indigo-200' : 'border-transparent'
                  }`}>
                    <div className="flex items-start justify-between mb-3">
                      <p className="font-semibold text-gray-800">
                        <span className="text-indigo-600 font-black">Q{globalIdx + 1}. </span>{q.question}
                      </p>
                      {isLocked && (
                        <span className="ml-2 flex-shrink-0 text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full font-semibold">
                          🔒 Locked
                        </span>
                      )}
                      {!isLocked && changeCount > 0 && (
                        <span className="ml-2 flex-shrink-0 text-xs bg-yellow-100 text-yellow-600 px-2 py-1 rounded-full font-semibold">
                          {2 - changeCount} change{2 - changeCount !== 1 ? 's' : ''} left
                        </span>
                      )}
                    </div>
                    <div className="grid grid-cols-1 gap-2">
                      {q.options.map((opt, optIdx) => (
                        <button key={optIdx}
                          onClick={() => handleAnswer(globalIdx, optIdx)}
                          disabled={isLocked}
                          className={`text-left p-3 rounded-xl border-2 text-sm transition-all ${
                            isLocked && answers[globalIdx] === optIdx
                              ? 'bg-red-500 text-white border-red-500'
                              : answers[globalIdx] === optIdx
                              ? 'bg-indigo-600 text-white border-indigo-600'
                              : isLocked
                              ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                              : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-indigo-300 hover:bg-indigo-50'
                          }`}>
                          <span className="font-bold mr-2">{['A', 'B', 'C', 'D'][optIdx]}.</span>{opt}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        <div className="text-center pb-10">
          <p className="text-gray-500 text-sm mb-4">Answered: {Object.keys(answers).length} / {questions.length} questions</p>
          <button onClick={submitExam}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-12 py-4 rounded-xl font-black text-lg shadow-lg transition-all">
            Submit Exam
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseExam;