
import React, { useState, useRef, useEffect, useCallback } from 'react';

const Camera: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [photo, setPhoto] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // This function can now be stable as it operates on a ref.
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
      setIsCameraActive(false);
    }
  }, []);

  const startCamera = useCallback(async () => {
    // Stop any existing stream before starting a new one.
    stopCamera();
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      streamRef.current = mediaStream;
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setIsCameraActive(true);
      setError(null);
      setPhoto(null); // Reset photo on restart
    } catch (err) {
      console.error("Error accessing camera:", err);
      setError("Could not access camera. Please ensure permissions are granted.");
      setIsCameraActive(false);
    }
  }, [stopCamera]);
  
  // This effect now has stable dependencies and will only run once on mount.
  useEffect(() => {
    startCamera();
    // The cleanup function for unmounting the component
    return () => {
      stopCamera();
    };
  }, [startCamera, stopCamera]);

  const takePhoto = () => {
    if (!videoRef.current || !canvasRef.current || !isCameraActive) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    
    if (context) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
      const dataUrl = canvas.toDataURL('image/png');
      setPhoto(dataUrl);
      stopCamera();
    }
  };

  const handleRetake = () => {
    startCamera();
  };

  return (
    <div className="w-full h-full bg-gray-900 flex flex-col items-center justify-center p-2 text-white">
      {error && <div className="text-red-400 mb-4 text-center">{error}</div>}
      
      <div className="w-full flex-grow relative bg-black rounded-md overflow-hidden flex items-center justify-center">
        {photo ? (
          <img src={photo} alt="Captured" className="max-w-full max-h-full object-contain" />
        ) : (
          <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
        )}
        {!isCameraActive && !photo && !error && (
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-100"></div>
                <p className="ml-3">Starting camera...</p>
            </div>
        )}
      </div>
      
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      
      <div className="mt-2 flex space-x-4">
        {photo ? (
          <>
            <button onClick={handleRetake} className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-500">
              Retake
            </button>
            <a href={photo} download="parth-os-capture.png" className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-500">
              Download
            </a>
          </>
        ) : (
          <button onClick={takePhoto} disabled={!isCameraActive} className="w-16 h-16 bg-white rounded-full border-4 border-gray-500 hover:border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"></button>
        )}
      </div>
    </div>
  );
};

export default Camera;
