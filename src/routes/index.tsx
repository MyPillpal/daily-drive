import { createFileRoute, Link } from "@tanstack/react-router";
import { Flame, Clock, CheckSquare, TrendingUp, ChevronDown, ChevronUp, ArrowRight, Sparkles } from "lucide-react";
import { usePosts } from "@/hooks/use-posts";
import { useDailyStats } from "@/hooks/use-daily-stats";
import { useCountUp } from "@/hooks/use-count-up";
import { RadialScore } from "@/components/RadialScore";
import { AIChat } from "@/components/AIChat";
import { Area, AreaChart, ResponsiveContainer, Tooltip as RechartsTooltip } from "recharts";
import { useState, useMemo } from "react";

export const Route = createFileRoute("/")({
  component: Dashboard,
});

function ScoreDotColor(score: number) {
  if (score >= 80) return "bg-amber-600";
  if (score >= 60) return "bg-amber-500";
  if (score >= 40) return "bg-amber-400";
  return "bg-muted-foreground/40";
}

function ScoreBadgeColor(score: number) {
  if (score >= 86) return "bg-amber-600 text-primary-foreground";
  if (score >= 61) return "bg-amber-500 text-primary-foreground";
  if (score >= 31) return "bg-amber-400 text-foreground";
  return "bg-muted text-muted-foreground";
}

function StatCard({ icon: Icon, value, label, delay }: { icon: typeof Flame; value: number; label: string; delay: number }) {
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
      <span className="text-3xl font-bold font-display text-foreground">{animated}</span>
    </div>
  );
}

function Dashboard() {
  const [chatOpen, setChatOpen] = useState(false);
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
      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="h-48 rounded-2xl bg-muted/30 animate-pulse" />
      </div>
    );
  }

  const greeting = getGreeting();

  return (
    <div className="max-w-5xl mx-auto px-6 py-8 space-y-10">
      {/* Hero Section */}
      <div
        className="relative rounded-3xl overflow-hidden p-8 md:p-10 animate-fade-in"
        style={{
          background: "linear-gradient(135deg, oklch(0.97 0.03 70), oklch(0.93 0.07 55), oklch(0.96 0.04 80))",
        }}
      >
        <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
          <div className="flex-1">
            <p className="text-sm font-medium text-amber-700/80 mb-1 animate-fade-in" style={{ animationDelay: "100ms", animationFillMode: "both" }}>
              {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
            </p>
            <h1 className="text-3xl md:text-4xl font-bold font-display text-foreground mb-2 animate-fade-in" style={{ animationDelay: "150ms", animationFillMode: "both" }}>
              {greeting}
            </h1>
            <p className="text-sm text-amber-800/60 max-w-md animate-fade-in" style={{ animationDelay: "200ms", animationFillMode: "both" }}>
              {latestPost && latestPost.founderScore >= 70
                ? "You're on a roll. Keep the momentum going."
                : latestPost
                  ? "Every day counts. Let's make this one matter."
                  : "Start logging your first day."}
            </p>
          </div>
          <div className="animate-scale-in" style={{ animationDelay: "300ms", animationFillMode: "both" }}>
            <RadialScore score={latestPost?.founderScore ?? 0} size={150} strokeWidth={10} />
          </div>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon={Flame} value={posts.length} label="Day Streak" delay={100} />
        <StatCard icon={Clock} value={latestPost?.hours ?? 0} label="Hours Today" delay={160} />
        <StatCard icon={CheckSquare} value={weekTasks} label="Tasks This Week" delay={220} />
        <StatCard icon={Clock} value={weekHours} label="Hours This Week" delay={280} />
      </div>

      {/* Today's Entry Card */}
      {latestPost && <TodayEntryCard post={latestPost} />}

      {/* Recent Entries as Timeline */}
      {posts.length > 1 && (
        <div>
          <h2 className="text-lg font-semibold font-display text-foreground mb-6">Recent Entries</h2>
          <div className="relative pl-8">
            {/* Timeline line */}
            <div className="absolute left-3 top-2 bottom-2 w-px bg-border" />

            <div className="space-y-6">
              {posts.slice(1, 7).map((post, i) => (
                <Link
                  key={post.dateRaw}
                  to="/log/$slug"
                  params={{ slug: post.dateRaw }}
                  className="relative block bg-card/70 backdrop-blur-sm rounded-2xl border border-border/60 p-5 hover:shadow-lg hover:-translate-y-0.5 transition-all group animate-fade-in"
                  style={{ animationDelay: `${400 + i * 80}ms`, animationFillMode: "both" }}
                >
                  {/* Timeline dot */}
                  <div className={`absolute -left-5 top-6 w-3 h-3 rounded-full border-2 border-card ${ScoreDotColor(post.founderScore)} ring-2 ring-card`} />

                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <span className="text-sm font-semibold text-foreground">{post.date}</span>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs text-muted-foreground font-mono">{post.hours} hrs</span>
                        <span className="text-xs text-muted-foreground">·</span>
                        <span className="text-xs text-muted-foreground">{post.tasksCompleted} tasks</span>
                      </div>
                    </div>
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${ScoreBadgeColor(post.founderScore)}`}>
                      {post.founderScore}
                    </span>
                  </div>

                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{post.preview}</p>

                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-1.5">
                      {post.tags.slice(0, 4).map((tag) => (
                        <span key={tag} className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <ArrowRight size={14} className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Activity Heatmap — full width */}
      {heatmapData.length > 0 && (
        <div className="bg-card/70 backdrop-blur-sm rounded-2xl border border-border/60 p-6 shadow-sm animate-fade-in" style={{ animationDelay: "600ms", animationFillMode: "both" }}>
          <h2 className="text-sm font-semibold font-display text-foreground mb-4">Activity</h2>
          <ActivityHeatmap data={heatmapData} />
        </div>
      )}

      {/* 30-day Trend */}
      {trendData.length > 0 && (
        <div className="bg-card/70 backdrop-blur-sm rounded-2xl border border-border/60 p-6 shadow-sm animate-fade-in" style={{ animationDelay: "700ms", animationFillMode: "both" }}>
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={16} className="text-primary" />
            <h2 className="text-sm font-semibold font-display text-foreground">30-day Founder Score</h2>
          </div>
          <div className="h-36">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.75 0.16 55)" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="oklch(0.75 0.16 55)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <RechartsTooltip
                  contentStyle={{ fontSize: 12, borderRadius: 10, border: "1px solid oklch(0.92 0.005 80)", background: "oklch(1 0 0 / 0.9)", backdropFilter: "blur(8px)" }}
                  labelFormatter={(v) => `Day ${v}`}
                />
                <Area
                  type="monotone"
                  dataKey="score"
                  stroke="oklch(0.75 0.16 55)"
                  strokeWidth={2.5}
                  fill="url(#scoreGrad)"
                  animationDuration={1500}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* AI Chat FAB */}
      {!chatOpen && (
        <button
          onClick={() => setChatOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 rounded-2xl bg-primary text-primary-foreground shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center justify-center z-40"
        >
          <Sparkles size={22} />
        </button>
      )}

      <AIChat posts={posts} isOpen={chatOpen} onClose={() => setChatOpen(false)} />
    </div>
  );
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning.";
  if (h < 17) return "Good afternoon.";
  return "Good evening.";
}

function TodayEntryCard({ post }: { post: ReturnType<typeof usePosts>["posts"][0] }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className="bg-card/70 backdrop-blur-sm rounded-2xl border border-border/60 shadow-sm animate-fade-in overflow-hidden"
      style={{ animationDelay: "350ms", animationFillMode: "both" }}
    >
      {/* Gradient left accent */}
      <div className="flex">
        <div
          className="w-1 shrink-0 rounded-l-2xl"
          style={{
            background: post.founderScore >= 70
              ? "linear-gradient(to bottom, oklch(0.68 0.17 50), oklch(0.75 0.16 55))"
              : post.founderScore >= 40
                ? "linear-gradient(to bottom, oklch(0.82 0.14 65), oklch(0.75 0.16 55))"
                : "linear-gradient(to bottom, oklch(0.7 0.02 260), oklch(0.55 0.02 260))",
          }}
        />
        <div className="flex-1 p-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <h2 className="text-base font-semibold font-display text-foreground">Today's Entry</h2>
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${ScoreBadgeColor(post.founderScore)}`}>
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
            <div className="space-y-1.5 mb-3">
              {post.gistBullets.slice(0, expanded ? undefined : 3).map((b, i) => (
                <p
                  key={i}
                  className="text-sm text-foreground/80 animate-fade-in"
                  style={{ animationDelay: `${i * 60}ms`, animationFillMode: "both" }}
                >
                  • {b}
                </p>
              ))}
            </div>
          )}

          {expanded && post.sections.length > 0 && (
            <div className="space-y-4 mt-4 pt-4 border-t border-border/60 animate-fade-in">
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

          <div className="flex items-center justify-between mt-4 pt-3 border-t border-border/60">
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
              className="flex items-center gap-1 text-xs font-medium text-primary hover:text-primary/80 transition-colors"
            >
              Open full entry
              <ArrowRight size={12} />
            </Link>
          </div>
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
                    className={`w-[13px] h-[13px] rounded-[3px] ${cell.score < 0 ? "bg-transparent" : cellColor(cell.score)} cursor-pointer transition-all hover:scale-125 hover:ring-2 hover:ring-primary/30`}
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
          className="fixed z-50 bg-foreground text-background text-xs px-2.5 py-1.5 rounded-lg shadow-lg pointer-events-none font-mono animate-scale-in"
          style={{ left: hoveredCell.x + 16, top: hoveredCell.y - 8 }}
        >
          {hoveredCell.date} · Score: {hoveredCell.score}
        </div>
      )}
    </div>
  );
}
