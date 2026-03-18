import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState, useRef, useEffect } from 'react';
import { FaGraduationCap, FaEnvelope, FaUpload, FaSignOutAlt, FaSearch, FaHome, FaBars, FaTimes, FaBell } from 'react-icons/fa';
import api from '../utils/api';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const searchRef = useRef(null);
  const mobileSearchRef = useRef(null);
  const notifRef = useRef(null);

  const handleLogout = () => { logout(); navigate('/'); };

  const handleSearch = async (val) => {
    setQuery(val);
    if (val.trim().length < 2) { setResults([]); return; }
    try {
      const { data } = await api.get(`/users/search/users?q=${val}`);
      setResults(data);
    } catch { setResults([]); }
  };

  const handleUserClick = (userId) => {
    setSearchOpen(false);
    setMobileSearchOpen(false);
    setMenuOpen(false);
    setQuery('');
    setResults([]);
    navigate(`/profile/${userId}`);
  };

  const fetchNotifications = async () => {
    try {
      const { data } = await api.get('/notifications');
      setNotifications(data);
      setUnreadCount(data.filter(n => !n.read).length);
    } catch { }
  };

  const markAllRead = async () => {
    try {
      await api.put('/notifications/read-all');
      setUnreadCount(0);
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch { }
  };

  const handleNotifClick = async (notif) => {
    try {
      await api.put(`/notifications/${notif._id}/read`);
      setNotifications(prev => prev.map(n => n._id === notif._id ? { ...n, read: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch { }
    setNotifOpen(false);
    if (notif.link) navigate(notif.link);
  };

  useEffect(() => {
    if (user) fetchNotifications();
    const interval = setInterval(() => { if (user) fetchNotifications(); }, 30000);
    return () => clearInterval(interval);
  }, [user]);

  useEffect(() => {
    const handleClick = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchOpen(false); setQuery(''); setResults([]);
      }
      if (mobileSearchRef.current && !mobileSearchRef.current.contains(e.target)) {
        setMobileSearchOpen(false); setQuery(''); setResults([]);
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const SearchResults = () => (
    <>
      {results.length > 0 && (
        <div className="mt-2 space-y-1 max-h-60 overflow-y-auto">
          {results.map(u => (
            <div key={u._id} onClick={() => handleUserClick(u._id)}
              className="flex items-center gap-3 p-2 rounded-xl hover:bg-blue-50 cursor-pointer transition">
              <img src={u.profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(u.fullName || 'U')}&background=1565C0&color=fff`}
                alt={u.fullName} className="w-9 h-9 rounded-full object-cover border-2 border-blue-200" />
              <div>
                <p className="text-sm font-semibold text-blue-800">{u.fullName}</p>
                <p className="text-xs text-gray-400">{u.college || 'BCA Student'}</p>
              </div>
            </div>
          ))}
        </div>
      )}
      {query.length >= 2 && results.length === 0 && (
        <p className="text-xs text-gray-400 mt-2 text-center">No users found</p>
      )}
    </>
  );

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

            {/* Desktop Search */}
            <div className="relative" ref={searchRef}>
              <button onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 rounded-xl hover:bg-blue-50 text-blue-600 transition" title="Search Users">
                <FaSearch size={17} />
              </button>
              {searchOpen && (
                <div className="absolute right-0 top-10 w-72 bg-white border border-blue-100 rounded-2xl shadow-xl z-50 p-3">
                  <input autoFocus type="text" placeholder="Search users by name..."
                    value={query} onChange={e => handleSearch(e.target.value)}
                    className="w-full border border-blue-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-blue-500" />
                  <SearchResults />
                </div>
              )}
            </div>

            {/* Notification Bell */}
            <div className="relative" ref={notifRef}>
              <button onClick={() => { setNotifOpen(!notifOpen); if (!notifOpen) markAllRead(); }}
                className="p-2 rounded-xl hover:bg-blue-50 text-blue-600 transition relative" title="Notifications">
                <FaBell size={17} />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center font-bold">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>
              {notifOpen && (
                <div className="absolute right-0 top-10 w-80 bg-white border border-blue-100 rounded-2xl shadow-xl z-50">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                    <p className="font-bold text-gray-800">Notifications</p>
                    {notifications.length > 0 && (
                      <button onClick={markAllRead} className="text-xs text-blue-600 hover:underline">
                        Mark all read
                      </button>
                    )}
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="text-center py-8 text-gray-400">
                        <p className="text-3xl mb-2">🔔</p>
                        <p className="text-sm">No notifications yet</p>
                      </div>
                    ) : (
                      notifications.map(notif => (
                        <div key={notif._id}
                          onClick={() => handleNotifClick(notif)}
                          className={`flex items-start gap-3 px-4 py-3 cursor-pointer hover:bg-blue-50 transition border-b border-gray-50 ${!notif.read ? 'bg-blue-50' : ''}`}>
                          <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${!notif.read ? 'bg-blue-500' : 'bg-gray-300'}`} />
                          <div>
                            <p className="text-sm text-gray-800">{notif.message}</p>
                            <p className="text-xs text-gray-400 mt-1">
                              {new Date(notif.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {user.isAdmin && (
              <Link to="/admin" className="p-2 rounded-xl hover:bg-yellow-50 text-yellow-600 transition text-xs font-bold">Admin</Link>
            )}
            <Link to={`/profile/${user._id}`} className="flex items-center gap-2 ml-2 bg-blue-50 rounded-xl px-3 py-1.5 hover:bg-blue-100 transition">
              <img src={user.profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullName || 'U')}&background=1565C0&color=fff`}
                alt="profile" className="w-7 h-7 rounded-full object-cover border-2 border-blue-200" />
              <span className="text-sm font-semibold text-blue-800 font-heading hidden lg:block">{user.fullName?.split(' ')[0]}</span>
            </Link>
            <button onClick={handleLogout}
              className="p-2 rounded-xl hover:bg-red-50 text-gray-400 hover:text-red-500 transition ml-1" title="Logout">
              <FaSignOutAlt size={17} />
            </button>
          </div>

          {/* Mobile buttons */}
          <div className="md:hidden flex items-center gap-2">
            <button onClick={() => { setMobileSearchOpen(!mobileSearchOpen); setMenuOpen(false); setNotifOpen(false); }}
              className="p-2 rounded-xl hover:bg-blue-50 text-blue-600">
              <FaSearch size={17} />
            </button>

            {/* Mobile Notification Bell */}
            <div className="relative" ref={notifRef}>
              <button onClick={() => { setNotifOpen(!notifOpen); setMenuOpen(false); setMobileSearchOpen(false); if (!notifOpen) markAllRead(); }}
                className="p-2 rounded-xl hover:bg-blue-50 text-blue-600 relative">
                <FaBell size={17} />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center font-bold">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>
              {notifOpen && (
                <div className="absolute right-0 top-10 w-72 bg-white border border-blue-100 rounded-2xl shadow-xl z-50">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                    <p className="font-bold text-gray-800">Notifications</p>
                    {notifications.length > 0 && (
                      <button onClick={markAllRead} className="text-xs text-blue-600 hover:underline">Mark all read</button>
                    )}
                  </div>
                  <div className="max-h-72 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="text-center py-8 text-gray-400">
                        <p className="text-3xl mb-2">🔔</p>
                        <p className="text-sm">No notifications yet</p>
                      </div>
                    ) : (
                      notifications.map(notif => (
                        <div key={notif._id}
                          onClick={() => handleNotifClick(notif)}
                          className={`flex items-start gap-3 px-4 py-3 cursor-pointer hover:bg-blue-50 transition border-b border-gray-50 ${!notif.read ? 'bg-blue-50' : ''}`}>
                          <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${!notif.read ? 'bg-blue-500' : 'bg-gray-300'}`} />
                          <div>
                            <p className="text-sm text-gray-800">{notif.message}</p>
                            <p className="text-xs text-gray-400 mt-1">
                              {new Date(notif.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            <button className="p-2 rounded-xl hover:bg-blue-50 text-blue-600"
              onClick={() => { setMenuOpen(!menuOpen); setMobileSearchOpen(false); setNotifOpen(false); }}>
              {menuOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </>
      )}

      {/* Mobile Search Bar */}
      {mobileSearchOpen && user && (
        <div className="absolute top-full left-0 right-0 bg-white border-b border-blue-100 shadow-lg md:hidden p-4 z-50" ref={mobileSearchRef}>
          <input autoFocus type="text" placeholder="Search users by name..."
            value={query} onChange={e => handleSearch(e.target.value)}
            className="w-full border border-blue-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-blue-500" />
          <SearchResults />
        </div>
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
            <Link key={item.to} to={item.to} onClick={() => setMenuOpen(false)}
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