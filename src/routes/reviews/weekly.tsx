import { createFileRoute } from "@tanstack/react-router";
import { usePosts } from "@/hooks/use-posts";
import { useDailyStats } from "@/hooks/use-daily-stats";
import { useMemo, useState } from "react";
import { RadialScore } from "@/components/RadialScore";
import { useCountUp } from "@/hooks/use-count-up";
import { ChevronLeft, ChevronRight, TrendingUp, Clock, CheckSquare, Layers } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer, Tooltip as RechartsTooltip } from "recharts";

export const Route = createFileRoute("/reviews/weekly")({
  component: WeeklyReview,
});

function getWeekRange(date: Date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  const start = new Date(d.setDate(diff));
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  return { start, end };
}

function formatDate(d: Date) {
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function WeeklyReview() {
  const { posts, loading: postsLoading } = usePosts();
  const { stats, loading: statsLoading } = useDailyStats();
  const [weekOffset, setWeekOffset] = useState(0);

  const { weekPosts, weekStats, weekRange } = useMemo(() => {
    const now = new Date();
    now.setDate(now.getDate() - weekOffset * 7);
    const range = getWeekRange(now);
    const startStr = range.start.toISOString().slice(0, 10);
    const endStr = range.end.toISOString().slice(0, 10);

    return {
      weekPosts: posts.filter((p) => p.dateRaw >= startStr && p.dateRaw <= endStr),
      weekStats: stats.filter((s) => s.date >= startStr && s.date <= endStr),
      weekRange: range,
    };
  }, [posts, stats, weekOffset]);

  const totalHours = useMemo(() => weekPosts.reduce((s, p) => s + p.hours, 0), [weekPosts]);
  const totalTasks = useMemo(() => weekPosts.reduce((s, p) => s + p.tasksCompleted, 0), [weekPosts]);
  const avgScore = useMemo(() => {
    if (weekPosts.length === 0) return 0;
    return Math.round(weekPosts.reduce((s, p) => s + p.founderScore, 0) / weekPosts.length);
  }, [weekPosts]);

  const topCategories = useMemo(() => {
    const catMap: Record<string, number> = {};
    weekPosts.forEach((p) => p.sections.forEach((s) => {
      catMap[s.category] = (catMap[s.category] || 0) + s.hours;
    }));
    return Object.entries(catMap).sort((a, b) => b[1] - a[1]).slice(0, 5);
  }, [weekPosts]);

  const trendData = useMemo(() => {
    return weekStats.map((s) => ({
      day: new Date(s.date).toLocaleDateString("en", { weekday: "short" }),
      score: s.score,
    }));
  }, [weekStats]);

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
      {/* Header with navigation */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-display text-foreground animate-fade-in">Weekly Review</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {formatDate(weekRange.start)} — {formatDate(weekRange.end)}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setWeekOffset((o) => o + 1)}
            className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={() => setWeekOffset(0)}
            disabled={weekOffset === 0}
            className="text-xs font-medium px-3 py-1.5 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors disabled:opacity-50"
          >
            This week
          </button>
          <button
            onClick={() => setWeekOffset((o) => Math.max(0, o - 1))}
            disabled={weekOffset === 0}
            className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors disabled:opacity-50"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {weekPosts.length === 0 ? (
        <div className="bg-card/70 backdrop-blur-sm rounded-2xl border border-border/60 p-10 text-center">
          <p className="text-muted-foreground">No entries for this week.</p>
        </div>
      ) : (
        <>
          {/* Hero stats */}
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
              <Layers size={20} className="text-primary mb-2" />
              <span className="text-3xl font-bold font-display text-foreground">{weekPosts.length}</span>
              <span className="text-xs text-muted-foreground mt-1">Days Logged</span>
            </div>
          </div>

          {/* Score trend */}
          {trendData.length > 0 && (
            <div className="bg-card/70 backdrop-blur-sm rounded-2xl border border-border/60 p-6 animate-fade-in" style={{ animationDelay: "300ms", animationFillMode: "both" }}>
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp size={16} className="text-primary" />
                <h2 className="text-sm font-semibold font-display text-foreground">Daily Scores</h2>
              </div>
              <div className="h-32">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trendData}>
                    <defs>
                      <linearGradient id="weekGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="oklch(0.75 0.16 55)" stopOpacity={0.35} />
                        <stop offset="100%" stopColor="oklch(0.75 0.16 55)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <RechartsTooltip contentStyle={{ fontSize: 12, borderRadius: 10, border: "1px solid oklch(0.92 0.005 80)" }} />
                    <Area type="monotone" dataKey="score" stroke="oklch(0.75 0.16 55)" strokeWidth={2.5} fill="url(#weekGrad)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Focus areas */}
          {topCategories.length > 0 && (
            <div className="bg-card/70 backdrop-blur-sm rounded-2xl border border-border/60 p-6 animate-fade-in" style={{ animationDelay: "400ms", animationFillMode: "both" }}>
              <h2 className="text-sm font-semibold font-display text-foreground mb-4">Focus Areas</h2>
              <div className="space-y-3">
                {topCategories.map(([cat, hours]) => (
                  <div key={cat} className="flex items-center gap-3">
                    <span className="text-sm font-medium text-foreground w-24">{cat}</span>
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

          {/* Day-by-day */}
          <div className="space-y-3">
            <h2 className="text-sm font-semibold font-display text-foreground">Day by Day</h2>
            {weekPosts.map((post, i) => (
              <div
                key={post.dateRaw}
                className="bg-card/70 backdrop-blur-sm rounded-2xl border border-border/60 p-5 animate-fade-in"
                style={{ animationDelay: `${500 + i * 60}ms`, animationFillMode: "both" }}
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <span className="text-sm font-semibold text-foreground">{post.date}</span>
                    <div className="flex items-center gap-3 mt-0.5">
                      <span className="text-xs text-muted-foreground font-mono">{post.hours} hrs</span>
                      <span className="text-xs text-muted-foreground">·</span>
                      <span className="text-xs text-muted-foreground">{post.tasksCompleted} tasks</span>
                    </div>
                  </div>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-amber-500 text-primary-foreground">
                    {post.founderScore}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">{post.preview}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
