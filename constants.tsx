
import React from 'react';
import type { AppType } from './types';
import AboutMe from './components/windows/AboutMe';
import Projects from './components/windows/Projects';
import Contact from './components/windows/Contact';
import PdfViewer from './components/windows/PdfViewer';
import Minesweeper from './components/windows/Minesweeper';
import Notepad from './components/windows/Notepad';
import TicTacToe from './components/windows/TicTacToe';
import Snake from './components/windows/Snake';
import Chatbot from './components/windows/Chatbot';
import ImageGenerator from './components/windows/ImageGenerator';
import Camera from './components/windows/Camera';
import Paint from './components/windows/Paint';
import Solitaire from './components/windows/Solitaire';
import Game2048 from './components/windows/Game2048';
import Terminal from './components/windows/Terminal';
import CppRunner from './components/windows/CppRunner';
import Calculator from './components/windows/Calculator';

// FIX: Replaced JSX.Element with React.ReactElement to resolve 'Cannot find namespace JSX' error.
export const ICONS: { [key: string]: React.ReactElement } = {
  computer: (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-full h-full">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 0 1-.879 2.122L7.5 21h9l-1.621-.621A3 3 0 0 1 15 18.257V17.25m6-12V15a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 15V5.25A2.25 2.25 0 0 1 5.25 3h13.5A2.25 2.25 0 0 1 21 5.25Z" />
    </svg>
  ),
  folder: (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-full h-full">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 0 1 4.5 9.75h15A2.25 2.25 0 0 1 21.75 12v.75m-8.69-6.44-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z" />
    </svg>
  ),
  internet: (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-full h-full">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3a9 9 0 1 0 0 18" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12a8.25 8.25 0 1 0 16.5 0" />
    </svg>
  ),
  document: (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-full h-full">
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
    </svg>
  ),
  game: (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-full h-full">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 0 1 0 3.75H5.625a1.875 1.875 0 0 1 0-3.75Z" />
    </svg>
  ),
  notepad: (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-full h-full">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
    </svg>
  ),
  ticTacToe: (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-full h-full">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 4.5v15m6-15v15m-15-6h15m-15 6h15" />
      <rect x="0" y="0" width="24" height="24" stroke="none" fill="none" />
    </svg>
  ),
  snake: (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-full h-full">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6.75h-3.375c-.414 0-.75.336-.75.75v3.375c0 .414.336.75.75.75h4.875c.414 0 .75-.336.75-.75v-6.375c0-.414-.336-.75-.75-.75h-1.5" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 17.25h3.375c.414 0 .75-.336.75-.75V13.125c0-.414-.336-.75-.75-.75H6.375c-.414 0-.75.336-.75.75v6.375c0 .414.336.75.75.75h1.5" />
    </svg>
  ),
  chat: (
     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-full h-full">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z" />
    </svg>
  ),
  image: (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-full h-full">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
    </svg>
  ),
  camera: (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-full h-full">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.776 48.776 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
    </svg>
  ),
  paint: (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-full h-full">
      <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 7.5C7.5 6.67157 8.17157 6 9 6H10.5C11.3284 6 12 6.67157 12 7.5V9.75C12 11.2688 10.7688 12.5 9.25 12.5C7.73122 12.5 6.5 11.2688 6.5 9.75V7.5H7.5Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M14.5 9.5C14.5 8.67157 15.1716 8 16 8H17.5C18.3284 8 19 8.67157 19 9.5V11.75C19 13.2688 17.7688 14.5 16.25 14.5C14.7312 14.5 13.5 13.2688 13.5 11.75V9.5H14.5Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5C5.75 18.25 6.25 17.5 7.5 15.5" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 13.5C2.25 11.8431 3.59315 10.5 5.25 10.5H17.25C18.9069 10.5 20.25 11.8431 20.25 13.5V13.5C20.25 15.1569 18.9069 16.5 17.25 16.5H5.25C3.59315 16.5 2.25 15.1569 2.25 13.5V13.5Z" />
    </svg>
  ),
  solitaire: (
     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-full h-full">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 3.75l2.25 2.25h3.75m-3.75 0v3.75L3 12m0-8.25L5.25 6H9m-6 6l2.25-2.25M9 12l-2.25 2.25M15 3.75l2.25 2.25h3.75m-3.75 0v3.75L15 12m0-8.25l2.25 2.25H21m-6 6l2.25-2.25m-2.25 2.25l-2.25 2.25M9 15l-2.25 2.25M15 15l2.25 2.25M9 21l-2.25-2.25m9 0l-2.25-2.25m0 0l-2.25 2.25m2.25-2.25L15 15m-6 0l2.25-2.25" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8.25V12m18-3.75V12M9 3.75H6m9 0h-3.001M9 21h3.001M3 15.75V12m18-3.75V12" />
    </svg>
  ),
  game2048: (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-full h-full">
        <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/>
        <text x="50%" y="55%" dominantBaseline="middle" textAnchor="middle" fontSize="9" fontWeight="bold" fill="currentColor">2048</text>
    </svg>
  ),
  terminal: (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-full h-full">
      <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 7.5A2.25 2.25 0 017.5 5.25h9a2.25 2.25 0 012.25 2.25v9a2.25 2.25 0 01-2.25 2.25h-9a2.25 2.25 0 01-2.25-2.25v-9z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 10.5h.01M10.5 10.5h.01M12.75 10.5h.01" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 14.25l1.5-1.5-1.5-1.5" />
    </svg>
  ),
  cpp: (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-full h-full">
        <rect width="20" height="20" x="2" y="2" rx="2" ry="2" className="stroke-current fill-gray-700"/>
        <text x="6" y="17" fontFamily="monospace" fontSize="10" fill="white">C++</text>
    </svg>
  ),
  calculator: (
     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-full h-full">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 15.75V18m-7.5-6.75h.008v.008H8.25v-.008zm0 3h.008v.008H8.25v-.008zm0 3h.008v.008H8.25v-.008zm3-6h.008v.008H11.25v-.008zm0 3h.008v.008H11.25v-.008zm0 3h.008v.008H11.25v-.008zm3-6h.008v.008H14.25v-.008zm0 3h.008v.008H14.25v-.008z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 6.75A2.25 2.25 0 015.25 4.5h13.5A2.25 2.25 0 0121 6.75v10.5A2.25 2.25 0 0118.75 19.5H5.25A2.25 2.25 0 013 17.25V6.75z" />
    </svg>
  ),
};

export const APPS: AppType[] = [
  { id: 'about', title: 'About Me', icon: ICONS.computer, component: AboutMe, defaultSize: { width: 600, height: 450 } },
  { id: 'projects', title: 'Projects', icon: ICONS.folder, component: Projects, defaultSize: { width: 700, height: 500 } },
  { id: 'contact', title: 'Contact & Links', icon: ICONS.internet, component: Contact, defaultSize: { width: 400, height: 300 } },
  { id: 'resume', title: 'Resume', icon: ICONS.document, component: PdfViewer, defaultSize: { width: 800, height: 600 } },
  { id: 'terminal', title: 'Terminal', icon: ICONS.terminal, component: Terminal, defaultSize: { width: 650, height: 400 } },
  { id: 'chatbot', title: 'Chat with Parth AI', icon: ICONS.chat, component: Chatbot, defaultSize: { width: 400, height: 500 } },
  { id: 'image-generator', title: 'Imagen AI Art', icon: ICONS.image, component: ImageGenerator, defaultSize: { width: 450, height: 550 } },
  { id: 'cpp-runner', title: 'C++ Runner', icon: ICONS.cpp, component: CppRunner, defaultSize: { width: 700, height: 500 } },
  { id: 'paint', title: 'Paint', icon: ICONS.paint, component: Paint, defaultSize: { width: 500, height: 400 } },
  { id: 'camera', title: 'Camera', icon: ICONS.camera, component: Camera, defaultSize: { width: 400, height: 350 } },
  { id: 'calculator', title: 'Sci-Calc Pro', icon: ICONS.calculator, component: Calculator, defaultSize: { width: 380, height: 550 } },
  { id: 'minesweeper', title: 'Minesweeper', icon: ICONS.game, component: Minesweeper, defaultSize: { width: 300, height: 380 } },
  { id: 'tictactoe', title: 'Tic-Tac-Toe', icon: ICONS.ticTacToe, component: TicTacToe, defaultSize: { width: 300, height: 350 } },
  { id: 'snake', title: 'Snake', icon: ICONS.snake, component: Snake, defaultSize: { width: 320, height: 420 } },
  { id: 'solitaire', title: 'Solitaire', icon: ICONS.solitaire, component: Solitaire, defaultSize: { width: 740, height: 550 } },
  { id: '2048', title: '2048', icon: ICONS.game2048, component: Game2048, defaultSize: { width: 400, height: 600 } },
  { id: 'notepad', title: 'Notepad', icon: ICONS.notepad, component: Notepad, defaultSize: { width: 500, height: 400 } },
];
