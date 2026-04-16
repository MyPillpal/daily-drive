import { Link, useLocation } from "@tanstack/react-router";
import { BarChart3, PenLine, Lightbulb, Settings } from "lucide-react";

const navItems = [
  { label: "Dashboard", to: "/", icon: BarChart3 },
  { label: "Daily Log", to: "/log", icon: PenLine },
  { label: "Ideas", to: "/ideas", icon: Lightbulb },
  { label: "Settings", to: "/settings", icon: Settings },
];

export function TopNav() {
  const location = useLocation();

  return (
    <nav className="fixed top-0 left-0 right-0 h-14 flex items-center px-6 border-b border-border bg-card/80 backdrop-blur-xl z-50">
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2.5 mr-10">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center animate-scale-in">
          <span className="text-primary-foreground font-display font-bold text-sm">P</span>
        </div>
        <span className="font-display font-bold text-foreground text-base tracking-tight hidden sm:block">PillPod</span>
      </Link>

      {/* Nav Links */}
      <div className="flex items-center gap-1">
        {navItems.map((item, i) => {
          const isActive =
            item.to === "/"
              ? location.pathname === "/"
              : location.pathname.startsWith(item.to);
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`relative flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all animate-fade-in ${
                isActive
                  ? "text-primary bg-primary/8"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
              style={{ animationDelay: `${i * 50}ms`, animationFillMode: "both" }}
            >
              <item.icon size={16} strokeWidth={isActive ? 2.2 : 1.7} />
              <span className="hidden md:inline">{item.label}</span>
              {isActive && (
                <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-primary rounded-full" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
