import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/api";

// Sélection de l'auteur d'un article parmi le personnel enregistré
// (membres du système). Remplit automatiquement author_name / author_role /
// author_photo / author_url (lien vers la page membre).

interface MemberSelectFieldProps {
  label: string;
  values: Record<string, any>;
  set: (key: string, value: any) => void;
}

export function MemberSelectField({ label, values, set }: MemberSelectFieldProps) {
  const [members, setMembers] = useState<any[] | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    api<{ data: any[] }>("/members?all=true&per_page=200")
      .then((r) => setMembers(r.data))
      .catch(() => setMembers([]));
  }, []);

  if (!members) return <div className="text-sm text-muted-foreground">Chargement du personnel…</div>;

  const fullName = (m: any) => `${m.first_name} ${m.last_name}`.trim();
  const selected = members.find((m) => fullName(m) === values.author_name);

  const filtered = search
    ? members.filter((m) =>
        fullName(m).toLowerCase().includes(search.toLowerCase())
        || (m.role || "").toLowerCase().includes(search.toLowerCase()))
    : members;

  return (
    <div className="grid gap-2">
      <Label>{label}</Label>

      {/* Recherche dans le personnel */}
      <input
        type="search"
        placeholder="Rechercher un membre du personnel (nom, fonction)…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs"
      />

      <select
        className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm"
        value={selected?.id ?? ""}
        onChange={(e) => {
          const m = members.find((x) => String(x.id) === e.target.value);
          if (!m) {
            // « Aucun » : on retire les infos d'auteur
            set("author_name", null);
            set("author_role", null);
            set("author_photo", null);
            set("author_url", null);
            return;
          }
          set("author_name", fullName(m));
          set("author_role", m.role || null);
          set("author_photo", m.photo || null);
          set("author_url", m.slug ? `membres/${m.slug}.html` : null);
        }}
      >
        <option value="">— Aucun auteur —</option>
        {filtered.map((m) => (
          <option key={m.id} value={m.id}>
            {fullName(m)}{m.role ? ` — ${m.role}` : ""}
          </option>
        ))}
      </select>

      {/* Aperçu du badge */}
      {values.author_name && (
        <div className="flex items-center gap-3 rounded-lg border bg-muted/30 p-2">
          {values.author_photo ? (
            <img
              src={values.author_photo}
              alt={values.author_name}
              className="h-12 w-12 rounded-full object-cover"
              onError={(e) => ((e.target as HTMLImageElement).style.display = "none")}
            />
          ) : (
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-xs text-primary">
              {values.author_name.slice(0, 2).toUpperCase()}
            </div>
          )}
          <div className="text-sm">
            <div className="text-xs uppercase tracking-wide text-muted-foreground">Rédigé par</div>
            <strong className="text-foreground">{values.author_name}</strong>
            {values.author_role && (
              <div className="text-xs text-muted-foreground">{values.author_role}</div>
            )}
          </div>
        </div>
      )}

      {!members.length && (
        <p className="text-xs text-muted-foreground">
          Aucun membre du personnel n'est enregistré — ajoutez-les dans la section « Personnel ».
        </p>
      )}
      {members.length > 0 && !selected && values.author_name && (
        <p className="text-xs text-muted-foreground">
          L'auteur actuel ({values.author_name}) ne fait pas partie du personnel enregistré —
          le badge continuera de s'afficher tel quel.
        </p>
      )}
    </div>
  );
}
