import { createFileRoute } from "@tanstack/react-router";
import { usePosts } from "@/hooks/use-posts";
import { useDailyStats } from "@/hooks/use-daily-stats";
import { useMemo, useState } from "react";
import { RadialScore } from "@/components/RadialScore";
import { useCountUp } from "@/hooks/use-count-up";
import { ChevronLeft, ChevronRight, TrendingUp, Clock, CheckSquare, Layers, Calendar } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer, Tooltip as RechartsTooltip } from "recharts";

export const Route = createFileRoute("/reviews/monthly")({
  component: MonthlyReview,
});

const MONTH_NAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function MonthlyReview() {
  const { posts, loading: postsLoading } = usePosts();
  const { stats, loading: statsLoading } = useDailyStats();
  const [monthOffset, setMonthOffset] = useState(0);

  const { monthPosts, monthStats, monthLabel } = useMemo(() => {
    const now = new Date();
    const target = new Date(now.getFullYear(), now.getMonth() - monthOffset, 1);
    const year = target.getFullYear();
    const month = target.getMonth();
    const startStr = `${year}-${String(month + 1).padStart(2, "0")}-01`;
    const endDate = new Date(year, month + 1, 0);
    const endStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(endDate.getDate()).padStart(2, "0")}`;

    return {
      monthPosts: posts.filter((p) => p.dateRaw >= startStr && p.dateRaw <= endStr),
      monthStats: stats.filter((s) => s.date >= startStr && s.date <= endStr),
      monthLabel: `${MONTH_NAMES[month]} ${year}`,
    };
  }, [posts, stats, monthOffset]);

  const totalHours = useMemo(() => monthPosts.reduce((s, p) => s + p.hours, 0), [monthPosts]);
  const totalTasks = useMemo(() => monthPosts.reduce((s, p) => s + p.tasksCompleted, 0), [monthPosts]);
  const avgScore = useMemo(() => {
    if (monthPosts.length === 0) return 0;
    return Math.round(monthPosts.reduce((s, p) => s + p.founderScore, 0) / monthPosts.length);
  }, [monthPosts]);

  const bestDay = useMemo(() => {
    if (monthPosts.length === 0) return null;
    return monthPosts.reduce((best, p) => (p.founderScore > best.founderScore ? p : best), monthPosts[0]);
  }, [monthPosts]);

  const topCategories = useMemo(() => {
    const catMap: Record<string, number> = {};
    monthPosts.forEach((p) => p.sections.forEach((s) => {
      catMap[s.category] = (catMap[s.category] || 0) + s.hours;
    }));
    return Object.entries(catMap).sort((a, b) => b[1] - a[1]).slice(0, 6);
  }, [monthPosts]);

  const trendData = useMemo(() => {
    return monthStats.map((s) => ({
      day: new Date(s.date).getDate(),
      score: s.score,
    }));
  }, [monthStats]);

  const topTags = useMemo(() => {
    const tagMap: Record<string, number> = {};
    monthPosts.forEach((p) => p.tags.forEach((t) => {
      tagMap[t] = (tagMap[t] || 0) + 1;
    }));
    return Object.entries(tagMap).sort((a, b) => b[1] - a[1]).slice(0, 8);
  }, [monthPosts]);

  const animatedHours = useCountUp(totalHours, 800);
  const animatedTasks = useCountUp(totalTasks, 800);

  if (postsLoading || statsLoading) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="h-48 rounded-2xl bg-muted/30 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-display text-foreground animate-fade-in">Monthly Review</h1>
          <p className="text-sm text-muted-foreground mt-1">{monthLabel}</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMonthOffset((o) => o + 1)}
            className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={() => setMonthOffset(0)}
            disabled={monthOffset === 0}
            className="text-xs font-medium px-3 py-1.5 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors disabled:opacity-50"
          >
            This month
          </button>
          <button
            onClick={() => setMonthOffset((o) => Math.max(0, o - 1))}
            disabled={monthOffset === 0}
            className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors disabled:opacity-50"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {monthPosts.length === 0 ? (
        <div className="bg-card/70 backdrop-blur-sm rounded-2xl border border-border/60 p-10 text-center">
          <p className="text-muted-foreground">No entries for this month.</p>
        </div>
      ) : (
        <>
          {/* Stats grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-card/70 backdrop-blur-sm rounded-2xl border border-border/60 p-5 flex flex-col items-center animate-fade-in">
              <RadialScore score={avgScore} size={100} strokeWidth={8} />
              <span className="text-xs text-muted-foreground mt-2">Avg Score</span>
            </div>
            <div className="bg-card/70 backdrop-blur-sm rounded-2xl border border-border/60 p-5 flex flex-col items-center justify-center animate-fade-in" style={{ animationDelay: "80ms", animationFillMode: "both" }}>
              <Clock size={20} className="text-primary mb-2" />
              <span className="text-3xl font-bold font-display text-foreground">{animatedHours}</span>
              <span className="text-xs text-muted-foreground mt-1">Hours Logged</span>
            </div>
            <div className="bg-card/70 backdrop-blur-sm rounded-2xl border border-border/60 p-5 flex flex-col items-center justify-center animate-fade-in" style={{ animationDelay: "160ms", animationFillMode: "both" }}>
              <CheckSquare size={20} className="text-primary mb-2" />
              <span className="text-3xl font-bold font-display text-foreground">{animatedTasks}</span>
              <span className="text-xs text-muted-foreground mt-1">Tasks Done</span>
            </div>
            <div className="bg-card/70 backdrop-blur-sm rounded-2xl border border-border/60 p-5 flex flex-col items-center justify-center animate-fade-in" style={{ animationDelay: "240ms", animationFillMode: "both" }}>
              <Calendar size={20} className="text-primary mb-2" />
              <span className="text-3xl font-bold font-display text-foreground">{monthPosts.length}</span>
              <span className="text-xs text-muted-foreground mt-1">Days Logged</span>
            </div>
          </div>

          {/* Score trend */}
          {trendData.length > 0 && (
            <div className="bg-card/70 backdrop-blur-sm rounded-2xl border border-border/60 p-6 animate-fade-in" style={{ animationDelay: "300ms", animationFillMode: "both" }}>
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp size={16} className="text-primary" />
                <h2 className="text-sm font-semibold font-display text-foreground">Score Trend</h2>
              </div>
              <div className="h-36">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trendData}>
                    <defs>
                      <linearGradient id="monthGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="oklch(0.75 0.16 55)" stopOpacity={0.35} />
                        <stop offset="100%" stopColor="oklch(0.75 0.16 55)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <RechartsTooltip contentStyle={{ fontSize: 12, borderRadius: 10, border: "1px solid oklch(0.92 0.005 80)" }} labelFormatter={(v) => `Day ${v}`} />
                    <Area type="monotone" dataKey="score" stroke="oklch(0.75 0.16 55)" strokeWidth={2.5} fill="url(#monthGrad)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Two column: Focus areas + Best day */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Focus areas */}
            {topCategories.length > 0 && (
              <div className="bg-card/70 backdrop-blur-sm rounded-2xl border border-border/60 p-6 animate-fade-in" style={{ animationDelay: "400ms", animationFillMode: "both" }}>
                <h2 className="text-sm font-semibold font-display text-foreground mb-4">Focus Areas</h2>
                <div className="space-y-3">
                  {topCategories.map(([cat, hours]) => (
                    <div key={cat} className="flex items-center gap-3">
                      <span className="text-sm font-medium text-foreground w-20 truncate">{cat}</span>
                      <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full transition-all"
                          style={{ width: `${Math.min(100, (hours / totalHours) * 100)}%` }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground font-mono w-10 text-right">{hours}h</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Best day + tags */}
            <div className="space-y-4">
              {bestDay && (
                <div className="bg-card/70 backdrop-blur-sm rounded-2xl border border-border/60 p-6 animate-fade-in" style={{ animationDelay: "480ms", animationFillMode: "both" }}>
                  <h2 className="text-sm font-semibold font-display text-foreground mb-3">🏆 Best Day</h2>
                  <p className="text-sm font-medium text-foreground">{bestDay.date}</p>
                  <p className="text-xs text-muted-foreground mt-1">Score: {bestDay.founderScore} · {bestDay.hours} hrs · {bestDay.tasksCompleted} tasks</p>
                  <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{bestDay.preview}</p>
                </div>
              )}

              {topTags.length > 0 && (
                <div className="bg-card/70 backdrop-blur-sm rounded-2xl border border-border/60 p-6 animate-fade-in" style={{ animationDelay: "560ms", animationFillMode: "both" }}>
                  <h2 className="text-sm font-semibold font-display text-foreground mb-3">Top Tags</h2>
                  <div className="flex flex-wrap gap-2">
                    {topTags.map(([tag, count]) => (
                      <span key={tag} className="text-xs font-medium px-2.5 py-1 rounded-full bg-secondary text-secondary-foreground">
                        {tag} <span className="text-muted-foreground">×{count}</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
