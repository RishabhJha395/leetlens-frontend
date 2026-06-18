// Raw Profile Input Type (Mapped from api.js)
export interface RawProfile {
  username: string;
  realName: string;
  country: string;
  profilePicture: string;
  contestRating: number;
  globalRanking: number;
  topPercentage: number;
  problemsSolved: {
    total: number;
    easy: number;
    medium: number;
    hard: number;
  };
  acceptanceRate: number;
  reputation: number;
  currentStreak: number;
  badges: any[];
  languages: any[];
  skills: { name: string; level: number }[];
  recentContests: {
    name: string;
    ratingChange: number;
    date: string;
    rating: number;
  }[];
  activity: any[];
  topicDistribution: { subject: string; A: number; fullMark: number }[];
}

// Analytics Metrics calculated locally
export interface CalculatedMetrics {
  profile: {
    totalSolved: number;
    easySolved: number;
    mediumSolved: number;
    hardSolved: number;
    easyRatio: number;
    mediumRatio: number;
    hardRatio: number;
    acceptanceRate: number;
  };
  contest: {
    currentRating: number;
    highestRating: number;
    lowestRating: number;
    ratingImprovement: number;
    ratingDecline: number;
    averageContestRating: number;
    contestFrequency: number;
    ratingTrend: 'Improving' | 'Declining' | 'Stable' | 'None';
  };
  streak: {
    currentStreak: number;
  };
  topics: {
    strongestTopic: string;
    weakestTopic: string;
    topicDiversityScore: number;
  };
}

// Deterministic Rules Output
export interface RuleInsights {
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  achievements: string[];
  milestones: string[];
}

// Final Analytics Summary to send to Gemini
export interface AnalyticsSummary {
  profileScore: number;
  contestScore: number;
  growthScore: number;
  consistencyScore: number;
  difficultyScore: number;
  activityScore: number;
  accuracyScore: number;
  
  strongestTopic: string;
  weakestTopic: string;
  contestTrend: string;
  
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
}

// Structured JSON returned by Gemini
export interface GeminiInsights {
  profileSummary: string;
  overallAssessment: string;
  strengthAnalysis: string;
  weaknessAnalysis: string;
  learningRoadmap: {
    week1: string[];
    week2: string[];
    week3: string[];
    week4: string[];
  };
  dailyGoals: string[];
  contestAdvice: string[];
  futurePrediction: string;
  resumeReadiness: string;
  interviewReadiness: string;
  motivationalMessage: string;
  confidenceScore: number;
}

export interface FinalAnalyticsResult {
  metrics: CalculatedMetrics;
  summary: AnalyticsSummary;
  aiInsights: GeminiInsights | null;
  error?: string;
}
