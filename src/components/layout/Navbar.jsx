import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiSearch, FiLogOut, FiUser } from 'react-icons/fi';
import { Input } from '../common/Input';
import { useState } from 'react';
import { useProfile } from '../../context/ProfileContext';

export const Navbar = () => {
  const navigate = useNavigate();
  const { profileData } = useProfile();
  const [searchUser, setSearchUser] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchUser.trim()) {
      navigate(`/compare?user=${searchUser.trim()}`);
      setSearchUser('');
    }
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      localStorage.clear();
      window.location.href = '/login';
    }
  };
  return (
    <nav className="h-16 border-b border-slate-800 bg-slate-900/50 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-50">
      <div className="flex items-center gap-8">
        <Link to="/" className="flex items-center gap-3 text-xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
          {profileData?.profilePicture ? (
            <img src={profileData.profilePicture} alt="Profile" className="w-8 h-8 rounded-full border border-slate-700 object-cover" />
          ) : (
            <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center border border-blue-500/50 text-blue-400 text-sm">LL</div>
          )}
          LeetLens
        </Link>
        <form onSubmit={handleSearch} className="hidden md:block w-96">
          <Input 
            icon={FiSearch} 
            placeholder="Search users..." 
            value={searchUser} 
            onChange={(e) => setSearchUser(e.target.value)} 
          />
        </form>
      </div>
      <div className="flex items-center gap-6 text-slate-400">
        {localStorage.getItem('accessToken') ? (
          <>
            <button onClick={handleLogout} className="flex items-center gap-2 hover:text-red-400 transition-colors" title="Log Out">
              <FiLogOut className="w-5 h-5" />
              <span className="text-sm font-medium">Log out</span>
            </button>
            <Link to="/profile" className="flex items-center gap-2 hover:text-white transition-colors">
              <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700 overflow-hidden">
                {profileData?.profilePicture ? (
                  <img src={profileData.profilePicture} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <FiUser className="w-4 h-4" />
                )}
              </div>
            </Link>
          </>
        ) : (
          <Link to="/login" className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-1.5 rounded-lg font-medium transition-colors text-sm">
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};
