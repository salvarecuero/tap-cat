"use client";

import { useState } from "react";
import type { CatAnim } from "@/game/types";

interface CatSpriteProps {
  src: string;
  tapOverlaySrc?: string;
  onTap: (x: number, y: number) => void;
  anim: CatAnim;
}

export function CatSprite({ src, tapOverlaySrc, onTap, anim }: CatSpriteProps) {
  const [isTapping, setIsTapping] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);

  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault();

    // Prevent double-fire
    if (isTapping) return;

    setIsTapping(true);
    onTap(e.clientX, e.clientY);

    // Show tap overlay
    if (tapOverlaySrc) {
      setShowOverlay(true);
      setTimeout(() => setShowOverlay(false), 250);
    }

    // Reset animation after duration
    setTimeout(() => setIsTapping(false), 150);
  };

  return (
    <div className="relative w-full h-full min-w-0 min-h-0 flex items-center justify-center">
      <button
        onPointerDown={handlePointerDown}
        className="absolute inset-0 flex items-center justify-center outline-none focus:outline-none"
        style={{
          transform: isTapping
            ? `scale(${anim.tapScale}) rotate(${Math.random() > 0.5 ? anim.tapWiggleDeg : -anim.tapWiggleDeg}deg)`
            : "scale(1) rotate(0deg)",
          transition: "transform 150ms ease-out",
        }}
      >
        <img
          src={src}
          alt="Cat"
          className="max-w-full max-h-full w-auto h-auto object-contain select-none pointer-events-none"
          draggable={false}
          style={{ maxHeight: '100%', maxWidth: '100%' }}
        />

        {/* Tap overlay */}
        {tapOverlaySrc && showOverlay && (
          <div
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            style={{
              animation: "fadeOut 250ms ease-out forwards",
            }}
          >
            <img
              src={tapOverlaySrc}
              alt=""
              className="w-full h-full object-contain"
              draggable={false}
            />
          </div>
        )}
      </button>
    </div>
  );
}
