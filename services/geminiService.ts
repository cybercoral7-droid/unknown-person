
import { GoogleGenAI, Type } from "@google/genai";
import { Dish } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const dishDetailsSchema = {
  type: Type.OBJECT,
  properties: {
    name: {
      type: Type.STRING,
      description: 'The official name of the dish.'
    },
    description: {
      type: Type.STRING,
      description: 'A captivating and appetizing paragraph about the dish, its origin, and its flavor profile.'
    },
    ingredients: {
      type: Type.ARRAY,
      items: {
        type: Type.STRING
      },
      description: 'An array of strings, where each string is a single ingredient with its quantity (e.g., "2 cups all-purpose flour").'
    },
    recipe: {
      type: Type.ARRAY,
      items: {
        type: Type.STRING
      },
      description: 'An array of strings, where each string is a single, clear step in the cooking process.'
    },
  },
  required: ['name', 'description', 'ingredients', 'recipe'],
};

export const fetchDishDetails = async (dishName: string): Promise<Dish> => {
    try {
        const prompt = `Provide detailed information for the dish: "${dishName}". Your response must be in JSON format.`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: dishDetailsSchema,
            },
        });

        const text = response.text.trim();
        return JSON.parse(text) as Dish;
    } catch (error) {
        console.error("Error fetching dish details:", error);
        throw new Error("Failed to fetch dish details from Gemini API.");
    }
};

export const fetchDishImages = async (dishName: string): Promise<string[]> => {
    try {
        const response = await ai.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: `Photorealistic, delicious-looking professional food photography of ${dishName}, beautifully plated and ready to eat.`,
            config: {
                numberOfImages: 4,
                outputMimeType: 'image/jpeg',
                aspectRatio: '4:3',
            },
        });

        return response.generatedImages.map(img => `data:image/jpeg;base64,${img.image.imageBytes}`);
    } catch (error) {
        console.error("Error fetching dish images:", error);
        throw new Error("Failed to fetch dish images from Gemini API.");
    }
};
