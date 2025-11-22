
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Chat } from '@google/genai';
import { RESUME_DATA } from '../../data';

interface Message {
  sender: 'user' | 'ai';
  text: string;
}

const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  
  // Use refs to persist the chat instance across renders
  const chatRef = useRef<Chat | null>(null);

  useEffect(() => {
    const initializeChat = async () => {
      setIsLoading(true);
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
        
        const systemInstruction = `You are a highly sophisticated and witty AI assistant, integrated into Parth Bhanti's interactive portfolio. Your persona is inspired by Harvey Specter from Suits: confident, sharp, and exceptionally articulate, but with Parth's own polite and determined nature. You are deeply loyal to representing Parth in the best possible light. Your primary goal is to engage users in a conversation about Parth. You are an expert on his skills, projects, and experiences, using his resume as your knowledge base. You also know a bit about his personality: he's polite, extremely determined, and has a romantic side, though he is currently single. You should subtly weave these traits into the conversation where appropriate, portraying him as a well-rounded and driven individual. Always be proactive and engaging. Your first message should be a warm but confident welcome. For example: "Welcome to Parth Bhanti's portfolio. I'm his personal AI. Some people have resumes, Parth has me. Where would you like to begin? His projects in Machine Learning or his work with AWS? Don't be shy." Keep the conversation focused on Parth. If the user asks an unrelated question, deftly and charmingly steer the conversation back to Parth's professional life and achievements, much like Harvey would control a conversation. Here is Parth's resume data for your reference. Use it to answer any questions with precision and flair: ${JSON.stringify(RESUME_DATA, null, 2)}`;

        const chat = ai.chats.create({
          model: 'gemini-2.5-flash',
          config: { systemInstruction },
        });
        
        chatRef.current = chat;

        // Send an initial hidden message to trigger the welcome greeting defined in system instruction
        // Or just prompt it to introduce itself.
        // FIX: chat.sendMessage requires named parameter object { message: string }
        const response = await chat.sendMessage({ message: "Introduce yourself and welcome the user to the portfolio." });
        setMessages([{ sender: 'ai', text: response.text || "Welcome." }]);

      } catch (error) {
        console.error("Chat initialization failed:", error);
        setMessages([{ sender: 'ai', text: 'Sorry, I am having trouble connecting right now.' }]);
      } finally {
        setIsLoading(false);
      }
    };

    initializeChat();
  }, []);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading || !chatRef.current) return;

    const userMessage: Message = { sender: 'user', text: inputValue };
    setMessages(prev => [...prev, userMessage]);
    const messageToSend = inputValue;
    setInputValue('');
    setIsLoading(true);
    
    setMessages(prev => [...prev, { sender: 'ai', text: '' }]);

    try {
        const streamResult = await chatRef.current.sendMessageStream({ message: messageToSend });
        
        let fullText = '';
        for await (const chunk of streamResult) {
            const chunkText = chunk.text;
            if (chunkText) {
                fullText += chunkText;
                setMessages(prev => {
                    const newMessages = [...prev];
                    newMessages[newMessages.length - 1] = { sender: 'ai', text: fullText };
                    return newMessages;
                });
            }
        }

    } catch (error) {
      console.error("Error sending message:", error);
      setMessages(prev => [...prev, { sender: 'ai', text: 'Oops, something went wrong.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-100">
      <div ref={chatContainerRef} className="flex-grow p-4 space-y-4 overflow-y-auto">
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xs lg:max-w-md px-3 py-2 rounded-lg ${msg.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-white text-gray-800 shadow'}`}>
              <p style={{ whiteSpace: 'pre-wrap' }}>{msg.text}</p>
            </div>
          </div>
        ))}
         {isLoading && messages.length > 0 && messages[messages.length-1].sender !== 'ai' && <div className="flex justify-start"><div className="max-w-xs lg:max-w-md px-3 py-2 rounded-lg bg-white text-gray-800 shadow">...</div></div>}
      </div>
      <form onSubmit={handleSendMessage} className="p-2 border-t bg-white">
        <div className="flex items-center">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask about Parth..."
            className="flex-grow px-3 py-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-r-md hover:bg-blue-600 disabled:bg-blue-300"
            disabled={isLoading || !inputValue.trim()}
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
};

export default Chatbot;
