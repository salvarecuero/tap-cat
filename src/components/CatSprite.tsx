"use client";

import { useState } from "react";
import type { CatAnim } from "@/game/types";

interface CatSpriteProps {
  src: string;
  tapOverlaySrc?: string;
  onTap: () => void;
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
    onTap();

    // Show tap overlay
    if (tapOverlaySrc) {
      setShowOverlay(true);
      setTimeout(() => setShowOverlay(false), 250);
    }

    // Reset animation after duration
    setTimeout(() => setIsTapping(false), 150);
  };

  return (
    <div className="relative flex items-center justify-center">
      <button
        onPointerDown={handlePointerDown}
        className="relative outline-none focus:outline-none"
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
          className="w-[340px] md:w-[520px] max-w-full h-auto select-none pointer-events-none"
          draggable={false}
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
