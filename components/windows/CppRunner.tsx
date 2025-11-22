
import React, { useState } from 'react';

// A very simple fake C++ runner
const runFakeCpp = (code: string): { output: string; error: string } => {
    if (code.includes('cout << "Hello, World!";') || code.includes('cout << "Hello, World!" << endl;')) {
        return { output: 'Hello, World!\n', error: '' };
    }
    if (/for\s*\(\s*int\s+i\s*=\s*0\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*(?:\+\+|--)\s*\)/.test(code)) {
        const match = code.match(/for\s*\(\s*int\s+i\s*=\s*0\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*(?:\+\+|--)\s*\)/);
        const limit = match ? parseInt(match[1], 10) : 5;
        if (code.includes('cout << i << endl;')) {
            let output = '';
            for(let i=0; i < Math.min(limit, 20); i++) { // cap at 20 iterations
                output += `${i}\n`;
            }
            return { output, error: '' };
        }
    }
    if (!code.includes('int main()')) {
        return { output: '', error: 'error: missing `int main()` function definition.' };
    }
    if ((code.match(/;/g) || []).length < (code.includes('return 0;') ? 1: 0) + (code.match(/cout/g) || []).length) { // crude check for semicolons
        return { output: '', error: 'error: expected ‘;’ before ‘}’ token' };
    }
    return { output: 'Execution finished with no output.', error: '' };
};

const CppRunner: React.FC = () => {
    const [code, setCode] = useState('#include <iostream>\n\nint main() {\n    std::cout << "Hello, World!";\n    return 0;\n}');
    const [output, setOutput] = useState('');
    const [isRunning, setIsRunning] = useState(false);

    const handleRun = () => {
        setIsRunning(true);
        setOutput('Compiling...');
        setTimeout(() => {
            const result = runFakeCpp(code);
            if (result.error) {
                setOutput(`Error:\n${result.error}`);
            } else {
                setOutput(`Output:\n${result.output}`);
            }
            setIsRunning(false);
        }, 1000); // Simulate compilation time
    };

    return (
        <div className="w-full h-full flex flex-col bg-gray-800 text-white font-mono">
            <div className="p-1 bg-gray-900 flex items-center justify-between border-b border-gray-600">
                <span className="text-sm px-2">main.cpp</span>
                <button
                    onClick={handleRun}
                    disabled={isRunning}
                    className="px-4 py-1 text-sm bg-green-600 rounded hover:bg-green-700 disabled:bg-green-800 flex items-center"
                >
                     <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd"></path></svg>
                    {isRunning ? 'Running...' : 'Run'}
                </button>
            </div>
            <div className="flex-grow flex flex-col" style={{ height: 'calc(100% - 3rem)'}}>
                <div className="h-2/3">
                     <textarea
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        className="w-full h-full p-2 resize-none bg-[#1e1e1e] border-0 focus:ring-0 text-green-300"
                        placeholder="// Your C++ code here"
                        spellCheck="false"
                    />
                </div>
                <div className="h-1/3 bg-black p-2 overflow-y-auto border-t border-gray-600">
                    <pre className="whitespace-pre-wrap text-sm">{output}</pre>
                </div>
            </div>
        </div>
    );
};

export default CppRunner;
