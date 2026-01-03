import { z } from "zod";

// Cat profile schemas
const CatThemeSchema = z.object({
  bgTop: z.string(),
  bgBottom: z.string(),
  accent: z.string(),
  patternClass: z.string(),
});

const CatStageSchema = z.object({
  minPets: z.number().int().nonnegative(),
  key: z.string(),
});

const CatSpritesSchema = z.object({
  idle: z.string(),
  happy1: z.string(),
  happy2: z.string(),
  ecstatic: z.string(),
  tapOverlay: z.string().optional(),
  stages: z.array(CatStageSchema).min(1),
});

const CatAnimSchema = z.object({
  tapScale: z.number(),
  tapWiggleDeg: z.number(),
});

export const CatProfileSchema = z.object({
  id: z.string(),
  name: z.string(),
  theme: CatThemeSchema,
  sprites: CatSpritesSchema,
  anim: CatAnimSchema,
});

// Boost schemas
const BaseBoostSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  imageDescription: z.string(),
  price: z.number().int().nonnegative(),
  icon: z.string(),
});

const ClickMultiplierBoostSchema = BaseBoostSchema.extend({
  type: z.literal("clickMultiplier"),
  value: z.number().positive(),
});

const AutoClickBoostSchema = BaseBoostSchema.extend({
  type: z.literal("autoClick"),
  value: z.number().positive(),
  intervalMs: z.number().int().positive(),
});

export const BoostSchema = z.discriminatedUnion("type", [
  ClickMultiplierBoostSchema,
  AutoClickBoostSchema,
]);

export const BoostsSchema = z.array(BoostSchema);

// Game state schema
export const GameStateSchema = z.object({
  version: z.literal(1),
  pets: z.number().int().nonnegative(),
  totalPets: z.number().int().nonnegative(),
  ownedBoosts: z.record(z.string(), z.literal(true)),
  selectedCatId: z.string(),
});
