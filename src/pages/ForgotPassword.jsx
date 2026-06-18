import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { FiMail } from 'react-icons/fi';
import axios from 'axios';

export const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/v1/auth/forgot-password`, { email }, { withCredentials: true });
      if (res.data.resetURL) {
        setSuccess(
          <div>
            {res.data.message} <br/>
            <Link to={`/reset-password/${res.data.resetURL.split('/').pop()}`} className="text-blue-400 underline mt-2 block">
              Click here to reset password (Dev Link)
            </Link>
          </div>
        );
      } else {
        setSuccess(res.data.message || 'Token sent to email!');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send reset link');
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
        <h2 className="text-3xl font-bold mb-2">Forgot Password</h2>
        <p className="text-slate-400 mb-6">Enter your email and we'll send you a link to reset your password.</p>

        {error && <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-lg mb-4 text-sm">{error}</div>}
        {success && <div className="bg-emerald-500/10 border border-emerald-500/50 text-emerald-400 p-3 rounded-lg mb-4 text-sm">{success}</div>}

        <form className="space-y-4 text-left" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Email</label>
            <Input icon={FiMail} placeholder="your@email.com" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          
          <Button className="w-full py-3 mt-6" type="submit" disabled={loading}>
            {loading ? 'Sending...' : 'Send Reset Link'}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-400">
          Remember your password? <Link to="/login" className="text-emerald-400 hover:text-emerald-300 font-medium">Log in</Link>
        </div>
      </motion.div>
    </div>
  );
};
