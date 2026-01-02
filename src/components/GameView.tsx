"use client";

import { DEFAULT_CAT } from "@/content/cats/orange-tabby";
import { BOOSTS } from "@/content/boosts";
import { useGame } from "@/game/useGame";
import { CatSprite } from "./CatSprite";
import { Counter } from "./Counter";
import { ShopBar } from "./ShopBar";
import { ResetButton } from "./ResetButton";

export function GameView() {
  const { state, activeSpriteSrc, tapCat, buy, reset, mounted } = useGame({
    cat: DEFAULT_CAT,
    boosts: BOOSTS,
  });

  // Avoid hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#F9C74F] to-[#F8961E]">
        <p className="text-white text-lg">Loading...</p>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex flex-col relative overflow-hidden"
      style={
        {
          "--bg-top": DEFAULT_CAT.theme.bgTop,
          "--bg-bottom": DEFAULT_CAT.theme.bgBottom,
          "--accent": DEFAULT_CAT.theme.accent,
          background: `linear-gradient(to bottom, var(--bg-top), var(--bg-bottom))`,
        } as React.CSSProperties
      }
    >
      {/* Background pattern overlay */}
      <div className="absolute inset-0 pattern-overlay pointer-events-none" />

      {/* Reset button - top right */}
      <div className="absolute top-4 right-4 z-10">
        <ResetButton onReset={reset} />
      </div>

      {/* Content */}
      <div className="relative z-0 flex flex-col flex-1">
        {/* Cat area - takes ~60% of viewport */}
        <div className="flex-1 flex items-center justify-center pt-8 pb-4">
          <CatSprite
            src={activeSpriteSrc}
            tapOverlaySrc={DEFAULT_CAT.sprites.tapOverlay}
            onTap={tapCat}
            anim={DEFAULT_CAT.anim}
          />
        </div>

        {/* Counter */}
        <div className="flex items-center justify-center">
          <Counter value={state.pets} />
        </div>

        {/* Shop bar - bottom */}
        <div className="pb-4 pt-2">
          <ShopBar
            boosts={BOOSTS}
            ownedBoosts={state.ownedBoosts}
            currentPets={state.pets}
            onBuy={buy}
          />
        </div>
      </div>
    </div>
  );
}
