import { useState } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

export const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpVerified, setOtpVerified] = useState(false);
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  // STEP 1 — Send OTP
  const sendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/auth/forgot-password', { email });
      setOtpSent(true);
      toast.success('OTP sent to your email!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error sending OTP');
    } finally {
      setLoading(false);
    }
  };

  // STEP 2 — Verify OTP
  const verifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/auth/verify-otp', { email, otp });
      setOtpVerified(true);
      toast.success('OTP verified!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  // STEP 3 — Reset Password
  const resetPassword = async (e) => {
    e.preventDefault();
    if (password !== confirm) return toast.error('Passwords do not match');
    if (password.length < 6) return toast.error('Password must be at least 6 characters');
    setLoading(true);
    try {
      await api.post('/auth/reset-password', { email, otp, password });
      toast.success('Password reset successfully!');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error resetting password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-purple-900 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">

        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <span className="text-2xl">🔐</span>
          </div>
          <h2 className="text-2xl font-bold text-indigo-700">Forgot Password</h2>
          <p className="text-gray-400 text-sm mt-1">
            {!otpSent ? 'Enter your email to receive OTP' :
             !otpVerified ? 'Enter the OTP sent to your email' :
             'Set your new password'}
          </p>
        </div>

        {/* Step indicators */}
        <div className="flex items-center justify-center gap-2 mb-6">
          {['Email', 'OTP', 'Password'].map((step, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                (i === 0 && otpSent) || (i === 1 && otpVerified) || (i === 2 && false)
                  ? 'bg-green-500 text-white'
                  : i === (!otpSent ? 0 : !otpVerified ? 1 : 2)
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-200 text-gray-400'
              }`}>
                {((i === 0 && otpSent) || (i === 1 && otpVerified)) ? '✓' : i + 1}
              </div>
              <span className="text-xs text-gray-500 hidden sm:block">{step}</span>
              {i < 2 && <div className="w-6 h-0.5 bg-gray-200" />}
            </div>
          ))}
        </div>

        {/* STEP 1 — Email */}
        {!otpSent && (
          <form onSubmit={sendOtp} className="space-y-4">
            <input className="input" type="email" placeholder="Enter your email"
              value={email} onChange={e => setEmail(e.target.value)} required />
            <button className="btn-primary w-full py-3" disabled={loading}>
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Sending OTP...
                </span>
              ) : 'Send OTP'}
            </button>
          </form>
        )}

        {/* STEP 2 — OTP */}
        {otpSent && !otpVerified && (
          <form onSubmit={verifyOtp} className="space-y-4">
            <div className="bg-blue-50 rounded-xl p-3 text-center text-sm text-blue-600">
              OTP sent to <strong>{email}</strong>
            </div>
            <input
              className="input text-center text-2xl font-bold tracking-widest"
              placeholder="Enter 6-digit OTP"
              value={otp}
              onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              maxLength={6}
              required
            />
            <button className="btn-primary w-full py-3" disabled={loading || otp.length !== 6}>
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Verifying...
                </span>
              ) : 'Verify OTP'}
            </button>
            <button type="button" onClick={() => setOtpSent(false)}
              className="w-full text-sm text-indigo-600 hover:underline">
              Change email
            </button>
          </form>
        )}

        {/* STEP 3 — New Password */}
        {otpVerified && (
          <form onSubmit={resetPassword} className="space-y-4">
            <div className="bg-green-50 rounded-xl p-3 text-center text-sm text-green-600">
              OTP verified! Set your new password.
            </div>

            <div className="relative">
              <input
                className="input pr-10 w-full"
                type={showPass ? 'text' : 'password'}
                placeholder="New Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
              <button type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-indigo-600">
                {showPass ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
              </button>
            </div>

            <div className="relative">
              <input
                className="input pr-10 w-full"
                type={showConfirm ? 'text' : 'password'}
                placeholder="Confirm New Password"
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                required
              />
              <button type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-indigo-600">
                {showConfirm ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
              </button>
            </div>

            {confirm && password !== confirm && (
              <p className="text-red-500 text-xs">Passwords do not match</p>
            )}

            <button className="btn-primary w-full py-3" disabled={loading}>
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Resetting...
                </span>
              ) : 'Reset Password'}
            </button>
          </form>
        )}

        <p className="text-center text-sm text-gray-400 mt-5">
          Remember your password?{' '}
          <a href="/login" className="text-indigo-600 font-bold hover:underline">Login</a>
        </p>
      </div>
    </div>
  );
};

export const ResetPassword = () => {
  return null;
};