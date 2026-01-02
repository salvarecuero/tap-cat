import type { Boost } from "@/game/types";
import { BoostCard } from "./BoostCard";

interface ShopBarProps {
  boosts: Boost[];
  ownedBoosts: Record<string, true>;
  currentPets: number;
  onBuy: (boostId: string) => void;
}

const TOTAL_TILES = 12;

export function ShopBar({
  boosts,
  ownedBoosts,
  currentPets,
  onBuy,
}: ShopBarProps) {
  // Create array of 12 tiles
  const tiles = Array.from({ length: TOTAL_TILES }, (_, i) => {
    const boost = boosts[i];
    return boost || null;
  });

  return (
    <div className="w-full max-w-[960px] mx-auto px-4 md:px-6 pb-4">
      <div className="bg-[#8B5A2B] bg-opacity-40 border-[3px] border-[var(--accent)] border-opacity-40 rounded-[18px] p-3 md:p-4">
        <div className="flex gap-2 md:gap-2.5 overflow-x-auto scrollbar-hide">
          {tiles.map((boost, index) => (
            <div key={index} className="flex-shrink-0">
              {boost ? (
                <BoostCard
                  boost={boost}
                  owned={!!ownedBoosts[boost.id]}
                  canAfford={currentPets >= boost.price}
                  onBuy={() => onBuy(boost.id)}
                />
              ) : (
                <div className="w-[72px] h-[56px] md:w-[84px] md:h-[64px] bg-[#F3E7C6] bg-opacity-30 border-2 border-[var(--accent)] border-opacity-20 rounded-xl" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
