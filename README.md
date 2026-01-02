# Tap Cat

A minimal, high-performance clicker game built with Next.js. Pet a cat, watch it evolve, and unlock boosts to enhance your gameplay.

## Overview

Tap Cat is a static web application that combines the simplicity of idle games with thoughtful architecture. Players tap a cat sprite to accumulate pets, which serve as both currency and progression metric. As total pets increase, the cat visually evolves through enjoyment stages. Simple one-time boosts can be purchased to multiply clicks or provide auto-clicking functionality.

**Design Philosophy:**

- Minimal and performant
- Data-driven content system
- No backend required
- Clean separation of game logic and UI

## Features

- **Interactive Cat Sprite** — Tap to pet, watch animations respond
- **Progressive Evolution** — Cat appearance changes based on total pets accumulated
- **Shop System** — Purchase click multipliers and auto-clickers
- **Persistent Progress** — Automatic saving to local storage
- **Responsive Design** — Works on desktop and mobile devices
- **Static Export** — Deploy anywhere, no server needed

## Tech Stack

- **Next.js 15** with App Router
- **React 19** for UI components
- **TypeScript** in strict mode
- **Tailwind CSS** for styling
- **Zod** for runtime validation

## Quick Start

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Development

### Available Commands

```bash
npm run dev      # Start development server
npm run build    # Create production build
npm run start    # Serve production build
npm run lint     # Run ESLint
```

### Project Structure

```
src/
├── app/              # Next.js App Router pages
├── components/       # React UI components
├── content/          # JSON content definitions (cats, boosts)
├── game/             # Core game logic and state management
public/
├── sprites/          # Cat sprite images (768×768 PNG)
├── icons/            # Boost icons (64×64 PNG)
```

### Architecture

The project follows a **functional core, imperative shell** pattern:

- **`src/game/engine.ts`** — Pure functions for game logic (no side effects)
- **`src/game/useGame.ts`** — React integration layer (state management)
- **`src/content/`** — JSON-defined content validated with Zod schemas

All game state is type-safe and serializable. State changes are pure transformations, making the logic predictable and testable.

## Adding Content

### New Boost

1. Add boost definition to `src/content/boosts/boosts.json`
2. Create icon image in `public/icons/`
3. Restart dev server to see changes

### New Cat

1. Create directory structure:
   ```
   src/content/cats/[cat-id]/
   public/sprites/[cat-id]/
   ```
2. Define cat profile in `cat.json` following the schema
3. Add sprite images (idle, happy1, happy2, ecstatic, tap)
4. Import cat in `GameView.tsx`

See `Claude.md` for detailed content authoring guidelines.

## Game Mechanics

- **Clicking** — Each click grants pets (base: 1 pet per click)
- **Click Multipliers** — Stack multiplicatively (2× and 3× = 6× total)
- **Auto-Click** — Generates pets automatically at intervals
- **Stages** — Cat evolves at predefined total pet thresholds
- **Persistence** — Progress auto-saves with 500ms debounce

## Performance

The game is optimized for smooth performance:

- CSS-only animations (GPU-accelerated transforms)
- Debounced localStorage writes
- Minimal re-renders through memoization
- Static export with no runtime dependencies

## License

This project is open source and available under the MIT License.

For architecture details and coding conventions, see `Claude.md`.
