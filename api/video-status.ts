import { GoogleGenAI } from '@google/genai';

// Helper to fetch the video and convert to a data URL
const fetchVideoAsDataURL = async (uri: string, apiKey: string): Promise<string> => {
  const response = await fetch(`${uri}&key=${apiKey}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch video: ${response.statusText}`);
  }
  const blob = await response.blob();
  const buffer = await blob.arrayBuffer();
  
  // Convert ArrayBuffer to base64 string using standard Web APIs (Edge compatible)
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  const base64 = btoa(binary);
  
  return `data:${blob.type};base64,${base64}`;
};


export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers: { 'Content-Type': 'application/json' } });
  }

  try {
    let { operation: initialOperation } = await req.json();

    if (!initialOperation) {
        return new Response(JSON.stringify({ error: 'Operation data is required' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }
    
    const apiKey = process.env.API_KEY as string;
    const ai = new GoogleGenAI({ apiKey });

    const updatedOperation = await ai.operations.getVideosOperation({ operation: initialOperation });

    if (updatedOperation.done) {
      const downloadLink = updatedOperation.response?.generatedVideos?.[0]?.video?.uri;
      if (downloadLink) {
        const videoDataUrl = await fetchVideoAsDataURL(downloadLink, apiKey);
        return new Response(JSON.stringify({ done: true, videoUrl: videoDataUrl }), { status: 200, headers: { 'Content-Type': 'application/json' } });
      } else {
        throw new Error("Video URI not found in completed operation.");
      }
    } else {
      return new Response(JSON.stringify({ done: false, operation: updatedOperation }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }

  } catch (error: any) {
    console.error("Error in video-status API:", error);
    return new Response(JSON.stringify({ error: 'Failed to get video status.', details: error.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}


export const config = {
  runtime: 'edge',
};