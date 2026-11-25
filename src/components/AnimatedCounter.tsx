import React, { useEffect, useRef, useState } from 'react';
import { animate, useInView } from 'motion/react';

interface AnimatedCounterProps {
  value: number;
  decimals?: number;
  duration?: number;
  className?: string;
}

/**
 * Bộ đếm số mượt mà (Ease Out) khi hiển thị trong khung nhìn hoặc khi giá trị thay đổi.
 */
export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  value,
  decimals = 0,
  duration = 0.9,
  className = '',
}) => {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, amount: 'some' });
  const [displayValue, setDisplayValue] = useState<number>(0);
  const prevValueRef = useRef<number>(0);

  useEffect(() => {
    if (!isInView) return;

    const startValue = prevValueRef.current;
    const controls = animate(startValue, value, {
      duration,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (latest) => {
        setDisplayValue(latest);
      },
      onComplete: () => {
        prevValueRef.current = value;
        setDisplayValue(value);
      },
    });

    return () => controls.stop();
  }, [value, duration, isInView]);

  const formatted =
    decimals > 0
      ? Number(displayValue.toFixed(decimals)).toLocaleString('vi-VN', {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
        })
      : Math.round(displayValue).toLocaleString('vi-VN');

  return (
    <span ref={ref} className={className}>
      {formatted}
    </span>
  );
};
