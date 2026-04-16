import "dotenv/config";
import * as fs from "node:fs/promises";
import * as path from "node:path";
import { execSync } from "node:child_process";
import { chromium, type Browser, type Page } from "playwright";
import { createClient } from "@supabase/supabase-js";

interface ParsedMoney {
  amount: number;
  currency: string | null;
}

interface Invoice {
  date: string;
  amount: number;
  status: string;
}

interface BillingReport {
  generatedAt: string;
  billingUrl: string;
  pageUrl: string;
  plan: string | null;
  renewalDate: string | null;
  paymentMethod: string | null;
  extraUsageBalance: number | null;
  autoReload: string | null;
  invoices: Invoice[];
  invoiceTotal: number;
  verification: {
    planFound: boolean;
    extraUsageFound: boolean;
    invoicesFound: number;
    success: boolean;
  };
}

const BILLING_URL =
  process.env.BILLING_URL || "https://claude.ai/settings/billing";
const OUTPUT_DIR = path.join(process.cwd(), "tmp", "billing-scrape");
const REPORT_PATH = path.join(OUTPUT_DIR, "latest-report.json");
const RAW_TEXT_DUMP_PATH = path.join(OUTPUT_DIR, "latest-raw-text.txt");
const CDP_PORT = Number(process.env.CDP_PORT || "9333");
const MAX_LOAD_MORE_CLICKS = 20;
const PAGE_SETTLE_MS = 10000;
const LOAD_MORE_WAIT_MS = 1500;

const DATE_PATTERN =
  /^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{1,2},\s+\d{4}$/i;

// --- Helpers ---

function parseMoney(text: string): ParsedMoney[] {
  const regex = /([$€£])?\s?(\d{1,3}(?:,\d{3})*(?:\.\d{1,2})|\d+(?:\.\d{1,2}))/g;
  const matches: ParsedMoney[] = [];
  for (const match of text.matchAll(regex)) {
    const rawCurrency = match[1] || null;
    const rawAmount = match[2]?.replace(/,/g, "");
    const amount = Number(rawAmount);
    if (!Number.isFinite(amount) || amount === 0) continue;
    matches.push({ amount, currency: rawCurrency });
  }
  return matches;
}

function extractLines(content: string): string[] {
  return content
    .split(/\r?\n+/)
    .map((l) => l.replace(/\s+/g, " ").trim())
    .filter((l) => l.length > 0);
}

function parseInvoices(lines: string[]): Invoice[] {
  const invoices: Invoice[] = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!DATE_PATTERN.test(line)) continue;

    for (let j = i + 1; j < Math.min(i + 5, lines.length); j++) {
      const money = parseMoney(lines[j]);
      if (money.length > 0) {
        let status = "unknown";
        for (let k = j + 1; k < Math.min(j + 3, lines.length); k++) {
          const s = lines[k].trim().toLowerCase();
          if (["paid", "pending", "failed", "refunded"].includes(s)) {
            status = lines[k].trim();
            break;
          }
        }
        invoices.push({ date: line, amount: money[0].amount, status });
        break;
      }
    }
  }
  return invoices;
}

// --- Chrome lifecycle ---

function isChromeDebuggingOnPort(port: number): boolean {
  try {
    execSync(
      `powershell -Command "(Invoke-WebRequest -Uri http://127.0.0.1:${port}/json/version -UseBasicParsing -TimeoutSec 2).StatusCode"`,
      { stdio: "ignore", timeout: 8000 },
    );
    return true;
  } catch {
    return false;
  }
}

function launchChromeWithDebugging(port: number): void {
  const chrome = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
  const profileDir = path.join(
    process.env.TEMP || process.env.TMP || ".",
    "chrome-cdp-billing",
  );
  execSync(
    `start "" "${chrome}" --remote-debugging-port=${port} --user-data-dir="${profileDir}" "${BILLING_URL}"`,
    { shell: "cmd.exe", stdio: "ignore" },
  );
}

// --- Page interaction ---

function findBillingPage(browser: Browser, billingUrl: string): Page | undefined {
  const host = new URL(billingUrl).host.toLowerCase();
  const pages = browser.contexts().flatMap((ctx) => ctx.pages());

  return (
    pages.find((p) => {
      const u = p.url().toLowerCase();
      return u.includes(host) && u.includes("/billing");
    }) ||
    pages.find((p) => {
      try {
        return new URL(p.url()).host.toLowerCase() === host;
      } catch {
        return false;
      }
    })
  );
}

async function expandAllInvoices(page: Page): Promise<number> {
  let clicks = 0;
  let consecutiveMisses = 0;
  for (let i = 0; i < MAX_LOAD_MORE_CLICKS; i++) {
    const clicked = await page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll("button")).find(
        (b) =>
          (b.textContent || "").trim().toLowerCase().includes("load more") &&
          !b.disabled,
      );
      if (!btn) return false;
      btn.click();
      return true;
    });
    if (!clicked) {
      consecutiveMisses++;
      // Button may reappear after content loads; retry a couple times.
      if (consecutiveMisses >= 3) break;
      await page.waitForTimeout(LOAD_MORE_WAIT_MS);
      continue;
    }
    consecutiveMisses = 0;
    clicks++;
    await page.waitForTimeout(LOAD_MORE_WAIT_MS);
  }
  return clicks;
}

async function extractPageText(page: Page): Promise<string> {
  try {
    const text = await page.evaluate(() => document.body?.innerText || "");
    if (text) return text;
  } catch {}
  try {
    const text = await page.evaluate(() => document.body?.textContent || "");
    if (text) return text;
  } catch {}
  try {
    return await page.content();
  } catch {}
  return "";
}

// --- Main ---

async function main() {
  await fs.mkdir(OUTPUT_DIR, { recursive: true });

  // Ensure Chrome is running with remote debugging.
  const alreadyRunning = isChromeDebuggingOnPort(CDP_PORT);
  if (!alreadyRunning) {
    console.log("Launching Chrome with remote debugging...");
    launchChromeWithDebugging(CDP_PORT);
  }

  // Wait for Chrome's debug port to become available.
  console.log(`Waiting for Chrome on port ${CDP_PORT}...`);
  for (let attempt = 0; attempt < 15; attempt++) {
    if (isChromeDebuggingOnPort(CDP_PORT)) break;
    await new Promise((r) => setTimeout(r, 2000));
  }
  if (!isChromeDebuggingOnPort(CDP_PORT)) {
    throw new Error(`Chrome debug port ${CDP_PORT} never became available. Is Chrome installed?`);
  }

  console.log("Connecting...");
  const browser = await chromium.connectOverCDP(`http://127.0.0.1:${CDP_PORT}`);
  const context = browser.contexts()[0];
  if (!context) throw new Error("No browser context found.");

  let page = findBillingPage(browser, BILLING_URL);

  if (!page) {
    // Navigate an existing tab or create one.
    page = context.pages()[0] || (await context.newPage());
    await page.goto(BILLING_URL, { waitUntil: "domcontentloaded" });
  }

  // Wait for page to fully render.
  console.log("Waiting for billing page to settle...");
  await page.waitForTimeout(PAGE_SETTLE_MS);

  // Check for challenge/login — if detected, wait longer and retry.
  const bodyCheck = await page.evaluate(() => document.body?.innerText || "");
  if (/verify you are human|cloudflare|performing security/i.test(bodyCheck)) {
    console.log("Challenge detected — waiting 15s for manual solve...");
    await page.waitForTimeout(15000);
  }

  // Wait for invoices section to render, then expand all.
  try {
    await page.waitForFunction(
      () => (document.body?.innerText || "").includes("Invoices"),
      { timeout: 10000 },
    );
  } catch {
    console.warn("Invoice section not detected after waiting.");
  }
  await page.waitForTimeout(2000);

  const loadMoreClicks = await expandAllInvoices(page);
  if (loadMoreClicks > 0) {
    console.log(`Expanded invoices (${loadMoreClicks} clicks).`);
  }

  // Extract text.
  const pageText = await extractPageText(page);
  console.log(`Extracted ${pageText.length} characters.`);
  await fs.writeFile(RAW_TEXT_DUMP_PATH, pageText, "utf-8");

  const lines = extractLines(pageText);

  // --- Parse billing fields ---

  const planLine = lines.find((l) => /pro plan|free plan|team plan|max plan/i.test(l));
  const plan = planLine?.trim() || null;

  const renewalLine = lines.find((l) => /renew/i.test(l));
  const renewalDate = renewalLine?.trim() || null;

  const paymentLine = lines.find((l) => /visa|mastercard|amex|american express|•\s*•/i.test(l));
  const paymentMethod = paymentLine?.trim() || null;

  let extraUsageBalance: number | null = null;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].toLowerCase().includes("current balance")) {
      for (let j = i - 1; j >= Math.max(0, i - 3); j--) {
        const money = parseMoney(lines[j]);
        if (money.length > 0) {
          extraUsageBalance = money[0].amount;
          break;
        }
      }
      break;
    }
  }

  const autoReloadLine = lines.find((l) => /top off/i.test(l));
  const autoReload = autoReloadLine?.trim() || null;

  const invoices = parseInvoices(lines);
  const invoiceTotal =
    Math.round(invoices.reduce((sum, inv) => sum + inv.amount, 0) * 100) / 100;

  // --- Build report ---

  const report: BillingReport = {
    generatedAt: new Date().toISOString(),
    billingUrl: BILLING_URL,
    pageUrl: page.url(),
    plan,
    renewalDate,
    paymentMethod,
    extraUsageBalance,
    autoReload,
    invoices,
    invoiceTotal,
    verification: {
      planFound: plan !== null,
      extraUsageFound: extraUsageBalance !== null,
      invoicesFound: invoices.length,
      success: plan !== null && invoices.length > 0,
    },
  };

  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const timestampedPath = path.join(OUTPUT_DIR, `report-${timestamp}.json`);

  await fs.writeFile(REPORT_PATH, JSON.stringify(report, null, 2), "utf-8");
  await fs.writeFile(timestampedPath, JSON.stringify(report, null, 2), "utf-8");

  // --- Sync to Supabase ---

  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

  let newInvoices = 0;
  let skippedInvoices = 0;

  if (supabaseUrl && supabaseKey) {
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Upsert invoices — only new ones get inserted (unique constraint on date+amount+source).
    for (const inv of invoices) {
      const invoiceDate = new Date(inv.date).toISOString().split("T")[0];
      const { error } = await supabase.from("billing_invoices").upsert(
        {
          invoice_date: invoiceDate,
          amount: inv.amount,
          status: inv.status,
          source: "claude.ai",
        },
        { onConflict: "invoice_date,amount,source", ignoreDuplicates: true },
      );
      if (error) {
        skippedInvoices++;
      } else {
        newInvoices++;
      }
    }

    // Save a billing snapshot for this scrape.
    const { error: snapError } = await supabase.from("billing_snapshots").insert({
      plan,
      renewal_date: renewalDate,
      payment_method: paymentMethod,
      extra_usage_balance: extraUsageBalance,
      auto_reload: autoReload,
      invoice_count: invoices.length,
      invoice_total: invoiceTotal,
    });
    if (snapError) {
      console.warn(`  Snapshot insert failed: ${snapError.message}`);
    }

    console.log("\n  Supabase sync:");
    console.log(`    Invoices synced: ${newInvoices} (${skippedInvoices} already existed)`);
    console.log(`    Snapshot saved`);
  } else {
    console.warn("\n  Supabase env vars not set — skipping sync.");
  }

  // --- Print summary ---

  console.log("\n=== Claude Billing Report ===");
  console.log(`  Plan:                ${plan || "NOT FOUND"}`);
  console.log(`  Renewal:             ${renewalDate || "NOT FOUND"}`);
  console.log(`  Payment:             ${paymentMethod || "NOT FOUND"}`);
  console.log(`  Extra usage balance: ${extraUsageBalance !== null ? `$${extraUsageBalance}` : "NOT FOUND"}`);
  console.log(`  Auto-reload:         ${autoReload || "NOT FOUND"}`);
  console.log(`  Invoices:            ${invoices.length}`);
  console.log(`  Invoice total:       $${invoiceTotal}`);
  console.log(`  Status:              ${report.verification.success ? "PASS" : "PARTIAL"}`);
  console.log(`\n  Report: ${timestampedPath}`);
}

main().catch((error) => {
  console.error("Billing scrape failed:", error);
  process.exit(1);
});
