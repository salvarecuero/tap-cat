// Cat profile types
export interface CatTheme {
  bgTop: string;
  bgBottom: string;
  accent: string;
  patternClass: string;
}

export interface CatStage {
  minPets: number;
  key: string;
}

export interface CatSprites {
  idle: string;
  happy1: string;
  happy2: string;
  ecstatic: string;
  tapOverlay?: string;
  stages: CatStage[];
}

export interface CatAnim {
  tapScale: number;
  tapWiggleDeg: number;
}

export interface CatProfile {
  id: string;
  name: string;
  theme: CatTheme;
  sprites: CatSprites;
  anim: CatAnim;
}

// Boost types
export type BoostType = "clickMultiplier" | "autoClick";

export interface BaseBoost {
  id: string;
  title: string;
  description: string;
  imageDescription: string;
  price: number;
  icon: string;
}

export interface ClickMultiplierBoost extends BaseBoost {
  type: "clickMultiplier";
  value: number;
}

export interface AutoClickBoost extends BaseBoost {
  type: "autoClick";
  value: number;
  intervalMs: number;
}

export type Boost = ClickMultiplierBoost | AutoClickBoost;

// Game state types
export interface GameState {
  version: number;
  pets: number;
  totalPets: number;
  ownedBoosts: Record<string, true>;
  selectedCatId: string;
}
