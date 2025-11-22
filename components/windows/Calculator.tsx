
import React, { useState } from 'react';
import { GoogleGenAI } from '@google/genai';

const CalcButton: React.FC<{ onClick: () => void; className?: string; children: React.ReactNode }> = ({ onClick, className, children }) => (
  <button onClick={onClick} className={`bg-gray-200 hover:bg-gray-300 active:bg-gray-400 rounded-md text-xl font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${className}`}>
    {children}
  </button>
);

const ScientificCalculator: React.FC = () => {
    const [display, setDisplay] = useState('0');
    const [expression, setExpression] = useState('');
    const [isRad, setIsRad] = useState(true); // true for Radians, false for Degrees

    const handleInput = (value: string) => {
        if (display === '0' && value !== '.') {
            setDisplay(value);
            setExpression(prev => prev + value);
        } else if (display === 'Error') {
            setDisplay(value);
            setExpression(value);
        } else {
            setDisplay(prev => prev + value);
            setExpression(prev => prev + value);
        }
    };

    const handleOperator = (op: string) => {
        if (display === 'Error') return;
        setExpression(prev => prev + op);
        setDisplay('0');
    };
    
    const handleFunction = (func: string) => {
        if (display === 'Error') return;
        setExpression(prev => `${prev}${func}(`);
        setDisplay('0');
    };

    const calculate = () => {
        if (display === 'Error' || !expression) return;
        try {
            let tempExpression = expression;
            // Handle trailing operators for safe evaluation
            if (/[\+\-\*\/^]$/.test(tempExpression)) {
                tempExpression = tempExpression.slice(0, -1);
            }

            // Replace user-friendly symbols and functions with JS Math equivalents
            let evalExpression = tempExpression
                .replace(/π/g, 'Math.PI')
                .replace(/e/g, 'Math.E')
                .replace(/\^/g, '**')
                .replace(/√/g, 'Math.sqrt')
                .replace(/log/g, 'Math.log10')
                .replace(/ln/g, 'Math.log');

            const trigFunctions = ['sin', 'cos', 'tan', 'asin', 'acos', 'atan'];
            trigFunctions.forEach(func => {
                // Add Math. prefix to all trig functions
                const regex = new RegExp(`${func}\\(`, 'g');
                evalExpression = evalExpression.replace(regex, `Math.${func}(`);
            });

            if (!isRad) {
                // For standard trig, convert degrees to radians for Math functions
                ['sin', 'cos', 'tan'].forEach(func => {
                    const regex = new RegExp(`(Math\\.${func}\\()([^)]+)(\\))`, 'g');
                    evalExpression = evalExpression.replace(regex, `$1$2 * (Math.PI / 180)$3`);
                });
                
                // For inverse trig, convert result from radians to degrees
                ['asin', 'acos', 'atan'].forEach(func => {
                    const regex = new RegExp(`(Math\\.${func}\\([^)]+\\))`, 'g');
                    evalExpression = evalExpression.replace(regex, `($1 * 180 / Math.PI)`);
                });
            }
            
            const result = new Function('return ' + evalExpression)();

            if (typeof result !== 'number' || !isFinite(result)) {
                throw new Error("Invalid result from calculation");
            }

            let resultStr = String(Number(result.toPrecision(15)));

            // Check if the result is a multiple of PI and display with symbol
            const piMultiple = result / Math.PI;
            if (Math.abs(piMultiple - Math.round(piMultiple)) < 1e-10) {
                 const multiple = Math.round(piMultiple);
                 if (multiple === 1) resultStr = 'π';
                 else if (multiple === -1) resultStr = '-π';
                 else if (multiple !== 0) resultStr = `${multiple}π`;
            }

            setDisplay(resultStr);
            setExpression(resultStr);

        } catch (error) {
            console.error("Calculation Error:", error);
            setDisplay('Error');
            setExpression('');
        }
    };
    
    const clear = (allClear: boolean) => {
        if (allClear) {
            setDisplay('0');
            setExpression('');
        } else {
            if (display !== '0') {
                 setDisplay('0');
                 // This logic could be improved, but for now it just clears the current entry
                 const lastOpIndex = Math.max(expression.lastIndexOf('+'), expression.lastIndexOf('-'), expression.lastIndexOf('*'), expression.lastIndexOf('/'));
                 if (lastOpIndex > -1) {
                     setExpression(expression.substring(0, lastOpIndex + 1));
                 } else {
                     setExpression('');
                 }
            }
        }
    };
    
    const backspace = () => {
        if (display === 'Error' || display === '0') return;
        if (display.length > 1) {
            setDisplay(d => d.slice(0, -1));
            setExpression(e => e.slice(0, -1));
        } else {
            setDisplay('0');
            setExpression(e => e.slice(0, -1));
        }
    };
    
    const factorial = () => {
        try {
            const n = parseInt(display);
            if (n < 0 || n > 20 || n !== parseFloat(display)) throw new Error("Invalid input"); // Cap factorial & check for integer
            let result = 1;
            for(let i=2; i<=n; i++) result *= i;
            const resultStr = result.toString();
            setDisplay(resultStr);
            setExpression(resultStr);
        } catch {
            setDisplay("Error");
            setExpression("");
        }
    };

    return (
        <div className="p-2 h-full flex flex-col bg-gray-100">
            <div className="bg-gray-800 text-white text-right p-3 rounded-md mb-2">
                <div className="text-sm text-gray-400 h-6 overflow-x-auto">{expression || ' '}</div>
                <div className="text-4xl font-light">{display}</div>
            </div>
            <div className="grid grid-cols-5 gap-1 flex-grow">
                <CalcButton onClick={() => setIsRad(p => !p)} className="text-sm">{isRad ? 'RAD' : 'DEG'}</CalcButton>
                <CalcButton onClick={() => handleFunction('sin')}>sin</CalcButton>
                <CalcButton onClick={() => handleFunction('cos')}>cos</CalcButton>
                <CalcButton onClick={() => handleFunction('tan')}>tan</CalcButton>
                <CalcButton onClick={backspace} className="bg-red-200 hover:bg-red-300">⌫</CalcButton>
                
                <CalcButton onClick={() => handleInput('π')}>π</CalcButton>
                <CalcButton onClick={() => handleFunction('asin')}>sin⁻¹</CalcButton>
                <CalcButton onClick={() => handleFunction('acos')}>cos⁻¹</CalcButton>
                <CalcButton onClick={() => handleFunction('atan')}>tan⁻¹</CalcButton>
                <CalcButton onClick={() => handleOperator('/')}>÷</CalcButton>
                
                <CalcButton onClick={() => handleInput('e')}>e</CalcButton>
                <CalcButton onClick={() => handleOperator('^')}>xʸ</CalcButton>
                <CalcButton onClick={() => handleFunction('√')}>√</CalcButton>
                <CalcButton onClick={factorial}>n!</CalcButton>
                <CalcButton onClick={() => handleOperator('*')}>×</CalcButton>
                
                <CalcButton onClick={() => handleFunction('log')}>log</CalcButton>
                <CalcButton onClick={() => handleInput('7')} className="bg-white">7</CalcButton>
                <CalcButton onClick={() => handleInput('8')} className="bg-white">8</CalcButton>
                <CalcButton onClick={() => handleInput('9')} className="bg-white">9</CalcButton>
                <CalcButton onClick={() => handleOperator('-')}>-</CalcButton>
                
                <CalcButton onClick={() => handleFunction('ln')}>ln</CalcButton>
                <CalcButton onClick={() => handleInput('4')} className="bg-white">4</CalcButton>
                <CalcButton onClick={() => handleInput('5')} className="bg-white">5</CalcButton>
                <CalcButton onClick={() => handleInput('6')} className="bg-white">6</CalcButton>
                <CalcButton onClick={() => handleOperator('+')}>+</CalcButton>
                
                <CalcButton onClick={() => handleInput('(')}>(</CalcButton>
                <CalcButton onClick={() => handleInput('1')} className="bg-white">1</CalcButton>
                <CalcButton onClick={() => handleInput('2')} className="bg-white">2</CalcButton>
                <CalcButton onClick={() => handleInput('3')} className="bg-white">3</CalcButton>
                <CalcButton onClick={calculate} className="bg-blue-400 hover:bg-blue-500 row-span-2">=</CalcButton>
                
                <CalcButton onClick={() => handleInput(')')}>)</CalcButton>
                <CalcButton onClick={() => clear(true)} className="bg-orange-200 hover:bg-orange-300">AC</CalcButton>
                <CalcButton onClick={() => handleInput('0')} className="bg-white">0</CalcButton>
                <CalcButton onClick={() => handleInput('.')}>.</CalcButton>
            </div>
        </div>
    );
};

const AiMathSolver: React.FC = () => {
    const [prompt, setPrompt] = useState('');
    const [response, setResponse] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    
    const handleSolve = async () => {
        if (!prompt.trim()) return;
        
        setIsLoading(true);
        setError('');
        setResponse('');
        
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const systemInstruction = `You are an expert mathematician and AI assistant. Your task is to solve the given math problem accurately and provide a clear, step-by-step explanation of the solution. Handle various types of problems including, but not limited to, calculus (derivatives, integrals), vectors (dot product, cross product), algebra, and word problems. Present the final answer clearly.`;

            const apiResponse = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
                config: { systemInstruction },
            });

            setResponse(apiResponse.text || 'No response generated.');

        } catch (err: any) {
            console.error(err);
            setError(err.message || 'Failed to get a response from the AI. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-2 h-full flex flex-col bg-gray-100">
            <h3 className="text-center font-bold text-gray-700 mb-2">AI Math Solver</h3>
            <textarea
                value={prompt}
                onChange={e => setPrompt(e.target.value)}
                placeholder="e.g., derivative of x^3 * sin(x)&#10;integral of 2x dx from 0 to 5&#10;dot product of [1, 2, 3] and [4, 5, 6]"
                className="w-full flex-grow p-2 border rounded-md resize-none mb-2 text-sm"
                disabled={isLoading}
            />
            <button onClick={handleSolve} disabled={isLoading} className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:bg-blue-400">
                {isLoading ? 'Solving...' : 'Solve with AI'}
            </button>
            <div className="w-full flex-grow mt-2 p-2 bg-white border rounded-md overflow-y-auto text-sm">
                {isLoading && (
                    <div className="flex items-center justify-center h-full text-gray-500">
                        <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        Thinking...
                    </div>
                )}
                {error && <pre className="whitespace-pre-wrap text-red-500">{error}</pre>}
                {response && <pre className="whitespace-pre-wrap text-gray-800">{response}</pre>}
            </div>
        </div>
    );
};

const Calculator: React.FC = () => {
    const [mode, setMode] = useState<'calc' | 'ai'>('calc');
    
    return (
        <div className="w-full h-full flex flex-col bg-gray-300">
            <div className="flex bg-gray-200 border-b border-gray-400">
                <button 
                    onClick={() => setMode('calc')} 
                    className={`flex-1 p-2 text-sm font-semibold ${mode === 'calc' ? 'bg-gray-100 text-blue-600' : 'text-gray-600 hover:bg-gray-300'}`}
                >
                    Calculator
                </button>
                <button 
                    onClick={() => setMode('ai')} 
                    className={`flex-1 p-2 text-sm font-semibold ${mode === 'ai' ? 'bg-gray-100 text-blue-600' : 'text-gray-600 hover:bg-gray-300'}`}
                >
                    AI Math Solver
                </button>
            </div>
            <div className="flex-grow">
                {mode === 'calc' ? <ScientificCalculator /> : <AiMathSolver />}
            </div>
        </div>
    );
}

export default Calculator;
