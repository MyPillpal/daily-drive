# Scripts

Automation scripts for the daily-drive project.

## billing-scrape-test.ts

Scrapes billing data from [claude.ai/settings/billing](https://claude.ai/settings/billing) and syncs it to Supabase.

### What it captures

- **Plan** — Pro, Free, Team, or Max
- **Renewal date** — next auto-renewal date
- **Payment method** — card on file
- **Extra usage balance** — current prepaid balance
- **Auto-reload** — reload threshold and target
- **Invoices** — all invoice rows (date, amount, status)
- **Invoice total** — sum of all captured invoices

### How it works

1. Launches Chrome with remote debugging (or reuses an existing session)
2. Connects via CDP (Chrome DevTools Protocol)
3. Navigates to the billing page
4. Waits for content to load, clicks "Load more" to expand all invoices
5. Extracts page text and parses billing fields
6. Saves a timestamped JSON report to `tmp/billing-scrape/`
7. Upserts invoices to Supabase (`billing_invoices` table) — duplicates are skipped
8. Saves a snapshot to Supabase (`billing_snapshots` table)

### Prerequisites

- Google Chrome installed
- Playwright + Chromium: `npx playwright install chromium`
- Supabase tables created (see below)
- Environment variables in `.env`:
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`

### Supabase tables

Run this SQL in your Supabase dashboard:

```sql
CREATE TABLE IF NOT EXISTS billing_invoices (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  invoice_date date NOT NULL,
  amount numeric(10, 2) NOT NULL,
  status text NOT NULL DEFAULT 'unknown',
  source text NOT NULL DEFAULT 'claude.ai',
  scraped_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (invoice_date, amount, source)
);

CREATE TABLE IF NOT EXISTS billing_snapshots (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  scraped_at timestamptz NOT NULL DEFAULT now(),
  plan text,
  renewal_date text,
  payment_method text,
  extra_usage_balance numeric(10, 2),
  auto_reload text,
  invoice_count int,
  invoice_total numeric(10, 2)
);

ALTER TABLE billing_invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE billing_snapshots ENABLE ROW LEVEL SECURITY;
```

### Usage

```bash
# Run manually
npm run billing:scrape

# Environment variable overrides
CDP_PORT=9444 npm run billing:scrape        # custom Chrome debug port
BILLING_URL=https://... npm run billing:scrape  # custom billing URL
```

### Output files

All output goes to `tmp/billing-scrape/` (gitignored):

| File | Description |
|------|-------------|
| `latest-report.json` | Most recent scrape result (overwritten each run) |
| `report-<timestamp>.json` | Timestamped archive (never overwritten) |
| `latest-raw-text.txt` | Raw page text for debugging |

### Nightly scheduling

A Windows Task Scheduler setup script is included:

```powershell
# Run as Administrator
powershell -ExecutionPolicy Bypass -File C:\Dev\daily-drive\scripts\setup-billing-schedule.ps1
```

This creates a scheduled task `DailyBillingScrape` that runs at 11:50 PM daily.

```powershell
# Verify
Get-ScheduledTask -TaskName 'DailyBillingScrape'

# Run manually
Start-ScheduledTask -TaskName 'DailyBillingScrape'

# Remove
Unregister-ScheduledTask -TaskName 'DailyBillingScrape'
```

### Troubleshooting

- **Cloudflare challenge:** If Claude shows a CAPTCHA, open Chrome manually, solve it, then re-run the script. The script reuses the same Chrome profile so the session persists.
- **No invoices captured:** The page may not have fully loaded. Try increasing `PAGE_SETTLE_MS` in the script.
- **Chrome won't launch:** Ensure no other process is using the CDP port. Check with `netstat -ano | findstr 9333`.

---

## daily-summary.ts

Reads Claude AI conversation transcripts from local session files and generates a structured daily log entry via the Anthropic API, then saves it to Supabase.

### Usage

```bash
npm run summarize                # today
npm run summarize:yesterday      # yesterday
npm run summarize -- 2026-04-10  # specific date
```

---

## setup-billing-schedule.ps1

Creates a Windows Task Scheduler job for nightly billing scraping. See the billing scraper section above for details.
