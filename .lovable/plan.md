

# Create AI Prompt Schema Reference (.md)

## Summary
Write a comprehensive markdown file at `/mnt/documents/pillpod-ai-schema.md` that documents every table and JSONB field your external AI pipeline needs to produce. This is a reference doc for your AI prompt — no code changes needed.

## What the file will cover

### 1. `posts` table — the main output
All columns with types, descriptions, and which are AI-generated vs computed vs user-filled. Includes full JSONB schemas for:
- `parent_summary` (bullets + reflection)
- `devlog_sections` (category-grouped work sections)
- `tasks` (task reference array)
- `score_breakdown` (founder score weights)
- `self_assessment` (leave null — user fills via Review page)
- `tags` (string array)

### 2. `daily_stats` table
Columns: `date`, `score`/`founder_score`, `tasks_completed`, `hours_logged`, `areas_touched`. One row per day, can be derived from the same raw data.

### 3. `ideas` table
Columns: `text`, `date`, `is_public`, `tags`. If your pipeline extracts ideas from daily notes, document the insert format.

### 4. `tasks` table
Columns: `external_id`, `name`, `date`, `status`, `post_id`. Standalone table — tasks can be inserted separately or alongside posts.

### 5. Writing guidelines for the AI prompt
- Bullet style guidance (outcome-led, include numbers/specifics)
- Reflection tone (founder voice, what mattered, what's blocked)
- Category naming conventions
- When to include/omit `next_steps`
- How to compute `founder_score` and its breakdown

### 6. Complete example
A full JSON example for one day showing every field populated correctly.

### 7. Insertion instructions
REST API endpoint and JS client snippet for upserting rows.

## Technical details
- Output file: `/mnt/documents/pillpod-ai-schema.md`
- No code changes to the app
- Schema derived directly from the hooks (`use-posts.ts`, `use-daily-stats.ts`, `use-ideas.ts`, `use-tasks.ts`) and the route components

