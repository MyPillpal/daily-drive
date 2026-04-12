

# PillPod Daily Log Prototype

A multi-page daily log app for a startup founder — desktop-first, light mode only, all data mocked.

## Design System
- Warm white background (#FAFAF9), cool gray text hierarchy, subtle warm gray borders
- Amber/soft orange accent for Founder Score, streaks, heatmap, active states
- Semantic colors: muted green (completed), soft red (blockers), blue (info)
- Cards with soft shadows, 10-12px rounded corners, subtle hover lift
- Geometric sans for headlines (Plus Jakarta Sans), readable sans for body (Inter), monospace for task IDs
- Max content width ~1100px, generous whitespace

## Pages

### 1. Dashboard (`/`)
- Hero stats bar: Founder Score (72, amber, large), Streak (14 days + flame), Hours (6.5), Tasks this week (23)
- GitHub-style activity heatmap (52×7 grid, amber intensity shades, tooltips on hover)
- 6 recent entry cards in 2-col grid with date, score badge, hours, impact, preview text, tag pills, hover lift
- 30-day Founder Score sparkline/area chart at bottom

### 2. Daily Log Entry (`/log/april-7`)
- Two-column layout (65/35)
- Left: Collapsible "The gist" card with bullets + reflection, then devlog body with section filter pills (All/Hardware/Software/Business/Personal), section headers, inline task pills (PILL-247), time stats, next-steps callouts
- Right (sticky): Founder Score breakdown bars, hours, impact, tasks list, self-assessment card, hero image + thumbnails with lightbox, tags, day navigation arrows

### 3. Nightly Review (`/review`)
- Step-through flow with progress dots
- Step 1: Devlog preview with "Looks good" / "Edit" buttons
- Step 2: Reflection questions one at a time (sliders for difficulty/impact, text inputs for accomplishments/blockers/tomorrow)
- Step 3: Photo grid with hero selection
- Step 4: Summary preview with "Publish" / "I'll check later"

### 4. Ideas (`/ideas`)
- Tabs: All ideas / Public only
- Add idea input at top
- 15-20 idea cards grouped by date with text, date, public/private badge, tags

### 5. Settings (`/settings`)
- Empty placeholder page

## Sidebar Navigation
- Persistent slim left sidebar with icons + labels: Dashboard, Daily Log, Ideas, Settings
- Active page highlighted with amber accent

## Data
- Hardcoded mock data: 7-10 days of entries with realistic hardware startup content (ESP32, 3D printing, CAD, firmware), scores 25-88, hours 2-10, tags, task IDs like PILL-247

