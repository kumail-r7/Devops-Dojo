import { GoogleGenAI, Type } from "@google/genai";
import { SessionLog, TimerMode } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateProductivityInsights = async (
  logs: SessionLog[],
  currentTopic: string
): Promise<string> => {
  try {
    const recentLogs = logs.slice(-20); // Last 20 sessions
    
    const prompt = `
      You are an expert productivity coach using the Chronos learning system.
      Analyze the following learning session data for the user.
      
      Current Focus Topic: ${currentTopic}
      
      Session History (Last 7 days):
      ${JSON.stringify(recentLogs.map(l => ({
        date: new Date(l.timestamp).toLocaleDateString(),
        mode: l.mode,
        duration: Math.round(l.durationSeconds / 60) + ' mins',
        topic: l.topic,
        tags: l.tags.join(', ')
      })))}
      
      Please provide a concise, markdown-formatted response with:
      1. A brief analysis of their deep work habits (Focus vs Break balance).
      2. Specific advice to improve learning retention for the topic "${currentTopic}".
      3. A suggested "Power Schedule" for their next session.
      
      Keep the tone encouraging but analytical. Use emojis sparingly.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: {
        systemInstruction: "You are a world-class cognitive science expert specializing in learning efficiency.",
        thinkingConfig: { thinkingBudget: 1024 } // Use thinking for deeper analysis
      }
    });

    return response.text || "Unable to generate insights at this time.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "AI service is currently unavailable. Please check your API key.";
  }
};

export const generateTopicSuggestions = async (
  interest: string
): Promise<string[]> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Suggest 5 advanced sub-topics or related skills for someone learning "${interest}".`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      }
    });

    const text = response.text || "[]";
    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini Topic Error:", error);
    return [];
  }
};

export const createChatSession = () => {
  return ai.chats.create({
    model: 'gemini-3-pro-preview',
    config: {
      systemInstruction: "You are an expert DevOps Sensei and AI mentor named 'Dojo AI'. Your goal is to help the user master DevOps concepts, create learning roadmaps, explain complex architectures, and provide mindmap structures. Be concise, technical, and practical. Use Markdown for formatting code, lists, and tables.",
    }
  });
};