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
- Markers use `L.divIcon` with Google Material Symbols (`location_on` icon). Color is driven by `classificacao` (1 = green, 2 = yellow, 3 = red).
- Marker clustering (`react-leaflet-cluster`) is imported but intentionally disabled — do not re-enable without user approval.
- Hover state shows a compact `Tooltip`; selected state shows a detailed `Tooltip` with classification description and health score. Popups are not used.
- `MapController` handles `map.flyTo` when `selectedLocal` changes. `MapResizer` uses `ResizeObserver` to call `map.invalidateSize()` on container resize.
- All 6 icon variants (3 classifications × 2 highlight states) are pre-computed at module load into `ICON_CACHE` — never recreated per render.
- Duplicate IDs in the data are deduplicated via `useMemo` before rendering markers.

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

**Sidebar list items:** The colored dot (`status-dot`) is hardcoded `bg-blue` for all items — it does not reflect `classificacao`. Color-by-classification only applies to map markers.

**Sidebar footer:** Institution logos (UFRJ, INJC, Gastronomia) are loaded from external URLs, not local assets.

**Adding new establishments:** Edit `src/data/data.json`. The map and sidebar update automatically — no code changes needed unless a new `centro` or `tipo` value is introduced (both are derived dynamically).
