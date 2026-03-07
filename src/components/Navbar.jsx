import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import { FaGraduationCap, FaEnvelope, FaUpload, FaSignOutAlt, FaSearch, FaHome, FaBars, FaTimes } from 'react-icons/fa';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white border-b border-blue-100 px-6 py-3 flex items-center justify-between shadow-sm sticky top-0 z-50">
      <Link to="/home" className="flex items-center gap-2">
        <div className="bg-blue-700 rounded-xl p-1.5">
          <FaGraduationCap size={20} className="text-white" />
        </div>
        <span className="text-lg font-bold text-blue-800 font-heading">BCA Zone</span>
        {user?.isAdmin && (
          <span className="ml-1 bg-yellow-400 text-black text-xs px-2 py-0.5 rounded-full font-bold">ADMIN</span>
        )}
      </Link>

      {user && (
        <>
          {/* Desktop */}
          <div className="hidden md:flex items-center gap-2">
            <Link to="/home" className="p-2 rounded-xl hover:bg-blue-50 text-blue-600 transition" title="Home">
              <FaHome size={18} />
            </Link>
            <Link to="/messages" className="p-2 rounded-xl hover:bg-blue-50 text-blue-600 transition" title="Messages">
              <FaEnvelope size={18} />
            </Link>
            <Link to="/upload" className="p-2 rounded-xl hover:bg-blue-50 text-blue-600 transition" title="Upload">
              <FaUpload size={18} />
            </Link>
            {user.isAdmin && (
              <Link to="/admin" className="p-2 rounded-xl hover:bg-yellow-50 text-yellow-600 transition text-xs font-bold">
                Admin
              </Link>
            )}
            <Link to={`/profile/${user._id}`} className="flex items-center gap-2 ml-2 bg-blue-50 rounded-xl px-3 py-1.5 hover:bg-blue-100 transition">
              <img
                src={user.profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullName || 'U')}&background=1565C0&color=fff`}
                alt="profile"
                className="w-7 h-7 rounded-full object-cover border-2 border-blue-200"
              />
              <span className="text-sm font-semibold text-blue-800 font-heading hidden lg:block">
                {user.fullName?.split(' ')[0]}
              </span>
            </Link>
            <button onClick={handleLogout}
              className="p-2 rounded-xl hover:bg-red-50 text-gray-400 hover:text-red-500 transition ml-1" title="Logout">
              <FaSignOutAlt size={17} />
            </button>
          </div>

          {/* Mobile */}
          <button className="md:hidden p-2 rounded-xl hover:bg-blue-50 text-blue-600"
            onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </>
      )}

      {/* Mobile Menu */}
      {menuOpen && user && (
        <div className="absolute top-full left-0 right-0 bg-white border-b border-blue-100 shadow-lg md:hidden p-4 space-y-2 z-50">
          {[
            { to: '/home', icon: <FaHome />, label: 'Home' },
            { to: '/messages', icon: <FaEnvelope />, label: 'Messages' },
            { to: '/upload', icon: <FaUpload />, label: 'Upload' },
            { to: `/profile/${user._id}`, icon: null, label: 'My Profile' },
          ].map(item => (
            <Link key={item.to} to={item.to}
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-blue-50 text-blue-700 font-medium">
              {item.icon} {item.label}
            </Link>
          ))}
          <button onClick={handleLogout}
            className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-red-50 text-red-500 font-medium w-full">
            <FaSignOutAlt /> Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;