import { createFileRoute, Link } from "@tanstack/react-router";
import { usePost, usePosts, type Post } from "@/hooks/use-posts";
import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp, ExternalLink, X } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/log/$slug")({
  component: LogEntry,
});

function LogEntry() {
  const { slug } = Route.useParams();
  const { post, loading } = usePost(slug);
  const { posts } = usePosts();

  if (loading) {
    return (
      <div className="max-w-[1100px] mx-auto px-8 py-10">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="max-w-[1100px] mx-auto px-8 py-10">
        <p className="text-muted-foreground">Entry not found.</p>
        <Link to="/" className="text-primary hover:underline text-sm mt-2 inline-block">← Back to dashboard</Link>
      </div>
    );
  }

  const entryIndex = posts.findIndex((p) => p.dateRaw === slug);
  const prevEntry = posts[entryIndex + 1];
  const nextEntry = posts[entryIndex - 1];

  return (
    <div className="max-w-[1100px] mx-auto px-8 py-10">
      <div className="flex items-center gap-3 mb-6">
        <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors text-sm">Dashboard</Link>
        <span className="text-muted-foreground">/</span>
        <span className="text-sm font-medium text-foreground">{post.date}</span>
      </div>

      <div className="flex gap-8">
        <div className="flex-1 min-w-0" style={{ maxWidth: "65%" }}>
          <GistCard post={post} />
          <DevlogBody post={post} />
        </div>

        <div className="w-[320px] shrink-0">
          <div className="sticky top-8 flex flex-col gap-4">
            <HeroImageCard />
            <ScoreCard post={post} />
            <StatsCard post={post} />
            <TasksCard post={post} />
            <SelfAssessmentCard post={post} />
            <TagsCard post={post} />
            <NavCard prevEntry={prevEntry} nextEntry={nextEntry} />
          </div>
        </div>
      </div>
    </div>
  );
}

function GistCard({ post }: { post: Post }) {
  return (
    <div className="bg-amber-50 rounded-xl border border-amber-200 p-5 mb-6">
      <h2 className="text-sm font-semibold font-display text-foreground mb-2">The gist</h2>
      <div className="space-y-1.5">
        {post.gistBullets.map((b, i) => {
          const hasPersonalSection = post.sections.some(s => s.category === "Personal");
          const isLastBullet = i === post.gistBullets.length - 1;
          return (
            <div key={i}>
              {isLastBullet && hasPersonalSection && (
                <hr className="border-amber-200 my-3" />
              )}
              <p className="text-sm text-muted-foreground">• {b}</p>
            </div>
          );
        })}
        {post.reflection && (
          <>
            <hr className="border-amber-200 my-3" />
            <p className="text-sm text-muted-foreground italic">{post.reflection}</p>
          </>
        )}
      </div>
    </div>
  );
}

function DevlogBody({ post }: { post: Post }) {
  const categories = ["All", ...new Set(post.sections.map((s) => s.category))];
  const [activeFilters, setActiveFilters] = useState<string[]>(["All"]);

  const toggleFilter = (cat: string) => {
    if (cat === "All") {
      setActiveFilters(["All"]);
    } else {
      const next = activeFilters.includes(cat)
        ? activeFilters.filter((c) => c !== cat)
        : [...activeFilters.filter((c) => c !== "All"), cat];
      setActiveFilters(next.length === 0 ? ["All"] : next);
    }
  };

  const filteredSections = activeFilters.includes("All")
    ? post.sections
    : post.sections.filter((s) => activeFilters.includes(s.category));

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => toggleFilter(cat)}
            className={`text-xs font-medium px-3 py-1.5 rounded-full transition-colors ${
              activeFilters.includes(cat)
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {filteredSections.map((section, i) => (
        <div key={i} className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-[11px] font-semibold tracking-wider uppercase text-muted-foreground">{section.category} — {section.title}</span>
            <div className="flex-1 border-t border-border" />
            <span className="text-xs font-mono text-muted-foreground">{section.hours} hrs</span>
          </div>
          {section.content.map((p, pi) => (
            <p key={pi} className="text-sm text-foreground/85 leading-relaxed mb-3">{p}</p>
          ))}
          {section.taskRefs.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {section.taskRefs.map((ref) => (
                <span key={ref} className="inline-flex items-center gap-1 text-[11px] font-mono font-medium px-2 py-0.5 rounded-md bg-blue-100 text-blue-600">
                  <ExternalLink size={10} />
                  {ref}
                </span>
              ))}
            </div>
          )}
          {section.nextSteps && section.nextSteps.length > 0 && (
            <div className="bg-secondary/60 rounded-lg p-3 mt-3">
              <span className="text-[11px] font-semibold tracking-wider uppercase text-muted-foreground mb-1.5 block">Next steps</span>
              {section.nextSteps.map((step, si) => (
                <p key={si} className="text-sm text-muted-foreground">→ {step}</p>
              ))}
            </div>
          )}
        </div>
      ))}

      {filteredSections.length === 0 && (
        <p className="text-sm text-muted-foreground italic">No detailed sections for this day yet.</p>
      )}
    </div>
  );
}

function ScoreCard({ post }: { post: Post }) {
  const breakdowns = post.scoreBreakdown
    ? [
        { label: "Tasks", value: post.scoreBreakdown.tasks },
        { label: "Hours", value: post.scoreBreakdown.hours },
        { label: "Notes", value: post.scoreBreakdown.notes },
        { label: "Variety", value: post.scoreBreakdown.variety },
        { label: "Photos", value: post.scoreBreakdown.photos },
      ]
    : [
        { label: "Tasks", value: 80 },
        { label: "Hours", value: 65 },
        { label: "Notes", value: 70 },
        { label: "Variety", value: 60 },
        { label: "Photos", value: 50 },
      ];

  return (
    <div className="bg-card rounded-xl border border-border p-5 shadow-sm">
      <div className="text-center mb-4">
        <span className="text-4xl font-extrabold font-display text-primary">{post.founderScore}</span>
        <p className="text-xs font-medium text-primary mt-0.5">Founder Score</p>
      </div>
      <div className="space-y-2">
        {breakdowns.map((b) => (
          <div key={b.label} className="flex items-center gap-2">
            <span className="text-[11px] text-muted-foreground w-14">{b.label}</span>
            <div className="flex-1 h-1.5 bg-secondary rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full" style={{ width: `${b.value}%` }} />
            </div>
            <span className="text-[11px] font-mono text-muted-foreground w-8 text-right">{b.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatsCard({ post }: { post: Post }) {
  return (
    <div className="bg-card rounded-xl border border-border p-5 shadow-sm flex items-center justify-around">
      <div className="text-center">
        <span className="text-2xl font-bold font-display text-foreground">{post.hours}</span>
        <p className="text-[11px] text-muted-foreground">Hours</p>
      </div>
      <div className="w-px h-8 bg-border" />
      <div className="text-center">
        <span className="text-2xl font-bold font-display text-foreground">{post.impact}/10</span>
        <p className="text-[11px] text-muted-foreground">Impact</p>
      </div>
    </div>
  );
}

function TasksCard({ post }: { post: Post }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-card rounded-xl border border-border p-5 shadow-sm">
      <button onClick={() => setExpanded(!expanded)} className="flex items-center justify-between w-full text-left">
        <span className="text-sm font-semibold font-display text-foreground">Tasks: {post.tasksCompleted}</span>
        {expanded ? <ChevronUp size={14} className="text-muted-foreground" /> : <ChevronDown size={14} className="text-muted-foreground" />}
      </button>
      {expanded && (
        <div className="mt-3 space-y-1.5">
          {post.tasks.map((t) => (
            <div key={t.id} className="flex items-center gap-2 text-sm">
              <span className="text-green-600">✓</span>
              <span className="font-mono text-[11px] text-muted-foreground">{t.externalId}</span>
              <span className="text-foreground/80 text-xs">{t.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function SelfAssessmentCard({ post }: { post: Post }) {
  return (
    <div className="bg-card rounded-xl border border-border p-5 shadow-sm">
      <h3 className="text-xs font-semibold font-display text-muted-foreground uppercase tracking-wider mb-3">Self-assessment</h3>
      <div className="space-y-2 text-sm">
        <div><span className="text-muted-foreground">How hard:</span> <span className="font-medium">{post.selfAssessment.difficulty}/10</span></div>
        <div><span className="text-muted-foreground">Went well:</span> <span className="font-medium">{post.selfAssessment.wentWell}</span></div>
        <div><span className="text-muted-foreground">Improve:</span> <span className="font-medium">{post.selfAssessment.improve}</span></div>
        <div><span className="text-muted-foreground">Tomorrow:</span> <span className="font-medium">{post.selfAssessment.tomorrow}</span></div>
      </div>
    </div>
  );
}

function HeroImageCard() {
  const [lightbox, setLightbox] = useState(false);

  return (
    <>
      <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
        <div
          className="h-44 bg-muted flex items-center justify-center cursor-pointer"
          onClick={() => setLightbox(true)}
        >
          <span className="text-muted-foreground text-sm">📷 Hero photo</span>
        </div>
        <div className="p-3 flex gap-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="w-16 h-12 bg-muted rounded-md flex items-center justify-center text-[10px] text-muted-foreground cursor-pointer hover:ring-2 hover:ring-primary transition-all">
              #{i}
            </div>
          ))}
        </div>
      </div>
      {lightbox && (
        <div className="fixed inset-0 bg-foreground/80 z-[100] flex items-center justify-center" onClick={() => setLightbox(false)}>
          <div className="bg-card rounded-xl p-2 max-w-xl w-full mx-4">
            <div className="flex justify-end mb-1">
              <button onClick={() => setLightbox(false)} className="text-muted-foreground hover:text-foreground">
                <X size={20} />
              </button>
            </div>
            <div className="h-80 bg-muted rounded-lg flex items-center justify-center text-muted-foreground">
              📷 Full-size photo
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function TagsCard({ post }: { post: Post }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {post.tags.map((tag) => (
        <span key={tag} className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-secondary text-secondary-foreground">
          {tag}
        </span>
      ))}
    </div>
  );
}

function NavCard({ prevEntry, nextEntry }: { prevEntry?: Post; nextEntry?: Post }) {
  return (
    <div className="flex items-center justify-between">
      {prevEntry ? (
        <Link to="/log/$slug" params={{ slug: prevEntry.dateRaw }} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ChevronLeft size={14} />
          {prevEntry.date.split(", ")[1]}
        </Link>
      ) : <span />}
      {nextEntry ? (
        <Link to="/log/$slug" params={{ slug: nextEntry.dateRaw }} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
          {nextEntry.date.split(", ")[1]}
          <ChevronRight size={14} />
        </Link>
      ) : <span />}
    </div>
  );
}
