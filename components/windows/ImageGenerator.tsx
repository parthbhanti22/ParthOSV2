
import React, { useState } from 'react';
import { GoogleGenAI } from '@google/genai';

const ImageGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt.');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setImageUrl(null);

    try {
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
          const url = `data:image/jpeg;base64,${base64ImageBytes}`;
          setImageUrl(url);
      } else {
          setError('Image generation failed. No images were returned.');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An error occurred during image generation. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 h-full flex flex-col items-center bg-gray-200">
      <h2 className="text-lg font-bold mb-3 text-gray-700">Imagen AI Art Studio</h2>
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="e.g., A robot holding a red skateboard in a pop-art style"
        className="w-full h-24 p-2 border rounded-md mb-3 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
        disabled={isLoading}
      />
      <button
        onClick={handleGenerate}
        className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-blue-400 transition-colors"
        disabled={isLoading}
      >
        {isLoading ? 'Generating...' : 'Generate Image'}
      </button>

      {error && <p className="text-red-500 mt-3">{error}</p>}

      <div className="w-full flex-grow mt-4 bg-gray-800/50 rounded-lg flex items-center justify-center overflow-hidden border">
        {isLoading && (
          <div className="text-white">
            <svg className="animate-spin h-8 w-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        )}
        {imageUrl && !isLoading && (
          <img src={imageUrl} alt="Generated AI" className="w-full h-full object-contain" />
        )}
        {!imageUrl && !isLoading && (
            <p className="text-gray-400">Your generated image will appear here</p>
        )}
      </div>
    </div>
  );
};

export default ImageGenerator;
