import { useEffect, useState } from 'react';

const RemainingDays = ({ updatedAt }) => {
  const [remainingDays, setRemainingDays] = useState(null);

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

  const calculateRemaining = () => {
    if (!updatedAt) return null;

    const now = new Date();
    const start = new Date(updatedAt);
    const deadline = addBusinessDays(start, 7);
    const diffMs = deadline - now;
    const days = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    return days >= 0 ? days : 0;
  };

  useEffect(() => {
    setRemainingDays(calculateRemaining());

    const interval = setInterval(() => {
      setRemainingDays(calculateRemaining());
    }, 60000); // Actualiza cada minuto

    return () => clearInterval(interval);
  }, [updatedAt]);

  if (remainingDays === null) return null;

  return (
    <div className="remaining-days">
      {remainingDays} {remainingDays === 1 ? 'día' : 'días'}
    </div>
  );
};

export default RemainingDays;
