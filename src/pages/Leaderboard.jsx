import React, { useState, useEffect } from 'react';
import { Card } from '../components/common/Card';
import { motion } from 'framer-motion';
import { useProfile } from '../context/ProfileContext';
import { getUserProfile } from '../services/api';

export const Leaderboard = () => {
  const { profileData, friendsData } = useProfile();
  const [leaderboardUsers, setLeaderboardUsers] = useState([]);
  const [loadingProgress, setLoadingProgress] = useState({ current: 0, total: 0 });

  useEffect(() => {
    if (!profileData) return;

    let isMounted = true;

    const loadLeaderboardData = async () => {
      // Start with the main user
      let loadedUsers = [profileData];
      setLeaderboardUsers([...loadedUsers]);

      if (!friendsData || friendsData.length === 0) return;

      setLoadingProgress({ current: 0, total: friendsData.length });

      // Fetch friends sequentially to avoid rate limiting
      for (let i = 0; i < friendsData.length; i++) {
        if (!isMounted) break;
        
        try {
          const friendProfile = await getUserProfile(friendsData[i].username);
          if (friendProfile) {
            loadedUsers.push(friendProfile);
            // Sort by rating descending, then problems solved descending, then alphabetically by name
            loadedUsers.sort((a, b) => {
              const ratingA = Math.round(a.contestRating || 0);
              const ratingB = Math.round(b.contestRating || 0);
              if (ratingB !== ratingA) return ratingB - ratingA;
              
              const solvedA = a.problemsSolved?.total || 0;
              const solvedB = b.problemsSolved?.total || 0;
              if (solvedB !== solvedA) return solvedB - solvedA;
              
              const nameA = (a.realName || a.displayName || a.username || '').toLowerCase();
              const nameB = (b.realName || b.displayName || b.username || '').toLowerCase();
              return nameA.localeCompare(nameB);
            });
            if (isMounted) {
              setLeaderboardUsers([...loadedUsers]);
            }
          }
        } catch (e) {
          console.error(`Failed to load stats for ${friendsData[i].username}`, e);
        }
        
        if (isMounted) {
          setLoadingProgress({ current: i + 1, total: friendsData.length });
        }
        // Small delay to respect public API limits
        await new Promise(r => setTimeout(r, 600));
      }
    };

    loadLeaderboardData();

    return () => {
      isMounted = false;
    };
  }, [profileData, friendsData]);

  if (!profileData) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <h1 className="text-3xl font-bold">Friends Leaderboard</h1>
        {loadingProgress.total > 0 && loadingProgress.current < loadingProgress.total && (
          <div className="flex items-center gap-3 text-sm text-slate-400 bg-slate-900/50 px-4 py-2 rounded-full">
            <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            Loading stats: {loadingProgress.current} / {loadingProgress.total} friends
          </div>
        )}
      </div>

      <Card className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900/50 border-b border-slate-800">
                <th className="p-4 font-semibold text-slate-400">Rank</th>
                <th className="p-4 font-semibold text-slate-400">User</th>
                <th className="p-4 font-semibold text-slate-400">Rating</th>
                <th className="p-4 font-semibold text-slate-400">Solved</th>
              </tr>
            </thead>
            <tbody>
              {leaderboardUsers.length === 0 ? (
                 <tr><td colSpan="4" className="p-4 md:p-8 text-center text-slate-400">No data available</td></tr>
              ) : leaderboardUsers.map((user, i) => (
                <tr key={i} className={`border-b border-slate-800/50 transition-colors ${user.username === profileData.username ? 'bg-blue-500/10 hover:bg-blue-500/20' : 'hover:bg-slate-800/30'}`}>
                  <td className="p-4">
                    <div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold ${i === 0 ? 'bg-yellow-500/20 text-yellow-400' : i === 1 ? 'bg-slate-300/20 text-slate-300' : i === 2 ? 'bg-orange-500/20 text-orange-400' : 'bg-slate-800 text-slate-400'}`}>
                      #{i + 1}
                    </div>
                  </td>
                  <td className="p-4 flex items-center gap-3">
                    <img src={user.profilePicture || user.avatarUrl} alt={user.username} className="w-10 h-10 rounded-full bg-slate-800" />
                    <div>
                      <div className="font-semibold text-slate-200">{user.realName || user.displayName || user.username}</div>
                      <div className="text-sm text-slate-400">@{user.username} {user.username === profileData.username && '(You)'}</div>
                    </div>
                  </td>
                  <td className="p-4 font-bold text-blue-400">{user.contestRating || 'N/A'}</td>
                  <td className="p-4 text-emerald-400">{user.problemsSolved?.total || 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </motion.div>
  );
};
