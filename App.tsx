
import React, { useState, useCallback, useRef, useEffect } from 'react';
import type { WindowInstance } from './types';
import { APPS } from './constants';
import DesktopIcon from './components/DesktopIcon';
import Taskbar from './components/Taskbar';
import StartMenu from './components/StartMenu';
import Window from './components/Window';
import { useAudio } from './hooks/useAudio';

const WALLPAPER_PROMPTS = [
  "futuristic sci-fi city night neon rain cyberpunk",
  "deep space nebula stars galaxy dark",
  "batman gotham city skyline night dark dramatic",
  "spiderman swinging new york night cinematic",
  "lord of the rings middle earth landscape dark moody",
  "star wars death star space battle dark",
  "indiana jones ancient ruins mystery cave dark",
  "iron man suit high tech hud dark background",
  "marvel superhero cinematic dark lighting",
  "quantum physics laboratory glowing abstract dark",
  "dna spiral scientific futuristic dark blue",
  "alien planet surface night bioluminescent",
  "matrix code digital rain dark green black"
];

const App: React.FC = () => {
  const [windows, setWindows] = useState<WindowInstance[]>([]);
  const [activeWindowId, setActiveWindowId] = useState<string | null>(null);
  const [nextZIndex, setNextZIndex] = useState<number>(1);
  const [isStartMenuOpen, setStartMenuOpen] = useState(false);
  const [wallpaper, setWallpaper] = useState('');
  const nextId = useRef(0);
  const playAudio = useAudio();

  useEffect(() => {
    // Generate a random wallpaper on initial load
    const prompt = WALLPAPER_PROMPTS[Math.floor(Math.random() * WALLPAPER_PROMPTS.length)];
    const seed = Math.floor(Math.random() * 100000);
    // Use Pollinations AI to generate the image
    const imageUrl = `https://image.pollinations.ai/prompt/hyperrealistic 8k wallpaper dark theme ${encodeURIComponent(prompt)}?width=1920&height=1080&seed=${seed}&nolog=true`;
    
    setWallpaper(`url('${imageUrl}')`);
    // Play startup sound once
    playAudio('open');
  }, [playAudio]);


  const openApp = useCallback((appId: string) => {
    playAudio('open');
    const app = APPS.find(a => a.id === appId);
    if (!app) return;

    const existingWindow = windows.find(w => w.appId === appId && !w.isMinimized);
    if(existingWindow) {
      focusWindow(existingWindow.id);
      return;
    }

    const newWindow: WindowInstance = {
      id: `win_${nextId.current++}`,
      appId: app.id,
      title: app.title,
      position: { x: Math.random() * 200 + 50, y: Math.random() * 100 + 50 },
      size: app.defaultSize,
      isMinimized: false,
      zIndex: nextZIndex,
    };

    setWindows(prev => [...prev, newWindow]);
    setActiveWindowId(newWindow.id);
    setNextZIndex(prev => prev + 1);
    setStartMenuOpen(false);
  }, [windows, nextZIndex, playAudio]);

  const closeWindow = useCallback((id: string) => {
    playAudio('click');
    setWindows(prev => prev.filter(win => win.id !== id));
    if (activeWindowId === id) {
        const remainingWindows = windows.filter(w => w.id !== id && !w.isMinimized);
        if (remainingWindows.length > 0) {
            setActiveWindowId(remainingWindows[remainingWindows.length - 1].id);
        } else {
            setActiveWindowId(null);
        }
    }
  }, [windows, activeWindowId, playAudio]);

  const toggleMinimize = useCallback((id: string) => {
    playAudio('click');
    setWindows(prev => prev.map(win => win.id === id ? { ...win, isMinimized: !win.isMinimized } : win));
    if (!windows.find(w => w.id === id)?.isMinimized) {
        const otherWindows = windows.filter(w => w.id !== id && !w.isMinimized);
        setActiveWindowId(otherWindows.length > 0 ? otherWindows[otherWindows.length - 1].id : null);
    } else {
        focusWindow(id);
    }
  }, [windows, playAudio]);

  const focusWindow = useCallback((id: string) => {
    const window = windows.find(w => w.id === id);
    if (window && window.isMinimized) {
      playAudio('open');
    } else {
      playAudio('click');
    }

    setWindows(prev => prev.map(win => win.id === id ? { ...win, zIndex: nextZIndex, isMinimized: false } : win));
    setActiveWindowId(id);
    setNextZIndex(prev => prev + 1);
  }, [nextZIndex, windows, playAudio]);
  
  const updateWindowPosition = useCallback((id: string, newPosition: { x: number; y: number }) => {
    setWindows(prev => prev.map(win => win.id === id ? { ...win, position: newPosition } : win));
  }, []);

  const desktopApps = APPS.filter(app => [
      'about', 'projects', 'contact', 'resume', 
      'terminal', 'chatbot', 'image-generator',
      'cpp-runner', 'paint', 'camera', 'calculator',
      'minesweeper', 'tictactoe', 'snake', 'solitaire', '2048',
    ].includes(app.id));

  return (
    <div className="w-screen h-screen bg-cover bg-center bg-black" style={{ backgroundImage: wallpaper }}>
      <main className="w-full h-[calc(100vh-40px)]">
        <div className="p-4 flex flex-col items-start space-y-4">
          {desktopApps.map(app => (
            <DesktopIcon key={app.id} icon={app.icon} title={app.title} onDoubleClick={() => openApp(app.id)} />
          ))}
        </div>
        
        {windows.map(win => {
          if (win.isMinimized) return null;
          const AppContent = APPS.find(app => app.id === win.appId)?.component;
          if (!AppContent) return null;

          return (
            <Window
              key={win.id}
              id={win.id}
              title={win.title}
              initialPosition={win.position}
              initialSize={win.size}
              zIndex={win.zIndex}
              isActive={activeWindowId === win.id}
              onClose={() => closeWindow(win.id)}
              onMinimize={() => toggleMinimize(win.id)}
              onFocus={() => focusWindow(win.id)}
              onPositionChange={ (pos) => updateWindowPosition(win.id, pos)}
            >
              <AppContent />
            </Window>
          );
        })}

      </main>

      {isStartMenuOpen && <StartMenu openApp={openApp} closeMenu={() => setStartMenuOpen(false)} />}
      
      <Taskbar
        openWindows={windows}
        activeWindowId={activeWindowId}
        onTaskbarItemClick={focusWindow}
        toggleStartMenu={() => setStartMenuOpen(p => !p)}
      />
    </div>
  );
};

export default App;
