import { GoogleGenAI, Modality, GenerateContentResponse } from "@google/genai";

// --- Singleton pattern for the GoogleGenAI client ---
let aiInstance: GoogleGenAI | null = null;
const getAiClient = (): GoogleGenAI => {
  if (!aiInstance) {
    // This will now only be called when needed, preventing a startup crash.
    aiInstance = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }
  return aiInstance;
};

// Simple retry utility with exponential backoff
const withRetry = async <T>(apiCall: () => Promise<T>, maxRetries = 2): Promise<T> => {
    let attempt = 0;
    while (attempt < maxRetries) {
        try {
            return await apiCall();
        } catch (error) {
            attempt++;
            if (attempt >= maxRetries) {
                console.error(`API call failed after ${maxRetries} attempts.`, error);
                throw error;
            }
            const delay = Math.pow(2, attempt) * 200; // e.g., 400ms, 800ms
            console.warn(`API call failed, retrying in ${delay}ms... (Attempt ${attempt})`);
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
    // This line should not be reachable, but is needed for type safety
    throw new Error("Retry logic failed unexpectedly.");
};

const model = 'gemini-2.5-flash-image';

const extractImageData = (response: GenerateContentResponse): string => {
  for (const candidate of response.candidates) {
    for (const part of candidate.content.parts) {
      if (part.inlineData) {
        const base64ImageBytes: string = part.inlineData.data;
        const mimeType = part.inlineData.mimeType;
        return `data:${mimeType};base64,${base64ImageBytes}`;
      }
    }
  }
  throw new Error("No image data was found in the API response.");
};


export const generateImage = async (prompt: string): Promise<string> => {
  try {
    const ai = getAiClient();
    const apiCall = () => ai.models.generateContent({
      model: model,
      contents: {
        parts: [{ text: prompt }],
      },
      config: {
        responseModalities: [Modality.IMAGE],
      },
    });
    const response = await withRetry(apiCall);
    return extractImageData(response);
  } catch (error) {
    console.error("Error generating image:", error);
    throw new Error("Failed to generate image after multiple attempts. The AI service may be temporarily unavailable. Please try again later.");
  }
};


export const editImage = async (
  prompt: string,
  image: { data: string; mimeType: string }
): Promise<string> => {
  try {
    const ai = getAiClient();
    const apiCall = () => ai.models.generateContent({
      model: model,
      contents: {
        parts: [
          {
            inlineData: {
              data: image.data,
              mimeType: image.mimeType,
            },
          },
          {
            text: prompt,
          },
        ],
      },
      config: {
        responseModalities: [Modality.IMAGE],
      },
    });
    const response = await withRetry(apiCall);
    return extractImageData(response);
  } catch (error) {
    console.error("Error editing image:", error);
    throw new Error("Failed to edit image after multiple attempts. The AI service may be temporarily unavailable. Please try again later.");
  }
};