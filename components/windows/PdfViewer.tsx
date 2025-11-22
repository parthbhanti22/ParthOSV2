
import React, { useState, useRef, useCallback } from 'react';

interface Note {
  id: number;
  position: { x: number; y: number };
  size: { width: number; height: number };
  content: string;
  zIndex: number;
}

const StickyNote: React.FC<{
  note: Note;
  onUpdate: (id: number, newNote: Partial<Note>) => void;
  onDelete: (id: number) => void;
  onFocus: (id: number) => void;
}> = ({ note, onUpdate, onDelete, onFocus }) => {
  const isDragging = useRef(false);
  const dragStartPos = useRef({ x: 0, y: 0 });

  const handleDragMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    onFocus(note.id);
    isDragging.current = true;
    dragStartPos.current = {
      x: e.clientX - note.position.x,
      y: e.clientY - note.position.y,
    };
    
    const handleMouseMove = (me: MouseEvent) => {
        if (!isDragging.current) return;
        const newX = me.clientX - dragStartPos.current.x;
        const newY = me.clientY - dragStartPos.current.y;
        onUpdate(note.id, { position: { x: newX, y: newY } });
    };

    const handleMouseUp = () => {
        isDragging.current = false;
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [note.id, note.position, onUpdate, onFocus]);
  
  const isResizing = useRef(false);
  const resizeStartPos = useRef({ x: 0, y: 0 });

  const handleResizeMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    onFocus(note.id);
    isResizing.current = true;
    resizeStartPos.current = { x: e.clientX, y: e.clientY };

    const handleMouseMove = (me: MouseEvent) => {
      if (!isResizing.current) return;
      const dx = me.clientX - resizeStartPos.current.x;
      const dy = me.clientY - resizeStartPos.current.y;

      onUpdate(note.id, {
        size: {
          width: Math.max(150, note.size.width + dx),
          height: Math.max(100, note.size.height + dy),
        },
      });
      resizeStartPos.current = { x: me.clientX, y: me.clientY };
    };

    const handleMouseUp = () => {
      isResizing.current = false;
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [note.id, note.size, onUpdate, onFocus]);

  return (
    <div
      style={{
        left: note.position.x,
        top: note.position.y,
        width: note.size.width,
        height: note.size.height,
        zIndex: note.zIndex,
      }}
      className="absolute bg-yellow-200 shadow-lg rounded-md flex flex-col border border-yellow-400 select-none"
      onMouseDown={() => onFocus(note.id)}
    >
      <div 
        className="h-6 bg-yellow-300 rounded-t-md cursor-grab flex justify-end items-center px-2"
        onMouseDown={handleDragMouseDown}
      >
        <button onClick={() => onDelete(note.id)} className="w-4 h-4 text-xs font-bold flex items-center justify-center bg-red-500 text-white rounded-full hover:bg-red-600">✕</button>
      </div>
      <textarea
        value={note.content}
        onChange={(e) => onUpdate(note.id, { content: e.target.value })}
        className="flex-grow p-2 resize-none bg-transparent border-0 focus:ring-0 text-gray-800 text-sm"
        placeholder="Type your note..."
      />
      <div 
        className="absolute bottom-0 right-0 w-3 h-3 cursor-se-resize border-r-2 border-b-2 border-yellow-500/80"
        onMouseDown={handleResizeMouseDown}
      />
    </div>
  );
};

const PdfViewer: React.FC = () => {
  const RESUME_URL = "https://drive.google.com/file/d/1JSTFOVZazACydkJhCb52WxRry_WtWh6i/preview";
  const [notes, setNotes] = useState<Note[]>([]);
  const nextId = useRef(0);
  const [nextZIndex, setNextZIndex] = useState(10);
  
  const addNote = () => {
    const newNote: Note = {
      id: nextId.current++,
      position: { x: Math.random() * 100 + 20, y: Math.random() * 100 + 20 },
      size: { width: 200, height: 150 },
      content: '',
      zIndex: nextZIndex,
    };
    setNotes([...notes, newNote]);
    setNextZIndex(prev => prev + 1);
  };
  
  const updateNote = (id: number, newNote: Partial<Note>) => {
      setNotes(notes.map(n => n.id === id ? {...n, ...newNote} : n));
  };
  
  const deleteNote = (id: number) => {
      setNotes(notes.filter(n => n.id !== id));
  };

  const focusNote = (id: number) => {
      const note = notes.find(n => n.id === id);
      if (note && note.zIndex < nextZIndex - 1) {
          setNotes(notes.map(n => n.id === id ? { ...n, zIndex: nextZIndex } : n));
          setNextZIndex(prev => prev + 1);
      }
  };
  
  return (
    <div className="w-full h-full flex flex-col bg-gray-400">
      <div className="p-1 bg-gray-200 border-b border-gray-400 flex items-center space-x-2">
        <button onClick={addNote} className="px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Add Note
        </button>
      </div>
      <div className="flex-grow relative bg-gray-500">
        <iframe
          src={RESUME_URL}
          className="w-full h-full border-0"
          title="Resume PDF Viewer"
        />
        {notes.map(note => (
          <StickyNote key={note.id} note={note} onUpdate={updateNote} onDelete={deleteNote} onFocus={focusNote} />
        ))}
      </div>
    </div>
  );
};

export default PdfViewer;
