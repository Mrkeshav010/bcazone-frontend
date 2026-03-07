import { useState } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { useParams, useNavigate } from 'react-router-dom';

export const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/auth/forgot-password', { email });
      setSent(true);
      toast.success('Reset email sent!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-purple-900 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-indigo-700 mb-4">Forgot Password</h2>
        {sent ? (
          <p className="text-green-600">Check your email for reset link!</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input className="input" type="email" placeholder="Enter your email" value={email}
              onChange={e => setEmail(e.target.value)} required />
            <button className="btn-primary w-full py-2">Send Reset Link</button>
          </form>
        )}
      </div>
    </div>
  );
};

export const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/auth/reset-password/${token}`, { password });
      toast.success('Password reset! Please login.');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-purple-900 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-indigo-700 mb-4">Reset Password</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input className="input" type="password" placeholder="New Password" value={password}
            onChange={e => setPassword(e.target.value)} required />
          <button className="btn-primary w-full py-2">Reset Password</button>
        </form>
      </div>
    </div>
  );
};