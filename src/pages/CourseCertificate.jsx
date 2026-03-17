import { useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

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

const CourseCertificate = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [showCert, setShowCert] = useState(false);
  const certRef = useRef();
  const courseTitle = COURSE_TITLES[courseId] || courseId;
  const score = localStorage.getItem(`course_${courseId}_score`) || '75';
  const today = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

  const generateCert = () => {
    if (!name.trim()) { alert('Please enter your full name!'); return; }
    setShowCert(true);
  };

  const downloadCert = () => {
    const content = certRef.current;
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>BCAzone Certificate — ${name}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: 'Georgia', serif; background: white; }
            @media print { body { print-color-adjust: exact; -webkit-print-color-adjust: exact; } }
          </style>
        </head>
        <body>${content.innerHTML}</body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => printWindow.print(), 500);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-3xl mx-auto py-10 px-4">

        {!showCert ? (
          <div className="card text-center">
            <div className="text-6xl mb-4">🏆</div>
            <h2 className="text-2xl font-black text-indigo-700 mb-2">Collect Your Certificate</h2>
            <p className="text-gray-500 mb-6">Enter your full name as it should appear on the certificate</p>
            <input
              className="input w-full max-w-md mx-auto block mb-4 text-center text-lg font-semibold"
              placeholder="Enter your full name..."
              value={name}
              onChange={e => setName(e.target.value)}
            />
            <button onClick={generateCert}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-bold text-lg transition-all">
              Generate Certificate 🎓
            </button>
          </div>
        ) : (
          <div>
            <div className="flex justify-end mb-4 gap-3">
              <button onClick={() => setShowCert(false)}
                className="px-4 py-2 bg-gray-200 rounded-xl text-sm font-semibold">
                ← Edit Name
              </button>
              <button onClick={downloadCert}
                className="px-6 py-2 bg-indigo-600 text-white rounded-xl text-sm font-semibold">
                📥 Download Certificate
              </button>
            </div>

            {/* Certificate */}
            <div ref={certRef}>
              <div style={{
                background: 'linear-gradient(135deg, #fdf6e3, #fff8dc)',
                border: '12px solid #4f46e5',
                borderRadius: '16px',
                padding: '60px 50px',
                textAlign: 'center',
                position: 'relative',
                boxShadow: '0 20px 60px rgba(0,0,0,0.15)'
              }}>
                {/* Top decoration */}
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '8px', background: 'linear-gradient(90deg, #4f46e5, #7c3aed, #4f46e5)' }} />

                {/* Logo */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '24px' }}>
                  <div style={{ width: '50px', height: '50px', background: '#4f46e5', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ color: 'white', fontWeight: 900, fontSize: '14px' }}>BCA</span>
                  </div>
                  <span style={{ fontSize: '28px', fontWeight: 900, color: '#4f46e5', fontFamily: 'Georgia, serif' }}>BCAzone</span>
                </div>

                <p style={{ fontSize: '14px', letterSpacing: '4px', color: '#7c3aed', textTransform: 'uppercase', marginBottom: '16px' }}>
                  Certificate of Completion
                </p>

                <p style={{ fontSize: '16px', color: '#6b7280', marginBottom: '8px' }}>This is to certify that</p>

                <h1 style={{ fontSize: '42px', fontWeight: 900, color: '#1e1b4b', fontFamily: 'Georgia, serif', borderBottom: '3px solid #4f46e5', display: 'inline-block', paddingBottom: '8px', marginBottom: '16px' }}>
                  {name}
                </h1>

                <p style={{ fontSize: '16px', color: '#6b7280', marginBottom: '8px' }}>has successfully completed the course</p>

                <h2 style={{ fontSize: '28px', fontWeight: 900, color: '#4f46e5', marginBottom: '8px' }}>
                  {courseTitle}
                </h2>

                <p style={{ fontSize: '14px', color: '#9ca3af', marginBottom: '32px' }}>
                  Score: {score}/100 • Date: {today}
                </p>

                {/* Seal */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '40px' }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ width: '120px', borderTop: '2px solid #4f46e5', paddingTop: '8px', fontSize: '12px', color: '#6b7280' }}>
                      BCAzone Platform
                    </div>
                  </div>
                  <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 15px rgba(79,70,229,0.4)' }}>
                    <span style={{ color: 'white', fontSize: '28px' }}>🏆</span>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ width: '120px', borderTop: '2px solid #4f46e5', paddingTop: '8px', fontSize: '12px', color: '#6b7280' }}>
                      {today}
                    </div>
                  </div>
                </div>

                <p style={{ fontSize: '11px', color: '#9ca3af', marginTop: '24px' }}>
                  bcazone-frontend.vercel.app • Issued by BCAzone AI Platform
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseCertificate;