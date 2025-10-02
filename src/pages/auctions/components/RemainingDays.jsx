import React, { useEffect, useState } from 'react';
import { FaRegClock } from 'react-icons/fa'; // reloj circular

const RemainingDays = ({ updatedAt }) => {
  const [remainingTime, setRemainingTime] = useState(null);

  const calculateTimeLeft = () => {
    if (!updatedAt) return null;

    const now = new Date();
    const start = new Date(updatedAt);
    const deadline = new Date(start);
    deadline.setDate(deadline.getDate() + 8);

    const diffMs = deadline - now;
    const diffInSeconds = Math.floor(diffMs / 1000);

    if (diffInSeconds <= 0)
      return { totalSeconds: 0, days: 0, hours: 0, minutes: 0, seconds: 0 };

    const days = Math.floor(diffInSeconds / (60 * 60 * 24));
    const hours = Math.floor((diffInSeconds % (60 * 60 * 24)) / 3600);
    const minutes = Math.floor((diffInSeconds % 3600) / 60);
    const seconds = diffInSeconds % 60;

    return { totalSeconds: diffInSeconds, days, hours, minutes, seconds };
  };

  useEffect(() => {
    const updateTime = () => setRemainingTime(calculateTimeLeft());
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [updatedAt]);

  if (!remainingTime) return null;

  const { totalSeconds, days, hours, minutes, seconds } = remainingTime;

  let timeText = "";
  if (totalSeconds <= 0) timeText = "Finalizado";
  else if (totalSeconds < 60) timeText = `${seconds} s`;
  else if (totalSeconds < 3600) timeText = `${minutes} m ${seconds} s`;
  else if (days < 1) timeText = `${hours} h ${minutes} m`;
  else timeText = `${days === 1 ? "1 día" : days + " días"}`;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
      <FaRegClock />
      <span>{timeText}</span>
    </div>
  );
};

export default RemainingDays;
