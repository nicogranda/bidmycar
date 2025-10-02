import { useEffect, useState } from 'react';
import './RemainingDays.css';

const RemainingDays = ({ updatedAt }) => {
  const [remainingTime, setRemainingTime] = useState(null);

  const addBusinessDays = (startDate, businessDaysToAdd) => {
    let current = new Date(startDate);
    let added = 0;

    while (added < businessDaysToAdd) {
      current.setDate(current.getDate() + 1);
      const day = current.getDay();
      if (day !== 0 && day !== 6) {
        added++;
      }
    }

    return current;
  };

  const calculateTimeLeft = () => {
    if (!updatedAt) return null;

    const now = new Date();
    const start = new Date(updatedAt);
    const deadline = addBusinessDays(start, 7);
    const diffMs = deadline - now;

    const diffInSeconds = Math.floor(diffMs / 1000);
    const days = Math.floor(diffInSeconds / (60 * 60 * 24));
    const hours = Math.floor((diffInSeconds % (60 * 60 * 24)) / 3600);
    const minutes = Math.floor((diffInSeconds % 3600) / 60);
    const seconds = diffInSeconds % 60;

    return {
      totalSeconds: diffInSeconds,
      days,
      hours,
      minutes,
      seconds
    };
  };

  useEffect(() => {
    const updateTime = () => {
      const newTime = calculateTimeLeft();
      setRemainingTime(newTime);
    };

    updateTime();

    const interval = setInterval(updateTime, 1000); // actualiza cada segundo
    return () => clearInterval(interval);
  }, [updatedAt]);

  if (!remainingTime || remainingTime.totalSeconds <= 0) {
    return <div className="remaining-days">Finalizado</div>;
  }

  const { days, hours, minutes, seconds, totalSeconds } = remainingTime;

  if (totalSeconds <= 3600) {
    // Menos de una hora
    return (
      <div className="remaining-days">
        ⏳ Quedan: {minutes}m {seconds}s
      </div>
    );
  }

  return (
    <div className="remaining-days">
      {days > 0 ? (
        <>
          Quedan {days} {days === 1 ? 'día' : 'días'}
        </>
      ) : (
        <>
         Quedan: {hours}h {minutes}m
        </>
      )}
    </div>
  );
};

export default RemainingDays;
