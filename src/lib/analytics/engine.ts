import { RawProfile, CalculatedMetrics } from './types';

export function calculateMetrics(profile: RawProfile): CalculatedMetrics {
  const total = profile.problemsSolved?.total || 0;
  const easy = profile.problemsSolved?.easy || 0;
  const medium = profile.problemsSolved?.medium || 0;
  const hard = profile.problemsSolved?.hard || 0;

  const easyRatio = total > 0 ? (easy / total) * 100 : 0;
  const mediumRatio = total > 0 ? (medium / total) * 100 : 0;
  const hardRatio = total > 0 ? (hard / total) * 100 : 0;

  const ratings = profile.recentContests?.map(c => c.rating) || [];
  const highestRating = ratings.length > 0 ? Math.max(...ratings) : profile.contestRating;
  const lowestRating = ratings.length > 0 ? Math.min(...ratings) : profile.contestRating;
  const averageContestRating = ratings.length > 0 ? ratings.reduce((a, b) => a + b, 0) / ratings.length : profile.contestRating;

  let ratingTrend: 'Improving' | 'Declining' | 'Stable' | 'None' = 'None';
  let ratingImprovement = 0;
  let ratingDecline = 0;

  if (ratings.length >= 2) {
    const first = ratings[0];
    const last = ratings[ratings.length - 1];
    const diff = last - first;
    
    if (diff > 20) {
      ratingTrend = 'Improving';
      ratingImprovement = diff;
    } else if (diff < -20) {
      ratingTrend = 'Declining';
      ratingDecline = Math.abs(diff);
    } else {
      ratingTrend = 'Stable';
    }
  }

  let strongestTopic = 'None';
  let weakestTopic = 'None';
  let topicDiversityScore = 0;

  if (profile.topicDistribution && profile.topicDistribution.length > 0) {
    const sorted = [...profile.topicDistribution].sort((a, b) => b.A - a.A);
    strongestTopic = sorted[0].subject;
    weakestTopic = sorted[sorted.length - 1].subject;
    topicDiversityScore = Math.min(100, profile.topicDistribution.length * 15);
  }

  return {
    profile: {
      totalSolved: total,
      easySolved: easy,
      mediumSolved: medium,
      hardSolved: hard,
      easyRatio,
      mediumRatio,
      hardRatio,
      acceptanceRate: profile.acceptanceRate || 0,
    },
    contest: {
      currentRating: profile.contestRating || 1500,
      highestRating,
      lowestRating,
      ratingImprovement,
      ratingDecline,
      averageContestRating,
      contestFrequency: profile.recentContests?.length || 0,
      ratingTrend,
    },
    streak: {
      currentStreak: profile.currentStreak || 0,
    },
    topics: {
      strongestTopic,
      weakestTopic,
      topicDiversityScore,
    }
  };
}

export function calculateScores(metrics: CalculatedMetrics, profile: RawProfile) {
  // Accuracy Score
  const accuracyScore = metrics.profile.acceptanceRate > 0 
    ? Math.min(1000, metrics.profile.acceptanceRate * 10)
    : 500;

  // Consistency Score
  const consistencyScore = Math.min(1000, 300 + (metrics.streak.currentStreak * 20));

  // Difficulty Score
  const difficultyScore = Math.min(1000, 
    (metrics.profile.easyRatio * 2) + 
    (metrics.profile.mediumRatio * 6) + 
    (metrics.profile.hardRatio * 15)
  );

  // Contest Score
  const contestScore = Math.min(1000, Math.max(0, (metrics.contest.currentRating - 1000) * 0.8));

  // Growth Score
  let growthScore = 500;
  if (metrics.contest.ratingTrend === 'Improving') growthScore += 200;
  if (metrics.contest.ratingTrend === 'Declining') growthScore -= 100;
  growthScore += Math.min(200, metrics.contest.ratingImprovement * 2);

  // Activity Score
  const activityScore = Math.min(1000, (profile.problemsSolved?.total || 0) * 1.5);

  // Overall Score
  const profileScore = Math.round(
    (accuracyScore * 0.1) +
    (consistencyScore * 0.15) +
    (difficultyScore * 0.2) +
    (contestScore * 0.3) +
    (growthScore * 0.15) +
    (activityScore * 0.1)
  );

  return {
    profileScore,
    contestScore: Math.round(contestScore),
    growthScore: Math.round(growthScore),
    consistencyScore: Math.round(consistencyScore),
    difficultyScore: Math.round(difficultyScore),
    activityScore: Math.round(activityScore),
    accuracyScore: Math.round(accuracyScore)
  };
}
