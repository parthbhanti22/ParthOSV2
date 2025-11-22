

import React, { useState, useRef, useEffect, useCallback } from 'react';

interface WindowProps {
  id: string;
  title: string;
  children: React.ReactNode;
  initialPosition: { x: number; y: number };
  initialSize: { width: number; height: number };
  zIndex: number;
  isActive: boolean;
  onClose: () => void;
  onMinimize: () => void;
  onFocus: () => void;
  onPositionChange: (pos: {x: number; y: number}) => void;
}

const Window: React.FC<WindowProps> = ({
  id,
  title,
  children,
  initialPosition,
  initialSize,
  zIndex,
  isActive,
  onClose,
  onMinimize,
  onFocus,
  onPositionChange,
}) => {
  const [position, setPosition] = useState(initialPosition);
  const isDragging = useRef(false);
  const dragStartPos = useRef({ x: 0, y: 0 });
  const [isClosing, setIsClosing] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(onClose, 150); // Match animation duration
  };

  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    onFocus();
    isDragging.current = true;
    dragStartPos.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
  }, [onFocus, position]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging.current) return;
    const newX = e.clientX - dragStartPos.current.x;
    const newY = e.clientY - dragStartPos.current.y;
    setPosition({ x: newX, y: newY });
  }, []);

  const handleMouseUp = useCallback(() => {
    if(isDragging.current) {
        onPositionChange(position);
    }
    isDragging.current = false;
  }, [position, onPositionChange]);

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);
  
  const animationClass = isMounted && !isClosing ? 'window-enter-active' : 'window-exit-active';

  return (
    <div
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: `${initialSize.width}px`,
        height: `${initialSize.height}px`,
        zIndex: zIndex,
      }}
      className={`absolute bg-white/70 backdrop-blur-lg rounded-lg shadow-2xl border border-gray-400/50 flex flex-col window-enter ${animationClass}`}
      onMouseDown={onFocus}
    >
      <header
        className={`flex items-center justify-between p-1 rounded-t-md cursor-grab relative ${isActive ? 'window-title-gradient text-black' : 'window-title-gradient-inactive text-gray-600'}`}
        onMouseDown={handleMouseDown}
      >
        <h2 className="text-sm font-semibold pl-2 relative z-10">{title}</h2>
        <div className="flex items-center space-x-1 relative z-10">
          <button onClick={onMinimize} className="w-6 h-6 hover:bg-white/30 rounded text-black">_</button>
          <button onClick={handleClose} className="w-6 h-6 hover:bg-red-500 hover:text-white rounded font-bold">✕</button>
        </div>
      </header>
      <div className="flex-grow p-2 overflow-auto bg-gray-100 rounded-b-lg">
        {children}
      </div>
    </div>
  );
};

export default Window;
