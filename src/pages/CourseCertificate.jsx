import { useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
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

const COURSE_CODES = {
  'python': 'PY',
  'java': 'JV',
  'c-programming': 'CP',
  'cpp': 'CPP',
  'web-development': 'WD',
  'data-structures': 'DSA',
  'data-science': 'DS',
  'dsa': 'DSI',
  'cybersecurity': 'CS',
  'android': 'AND',
  'cloud': 'CLD',
  'devops': 'DEV',
};

const CourseCertificate = () => {
  const { courseId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [showCert, setShowCert] = useState(false);
  const certRef = useRef();

  const courseTitle = COURSE_TITLES[courseId] || courseId;
  const score = localStorage.getItem(`course_${courseId}_score`) || '75';

  // Auto date
  const today = new Date();
  const dateStr = today.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

  // Auto Certificate ID
  const certId = `BCZ-${today.getFullYear()}-${COURSE_CODES[courseId] || 'CRS'}-${String(Math.floor(Math.random() * 9000) + 1000)}`;

  const generateCert = () => {
    if (!name.trim()) { alert('Please enter your full name!'); return; }
    setShowCert(true);
  };

  const downloadCert = () => {
    const content = certRef.current.innerHTML;
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<title>BCAzone Certificate - ${name}</title>
<link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=EB+Garamond:ital,wght@0,400;0,500;1,400&display=swap" rel="stylesheet">
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  body { background:#2c2c2c; display:flex; justify-content:center; align-items:center; min-height:100vh; font-family:'EB Garamond',serif; }
  @media print {
    body { background:white; }
    .cert-wrapper { width:100%; height:100vh; }
    * { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
  }
</style>
</head>
<body>${content}</body>
</html>`);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => printWindow.print(), 800);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-4xl mx-auto py-10 px-4">
        {!showCert ? (
          <div className="bg-white rounded-2xl shadow-lg p-10 text-center">
            <div className="text-6xl mb-4">🏆</div>
            <h2 className="text-2xl font-black text-indigo-700 mb-2">Collect Your Certificate</h2>
            <p className="text-gray-500 mb-2">{courseTitle}</p>
            <p className="text-gray-400 text-sm mb-6">Enter your full name as it should appear on the certificate</p>
            <input
              className="w-full max-w-md mx-auto block mb-4 px-4 py-3 border-2 border-indigo-200 rounded-xl text-center text-lg font-semibold outline-none focus:border-indigo-500"
              placeholder="Enter your full name..."
              value={name}
              onChange={e => setName(e.target.value)}
            />
            <button onClick={generateCert}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-bold text-lg transition-all">
              Generate Certificate
            </button>
          </div>
        ) : (
          <div>
            {/* Action Buttons */}
            <div className="flex justify-end mb-4 gap-3">
              <button onClick={() => setShowCert(false)}
                className="px-4 py-2 bg-gray-200 rounded-xl text-sm font-semibold hover:bg-gray-300 transition">
                ← Edit Name
              </button>
              <button onClick={downloadCert}
                className="px-6 py-2 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition">
                🖨️ Print / Download
              </button>
            </div>

            {/* Certificate */}
            <div ref={certRef}>
              <div className="cert-wrapper" style={{ width: '960px', margin: '0 auto' }}>
                <style>{`
                  @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=EB+Garamond:ital,wght@0,400;0,500;1,400&display=swap');
                  .cert-outer {
                    background: linear-gradient(145deg,#8b6e58,#6b4e38,#8b6e58);
                    padding: 10px;
                    box-shadow: 0 0 40px rgba(0,0,0,0.6);
                  }
                  .cert-inner {
                    background: linear-gradient(160deg,#c4b09a,#b8a898,#c4b09a);
                    position: relative;
                    overflow: hidden;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    min-height: 680px;
                  }
                  .cert-corner { position:absolute; width:95px; height:75px; opacity:0.5; }
                  .cert-corner.tl { top:6px; left:6px; }
                  .cert-corner.tr { top:6px; right:6px; transform:scaleX(-1); }
                  .cert-corner.bl { bottom:6px; left:6px; transform:scaleY(-1); }
                  .cert-corner.br { bottom:6px; right:6px; transform:scale(-1); }
                  .cert-logo-area { position:absolute; top:12px; left:50%; transform:translateX(-50%); z-index:5; text-align:center; }
                  .cert-logo-box { width:80px; height:80px; background:linear-gradient(135deg,#1e1b4b,#4f46e5); border-radius:14px; display:flex; align-items:center; justify-content:center; margin:0 auto 4px; }
                  .cert-logo-text { font-family:'Cinzel',serif; font-size:16px; font-weight:700; color:white; }
                  .cert-platform { font-family:'Cinzel',serif; font-size:11px; color:#3a2a10; letter-spacing:2px; }
                  .cert-content { margin-top:120px; text-align:center; width:100%; padding:0 90px; flex:1; display:flex; flex-direction:column; align-items:center; }
                  .cert-title { font-family:'Cinzel',serif; font-size:26px; font-weight:700; color:#1a1208; letter-spacing:4px; text-transform:uppercase; margin-bottom:12px; }
                  .cert-subtitle { font-family:'Cinzel',serif; font-size:11px; letter-spacing:5px; color:#3a2a10; text-transform:uppercase; margin-bottom:16px; }
                  .cert-name { font-family:'EB Garamond',serif; font-size:46px; font-weight:500; font-style:italic; color:#1a0808; }
                  .cert-name-line { width:80%; height:1px; background:linear-gradient(to right,transparent,#5a3020,transparent); margin:8px auto 18px; }
                  .cert-body { font-family:'EB Garamond',serif; font-size:15px; color:#2a1a08; line-height:1.9; text-align:center; max-width:700px; }
                  .cert-course { font-family:'Cinzel',serif; font-size:17px; font-weight:600; color:#1a0808; }
                  .cert-meta { font-family:'EB Garamond',serif; font-size:13px; color:#5a3020; margin-top:12px; }
                  .cert-bottom { width:100%; padding:0 80px; display:flex; justify-content:space-between; align-items:flex-end; margin-top:auto; margin-bottom:28px; }
                  .cert-sig { text-align:center; width:200px; }
                  .cert-sig-line { width:100%; height:1px; background:linear-gradient(to right,transparent,#5a3020,transparent); margin-bottom:7px; }
                  .cert-sig-name { font-family:'Cinzel',serif; font-size:11px; font-weight:600; color:#1a0808; margin-bottom:2px; }
                  .cert-sig-role { font-family:'EB Garamond',serif; font-size:12px; color:#3a2010; font-style:italic; }
                  .cert-seal { width:85px; height:85px; background:linear-gradient(135deg,#1e1b4b,#4f46e5); border-radius:50%; display:flex; flex-direction:column; align-items:center; justify-content:center; box-shadow:0 8px 30px rgba(79,70,229,0.5); border:3px solid #c9a84c; position:relative; }
                  .cert-seal::before { content:''; position:absolute; inset:5px; border:1px solid rgba(201,168,76,0.4); border-radius:50%; }
                  .cert-seal-icon { font-size:24px; }
                  .cert-seal-text { font-family:'Cinzel',serif; font-size:7px; color:#ffd700; text-align:center; font-weight:600; margin-top:2px; }
                  .cert-footer-id { position:absolute; bottom:9px; right:80px; font-family:'EB Garamond',serif; font-size:11px; color:#5a3020; opacity:0.65; letter-spacing:1px; }
                  .cert-footer-web { position:absolute; bottom:9px; left:80px; font-family:'EB Garamond',serif; font-size:11px; color:#5a3020; opacity:0.65; }
                `}</style>

                <div className="cert-outer">
                  <div className="cert-inner">

                    {/* Corners */}
                    <div className="cert-corner tl">
                      <svg viewBox="0 0 120 90" fill="none">
                        <path d="M5 85 C5 85 5 5 85 5" stroke="#3a1a08" strokeWidth="2.5" fill="none"/>
                        <path d="M14 85 C14 14 14 14 85 14" stroke="#3a1a08" strokeWidth="1" fill="none" opacity="0.4"/>
                        <circle cx="14" cy="14" r="5" fill="#3a1a08" opacity="0.55"/>
                        <path d="M28 5 Q44 22 38 38 Q54 32 70 5" stroke="#3a1a08" strokeWidth="1.5" fill="none"/>
                        <path d="M5 28 Q22 44 38 38 Q32 54 5 70" stroke="#3a1a08" strokeWidth="1.5" fill="none"/>
                        <circle cx="38" cy="38" r="3.5" fill="#3a1a08" opacity="0.45"/>
                      </svg>
                    </div>
                    <div className="cert-corner tr">
                      <svg viewBox="0 0 120 90" fill="none">
                        <path d="M5 85 C5 85 5 5 85 5" stroke="#3a1a08" strokeWidth="2.5" fill="none"/>
                        <path d="M14 85 C14 14 14 14 85 14" stroke="#3a1a08" strokeWidth="1" fill="none" opacity="0.4"/>
                        <circle cx="14" cy="14" r="5" fill="#3a1a08" opacity="0.55"/>
                      </svg>
                    </div>
                    <div className="cert-corner bl">
                      <svg viewBox="0 0 120 90" fill="none">
                        <path d="M5 85 C5 85 5 5 85 5" stroke="#3a1a08" strokeWidth="2.5" fill="none"/>
                        <path d="M14 85 C14 14 14 14 85 14" stroke="#3a1a08" strokeWidth="1" fill="none" opacity="0.4"/>
                        <circle cx="14" cy="14" r="5" fill="#3a1a08" opacity="0.55"/>
                      </svg>
                    </div>
                    <div className="cert-corner br">
                      <svg viewBox="0 0 120 90" fill="none">
                        <path d="M5 85 C5 85 5 5 85 5" stroke="#3a1a08" strokeWidth="2.5" fill="none"/>
                        <path d="M14 85 C14 14 14 14 85 14" stroke="#3a1a08" strokeWidth="1" fill="none" opacity="0.4"/>
                        <circle cx="14" cy="14" r="5" fill="#3a1a08" opacity="0.55"/>
                      </svg>
                    </div>

                    {/* Logo */}
                    <div className="cert-logo-area">
                      <div className="cert-logo-box">
                        <span className="cert-logo-text">BCA</span>
                      </div>
                      <div className="cert-platform">BCAzone</div>
                    </div>

                    {/* Content */}
                    <div className="cert-content">
                      <div className="cert-title">Certificate of Completion</div>
                      <div className="cert-subtitle">✦ Proudly Presented To ✦</div>
                      <div className="cert-name">{name}</div>
                      <div className="cert-name-line" />
                      <div className="cert-body">
                        This certificate is awarded in recognition of the successful completion of the<br />
                        <span className="cert-course">{courseTitle}</span><br />
                        course offered by <strong>BCAzone</strong>. The recipient has demonstrated<br />
                        dedication, knowledge, and commitment to excellence.
                      </div>
                      <div className="cert-meta">
                        Score: <strong>{score}/100</strong> &nbsp;•&nbsp; Date: <strong>{dateStr}</strong>
                      </div>
                    </div>

                    {/* Bottom */}
                    <div className="cert-bottom">
                      <div className="cert-sig">
                        <div className="cert-sig-line" />
                        <div className="cert-sig-name">BCAzone Platform</div>
                        <div className="cert-sig-role">India's BCA Student Platform</div>
                      </div>

                      <div className="cert-seal">
                        <div className="cert-seal-icon">🏆</div>
                        <div className="cert-seal-text">VERIFIED<br />CERT</div>
                      </div>

                      <div className="cert-sig">
                        <div className="cert-sig-line" />
                        <div className="cert-sig-name">{dateStr}</div>
                        <div className="cert-sig-role">Date of Completion</div>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="cert-footer-web">bcazone-frontend.vercel.app</div>
                    <div className="cert-footer-id">Certificate ID: {certId}</div>

                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseCertificate;