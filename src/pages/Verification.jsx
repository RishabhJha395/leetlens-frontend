import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '../components/common/Button';
import { FiCopy, FiCheckCircle } from 'react-icons/fi';
import axios from 'axios';
import { useProfile } from '../context/ProfileContext';

export const Verification = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { loadRealData } = useProfile();
  
  const [copied, setCopied] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState('');
  const [leetcodeUsername, setLeetcodeUsername] = useState(localStorage.getItem('tempLeetcodeUsername') || '');
  
  // Get token from localStorage to survive page reloads
  const token = localStorage.getItem('verificationToken') || "LL-XXXXXXXX"; 

  const handleCopy = () => {
    navigator.clipboard.writeText(token);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleVerify = async () => {
    setVerifying(true);
    setError('');
    if (!leetcodeUsername) {
      setError('Please enter your LeetCode username');
      setVerifying(false);
      return;
    }

    try {
      const accessToken = localStorage.getItem('accessToken');
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/v1/auth/verify-leetcode`, 
        { leetcodeUsername }, 
        { 
          withCredentials: true,
          headers: { Authorization: `Bearer ${accessToken}` }
        }
      );
        if (res.data.status === 'success') {
          const username = res.data.user.leetcodeUsername;
          if (username) {
            localStorage.setItem('leetcodeUsername', username);
            await loadRealData(username);
          }
          navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Verification failed. Make sure the token is in your bio.');
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] text-center px-4 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-600/20 rounded-full blur-[120px] -z-10" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg bg-slate-900/80 p-8 rounded-2xl border border-slate-800 backdrop-blur-sm shadow-xl"
      >
        <h2 className="text-3xl font-bold mb-4">Verify Your LeetCode Account</h2>
        <p className="text-slate-400 mb-6">
          To ensure you own the LeetCode profile, please add the following token to your LeetCode Readme section.
        </p>

        {error && <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-lg mb-4 text-sm">{error}</div>}

        <div className="mb-6 text-left">
          <label className="block text-sm font-medium text-slate-400 mb-2">Your LeetCode Username</label>
          <input 
            type="text" 
            value={leetcodeUsername}
            onChange={(e) => setLeetcodeUsername(e.target.value)}
            className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-slate-200 focus:outline-none focus:border-emerald-500 transition-colors"
            placeholder="e.g. neetcode"
          />
          <p className="text-xs text-slate-500 mt-2">Make sure this matches the profile where you placed the token.</p>
        </div>

        <div className="bg-slate-800 p-6 rounded-xl mb-8 flex flex-col items-center">
          <span className="text-sm text-slate-400 mb-2 uppercase tracking-wider font-semibold">Your Verification Token</span>
          <div className="flex items-center gap-4">
            <span className="text-3xl font-mono text-emerald-400 tracking-widest">{token}</span>
            <button 
              onClick={handleCopy}
              className="p-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors text-slate-300"
              title="Copy to clipboard"
            >
              {copied ? <FiCheckCircle className="text-emerald-400" /> : <FiCopy />}
            </button>
          </div>
        </div>

        <div className="text-left space-y-4 mb-8 text-sm text-slate-400">
          <p><strong>Step 1:</strong> Copy the token above.</p>
          <p><strong>Step 2:</strong> Go to your LeetCode profile settings.</p>
          <p><strong>Step 3:</strong> Paste the token into your <em>Readme</em> section and save.</p>
          <p><strong>Step 4:</strong> Click the "Verify My Profile" button below.</p>
        </div>
        
        <Button 
          className="w-full py-4 text-lg font-semibold"
          onClick={handleVerify}
          disabled={verifying}
        >
          {verifying ? "Checking LeetCode Profile..." : "Verify My Profile"}
        </Button>
      </motion.div>
    </div>
  );
};
