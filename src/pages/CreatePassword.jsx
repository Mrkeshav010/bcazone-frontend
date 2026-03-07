import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { FaGraduationCap, FaLock, FaEye, FaEyeSlash, FaCheckCircle } from 'react-icons/fa';

const CreatePassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const strength = password.length === 0 ? 0
    : password.length < 6 ? 1
    : password.length < 10 ? 2
    : /[A-Z]/.test(password) && /[0-9]/.test(password) ? 4 : 3;

  const strengthLabels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
  const strengthColors = ['', 'bg-red-400', 'bg-yellow-400', 'bg-blue-400', 'bg-green-500'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password.length < 6) return toast.error('Password must be at least 6 characters');
    if (password !== confirm) return toast.error('Passwords do not match');
    setLoading(true);
    try {
      await api.post(`/auth/reset-password/${token}`, { password });
      setSuccess(true);
      toast.success('Password reset successfully!');
      setTimeout(() => navigate('/login'), 2500);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Token expired or invalid');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 flex items-center justify-center px-4">

      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-600/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl" />
      </div>

      <div className="relative bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md fade-up">

        {/* Logo */}
        <div className="flex justify-center mb-6">
          <div className="bg-blue-50 border-2 border-blue-100 rounded-2xl p-3 flex items-center gap-2">
            <FaGraduationCap size={26} className="text-blue-700" />
            <span className="font-bold text-blue-800 text-lg font-heading">BCAzone</span>
          </div>
        </div>

        {success ? (
          <div className="text-center py-6">
            <FaCheckCircle size={56} className="text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-blue-900 font-heading mb-2">Password Reset!</h2>
            <p className="text-gray-500 mb-4">Redirecting to login page...</p>
            <div className="w-full bg-gray-100 rounded-full h-1.5">
              <div className="bg-green-500 h-1.5 rounded-full animate-pulse" style={{ width: '70%' }} />
            </div>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-blue-900 font-heading mb-1">Create New Password</h2>
            <p className="text-gray-400 text-sm mb-6">Enter a strong new password for your BCAzone account</p>

            <form onSubmit={handleSubmit} className="space-y-5">

              {/* New Password */}
              <div>
                <label className="text-sm font-semibold text-blue-800 mb-1 block font-heading">New Password</label>
                <div className="relative">
                  <FaLock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-300" />
                  <input
                    type={showPass ? 'text' : 'password'}
                    className="input pl-9 pr-10"
                    placeholder="Enter new password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                  />
                  <button type="button" onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600">
                    {showPass ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                  </button>
                </div>

                {/* Strength bar */}
                {password && (
                  <div className="mt-2">
                    <div className="flex gap-1 h-1.5 mb-1">
                      {[1,2,3,4].map(i => (
                        <div key={i} className={`flex-1 rounded-full transition-all ${i <= strength ? strengthColors[strength] : 'bg-gray-200'}`} />
                      ))}
                    </div>
                    <p className={`text-xs font-medium ${strength <= 1 ? 'text-red-500' : strength === 2 ? 'text-yellow-500' : strength === 3 ? 'text-blue-500' : 'text-green-600'}`}>
                      {strengthLabels[strength]} password
                    </p>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="text-sm font-semibold text-blue-800 mb-1 block font-heading">Confirm Password</label>
                <div className="relative">
                  <FaLock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-300" />
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    className="input pl-9 pr-10"
                    placeholder="Re-enter new password"
                    value={confirm}
                    onChange={e => setConfirm(e.target.value)}
                    required
                  />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600">
                    {showConfirm ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                  </button>
                </div>
                {confirm && password !== confirm && (
                  <p className="text-red-500 text-xs mt-1">Passwords do not match</p>
                )}
                {confirm && password === confirm && confirm.length > 0 && (
                  <p className="text-green-600 text-xs mt-1 flex items-center gap-1"><FaCheckCircle size={10} /> Passwords match</p>
                )}
              </div>

              <button
                type="submit"
                className="btn-primary w-full py-3 text-base mt-2"
                disabled={loading || password !== confirm}>
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Resetting...
                  </span>
                ) : 'Reset Password'}
              </button>
            </form>

            <p className="text-center text-sm text-gray-400 mt-5">
              Remember your password?{' '}
              <Link to="/login" className="text-blue-600 font-bold hover:underline">Login</Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default CreatePassword;