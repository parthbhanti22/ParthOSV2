import React, { useRef, useEffect, useState, useCallback } from 'react';

const COLORS = ["#000000", "#FF0000", "#0000FF", "#00FF00", "#FFFF00", "#FFFFFF"];
const SIZES = [2, 5, 10, 20];

const Paint: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState(COLORS[0]);
  const [size, setSize] = useState(SIZES[1]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const context = canvas.getContext('2d');
      if (context) {
        context.lineCap = 'round';
        context.lineJoin = 'round';
        contextRef.current = context;
        
        // Set canvas size based on parent to avoid blurriness
        const parent = canvas.parentElement;
        if (parent) {
            canvas.width = parent.clientWidth;
            canvas.height = parent.clientHeight;
        }
      }
    }
  }, []);
  
  useEffect(() => {
      if (contextRef.current) {
          contextRef.current.strokeStyle = color;
          contextRef.current.lineWidth = size;
      }
  }, [color, size]);

  const startDrawing = useCallback(({ nativeEvent }: React.MouseEvent) => {
    const { offsetX, offsetY } = nativeEvent;
    if (contextRef.current) {
      contextRef.current.beginPath();
      contextRef.current.moveTo(offsetX, offsetY);
      setIsDrawing(true);
    }
  }, []);

  const finishDrawing = useCallback(() => {
    if (contextRef.current) {
      contextRef.current.closePath();
      setIsDrawing(false);
    }
  }, []);

  const draw = useCallback(({ nativeEvent }: React.MouseEvent) => {
    if (!isDrawing || !contextRef.current) {
      return;
    }
    const { offsetX, offsetY } = nativeEvent;
    contextRef.current.lineTo(offsetX, offsetY);
    contextRef.current.stroke();
  }, [isDrawing]);
  
  const clearCanvas = () => {
      const canvas = canvasRef.current;
      const context = contextRef.current;
      if (canvas && context) {
          context.clearRect(0, 0, canvas.width, canvas.height);
      }
  };

  return (
    <div className="w-full h-full flex flex-col bg-gray-300">
      <div className="p-1 bg-gray-200 flex items-center justify-between border-b border-gray-400">
        <div className="flex items-center space-x-2">
            {COLORS.map(c => (
                <button key={c} style={{ backgroundColor: c }} onClick={() => setColor(c)} className={`w-6 h-6 rounded-full border-2 ${color === c ? 'border-blue-500' : 'border-gray-400'}`}></button>
            ))}
            <span className="w-px h-6 bg-gray-400 mx-2" />
             {SIZES.map(s => (
                <button key={s} onClick={() => setSize(s)} className={`flex items-center justify-center w-6 h-6 rounded-full ${size === s ? 'bg-blue-500' : 'bg-gray-400'}`}>
                    <div style={{width: s+2, height: s+2}} className="bg-black rounded-full" />
                </button>
            ))}
        </div>
        <button onClick={clearCanvas} className="px-3 py-1 text-xs bg-gray-600 text-white rounded hover:bg-gray-700">Clear</button>
      </div>
      <div className="flex-grow w-full h-full bg-white">
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseUp={finishDrawing}
          onMouseOut={finishDrawing}
          onMouseMove={draw}
          className="w-full h-full"
        />
      </div>
    </div>
  );
};

export default Paint;
