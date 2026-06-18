import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ProfileSummary } from '../components/Profile/ProfileSummary';
import { PieChart } from '../components/charts/PieChart';
import { LineChart } from '../components/charts/LineChart';
import { RadarChart } from '../components/charts/RadarChart';
import { Card } from '../components/common/Card';
import { FiTarget, FiZap, FiAward, FiCalendar, FiCode } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { useProfile } from '../context/ProfileContext';
import { analyzeProfile } from '../lib/analytics';

export const Dashboard = () => {
  const { profileData, analyticsData, loadingAnalytics } = useProfile();
  const profile = profileData;

  if (!localStorage.getItem('accessToken') || !localStorage.getItem('leetcodeUsername')) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
        <h2 className="text-2xl font-bold text-slate-200 mb-4">Dashboard Locked</h2>
        <p className="text-slate-400 mb-6 max-w-md">Please log in and verify your LeetCode ID to view your personalized dashboard.</p>
        {!localStorage.getItem('accessToken') ? (
          <Link to="/login" className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2 rounded-lg font-medium transition-colors">
            Go to Login
          </Link>
        ) : (
          <Link to="/verify" className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-medium transition-colors">
            Complete Verification
          </Link>
        )}
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-slate-400">Fetching profile data...</p>
      </div>
    );
  }

  const pieData = [
    { name: 'Easy', value: profile.problemsSolved?.easy || 0 },
    { name: 'Medium', value: profile.problemsSolved?.medium || 0 },
    { name: 'Hard', value: profile.problemsSolved?.hard || 0 },
  ];

  const ratingData = (profile.recentContests || []).map(c => ({
    name: c.name || (c.date ? c.date.split('-').slice(1).join('/') : ''),
    rating: c.rating || 1500
  }));

  const topLanguages = (profile.languages || []).slice(0, 3);
  const badges = profile.badges || [];



  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-8 space-y-6 max-w-7xl mx-auto"
    >
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-3xl font-bold">Overview</h1>
      </div>

      {/* Widgets Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { icon: FiTarget, label: "Total Solved", value: profile.problemsSolved?.total || 0, color: "text-blue-400", bg: "bg-blue-500/10" },
          { icon: FiZap, label: "Daily Streak", value: `${profile.currentStreak || 0} Days`, color: "text-yellow-400", bg: "bg-yellow-500/10" },
          { icon: FiAward, label: "Contest Top", value: profile.topPercentage ? `Top ${profile.topPercentage}%` : "N/A", color: "text-emerald-400", bg: "bg-emerald-500/10" },
          { icon: FiCalendar, label: "Total Badges", value: badges.length, color: "text-purple-400", bg: "bg-purple-500/10" },
        ].map((widget, i) => (
          <Card key={i} className="flex items-center gap-4 p-4">
            <div className={`w-12 h-12 rounded-lg ${widget.bg} flex items-center justify-center ${widget.color}`}>
              <widget.icon className="w-6 h-6" />
            </div>
            <div>
              <div className="text-sm text-slate-400">{widget.label}</div>
              <div className="text-lg font-bold text-slate-200">{widget.value}</div>
            </div>
          </Card>
        ))}
      </div>

      <ProfileSummary profile={profile} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <PieChart data={pieData} title="Difficulty Distribution" colors={['#10b981', '#f59e0b', '#ef4444']} />
          
          <Card>
            <h3 className="text-lg font-semibold mb-4 text-slate-200 flex items-center gap-2">
              <FiCode /> Top Languages
            </h3>
            {topLanguages.length > 0 ? (
              <div className="space-y-3">
                {topLanguages.map((lang, idx) => (
                  <div key={idx} className="flex justify-between items-center bg-slate-900/50 p-3 rounded-lg">
                    <span className="font-medium text-slate-300">{lang.name || lang.languageName}</span>
                    <span className="text-blue-400 font-bold">{lang.count || lang.problemsSolved}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-400 text-sm">No language data available.</p>
            )}
          </Card>

          {badges.length > 0 && (
            <Card>
              <h3 className="text-lg font-semibold mb-4 text-slate-200 flex items-center gap-2">
                <FiAward /> Recent Badges
              </h3>
              <div className="flex flex-wrap gap-3">
                {badges.slice(0, 6).map((badge, idx) => (
                  <div key={idx} className="relative group cursor-pointer">
                    <img src={badge.icon?.startsWith('/') ? `https://leetcode.com${badge.icon}` : badge.icon} alt={badge.name} className="w-12 h-12 hover:scale-110 transition-transform" />
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-max bg-slate-800 text-xs px-2 py-1 rounded shadow-xl z-10 whitespace-nowrap">
                      {badge.name}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
        <div className="lg:col-span-2 space-y-6">
          <LineChart data={ratingData} title="Contest Rating Trend" />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <PieChart data={profile.groupedTopicDistribution || []} title="Topic Expertise" />
            <Card className="flex flex-col">
              <h3 className="text-lg font-semibold mb-4 text-slate-200">AI Insights</h3>
              <div className="flex-1 space-y-4 overflow-y-auto max-h-64 pr-2">
                {loadingAnalytics ? (
                  <div className="flex flex-col items-center justify-center h-full space-y-3">
                    <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-xs text-slate-400">Generating insights...</p>
                  </div>
                ) : analyticsData?.aiInsights ? (
                  <>
                    <div className="p-4 bg-slate-800/50 rounded-xl border border-emerald-500/20 flex gap-3">
                      <span className="text-xl">🏆</span>
                      <div>
                        <h4 className="font-medium text-emerald-400">Strength</h4>
                        <p className="text-sm text-slate-300">{analyticsData.aiInsights.strengthAnalysis}</p>
                      </div>
                    </div>
                    <div className="p-4 bg-slate-800/50 rounded-xl border border-red-500/20 flex gap-3">
                      <span className="text-xl">🎯</span>
                      <div>
                        <h4 className="font-medium text-red-400">Weakness</h4>
                        <p className="text-sm text-slate-300">{analyticsData.aiInsights.weaknessAnalysis}</p>
                      </div>
                    </div>
                    <div className="p-4 bg-slate-800/50 rounded-xl border border-blue-500/20 flex gap-3">
                      <span className="text-xl">💡</span>
                      <div>
                        <h4 className="font-medium text-blue-400">Area to Improve</h4>
                        <p className="text-sm text-slate-300">{analyticsData.aiInsights.learningRoadmap?.week1?.[0] || 'Keep practicing!'}</p>
                      </div>
                    </div>
                    <div className="p-4 bg-slate-800/50 rounded-xl border border-purple-500/20 flex gap-3">
                      <span className="text-xl">🧠</span>
                      <div>
                        <h4 className="font-medium text-purple-400">Topic Expertise</h4>
                        <p className="text-sm text-slate-300">{analyticsData.aiInsights.topicExpertise || 'Solve more diverse topics to get insights.'}</p>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700 flex gap-3">
                    <p className="text-sm text-slate-400">AI Insights not available.</p>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
