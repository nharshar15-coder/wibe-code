import { useState, useEffect, useRef, useCallback } from 'react';
import { Point, Direction } from '../types';

const GRID_SIZE = 20;
const INITIAL_SNAKE: Point[] = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION = Direction.UP;
const SPEED = 150;

export default function SnakeGame() {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [direction, setDirection] = useState<Direction>(INITIAL_DIRECTION);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameLoopRef = useRef<number | null>(null);
  const directionRef = useRef<Direction>(INITIAL_DIRECTION);

  const generateFood = useCallback((currentSnake: Point[]): Point => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      if (!currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y)) {
        break;
      }
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setFood({ x: 5, y: 5 });
    setDirection(INITIAL_DIRECTION);
    directionRef.current = INITIAL_DIRECTION;
    setScore(0);
    setGameOver(false);
    setIsPaused(false);
  };

  const moveSnake = useCallback(() => {
    if (gameOver || isPaused) return;

    setSnake(prevSnake => {
      const head = prevSnake[0];
      const newHead = { ...head };

      switch (directionRef.current) {
        case Direction.UP: newHead.y -= 1; break;
        case Direction.DOWN: newHead.y += 1; break;
        case Direction.LEFT: newHead.x -= 1; break;
        case Direction.RIGHT: newHead.x += 1; break;
      }

      // Check collisions
      if (
        newHead.x < 0 || newHead.x >= GRID_SIZE ||
        newHead.y < 0 || newHead.y >= GRID_SIZE ||
        prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)
      ) {
        setGameOver(true);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Check food
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore(s => s + 10);
        setFood(generateFood(newSnake));
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [gameOver, isPaused, food, generateFood]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp': if (directionRef.current !== Direction.DOWN) directionRef.current = Direction.UP; break;
        case 'ArrowDown': if (directionRef.current !== Direction.UP) directionRef.current = Direction.DOWN; break;
        case 'ArrowLeft': if (directionRef.current !== Direction.RIGHT) directionRef.current = Direction.LEFT; break;
        case 'ArrowRight': if (directionRef.current !== Direction.LEFT) directionRef.current = Direction.RIGHT; break;
        case ' ': setIsPaused(p => !p); break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (!gameOver && !isPaused) {
      gameLoopRef.current = window.setInterval(moveSnake, SPEED);
    } else {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    }
    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [moveSnake, gameOver, isPaused]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw snake
    snake.forEach((segment, index) => {
      ctx.fillStyle = index === 0 ? '#ffffff' : '#39ff14';
      ctx.shadowBlur = index === 0 ? 15 : 10;
      ctx.shadowColor = '#39ff14';
      ctx.fillRect(
        segment.x * (canvas.width / GRID_SIZE),
        segment.y * (canvas.height / GRID_SIZE),
        (canvas.width / GRID_SIZE) - 2,
        (canvas.height / GRID_SIZE) - 2
      );
    });

    // Draw food
    ctx.fillStyle = '#ff00ea';
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#ff00ea';
    ctx.beginPath();
    const cellSize = canvas.width / GRID_SIZE;
    ctx.arc(
      food.x * cellSize + cellSize / 2,
      food.y * cellSize + cellSize / 2,
      cellSize / 3,
      0,
      Math.PI * 2
    );
    ctx.fill();

  }, [snake, food]);

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-full h-full p-4 overflow-hidden">
      <div className="relative group p-1 bg-[#1a1a1c] rounded-sm shadow-inner overflow-hidden">
        {/* Grid Background Effect */}
        <div className="absolute inset-1 pointer-events-none z-0 overflow-hidden">
          <div 
            className="w-full h-full opacity-10" 
            style={{ 
              backgroundImage: 'linear-gradient(#39ff14 1px, transparent 1px), linear-gradient(90deg, #39ff14 1px, transparent 1px)',
              backgroundSize: '20px 20px'
            }} 
          />
        </div>
        
        <canvas
          ref={canvasRef}
          width={400}
          height={400}
          className="relative z-10 bg-black/80 block"
        />
        
        {isPaused && !gameOver && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/60 backdrop-blur-[2px]">
            <span className="text-[#00f3ff] font-mono text-xl tracking-[0.5em] animate-pulse">SYSTEM PAUSE</span>
          </div>
        )}

        {gameOver && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/90 backdrop-blur-md">
            <span className="text-[#ff00ea] font-mono text-3xl font-black mb-6 tracking-tighter shadow-pink-500/50 drop-shadow-[0_0_10px_rgba(255,0,234,0.5)]">TERMINATED</span>
            <button 
              onClick={resetGame}
              className="px-8 py-3 bg-[#39ff14] text-black font-black uppercase text-sm tracking-widest hover:bg-white transition-all transform active:scale-95 shadow-[0_0_15px_rgba(57,255,20,0.4)]"
            >
              Restart Session
            </button>
          </div>
        )}
      </div>

      <div className="w-[400px] flex justify-between items-end">
        <div className="space-y-1">
          <div className="text-[10px] text-[#8e9299] uppercase font-mono tracking-widest">Score Data</div>
          <div className="text-4xl font-black font-mono text-[#39ff14] leading-none tracking-tighter">
            {score.toString().padStart(6, '0')}
          </div>
        </div>

        <div className="flex flex-col items-end gap-3">
          <div className="flex gap-2">
            {!gameOver && (
              <button 
                onClick={() => setIsPaused(!isPaused)}
                className="px-3 py-1 bg-white/5 border border-white/10 text-[9px] font-mono uppercase tracking-widest hover:bg-white/10 transition-colors"
              >
                {isPaused ? 'Resume' : 'Pause'}
              </button>
            )}
            <button 
              onClick={resetGame}
              className="px-3 py-1 bg-white/5 border border-white/10 text-[9px] font-mono uppercase tracking-widest hover:bg-white/10 transition-colors"
            >
              Reset
            </button>
          </div>
          <div className="text-[9px] text-[#8e9299]/50 font-mono uppercase text-right">
            [ UP/DOWN/LEFT/RIGHT ] to Intercept
          </div>
        </div>
      </div>
    </div>
  );
}
