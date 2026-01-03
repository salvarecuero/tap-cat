"use client";

import type { CatProfile } from "@/game/types";

interface CatSelectorProps {
  cats: CatProfile[];
  selectedCatId: string;
  onSelect: (catId: string) => void;
}

export function CatSelector({ cats, selectedCatId, onSelect }: CatSelectorProps) {
  return (
    <div className="flex gap-2">
      {cats.map((cat) => {
        const isSelected = cat.id === selectedCatId;
        return (
          <button
            key={cat.id}
            onClick={() => onSelect(cat.id)}
            className={`w-8 h-8 rounded-full transition-all ${
              isSelected
                ? "ring-2 ring-white ring-offset-2 ring-offset-transparent scale-110"
                : "opacity-70 hover:opacity-100 hover:scale-105"
            }`}
            style={{
              background: `linear-gradient(135deg, ${cat.theme.bgTop} 50%, ${cat.theme.bgBottom} 50%)`,
            }}
            title={cat.name}
            aria-label={`Select ${cat.name}`}
            aria-pressed={isSelected}
          />
        );
      })}
    </div>
  );
}
