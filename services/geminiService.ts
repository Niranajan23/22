
import { GoogleGenAI, Type, Schema } from "@google/genai";
import { PresentationData } from '../types';

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const slideSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    title: {
      type: Type.STRING,
      description: "The headline/title of the slide.",
    },
    bullets: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "3-5 concise bullet points summarizing key information for this slide.",
    },
    speakerNotes: {
      type: Type.STRING,
      description: "Detailed speaker notes explaining the bullet points.",
    },
  },
  required: ["title", "bullets", "speakerNotes"],
};

const presentationSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    topic: {
      type: Type.STRING,
      description: "The main topic or title of the entire presentation.",
    },
    summary: {
      type: Type.STRING,
      description: "A brief 1-sentence summary of what the document is about.",
    },
    slides: {
      type: Type.ARRAY,
      items: slideSchema,
      description: "An array of 5 to 10 slides extracted from the content.",
    },
  },
  required: ["topic", "summary", "slides"],
};

export const generatePresentationContent = async (base64Data: string): Promise<PresentationData> => {
  try {
    // Gemini 2.5 Flash supports native PDF understanding
    const model = 'gemini-2.5-flash';

    const prompt = `
      You are an expert presentation designer. 
      Analyze the attached PDF document and create a structured presentation.
      
      Guidelines:
      1. Identify the core topic and main takeaway.
      2. Create 5 to 12 slides depending on the depth of the content.
      3. Make the slide titles catchy and professional.
      4. Ensure bullet points are concise (under 15 words each).
      5. Include speaker notes for better context.
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: "application/pdf",
              data: base64Data
            }
          },
          {
            text: prompt
          }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: presentationSchema,
        // Higher temperature for a bit more creative titles, but still grounded
        temperature: 0.3, 
      },
    });

    const responseText = response.text;
    if (!responseText) {
      throw new Error("No content generated from Gemini.");
    }

    const data = JSON.parse(responseText) as PresentationData;
    return data;

  } catch (error: any) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to analyze content with AI. " + (error.message || ""));
  }
};
