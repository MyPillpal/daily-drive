import { createFileRoute } from "@tanstack/react-router";
import { useIdeas } from "@/hooks/use-ideas";
import { Lock, Globe, Plus } from "lucide-react";
import { useState } from "react";
import { format, parseISO } from "date-fns";

export const Route = createFileRoute("/ideas")({
  component: IdeasPage,
});

function formatIdeaDate(dateStr: string): string {
  try {
    return format(parseISO(dateStr), "MMMM d");
  } catch {
    return dateStr;
  }
}

function IdeasPage() {
  const { ideas, loading, addIdea } = useIdeas();
  const [tab, setTab] = useState<"all" | "public">("all");
  const [newIdea, setNewIdea] = useState("");
  const [adding, setAdding] = useState(false);

  const filtered = tab === "public" ? ideas.filter((i) => i.isPublic) : ideas;

  const grouped = filtered.reduce<Record<string, typeof ideas>>((acc, idea) => {
    const display = formatIdeaDate(idea.date);
    if (!acc[display]) acc[display] = [];
    acc[display].push(idea);
    return acc;
  }, {});

  const handleAdd = async () => {
    const text = newIdea.trim();
    if (!text || adding) return;
    setAdding(true);
    try {
      await addIdea(text);
      setNewIdea("");
    } catch (err) {
      console.error("Failed to add idea:", err);
    } finally {
      setAdding(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-[1100px] mx-auto px-8 py-10">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="max-w-[1100px] mx-auto px-8 py-10">
      <h1 className="text-2xl font-bold font-display text-foreground mb-6">Ideas</h1>

      {/* Tabs */}
      <div className="flex gap-1 mb-6">
        <button
          onClick={() => setTab("all")}
          className={`text-sm font-medium px-4 py-2 rounded-lg transition-colors ${
            tab === "all" ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
          }`}
        >
          All ideas
        </button>
        <button
          onClick={() => setTab("public")}
          className={`text-sm font-medium px-4 py-2 rounded-lg transition-colors ${
            tab === "public" ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
          }`}
        >
          Public only
        </button>
      </div>

      {/* Add idea */}
      <div className="flex gap-2 mb-8">
        <input
          type="text"
          value={newIdea}
          onChange={(e) => setNewIdea(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") handleAdd(); }}
          placeholder="Jot down an idea..."
          className="flex-1 border border-input rounded-lg px-3 py-2.5 text-sm bg-card focus:outline-none focus:ring-2 focus:ring-ring"
        />
        <button
          onClick={handleAdd}
          disabled={adding || !newIdea.trim()}
          className="bg-primary text-primary-foreground rounded-lg px-4 py-2.5 text-sm font-medium hover:bg-primary/90 transition-colors flex items-center gap-1.5 disabled:opacity-50"
        >
          <Plus size={16} />
          {adding ? "Adding..." : "Add"}
        </button>
      </div>

      {/* Ideas list */}
      {Object.entries(grouped).map(([date, dateIdeas]) => (
        <div key={date} className="mb-6">
          <h3 className="text-xs font-semibold tracking-wider uppercase text-muted-foreground mb-3">{date}</h3>
          <div className="space-y-2">
            {dateIdeas.map((idea) => (
              <div
                key={idea.id}
                className={`bg-card rounded-xl border border-border p-4 shadow-sm ${!idea.isPublic ? "opacity-80" : ""}`}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">
                    {idea.isPublic ? (
                      <Globe size={14} className="text-muted-foreground" />
                    ) : (
                      <Lock size={14} className="text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-foreground">{idea.text}</p>
                    {idea.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {idea.tags.map((tag) => (
                          <span key={tag} className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
