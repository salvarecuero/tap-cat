import { DEFAULT_CAT } from "./orange-tabby";
import { TABBY_CAT } from "./tabby-cat";
import type { CatProfile } from "@/game/types";

export const ALL_CATS: CatProfile[] = [DEFAULT_CAT, TABBY_CAT];

export function getCatById(id: string): CatProfile | undefined {
  return ALL_CATS.find((cat) => cat.id === id);
}
