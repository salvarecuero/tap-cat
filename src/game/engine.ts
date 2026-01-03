import type { CatProfile, Boost, AutoClickBoost, GameState } from "./types";

/**
 * Get the active sprite key based on total pets accumulated
 * Stages don't need to be sorted in JSON, we handle sorting here
 */
export function getActiveStageSpriteKey(
  cat: CatProfile,
  totalPets: number
): string {
  const stages = [...cat.sprites.stages].sort((a, b) => a.minPets - b.minPets);

  // Find the last stage whose minPets threshold is met
  let activeStage = stages[0];
  for (const stage of stages) {
    if (totalPets >= stage.minPets) {
      activeStage = stage;
    } else {
      break;
    }
  }

  return activeStage.key;
}

/**
 * Get the maximum (final) stage key for a cat
 * Used to determine if player has reached the final evolution
 */
export function getMaxStageKey(cat: CatProfile): string {
  const stages = [...cat.sprites.stages].sort((a, b) => a.minPets - b.minPets);
  return stages[stages.length - 1].key;
}

/**
 * Get sprite URL by key, falling back to idle if key is invalid
 * Uses the cat's stages array to validate the key, supporting any stage keys
 */
export function getSpriteUrlByKey(cat: CatProfile, key: string): string {
  const { sprites } = cat;

  // Check if the key exists in the stages array
  const isValidKey = sprites.stages.some((stage) => stage.key === key);

  if (isValidKey) {
    const spriteUrl = sprites[key];
    // Ensure it's a string (not stages array or undefined)
    if (typeof spriteUrl === "string") {
      return spriteUrl;
    }
  }

  // Fallback to idle
  return sprites.idle;
}

/**
 * Calculate pets per click based on owned boosts
 */
export function getPetsPerClick(
  boosts: Boost[],
  owned: Record<string, true>
): number {
  let multiplier = 1;

  for (const boost of boosts) {
    if (boost.type === "clickMultiplier" && owned[boost.id]) {
      multiplier *= boost.value;
    }
  }

  return multiplier;
}

/**
 * Get all owned auto-click boosts
 */
export function getAutoClickBoosts(
  boosts: Boost[],
  owned: Record<string, true>
): AutoClickBoost[] {
  return boosts.filter(
    (boost): boost is AutoClickBoost =>
      boost.type === "autoClick" && owned[boost.id]
  );
}

/**
 * Check if a boost can be purchased
 */
export function canBuyBoost(state: GameState, boost: Boost): boolean {
  return !state.ownedBoosts[boost.id] && state.pets >= boost.price;
}

/**
 * Purchase a boost (returns new state)
 */
export function buyBoost(state: GameState, boost: Boost): GameState {
  if (!canBuyBoost(state, boost)) {
    return state;
  }

  return {
    ...state,
    pets: state.pets - boost.price,
    ownedBoosts: {
      ...state.ownedBoosts,
      [boost.id]: true,
    },
  };
}

/**
 * Apply a click (returns new state)
 */
export function applyClick(state: GameState, petsPerClick: number): GameState {
  return {
    ...state,
    pets: state.pets + petsPerClick,
    totalPets: state.totalPets + petsPerClick,
  };
}

/**
 * Calculate pets per second from auto-click boosts with click synergy.
 * Auto-clicks benefit partially from click multipliers via sqrt scaling,
 * capped to maintain 2-3:1 active advantage.
 */
export function getPetsPerSecond(
  boosts: Boost[],
  owned: Record<string, true>
): number {
  const autoClickBoosts = getAutoClickBoosts(boosts, owned);
  const petsPerClick = getPetsPerClick(boosts, owned);

  // Synergy: auto-clicks get sqrt of click multiplier, capped at 24x
  const SYNERGY_CAP = 24;
  const synergyMultiplier = Math.min(Math.sqrt(petsPerClick), SYNERGY_CAP);

  let basePetsPerSecond = 0;
  for (const boost of autoClickBoosts) {
    const petsPerInterval = boost.value;
    const intervalsPerSecond = 1000 / boost.intervalMs;
    basePetsPerSecond += petsPerInterval * intervalsPerSecond;
  }

  return basePetsPerSecond * synergyMultiplier;
}
