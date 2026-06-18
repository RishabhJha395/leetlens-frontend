import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { FiLock } from 'react-icons/fi';
import axios from 'axios';
import { useProfile } from '../context/ProfileContext';

export const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const { loadRealData } = useProfile();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const res = await axios.patch(`http://localhost:5000/api/v1/auth/reset-password/${token}`, { password });
      
      // Auto login on success
      const { user, tokens } = res.data;
      localStorage.setItem('accessToken', tokens.accessToken);
      if (!user.isVerified) {
        if (user.verificationToken) localStorage.setItem('verificationToken', user.verificationToken);
        if (user.leetcodeUsername) localStorage.setItem('tempLeetcodeUsername', user.leetcodeUsername);
        navigate('/verify');
      } else {
        if (user.leetcodeUsername) {
          localStorage.setItem('leetcodeUsername', user.leetcodeUsername);
          await loadRealData(user.leetcodeUsername);
        }
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] text-center px-4 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-600/20 rounded-full blur-[120px] -z-10" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-slate-900/80 p-8 rounded-2xl border border-slate-800 backdrop-blur-sm shadow-xl"
      >
        <h2 className="text-3xl font-bold mb-2">Reset Password</h2>
        <p className="text-slate-400 mb-6">Create a new secure password for your account.</p>

        {error && <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-lg mb-4 text-sm">{error}</div>}

        <form className="space-y-4 text-left" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">New Password</label>
            <Input icon={FiLock} placeholder="••••••••" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Confirm Password</label>
            <Input icon={FiLock} placeholder="••••••••" type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />
          </div>
          
          <Button className="w-full py-3 mt-6" type="submit" disabled={loading}>
            {loading ? 'Resetting...' : 'Reset Password'}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-400">
          Remembered your password? <Link to="/login" className="text-emerald-400 hover:text-emerald-300 font-medium">Log in</Link>
        </div>
      </motion.div>
    </div>
  );
};
