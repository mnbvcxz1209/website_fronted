import React, { useState, useEffect } from "react";
import "./NumberClickGame.css";

const getRandomPosition = (existingPositions, radius = 60) => {
  let position;
  let maxAttempts = 100;
  let attempts = 0;

  do {
    const top = Math.random() * 80 + 5;
    const left = Math.random() * 80 + 5;
    position = { top, left };
    attempts++;

    const overlap = existingPositions.some((pos) => {
      const dy = pos.top - top;
      const dx = pos.left - left;
      return Math.sqrt(dx * dx + dy * dy) < radius * 0.2;
    });

    if (!overlap) break;
  } while (attempts < maxAttempts);

  return {
    top: `${position.top}%`,
    left: `${position.left}%`,
  };
};

const generateNumbers = (count) => {
  const nums = Array.from({ length: count }, (_, i) => i + 1);
  const positions = [];

  return nums.map((num) => {
    const position = getRandomPosition(positions);
    const numericPos = {
      top: parseFloat(position.top),
      left: parseFloat(position.left),
    };
    positions.push(numericPos);
    return {
      number: num,
      position,
    };
  });
};

export default function TestComponent() {
  const [maxNumber, setMaxNumber] = useState(5);
  const [expected, setExpected] = useState(1);
  const [numbers, setNumbers] = useState(generateNumbers(5));
  const [gameOver, setGameOver] = useState(false);
  const [fadingNumbers, setFadingNumbers] = useState([]);
  const [hideOthers, setHideOthers] = useState(false);
  const [round, setRound] = useState(1);
  const [waitingForStart, setWaitingForStart] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [timerActive, setTimerActive] = useState(false);

  const handleClick = (num) => {
    if (gameOver || waitingForStart) return;

    if (num !== expected) {
      setGameOver(true);
      setTimerActive(false);
      return;
    }

    setFadingNumbers((prev) => [...prev, num]);

    setTimeout(() => {
      setNumbers((prevNumbers) => prevNumbers.filter((n) => n.number !== num));
      setFadingNumbers((prev) => prev.filter((n) => n !== num));
    }, 500);

    if (maxNumber > 6 && num === 1) {
      setHideOthers(true);
    }

    if (num === maxNumber) {
      setWaitingForStart(true);
      setRound((prev) => prev + 1);
      setTimerActive(false);
    } else {
      setExpected((prev) => prev + 1);
    }
  };

  const handleStart = () => {
    const nextMax = maxNumber + 1;
    setMaxNumber(nextMax);
    setExpected(1);
    setNumbers(generateNumbers(nextMax));
    setFadingNumbers([]);
    setHideOthers(false);
    setWaitingForStart(false);
    setTimeLeft(20);
    setTimerActive(true);
  };

  const handleRestart = () => {
    setMaxNumber(5);
    setExpected(1);
    setNumbers(generateNumbers(5));
    setGameOver(false);
    setFadingNumbers([]);
    setHideOthers(false);
    setRound(1);
    setWaitingForStart(false);
    setTimerActive(false);
    setTimeLeft(0);
  };

  useEffect(() => {
    if (!timerActive) return;

    if (timeLeft <= 0) {
      if (numbers.length > 0) {
        setGameOver(true);
      }
      setTimerActive(false);
      return;
    }

    const timerId = setTimeout(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timerId);
  }, [timeLeft, timerActive, numbers]);
  return (
    <div className="test-container">
      {gameOver ? (
        <div className="game-over-screen">
          <div className="game-over-text">Game Over</div>
          <button className="restart-button" onClick={handleRestart}>
            Restart
          </button>
        </div>
      ) : waitingForStart && round > 0 ? (
        <>
          <div className="round-info">
            本回合限時 20 秒，請把握時間
          </div>
          <div>
            <button className="start-button" onClick={handleStart}>
              Start Round {round}
            </button>
          </div>
        </>

        )


      : (
        <>
          {numbers.map(({ number, position }) => (
            <button
              key={number}
              onClick={() => handleClick(number)}
              className={`test-button ${
                fadingNumbers.includes(number) ? "fade-out" : ""
              }`}
              style={position}
            >
              {hideOthers && number !== 1 ? "" : number}
            </button>
          ))}
        </>
      )}
      
      {timerActive && (
        <div className={`timer-display ${timeLeft <= 5 ? "danger" : ""}`}>
          Time Left: {timeLeft}s
        </div>
      )}
    </div>
  );
}