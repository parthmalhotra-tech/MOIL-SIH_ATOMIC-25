import React, { useRef } from "react";

export default function BorderGlow({
  children,
  className = "",
  glowColor = "#ffffff",
  glowRadius = 50,
  glowIntensity = 1.4,
  borderRadius = 30,
}) {
  const ref = useRef(null);

  const handleMouseMove = (e) => {
    const el = ref.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    el.style.setProperty("--mouse-x", `${x}px`);
    el.style.setProperty("--mouse-y", `${y}px`);
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      className={`border-glow-wrapper ${className}`}
      style={{
        position: "relative",
        borderRadius: `${borderRadius}px`,
        padding: "1px",
        overflow: "hidden",
        background: `radial-gradient(
          ${glowRadius}px circle at var(--mouse-x, 50%) var(--mouse-y, 50%),
          ${glowColor},
          transparent 70%
        )`,
        opacity: glowIntensity,
      }}
    >
      <div
        style={{
          position: "relative",
          borderRadius: `${Math.max(borderRadius - 1, 0)}px`,
          overflow: "hidden",
          height: "100%",
          background: "#111111",
          opacity: 1 / glowIntensity,
        }}
      >
        {children}
      </div>
    </div>
  );
}