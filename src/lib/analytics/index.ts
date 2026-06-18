import { RawProfile, FinalAnalyticsResult, AnalyticsSummary } from './types';
import { calculateMetrics, calculateScores } from './engine';
import { evaluateRules } from './rules';
import { generateAIInsights } from './gemini';

export async function analyzeProfile(profile: RawProfile): Promise<FinalAnalyticsResult> {
  try {
    const metrics = calculateMetrics(profile);
    const scores = calculateScores(metrics, profile);
    const rules = evaluateRules(metrics, profile);

    const summary: AnalyticsSummary = {
      profileScore: scores.profileScore,
      contestScore: scores.contestScore,
      growthScore: scores.growthScore,
      consistencyScore: scores.consistencyScore,
      difficultyScore: scores.difficultyScore,
      activityScore: scores.activityScore,
      accuracyScore: scores.accuracyScore,
      strongestTopic: metrics.topics.strongestTopic,
      weakestTopic: metrics.topics.weakestTopic,
      contestTrend: metrics.contest.ratingTrend,
      strengths: rules.strengths,
      weaknesses: rules.weaknesses,
      recommendations: rules.recommendations
    };

    const aiInsights = await generateAIInsights(summary);

    return {
      metrics,
      summary,
      aiInsights
    };
  } catch (error: any) {
    console.error("Error analyzing profile:", error);
    return {
      metrics: null as any,
      summary: null as any,
      aiInsights: null,
      error: error.message || "Failed to analyze profile"
    };
  }
}

// Prepare for Step 6: Comparison
export async function compareProfiles(profileA: RawProfile, profileB: RawProfile) {
  const resultA = await analyzeProfile(profileA);
  const resultB = await analyzeProfile(profileB);

  // In the future, this can be expanded to include a comparative AI prompt.
  return {
    profileA: resultA,
    profileB: resultB,
    comparison: {
      scoreDifference: (resultA.summary?.profileScore || 0) - (resultB.summary?.profileScore || 0),
      strongerProfile: (resultA.summary?.profileScore || 0) > (resultB.summary?.profileScore || 0) ? profileA.username : profileB.username
    }
  };
}
