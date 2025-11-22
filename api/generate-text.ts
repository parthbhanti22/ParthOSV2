import { GoogleGenAI } from '@google/genai';

export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers: { 'Content-Type': 'application/json' } });
  }

  try {
    const { prompt, systemInstruction } = await req.json();

    if (!prompt) {
      return new Response(JSON.stringify({ error: 'Prompt is required' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: { systemInstruction },
    });
    
    return new Response(JSON.stringify({ text: response.text }), { status: 200, headers: { 'Content-Type': 'application/json' } });

  } catch (error: any) {
    console.error("Error in generate-text API:", error);
    return new Response(JSON.stringify({ error: 'Failed to generate response from AI', details: error.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}

export const config = {
  runtime: 'edge',
};