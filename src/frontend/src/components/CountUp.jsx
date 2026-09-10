import React, { useEffect, useRef, useState } from "react";

export default function CountUp({
  start = 0,
  end = 100,
  duration = 2,
  decimals = 0,
  prefix = "",
  suffix = "",
  separator = "",
  className = "",
}) {
  const [value, setValue] = useState(start);
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;

    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.2,
      }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!visible) return;

    let animationFrame;
    const startTime = performance.now();

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / (duration * 1000), 1);

      // Smooth ease-out
      const easedProgress = 1 - Math.pow(1 - progress, 3);

      const currentValue =
        start + (end - start) * easedProgress;

      setValue(currentValue);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, [visible, start, end, duration]);

  const formattedNumber = value.toFixed(decimals);

  const formatted =
    separator === ","
      ? Number(formattedNumber).toLocaleString("en-US", {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
        })
      : formattedNumber;

  return (
    <span ref={ref} className={className}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}
