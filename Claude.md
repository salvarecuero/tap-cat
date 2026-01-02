# Tap Cat - Project Guide

## Project Overview

**Tap Cat** is a minimal, high-performance clicker/idle game built as a static web application. Players "pet" a cat by clicking/tapping its sprite. As pets accumulate, the cat visually evolves through enjoyment stages. Players can purchase simple one-time boosts from a shop to enhance gameplay.

**Design Philosophy:**
- Minimal, performant, data-driven
- No complex clicker mechanics (no prestige, tech trees, etc.)
- Static site, no backend required
- Content-driven: new cats/boosts added via JSON + assets

## Tech Stack

- **Framework:** Next.js 15 (App Router) + React 19
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS (utility-first, no custom CSS unless necessary)
- **Validation:** Zod schemas for runtime type safety
- **Rendering:** DOM + CSS only (no Canvas/WebGL)
- **Persistence:** localStorage (debounced writes)
- **Deployment:** Static export compatible

## Architecture Patterns

### 1. Functional Core, Imperative Shell

**Core principle:** Pure game logic separated from React state management.

**`src/game/engine.ts`** - Pure functions only:
- All functions are stateless and deterministic
- Take `GameState` as input, return new `GameState`
- No side effects (no I/O, no mutations)
- Examples: `applyClick()`, `buyBoost()`, `getPetsPerClick()`

**`src/game/useGame.ts`** - React integration layer:
- Manages state with `useState`
- Orchestrates side effects (`useEffect` for persistence)
- Calls pure engine functions for state transitions
- Exposes actions (`tapCat`, `buy`, `reset`) to UI

**Benefits:**
- Easy testing (pure functions)
- Predictable state changes
- Clear separation of concerns

### 2. Data-Driven Content

All game content is defined in JSON and validated with Zod schemas.

**Cats:** `src/content/cats/[cat-id]/cat.json`
- Theme colors (gradients, accents)
- Sprite mappings and stage thresholds
- Animation parameters

**Boosts:** `src/content/boosts/boosts.json`
- Two types: `clickMultiplier` | `autoClick`
- Discriminated union validated at runtime
- Icon paths, prices, descriptions

**Validation:** All JSON loaded through Zod schemas (`src/game/schema.ts`)
- Fail fast on invalid data
- Type-safe after validation (no `any` types)

### 3. State Management

**Single source of truth:** `GameState` type in `src/game/types.ts`

```typescript
interface GameState {
  version: number;         // Schema version for migrations
  pets: number;            // Current currency
  totalPets: number;       // Total accumulated (drives stages)
  ownedBoosts: Record<string, true>;  // Set of owned boost IDs
  selectedCatId: string;   // For future multi-cat support
}
```

**Persistence strategy:**
- Auto-save to localStorage on state changes (debounced 500ms)
- Load on mount with validation
- Reset option with confirmation dialog

**Derived state:**
- Never stored: `petsPerClick`, `activeSpriteKey`, etc.
- Always computed from `GameState` + content data
- Memoized with `useMemo` to avoid recalculation

## File Organization

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Entry point (renders GameView)
│   └── globals.css        # Global styles + Tailwind directives
│
├── components/            # React components (one responsibility each)
│   ├── GameView.tsx       # Main game container
│   ├── CatSprite.tsx      # Interactive cat with tap animations
│   ├── Counter.tsx        # Pet counter display
│   ├── ShopBar.tsx        # Horizontal scrollable shop
│   ├── BoostCard.tsx      # Individual boost item
│   └── ResetButton.tsx    # Reset confirmation button
│
├── content/               # JSON data + loaders
│   ├── cats/
│   │   └── orange-tabby/
│   │       ├── cat.json   # Cat profile data
│   │       └── index.ts   # Validated export
│   └── boosts/
│       ├── boosts.json    # All boosts
│       └── index.ts       # Validated export
│
└── game/                  # Game logic (framework-agnostic)
    ├── types.ts           # TypeScript interfaces
    ├── schema.ts          # Zod schemas
    ├── engine.ts          # Pure game logic functions
    ├── save.ts            # localStorage utilities
    ├── useInterval.ts     # Auto-click hook
    └── useGame.ts         # Main game state hook

public/
├── sprites/               # Cat sprites (768×768 PNG, transparent)
│   └── orange-tabby/
│       ├── idle.png
│       ├── happy1.png
│       ├── happy2.png
│       ├── ecstatic.png
│       └── tap.png
└── icons/                 # Boost icons (64×64 or 128×128 PNG)
    ├── gloves.png
    └── scratcher.png
```

## Coding Style & Conventions

### TypeScript

- **Strict mode enabled** - No implicit `any`, strict null checks
- **Explicit types preferred** - Use interfaces/types, not inference-only
- **Type guards for discriminated unions:**
  ```typescript
  if (boost.type === "clickMultiplier") {
    // TypeScript knows boost.value is available here
  }
  ```

### React Patterns

- **"use client" directives** - Required for hooks (App Router)
- **Hydration safety** - Wait for `mounted` state before rendering saved data
- **Callback stability** - Use `useCallback` for functions passed as props
- **Memoization** - `useMemo` for expensive computations, not for every value
- **No prop drilling** - Keep component tree shallow, pass needed props directly

### Component Structure

```typescript
"use client";

import { useState, useEffect } from "react";
import type { SomeType } from "@/game/types";

interface ComponentProps {
  // Props with explicit types
}

export function Component({ prop }: ComponentProps) {
  // 1. Hooks (useState, useEffect, custom hooks)
  // 2. Derived values (useMemo, useCallback)
  // 3. Event handlers
  // 4. Render (single return, minimal logic)
}
```

### Styling with Tailwind

- **Utility-first** - Use Tailwind classes, avoid custom CSS
- **Responsive design:**
  - Mobile-first approach
  - Use `sm:`, `md:`, `lg:` breakpoints sparingly
- **Dynamic values** - Use CSS custom properties for theme colors:
  ```typescript
  style={{
    "--bg-top": cat.theme.bgTop,
    background: "linear-gradient(to bottom, var(--bg-top), var(--bg-bottom))"
  } as React.CSSProperties}
  ```
- **Animations** - CSS transitions only (no JS animation loops)
  - GPU-accelerated: `transform`, `opacity`
  - Avoid layout-triggering properties: `width`, `height`, `margin`

## Performance Guidelines

1. **No animation loops** - Use CSS transitions and `requestAnimationFrame` sparingly
2. **Optimize images** - Compress PNGs externally, use plain `<img>` (not `next/image`)
3. **Debounce writes** - localStorage writes batched (500ms delay)
4. **Minimal re-renders** - Memoize callbacks and derived state
5. **Static export** - No server-side runtime required

## Adding New Content

### New Boost

1. **Add to `src/content/boosts/boosts.json`:**
   ```json
   {
     "id": "unique_id",
     "title": "Boost Name",
     "description": "What it does mechanically.",
     "imageDescription": "Icon visual description for AI generation.",
     "type": "clickMultiplier",
     "value": 3,
     "price": 200,
     "icon": "/icons/unique_icon.png"
   }
   ```

2. **Create icon:** 64×64 or 128×128 PNG, transparent background, warm colors
   - Place in `public/icons/`
   - Use `imageDescription` for AI generation prompts

3. **Test:** Run `npm run dev`, verify display and functionality

### New Cat

1. **Create structure:**
   ```
   src/content/cats/[cat-id]/
   ├── cat.json
   └── index.ts

   public/sprites/[cat-id]/
   ├── idle.png
   ├── happy1.png
   ├── happy2.png
   ├── ecstatic.png
   └── tap.png (optional overlay)
   ```

2. **Define cat.json** - Follow `CatProfileSchema` in `src/game/schema.ts`

3. **Update GameView.tsx** - Import and select cat profile

### Sprite Stages

Stages are defined in `cat.json`:
```json
"stages": [
  { "minPets": 0, "key": "idle" },
  { "minPets": 50, "key": "happy1" },
  { "minPets": 200, "key": "happy2" },
  { "minPets": 1000, "key": "ecstatic" }
]
```

- `minPets`: Total pets threshold to unlock stage
- `key`: Must match a key in the `sprites` object
- Engine auto-sorts stages and picks highest unlocked stage

## Game Mechanics

### Click Mechanics
- Base click: 1 pet
- Click multipliers stack multiplicatively: `1 × 2 × 3 = 6 pets/click`
- Each click increments both `pets` (currency) and `totalPets` (progression)

### Auto-Click
- Auto-click boosts add pets on interval (e.g., +1 every 2000ms)
- Multiple auto-click boosts are additive (sum of values)
- Auto-clicks also increment `totalPets`

### Purchasing
- Boosts are **one-time purchases** (no levels/upgrades in v1)
- Purchase disabled if: already owned OR insufficient pets
- Price deducted from `pets`, not `totalPets`

## Key Utilities

### `src/game/save.ts`

- `loadGameState(defaults)` - Load from localStorage, validate with Zod, fallback to defaults
- `saveGameState(state)` - Write to localStorage (called via debounced function)
- `clearGameState()` - Delete save data
- `debounce(fn, delay)` - Utility to batch rapid calls

### `src/game/useInterval.ts`

- Custom hook for auto-click intervals
- Clears interval on unmount
- Only runs when interval is not null

## Common Pitfalls

1. **Hydration mismatch** - Always check `mounted` state before rendering localStorage data
2. **Mutating state** - NEVER mutate `GameState` directly, always return new object
3. **Missing Zod validation** - All external data (JSON) must be validated
4. **CSS animations on layout** - Only animate `transform` and `opacity`
5. **Forgetting debounce** - Don't save to localStorage on every state change

## Development Commands

```bash
npm run dev      # Start dev server (localhost:3000)
npm run build    # Production build
npm run start    # Serve production build
npm run lint     # Run ESLint
```

## Design Reference

- `/design-concept-reference.png` - Visual design mockup
- Color palette: Warm oranges, yellows, browns
- Aesthetic: Friendly, approachable, minimal

## Future Extensions (Not in v1)

- Multi-cat selection UI
- Leveling/upgrading boosts
- Prestige system
- PWA/offline support (service worker)
- Sound effects
- Analytics/telemetry
- Accessibility enhancements (ARIA, keyboard navigation)

---

**When working on this project:**
- Maintain the functional/pure separation in `engine.ts`
- Always validate external data with Zod
- Keep components focused and single-purpose
- Prefer Tailwind utilities over custom CSS
- Test hydration behavior (refresh page, check localStorage)
- Optimize for performance (no unnecessary re-renders)
