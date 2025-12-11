import { GoogleGenAI } from "@google/genai";

// Initialize the client with the API key from the environment
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Generates text content based on a prompt using Gemini Flash.
 * Used for generating blog posts, descriptions, etc.
 */
export const generateText = async (prompt: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    
    return response.text || "";
  } catch (error) {
    console.error("AI Generation Error:", error);
    throw new Error("Failed to generate content. Please check your API key and try again.");
  }
};

/**
 * Generates an image based on a prompt using Gemini Flash Image.
 * Returns a base64 data URL.
 */
export const generateImage = async (prompt: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: prompt }]
      },
      config: {
        imageConfig: {
          aspectRatio: "16:9",
        }
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData && part.inlineData.data) {
        const mimeType = part.inlineData.mimeType || 'image/png';
        return `data:${mimeType};base64,${part.inlineData.data}`;
      }
    }
    
    throw new Error("No image content found in response");
  } catch (error) {
    console.error("AI Image Generation Error:", error);
    throw new Error("Failed to generate image. Please check your API key and try again.");
  }
};
