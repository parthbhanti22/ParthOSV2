

import React, { useEffect, useRef } from 'react';
import { APPS } from '../constants';
import { useAudio } from '../hooks/useAudio';

interface StartMenuProps {
  openApp: (appId: string) => void;
  closeMenu: () => void;
}

const StartMenu: React.FC<StartMenuProps> = ({ openApp, closeMenu }) => {
    const menuRef = useRef<HTMLDivElement>(null);
    const playAudio = useAudio();

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                const startButton = (event.target as HTMLElement).closest('.start-button-orb');
                if(!startButton) {
                    closeMenu();
                }
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [closeMenu]);


  return (
    <div ref={menuRef} className="absolute bottom-10 left-0 w-80 h-[500px] bg-blue-900/80 backdrop-blur-md rounded-tr-lg border border-white/20 shadow-lg text-white z-[9999]">
        <div className="p-2 start-menu-gradient h-full flex flex-col">
            <div className="flex-grow overflow-y-auto">
                {APPS.map(app => (
                    <button
                    key={app.id}
                    onClick={() => {
                        playAudio('click');
                        openApp(app.id);
                    }}
                    className="w-full flex items-center p-2 text-left hover:bg-blue-500/50 rounded transition-colors"
                    >
                    <div className="w-8 h-8 mr-3">{app.icon}</div>
                    <span>{app.title}</span>
                    </button>
                ))}
            </div>
            <div className="border-t border-white/20 p-2 mt-2">
                <p className="text-lg font-bold">Parth Bhanti</p>
                <p className="text-xs text-gray-300">Portfolio OS v2.0</p>
            </div>
        </div>
    </div>
  );
};

export default StartMenu;
