import React, { useEffect, useState } from "react";
import styles from './CountdownTimer.module.css';


const CountdownTimer = ({ deliveryTime }) => {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  function calculateTimeLeft() {
    const now = new Date().getTime();
    const deliveryTimestamp = new Date(deliveryTime).getTime();
    const difference = deliveryTimestamp - now;

    if (difference <= 0) {
      return { hours: 0, minutes: 0, seconds: 0 };
    }

    const hours = Math.floor(difference / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    return { hours, minutes, seconds };
  }

  return (
    <span  className={styles.countdown}>
        {timeLeft.hours}:{timeLeft.minutes}:{timeLeft.seconds}
    </span>
  );
};

export default CountdownTimer;