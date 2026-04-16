import { createFileRoute } from "@tanstack/react-router";
import { DollarSign, TrendingUp, ShoppingCart, ExternalLink, AlertCircle, Clock, CheckCircle, Code, Bot, MessageSquare, Globe, Database, Shield, GitBranch, Heart, Zap, Mail } from "lucide-react";
import { useCountUp } from "@/hooks/use-count-up";
import {
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell,
} from "@/components/ui/table";
import {
  PieChart, Pie, Cell, ResponsiveContainer, AreaChart, Area,
  Tooltip as RechartsTooltip, XAxis, YAxis, CartesianGrid,
} from "recharts";
import { useState } from "react";

export const Route = createFileRoute("/expenses")({
  component: ExpensesPage,
});

/* ── static data ───────────────────────────────────────────── */

type Cycle = "monthly" | "yearly" | "usage" | "free";
type Status = "active" | "renewing" | "expired";

interface Subscription {
  service: string;
  icon: typeof Code;
  cycle: Cycle;
  tier: string;
  cost: number;
  status: Status;
  renewDate: string;
  description: string;
  category: "development" | "infrastructure" | "communication" | "domain";
}

const fixedSubscriptions: Subscription[] = [
  { service: "Cursor", icon: Code, cycle: "monthly", tier: "Pro", cost: 20, status: "active", renewDate: "", description: "AI-powered code editor — used for all daily development and code generation.", category: "development" },
  { service: "Lovable", icon: Heart, cycle: "monthly", tier: "Pro", cost: 20, status: "active", renewDate: "", description: "AI app builder — used to build and iterate on the PillPod web app.", category: "development" },
  { service: "pillpod.com", icon: Globe, cycle: "yearly", tier: "Domain", cost: 12, status: "renewing", renewDate: "Aug 14, 2026", description: "Primary domain name for the project. Annual renewal required.", category: "domain" },
];

const variableSubscriptions: Subscription[] = [
  { service: "Claude API", icon: Bot, cycle: "usage", tier: "Pay-as-you-go", cost: 12, status: "active", renewDate: "", description: "AI reasoning for the app's chat feature and content analysis pipeline.", category: "development" },
  { service: "Twilio", icon: MessageSquare, cycle: "usage", tier: "Pay-as-you-go", cost: 3, status: "active", renewDate: "", description: "SMS notifications for pill reminders and alerts to users.", category: "communication" },
];

const freeSubscriptions: Subscription[] = [
  { service: "Supabase", icon: Database, cycle: "free", tier: "Free", cost: 0, status: "active", renewDate: "", description: "Backend database, auth, and real-time subscriptions. Powers all data storage.", category: "infrastructure" },
  { service: "Cloudflare", icon: Shield, cycle: "free", tier: "Free", cost: 0, status: "active", renewDate: "", description: "CDN, DNS, and DDoS protection. Handles domain routing and edge caching.", category: "infrastructure" },
  { service: "GitHub", icon: GitBranch, cycle: "free", tier: "Free", cost: 0, status: "active", renewDate: "", description: "Source code repository and version control. CI/CD pipeline.", category: "development" },
  { service: "Resend", icon: Mail, cycle: "free", tier: "Free", cost: 0, status: "active", renewDate: "", description: "Transactional email delivery for auth confirmations and notifications.", category: "communication" },
];

const allPaid = [...fixedSubscriptions, ...variableSubscriptions];
const fixedMonthly = fixedSubscriptions.reduce((s, sub) => s + (sub.cycle === "yearly" ? sub.cost / 12 : sub.cost), 0);
const variableMonthly = variableSubscriptions.reduce((s, sub) => s + sub.cost, 0);
const totalMonthly = fixedMonthly + variableMonthly;

const amazonPurchases = [
  { item: "Raspberry Pi 5 Starter Kit", category: "Hardware", project: "PillPod", price: 89.99, date: "Mar 28, 2026", url: "https://amazon.com" },
  { item: "USB-C Hub 7-in-1", category: "Hardware", project: "PillPod", price: 34.99, date: "Mar 22, 2026", url: "https://amazon.com" },
  { item: "Ring Light 10\"", category: "Content", project: "Studio", price: 24.99, date: "Mar 15, 2026", url: "https://amazon.com" },
  { item: "Servo Motor SG90 (5-pack)", category: "Hardware", project: "PillPod", price: 11.49, date: "Mar 10, 2026", url: "https://amazon.com" },
  { item: "Webcam 1080p", category: "Content", project: "Studio", price: 39.99, date: "Feb 28, 2026", url: "https://amazon.com" },
  { item: "Label Printer", category: "Hardware", project: "General", price: 29.99, date: "Feb 20, 2026", url: "https://amazon.com" },
];

const apiCosts = [
  { service: "Claude API", metric: "tokens", usage: "2.4M", cost: 12.30, trend: [6, 8, 10, 12] },
  { service: "Twilio", metric: "SMS", usage: "142", cost: 2.84, trend: [1.5, 2, 3, 2.8] },
  { service: "Resend", metric: "emails", usage: "89", cost: 0, trend: [0, 0, 0, 0] },
];

const renewals = [
  { item: "pillpod.com", type: "Domain", date: "Aug 14, 2026", cost: 12, daysOut: 120 },
  { item: "Cursor Pro", type: "Subscription", date: "May 1, 2026", cost: 20, daysOut: 15 },
  { item: "Lovable Pro", type: "Subscription", date: "May 3, 2026", cost: 20, daysOut: 17 },
];

const categoryData = [
  { name: "Fixed Subs", value: Math.round(fixedMonthly), color: "oklch(0.55 0.15 250)" },
  { name: "Variable API", value: Math.round(variableMonthly), color: "oklch(0.75 0.16 55)" },
  { name: "Hardware", value: 166, color: "oklch(0.65 0.12 160)" },
  { name: "Domains", value: 1, color: "oklch(0.55 0.15 155)" },
];

const monthlySpend = [
  { month: "Oct", fixed: 40, variable: 5, hw: 0 },
  { month: "Nov", fixed: 40, variable: 6, hw: 45 },
  { month: "Dec", fixed: 40, variable: 8, hw: 20 },
  { month: "Jan", fixed: 41, variable: 10, hw: 60 },
  { month: "Feb", fixed: 41, variable: 11, hw: 70 },
  { month: "Mar", fixed: 41, variable: 15, hw: 136 },
];

const projects = ["All", "PillPod", "Studio", "General"];

const categoryColors: Record<string, string> = {
  Hardware: "bg-amber-100 text-amber-700",
  Content: "bg-[oklch(0.92_0.06_180)] text-[oklch(0.40_0.12_180)]",
};

const projectColors: Record<string, string> = {
  PillPod: "bg-amber-100 text-amber-700",
  Studio: "bg-blue-100 text-blue-600",
  General: "bg-muted text-muted-foreground",
};

const cycleColors: Record<string, string> = {
  monthly: "bg-blue-100 text-blue-600",
  yearly: "bg-[oklch(0.93_0.05_310)] text-[oklch(0.45_0.15_310)]",
  usage: "bg-amber-100 text-amber-700",
  free: "bg-muted text-muted-foreground",
};

/* ── small components ──────────────────────────────────────── */

function StatCard({ icon: Icon, value, prefix, suffix, label, delay }: { icon: typeof DollarSign; value: number; prefix?: string; suffix?: string; label: string; delay: number }) {
  const animated = useCountUp(value, 900);
  return (
    <div
      className="group bg-card/60 backdrop-blur-sm rounded-2xl border border-border/60 p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all animate-fade-in"
      style={{ animationDelay: `${delay}ms`, animationFillMode: "both" }}
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
          <Icon size={16} className="text-primary" />
        </div>
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</span>
      </div>
      <span className="text-3xl font-bold font-display text-foreground">
        {prefix ?? "$"}{animated}{suffix ?? ""}
      </span>
    </div>
  );
}

function Sparkline({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data, 1);
  const h = 20;
  const w = 60;
  const points = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - (v / max) * h}`).join(" ");
  return (
    <svg width={w} height={h} className="inline-block ml-2">
      <polyline fill="none" stroke={color} strokeWidth="1.5" points={points} />
    </svg>
  );
}

function SubscriptionRow({ sub }: { sub: Subscription }) {
  const Icon = sub.icon;
  const monthlyCost = sub.cycle === "yearly" ? sub.cost / 12 : sub.cost;

  return (
    <div className="flex items-start gap-4 py-3.5 border-b border-border/40 last:border-0">
      <div className="w-9 h-9 rounded-xl bg-primary/8 flex items-center justify-center shrink-0 mt-0.5">
        <Icon size={16} className="text-primary" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="font-medium text-sm text-foreground">{sub.service}</span>
          <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${cycleColors[sub.cycle]}`}>
            {sub.cycle}
          </span>
          {sub.status === "renewing" && (
            <span className="flex items-center gap-1 text-[10px] text-amber-600 font-medium">
              <Clock size={10} /> Renews {sub.renewDate}
            </span>
          )}
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">{sub.description}</p>
      </div>
      <div className="text-right shrink-0">
        <span className="font-mono font-semibold text-sm text-foreground">
          {sub.cost === 0 ? "Free" : sub.cycle === "usage" ? `~$${sub.cost}` : `$${monthlyCost.toFixed(monthlyCost % 1 === 0 ? 0 : 2)}`}
        </span>
        {sub.cycle === "yearly" && (
          <span className="block text-[10px] text-muted-foreground font-mono">${sub.cost}/yr</span>
        )}
        {sub.cycle !== "free" && sub.cycle !== "yearly" && (
          <span className="block text-[10px] text-muted-foreground">/mo</span>
        )}
      </div>
    </div>
  );
}

/* ── main page ─────────────────────────────────────────────── */

function ExpensesPage() {
  const [projectFilter, setProjectFilter] = useState("All");

  const filteredPurchases = projectFilter === "All"
    ? amazonPurchases
    : amazonPurchases.filter((p) => p.project === projectFilter);

  const thirtyDayTotal = amazonPurchases.reduce((s, p) => s + p.price, 0);
  const totalCenter = categoryData.reduce((s, d) => s + d.value, 0);

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      {/* Page header */}
      <div className="mb-8 animate-fade-in">
        <h1 className="text-2xl font-display font-bold text-foreground mb-1">Expenses</h1>
        <p className="text-sm text-muted-foreground">Track every dollar going into PillPod — fixed costs, variable usage, and one-time purchases.</p>
      </div>

      {/* ── Hero metrics ──────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
        <StatCard icon={DollarSign} value={Math.round(totalMonthly)} label="Monthly Burn" delay={0} />
        <StatCard icon={TrendingUp} value={Math.round(fixedMonthly)} label="Fixed Costs" delay={60} />
        <StatCard icon={Zap} value={Math.round(variableMonthly)} label="Variable" suffix="/mo" delay={120} />
        <StatCard icon={ShoppingCart} value={498} label="All-Time Spent" delay={180} />
      </div>

      {/* ── Chart row ─────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
        {/* Donut */}
        <div className="bg-card/70 backdrop-blur-sm rounded-2xl border border-border/60 p-6 animate-fade-in" style={{ animationDelay: "200ms", animationFillMode: "both" }}>
          <h2 className="font-display font-bold text-sm mb-4 text-foreground">Where the Money Goes</h2>
          <div className="flex items-center gap-6">
            <div className="relative w-40 h-40">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={categoryData} dataKey="value" cx="50%" cy="50%" innerRadius={48} outerRadius={68} paddingAngle={3} strokeWidth={0}>
                    {categoryData.map((d, i) => (
                      <Cell key={i} fill={d.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xl font-bold font-mono text-foreground">${totalCenter}</span>
                <span className="text-[10px] text-muted-foreground">/mo avg</span>
              </div>
            </div>
            <div className="flex flex-col gap-2.5">
              {categoryData.map((d) => (
                <div key={d.name} className="flex items-center gap-2 text-sm">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: d.color }} />
                  <span className="text-muted-foreground">{d.name}</span>
                  <span className="font-mono font-medium text-foreground ml-auto">${d.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Area chart */}
        <div className="bg-card/70 backdrop-blur-sm rounded-2xl border border-border/60 p-6 animate-fade-in" style={{ animationDelay: "280ms", animationFillMode: "both" }}>
          <h2 className="font-display font-bold text-sm mb-4 text-foreground">Monthly Spend Trend</h2>
          <ResponsiveContainer width="100%" height={160}>
            <AreaChart data={monthlySpend}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}`} />
              <RechartsTooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 8, fontSize: 12 }} />
              <Area type="monotone" dataKey="fixed" stackId="1" fill="oklch(0.55 0.15 250 / 0.3)" stroke="oklch(0.55 0.15 250)" strokeWidth={1.5} name="Fixed" />
              <Area type="monotone" dataKey="variable" stackId="1" fill="oklch(0.75 0.16 55 / 0.3)" stroke="oklch(0.75 0.16 55)" strokeWidth={1.5} name="Variable" />
              <Area type="monotone" dataKey="hw" stackId="1" fill="oklch(0.65 0.12 160 / 0.3)" stroke="oklch(0.65 0.12 160)" strokeWidth={1.5} name="Hardware" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── Fixed Subscriptions ───────────────────────────── */}
      <div className="bg-card/70 backdrop-blur-sm rounded-2xl border border-border/60 p-6 mb-6 animate-fade-in" style={{ animationDelay: "320ms", animationFillMode: "both" }}>
        <div className="flex items-center justify-between mb-1">
          <h2 className="font-display font-bold text-sm text-foreground">Fixed Subscriptions</h2>
          <span className="font-mono text-sm font-semibold text-primary">${fixedMonthly.toFixed(2)}/mo</span>
        </div>
        <p className="text-xs text-muted-foreground mb-4">Predictable monthly or annual costs — these don't change with usage.</p>
        {fixedSubscriptions
          .sort((a, b) => (b.cycle === "yearly" ? b.cost / 12 : b.cost) - (a.cycle === "yearly" ? a.cost / 12 : a.cost))
          .map((sub) => <SubscriptionRow key={sub.service} sub={sub} />)}
      </div>

      {/* ── Variable / Usage-Based ────────────────────────── */}
      <div className="bg-card/70 backdrop-blur-sm rounded-2xl border border-border/60 p-6 mb-6 animate-fade-in" style={{ animationDelay: "380ms", animationFillMode: "both" }}>
        <div className="flex items-center justify-between mb-1">
          <h2 className="font-display font-bold text-sm text-foreground flex items-center gap-2">
            <Zap size={14} className="text-amber-600" /> Variable Costs
          </h2>
          <span className="font-mono text-sm font-semibold text-amber-600">~${variableMonthly}/mo</span>
        </div>
        <p className="text-xs text-muted-foreground mb-4">These costs fluctuate based on usage — tokens processed, messages sent, etc.</p>
        {variableSubscriptions
          .sort((a, b) => b.cost - a.cost)
          .map((sub) => <SubscriptionRow key={sub.service} sub={sub} />)}

        {/* Usage breakdown */}
        <div className="mt-4 pt-4 border-t border-border/40">
          <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">Usage This Month</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {apiCosts.map((a) => (
              <div key={a.service} className="flex items-center gap-3 bg-muted/30 rounded-xl px-3.5 py-2.5">
                <div className="flex-1">
                  <span className="text-xs font-medium text-foreground">{a.service}</span>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="font-mono text-xs text-muted-foreground">{a.usage} {a.metric}</span>
                    <Sparkline data={a.trend} color="oklch(0.75 0.16 55)" />
                  </div>
                </div>
                <span className="font-mono font-semibold text-sm text-foreground">{a.cost === 0 ? "Free" : `$${a.cost.toFixed(2)}`}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Free Tier Services ────────────────────────────── */}
      <div className="bg-card/70 backdrop-blur-sm rounded-2xl border border-border/60 p-6 mb-6 animate-fade-in" style={{ animationDelay: "440ms", animationFillMode: "both" }}>
        <div className="flex items-center justify-between mb-1">
          <h2 className="font-display font-bold text-sm text-foreground">Free Tier</h2>
          <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-medium bg-green-100 text-green-600">$0/mo</span>
        </div>
        <p className="text-xs text-muted-foreground mb-4">Critical infrastructure running on free plans — monitor for tier limits.</p>
        {freeSubscriptions.map((sub) => <SubscriptionRow key={sub.service} sub={sub} />)}
      </div>

      {/* ── Upcoming Renewals ─────────────────────────────── */}
      <div className="bg-card/70 backdrop-blur-sm rounded-2xl border border-border/60 p-6 mb-6 animate-fade-in" style={{ animationDelay: "500ms", animationFillMode: "both" }}>
        <h2 className="font-display font-bold text-sm mb-4 text-foreground flex items-center gap-2">
          <AlertCircle size={14} className="text-amber-600" /> Upcoming Renewals
        </h2>
        <div className="space-y-0">
          {renewals.sort((a, b) => a.daysOut - b.daysOut).map((r) => (
            <div key={r.item} className="flex items-center gap-4 py-3 border-b border-border/40 last:border-0">
              <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${r.daysOut <= 30 ? "bg-amber-500 animate-pulse" : "bg-green-600"}`} />
              <div className="flex-1">
                <span className="font-medium text-sm text-foreground">{r.item}</span>
                <span className="block text-[11px] text-muted-foreground">{r.type}</span>
              </div>
              <span className="text-xs text-muted-foreground">{r.date}</span>
              <span className="font-mono font-semibold text-sm text-foreground">${r.cost}</span>
              <span className={`text-xs font-medium rounded-full px-2 py-0.5 ${
                r.daysOut <= 30 ? "bg-amber-100 text-amber-700" : "bg-muted text-muted-foreground"
              }`}>
                {r.daysOut}d
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Amazon Purchases ──────────────────────────────── */}
      <div className="bg-card/70 backdrop-blur-sm rounded-2xl border border-border/60 p-6 animate-fade-in" style={{ animationDelay: "560ms", animationFillMode: "both" }}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-bold text-sm text-foreground">Amazon Purchases</h2>
          <div className="flex gap-1">
            {projects.map((p) => (
              <button
                key={p}
                onClick={() => setProjectFilter(p)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                  projectFilter === p
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Item</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Project</TableHead>
              <TableHead className="text-right">Price</TableHead>
              <TableHead>Date</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPurchases.map((p, i) => (
              <TableRow key={i}>
                <TableCell className="font-medium">{p.item}</TableCell>
                <TableCell>
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${categoryColors[p.category] ?? "bg-muted text-muted-foreground"}`}>
                    {p.category}
                  </span>
                </TableCell>
                <TableCell>
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${projectColors[p.project]}`}>
                    {p.project}
                  </span>
                </TableCell>
                <TableCell className="text-right font-mono font-medium">${p.price.toFixed(2)}</TableCell>
                <TableCell className="text-muted-foreground text-sm">{p.date}</TableCell>
                <TableCell>
                  <a href={p.url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                    <ExternalLink size={14} />
                  </a>
                </TableCell>
              </TableRow>
            ))}
            <TableRow className="border-t-2 border-border">
              <TableCell colSpan={3} className="font-display font-bold text-sm">30-Day Total</TableCell>
              <TableCell className="text-right font-mono font-bold text-primary">${thirtyDayTotal.toFixed(2)}</TableCell>
              <TableCell colSpan={2} />
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
