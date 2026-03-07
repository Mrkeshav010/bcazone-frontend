import { Link } from 'react-router-dom';
import { FaGraduationCap, FaGithub, FaLinkedin, FaEnvelope, FaHeart } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-blue-900 to-blue-800 text-white mt-auto">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="bg-white rounded-xl p-1.5">
                <FaGraduationCap size={22} className="text-blue-700" />
              </div>
              <span className="text-xl font-bold font-heading">BCAzone</span>
            </div>
            <p className="text-blue-200 text-sm leading-relaxed">
              India's #1 platform for BCA students. Notes, Syllabus, Question Papers, Colleges — sab ek jagah.
            </p>
            <div className="flex gap-3 mt-4">
              <a href="https://github.com" target="_blank" rel="noreferrer"
                className="bg-white/10 hover:bg-white/20 p-2 rounded-lg transition">
                <FaGithub size={16} />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer"
                className="bg-white/10 hover:bg-white/20 p-2 rounded-lg transition">
                <FaLinkedin size={16} />
              </a>
              <a href="mailto:admin@bcazone.com"
                className="bg-white/10 hover:bg-white/20 p-2 rounded-lg transition">
                <FaEnvelope size={16} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold font-heading text-sm uppercase tracking-wider text-blue-300 mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {[
                { to: '/find-college', label: 'Find College' },
                { to: '/find-syllabus', label: 'Find Syllabus' },
                { to: '/find-notes', label: 'Find Notes' },
                { to: '/find-qpapers', label: 'Question Papers' },
                { to: '/upload', label: 'Upload Content' },
              ].map(link => (
                <li key={link.to}>
                  <Link to={link.to}
                    className="text-blue-200 hover:text-white text-sm transition flex items-center gap-1.5">
                    <span className="text-blue-400">›</span> {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* About */}
          <div>
            <h4 className="font-bold font-heading text-sm uppercase tracking-wider text-blue-300 mb-4">About</h4>
            <ul className="space-y-2 text-sm text-blue-200">
              <li>🎓 BCA Students ke liye</li>
              <li>📚 Free Study Material</li>
              <li>🏫 College Finder</li>
              <li>💬 Student Community</li>
              <li>🔒 Secure & Private</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-blue-700 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-blue-300 text-sm">
            © 2024 BCAzone. Made with <FaHeart className="inline text-red-400 mx-1" size={12} /> for BCA Students
          </p>
          <p className="text-blue-400 text-xs">All rights reserved</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;