# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # start dev server (Vite, hot reload)
npm run build    # production build
npm run lint     # ESLint
npm run preview  # preview production build locally
```

No test suite is configured.

## Architecture

This is a React + Vite single-page app that renders an interactive map of food establishments on UFRJ's Ilha do Fundão campus (Mapa do Ambiente Alimentar da Minerva — M.A.A.M.).

**Data flow:** `src/data/data.json` is the single source of truth. It is imported directly (no API). Both `Sidebar` and `MapComponent` import it independently. Each entry has: `id`, `nome`, `centro`, `latitude`, `longitude`, `tipo`, `classificacao` (1/2/3), and `indiceSaudabilidade` (0–100).

**State management:** All shared state lives in `App.jsx`:
- `selectedLocal` — the currently selected establishment, passed down to both `Sidebar` (to trigger map fly-to via prop) and `MapComponent` (to highlight marker and show detailed tooltip).
- `isSidebarOpen` — controls sidebar visibility. `MapComponent` does NOT receive this; `MapResizer` uses a `ResizeObserver` to call `map.invalidateSize()` automatically on any container resize.
- `isAboutModalOpen` — controls the about modal overlay.

**Map layer (`MapComponent.jsx`):**
- Uses `react-leaflet` with OpenStreetMap tiles; the map is bounded to Ilha do Fundão (`BOUNDS_FUNDAO`).
- Zoom: the map allows up to `maxZoom={19}`, but OSM only serves tiles through z18, so `TileLayer` sets `maxNativeZoom={18}` and upscales z19. Raising the map's `maxZoom` without raising `maxNativeZoom` in step yields blank tiles. `MapController` flies to z18 on selection.
- Markers use `L.divIcon` with Google Material Symbols (`location_on` icon). Color is driven by `classificacao` (1 = green, 2 = yellow, 3 = red).
- Marker clustering (`react-leaflet-cluster`) is imported but intentionally disabled — do not re-enable without user approval.
- Hover state shows a compact `Tooltip`; selected state shows a detailed `Tooltip` with classification description and health score. Popups are not used.
- `MapController` handles `map.flyTo` when `selectedLocal` changes. `MapResizer` uses `ResizeObserver` to call `map.invalidateSize()` on container resize.
- All 8 icon variants (3 classifications + a `fallback` × 2 highlight states) are pre-computed at module load into `ICON_CACHE` — never recreated per render. An entry whose `classificacao` is not 1/2/3 falls back to the blue pin instead of Leaflet's (broken) default icon.
- Duplicate IDs in the data are deduplicated via `useMemo` before rendering markers. IDs must be unique: a reused ID silently drops an establishment from both map and sidebar.
- After dedup, `fanOutCollisions()` guarantees every marker is separately clickable. It relaxes positions: any pair closer than `SEPARACAO_MINIMA_M` (9.5 m — the clearance two 32px icons need at z19, where a pixel is ~0.275 m) is pushed apart by half the deficit each, repeated until nothing overlaps (converges in ~5 of the 20 allowed passes, ~1.4 ms, inside `useMemo`). Identical coordinates get a deterministic index-derived angle, so output is stable run to run. Render-time only — `data.json` keeps the surveyed GPS values untouched; 24 of 62 markers shift, by at most ~9.5 m. Raising the icon size or lowering `maxZoom` means raising `SEPARACAO_MINIMA_M` to match.
- Marker geometry is split between JS and CSS and must stay in sync: `iconSize`/`iconAnchor` in `createCustomIcon` pair with the glyph `font-size`/`width`/`height` in `MapIcons.css`. `.custom-marker-symbol` uses `transform-origin: bottom center` so the highlight `scale()` pivots on the pin tip; do not add a `translateY` to it, or the pin stops pointing at its coordinate.
- Do not set `z-index` on `.custom-marker-symbol.selected` — it overrides Leaflet's inline stacking and can push the selected marker *under* other markers. Stacking is handled by the `zIndexOffset` prop.

**Sidebar (`Sidebar.jsx`):**
- All filtering and sorting is done client-side via `useMemo` over `locaisData`.
- Filter options (centros, tipos) are derived dynamically from the data, not hardcoded.
- On mobile (`window.innerWidth <= 768`), clicking a list item also closes the sidebar.
- The filters panel is collapsible (`showFilters` state).

**Legend (`Legend.jsx`):** Overlaid on the map (absolutely positioned via CSS), collapsible. Has separate toggle labels for desktop and mobile.

**Classification system:**
- Tipo 1 (green): predominantly healthy foods
- Tipo 2 (yellow): mixed
- Tipo 3 (red): predominantly ultra-processed foods

**Sidebar list items:** The colored dot (`status-dot`) is coloured by `classificacao` (`bg-green`/`bg-yellow`/`bg-red`), matching the map markers and the legend.

**Sidebar footer:** Institution logos (UFRJ, INJC, Gastronomia) are loaded from external URLs, not local assets.

**Adding new establishments:** Edit `src/data/data.json`. The map and sidebar update automatically — no code changes needed unless a new `centro` or `tipo` value is introduced (both are derived dynamically). Give every entry a unique `id` (a reused one is silently dropped) and a `classificacao` of 1, 2, or 3. `centro` may be `null` — such entries display as "Ilha do Fundão" and match the "Outros" filter. Duplicate coordinates are fine; they are fanned out at render time.
