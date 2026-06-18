
export const analyzeProfile = async (profileData) => {
  try {
    // We now send the profile data to our own backend to generate insights
    // The backend uses OpenRouter and hides the API keys securely.
    
    // Check if we use the global axios instance from services/api.js or fetch directly
    const token = localStorage.getItem('accessToken') || localStorage.getItem('token');
    
    const response = await fetch('http://localhost:5000/api/v1/ai/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ profileData })
    });

    const result = await response.json();
    
    if (result.status === 'success' && result.data) {
      return result.data;
    } else {
      throw new Error(result.message || 'Failed to generate insights');
    }
  } catch (error) {
    console.error("Backend AI API Error:", error);
    return getDefaultAnalytics(error.message);
  }
};

const getDefaultAnalytics = (message = "Could not fetch AI insights due to an error.") => {
  return {
    summary: {
      profileScore: 50,
      growthScore: 50,
      consistencyScore: 50,
      accuracyScore: 50
    },
    aiInsights: {
      overallAssessment: message,
      profileSummary: "Please check your OpenRouter API key in the server.",
      learningRoadmap: {
        week1: ["Practice Easy problems"],
        week2: ["Move to Medium problems"],
        week3: ["Learn Graph Algorithms"],
        week4: ["Participate in Contests"]
      },
      dailyGoals: ["Solve 1 problem a day"],
      resumeReadiness: "Not available",
      interviewReadiness: "Not available",
      strengthAnalysis: "Not available",
      weaknessAnalysis: "Not available",
      contestAdvice: ["Keep participating!"],
      futurePrediction: "You'll do great!"
    }
  };
};
