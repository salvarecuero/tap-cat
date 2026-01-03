import catData from "./cat.json";
import { CatProfileSchema } from "@/game/schema";
import type { CatProfile } from "@/game/types";

export const TABBY_CAT: CatProfile = CatProfileSchema.parse(catData);
