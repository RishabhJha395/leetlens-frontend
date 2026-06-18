import React, { useState, useEffect, useMemo } from 'react';
import { Card } from '../components/common/Card';
import { BarChart } from '../components/charts/BarChart';
import { RadarChart } from '../components/charts/RadarChart';
import { motion } from 'framer-motion';
import { useProfile } from '../context/ProfileContext';
import { getUserProfile } from '../services/api';
import { useLocation } from 'react-router-dom';

export const Compare = () => {
  const { profileData, friendsData } = useProfile();
  
  const profileA = profileData;
  const [profileB, setProfileB] = useState(null);
  const [selectedFriendUsername, setSelectedFriendUsername] = useState(null);
  const [loadingFriend, setLoadingFriend] = useState(false);
  const [errorFriend, setErrorFriend] = useState(null);

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const userParam = searchParams.get('user');

  // Auto-select friend based on URL or fallback to first friend
  useEffect(() => {
    if (userParam && userParam !== selectedFriendUsername) {
      handleSelectFriend(userParam);
    } else if (!userParam && friendsData && friendsData.length > 0 && !selectedFriendUsername) {
      handleSelectFriend(friendsData[0].username);
    }
  }, [friendsData, userParam]);

  const handleSelectFriend = async (username) => {
    if (username === selectedFriendUsername) return;
    
    setSelectedFriendUsername(username);
    setLoadingFriend(true);
    setErrorFriend(null);
    try {
      const fullProfile = await getUserProfile(username);
      if (fullProfile) {
        setProfileB(fullProfile);
      } else {
        setErrorFriend(`Failed to load full profile data for ${username}. They might not exist or LeetCode is rate-limiting requests.`);
        setProfileB(null);
      }
    } catch (e) {
      console.error("Failed to load friend profile", e);
      setErrorFriend(`An error occurred while fetching ${username}.`);
      setProfileB(null);
    } finally {
      setLoadingFriend(false);
    }
  };

  if (!profileA) return null;

  if (!friendsData || friendsData.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-8 max-w-7xl mx-auto flex flex-col items-center justify-center min-h-[50vh] text-center"
      >
        <div className="text-6xl mb-4">👥</div>
        <h1 className="text-3xl font-bold mb-2">No Friends Found</h1>
        <p className="text-slate-400 max-w-md">
          We couldn't find any friends or followers to compare against. Ensure the LeetCode profile has followers!
        </p>
      </motion.div>
    );
  }

  const problemComparison = profileB ? [
    { name: 'Total', [profileA.username]: profileA.problemsSolved?.total || 0, [profileB.username]: profileB.problemsSolved?.total || 0 },
    { name: 'Easy', [profileA.username]: profileA.problemsSolved?.easy || 0, [profileB.username]: profileB.problemsSolved?.easy || 0 },
    { name: 'Medium', [profileA.username]: profileA.problemsSolved?.medium || 0, [profileB.username]: profileB.problemsSolved?.medium || 0 },
    { name: 'Hard', [profileA.username]: profileA.problemsSolved?.hard || 0, [profileB.username]: profileB.problemsSolved?.hard || 0 },
  ] : [];

  const combinedTopics = useMemo(() => {
    if (!profileA || !profileB) return [];
    
    const targetTopics = ['Arrays', 'String', 'Hashmap', 'Tree', 'DP', 'Queue & Stack', 'Graph', 'Linked List', 'Backtracking'];
    
    return targetTopics.map(topic => {
      const topicA = profileA.groupedTopicDistribution?.find(t => t.name === topic);
      const valA = topicA ? topicA.value : 0;
      
      const topicB = profileB.groupedTopicDistribution?.find(t => t.name === topic);
      const valB = topicB ? topicB.value : 0;
      
      return {
        name: topic,
        [profileA.username]: valA,
        [profileB.username]: valB,
        fullMark: Math.max(valA, valB, 20) + 10
      };
    });
  }, [profileA, profileB]);

  return (
    <div className="p-8 max-w-7xl mx-auto flex flex-col lg:flex-row gap-6">
      {/* Sidebar for Friend Selection */}
      <div className="lg:w-1/4 space-y-4">
        <h2 className="text-xl font-bold mb-4">Select Friend</h2>
        <Card className="p-2 max-h-[80vh] overflow-y-auto space-y-2 bg-slate-900/50">
          {friendsData.map((friend, idx) => (
            <div 
              key={idx}
              onClick={() => handleSelectFriend(friend.username)}
              className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-colors ${selectedFriendUsername === friend.username ? 'bg-blue-500/20 border border-blue-500/30' : 'hover:bg-slate-800 border border-transparent'}`}
            >
              <img src={friend.avatarUrl || `https://assets.leetcode.com/users/default_avatar.jpg`} alt={friend.username} className="w-10 h-10 rounded-full bg-slate-800" />
              <div className="overflow-hidden">
                <div className="font-semibold text-slate-200 truncate">{friend.displayName || friend.username}</div>
                <div className="text-xs text-slate-400 truncate">@{friend.username}</div>
              </div>
            </div>
          ))}
        </Card>
      </div>

      {/* Main Comparison Area */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="lg:w-3/4 space-y-6"
      >
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-3xl font-bold">Profile Comparison</h1>
        </div>

        {loadingFriend ? (
          <div className="flex flex-col items-center justify-center min-h-[40vh] text-center">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-slate-400">Loading {selectedFriendUsername}'s profile data...</p>
          </div>
        ) : errorFriend ? (
          <div className="flex flex-col items-center justify-center min-h-[40vh] text-center bg-red-900/10 border border-red-500/20 rounded-2xl p-8">
            <div className="text-4xl mb-4">⚠️</div>
            <h2 className="text-xl font-bold text-red-400 mb-2">Error Fetching Profile</h2>
            <p className="text-slate-300">{errorFriend}</p>
          </div>
        ) : profileB ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Profile A */}
              <Card className="flex flex-col items-center text-center p-8 bg-blue-500/5 border-blue-500/20">
                <img src={profileA.profilePicture} alt={profileA.username} className="w-24 h-24 rounded-full border-2 border-blue-500 mb-4 bg-slate-800" />
                <h2 className="text-2xl font-bold">{profileA.realName || profileA.username}</h2>
                <span className="text-blue-400 mb-4">@{profileA.username}</span>
                <div className="text-3xl font-bold text-slate-200">{profileA.contestRating || 1500}</div>
                <div className="text-slate-400">Contest Rating</div>
              </Card>

              {/* Profile B */}
              <Card className="flex flex-col items-center text-center p-8 bg-emerald-500/5 border-emerald-500/20">
                <img src={profileB.profilePicture || `https://assets.leetcode.com/users/default_avatar.jpg`} alt={profileB.username} className="w-24 h-24 rounded-full border-2 border-emerald-500 mb-4 bg-slate-800" />
                <h2 className="text-2xl font-bold">{profileB.realName || profileB.username}</h2>
                <span className="text-emerald-400 mb-4">@{profileB.username}</span>
                <div className="text-3xl font-bold text-slate-200">{profileB.contestRating || 1500}</div>
                <div className="text-slate-400">Contest Rating</div>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <BarChart 
                data={problemComparison} 
                title="Problems Solved Comparison" 
                keys={[profileA.username, profileB.username]} 
                colors={['#3b82f6', '#10b981']} 
              />
              
              <Card className="flex flex-col">
                <h3 className="text-lg font-semibold mb-6 text-slate-200">Head-to-Head Stats</h3>
                <div className="space-y-6 flex-1 flex flex-col justify-center">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-blue-400">{profileA.globalRanking > 0 ? profileA.globalRanking.toLocaleString() : 'N/A'}</span>
                      <span className="text-slate-400">Global Ranking (Lower is Better)</span>
                      <span className="text-emerald-400">{profileB.globalRanking > 0 ? profileB.globalRanking.toLocaleString() : 'N/A'}</span>
                    </div>
                    <div className="flex gap-1 h-2">
                      <div className="bg-emerald-500 rounded-l-full h-full" style={{ width: `${(profileB.globalRanking || 1000000) / (Math.max(1, (profileA.globalRanking || 1000000) + (profileB.globalRanking || 1000000))) * 100}%` }} />
                      <div className="bg-blue-500 rounded-r-full h-full" style={{ width: `${(profileA.globalRanking || 1000000) / (Math.max(1, (profileA.globalRanking || 1000000) + (profileB.globalRanking || 1000000))) * 100}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-blue-400">{profileA.problemsSolved?.total || 0}</span>
                      <span className="text-slate-400">Total Solved</span>
                      <span className="text-emerald-400">{profileB.problemsSolved?.total || 0}</span>
                    </div>
                    <div className="flex gap-1 h-2">
                      <div className="bg-blue-500 rounded-l-full h-full" style={{ width: `${((profileA.problemsSolved?.total || 0) / (Math.max(1, (profileA.problemsSolved?.total || 0) + (profileB.problemsSolved?.total || 0)))) * 100}%` }} />
                      <div className="bg-emerald-500 rounded-r-full h-full" style={{ width: `${((profileB.problemsSolved?.total || 0) / (Math.max(1, (profileA.problemsSolved?.total || 0) + (profileB.problemsSolved?.total || 0)))) * 100}%` }} />
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-blue-400">{profileA.reputation || 0}</span>
                      <span className="text-slate-400">Reputation</span>
                      <span className="text-emerald-400">{profileB.reputation || 0}</span>
                    </div>
                    <div className="flex gap-1 h-2">
                      <div className="bg-blue-500 rounded-l-full h-full" style={{ width: `${((profileA.reputation || 0) / (Math.max(1, (profileA.reputation || 0) + (profileB.reputation || 0)))) * 100}%` }} />
                      <div className="bg-emerald-500 rounded-r-full h-full" style={{ width: `${((profileB.reputation || 0) / (Math.max(1, (profileA.reputation || 0) + (profileB.reputation || 0)))) * 100}%` }} />
                    </div>
                  </div>
                </div>
              </Card>
            </div>
            
            <div className="mt-6">
              {combinedTopics.length > 0 ? (
                <BarChart 
                  data={combinedTopics} 
                  title="Head-to-Head Expertise" 
                  keys={[profileA.username, profileB.username]}
                  colors={['#3b82f6', '#10b981']}
                />
              ) : (
                <Card className="flex items-center justify-center p-8 text-slate-500">No expertise data to compare</Card>
              )}
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center min-h-[40vh] text-slate-400">
            Select a friend to see comparison
          </div>
        )}
      </motion.div>
    </div>
  );
};
