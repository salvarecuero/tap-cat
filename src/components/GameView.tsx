"use client";

import { useState, useRef, useCallback } from "react";
import { ALL_CATS } from "@/content/cats";
import { BOOSTS } from "@/content/boosts";
import { useGame } from "@/game/useGame";
import { CatSprite } from "./CatSprite";
import { Counter } from "./Counter";
import { ShopBar } from "./ShopBar";
import { ResetButton } from "./ResetButton";
import { MaxStageMessage } from "./MaxStageMessage";
import { CatSelector } from "./CatSelector";
import { TapIndicator } from "./TapIndicator";

interface TapIndicatorData {
  id: number;
  x: number;
  y: number;
  value: number;
}

const isDev = process.env.NODE_ENV === "development";

const DEBUG_AMOUNTS = [10, 100, 1000, 10000];

export function GameView() {
  const {
    state,
    activeCat,
    selectedCatId,
    petsPerClick,
    petsPerSecond,
    activeSpriteSrc,
    isAtMaxStage,
    tapCat,
    buy,
    reset,
    selectCat,
    addPets,
    mounted,
  } = useGame({
    boosts: BOOSTS,
  });

  // Tap indicators state
  const [indicators, setIndicators] = useState<TapIndicatorData[]>([]);
  const nextIndicatorId = useRef(0);

  const handleTap = useCallback(
    (x: number, y: number) => {
      tapCat();
      const id = nextIndicatorId.current++;
      setIndicators((prev) => [...prev, { id, x, y, value: petsPerClick }]);
    },
    [tapCat, petsPerClick]
  );

  const removeIndicator = useCallback((id: number) => {
    setIndicators((prev) => prev.filter((ind) => ind.id !== id));
  }, []);

  // Avoid hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#6B5B4F] to-[#4A3F36]">
        <p className="text-white text-lg">Loading...</p>
      </div>
    );
  }

  return (
    <div
      className="h-screen flex flex-col relative overflow-hidden"
      style={
        {
          "--bg-top": activeCat.theme.bgTop,
          "--bg-bottom": activeCat.theme.bgBottom,
          "--accent": activeCat.theme.accent,
          background: `linear-gradient(to bottom, var(--bg-top), var(--bg-bottom))`,
        } as React.CSSProperties
      }
    >
      {/* Background pattern overlay */}
      <div className={`absolute inset-0 ${activeCat.theme.patternClass} pointer-events-none`} />

      {/* Cat selector - top left */}
      <div className="absolute top-2 left-2 z-10">
        <CatSelector
          cats={ALL_CATS}
          selectedCatId={selectedCatId}
          onSelect={selectCat}
        />
      </div>

      {/* Reset button - top right */}
      <div className="absolute top-2 right-2 z-10">
        <ResetButton onReset={reset} />
      </div>

      {/* Content */}
      <div className="relative z-0 flex flex-col h-full min-h-0">
        {/* Cat area - flexible, shrinks as needed */}
        <div className="flex-1 flex items-center justify-center p-4 md:p-6 min-h-0 overflow-hidden" style={{ minHeight: 0 }}>
          <div className="w-full h-full max-w-full max-h-full flex items-center justify-center">
            <CatSprite
              src={activeSpriteSrc}
              tapOverlaySrc={activeCat.sprites.tapOverlay}
              onTap={handleTap}
              anim={activeCat.anim}
            />
          </div>
        </div>

        {/* Counter */}
        <div className="flex items-center justify-center gap-2 flex-shrink-0">
          <Counter value={state.pets} petsPerSecond={petsPerSecond} />
          {isDev && (
            <div className="flex gap-1">
              {DEBUG_AMOUNTS.map((amount) => (
                <button
                  key={amount}
                  onClick={() => addPets(amount)}
                  className="bg-[#5A3A1F] text-white text-xs font-mono px-2 py-1 rounded opacity-70 hover:opacity-100 transition-opacity"
                >
                  +{amount >= 1000 ? `${amount / 1000}K` : amount}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Max stage message */}
        <MaxStageMessage visible={isAtMaxStage} />

        {/* Shop bar - bottom */}
        <div className="pb-1 pt-1 flex-shrink-0">
          <ShopBar
            boosts={BOOSTS}
            ownedBoosts={state.ownedBoosts}
            currentPets={state.pets}
            onBuy={buy}
          />
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 pb-2 px-4">
          <a
            href="https://www.salvarecuero.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="block text-center text-xs font-medium text-white/80 hover:text-white bg-black/20 rounded-full py-1.5 px-4 mx-auto w-fit transition-colors"
          >
            Created with ❤️ by <span className="font-bold">@salvarecuero</span>
          </a>
        </div>
      </div>

      {/* Tap indicators overlay */}
      {indicators.map((ind) => (
        <TapIndicator
          key={ind.id}
          x={ind.x}
          y={ind.y}
          value={ind.value}
          onComplete={() => removeIndicator(ind.id)}
        />
      ))}
    </div>
  );
}
