import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { usePosts, updatePostReview } from "@/hooks/use-posts";
import { Check } from "lucide-react";

export const Route = createFileRoute("/review")({
  component: ReviewPage,
});

function ReviewPage() {
  const { posts, loading } = usePosts();
  const [step, setStep] = useState(0);
  const [subStep, setSubStep] = useState(0);
  const [difficulty, setDifficulty] = useState(7);
  const [impact, setImpact] = useState(7);
  const [accomplishment, setAccomplishment] = useState("");
  const [blocker, setBlocker] = useState("");
  const [different, setDifferent] = useState("");
  const [priorities, setPriorities] = useState(["", "", ""]);
  const [heroPhoto, setHeroPhoto] = useState<number | null>(null);
  const [publishing, setPublishing] = useState(false);

  const entry = posts[0];
  const totalSteps = 4;
  const reflectionQuestions = 6;

  if (loading) {
    return (
      <div className="max-w-[640px] mx-auto px-8 py-16">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!entry) {
    return (
      <div className="max-w-[640px] mx-auto px-8 py-16">
        <p className="text-muted-foreground">No entries to review.</p>
      </div>
    );
  }

  const handlePublish = async () => {
    setPublishing(true);
    try {
      await updatePostReview(
        entry.id,
        {
          difficulty,
          wentWell: accomplishment,
          improve: blocker || different,
          tomorrow: priorities.filter(Boolean).join("; "),
        },
        "published",
      );
    } catch (err) {
      console.error("Failed to publish review:", err);
    } finally {
      setPublishing(false);
    }
  };

  return (
    <div className="max-w-[640px] mx-auto px-8 py-16">
      {/* Progress dots */}
      <div className="flex items-center justify-center gap-2 mb-12">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div
            key={i}
            className={`w-2.5 h-2.5 rounded-full transition-colors ${
              i === step ? "bg-primary" : i < step ? "bg-primary/40" : "bg-border"
            }`}
          />
        ))}
      </div>

      {/* Step 1: Preview */}
      {step === 0 && (
        <div>
          <h2 className="text-xl font-bold font-display text-foreground mb-2">Here's what you did today</h2>
          <p className="text-sm text-muted-foreground mb-6">Review your devlog before continuing.</p>
          <div className="bg-card rounded-xl border border-border p-5 shadow-sm mb-8">
            <p className="text-sm font-medium text-foreground mb-2">{entry.date}</p>
            <ul className="space-y-1.5">
              {entry.gistBullets.map((b, i) => (
                <li key={i} className="text-sm text-muted-foreground">• {b}</li>
              ))}
            </ul>
            <p className="text-sm text-muted-foreground italic mt-3 pt-3 border-t border-border">{entry.reflection}</p>
          </div>
          <div className="flex gap-3">
            <button onClick={() => setStep(1)} className="flex-1 bg-primary text-primary-foreground rounded-lg py-2.5 text-sm font-medium hover:bg-primary/90 transition-colors">
              Looks good
            </button>
            <button className="flex-1 bg-secondary text-secondary-foreground rounded-lg py-2.5 text-sm font-medium hover:bg-secondary/80 transition-colors">
              Edit
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Reflection */}
      {step === 1 && (
        <div>
          <h2 className="text-xl font-bold font-display text-foreground mb-2">Reflection</h2>
          <p className="text-sm text-muted-foreground mb-8">Question {subStep + 1} of {reflectionQuestions}</p>

          {subStep === 0 && (
            <div>
              <label className="text-sm font-medium text-foreground block mb-4">How hard did you push today?</label>
              <input
                type="range" min={1} max={10} value={difficulty}
                onChange={(e) => setDifficulty(Number(e.target.value))}
                className="w-full accent-primary"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>1 — Easy</span>
                <span className="font-bold text-foreground">{difficulty}</span>
                <span>10 — All out</span>
              </div>
            </div>
          )}

          {subStep === 1 && (
            <div>
              <label className="text-sm font-medium text-foreground block mb-4">How much impact?</label>
              <input
                type="range" min={1} max={10} value={impact}
                onChange={(e) => setImpact(Number(e.target.value))}
                className="w-full accent-primary"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>1 — Low</span>
                <span className="font-bold text-foreground">{impact}</span>
                <span>10 — Massive</span>
              </div>
            </div>
          )}

          {subStep === 2 && (
            <div>
              <label className="text-sm font-medium text-foreground block mb-3">Most important accomplishment?</label>
              <input
                type="text" value={accomplishment}
                onChange={(e) => setAccomplishment(e.target.value)}
                className="w-full border border-input rounded-lg px-3 py-2.5 text-sm bg-card focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          )}

          {subStep === 3 && (
            <div>
              <label className="text-sm font-medium text-foreground block mb-3">What didn't go as planned?</label>
              <input
                type="text" value={blocker}
                onChange={(e) => setBlocker(e.target.value)}
                placeholder="Context switching killed my morning focus..."
                className="w-full border border-input rounded-lg px-3 py-2.5 text-sm bg-card focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          )}

          {subStep === 4 && (
            <div>
              <label className="text-sm font-medium text-foreground block mb-3">One thing you'll do differently tomorrow?</label>
              <input
                type="text" value={different}
                onChange={(e) => setDifferent(e.target.value)}
                placeholder="Start with deep work before checking messages..."
                className="w-full border border-input rounded-lg px-3 py-2.5 text-sm bg-card focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          )}

          {subStep === 5 && (
            <div>
              <label className="text-sm font-medium text-foreground block mb-3">Top 3 priorities for tomorrow</label>
              <div className="space-y-2">
                {priorities.map((p, i) => (
                  <input
                    key={i}
                    type="text"
                    value={p}
                    onChange={(e) => {
                      const next = [...priorities];
                      next[i] = e.target.value;
                      setPriorities(next);
                    }}
                    placeholder={`Priority ${i + 1}`}
                    className="w-full border border-input rounded-lg px-3 py-2.5 text-sm bg-card focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                ))}
              </div>
            </div>
          )}

          <button
            onClick={() => {
              if (subStep < reflectionQuestions - 1) setSubStep(subStep + 1);
              else setStep(2);
            }}
            className="mt-8 w-full bg-primary text-primary-foreground rounded-lg py-2.5 text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            Next
          </button>
        </div>
      )}

      {/* Step 3: Photos */}
      {step === 2 && (
        <div>
          <h2 className="text-xl font-bold font-display text-foreground mb-2">Select hero image</h2>
          <p className="text-sm text-muted-foreground mb-6">Pick the best photo from today, or skip.</p>
          <div className="grid grid-cols-3 gap-3 mb-8">
            {[0, 1, 2, 3, 4].map((i) => (
              <div
                key={i}
                onClick={() => setHeroPhoto(i)}
                className={`aspect-square bg-muted rounded-lg flex items-center justify-center text-muted-foreground cursor-pointer transition-all ${
                  heroPhoto === i ? "ring-2 ring-primary ring-offset-2" : "hover:ring-1 hover:ring-border"
                }`}
              >
                {heroPhoto === i && <Check className="text-primary" size={24} />}
                {heroPhoto !== i && <span className="text-sm">📷 {i + 1}</span>}
              </div>
            ))}
          </div>
          <div className="flex gap-3">
            <button onClick={() => setStep(3)} className="flex-1 bg-primary text-primary-foreground rounded-lg py-2.5 text-sm font-medium hover:bg-primary/90 transition-colors">
              Continue
            </button>
            <button onClick={() => setStep(3)} className="flex-1 bg-secondary text-secondary-foreground rounded-lg py-2.5 text-sm font-medium hover:bg-secondary/80 transition-colors">
              Skip
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Preview & Publish */}
      {step === 3 && (
        <div>
          <h2 className="text-xl font-bold font-display text-foreground mb-2">Ready to publish</h2>
          <p className="text-sm text-muted-foreground mb-6">Here's the parent-friendly summary.</p>
          <div className="bg-card rounded-xl border border-border p-5 shadow-sm mb-8">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-foreground">{entry.date}</span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-primary text-primary-foreground">{entry.founderScore}</span>
            </div>
            <p className="text-sm text-muted-foreground mb-2">{entry.preview}</p>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span>{entry.hours} hrs logged</span>
              <span>Impact: {impact}/10</span>
              <span>Difficulty: {difficulty}/10</span>
            </div>
            {accomplishment && (
              <div className="mt-3 pt-3 border-t border-border">
                <p className="text-xs text-muted-foreground">🏆 {accomplishment}</p>
              </div>
            )}
          </div>
          <div className="flex gap-3">
            <button
              onClick={handlePublish}
              disabled={publishing}
              className="flex-1 bg-primary text-primary-foreground rounded-lg py-2.5 text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {publishing ? "Publishing..." : "Publish"}
            </button>
            <button className="flex-1 bg-secondary text-secondary-foreground rounded-lg py-2.5 text-sm font-medium hover:bg-secondary/80 transition-colors">
              I'll check later
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
