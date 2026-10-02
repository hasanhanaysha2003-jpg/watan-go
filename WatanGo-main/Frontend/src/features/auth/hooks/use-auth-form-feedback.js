import { useEffect, useRef, useState } from "react";

export function useAuthFormFeedback() {
  const [errors, setErrors] = useState({});
  const [shake, setShake] = useState(false);
  const shakeTimerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (shakeTimerRef.current) clearTimeout(shakeTimerRef.current);
    };
  }, []);

  const clearFieldError = (field) => {
    setErrors((previous) => {
      if (!previous[field]) return previous;
      return { ...previous, [field]: undefined };
    });
  };

  const triggerShake = () => {
    if (shakeTimerRef.current) clearTimeout(shakeTimerRef.current);
    setShake(true);
    shakeTimerRef.current = setTimeout(() => setShake(false), 500);
  };

  return {
    errors,
    setErrors,
    shake,
    clearFieldError,
    triggerShake,
  };
}
