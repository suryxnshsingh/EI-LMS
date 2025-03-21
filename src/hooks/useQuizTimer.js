import { useState, useRef, useEffect } from 'react';

export const useQuizTimer = (initialTimeInMinutes, onTimeUp) => {
  // Ensure initial time is never negative
  const initialSeconds = Math.max(0, (initialTimeInMinutes || 0) * 60);
  const [displayTime, setDisplayTime] = useState(initialSeconds);
  const timeRef = useRef(initialSeconds);
  const intervalRef = useRef(null);

  const startTimer = () => {
    if (intervalRef.current || timeRef.current <= 0) return;

    intervalRef.current = setInterval(() => {
      timeRef.current = Math.max(0, timeRef.current - 1);
      setDisplayTime(timeRef.current);

      if (timeRef.current <= 0) {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        onTimeUp?.();
      }
    }, 1000);
  };

  const stopTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  // Reset timer if initialTimeInMinutes changes
  useEffect(() => {
    const newSeconds = Math.max(0, (initialTimeInMinutes || 0) * 60);
    timeRef.current = newSeconds;
    setDisplayTime(newSeconds);
    
    // Clear existing interval
    stopTimer();
    
    // Start new timer if we have valid time
    if (newSeconds > 0) {
      startTimer();
    }
  }, [initialTimeInMinutes]);

  useEffect(() => {
    return () => stopTimer();
  }, []);

  return {
    timeLeft: displayTime,
    stopTimer
  };
};
