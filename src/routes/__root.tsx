import { Outlet, Link, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import { TopNav } from "@/components/TopNav";
import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold font-display text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold font-display text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">The page you're looking for doesn't exist.</p>
        <div className="mt-6">
          <Link to="/" className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "PillPod — Daily Log" },
      { name: "description", content: "Private productivity journal for startup founders" },
      { property: "og:title", content: "PillPod — Daily Log" },
      { name: "twitter:title", content: "PillPod — Daily Log" },
      { property: "og:description", content: "Private productivity journal for startup founders" },
      { name: "twitter:description", content: "Private productivity journal for startup founders" },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/9f54e968-0b62-4dfa-900a-9ba4d934d011/id-preview-98483fe4--9aad69fb-7755-4b5d-ab83-86c98c3d1398.lovable.app-1776074283657.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/9f54e968-0b62-4dfa-900a-9ba4d934d011/id-preview-98483fe4--9aad69fb-7755-4b5d-ab83-86c98c3d1398.lovable.app-1776074283657.png" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:type", content: "website" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return (
    <div className="flex flex-col min-h-screen">
      <TopNav />
      <main className="flex-1 mt-14">
        <Outlet />
      </main>
    </div>
  );
}
