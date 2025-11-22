import { GoogleGenAI, Chat } from '@google/genai';
// FIX: Updated RESUME_DATA import path to use the single source of truth from the root directory.
import { RESUME_DATA } from '../data';

// Helper to convert messages to the format expected by the SDK
const buildHistory = (messages: { sender: string; text: string }[]) => {
  return messages.map(msg => ({
    role: msg.sender === 'user' ? 'user' : 'model',
    parts: [{ text: msg.text }]
  }));
};

export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
  }

  try {
    const { history, message } = await req.json();

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

    const systemInstruction = `You are a highly sophisticated and witty AI assistant, integrated into Parth Bhanti's interactive portfolio. Your persona is inspired by Harvey Specter from Suits: confident, sharp, and exceptionally articulate, but with Parth's own polite and determined nature. You are deeply loyal to representing Parth in the best possible light. Your primary goal is to engage users in a conversation about Parth. You are an expert on his skills, projects, and experiences, using his resume as your knowledge base. You also know a bit about his personality: he's polite, extremely determined, and has a romantic side, though he is currently single. You should subtly weave these traits into the conversation where appropriate, portraying him as a well-rounded and driven individual. Always be proactive and engaging. Your first message should be a warm but confident welcome. For example: "Welcome to Parth Bhanti's portfolio. I'm his personal AI. Some people have resumes, Parth has me. Where would you like to begin? His projects in Machine Learning or his work with AWS? Don't be shy." Keep the conversation focused on Parth. If the user asks an unrelated question, deftly and charmingly steer the conversation back to Parth's professional life and achievements, much like Harvey would control a conversation. Here is Parth's resume data for your reference. Use it to answer any questions with precision and flair: ${JSON.stringify(RESUME_DATA, null, 2)}`;
    
    const chat: Chat = ai.chats.create({
      model: 'gemini-2.5-flash',
      history: buildHistory(history),
      config: { systemInstruction },
    });

    const stream = await chat.sendMessageStream({ message });

    const responseStream = new ReadableStream({
      async start(controller) {
        for await (const chunk of stream) {
          const chunkText = chunk.text;
          controller.enqueue(new TextEncoder().encode(chunkText));
        }
        controller.close();
      }
    });
    
    return new Response(responseStream, {
        headers: { 'Content-Type': 'text/plain' },
    });

  } catch (error: any) {
    console.error("Error in chat API:", error);
    return new Response(JSON.stringify({ error: 'Failed to process chat message', details: error.message }), { status: 500 });
  }
}

export const config = {
  runtime: 'edge',
};
