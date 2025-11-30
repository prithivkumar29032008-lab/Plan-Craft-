import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const modelId = "gemini-2.5-flash";

export const generateSubtasks = async (projectDescription: string): Promise<{ title: string; priority: string }[]> => {
  try {
    const prompt = `Break down the following project description into 3-5 actionable tasks. Return a JSON array.
    Project: ${projectDescription}`;

    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING, description: "A concise title for the task" },
              priority: { type: Type.STRING, enum: ["low", "medium", "high"], description: "Suggested priority" }
            },
            required: ["title", "priority"]
          }
        }
      }
    });

    const text = response.text;
    if (!text) return [];
    return JSON.parse(text);
  } catch (error) {
    console.error("Failed to generate tasks", error);
    return [];
  }
};

export const getAiChatResponse = async (history: { role: string; parts: { text: string }[] }[], userMessage: string): Promise<string> => {
  try {
    const chat = ai.chats.create({
      model: modelId,
      history: history,
      config: {
        systemInstruction: "You are a helpful project management assistant named Neurotech AI. You help teams organize tasks, suggest workflows, and keep morale high. Keep responses concise."
      }
    });

    const result = await chat.sendMessage({ message: userMessage });
    return result.text || "I'm having trouble thinking right now.";
  } catch (error) {
    console.error("Chat error", error);
    return "Sorry, I couldn't process that request.";
  }
};

export const suggestRoutine = async (goal: string): Promise<{ title: string }[]> => {
   try {
    const prompt = `Suggest 3 daily routine habits for someone who wants to: ${goal}. Return JSON.`;

    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
            },
            required: ["title"]
          }
        }
      }
    });
    
    const text = response.text;
    if(!text) return [];
    return JSON.parse(text);
   } catch (error) {
     console.error("Routine error", error);
     return [];
   }
}