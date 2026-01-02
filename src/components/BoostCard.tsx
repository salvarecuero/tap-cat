import type { Boost } from "@/game/types";

interface BoostCardProps {
  boost: Boost;
  owned: boolean;
  canAfford: boolean;
  onBuy: () => void;
}

export function BoostCard({ boost, owned, canAfford, onBuy }: BoostCardProps) {
  const disabled = owned || !canAfford;

  return (
    <button
      onClick={onBuy}
      disabled={disabled}
      className={`
        relative flex flex-col items-center justify-center
        w-[72px] h-[56px] md:w-[84px] md:h-[64px]
        bg-[#F3E7C6] border-2 border-[var(--accent)] border-opacity-35 rounded-xl
        transition-all duration-150
        ${!disabled ? "hover:scale-105 hover:shadow-lg cursor-pointer" : "opacity-50 cursor-not-allowed"}
      `}
    >
      {/* Icon */}
      <div className="w-6 h-6 mb-1">
        <img
          src={boost.icon}
          alt={boost.imageDescription}
          className="w-full h-full object-contain"
        />
      </div>

      {/* Price or Owned */}
      <div className="text-[10px] font-semibold text-[#7A4E2D]">
        {owned ? "Owned" : `${boost.price}`}
      </div>

      {/* Owned pill overlay */}
      {owned && (
        <div className="absolute top-1 right-1 bg-green-600 text-white text-[8px] px-1 rounded">
          ✓
        </div>
      )}
    </button>
  );
}
