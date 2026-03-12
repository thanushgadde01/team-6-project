import { useState, useEffect, useCallback } from 'react';
import './SnakeGame.css';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [
  { x: 10, y: 10 },
  { x: 9, y: 10 },
  { x: 8, y: 10 }
];
const INITIAL_DIRECTION = { x: 1, y: 0 };
const GAME_SPEED = 100;

function SnakeGame() {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [food, setFood] = useState({ x: 15, y: 15 });
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [nextDirection, setNextDirection] = useState(INITIAL_DIRECTION);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);

  // Generate random food position
  const generateFood = useCallback(() => {
    let newFood;
    do {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
    } while (snake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
    return newFood;
  }, [snake]);

  // Handle keyboard input
  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const handleKeyPress = (e) => {
      const moveMap = {
        'ArrowUp': { x: 0, y: -1 },
        'ArrowDown': { x: 0, y: 1 },
        'ArrowLeft': { x: -1, y: 0 },
        'ArrowRight': { x: 1, y: 0 },
        'w': { x: 0, y: -1 },
        'W': { x: 0, y: -1 },
        's': { x: 0, y: 1 },
        'S': { x: 0, y: 1 },
        'a': { x: -1, y: 0 },
        'A': { x: -1, y: 0 },
        'd': { x: 1, y: 0 },
        'D': { x: 1, y: 0 },
      };

      if (moveMap[e.key]) {
        e.preventDefault();
        const newDir = moveMap[e.key];
        // Prevent 180-degree turns
        if (!(direction.x === -newDir.x && direction.y === -newDir.y)) {
          setNextDirection(newDir);
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [direction, gameStarted, gameOver]);

  // Game loop
  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const interval = setInterval(() => {
      setSnake((prevSnake) => {
        const head = prevSnake[0];
        
        // Update direction
        const newDir = nextDirection;
        setDirection(newDir);

        // Calculate new head position
        const newHead = {
          x: (head.x + newDir.x + GRID_SIZE) % GRID_SIZE,
          y: (head.y + newDir.y + GRID_SIZE) % GRID_SIZE,
        };

        // Check if snake hit itself
        if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
          setGameOver(true);
          return prevSnake;
        }

        let newSnake = [newHead, ...prevSnake];

        // Check if snake ate food
        if (newHead.x === food.x && newHead.y === food.y) {
          setScore((s) => s + 10);
          setFood(generateFood());
        } else {
          // Remove tail if not eating food
          newSnake.pop();
        }

        return newSnake;
      });
    }, GAME_SPEED);

    return () => clearInterval(interval);
  }, [gameStarted, gameOver, nextDirection, food, generateFood]);

  const startGame = () => {
    setGameStarted(true);
    setGameOver(false);
  };

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setFood(generateFood());
    setDirection(INITIAL_DIRECTION);
    setNextDirection(INITIAL_DIRECTION);
    setGameOver(false);
    setScore(0);
    setGameStarted(false);
  };

  return (
    <div className="snake-game-container">
      <div className="game-header">
        <h1>🐍 Snake Game</h1>
        <div className="score-display">Score: {score}</div>
      </div>

      <div className="game-board">
        {Array.from({ length: GRID_SIZE }).map((_, y) =>
          Array.from({ length: GRID_SIZE }).map((_, x) => {
            const snakeIndex = snake.findIndex(segment => segment.x === x && segment.y === y);
            const isSnake = snakeIndex !== -1;
            const isFood = food.x === x && food.y === y;
            const isHead = snake[0].x === x && snake[0].y === y;
            const isTail = isSnake && snakeIndex === snake.length - 1;

            return (
              <div
                key={`${x}-${y}`}
                className={`grid-cell ${isSnake ? 'snake' : ''} ${isFood ? 'food' : ''} ${isHead ? 'head' : ''} ${isTail ? 'tail' : ''}`}
              >
                {isHead && (
                  <>
                    <div className="eye eye-left"></div>
                    <div className="eye eye-right"></div>
                  </>
                )}
                {isFood && <div className="food-shine"></div>}
              </div>
            );
          })
        )}
      </div>

      <div className="game-controls">
        {!gameStarted ? (
          <button className="control-button start-button" onClick={startGame}>
            Start Game
          </button>
        ) : gameOver ? (
          <>
            <div className="game-over-text">Game Over!</div>
            <button className="control-button reset-button" onClick={resetGame}>
              Play Again
            </button>
          </>
        ) : (
          <button className="control-button reset-button" onClick={resetGame}>
            Reset
          </button>
        )}
      </div>

      <div className="instructions">
        <h3>How to Play</h3>
        <p>Use <strong>Arrow Keys</strong> or <strong>WASD</strong> to move the snake</p>
        <p>Eat the food to grow and increase your score</p>
        <p>Don't hit the walls or yourself!</p>
      </div>
    </div>
  );
}

export default SnakeGame;
