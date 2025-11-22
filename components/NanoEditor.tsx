
import React, { useState, useEffect, useCallback, useRef } from 'react';

interface NanoEditorProps {
  initialContent: string;
  fileName: string;
  onSave: (content: string) => void;
  onExit: () => void;
}

const NanoEditor: React.FC<NanoEditorProps> = ({ initialContent, fileName, onSave, onExit }) => {
  const [content, setContent] = useState(initialContent);
  const [status, setStatus] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // We only care about events not coming from the textarea to avoid double handling
    if (e.target !== textareaRef.current) {
        return;
    }
    if (e.ctrlKey) {
      if (e.key === 's') {
        e.preventDefault();
        onSave(content);
        setStatus(`[ Saved ${fileName} ]`);
        setTimeout(() => setStatus(''), 2000);
      } else if (e.key === 'x') {
        e.preventDefault();
        onExit();
      }
    }
  }, [content, fileName, onSave, onExit]);

  useEffect(() => {
    const ta = textareaRef.current;
    if (ta) {
      ta.focus();
      // Add listener to the textarea itself to have more control
      ta.addEventListener('keydown', handleKeyDown);
      return () => {
        ta.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [handleKeyDown]);

  return (
    <div className="w-full h-full bg-[#0000AA] text-white flex flex-col font-mono">
      <div className="bg-gray-300 text-black text-center text-xs py-0.5">
        Nano 2.9.3 | File: {fileName}
      </div>
      <textarea
        ref={textareaRef}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full flex-grow bg-[#0000AA] text-white p-1 resize-none border-none outline-none"
        spellCheck="false"
        autoFocus
      />
      <div className="bg-gray-300 text-black text-xs h-6 flex items-center px-2">
        {status ? (
          <span className="text-green-800 font-bold">{status}</span>
        ) : (
          <div>
            <span className="bg-gray-500 text-white px-1">^S</span> Save
            <span className="bg-gray-500 text-white px-1 ml-4">^X</span> Exit
          </div>
        )}
      </div>
    </div>
  );
};

export default NanoEditor;
