import React from 'react';
import { ProfileSummary } from '../components/Profile/ProfileSummary';
import { Card } from '../components/common/Card';
import { motion } from 'framer-motion';
import { useProfile } from '../context/ProfileContext';

export const Profile = () => {
  const { profileData } = useProfile();
  const profile = profileData;

  if (!profile) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-8 space-y-6 max-w-7xl mx-auto"
    >
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-3xl font-bold">Your Profile</h1>
      </div>

      <ProfileSummary profile={profile} />

      <div className="grid grid-cols-1 gap-6 mt-6">
        <Card>
          <h3 className="text-lg font-semibold mb-4 text-slate-200">Badges & Achievements</h3>
          <div className="flex flex-wrap gap-4">
            {(profile.badges || []).map((badge, i) => (
              <div key={i} className="flex flex-col items-center justify-center p-4 bg-slate-900/50 rounded-xl border border-slate-800 hover:border-slate-700 transition-colors">
                <div className="w-12 h-12 mb-2 flex items-center justify-center">
                  {badge.icon ? (
                    <img src={badge.icon.startsWith('http') ? badge.icon : `https://leetcode.com${badge.icon}`} alt={badge.displayName} className="w-full h-full object-contain" />
                  ) : (
                    <span className="text-4xl">🎖️</span>
                  )}
                </div>
                <div className="text-sm font-medium text-slate-300 text-center">{badge.displayName || badge.name || 'Badge'}</div>
              </div>
            ))}
            {(!profile.badges || profile.badges.length === 0) && (
              <div className="text-slate-500">No badges earned yet.</div>
            )}
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold mb-4 text-slate-200">Top Languages</h3>
          <div className="flex flex-wrap gap-3">
            {(profile.languages || []).map((lang, i) => (
              <div key={i} className="flex items-center gap-2 px-4 py-2 bg-slate-800 rounded-full border border-slate-700">
                <span className="text-slate-300 font-medium">{lang.name}</span>
                <span className="bg-blue-500/20 text-blue-400 text-xs px-2 py-0.5 rounded-full">
                  {lang.count} solved
                </span>
              </div>
            ))}
            {(!profile.languages || profile.languages.length === 0) && (
              <div className="text-slate-500">No languages recorded.</div>
            )}
          </div>
        </Card>
      </div>

      <div className="mt-6">
        <Card>
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-2">
            <h3 className="text-lg font-semibold text-slate-200">Expertise & Skills</h3>
            <div className="flex gap-4 text-xs font-medium bg-slate-900/50 px-3 py-1.5 rounded-lg border border-slate-800">
              <span className="flex items-center gap-1.5 text-red-400"><span className="w-2 h-2 rounded-full bg-red-500"></span> Advanced</span>
              <span className="flex items-center gap-1.5 text-yellow-400"><span className="w-2 h-2 rounded-full bg-yellow-500"></span> Medium</span>
              <span className="flex items-center gap-1.5 text-emerald-400"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> Easy</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            {(profile.skills || []).map((skill, i) => {
              const diffColors = {
                Advanced: 'text-red-400 border-red-500/20 bg-red-500/10',
                Intermediate: 'text-yellow-400 border-yellow-500/20 bg-yellow-500/10',
                Fundamental: 'text-emerald-400 border-emerald-500/20 bg-emerald-500/10'
              };
              const color = diffColors[skill.difficulty] || 'text-slate-300 border-slate-700 bg-slate-800';
              return (
              <div key={i} className={`flex items-center gap-2 px-4 py-2 rounded-full border ${color}`}>
                <span className="font-medium">{skill.name}</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-900/50">
                  {skill.level} solved
                </span>
              </div>
            )})}
            {(!profile.skills || profile.skills.length === 0) && (
              <div className="text-slate-500">No specific expertise data available.</div>
            )}
          </div>
        </Card>
      </div>
    </motion.div>
  );
};
