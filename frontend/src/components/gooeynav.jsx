import React, { useState } from "react";

export default function GooeyNav({
  items = [],
  initialActiveIndex = 0,
  animationTime = 600,
  colors = [1, 2, 3],
}) {
  const [activeIndex, setActiveIndex] =
    useState(initialActiveIndex);

  const handleClick = (index, href) => {
    setActiveIndex(index);

    if (href) {
      window.history.pushState({}, "", href);

      window.dispatchEvent(new PopStateEvent("popstate"));
    }
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
          padding: "6px",
          borderRadius: "999px",
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.08)",
          position: "relative",
        }}
      >
        {items.map((item, index) => {
          const isActive = index === activeIndex;

          return (
            <button
              key={item.label}
              onClick={() =>
                handleClick(index, item.href)
              }
              style={{
                position: "relative",
                border: "none",
                background: "transparent",
                color: isActive
                  ? "#ffffff"
                  : "rgba(255,255,255,0.6)",
                padding: "9px 14px",
                borderRadius: "999px",
                fontSize: "14px",
                fontWeight: 500,
                cursor: "pointer",
                whiteSpace: "nowrap",
                transition: `all ${animationTime}ms ease`,
                zIndex: 2,
              }}
            >
              {isActive && (
                <span
                  style={{
                    position: "absolute",
                    inset: 0,
                    borderRadius: "999px",
                    background:
                      "rgba(255,255,255,0.12)",
                    boxShadow:
                      "0 0 20px rgba(255,255,255,0.12)",
                    zIndex: -1,
                  }}
                />
              )}

              {item.label}
            </button>
          );
        })}
      </div>
    </>
  );
}