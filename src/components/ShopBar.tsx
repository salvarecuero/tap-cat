"use client";

import { useRef, useState, useEffect } from "react";
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
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Create array of 12 tiles
  const tiles = Array.from({ length: TOTAL_TILES }, (_, i) => {
    const boost = boosts[i];
    return boost || null;
  });

  // Check scroll position
  const updateScrollButtons = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 5);
  };

  // Handle scroll
  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const scrollAmount = 300;
    const newScrollLeft =
      direction === "left"
        ? scrollRef.current.scrollLeft - scrollAmount
        : scrollRef.current.scrollLeft + scrollAmount;
    scrollRef.current.scrollTo({ left: newScrollLeft, behavior: "smooth" });
  };

  useEffect(() => {
    updateScrollButtons();
    const element = scrollRef.current;
    if (element) {
      element.addEventListener("scroll", updateScrollButtons);
      window.addEventListener("resize", updateScrollButtons);
      return () => {
        element.removeEventListener("scroll", updateScrollButtons);
        window.removeEventListener("resize", updateScrollButtons);
      };
    }
  }, []);

  return (
    <div className="w-full max-w-[960px] mx-auto px-3 md:px-4">
      <div className="bg-[#8B5A2B] bg-opacity-40 border-[3px] border-[var(--accent)] border-opacity-40 rounded-[18px] p-2 md:p-3 relative">
        {/* Left arrow button */}
        {canScrollLeft && (
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-[var(--accent)] bg-opacity-70 hover:bg-opacity-90 text-white rounded-r-lg px-2 py-8 transition-all duration-150 shadow-lg"
            aria-label="Scroll left"
          >
            <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}

        {/* Two-row grid layout */}
        <div
          ref={scrollRef}
          className="grid grid-cols-4 md:grid-cols-6 grid-rows-2 gap-2 md:gap-2.5 overflow-x-auto scrollbar-hide scroll-smooth"
        >
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
                <div className="w-[110px] h-[118px] md:w-[140px] md:h-[140px] bg-[#F3E7C6] bg-opacity-20 border-2 border-dashed border-[var(--accent)] border-opacity-30 rounded-xl flex items-center justify-center">
                  <span className="text-[var(--accent)] opacity-40 text-xs">🔒</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Right arrow button */}
        {canScrollRight && (
          <button
            onClick={() => scroll("right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-[var(--accent)] bg-opacity-70 hover:bg-opacity-90 text-white rounded-l-lg px-2 py-8 transition-all duration-150 shadow-lg"
            aria-label="Scroll right"
          >
            <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
