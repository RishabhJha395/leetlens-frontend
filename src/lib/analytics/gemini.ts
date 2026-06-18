import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import { AnalyticsSummary, GeminiInsights } from "./types";

export async function generateAIInsights(summary: AnalyticsSummary): Promise<GeminiInsights | null> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("VITE_GEMINI_API_KEY is not defined. Skipping AI Insights.");
    return null;
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);

    const schema = {
      type: SchemaType.OBJECT,
      properties: {
        profileSummary: { type: SchemaType.STRING },
        overallAssessment: { type: SchemaType.STRING },
        strengthAnalysis: { type: SchemaType.STRING },
        weaknessAnalysis: { type: SchemaType.STRING },
        learningRoadmap: {
          type: SchemaType.OBJECT,
          properties: {
            week1: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
            week2: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
            week3: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
            week4: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } }
          },
          required: ["week1", "week2", "week3", "week4"]
        },
        dailyGoals: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
        contestAdvice: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
        futurePrediction: { type: SchemaType.STRING },
        resumeReadiness: { type: SchemaType.STRING },
        interviewReadiness: { type: SchemaType.STRING },
        motivationalMessage: { type: SchemaType.STRING },
        confidenceScore: { type: SchemaType.INTEGER }
      },
      required: [
        "profileSummary", "overallAssessment", "strengthAnalysis", "weaknessAnalysis", 
        "learningRoadmap", "dailyGoals", "contestAdvice", "futurePrediction", 
        "resumeReadiness", "interviewReadiness", "motivationalMessage", "confidenceScore"
      ]
    };

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: {
        temperature: 0.7,
        responseMimeType: "application/json",
        responseSchema: schema as any, // Schema types are slightly incompatible natively
      }
    });

    const prompt = `
      You are an expert LeetCode coach and AI software engineering mentor.
      Your task is to analyze the following user's LeetCode Analytics Summary and provide actionable, structured insights.

      CRITICAL INSTRUCTIONS:
      - DO NOT calculate any statistics yourself. Rely strictly on the summary provided.
      - Act as an interpreter of the metrics. Provide human-friendly explanations for WHY these metrics matter.
      - Create a personalized 4-week learning roadmap based on their weakest topics and weaknesses.
      - Generate honest assessments for their Resume Readiness and Interview Readiness based on their contest rating, difficulty score, and consistency.
      - Return ONLY valid JSON matching the exact schema.

      ANALYTICS SUMMARY:
      ${JSON.stringify(summary, null, 2)}
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    // Safety parse just in case
    return JSON.parse(responseText) as GeminiInsights;

  } catch (error) {
    console.error("Gemini API Error:", error);
    return null;
  }
}
