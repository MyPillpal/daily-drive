

# Redesign: Top Navigation + More Visual Dashboard

## What changes

### 1. Sidebar → Horizontal Top Nav
Replace the fixed left sidebar with a horizontal top navigation bar. The "P" logo sits on the left, nav links (Dashboard, Daily Log, Ideas, Settings) run horizontally, and the bar stays fixed at the top of the viewport. Remove `ml-16` from the main content area.

**Files:** `src/components/AppSidebar.tsx` → rename to `src/components/TopNav.tsx`, update `src/routes/__root.tsx`

### 2. Make the Dashboard More Visual and "Reactive"

Current dashboard is mostly cards with numbers. Here's the upgrade:

- **Hero section** — Large greeting area with the founder score as a radial progress ring (animated SVG), today's date, and a motivational line. Gradient background.
- **Animated stat counters** — Hours, tasks, streak numbers animate up on mount (count-up effect).
- **Today's entry as a hero card** — Wider, with a subtle gradient left border color-coded by score. Gist bullets fade in sequentially.
- **Recent entries as a timeline** — Instead of a flat grid, show entries as a vertical timeline with date markers, colored score dots, and preview text. Each entry slides in on scroll.
- **Activity heatmap** — Keep it but make it full-width below the timeline instead of a cramped sidebar.
- **30-day trend chart** — Add area glow effect and animated draw-in.

### 3. Visual Polish Across Pages
- Smooth page transitions (fade-in on route change)
- Larger typography for headings
- Subtle gradient backgrounds on key sections
- More whitespace and breathing room

## Design Ideas to Consider

Here are some directions — pick what resonates:

1. **Radial score ring** — An animated circular progress indicator for the founder score (think Apple Watch rings)
2. **Timeline log view** — Vertical timeline with dots and connectors instead of a list of cards
3. **Glassmorphism cards** — Semi-transparent cards with backdrop blur for a modern feel
4. **Micro-interactions** — Hover effects on cards (tilt, glow), animated transitions between pages
5. **Photo hero** — If today's entry has photos, show one as a large banner at the top of the dashboard

## Technical Details

- **TopNav component**: Horizontal `<nav>` with `fixed top-0`, `h-14`, flex row, logo left, links center/right. Active state with bottom border indicator.
- **Root layout**: Change from `flex` row to `flex-col`, replace `ml-16` with `mt-14`.
- **Count-up animation**: Small custom hook `useCountUp(target, duration)` using `requestAnimationFrame`.
- **Radial progress**: SVG `<circle>` with `stroke-dasharray` and `stroke-dashoffset` animated via CSS transition.
- **Timeline**: CSS `::before` pseudo-element vertical line with positioned dot markers.
- **No new dependencies needed** — all achievable with existing Tailwind + SVG + Recharts.

