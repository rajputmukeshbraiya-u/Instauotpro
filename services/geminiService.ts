
import { GoogleGenAI, Type } from "@google/genai";

export class GeminiService {
  private static getAI() {
    return new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  }

  static async generatePostImage(prompt: string): Promise<string | null> {
    try {
      const ai = this.getAI();
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [{ text: prompt }]
        },
        config: {
          imageConfig: {
            aspectRatio: "1:1"
          }
        }
      });

      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
      return null;
    } catch (error) {
      console.error("Error generating image:", error);
      return null;
    }
  }

  static async generateReel(prompt: string): Promise<string | null> {
    try {
      const ai = this.getAI();
      let operation = await ai.models.generateVideos({
        model: 'veo-3.1-fast-generate-preview',
        prompt: prompt,
        config: {
          numberOfVideos: 1,
          resolution: '720p',
          aspectRatio: '9:16'
        }
      });

      while (!operation.done) {
        await new Promise(resolve => setTimeout(resolve, 5000));
        operation = await ai.operations.getVideosOperation({ operation: operation });
      }

      const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
      if (!downloadLink) return null;

      const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
      const blob = await response.blob();
      return URL.createObjectURL(blob);
    } catch (error) {
      console.error("Error generating video:", error);
      return null;
    }
  }

  static async generateCaption(description: string): Promise<string> {
    try {
      const ai = this.getAI();
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Create a catchy Instagram caption with hashtags for: ${description}`,
      });
      return response.text || "Fresh from InstaOut Pro! ✨";
    } catch (error) {
      return "Fresh from InstaOut Pro! ✨";
    }
  }

  static async generatePostMetadataBatch(count: number = 3): Promise<any[]> {
    try {
      const ai = this.getAI();
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Generate ${count} diverse Instagram post ideas. For each, provide a username, a full name, a verified status (boolean), a short image prompt (visual description), and a caption. Return as a JSON array of objects.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                username: { type: Type.STRING },
                fullName: { type: Type.STRING },
                isVerified: { type: Type.BOOLEAN },
                imagePrompt: { type: Type.STRING },
                caption: { type: Type.STRING }
              },
              required: ["username", "fullName", "isVerified", "imagePrompt", "caption"]
            }
          }
        }
      });

      return JSON.parse(response.text || '[]');
    } catch (error) {
      console.error("Error generating metadata batch:", error);
      return [];
    }
  }
}
