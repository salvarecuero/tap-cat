import type { GameState } from "./types";
import { GameStateSchema } from "./schema";

const SAVE_KEY = "cat-petter.save.v1";

/**
 * Load game state from localStorage
 * Returns fallback if save is invalid or missing
 */
export function loadGameState(fallback: GameState): GameState {
  if (typeof window === "undefined") {
    return fallback;
  }

  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) {
      return fallback;
    }

    const parsed = JSON.parse(raw);
    const validated = GameStateSchema.parse(parsed);
    return validated;
  } catch (error) {
    console.warn("Failed to load save, using fallback:", error);
    return fallback;
  }
}

/**
 * Save game state to localStorage
 */
export function saveGameState(state: GameState): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    const serialized = JSON.stringify(state);
    localStorage.setItem(SAVE_KEY, serialized);
  } catch (error) {
    console.error("Failed to save game state:", error);
  }
}

/**
 * Clear saved game state
 */
export function clearGameState(): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    localStorage.removeItem(SAVE_KEY);
  } catch (error) {
    console.error("Failed to clear save:", error);
  }
}

/**
 * Create a debounced version of a function
 */
export function debounce<T extends (...args: any[]) => void>(
  fn: T,
  delayMs: number
): T {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  return ((...args: any[]) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      fn(...args);
    }, delayMs);
  }) as T;
}
