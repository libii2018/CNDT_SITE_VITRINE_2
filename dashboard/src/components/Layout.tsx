import { useState, type ReactNode } from "react";
import { ExternalLink, LogOut, Newspaper, BookOpen, Images, Users,
         Layers, Mail, Network, LayoutDashboard, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SECTIONS } from "@/lib/entities";
import type { ApiUser } from "@/lib/api";
import { cn } from "@/lib/utils";

const ICONS: Record<string, ReactNode> = {
  overview: <LayoutDashboard className="h-4 w-4" />,
  articles: <Newspaper className="h-4 w-4" />,
  publications: <BookOpen className="h-4 w-4" />,
  albums: <Images className="h-4 w-4" />,
  members: <Users className="h-4 w-4" />,
  projects: <Layers className="h-4 w-4" />,
  messages: <Mail className="h-4 w-4" />,
  organigramme: <Network className="h-4 w-4" />,
  instituts: <Building2 className="h-4 w-4" />,
};

const LABELS: Record<string, string> = Object.fromEntries(
  SECTIONS.map((s) => [s.key, s.label]),
);

interface LayoutProps {
  user: ApiUser;
  route: string;
  unread: number;
  onLogout: () => void;
  children: ReactNode;
}

export function Layout({ user, route, unread, onLogout, children }: LayoutProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-muted/40">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-60 flex-col bg-primary text-primary-foreground transition-transform lg:static lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex items-center gap-2 border-b border-white/15 px-5 py-4 text-base font-bold">
          <Network className="h-5 w-5" />
          CNDT Admin
        </div>
        <nav className="flex-1 space-y-1 p-3">
          {SECTIONS.map((s) => (
            <a
              key={s.key}
              href={`#${s.key}`}
              onClick={() => setOpen(false)}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                route === s.key
                  ? "bg-white/15 font-semibold text-white"
                  : "text-primary-foreground/80 hover:bg-white/10 hover:text-white",
              )}
            >
              {ICONS[s.key]}
              {s.label}
              {s.key === "messages" && unread > 0 && (
                <Badge className="ml-auto bg-red-500 text-white hover:bg-red-500">{unread}</Badge>
              )}
            </a>
          ))}
        </nav>
        <div className="space-y-1 border-t border-white/15 p-3">
          <a
            href="../index.html" target="_blank"
            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-primary-foreground/80 hover:bg-white/10 hover:text-white"
          >
            <ExternalLink className="h-4 w-4" />
            Voir le site
          </a>
          <button
            onClick={onLogout}
            className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-primary-foreground/80 hover:bg-white/10 hover:text-white"
          >
            <LogOut className="h-4 w-4" />
            Déconnexion
          </button>
        </div>
      </aside>

      {open && (
        <div className="fixed inset-0 z-30 bg-black/40 lg:hidden" onClick={() => setOpen(false)} />
      )}

      {/* Contenu */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex items-center justify-between border-b bg-background px-6 py-4">
          <div className="flex items-center gap-3">
            <Button
              variant="outline" size="icon" className="lg:hidden"
              onClick={() => setOpen(!open)}
              aria-label="Menu"
            >
              ☰
            </Button>
            <h1 className="text-lg font-semibold">{LABELS[route] ?? "Dashboard"}</h1>
          </div>
          <span className="text-sm text-muted-foreground">
            {user.name} ({user.email})
          </span>
        </header>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
