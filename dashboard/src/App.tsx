import { useEffect, useState } from "react";
import { toast } from "sonner";
import { api, clearSession, getToken, setSession, type ApiUser } from "@/lib/api";
import { useHashRoute } from "@/hooks/useHashRoute";
import { ENTITIES, SECTIONS } from "@/lib/entities";
import { Layout } from "@/components/Layout";
import { LoginPage } from "@/components/LoginPage";
import { OverviewPage } from "@/pages/OverviewPage";
import { EntityPage } from "@/pages/EntityPage";
import { MessagesPage } from "@/pages/MessagesPage";
import { OrganigrammePage } from "@/pages/OrganigrammePage";

const VALID = SECTIONS.map((s) => s.key);

export default function App() {
  const [user, setUser] = useState<ApiUser | null>(null);
  const [booted, setBooted] = useState(false);
  const [unread, setUnread] = useState(0);
  const route = useHashRoute(VALID);

  // Restauration de session au chargement
  useEffect(() => {
    if (!getToken()) { setBooted(true); return; }
    api<ApiUser>("/auth/me")
      .then(setUser)
      .catch(() => clearSession())
      .finally(() => setBooted(true));
  }, []);

  const login = (token: string, u: ApiUser) => {
    setSession(token, u);
    setUser(u);
    toast.success(`Bonjour ${u.name} !`);
  };

  const logout = async () => {
    try { await api("/auth/logout", { method: "POST" }); } catch { /* token déjà révoqué */ }
    clearSession();
    setUser(null);
  };

  if (!booted) return null;

  if (!user) return <LoginPage onLogin={login} />;

  return (
    <Layout user={user} route={route} unread={unread} onLogout={logout}>
      {route === "overview" && <OverviewPage onUnread={setUnread} />}
      {ENTITIES[route] && <EntityPage config={ENTITIES[route]} />}
      {route === "messages" && <MessagesPage onUnread={setUnread} />}
      {route === "organigramme" && <OrganigrammePage />}
    </Layout>
  );
}
