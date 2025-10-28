import { GoogleGenAI, Type } from "@google/genai";
import { Dish } from '../types';

const getAiClient = () => {
    if (!process.env.API_KEY) {
        throw new Error("API_KEY environment variable not set. Please ensure it is configured.");
    }
    return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

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

const languageMap: { [key: string]: string } = {
  en: 'English',
  hi: 'Hindi',
  ur: 'Urdu',
};

export const fetchDishDetails = async (dishName: string, language: string): Promise<Dish> => {
    const ai = getAiClient();
    const targetLanguage = languageMap[language] || 'English';
    const prompt = `Provide detailed information for the dish: "${dishName}". Your response, including the name, description, ingredients, and recipe, must be in the ${targetLanguage} language. The entire response must be in JSON format.`;

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
};

export const fetchDishImages = async (dishName: string, dishDescription: string): Promise<string[]> => {
    const ai = getAiClient();
    const detailedPrompt = `Generate one single, hyper-realistic, mouth-watering photograph of the finished dish: ${dishName}. The style should be professional food photography for a high-end cooking magazine, focusing on natural lighting, appetizing details, and a clean presentation. ${dishDescription}`;
    
    const response = await ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: detailedPrompt,
        config: {
            numberOfImages: 1,
            outputMimeType: 'image/jpeg',
            aspectRatio: '4:3',
        },
    });

    return response.generatedImages.map(img => `data:image/jpeg;base64,${img.image.imageBytes}`);
};