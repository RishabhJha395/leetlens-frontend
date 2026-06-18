import React from 'react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';

export const ProfileSummary = ({ profile }) => {
  return (
    <Card className="flex flex-col md:flex-row items-start md:items-center gap-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] -z-10" />
      
      <img 
        src={profile.profilePicture} 
        alt={profile.username} 
        className="w-24 h-24 rounded-2xl bg-slate-800 border border-slate-700"
      />
      
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-2">
          <h2 className="text-2xl font-bold">{profile.realName}</h2>
          <span className="text-slate-400">@{profile.username}</span>
        </div>
        <div className="flex flex-wrap gap-2 mb-4">
          <Badge variant="primary">Rating: {profile.contestRating}</Badge>
          <Badge variant="success">Top {profile.topPercentage ? `${profile.topPercentage}%` : "N/A"}</Badge>
          <Badge variant="warning">Streak: {profile.currentStreak} 🔥</Badge>
        </div>
        <p className="text-sm text-slate-400">
          Rank: <strong className="text-slate-200">{profile.globalRanking}</strong> • 
          Reputation: <strong className="text-slate-200">{profile.reputation}</strong>
        </p>
      </div>
      
      <div className="flex gap-4 md:flex-col justify-center text-center">
        <div className="bg-slate-900/50 rounded-xl p-3 border border-slate-800">
          <div className="text-sm text-slate-400 mb-1">Total Solved</div>
          <div className="text-2xl font-bold text-blue-400">{profile.problemsSolved.total}</div>
        </div>
        <div className="bg-slate-900/50 rounded-xl p-3 border border-slate-800">
          <div className="text-sm text-slate-400 mb-1">Acceptance</div>
          <div className="text-xl font-bold text-emerald-400">{profile.acceptanceRate}%</div>
        </div>
      </div>
    </Card>
  );
};
