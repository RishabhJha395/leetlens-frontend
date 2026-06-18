import React, { useState, useEffect } from 'react';
import { Card } from '../components/common/Card';
import { ProgressBar } from '../components/common/ProgressBar';
import { motion } from 'framer-motion';
import { useProfile } from '../context/ProfileContext';
import { analyzeProfile } from '../lib/analytics';

export const Analytics = () => {
  const { profileData, analyticsData: analytics, loadingAnalytics: loading } = useProfile();

  if (!profileData) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-8 space-y-6 max-w-7xl mx-auto"
    >
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-3xl font-bold">Deep Analytics</h1>
      </div>

      {loading && (
        <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
          <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-400">AI is analyzing your profile...</p>
        </div>
      )}

      {!loading && analytics && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <Card className="bg-gradient-to-br from-blue-900/50 to-slate-900 border-blue-500/20">
              <h3 className="text-slate-400 text-sm mb-1">Profile Score</h3>
              <div className="text-3xl font-bold text-white mb-2">{analytics.summary.profileScore}/100</div>
              <ProgressBar progress={analytics.summary.profileScore} colorClass="bg-blue-500" />
            </Card>
            <Card className="bg-gradient-to-br from-emerald-900/50 to-slate-900 border-emerald-500/20">
              <h3 className="text-slate-400 text-sm mb-1">Growth Score</h3>
              <div className="text-3xl font-bold text-white mb-2">{analytics.summary.growthScore}/100</div>
              <ProgressBar progress={analytics.summary.growthScore} colorClass="bg-emerald-500" />
            </Card>
            <Card className="bg-gradient-to-br from-purple-900/50 to-slate-900 border-purple-500/20">
              <h3 className="text-slate-400 text-sm mb-1">Consistency Score</h3>
              <div className="text-3xl font-bold text-white mb-2">{analytics.summary.consistencyScore}/100</div>
              <ProgressBar progress={analytics.summary.consistencyScore} colorClass="bg-purple-500" />
            </Card>
            <Card className="bg-gradient-to-br from-orange-900/50 to-slate-900 border-orange-500/20">
              <h3 className="text-slate-400 text-sm mb-1">Accuracy Score</h3>
              <div className="text-3xl font-bold text-white mb-2">{analytics.summary.accuracyScore}/100</div>
              <ProgressBar progress={analytics.summary.accuracyScore} colorClass="bg-orange-500" />
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <h3 className="text-xl font-semibold mb-2 text-slate-200">AI Overall Assessment</h3>
                <p className="text-slate-300 leading-relaxed mb-4">
                  {analytics.aiInsights?.overallAssessment || "AI Insights not available."}
                </p>
                
                <h3 className="text-xl font-semibold mb-2 text-slate-200 mt-6">Profile Summary</h3>
                <p className="text-slate-300 leading-relaxed">
                  {analytics.aiInsights?.profileSummary}
                </p>
              </Card>

              {analytics.aiInsights?.learningRoadmap && (
                <Card>
                  <h3 className="text-xl font-semibold mb-4 text-slate-200">4-Week Learning Roadmap</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {['week1', 'week2', 'week3', 'week4'].map((week, idx) => (
                      <div key={week} className="bg-slate-900/50 p-4 rounded-lg border border-slate-800">
                        <h4 className="font-semibold text-blue-400 mb-2">Week {idx + 1}</h4>
                        <ul className="space-y-2">
                          {analytics.aiInsights.learningRoadmap[week]?.map((item, i) => (
                            <li key={i} className="text-sm text-slate-300 flex items-start">
                              <span className="text-blue-500 mr-2">•</span>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {analytics.aiInsights?.dailyGoals && (
                <Card>
                  <h3 className="text-xl font-semibold mb-4 text-slate-200">Actionable Daily Goals</h3>
                  <ul className="space-y-3">
                    {analytics.aiInsights.dailyGoals.map((goal, i) => (
                      <li key={i} className="flex items-center text-slate-300 bg-slate-900/30 p-3 rounded-lg border border-slate-800">
                        <span className="w-6 h-6 flex items-center justify-center bg-emerald-500/20 text-emerald-400 rounded-full mr-3 text-sm">✓</span>
                        {goal}
                      </li>
                    ))}
                  </ul>
                </Card>
              )}
            </div>

            <div className="space-y-6">
              <Card className="border-l-4 border-l-blue-500">
                <h3 className="font-semibold text-slate-200 mb-2">Resume Readiness</h3>
                <p className="text-sm text-slate-400">{analytics.aiInsights?.resumeReadiness}</p>
              </Card>

              <Card className="border-l-4 border-l-purple-500">
                <h3 className="font-semibold text-slate-200 mb-2">Interview Readiness</h3>
                <p className="text-sm text-slate-400">{analytics.aiInsights?.interviewReadiness}</p>
              </Card>

              <Card>
                <h3 className="font-semibold text-slate-200 mb-4">Strengths & Weaknesses</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-emerald-400 mb-1">Strengths</h4>
                    <p className="text-sm text-slate-300">{analytics.aiInsights?.strengthAnalysis}</p>
                  </div>
                  <div className="pt-2 border-t border-slate-800">
                    <h4 className="text-sm font-medium text-red-400 mb-1">Weaknesses</h4>
                    <p className="text-sm text-slate-300">{analytics.aiInsights?.weaknessAnalysis}</p>
                  </div>
                </div>
              </Card>

              <Card className="bg-gradient-to-br from-slate-900 to-blue-900/20">
                <h3 className="font-semibold text-slate-200 mb-2">Contest Strategy</h3>
                <ul className="space-y-2">
                  {analytics.aiInsights?.contestAdvice?.map((advice, i) => (
                    <li key={i} className="text-sm text-slate-300 flex items-start">
                      <span className="text-blue-400 mr-2">→</span>
                      {advice}
                    </li>
                  ))}
                </ul>
              </Card>

              <Card className="bg-gradient-to-tr from-purple-900/30 to-slate-900 text-center p-6">
                <div className="text-4xl mb-3">🔮</div>
                <h3 className="font-semibold text-slate-200 mb-2">Future Prediction</h3>
                <p className="text-sm text-slate-300 italic">"{analytics.aiInsights?.futurePrediction}"</p>
              </Card>
            </div>
          </div>
        </>
      )}
    </motion.div>
  );
};
