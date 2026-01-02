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
