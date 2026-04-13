

# Connect Supabase and Wire Real Data

## Current State
- The app uses mock data from `src/data/mock-data.ts` in all hooks
- `src/lib/supabase.ts` exists with a conditional client using `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` env vars
- `use-tasks.ts` already queries Supabase; the other hooks (`use-posts`, `use-ideas`, `use-daily-stats`) use mock data
- Your Supabase project has tables: posts, tasks, ideas, daily_stats, daily_accomplishments, personal_notes, photos

## How to Connect Supabase

Supabase isn't a standard connector — it's integrated through **Lovable Cloud**. You need to:

1. Open the **Cloud** tab (database icon in the top nav bar, or Cmd+K → "Cloud")
2. Click **Connect existing Supabase project**
3. Enter your project URL (`https://frnwevdgvycgvlagnovf.supabase.co`) and provide the required credentials

This will automatically inject the `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` env vars and generate client files under `src/integrations/supabase/`.

**Once you've connected your Supabase project through the Cloud tab, tell me and I'll proceed with step 2 below.**

## What I'll Build After Connection

### Step 1: Update Supabase client
- Switch `src/lib/supabase.ts` to use the auto-generated client from `src/integrations/supabase/` if available, or keep the current env-var approach

### Step 2: Rewrite hooks to query real tables
Each hook will fetch from Supabase with a fallback to mock data if the client isn't configured:

- **`use-posts.ts`** — Query `posts` table, joining related data (tasks, sections, score breakdowns). Map column names (snake_case → camelCase) to match the existing `Post` interface
- **`use-daily-stats.ts`** — Query `daily_stats` table, map to `DailyStat` interface
- **`use-ideas.ts`** — Query `ideas` table, map to `Idea` interface. Wire `addIdea` to do a real Supabase insert
- **`use-tasks.ts`** — Already wired to Supabase; just ensure it handles the `supabaseConfigured` guard

### Step 3: Handle data shape mapping
- Map snake_case DB columns to camelCase TypeScript interfaces
- Handle JSON columns (sections, gist_bullets, self_assessment, score_breakdown, tags) — parse if stored as JSONB
- Gracefully fall back to mock data if Supabase is unconfigured or queries fail

### Step 4: RLS consideration
- Since this is a single-user prototype with no auth, tables likely need a permissive SELECT policy or public access. I'll add a note if queries return empty due to RLS.

## Technical Details
- No new dependencies needed (`@supabase/supabase-js` is already installed)
- All existing component interfaces stay the same — only the data source changes
- Loading and error states already exist in the UI

