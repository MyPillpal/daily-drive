import { Link, useLocation } from "@tanstack/react-router";
import { BarChart3, PenLine, Lightbulb, Settings } from "lucide-react";

const navItems = [
  { label: "Dashboard", to: "/", icon: BarChart3 },
  { label: "Daily Log", to: "/log/april-7", icon: PenLine },
  { label: "Ideas", to: "/ideas", icon: Lightbulb },
  { label: "Settings", to: "/settings", icon: Settings },
];

export function AppSidebar() {
  const location = useLocation();

  return (
    <aside className="fixed left-0 top-0 h-screen w-16 flex flex-col items-center py-6 gap-1 border-r border-border bg-sidebar z-50">
      <div className="mb-6 w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
        <span className="text-primary-foreground font-display font-bold text-sm">P</span>
      </div>
      {navItems.map((item) => {
        const isActive =
          item.to === "/"
            ? location.pathname === "/"
            : location.pathname.startsWith(item.to.split("/").slice(0, 2).join("/"));
        return (
          <Link
            key={item.to}
            to={item.to}
            className={`flex flex-col items-center gap-1 py-2.5 px-2 rounded-lg w-14 transition-colors text-center group ${
              isActive
                ? "bg-sidebar-accent text-primary"
                : "text-sidebar-foreground hover:bg-sidebar-accent/50"
            }`}
          >
            <item.icon size={20} strokeWidth={isActive ? 2.2 : 1.8} />
            <span className="text-[10px] font-medium leading-tight">{item.label}</span>
          </Link>
        );
      })}
    </aside>
  );
}
