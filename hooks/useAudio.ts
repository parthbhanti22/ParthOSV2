import { useCallback } from 'react';

const sounds = {
  click: new Audio('data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABgAZGF0YQQAAAAA'),
  open: new Audio('data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YSfEkX/y/9r/0P/V/83/zf/P/83/0v/W/9f/2v/c/9r/3P/e/97/3v/f/9//4P/g/+D/4v/i/+P/5P/l/+b/5//o/+n/6v/r/+z/7P/u/+7/7v/v/+//8P/x//L/8//0//X/9v/3//j/+f/6//v//P////////////9A==')
};

// Set volumes
sounds.click.volume = 0.7;
sounds.open.volume = 0.5;

type SoundType = keyof typeof sounds;

export const useAudio = () => {
  const playAudio = useCallback((type: SoundType) => {
    const sound = sounds[type];
    if (sound) {
      sound.currentTime = 0;
      sound.play().catch(error => console.log(`Audio play failed: ${error}`));
    }
  }, []);

  return playAudio;
};
