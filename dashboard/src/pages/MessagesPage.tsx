import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { api, type Message, type Paginated } from "@/lib/api";

export function MessagesPage({ onUnread }: { onUnread: (n: number) => void }) {
  const [messages, setMessages] = useState<Message[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const res = await api<Paginated<Message>>("/messages?per_page=100");
      setMessages(res.data);
      setError(null);
    } catch (e: any) {
      setError(e.message);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const markRead = async (m: Message) => {
    try {
      await api(`/messages/${m.id}`, { method: "PUT", body: { is_read: true } });
      toast.success("Marqué comme lu.");
      load();
    } catch (e: any) { toast.error(e.message); }
  };

  const remove = async (m: Message) => {
    if (!confirm("Supprimer ce message ?")) return;
    try {
      await api(`/messages/${m.id}`, { method: "DELETE" });
      toast.success("Message supprimé.");
      load();
    } catch (e: any) { toast.error(e.message); }
  };

  const refreshUnread = () => {
    api<Paginated<Message>>("/messages?unread=true&per_page=1")
      .then((r) => onUnread(r.meta?.total ?? r.data.length))
      .catch(() => {});
  };

  useEffect(refreshUnread, [messages]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Messages envoyés depuis la page Contact du site.
        </p>
        <Button variant="outline" size="sm" onClick={() => { load(); refreshUnread(); }}>
          <RefreshCw /> Rafraîchir
        </Button>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}
      {!messages && <Skeleton className="h-40" />}

      <Card className="overflow-hidden">
        {messages?.length === 0 && (
          <p className="p-6 text-sm text-muted-foreground">Aucun message.</p>
        )}
        {messages?.map((m) => (
          <div key={m.id} className={`border-b px-6 py-4 last:border-b-0 ${!m.is_read ? "border-l-4 border-l-primary bg-primary/5" : ""}`}>
            <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
              <strong>{m.name}</strong>
              <span className="text-muted-foreground">
                {m.email}{m.phone ? ` · ${m.phone}` : ""}
              </span>
            </div>
            {m.subject && <p className="mt-1 font-medium">{m.subject}</p>}
            <p className="mt-1 text-sm text-muted-foreground">{m.message}</p>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <Badge variant={m.is_read ? "secondary" : "default"}>
                {m.is_read ? "Lu" : "Non lu"}
              </Badge>
              <span className="text-xs text-muted-foreground">
                {new Date(m.created_at).toLocaleString("fr-FR")}
              </span>
              <div className="ml-auto flex gap-2">
                {!m.is_read && (
                  <Button size="sm" variant="outline" onClick={() => markRead(m)}>
                    Marquer comme lu
                  </Button>
                )}
                <Button
                  size="sm" variant="ghost"
                  className="text-destructive hover:bg-destructive/10"
                  onClick={() => remove(m)}
                >
                  Supprimer
                </Button>
              </div>
            </div>
          </div>
        ))}
      </Card>
    </div>
  );
}
