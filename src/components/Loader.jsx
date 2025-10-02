import React, { useEffect, useState } from 'react';
import './Loader.css'; // Estilo aparte para mantenerlo limpio

const Loader = ({ max = 100, speed = 1.05, delay = 30, onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [running, setRunning] = useState(true);

  useEffect(() => {
    if (!running) return;

    let currentSpeed = 0.5;
    const interval = setInterval(() => {
      setProgress(prev => {
        const next = prev + currentSpeed;
        currentSpeed *= speed;

        if (next >= max) {
          clearInterval(interval);
          setRunning(false);
          onComplete && onComplete();
          return max;
        }
        return next;
      });
    }, delay);

    return () => clearInterval(interval);
  }, [running]);

  return (
    <div className="loader-container">
      <div className="loader-bar" style={{ width: `${progress}%` }} />
    </div>
  );
};

export default Loader;