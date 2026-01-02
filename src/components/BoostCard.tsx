import type { Boost } from "@/game/types";

interface BoostCardProps {
  boost: Boost;
  owned: boolean;
  canAfford: boolean;
  onBuy: () => void;
}

export function BoostCard({ boost, owned, canAfford, onBuy }: BoostCardProps) {
  const disabled = owned || !canAfford;

  // Color coding based on affordability and ownership
  const priceColor = owned
    ? "text-green-700"
    : canAfford
    ? "text-green-600"
    : "text-red-600";

  return (
    <button
      onClick={onBuy}
      disabled={disabled}
      className={`
        relative flex flex-col items-center justify-between
        w-[96px] h-[80px] md:w-[120px] md:h-[100px]
        bg-[#F3E7C6] border-2 border-[var(--accent)] border-opacity-35 rounded-xl
        transition-all duration-150 p-1.5 md:p-2
        ${!disabled ? "hover:scale-105 hover:shadow-lg cursor-pointer" : "opacity-60 cursor-not-allowed"}
      `}
    >
      {/* Icon - larger and more prominent */}
      <div className="w-7 h-7 md:w-9 md:h-9">
        <img
          src={boost.icon}
          alt={boost.imageDescription}
          className="w-full h-full object-contain drop-shadow-sm"
        />
      </div>

      {/* Boost Title - improved visibility */}
      <div className="text-[10px] md:text-[11px] font-bold text-[#5A3A1F] text-center line-clamp-1 leading-tight px-0.5">
        {boost.title}
      </div>

      {/* Boost Description - what it does */}
      <div className="text-[8px] md:text-[9px] font-medium text-[#7A4E2D] text-center line-clamp-2 leading-tight px-0.5">
        {boost.description}
      </div>

      {/* Price with currency icon */}
      <div className={`text-[9px] md:text-[10px] font-bold ${priceColor} flex items-center gap-0.5`}>
        {owned ? (
          <span className="text-green-700">Owned</span>
        ) : (
          <>
            <span>💰</span>
            <span>{boost.price}</span>
          </>
        )}
      </div>

      {/* Owned checkmark badge - larger and more prominent */}
      {owned && (
        <div className="absolute top-1 right-1 bg-green-600 text-white text-[10px] md:text-[12px] w-4 h-4 md:w-5 md:h-5 flex items-center justify-center rounded-full shadow-md">
          ✓
        </div>
      )}
    </button>
  );
}
