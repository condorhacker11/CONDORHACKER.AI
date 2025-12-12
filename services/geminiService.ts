import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { SYSTEM_PROMPT } from '../constants';
import { AgentConfig } from '../types';

let chatSession: Chat | null = null;
let genAI: GoogleGenAI | null = null;

const initializeGenAI = () => {
  if (!process.env.API_KEY) {
    console.error("API_KEY environment variable is missing.");
    return null;
  }
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const getChatSession = (): Chat => {
  if (!chatSession) {
    genAI = initializeGenAI();
    if (!genAI) {
      throw new Error("Failed to initialize GoogleGenAI. Check API Key.");
    }
    chatSession = genAI.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: SYSTEM_PROMPT,
        temperature: 0.7,
        topP: 0.9,
      },
    });
  }
  return chatSession;
};

export const resetChatSession = () => {
  chatSession = null;
};

export const sendMessageStream = async (message: string) => {
  const session = getChatSession();
  try {
    const result = await session.sendMessageStream({ message });
    return result;
  } catch (error) {
    console.error("Error sending message to Gemini:", error);
    throw error;
  }
};

export const generateAgentImage = async (agentConfig: AgentConfig): Promise<string | null> => {
  const ai = initializeGenAI();
  if (!ai) return null;

  try {
    // Prompt specifico per generare un volto umano coerente con lo stile dell'app
    const prompt = `Close-up hyper-realistic portrait of ${agentConfig.personaName}, a ${agentConfig.gender} expert in ${agentConfig.description}. 
    Professional headshot, human face, highly detailed, 8k resolution, cinematic lighting, dark moody cyberpunk background, looking directly at camera. 
    Unique facial features, serious and professional expression.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image', // Nano Banana model
      contents: {
        parts: [
          { text: prompt }
        ]
      },
      config: {
        // Nano banana does not support responseMimeType or responseSchema
      }
    });

    // Extract image from response
    if (response.candidates && response.candidates[0].content.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
           return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
    }
    
    return null;
  } catch (error) {
    console.error("Error generating agent image:", error);
    return null;
  }
};