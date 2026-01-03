"use client";

import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import type { GameState, CatProfile, Boost } from "./types";
import {
  getActiveStageSpriteKey,
  getPetsPerClick,
  getPetsPerSecond,
  getAutoClickBoosts,
  canBuyBoost,
  buyBoost as engineBuyBoost,
  applyClick,
} from "./engine";
import { loadGameState, saveGameState, clearGameState, debounce } from "./save";
import { useInterval } from "./useInterval";

const DEFAULT_STATE: GameState = {
  version: 1,
  pets: 0,
  totalPets: 0,
  ownedBoosts: {},
  selectedCatId: "orange-tabby",
};

interface UseGameProps {
  cat: CatProfile;
  boosts: Boost[];
}

export function useGame({ cat, boosts }: UseGameProps) {
  const [state, setState] = useState<GameState>(DEFAULT_STATE);
  const [mounted, setMounted] = useState(false);

  // Debounced save function
  const debouncedSave = useRef(
    debounce((s: GameState) => saveGameState(s), 500)
  ).current;

  // Load state on mount (client-side only)
  useEffect(() => {
    const loaded = loadGameState(DEFAULT_STATE);
    setState(loaded);
    setMounted(true);
  }, []);

  // Auto-save on state changes
  useEffect(() => {
    if (mounted) {
      debouncedSave(state);
    }
  }, [state, mounted, debouncedSave]);

  // Derived values
  const petsPerClick = useMemo(
    () => getPetsPerClick(boosts, state.ownedBoosts),
    [boosts, state.ownedBoosts]
  );

  const activeSpriteKey = useMemo(
    () => getActiveStageSpriteKey(cat, state.pets),
    [cat, state.pets]
  );

  const activeSpriteSrc = useMemo(() => {
    const sprites = cat.sprites as any;
    return sprites[activeSpriteKey] || cat.sprites.idle;
  }, [cat, activeSpriteKey]);

  const autoClickBoosts = useMemo(
    () => getAutoClickBoosts(boosts, state.ownedBoosts),
    [boosts, state.ownedBoosts]
  );

  const petsPerSecond = useMemo(
    () => getPetsPerSecond(boosts, state.ownedBoosts),
    [boosts, state.ownedBoosts]
  );

  // Actions
  const tapCat = useCallback(() => {
    setState((prev) => applyClick(prev, petsPerClick));
  }, [petsPerClick]);

  const buy = useCallback(
    (boostId: string) => {
      const boost = boosts.find((b) => b.id === boostId);
      if (!boost) return;

      setState((prev) => {
        if (!canBuyBoost(prev, boost)) {
          return prev;
        }
        return engineBuyBoost(prev, boost);
      });
    },
    [boosts]
  );

  const reset = useCallback(() => {
    if (
      typeof window !== "undefined" &&
      window.confirm("Reset all progress? This cannot be undone.")
    ) {
      clearGameState();
      setState(DEFAULT_STATE);
    }
  }, []);

  // Debug: add pets directly (for development only)
  const addPets = useCallback((amount: number) => {
    setState((prev) => applyClick(prev, amount));
  }, []);

  // Auto-click interval - update every 500ms
  // Calculate the proportional amount to add based on pets per second
  const UPDATE_INTERVAL_MS = 500;

  useInterval(() => {
    if (petsPerSecond > 0) {
      // Add proportional amount for 500ms interval
      const petsToAdd = (petsPerSecond * UPDATE_INTERVAL_MS) / 1000;
      setState((prev) => applyClick(prev, petsToAdd));
    }
  }, petsPerSecond > 0 ? UPDATE_INTERVAL_MS : null);

  return {
    state,
    petsPerClick,
    petsPerSecond,
    activeSpriteKey,
    activeSpriteSrc,
    tapCat,
    buy,
    reset,
    addPets,
    mounted,
  };
}
