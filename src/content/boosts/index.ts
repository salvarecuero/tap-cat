import boostsData from "./boosts.json";
import { BoostsSchema } from "@/game/schema";
import type { Boost } from "@/game/types";

// Validate and export boosts
export const BOOSTS: Boost[] = BoostsSchema.parse(boostsData);
