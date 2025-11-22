import React from 'react';

export interface WindowInstance {
  id: string;
  title: string;
  appId: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  isMinimized: boolean;
  zIndex: number;
}

export interface AppType {
  id: string;
  title: string;
  // FIX: Replaced JSX.Element with React.ReactElement to resolve 'Cannot find namespace JSX' error.
  icon: React.ReactElement;
  component: React.ComponentType;
  defaultSize: { width: number; height: number };
}
