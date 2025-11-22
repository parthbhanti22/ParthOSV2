import React, { useState, useEffect, useCallback, useRef } from 'react';

const BOARD_SIZE = 15;
const CELL_SIZE = 20; // in pixels
const INITIAL_SPEED = 200; // ms
const DIRECTIONS: { [key: string]: { x: number; y: number } } = {
  ArrowUp: { x: 0, y: -1 },
  ArrowDown: { x: 0, y: 1 },
  ArrowLeft: { x: -1, y: 0 },
  ArrowRight: { x: 1, y: 0 },
};

const getRandomCoord = () => ({
  x: Math.floor(Math.random() * BOARD_SIZE),
  y: Math.floor(Math.random() * BOARD_SIZE),
});

const Snake: React.FC = () => {
  const [snake, setSnake] = useState([{ x: 7, y: 7 }]);
  const [food, setFood] = useState(getRandomCoord());
  const [direction, setDirection] = useState({ x: 1, y: 0 });
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);

  const gameContainerRef = useRef<HTMLDivElement>(null);

  const resetGame = useCallback(() => {
    setSnake([{ x: 7, y: 7 }]);
    setFood(getRandomCoord());
    setDirection({ x: 1, y: 0 });
    setGameOver(false);
    setScore(0);
    gameContainerRef.current?.focus();
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent | KeyboardEvent) => {
    e.preventDefault();
    const newDirection = DIRECTIONS[e.key];
    if (newDirection) {
      // Prevent the snake from reversing
      if (
        (direction.x === 0 && newDirection.x !== 0) || // vertical to horizontal
        (direction.y === 0 && newDirection.y !== 0)    // horizontal to vertical
      ) {
        setDirection(newDirection);
      }
    }
  }, [direction]);

  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        handleKeyDown(e);
      }
    };
    
    const container = gameContainerRef.current;
    if (container) {
      container.focus();
      container.addEventListener('keydown', handleGlobalKeyDown as any);
    }
    
    return () => {
      if (container) {
        container.removeEventListener('keydown', handleGlobalKeyDown as any);
      }
    };
  }, [handleKeyDown]);
  

  useEffect(() => {
    if (gameOver) return;

    const gameLoop = setInterval(() => {
      setSnake(prevSnake => {
        const newSnake = [...prevSnake];
        const head = { ...newSnake[0] };
        head.x += direction.x;
        head.y += direction.y;

        // Wall collision
        if (head.x < 0 || head.x >= BOARD_SIZE || head.y < 0 || head.y >= BOARD_SIZE) {
          setGameOver(true);
          return prevSnake;
        }

        // Self collision
        for (let i = 1; i < newSnake.length; i++) {
          if (head.x === newSnake[i].x && head.y === newSnake[i].y) {
            setGameOver(true);
            return prevSnake;
          }
        }
        
        newSnake.unshift(head);

        // Food collision
        if (head.x === food.x && head.y === food.y) {
          setScore(s => s + 1);
          let newFood;
          do {
            newFood = getRandomCoord();
          } while (newSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
          setFood(newFood);
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    }, INITIAL_SPEED);

    return () => clearInterval(gameLoop);
  }, [snake, direction, food, gameOver]);
  
  return (
    <div
      ref={gameContainerRef}
      tabIndex={0}
      className="flex flex-col items-center p-2 bg-gray-800 h-full text-white outline-none"
    >
      <div className="w-full flex justify-between items-center p-2 mb-2">
        <div className="font-mono text-lg">Score: {score}</div>
        {gameOver && <div className="font-mono text-lg text-red-500">Game Over!</div>}
      </div>
      <div
        className="bg-black grid relative"
        style={{
          width: BOARD_SIZE * CELL_SIZE,
          height: BOARD_SIZE * CELL_SIZE,
          gridTemplateColumns: `repeat(${BOARD_SIZE}, 1fr)`,
        }}
      >
        {snake.map((segment, index) => (
          <div
            key={index}
            className="bg-green-500"
            style={{ gridColumnStart: segment.x + 1, gridRowStart: segment.y + 1 }}
          />
        ))}
        <div
          className="bg-red-500 rounded-full"
          style={{ gridColumnStart: food.x + 1, gridRowStart: food.y + 1 }}
        />
      </div>
      <button onClick={resetGame} className="mt-4 px-4 py-2 bg-blue-500 rounded hover:bg-blue-600">
        {gameOver ? 'Play Again' : 'Restart'}
      </button>
      <p className="text-xs text-gray-400 mt-2">Use arrow keys to move</p>
    </div>
  );
};

export default Snake;
