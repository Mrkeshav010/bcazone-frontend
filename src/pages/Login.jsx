import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const hideTimer = useRef(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleShowPass = () => {
    setShowPass(true);
    clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => setShowPass(false), 2000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', form);
      login(data);
      toast.success('Welcome back!');
      if (!data.isProfileComplete) navigate('/create-profile');
      else navigate('/home');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-purple-900 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-indigo-700 mb-6 text-center">Login to BCAzone</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input className="input" type="email" placeholder="Email" value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })} required />

          {/* Password with eye */}
          <div className="relative">
            <input className="input pr-10 w-full"
              type={showPass ? 'text' : 'password'}
              placeholder="Password"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              required />
            <button type="button" onClick={handleShowPass}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-indigo-600 transition">
              {showPass ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
            </button>
          </div>

          <button className="btn-primary w-full text-center py-2" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p className="text-center mt-4 text-sm">
          <Link to="/forgot-password" className="text-indigo-600 hover:underline">Forgot Password?</Link>
        </p>
        <p className="text-center mt-2 text-sm">
          Don't have an account? <Link to="/signup" className="text-indigo-600 font-semibold hover:underline">Sign Up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;