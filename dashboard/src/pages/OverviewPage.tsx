import { useEffect, useState } from "react";
import { Newspaper, BookOpen, Images, Users, Layers,
         Mail, Bell } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { api, type Stats, type Message } from "@/lib/api";

export function OverviewPage({ onUnread }: { onUnread: (n: number) => void }) {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recent, setRecent] = useState<Message[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    api<Stats>("/stats").then((s) => alive && setStats(s)).catch((e) => alive && setError(e.message));
    api<{ data: Message[] }>("/messages?per_page=5")
      .then((r) => alive && setRecent(r.data))
      .catch(() => {});
    return () => { alive = false; };
  }, []);

  useEffect(() => {
    if (stats) onUnread(stats.unread_messages);
  }, [stats]);

  if (error) return <p className="text-destructive">{error}</p>;
  if (!stats) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-24" />)}
      </div>
    );
  }

  const cards = [
    { icon: Newspaper, label: "Actualités publiées", value: `${stats.published_articles} / ${stats.articles}` },
    { icon: BookOpen, label: "Publications", value: stats.publications },
    { icon: Images, label: "Galerie", value: `${stats.albums} albums · ${stats.photos} photos` },
    { icon: Users, label: "Personnel", value: stats.members },
    { icon: Layers, label: "Projets", value: stats.projects },
    { icon: Mail, label: "Messages reçus", value: stats.messages },
    { icon: Bell, label: "Messages non lus", value: stats.unread_messages, alert: stats.unread_messages > 0 },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <Card key={c.label} className={c.alert ? "border-destructive/40" : ""}>
            <CardContent className="flex items-center gap-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
                <c.icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="text-xl font-bold">{c.value}</div>
                <div className="text-xs text-muted-foreground">{c.label}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <div className="flex items-center justify-between border-b px-6 py-4">
          <h3 className="font-semibold">Derniers messages</h3>
          <a href="#messages" className="text-sm text-primary underline-offset-4 hover:underline">
            Voir tous
          </a>
        </div>
        {!recent && <div className="p-6"><Skeleton className="h-20" /></div>}
        {recent && recent.length === 0 && (
          <p className="p-6 text-sm text-muted-foreground">Aucun message pour le moment.</p>
        )}
        {recent && recent.map((m) => (
          <div key={m.id} className="border-b px-6 py-4 last:border-b-0">
            <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
              <strong>{m.name}</strong>
              <span className="text-muted-foreground">{m.email}</span>
              {!m.is_read && <Badge className="bg-primary">Nouveau</Badge>}
            </div>
            {m.subject && <p className="mt-1 font-medium">{m.subject}</p>}
            <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{m.message}</p>
          </div>
        ))}
      </Card>
    </div>
  );
}
