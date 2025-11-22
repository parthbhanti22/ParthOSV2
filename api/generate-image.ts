import { GoogleGenAI } from '@google/genai';

export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers: { 'Content-Type': 'application/json' } });
  }

  try {
    const { prompt } = await req.json();
    if (!prompt) {
        return new Response(JSON.stringify({ error: 'Prompt is required' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
    const response = await ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: prompt,
        config: {
          numberOfImages: 1,
          outputMimeType: 'image/jpeg',
          aspectRatio: '1:1',
        },
    });

    const firstImage = response.generatedImages?.[0];
    if (firstImage?.image?.imageBytes) {
        const base64ImageBytes = firstImage.image.imageBytes;
        const imageUrl = `data:image/jpeg;base64,${base64ImageBytes}`;
        return new Response(JSON.stringify({ imageUrl }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    } else {
        return new Response(JSON.stringify({ error: 'Image generation failed. No images were returned.' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }

  } catch (error: any) {
    console.error("Error in generate-image API:", error);
    return new Response(JSON.stringify({ error: 'An error occurred during image generation.', details: error.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}

export const config = {
  runtime: 'edge',
};