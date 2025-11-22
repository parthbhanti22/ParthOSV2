import { GoogleGenAI } from '@google/genai';

export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers: { 'Content-Type': 'application/json' } });
  }

  try {
    const { prompt, aspectRatio, resolution } = await req.json();

    if (!prompt) {
      return new Response(JSON.stringify({ error: 'Prompt is required' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }
    
    // Note: The API key is used here on the server, not passed from the client.
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

    const operation = await ai.models.generateVideos({
      model: 'veo-3.1-fast-generate-preview',
      prompt: prompt,
      config: {
        numberOfVideos: 1,
        resolution: resolution,
        aspectRatio: aspectRatio,
      }
    });
    
    return new Response(JSON.stringify({ operation }), { status: 202, headers: { 'Content-Type': 'application/json' } });

  } catch (error: any) {
    console.error("Error in generate-video API:", error);
    return new Response(JSON.stringify({ error: 'Failed to start video generation.', details: error.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}

export const config = {
  runtime: 'edge',
};