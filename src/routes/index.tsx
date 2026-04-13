import { createFileRoute, Link } from "@tanstack/react-router";
import { Flame, Clock, CheckSquare, TrendingUp, Camera, ChevronDown, ChevronUp } from "lucide-react";
import { usePosts } from "@/hooks/use-posts";
import { useDailyStats } from "@/hooks/use-daily-stats";
import { Area, AreaChart, ResponsiveContainer, Tooltip as RechartsTooltip } from "recharts";
import { useState, useMemo } from "react";

export const Route = createFileRoute("/")({
  component: Dashboard,
});

function ScoreBadgeColor(score: number) {
  if (score >= 86) return "bg-amber-600 text-primary-foreground";
  if (score >= 61) return "bg-amber-500 text-primary-foreground";
  if (score >= 31) return "bg-amber-400 text-foreground";
  return "bg-muted text-muted-foreground";
}

function Dashboard() {
  const { posts, loading: postsLoading } = usePosts();
  const { stats, loading: statsLoading } = useDailyStats();

  const latestPost = posts[0];
  const heatmapData = useMemo(
    () => stats.map((s) => ({ date: s.date, score: s.score })),
    [stats],
  );

  const trendData = useMemo(() => {
    const recent = stats.slice(-31);
    return recent.map((s, i) => ({ day: i + 1, score: s.score }));
  }, [stats]);

  const weekTasks = useMemo(() => {
    return posts.slice(0, 7).reduce((sum, p) => sum + p.tasksCompleted, 0);
  }, [posts]);

  const weekHours = useMemo(() => {
    return posts.slice(0, 7).reduce((sum, p) => sum + p.hours, 0);
  }, [posts]);

  if (postsLoading || statsLoading) {
    return (
      <div className="max-w-[1100px] mx-auto px-8 py-10">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="max-w-[1100px] mx-auto px-8 py-10">
      <h1 className="text-2xl font-bold font-display text-foreground mb-8 animate-fade-in">Dashboard</h1>

      {/* Hero Stats */}
      <div className="grid grid-cols-4 gap-4 mb-10">
        <div className="rounded-xl border border-amber-200 p-6 shadow-sm flex flex-col items-center justify-center text-center animate-scale-in"
             style={{
               background: "linear-gradient(135deg, oklch(0.98 0.03 70), oklch(0.94 0.07 60), oklch(0.96 0.04 80))",
               minHeight: "180px",
             }}>
          <span className="font-extrabold font-display text-primary leading-none" style={{ fontSize: "72px" }}>{latestPost?.founderScore ?? "—"}</span>
          <span className="text-sm font-semibold text-primary mt-2">Founder Score</span>
          <span className="text-xs text-amber-700 mt-0.5 font-medium">
            {latestPost && latestPost.founderScore >= 70 ? "Strong day." : latestPost ? "Keep pushing." : ""}
          </span>
        </div>
        <div className="bg-card rounded-xl border border-border p-6 shadow-sm flex flex-col items-center justify-center text-center animate-fade-in" style={{ animationDelay: "80ms", animationFillMode: "both" }}>
          <Flame className="text-primary animate-pulse mb-2" size={28} />
          <span className="text-4xl font-bold font-display text-foreground">{posts.length}</span>
          <span className="text-sm font-medium text-muted-foreground mt-1">Day streak</span>
        </div>
        <div className="bg-card rounded-xl border border-border p-6 shadow-sm flex flex-col items-center justify-center text-center animate-fade-in" style={{ animationDelay: "160ms", animationFillMode: "both" }}>
          <Clock className="text-muted-foreground mb-2" size={20} />
          <span className="text-4xl font-bold font-display text-foreground">{latestPost?.hours ?? 0}</span>
          <span className="text-sm font-medium text-muted-foreground mt-1">Hours today</span>
        </div>
        <div className="bg-card rounded-xl border border-border p-6 shadow-sm flex flex-col items-center justify-center text-center animate-fade-in" style={{ animationDelay: "240ms", animationFillMode: "both" }}>
          <Clock className="text-muted-foreground mb-2" size={20} />
          <span className="text-4xl font-bold font-display text-foreground">{weekHours}</span>
          <span className="text-sm font-medium text-muted-foreground mt-1">Hours this week</span>
        </div>
      </div>

      {/* Today's Entry + Activity Sidebar */}
      <div className="flex gap-4 mb-10">
        {/* Today's Entry */}
        <div className="flex-1 min-w-0">
          {latestPost ? (
            <TodayEntryCard post={latestPost} />
          ) : (
            <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
              <p className="text-sm text-muted-foreground">No entries yet.</p>
            </div>
          )}
        </div>

        {/* Activity Heatmap - Vertical Sidebar */}
        {heatmapData.length > 0 && (
          <div className="w-[280px] shrink-0 bg-card rounded-xl border border-border p-5 shadow-sm animate-fade-in" style={{ animationDelay: "300ms", animationFillMode: "both" }}>
            <h2 className="text-sm font-semibold font-display text-foreground mb-4">Activity</h2>
            <ActivityHeatmap data={heatmapData} />
          </div>
        )}
      </div>

      {/* Recent Entries */}
      <h2 className="text-sm font-semibold font-display text-foreground mb-4">Recent entries</h2>
      <div className="grid grid-cols-2 gap-4 mb-10">
        {posts.slice(1, 7).map((post, i) => (
          <Link
            key={post.dateRaw}
            to="/log/$slug"
            params={{ slug: post.dateRaw }}
            className="bg-card rounded-xl border border-border p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all group animate-fade-in"
            style={{ animationDelay: `${350 + i * 60}ms`, animationFillMode: "both" }}
          >
            <div className="flex items-start justify-between mb-3">
              <span className="text-sm font-medium text-foreground">{post.date}</span>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${ScoreBadgeColor(post.founderScore)}`}>
                {post.founderScore}
              </span>
            </div>
            <div className="flex items-center gap-4 mb-2">
              <span className="text-lg font-bold font-display text-foreground">{post.hours} hrs</span>
              <span className="text-sm text-muted-foreground">Impact {post.impact}/10</span>
            </div>
            <p className="text-sm text-muted-foreground mb-3 line-clamp-1">{post.preview}</p>
            <div className="flex flex-wrap gap-1.5">
              {post.tags.map((tag) => (
                <span key={tag} className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground">
                  {tag}
                </span>
              ))}
            </div>
          </Link>
        ))}
      </div>

      {/* 30-day Trend */}
      {trendData.length > 0 && (
        <div className="bg-card rounded-xl border border-border p-6 shadow-sm animate-fade-in" style={{ animationDelay: "600ms", animationFillMode: "both" }}>
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={16} className="text-muted-foreground" />
            <h2 className="text-sm font-semibold font-display text-foreground">30-day Founder Score</h2>
          </div>
          <div className="h-32">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.75 0.16 55)" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="oklch(0.75 0.16 55)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <RechartsTooltip
                  contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid oklch(0.92 0.005 80)" }}
                  labelFormatter={(v) => `Day ${v}`}
                />
                <Area
                  type="monotone"
                  dataKey="score"
                  stroke="oklch(0.75 0.16 55)"
                  strokeWidth={2}
                  fill="url(#scoreGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}

function TodayEntryCard({ post }: { post: ReturnType<typeof usePosts>["posts"][0] }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-card rounded-xl border border-border shadow-sm animate-fade-in" style={{ animationDelay: "280ms", animationFillMode: "both" }}>
      <div className="p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <h2 className="text-sm font-semibold font-display text-foreground">Today's Entry</h2>
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${ScoreBadgeColor(post.founderScore)}`}>
              {post.founderScore}
            </span>
          </div>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <span className="font-bold font-display text-foreground">{post.hours} hrs</span>
            <span>·</span>
            <span>{post.tasksCompleted} tasks</span>
          </div>
        </div>

        <p className="text-sm text-muted-foreground mb-3">{post.preview}</p>

        {post.gistBullets.length > 0 && (
          <div className="space-y-1 mb-3">
            {post.gistBullets.slice(0, expanded ? undefined : 3).map((b, i) => (
              <p key={i} className="text-sm text-foreground/80">• {b}</p>
            ))}
          </div>
        )}

        {expanded && post.sections.length > 0 && (
          <div className="space-y-4 mt-4 pt-4 border-t border-border animate-fade-in">
            {post.sections.map((section, i) => (
              <div key={i}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[11px] font-semibold tracking-wider uppercase text-muted-foreground">
                    {section.category} — {section.title}
                  </span>
                  <span className="text-[11px] font-mono text-muted-foreground">{section.hours}h</span>
                </div>
                {section.content.slice(0, 2).map((p, pi) => (
                  <p key={pi} className="text-sm text-foreground/75 leading-relaxed">• {p}</p>
                ))}
              </div>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1 text-xs font-medium text-primary hover:text-primary/80 transition-colors"
          >
            {expanded ? "Show less" : "Show more"}
            {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
          <Link
            to="/log/$slug"
            params={{ slug: post.dateRaw }}
            className="text-xs font-medium text-primary hover:text-primary/80 transition-colors"
          >
            Open full entry →
          </Link>
        </div>
      </div>
    </div>
  );
}

function ActivityHeatmap({ data }: { data: { date: string; score: number }[] }) {
  const [hoveredCell, setHoveredCell] = useState<{ date: string; score: number; x: number; y: number } | null>(null);

  const weeks = useMemo(() => {
    const grid: { date: string; score: number }[][] = [];
    let week: { date: string; score: number }[] = [];
    const firstDay = new Date(data[0].date).getDay();
    for (let i = 0; i < firstDay; i++) week.push({ date: "", score: -1 });
    for (const d of data) {
      week.push(d);
      if (week.length === 7) {
        grid.push(week);
        week = [];
      }
    }
    if (week.length) grid.push(week);
    return grid;
  }, [data]);

  const monthLabels = useMemo(() => {
    const labels: { label: string; weekIndex: number }[] = [];
    let lastMonth = -1;
    weeks.forEach((week, wi) => {
      for (const cell of week) {
        if (cell.date) {
          const d = new Date(cell.date);
          const m = d.getMonth();
          if (m !== lastMonth) {
            lastMonth = m;
            labels.push({ label: d.toLocaleString("en", { month: "short" }), weekIndex: wi });
            break;
          }
        }
      }
    });
    return labels;
  }, [weeks]);

  function cellColor(score: number) {
    if (score <= 0) return "bg-secondary";
    if (score < 20) return "bg-amber-100";
    if (score < 40) return "bg-amber-200";
    if (score < 60) return "bg-amber-400";
    if (score < 80) return "bg-amber-500";
    return "bg-amber-600";
  }

  const dayLabels = ["", "M", "", "W", "", "F", ""];

  return (
    <div className="relative overflow-x-auto">
      <div className="flex">
        <div className="flex flex-col gap-[3px] mr-2 pt-[18px]">
          {dayLabels.map((l, i) => (
            <div key={i} className="h-[13px] flex items-center">
              <span className="text-[10px] text-muted-foreground font-mono w-4 text-right">{l}</span>
            </div>
          ))}
        </div>

        <div className="flex-1">
          <div className="flex h-[18px] mb-[2px]" style={{ position: "relative" }}>
            {monthLabels.map((m, i) => (
              <span
                key={i}
                className="text-[10px] text-muted-foreground font-mono absolute"
                style={{ left: m.weekIndex * 16 }}
              >
                {m.label}
              </span>
            ))}
          </div>

          <div className="flex gap-[3px]">
            {weeks.map((week, wi) => (
              <div key={wi} className="flex flex-col gap-[3px]">
                {week.map((cell, di) => (
                  <div
                    key={di}
                    className={`w-[13px] h-[13px] rounded-[2px] ${cell.score < 0 ? "bg-transparent" : cellColor(cell.score)} cursor-pointer transition-transform hover:scale-125`}
                    onMouseEnter={(e) => {
                      if (cell.score >= 0) {
                        const rect = e.currentTarget.getBoundingClientRect();
                        setHoveredCell({ date: cell.date, score: cell.score, x: rect.left, y: rect.top });
                      }
                    }}
                    onMouseLeave={() => setHoveredCell(null)}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
      {hoveredCell && (
        <div
          className="fixed z-50 bg-foreground text-background text-xs px-2.5 py-1.5 rounded-md shadow-lg pointer-events-none font-mono animate-scale-in"
          style={{ left: hoveredCell.x + 16, top: hoveredCell.y - 8 }}
        >
          {hoveredCell.date} · Score: {hoveredCell.score}
        </div>
      )}
    </div>
  );
}
