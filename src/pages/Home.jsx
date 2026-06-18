import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { useProfile } from '../context/ProfileContext';
import { FiArrowRight, FiUser } from 'react-icons/fi';

export const Home = () => {
  const navigate = useNavigate();
  const { loadRealData, loading } = useProfile();
  
  const [username, setUsername] = useState('');

  const handleStart = async () => {
    let finalUsername = username.trim();
    if (finalUsername.includes('leetcode.com/u/')) {
      finalUsername = finalUsername.split('leetcode.com/u/')[1].replace('/', '');
    }
    
    await loadRealData(finalUsername);
    navigate('/dashboard');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] text-center px-4 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-600/20 rounded-full blur-[120px] -z-10" />

      <motion.h1 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-5xl md:text-7xl font-bold mb-6 tracking-tight mt-12"
      >
        Your LeetCode Journey,<br />
        <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-emerald-400 bg-clip-text text-transparent">
          Analyzed by AI
        </span>
      </motion.h1>

      <motion.p 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-xl text-slate-400 max-w-2xl mb-10"
      >
        Deep dive into your performance, uncover hidden patterns, and compare your skills with peers using advanced analytics and beautiful visualizations.
      </motion.p>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="w-full max-w-md bg-slate-900/80 p-6 rounded-2xl border border-slate-800 backdrop-blur-sm shadow-xl"
      >
        <div className="space-y-4 text-left">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">LeetCode Username or Profile Link</label>
            <Input 
              icon={FiUser} 
              placeholder="e.g. leet_master or https://leetcode.com/u/leet_master" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && username) {
                  handleStart();
                }
              }}
            />
          </div>
          
          <Button 
            className="w-full py-3 text-lg mt-6" 
            onClick={handleStart} 
            disabled={!username || loading}
          >
            {loading ? "Analyzing Profile..." : (
              <>Analyze Profile <FiArrowRight /></>
            )}
          </Button>

          <div className="pt-4 text-center border-t border-slate-800/50 mt-6">
            <p className="text-slate-400 text-sm">
              <Link to="/login" className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors">Login / Signup</Link> for better analysis
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
