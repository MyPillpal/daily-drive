import { createFileRoute, Link } from "@tanstack/react-router";
import { entries } from "@/data/mock-data";
import { Camera, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/log/")({
  component: LogList,
});

function ScoreBadgeColor(score: number) {
  if (score >= 86) return "bg-amber-600 text-primary-foreground";
  if (score >= 61) return "bg-amber-500 text-primary-foreground";
  if (score >= 31) return "bg-amber-400 text-foreground";
  return "bg-muted text-muted-foreground";
}

function LogList() {
  return (
    <div className="max-w-[1100px] mx-auto px-8 py-10">
      <h1 className="text-2xl font-bold font-display text-foreground mb-2">Daily Log</h1>
      <p className="text-sm text-muted-foreground mb-8">All your entries, newest first.</p>

      <div className="space-y-3">
        {entries.map((entry, i) => (
          <Link
            key={entry.slug}
            to="/log/$slug"
            params={{ slug: entry.slug }}
            className="group flex items-center gap-5 bg-card rounded-xl border border-border p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all animate-fade-in"
            style={{ animationDelay: `${i * 50}ms`, animationFillMode: "both" }}
          >
            {/* Hero image placeholder */}
            <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center shrink-0">
              <Camera size={20} className="text-muted-foreground" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-1">
                <span className="text-sm font-semibold text-foreground">{entry.date}</span>
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${ScoreBadgeColor(entry.founderScore)}`}>
                  {entry.founderScore}
                </span>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-1">{entry.preview}</p>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {entry.tags.map((tag) => (
                  <span key={tag} className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-4 shrink-0">
              <div className="text-right">
                <span className="text-lg font-bold font-display text-foreground">{entry.hours}</span>
                <span className="text-xs text-muted-foreground ml-1">hrs</span>
              </div>
              <ArrowRight size={16} className="text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 transition-all" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
