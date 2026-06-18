import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { Home } from './pages/Home';
import { Dashboard } from './pages/Dashboard';
import { Compare } from './pages/Compare';
import { Analytics } from './pages/Analytics';
import { Leaderboard } from './pages/Leaderboard';
import { History } from './pages/History';
import { Profile } from './pages/Profile';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { Verification } from './pages/Verification';
import { ForgotPassword } from './pages/ForgotPassword';
import { ResetPassword } from './pages/ResetPassword';
import { ProfileProvider } from './context/ProfileContext';
import { GoogleOAuthProvider } from '@react-oauth/google';

function App() {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID_HERE';

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <ProfileProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="compare" element={<Compare />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="leaderboard" element={<Leaderboard />} />
            <Route path="history" element={<History />} />
            <Route path="profile" element={<Profile />} />
            <Route path="login" element={<Login />} />
            <Route path="signup" element={<Signup />} />
            <Route path="verify" element={<Verification />} />
            <Route path="forgot-password" element={<ForgotPassword />} />
            <Route path="reset-password/:token" element={<ResetPassword />} />
            <Route path="*" element={<div className="p-8 text-center text-xl text-slate-400 mt-20">Page under construction</div>} />
          </Route>
        </Routes>
      </Router>
      </ProfileProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
