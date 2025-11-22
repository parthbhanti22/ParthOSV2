

import React, { useState, useEffect, useCallback, useRef } from 'react';

const SIZE = 4;

const generateInitialBoard = (): number[][] => {
  let board = Array.from({ length: SIZE }, () => Array(SIZE).fill(0));
  board = addRandomTile(board);
  board = addRandomTile(board);
  return board;
};

const addRandomTile = (board: number[][]): number[][] => {
  const newBoard = board.map(row => [...row]);
  const emptyCells = [];
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      if (newBoard[r][c] === 0) {
        emptyCells.push({ r, c });
      }
    }
  }
  if (emptyCells.length > 0) {
    const { r, c } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    newBoard[r][c] = Math.random() < 0.9 ? 2 : 4;
  }
  return newBoard;
};

const slide = (row: number[]): number[] => {
  let arr = row.filter(val => val);
  let missing = SIZE - arr.length;
  let zeros = Array(missing).fill(0);
  return arr.concat(zeros);
};

const combine = (row: number[]): { newRow: number[], score: number } => {
  let score = 0;
  for (let i = 0; i < SIZE - 1; i++) {
    if (row[i] !== 0 && row[i] === row[i + 1]) {
      row[i] *= 2;
      score += row[i];
      row[i + 1] = 0;
    }
  }
  return { newRow: row, score };
};

const operate = (row: number[]): { newRow: number[], score: number } => {
  let slidedRow = slide(row);
  let { newRow, score } = combine(slidedRow);
  return { newRow: slide(newRow), score };
};

const rotateLeft = (board: number[][]): number[][] => {
    const newBoard: number[][] = Array.from({ length: SIZE }, () => Array(SIZE).fill(0));
    for(let r=0; r < SIZE; r++){
        for(let c=0; c < SIZE; c++){
            newBoard[r][c] = board[c][SIZE - 1 - r];
        }
    }
    return newBoard;
};
const rotateRight = (board: number[][]): number[][] => {
    const newBoard: number[][] = Array.from({ length: SIZE }, () => Array(SIZE).fill(0));
    for(let r=0; r < SIZE; r++){
        for(let c=0; c < SIZE; c++){
            newBoard[r][c] = board[SIZE - 1 - c][r];
        }
    }
    return newBoard;
};

const canMove = (board: number[][]): boolean => {
    for(let r=0; r < SIZE; r++){
        for(let c=0; c < SIZE; c++){
            if(board[r][c] === 0) return true;
            if(r < SIZE -1 && board[r][c] === board[r+1][c]) return true;
            if(c < SIZE -1 && board[r][c] === board[r][c+1]) return true;
        }
    }
    return false;
};

const TILE_COLORS: { [key: number]: string } = {
  0: 'bg-gray-500', 2: 'bg-gray-300 text-gray-800', 4: 'bg-yellow-200 text-gray-800',
  8: 'bg-orange-400 text-white', 16: 'bg-orange-500 text-white', 32: 'bg-red-500 text-white',
  64: 'bg-red-600 text-white', 128: 'bg-yellow-400 text-white', 256: 'bg-yellow-500 text-white',
  512: 'bg-yellow-600 text-white', 1024: 'bg-purple-500 text-white', 2048: 'bg-purple-700 text-white'
};

const Game2048: React.FC = () => {
  const [board, setBoard] = useState(generateInitialBoard());
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const resetGame = useCallback(() => {
    setBoard(generateInitialBoard());
    setScore(0);
    setGameOver(false);
    containerRef.current?.focus();
  }, []);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (gameOver) return;
    
    let newBoard = board.map(row => [...row]);
    let boardChanged = false;
    let newScore = 0;
    
    const move = (b: number[][]) => {
        let movedBoard: number[][] = [];
        let score_delta = 0;
        for (let i = 0; i < SIZE; i++) {
            const {newRow, score} = operate(b[i]);
            movedBoard.push(newRow);
            score_delta += score;
        }
        return {b: movedBoard, s: score_delta};
    }

    switch (e.key) {
      case 'ArrowLeft':
        {
            const {b, s} = move(newBoard);
            newBoard = b;
            newScore = s;
        }
        break;
      case 'ArrowRight':
        {
            newBoard = newBoard.map(row => row.reverse());
            const {b, s} = move(newBoard);
            newBoard = b.map(row => row.reverse());
            newScore = s;
        }
        break;
      case 'ArrowUp':
        {
            newBoard = rotateLeft(newBoard);
            const {b, s} = move(newBoard);
            newBoard = rotateRight(b);
            newScore = s;
        }
        break;
      case 'ArrowDown':
        {
            newBoard = rotateRight(newBoard);
            const {b, s} = move(newBoard);
            newBoard = rotateLeft(b);
            newScore = s;
        }
        break;
      default:
        return;
    }
    
    e.preventDefault();
    boardChanged = JSON.stringify(board) !== JSON.stringify(newBoard);

    if (boardChanged) {
        const boardWithRandom = addRandomTile(newBoard);
      setBoard(boardWithRandom);
      setScore(s => s + newScore);
      if(!canMove(boardWithRandom)) {
          setGameOver(true);
      }
    }
  }, [board, gameOver, score]);
  
  useEffect(() => {
    const container = containerRef.current;
    container?.focus();
    container?.addEventListener('keydown', handleKeyDown);
    return () => container?.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div ref={containerRef} tabIndex={0} className="w-full h-full bg-gray-700 flex flex-col p-4 outline-none select-none">
        <div className="flex justify-between items-center mb-4 flex-shrink-0">
            <h1 className="text-4xl font-bold text-white">2048</h1>
            <div className="bg-gray-800 text-white p-2 rounded text-center">
                <div className="text-xs">SCORE</div>
                <div className="text-xl font-bold">{score}</div>
            </div>
        </div>
        
      <div className="flex-grow flex items-center justify-center min-h-0">
        <div className="bg-gray-800 p-2 rounded-md grid grid-cols-4 grid-rows-4 gap-2 relative aspect-square w-full max-w-[400px] max-h-[400px]">
            {gameOver && (
                <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center z-10 rounded-md">
                    <p className="text-3xl text-white font-bold">Game Over!</p>
                    <button onClick={resetGame} className="mt-4 px-4 py-2 bg-orange-500 text-white rounded">Try Again</button>
                </div>
            )}
            {board.flat().map((value, index) => (
            <div key={index} className={`rounded-md flex items-center justify-center text-xl md:text-3xl font-bold transition-all duration-200 ${TILE_COLORS[value] || 'bg-purple-900 text-white'}`}>
                {value > 0 ? value : ''}
            </div>
            ))}
        </div>
      </div>

      <button onClick={resetGame} className="mt-4 w-full py-2 bg-orange-500 text-white rounded font-bold hover:bg-orange-600 transition-colors flex-shrink-0">New Game</button>
    </div>
  );
};

export default Game2048;