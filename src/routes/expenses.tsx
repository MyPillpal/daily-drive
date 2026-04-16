import { createFileRoute } from "@tanstack/react-router";
import { DollarSign, TrendingUp, ShoppingCart, Zap, ExternalLink, AlertCircle, Clock, CheckCircle } from "lucide-react";
import { useCountUp } from "@/hooks/use-count-up";
import {
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  PieChart, Pie, Cell, ResponsiveContainer, AreaChart, Area,
  Tooltip as RechartsTooltip, XAxis, YAxis, CartesianGrid,
} from "recharts";
import { useState } from "react";

export const Route = createFileRoute("/expenses")({
  component: ExpensesPage,
});

/* ── static data ───────────────────────────────────────────── */

const subscriptions = [
  { service: "Cursor", cycle: "monthly" as const, tier: "Pro", cost: 20, status: "active" as const, renewDate: "" },
  { service: "Lovable", cycle: "monthly" as const, tier: "Pro", cost: 20, status: "active" as const, renewDate: "" },
  { service: "Claude API", cycle: "usage" as const, tier: "Pay-as-you-go", cost: 12, status: "active" as const, renewDate: "" },
  { service: "Twilio", cycle: "usage" as const, tier: "Pay-as-you-go", cost: 3, status: "active" as const, renewDate: "" },
  { service: "Supabase", cycle: "free" as const, tier: "Free", cost: 0, status: "active" as const, renewDate: "" },
  { service: "Cloudflare", cycle: "free" as const, tier: "Free", cost: 0, status: "active" as const, renewDate: "" },
  { service: "pillpod.com", cycle: "yearly" as const, tier: "Domain", cost: 12, status: "renewing" as const, renewDate: "Aug 14, 2026" },
  { service: "GitHub", cycle: "free" as const, tier: "Free", cost: 0, status: "active" as const, renewDate: "" },
];

const monthlyEquivalent = subscriptions.reduce((sum, s) => {
  if (s.cycle === "yearly") return sum + s.cost / 12;
  return sum + s.cost;
}, 0);

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
  { item: "pillpod.com", date: "Aug 14, 2026", cost: 12, daysOut: 120 },
  { item: "Cursor Pro", date: "May 1, 2026", cost: 20, daysOut: 15 },
  { item: "Lovable Pro", date: "May 3, 2026", cost: 20, daysOut: 17 },
];

const categoryData = [
  { name: "Subscriptions", value: 56, color: "oklch(0.55 0.15 250)" },
  { name: "Hardware", value: 166, color: "oklch(0.75 0.16 55)" },
  { name: "Domains", value: 12, color: "oklch(0.55 0.15 155)" },
  { name: "API / Usage", value: 15, color: "oklch(0.65 0.12 160)" },
];

const monthlySpend = [
  { month: "Oct", subs: 40, hw: 0, api: 5, domains: 0 },
  { month: "Nov", subs: 40, hw: 45, api: 6, domains: 0 },
  { month: "Dec", subs: 40, hw: 20, api: 8, domains: 0 },
  { month: "Jan", subs: 56, hw: 60, api: 10, domains: 12 },
  { month: "Feb", subs: 56, hw: 70, api: 11, domains: 0 },
  { month: "Mar", subs: 56, hw: 136, api: 15, domains: 0 },
];

const projects = ["All", "PillPod", "Studio", "General"];

const categoryColors: Record<string, { bg: string; text: string }> = {
  Hardware: { bg: "bg-amber-100 text-amber-700", text: "" },
  Software: { bg: "bg-blue-100 text-blue-600", text: "" },
  Content: { bg: "bg-[oklch(0.92_0.06_180)] text-[oklch(0.40_0.12_180)]", text: "" },
  Business: { bg: "bg-green-100 text-green-600", text: "" },
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

function StatCard({ icon: Icon, value, prefix, label, delay }: { icon: typeof DollarSign; value: number; prefix?: string; label: string; delay: number }) {
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
        {prefix ?? "$"}{animated}
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
        <p className="text-sm text-muted-foreground">Track every dollar going into PillPod.</p>
      </div>

      {/* ── Hero metrics ──────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <StatCard icon={DollarSign} value={Math.round(monthlyEquivalent)} label="Monthly Burn" delay={0} />
        <StatCard icon={TrendingUp} value={Math.round(monthlyEquivalent * 12)} label="Yearly Cost" delay={80} />
        <StatCard icon={ShoppingCart} value={498} label="All-Time Spent" delay={160} />
      </div>

      {/* ── Chart row ─────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
        {/* Donut */}
        <div className="bg-card/70 backdrop-blur-sm rounded-2xl border border-border/60 p-6 animate-fade-in" style={{ animationDelay: "200ms", animationFillMode: "both" }}>
          <h2 className="font-display font-bold text-sm mb-4 text-foreground">Spend by Category</h2>
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
                <span className="text-[10px] text-muted-foreground">total</span>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              {categoryData.map((d) => (
                <div key={d.name} className="flex items-center gap-2 text-sm">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
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
              <Area type="monotone" dataKey="subs" stackId="1" fill="oklch(0.55 0.15 250 / 0.3)" stroke="oklch(0.55 0.15 250)" strokeWidth={1.5} name="Subscriptions" />
              <Area type="monotone" dataKey="hw" stackId="1" fill="oklch(0.75 0.16 55 / 0.3)" stroke="oklch(0.75 0.16 55)" strokeWidth={1.5} name="Hardware" />
              <Area type="monotone" dataKey="api" stackId="1" fill="oklch(0.65 0.12 160 / 0.3)" stroke="oklch(0.65 0.12 160)" strokeWidth={1.5} name="API" />
              <Area type="monotone" dataKey="domains" stackId="1" fill="oklch(0.55 0.15 155 / 0.3)" stroke="oklch(0.55 0.15 155)" strokeWidth={1.5} name="Domains" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── Subscriptions ─────────────────────────────────── */}
      <div className="bg-card/70 backdrop-blur-sm rounded-2xl border border-border/60 p-6 mb-6 animate-fade-in" style={{ animationDelay: "340ms", animationFillMode: "both" }}>
        <h2 className="font-display font-bold text-sm mb-4 text-foreground">Subscriptions</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Service</TableHead>
              <TableHead>Billing</TableHead>
              <TableHead>Tier</TableHead>
              <TableHead className="text-right">Monthly Cost</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {subscriptions.map((s) => (
              <TableRow key={s.service}>
                <TableCell className="font-medium">{s.service}</TableCell>
                <TableCell>
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${cycleColors[s.cycle]}`}>
                    {s.cycle}
                  </span>
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">{s.tier}</TableCell>
                <TableCell className="text-right font-mono font-medium">
                  {s.cost === 0 ? "Free" : s.cycle === "usage" ? `~$${s.cost}` : s.cycle === "yearly" ? `$${(s.cost / 12).toFixed(2)}` : `$${s.cost}`}
                </TableCell>
                <TableCell>
                  {s.status === "active" && (
                    <span className="flex items-center gap-1.5 text-xs text-green-600">
                      <CheckCircle size={12} /> Active
                    </span>
                  )}
                  {s.status === "renewing" && (
                    <span className="flex items-center gap-1.5 text-xs text-amber-600">
                      <Clock size={12} /> Renews {s.renewDate}
                    </span>
                  )}
                </TableCell>
              </TableRow>
            ))}
            <TableRow className="border-t-2 border-border">
              <TableCell colSpan={3} className="font-display font-bold text-sm">Monthly Equivalent</TableCell>
              <TableCell className="text-right font-mono font-bold text-primary">${monthlyEquivalent.toFixed(2)}</TableCell>
              <TableCell />
            </TableRow>
          </TableBody>
        </Table>
      </div>

      {/* ── Renewals ──────────────────────────────────────── */}
      <div className="bg-card/70 backdrop-blur-sm rounded-2xl border border-border/60 p-6 mb-6 animate-fade-in" style={{ animationDelay: "400ms", animationFillMode: "both" }}>
        <h2 className="font-display font-bold text-sm mb-4 text-foreground flex items-center gap-2">
          <AlertCircle size={14} className="text-amber-600" /> Upcoming Renewals
        </h2>
        <div className="space-y-3">
          {renewals.sort((a, b) => a.daysOut - b.daysOut).map((r) => (
            <div key={r.item} className="flex items-center gap-4 text-sm">
              <span className={`w-2 h-2 rounded-full ${r.daysOut <= 30 ? "bg-amber-500" : "bg-green-600"}`} />
              <span className="font-medium text-foreground flex-1">{r.item}</span>
              <span className="text-muted-foreground">{r.date}</span>
              <span className="font-mono font-medium text-foreground">${r.cost}</span>
              <span className={`text-xs ${r.daysOut <= 30 ? "text-amber-600 font-medium" : "text-muted-foreground"}`}>
                {r.daysOut}d
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Amazon Purchases ──────────────────────────────── */}
      <div className="bg-card/70 backdrop-blur-sm rounded-2xl border border-border/60 p-6 mb-6 animate-fade-in" style={{ animationDelay: "460ms", animationFillMode: "both" }}>
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
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${categoryColors[p.category]?.bg ?? "bg-muted text-muted-foreground"}`}>
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

      {/* ── Variable API Costs ────────────────────────────── */}
      <div className="bg-card/70 backdrop-blur-sm rounded-2xl border border-border/60 p-6 animate-fade-in" style={{ animationDelay: "520ms", animationFillMode: "both" }}>
        <h2 className="font-display font-bold text-sm mb-4 text-foreground">Variable API Costs</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Service</TableHead>
              <TableHead>Metric</TableHead>
              <TableHead>Usage</TableHead>
              <TableHead className="text-right">Cost</TableHead>
              <TableHead>Trend</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {apiCosts.map((a) => (
              <TableRow key={a.service}>
                <TableCell className="font-medium">{a.service}</TableCell>
                <TableCell className="text-muted-foreground text-sm">{a.metric}</TableCell>
                <TableCell className="font-mono text-sm">{a.usage}</TableCell>
                <TableCell className="text-right font-mono font-medium">{a.cost === 0 ? "Free" : `$${a.cost.toFixed(2)}`}</TableCell>
                <TableCell>
                  <Sparkline data={a.trend} color="oklch(0.75 0.16 55)" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
