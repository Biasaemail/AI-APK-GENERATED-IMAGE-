
import { GoogleGenAI, Modality, GenerateContentResponse } from "@google/genai";

const API_KEY = process.env.API_KEY;
if (!API_KEY) {
  throw new Error("The API_KEY environment variable is not set. Please set it in your environment.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });
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
    const response = await ai.models.generateContent({
      model: model,
      contents: {
        parts: [{ text: prompt }],
      },
      config: {
        responseModalities: [Modality.IMAGE],
      },
    });
    return extractImageData(response);
  } catch (error) {
    console.error("Error generating image:", error);
    throw new Error("Failed to generate the image. The prompt may have been blocked or an API error occurred.");
  }
};


export const editImage = async (
  prompt: string,
  image: { data: string; mimeType: string }
): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
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
    return extractImageData(response);
  } catch (error) {
    console.error("Error editing image:", error);
    throw new Error("Failed to edit the image. The prompt may have been blocked or an API error occurred.");
  }
};
