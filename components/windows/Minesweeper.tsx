
import React, { useState, useEffect } from 'react';

const ROWS = 10;
const COLS = 10;
const MINES = 10;

type CellValue = number | 'M';
type CellState = 'hidden' | 'revealed' | 'flagged';

interface Cell {
  value: CellValue;
  state: CellState;
}

const createBoard = (): Cell[][] => {
  const board: Cell[][] = Array.from({ length: ROWS }, () =>
    Array.from({ length: COLS }, () => ({ value: 0, state: 'hidden' }))
  );

  let minesPlaced = 0;
  while (minesPlaced < MINES) {
    const r = Math.floor(Math.random() * ROWS);
    const c = Math.floor(Math.random() * COLS);
    if (board[r][c].value !== 'M') {
      board[r][c].value = 'M';
      minesPlaced++;
    }
  }

  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (board[r][c].value === 'M') continue;
      let adjacentMines = 0;
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          if (dr === 0 && dc === 0) continue;
          const nr = r + dr;
          const nc = c + dc;
          if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS && board[nr][nc].value === 'M') {
            adjacentMines++;
          }
        }
      }
      board[r][c].value = adjacentMines;
    }
  }
  return board;
};


const Minesweeper: React.FC = () => {
    const [board, setBoard] = useState<Cell[][]>(createBoard());
    const [gameOver, setGameOver] = useState(false);
    const [win, setWin] = useState(false);

    const revealCell = (r: number, c: number) => {
        if (gameOver || r < 0 || r >= ROWS || c < 0 || c >= COLS) return;
        const newBoard = board.map(row => row.map(cell => ({...cell})));
        
        if(newBoard[r][c].state !== 'hidden') return;
        
        newBoard[r][c].state = 'revealed';
        
        if (newBoard[r][c].value === 'M') {
            setGameOver(true);
            // Reveal all mines on loss
            newBoard.forEach(row => row.forEach(cell => {
                if(cell.value === 'M') cell.state = 'revealed';
            }));
        } else if (newBoard[r][c].value === 0) {
            for (let dr = -1; dr <= 1; dr++) {
                for (let dc = -1; dc <= 1; dc++) {
                    revealCell(r + dr, c + dc);
                }
            }
        }
        setBoard(newBoard);
    };

    const handleClick = (r: number, c: number) => {
        if(board[r][c].state === 'hidden') {
            revealCell(r, c);
        }
    };

    const handleRightClick = (e: React.MouseEvent, r: number, c: number) => {
        e.preventDefault();
        if (gameOver) return;
        const newBoard = board.map(row => row.map(cell => ({...cell})));
        if (newBoard[r][c].state === 'hidden') {
            newBoard[r][c].state = 'flagged';
        } else if (newBoard[r][c].state === 'flagged') {
            newBoard[r][c].state = 'hidden';
        }
        setBoard(newBoard);
    };
    
    const resetGame = () => {
        setBoard(createBoard());
        setGameOver(false);
        setWin(false);
    }

    useEffect(() => {
        const revealedCount = board.flat().filter(cell => cell.state === 'revealed').length;
        if (!gameOver && revealedCount === ROWS * COLS - MINES) {
            setWin(true);
            setGameOver(true);
        }
    }, [board, gameOver]);

  return (
    <div className="flex flex-col items-center p-2 bg-gray-300 h-full">
        <div className="w-full flex justify-between items-center p-2 bg-gray-400 rounded mb-2">
            <div className="font-mono text-lg">{gameOver ? (win ? "You Win!" : "You Lose!") : "Minesweeper"}</div>
            <button onClick={resetGame} className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">Reset</button>
        </div>
        <div className="grid grid-cols-10 gap-px bg-gray-400 p-1">
        {board.map((row, r) =>
          row.map((cell, c) => (
            <button
              key={`${r}-${c}`}
              onClick={() => handleClick(r, c)}
              onContextMenu={(e) => handleRightClick(e, r, c)}
              className="w-6 h-6 flex items-center justify-center font-bold text-sm bg-gray-200 hover:bg-gray-100 border border-gray-500"
            >
              {cell.state === 'revealed' && (cell.value === 'M' ? '💣' : cell.value > 0 ? cell.value : '')}
              {cell.state === 'flagged' && '🚩'}
            </button>
          ))
        )}
      </div>
    </div>
  );
};

export default Minesweeper;
