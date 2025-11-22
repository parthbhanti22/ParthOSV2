import React from 'react';
import { useAudio } from '../hooks/useAudio';

interface DesktopIconProps {
  // FIX: Replaced JSX.Element with React.ReactElement to resolve 'Cannot find namespace JSX' error.
  icon: React.ReactElement;
  title: string;
  onDoubleClick: () => void;
}

const DesktopIcon: React.FC<DesktopIconProps> = ({ icon, title, onDoubleClick }) => {
  const playAudio = useAudio();
  
  const handleDoubleClick = () => {
    onDoubleClick();
  };
  
  return (
    <button
      onDoubleClick={handleDoubleClick}
      onClick={() => playAudio('click')}
      className="flex flex-col items-center justify-center w-24 h-24 text-white text-center cursor-pointer group"
    >
      <div className="w-12 h-12 p-1 group-hover:bg-blue-500/30 group-focus:bg-blue-500/50 rounded-md transition-colors">
        {icon}
      </div>
      <span className="mt-1 text-sm shadow-black [text-shadow:1px_1px_2px_var(--tw-shadow-color)] group-hover:underline">
        {title}
      </span>
    </button>
  );
};

export default DesktopIcon;
