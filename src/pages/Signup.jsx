import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const Signup = () => {
  const [form, setForm] = useState({ fullName: '', email: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const hideTimer1 = useRef(null);
  const hideTimer2 = useRef(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleShowPass = () => {
    setShowPass(true);
    clearTimeout(hideTimer1.current);
    hideTimer1.current = setTimeout(() => setShowPass(false), 2000);
  };

  const handleShowConfirm = () => {
    setShowConfirm(true);
    clearTimeout(hideTimer2.current);
    hideTimer2.current = setTimeout(() => setShowConfirm(false), 2000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) return toast.error('Passwords do not match');
    setLoading(true);
    try {
      const { data } = await api.post('/auth/signup', {
        fullName: form.fullName, email: form.email, password: form.password,
      });
      login(data);
      toast.success('Account created!');
      navigate('/create-profile');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-purple-900 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-indigo-700 mb-6 text-center">Join BCAzone</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input className="input" placeholder="Full Name" value={form.fullName}
            onChange={e => setForm({ ...form, fullName: e.target.value })} required />
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

          {/* Confirm Password with eye */}
          <div className="relative">
            <input className="input pr-10 w-full"
              type={showConfirm ? 'text' : 'password'}
              placeholder="Confirm Password"
              value={form.confirmPassword}
              onChange={e => setForm({ ...form, confirmPassword: e.target.value })}
              required />
            <button type="button" onClick={handleShowConfirm}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-indigo-600 transition">
              {showConfirm ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
            </button>
          </div>

          <button className="btn-primary w-full py-2" disabled={loading}>
            {loading ? 'Creating...' : 'Create Account'}
          </button>
        </form>
        <p className="text-center mt-4 text-sm">
          Already have an account? <Link to="/login" className="text-indigo-600 font-semibold hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;