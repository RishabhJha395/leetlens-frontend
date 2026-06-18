import { CalculatedMetrics, RuleInsights, RawProfile } from './types';

export function evaluateRules(metrics: CalculatedMetrics, profile: RawProfile): RuleInsights {
  const strengths: string[] = [];
  const weaknesses: string[] = [];
  const recommendations: string[] = [];
  const achievements: string[] = [];
  const milestones: string[] = [];

  // Difficulty Analysis
  if (metrics.profile.hardRatio > 25) {
    strengths.push('Strong hard problem solver');
    achievements.push('Top tier problem difficulty ratio');
  } else if (metrics.profile.hardRatio < 5 && metrics.profile.totalSolved > 100) {
    weaknesses.push('Low exposure to hard problems');
    recommendations.push('Gradually start attempting 1-2 hard problems per week');
  }

  // Accuracy Analysis
  if (metrics.profile.acceptanceRate > 65) {
    strengths.push('High submission accuracy');
  } else if (metrics.profile.acceptanceRate > 0 && metrics.profile.acceptanceRate < 45) {
    weaknesses.push('High penalty/rejection rate');
    recommendations.push('Test your code against custom edge cases before submitting');
  }

  // Streak Analysis
  if (metrics.streak.currentStreak > 30) {
    strengths.push('Highly consistent daily solver');
    achievements.push(`Maintained a ${metrics.streak.currentStreak} day streak`);
  } else if (metrics.streak.currentStreak === 0) {
    recommendations.push('Start a new daily streak by solving the Problem of the Day');
  }

  // Contest Analysis
  if (metrics.contest.ratingTrend === 'Improving') {
    strengths.push(`Contest rating is rapidly improving (+${metrics.contest.ratingImprovement} recently)`);
    achievements.push('Upward rating trajectory');
  } else if (metrics.contest.ratingTrend === 'Declining') {
    weaknesses.push(`Contest rating has dropped by ${metrics.contest.ratingDecline} points recently`);
    recommendations.push('Review upsolved problems from recent contests to patch knowledge gaps');
  }

  if (metrics.contest.contestFrequency === 0) {
    recommendations.push('Participate in Weekly Contests to benchmark your skills against others');
  }

  // Topic Analysis
  if (metrics.topics.strongestTopic !== 'None') {
    strengths.push(`Exceptional proficiency in ${metrics.topics.strongestTopic}`);
  }
  if (metrics.topics.weakestTopic !== 'None') {
    weaknesses.push(`Struggling with ${metrics.topics.weakestTopic} problems`);
    recommendations.push(`Focus your next practice sessions on ${metrics.topics.weakestTopic} fundamentals`);
  }

  // Milestones
  const nextHundred = Math.ceil((metrics.profile.totalSolved + 1) / 100) * 100;
  if (metrics.profile.totalSolved > 0) {
    milestones.push(`Solve ${nextHundred - metrics.profile.totalSolved} more problems to reach ${nextHundred} total solved`);
  }

  const targetRating = Math.ceil((metrics.contest.currentRating + 1) / 100) * 100;
  if (metrics.contest.currentRating > 0) {
    milestones.push(`Gain ${targetRating - metrics.contest.currentRating} rating points to break the ${targetRating} barrier`);
  }

  return {
    strengths,
    weaknesses,
    recommendations,
    achievements,
    milestones
  };
}
