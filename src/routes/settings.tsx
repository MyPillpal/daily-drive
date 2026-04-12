import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/settings")({
  component: SettingsPage,
});

function SettingsPage() {
  return (
    <div className="max-w-[1100px] mx-auto px-8 py-10">
      <h1 className="text-2xl font-bold font-display text-foreground mb-6">Settings</h1>
      <div className="bg-card rounded-xl border border-border p-12 shadow-sm text-center">
        <p className="text-muted-foreground text-sm">Settings will appear here.</p>
      </div>
    </div>
  );
}
