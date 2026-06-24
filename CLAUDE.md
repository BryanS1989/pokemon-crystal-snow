# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start dev server (Vite, hot reload)
npm run build     # Production build → dist/
npm run preview   # Preview the production build locally
```

No test framework is configured.

## Architecture

Single-page React app (Vite + React 18, CSS Modules) that serves as a reference guide for the fan-made Pokémon Crystal Snow ROM hack. The entire app is a moves database browser — there are no routes, no backend, and no state management library.

### Data layer

- `src/data/moves.json` — array of 242 move objects: `{ id, name, typeId, power, accuracy, pp, effect, description }`.
  - `power` can be a number, `null` (no power / status move), or `"★"` (OHKO / variable damage).
  - `effect` can be a number (percent chance) or `null` (no secondary effect).
  - `accuracy` is always a number (moves that never miss still carry 100).
- `src/data/move-types.json` — 18 type definitions: `{ id, name, color, textColor }`. Colors drive the inline badge styles throughout the UI.

`typeId` in moves.json maps directly to `id` in move-types.json. `MovesSection` builds a `typeMap` lookup at module init to avoid per-render work.

### Component tree

```
App
└── MovesSection        ← all filter/sort state lives here
    ├── MoveFilters     ← controlled; receives filters + onFiltersChange
    │   └── RangeSlider ← dual-handle range input (pure, no internal state)
    └── MoveCard        ← pure display; receives a single move + its type object
```

**MovesSection** is the only stateful component. It owns:
- `filters` (search, selectedTypes, powerRange, accuracyRange, ppRange, effectRange, includePowerless, includeStarPower, includeNoEffect)
- `sortBy` / `sortDir`
- `filtersOpen` (mobile slide-in panel toggle)

Filtering (`applyFilters`) and sorting run through `useMemo` chains so they only recompute when dependencies change.

**MoveFilters** is fully controlled — it never owns filter state. Resetting filters is done by passing `INITIAL_FILTERS` (defined in MovesSection) back up.

**RangeSlider** implements a custom dual-thumb range by overlaying two `<input type="range">` elements on a shared track div. The fill bar is positioned with inline `left`/`width` percentages derived from the current value.

### Styling

Each component has a co-located `.module.css` file. Global resets and CSS variables (colors, spacing) live in `src/index.css`. Type badge colors come from `move-types.json` and are applied as inline `style` props — they are not in CSS.

### Deployment

`vite.config.js` sets `base: '/pokemon-crystal-snow/'` for GitHub Pages deployment under a subpath. The production build outputs to `dist/`.
