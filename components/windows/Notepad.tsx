
import React from 'react';

const Notepad: React.FC = () => {
  return (
    <div className="h-full flex flex-col bg-white">
      <div className="p-1 border-b text-gray-600 text-xs">
        <span>File</span>
        <span className="ml-2">Edit</span>
        <span className="ml-2">Format</span>
        <span className="ml-2">View</span>
        <span className="ml-2">Help</span>
      </div>
      <textarea
        className="w-full h-full flex-grow p-2 resize-none border-0 focus:ring-0 font-mono text-sm"
        placeholder="Start typing..."
      ></textarea>
    </div>
  );
};

export default Notepad;
