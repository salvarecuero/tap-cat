"use client";

interface TapIndicatorProps {
  x: number;
  y: number;
  value: number;
  onComplete: () => void;
}

export function TapIndicator({ x, y, value, onComplete }: TapIndicatorProps) {
  return (
    <div
      className="fixed pointer-events-none font-mono font-bold text-2xl md:text-3xl text-white select-none bg-black/20 px-2 py-0.5 rounded-lg"
      style={{
        left: x,
        top: y,
        transform: "translate(-50%, -50%)",
        animation: "floatUp 1s ease-out forwards",
      }}
      onAnimationEnd={onComplete}
    >
      +{value}
    </div>
  );
}
