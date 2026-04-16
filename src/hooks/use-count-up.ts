import { useState, useEffect, useRef } from "react";

export function useCountUp(target: number, duration = 800) {
  const [value, setValue] = useState<number>(0);
  const rafRef = useRef<number>();

  useEffect(() => {
    if (target === 0) {
      setValue(0);
      return;
    }

    const start = performance.now();
    const from = 0;

    function tick(now: number) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = from + (target - from) * eased;

      setValue(Number.isInteger(target) ? Math.round(current) : parseFloat(current.toFixed(1)));

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      }
    }

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [target, duration]);

  return value;
}
