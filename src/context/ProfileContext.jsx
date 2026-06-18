
import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchUserAndFriendsData, saveSnapshot } from '../services/api';
import { analyzeProfile } from '../lib/analytics';

const ProfileContext = createContext();

export const useProfile = () => useContext(ProfileContext);

export const ProfileProvider = ({ children }) => {
  const [profileData, setProfileData] = useState(null);
  const [friendsData, setFriendsData] = useState([]);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingAnalytics, setLoadingAnalytics] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const username = localStorage.getItem('leetcodeUsername');
    if (username && !profileData && !loading) {
      loadRealData(username);
    }
  }, []);

  const loadRealData = async (username) => {
    setLoading(true);
    setError(null);
    try {
      // 1. Fetch data from extension/API
      const data = await fetchUserAndFriendsData(username);
      
      // 2. Set the global state
      setProfileData(data.profileData);
      setFriendsData(data.friendsData);

      // Save daily snapshot automatically
      if (data.profileData) {
        saveSnapshot(data.profileData);
        // Start background AI fetch
        setLoadingAnalytics(true);
        analyzeProfile(data.profileData).then(res => {
          setAnalyticsData(res);
          setLoadingAnalytics(false);
        }).catch(() => {
          setLoadingAnalytics(false);
        });
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProfileContext.Provider value={{ profileData, friendsData, analyticsData, loading, loadingAnalytics, error, loadRealData }}>
      {children}
    </ProfileContext.Provider>
  );
};
