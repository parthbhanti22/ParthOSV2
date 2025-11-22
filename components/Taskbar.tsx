
import React, { useState, useEffect } from 'react';
import type { WindowInstance } from '../types';
import { APPS } from '../constants';
import { useAudio } from '../hooks/useAudio';

interface TaskbarProps {
  openWindows: WindowInstance[];
  activeWindowId: string | null;
  onTaskbarItemClick: (id: string) => void;
  toggleStartMenu: () => void;
}

const Clock: React.FC = () => {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timerId = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timerId);
    }, []);

    return (
        <div className="text-center text-xs px-2">
            <div>{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
            <div>{time.toLocaleDateString([], { year: 'numeric', month: '2-digit', day: '2-digit' })}</div>
        </div>
    );
};

const Taskbar: React.FC<TaskbarProps> = ({ openWindows, activeWindowId, onTaskbarItemClick, toggleStartMenu }) => {
  const getAppIcon = (appId: string) => {
    return APPS.find(app => app.id === appId)?.icon;
  };

  const playAudio = useAudio();

  return (
    <footer className="absolute bottom-0 left-0 right-0 h-10 taskbar-gradient backdrop-blur-sm border-t border-white/20 flex items-center justify-between text-white shadow-2xl z-[10000]">
      <div className="flex items-center h-full">
        <button
          onClick={() => {
            playAudio('click');
            toggleStartMenu();
          }}
          className="h-10 w-10 flex items-center justify-center rounded-full m-1 start-button-orb"
          aria-label="Start Menu"
        >
          <svg viewBox="0 0 200 200" className="w-6 h-6">
            <path fill="#f74b28" d="M 52,52 L 95,52 L 95,95 L 52,95 Z"></path>
            <path fill="#80c342" d="M 105,52 L 148,52 L 148,95 L 105,95 Z"></path>
            <path fill="#05a5ef" d="M 52,105 L 95,105 L 95,148 L 52,148 Z"></path>
            <path fill="#ffb904" d="M 105,105 L 148,105 L 148,148 L 105,148 Z"></path>
          </svg>
        </button>
        <div className="flex items-center h-full">
          {openWindows.map(win => (
            <button
              key={win.id}
              onClick={() => onTaskbarItemClick(win.id)}
              className={`flex items-center h-full px-3 transition-colors ${activeWindowId === win.id ? 'bg-blue-500/50' : 'hover:bg-white/20'}`}
              title={win.title}
            >
              <div className="w-5 h-5">
                {getAppIcon(win.appId)}
              </div>
            </button>
          ))}
        </div>
      </div>
      <div className="flex items-center justify-center h-full border-l border-white/20 px-2">
        <Clock />
      </div>
    </footer>
  );
};

export default Taskbar;
