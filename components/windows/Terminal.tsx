
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useFileSystem } from '../../hooks/useFileSystem';
import NanoEditor from '../NanoEditor';
import { GoogleGenAI } from '@google/genai';

interface OutputLine {
  type: 'input' | 'output' | 'error';
  content: string;
  path?: string;
}

const HELP_MESSAGE = `
Parth OS Command List:

  parth --help                Show this help message.
  parth getfromweb "<prompt>"   Ask the Gemini AI with Google Search.
  ls [path]                   List directory contents.
  cd <directory>              Change the current directory.
  cat <file>                  Display file contents.
  mkdir <directory>             Create a new directory.
  rm [-r] <path>              Remove a file or directory.
  nano <file>                 Open a simple text editor.
  whoami                      Display the current user.
  date                        Display the current date and time.
  clear                       Clear the terminal screen.
  echo [text]                 Display a line of text.

Press [Up Arrow] or [Down Arrow] to navigate command history.
`;

const Terminal: React.FC = () => {
  const { currentPath, ls, cd, cat, mkdir, rm, writeFile } = useFileSystem();
  const [input, setInput] = useState('');
  const [output, setOutput] = useState<OutputLine[]>([
      { type: 'output', content: "Welcome to Parth OS Terminal. Type 'parth --help' to see available commands."}
  ]);
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);
  const [editingFile, setEditingFile] = useState<{ path: string; content: string } | null>(null);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if(!editingFile) {
        containerRef.current?.scrollTo(0, containerRef.current.scrollHeight);
    }
  }, [output, editingFile]);
  
  useEffect(() => {
    if(!editingFile) {
        inputRef.current?.focus();
    }
  }, [editingFile]);

  const executeCommand = async (command: string) => {
    const [cmd, ...args] = command.trim().split(' ');
    let response: string | string[] = '';
    let error = '';

    if (cmd === '') return;

    if (cmd === 'parth' && args[0] === 'getfromweb') {
        const prompt = args.slice(1).join(' ').replace(/"/g, '');
        if (!prompt) {
            error = 'Usage: parth getfromweb "<your question>"';
        } else {
            setIsLoading(true);
            try {
                const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
                const aiResponse = await ai.models.generateContent({
                    model: 'gemini-2.5-flash',
                    contents: prompt,
                    config: {
                        tools: [{ googleSearch: {} }],
                    },
                });

                let text = aiResponse.text || '';
                
                // Handle Search Grounding Source URLs
                const chunks = aiResponse.candidates?.[0]?.groundingMetadata?.groundingChunks;
                if (chunks) {
                    const sources = chunks
                        .map((chunk: any) => chunk.web?.uri ? `<a href="${chunk.web.uri}" target="_blank" class="text-blue-400 underline hover:text-blue-300">[${chunk.web.title || 'Source'}]</a>` : null)
                        .filter(Boolean);
                    
                    if (sources.length > 0) {
                        text += '\n\n\x1b[1;34mSources:\x1b[0m\n' + sources.join('\n');
                    }
                }
                
                response = text;

            } catch (err: any) {
                console.error(err);
                error = err.message || 'Error fetching response from AI.';
            } finally {
                setIsLoading(false);
            }
        }
    } else {
        switch (cmd) {
            case 'parth':
                if (args[0] === '--help') response = HELP_MESSAGE;
                else error = `parth: command not found: ${args[0] || ''}. Try 'parth --help'`;
                break;
            case 'ls':
                const result = ls(args[0]);
                response = result.map(item => {
                    if (item.endsWith('/')) return `\x1b[1;34m${item}\x1b[0m`; // Blue for directories
                    return item;
                }).join('  ');
                break;
            case 'cd':
                const cdError = cd(args[0] || '~');
                if(cdError) error = cdError;
                break;
            case 'cat':
                if (!args[0]) error = 'cat: missing file operand';
                else response = cat(args[0]);
                break;
            case 'mkdir':
                if (!args[0]) error = 'mkdir: missing operand';
                else {
                    const mkdirError = mkdir(args[0]);
                    if (mkdirError) error = mkdirError;
                }
                break;
            case 'rm':
                const recursive = args[0] === '-r';
                const path = recursive ? args[1] : args[0];
                if (!path) {
                    error = 'rm: missing operand';
                } else {
                    const rmError = rm(path, recursive);
                    if (rmError) error = rmError;
                }
                break;
            case 'nano':
                if (!args[0]) {
                    error = 'nano: missing file operand';
                } else {
                    const filePath = args[0];
                    const fileContent = cat(filePath);
                    // const isNewFile = fileContent.includes('No such file or directory') || fileContent.includes('Is a directory'); // Buggy check logic
                     if (fileContent.includes('Is a directory')) {
                        error = `nano: ${filePath}: Is a directory`;
                        break;
                    }
                    const isNew = fileContent.startsWith('cat:');
                    setEditingFile({
                        path: filePath,
                        content: isNew ? '' : fileContent,
                    });
                }
                break;
            case 'clear':
                setOutput([]);
                return;
            case 'whoami':
                response = 'parth';
                break;
            case 'date':
                response = new Date().toString();
                break;
            case 'echo':
                response = args.join(' ');
                break;
            default:
                error = `command not found: ${cmd}`;
                break;
        }
    }
    
    if (response) {
      setOutput(prev => [...prev, { type: 'output', content: Array.isArray(response) ? response.join('\n') : response }]);
    }
    if (error) {
      setOutput(prev => [...prev, { type: 'error', content: error }]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const command = input.trim();
    if (command) {
        setOutput(prev => [...prev, { type: 'input', content: command, path: currentPath }]);
        executeCommand(command);
        if(history[0] !== command) {
          setHistory(prev => [command, ...prev]);
        }
    } else {
        setOutput(prev => [...prev, { type: 'input', content: '', path: currentPath }]);
    }
    setInput('');
    setHistoryIndex(-1);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if(e.key === 'ArrowUp') {
          e.preventDefault();
          if(historyIndex < history.length -1) {
              const newIndex = historyIndex + 1;
              setHistoryIndex(newIndex);
              setInput(history[newIndex]);
          }
      } else if (e.key === 'ArrowDown') {
          e.preventDefault();
          if(historyIndex > 0) {
              const newIndex = historyIndex - 1;
              setHistoryIndex(newIndex);
              setInput(history[newIndex]);
          } else {
              setHistoryIndex(-1);
              setInput('');
          }
      }
  }

  const formatOutput = (line: OutputLine) => {
    // Handle simple ANSI color codes for blue directories and custom source links
    let content = line.content;
    content = content.replace(/\x1b\[1;34m(.*?)\x1b\[0m/g, '<span class="text-blue-400 font-bold">$1</span>');
    // Links are already HTML strings from the search grounding logic, so dangerouslySetInnerHTML will handle them.
    return <span dangerouslySetInnerHTML={{ __html: content }} />;
  };

  const handleSaveFile = (content: string) => {
    if (editingFile) {
        const saveError = writeFile(editingFile.path, content);
        if (saveError) {
            console.error(saveError);
        }
    }
  };

  const handleExitEditor = () => {
    setEditingFile(null);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  if (editingFile) {
    return (
      <NanoEditor
        initialContent={editingFile.content}
        fileName={editingFile.path}
        onSave={handleSaveFile}
        onExit={handleExitEditor}
      />
    );
  }

  return (
    <div 
      className="w-full h-full bg-[#1e1e1e] text-white font-mono text-sm p-2 overflow-y-auto"
      ref={containerRef}
      onClick={() => inputRef.current?.focus()}
    >
      {output.map((line, index) => (
        <div key={index}>
          {line.type === 'input' && (
            <div>
              <span className="text-green-400">parth@portfolio</span>
              <span className="text-white">:</span>
              <span className="text-blue-400">{line.path?.replace('/home/parth', '~')}</span>
              <span className="text-white">$ {line.content}</span>
            </div>
          )}
          {line.type === 'output' && <pre className="whitespace-pre-wrap font-sans">{formatOutput(line)}</pre>}
          {line.type === 'error' && <p className="text-red-500">{line.content}</p>}
        </div>
      ))}
      {!isLoading && (
        <form onSubmit={handleSubmit} className="flex">
          <div>
            <span className="text-green-400">parth@portfolio</span>
            <span className="text-white">:</span>
            <span className="text-blue-400">{currentPath.replace('/home/parth', '~')}</span>
            <span className="text-white">$ </span>
          </div>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent border-none outline-none text-white pl-2"
            autoFocus
            autoComplete="off"
            autoCapitalize="off"
            spellCheck="false"
          />
        </form>
      )}
      {isLoading && <div className="flex items-center"><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-100 mr-2"></div>Searching the web...</div>}
    </div>
  );
};

export default Terminal;
