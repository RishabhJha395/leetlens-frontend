import React from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { FiMail, FiLock } from 'react-icons/fi';
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { useProfile } from '../context/ProfileContext';

export const Login = () => {
  const navigate = useNavigate();
  const { loadRealData } = useProfile();
  
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  const handleSuccess = async (user, tokens) => {
    localStorage.setItem('accessToken', tokens.accessToken);
    if (!user.isVerified) {
      if (user.verificationToken) {
        localStorage.setItem('verificationToken', user.verificationToken);
      }
      navigate('/verify');
    } else {
      if (user.leetcodeUsername) {
        localStorage.setItem('leetcodeUsername', user.leetcodeUsername);
        await loadRealData(user.leetcodeUsername);
      }
      navigate('/dashboard');
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await axios.post('http://localhost:5000/api/v1/auth/login', { email, password }, { withCredentials: true });
      await handleSuccess(res.data.user, res.data.tokens);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const googleLoginAction = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        setLoading(true);
        setError('');
        // Send the access token to our backend as credential (we can verify access token or id token, 
        // since we use useGoogleLogin, we get an access_token. We need to fetch user info from google first 
        // OR we should have used the <GoogleLogin> component which gives credential (idToken).
        // Let's fetch google user info here to pass it, or just use the <GoogleLogin> component.
        // Actually, let's just fetch it here and send to backend as the backend expects Google ID/email.
        // WAIT, I updated backend to expect `credential` (idToken) and verify it.
        // useGoogleLogin implicitly gives access_token. I need to change backend to use `name, email, googleId` 
        // OR use `flow: 'auth-code'` OR use the `GoogleLogin` component.
        // I will just use `axios` to get info from google API and send it, then backend can just accept it 
        // OR I will revert backend to accept `email, name, googleId` for simplicity if I use useGoogleLogin.
        // Let's use `axios` to get user info from Google's endpoint using the access_token.
        const userInfo = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        });
        
        const res = await axios.post('http://localhost:5000/api/v1/auth/google-login', { 
          email: userInfo.data.email,
          name: userInfo.data.name,
          googleId: userInfo.data.sub,
          avatar: userInfo.data.picture
        }, { withCredentials: true });
        
        await handleSuccess(res.data.user, res.data.tokens);
      } catch (err) {
        setError(err.response?.data?.message || 'Google Login failed');
      } finally {
        setLoading(false);
      }
    },
    onError: () => setError('Google Login Failed')
  });

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] text-center px-4 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-600/20 rounded-full blur-[120px] -z-10" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-slate-900/80 p-8 rounded-2xl border border-slate-800 backdrop-blur-sm shadow-xl"
      >
        <h2 className="text-3xl font-bold mb-2">Welcome Back</h2>
        <p className="text-slate-400 mb-6">Login to continue analyzing your LeetCode journey.</p>

        {error && <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-lg mb-4 text-sm">{error}</div>}

        <form className="space-y-4 text-left" onSubmit={handleLogin}>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Email</label>
            <Input icon={FiMail} placeholder="your@email.com" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-slate-400">Password</label>
              <Link to="/forgot-password" className="text-xs text-emerald-400 hover:text-emerald-300">Forgot password?</Link>
            </div>
            <Input icon={FiLock} placeholder="••••••••" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          
          <Button className="w-full py-3 mt-6" type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Log In'}
          </Button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-slate-900/80 text-slate-400">Or continue with</span>
            </div>
          </div>

          <button 
            type="button"
            className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-white text-slate-900 rounded-lg font-medium hover:bg-slate-100 transition-colors disabled:opacity-50"
            onClick={() => googleLoginAction()}
            disabled={loading}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continue with Google
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-400">
          Don't have an account? <Link to="/signup" className="text-emerald-400 hover:text-emerald-300 font-medium">Sign up</Link>
        </div>
      </motion.div>
    </div>
  );
};
