
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI } from '@google/genai';

const LOADING_MESSAGES = [
    "Warming up the quantum processors...",
    "Teaching pixels to dance...",
    "Reticulating splines...",
    "Composing a digital symphony...",
    "Unleashing creative photons...",
    "Polishing the final cut..."
];

const VideoGenerator: React.FC = () => {
    const [prompt, setPrompt] = useState('');
    const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16'>('16:9');
    const [resolution, setResolution] = useState<'720p' | '1080p'>('720p');
    const [videoUrl, setVideoUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState('');
    const [error, setError] = useState<string | null>(null);
    // On Vercel, the key is injected via build process, so we assume it's present.
    const hasApiKey = !!process.env.API_KEY;
    
    useEffect(() => {
        let messageInterval: number;
        if (isLoading) {
            messageInterval = window.setInterval(() => {
                setLoadingMessage(LOADING_MESSAGES[Math.floor(Math.random() * LOADING_MESSAGES.length)]);
            }, 2500);
        }
        return () => {
            window.clearInterval(messageInterval);
        };
    }, [isLoading]);

    const handleGenerate = async () => {
        if (!prompt.trim()) {
            setError('Please enter a prompt.');
            return;
        }
        
        if (!hasApiKey) {
            setError('API Key not configured in environment variables.');
            return;
        }

        setIsLoading(true);
        setError(null);
        setVideoUrl(null);
        setLoadingMessage(LOADING_MESSAGES[0]);

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

            let operation = await ai.models.generateVideos({
                model: 'veo-3.1-fast-generate-preview',
                prompt: prompt,
                config: {
                    numberOfVideos: 1,
                    resolution: resolution,
                    aspectRatio: aspectRatio,
                }
            });
            
            // Poll for completion
            while (!operation.done) {
              await new Promise(resolve => setTimeout(resolve, 10000));
              operation = await ai.operations.getVideosOperation({operation: operation});
            }
            
            const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
            if (downloadLink) {
                 // The response.body contains the MP4 bytes. You must append an API key when fetching from the download link.
                 const res = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
                 const blob = await res.blob();
                 const url = URL.createObjectURL(blob);
                 setVideoUrl(url);
            } else {
                throw new Error("Video generation finished but no video URI was returned.");
            }

        } catch (err: any) {
            console.error(err);
            setError(err.message || 'An error occurred during video generation. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    if (!hasApiKey) {
        return (
             <div className="p-4 h-full flex flex-col items-center justify-center bg-gray-200">
                <h2 className="text-lg font-bold mb-3 text-gray-700">Veo Video Studio</h2>
                <p className="mb-4 text-gray-600 text-center max-w-xs">
                    API Key is missing. Please add <code>API_KEY</code> to your Vercel Environment Variables.
                </p>
             </div>
        );
    }

    return (
        <div className="p-4 h-full flex flex-col items-center bg-gray-200">
            <div className="w-full flex justify-between items-center mb-3">
                <h2 className="text-lg font-bold text-gray-700">Veo Video Studio</h2>
            </div>
            
            <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g., A neon hologram of a cat driving at top speed"
                className="w-full h-24 p-2 border rounded-md mb-3 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isLoading}
            />
            <div className="w-full grid grid-cols-2 gap-3 mb-3">
                <div>
                    <label className="text-sm font-medium text-gray-600">Aspect Ratio</label>
                    <select value={aspectRatio} onChange={(e) => setAspectRatio(e.target.value as any)} className="w-full p-2 border rounded-md" disabled={isLoading}>
                        <option value="16:9">16:9 (Landscape)</option>
                        <option value="9:16">9:16 (Portrait)</option>
                    </select>
                </div>
                <div>
                    <label className="text-sm font-medium text-gray-600">Resolution</label>
                    <select value={resolution} onChange={(e) => setResolution(e.target.value as any)} className="w-full p-2 border rounded-md" disabled={isLoading}>
                        <option value="720p">720p</option>
                        <option value="1080p">1080p</option>
                    </select>
                </div>
            </div>
            <button
                onClick={handleGenerate}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-blue-400 transition-colors"
                disabled={isLoading}
            >
                {isLoading ? 'Generating Video...' : 'Generate Video'}
            </button>

            {error && <p className="text-red-500 mt-3 text-center text-sm">{error}</p>}

            <div className="w-full flex-grow mt-4 bg-black rounded-lg flex items-center justify-center overflow-hidden border border-gray-400 relative">
                {isLoading && (
                    <div className="text-white text-center p-4">
                         <svg className="animate-spin h-8 w-8 text-white mx-auto mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <p>{loadingMessage}</p>
                        <p className="text-xs text-gray-400 mt-2">(This may take a few minutes)</p>
                    </div>
                )}
                {videoUrl && !isLoading && (
                    <video src={videoUrl} controls autoPlay loop className="w-full h-full object-contain" />
                )}
                 {!videoUrl && !isLoading && (
                    <p className="text-gray-400">Your generated video will appear here</p>
                )}
            </div>
        </div>
    );
};

export default VideoGenerator;
