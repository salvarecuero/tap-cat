import catData from "./cat.json";
import { CatProfileSchema } from "@/game/schema";
import type { CatProfile } from "@/game/types";

// Validate and export the cat profile
export const DEFAULT_CAT: CatProfile = CatProfileSchema.parse(catData);
