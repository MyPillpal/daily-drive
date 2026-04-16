

# Expenses Page — Cost Tracking Dashboard

## Summary
Create a polished `/expenses` route that gives you full visibility into your PillPod project costs: subscriptions, renewals, Amazon purchases (linked to projects), and daily/monthly/yearly burn. All static placeholder data for now — no backend.

## Page Structure

### 1. Top Hero — Cost Overview
Three headline metrics in large stat cards (same glassmorphic style as dashboard):
- **Monthly Burn** — total monthly cost including amortized yearly items
- **Yearly Cost** — projected annual spend
- **All-Time Spent** — cumulative total

### 2. Two-Column Chart Row
- **Left**: Donut chart showing spend breakdown by category (Subscriptions, Hardware, Domains, API/Usage) with the total in the center
- **Right**: Stacked area chart showing monthly spend over time, split by category — so you can see trends

### 3. Subscriptions Card
Table with columns: Service, Billing Cycle (pill badges — blue/monthly, purple/yearly, amber/usage-based, gray/free), Tier, Monthly Cost. Each row shows the renewal status:
- Green dot = active, no action needed
- Amber dot + "Renews in X days" for items expiring soon (domains, yearly plans)
- Red dot + "Expired" for lapsed items

Seeded data: Cursor ($20/mo), Lovable ($20/mo), Claude API (~$12/mo usage), Twilio (~$3/mo usage), Supabase (free), Cloudflare (free), pillpod.com ($12/yr — renews Aug 2026), GitHub (free). Bottom row: monthly equivalent total.

### 4. Renewals & Upcoming Costs
A dedicated small card highlighting items that need attention — domains, yearly subscriptions approaching renewal. Timeline-style layout with dates and costs, sorted by next renewal date. Makes it impossible to miss an upcoming charge.

### 5. Amazon Purchases Card
Table with columns: Item, Category (pill badge), Project (linked — e.g. "PillPod", "Studio", "General"), Price, Date, View (external Amazon link). 5-6 placeholder items (hardware, content gear). Filterable by project via small pill toggle at the top of the card. 30-day total row at the bottom.

### 6. Variable API Costs Card
Table: Service, Metric (tokens, SMS, emails), Usage This Month, Cost. Seeded with Claude API, Twilio, Resend. Small sparkline next to each row showing last 4 months trend.

## Files

### New: `src/routes/expenses.tsx`
All sections above. Static data arrays at the top of the file. Uses existing `StatCard` pattern, `Table` components, Recharts for charts, `Badge` for pill badges.

### Modified: `src/components/TopNav.tsx`
Add `{ label: "Expenses", to: "/expenses", icon: DollarSign }` between Ideas and Settings.

## Design Details
- Same card style: `bg-card/70 backdrop-blur-sm rounded-2xl border border-border/60`
- Category colors: amber (Hardware), blue (Software/API), green (Business/Domains), teal (Content)
- Renewal badges: green/amber/red dots with text
- Project linking on Amazon purchases: small colored pill showing project name
- Typography: Plus Jakarta Sans headings, Inter body, JetBrains Mono for costs
- All costs right-aligned in monospace font for easy scanning

