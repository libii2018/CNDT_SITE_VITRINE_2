import { useCallback, useEffect, useState, type ReactNode } from "react";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { EntityFormDialog } from "@/components/EntityFormDialog";
import { api, type OrgUnit } from "@/lib/api";

// Organigramme — arbre des unités + CRUD

const UNIT_FIELDS = [
  { key: "parent_id", label: "Unité parente", type: "select" as const, options: [] as Array<[string, string]> },
  { key: "code", label: "Code (I, I.1, II.3, 01…)", type: "text" as const, required: true },
  { key: "label", label: "Libellé", type: "text" as const, required: true },
  { key: "url", label: "Page vitrine liée (ex. cabinet.html)", type: "text" as const },
  { key: "position", label: "Position", type: "number" as const },
];

export function OrganigrammePage() {
  const [tree, setTree] = useState<OrgUnit[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dialog, setDialog] = useState<{ unit: OrgUnit | null; parentId: number | null } | null>(null);

  const load = useCallback(async () => {
    try {
      const res = await api<{ data: OrgUnit[] }>("/organigramme");
      setTree(res.data);
      setError(null);
    } catch (e: any) {
      setError(e.message);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const save = async (values: Record<string, any>) => {
    const body = { ...values };
    if (body.parent_id === "") body.parent_id = null;
    if (dialog?.unit?.id) {
      await api(`/organizational-units/${dialog.unit.id}`, { method: "PUT", body });
    } else {
      await api("/organizational-units", { method: "POST", body });
    }
    toast.success("Unité enregistrée.");
    load();
  };

  const remove = async (id: number) => {
    if (!confirm("Supprimer cette unité (et ses sous-unités) ?")) return;
    try {
      await api(`/organizational-units/${id}`, { method: "DELETE" });
      toast.success("Unité supprimée.");
      load();
    } catch (e: any) { toast.error(e.message); }
  };

  // Aplatis l'arbre pour le sélecteur de parent
  const flat: Array<{ id: number; depth: number; code: string; label: string }> = [];
  const walk = (units: OrgUnit[] | undefined, depth: number) => {
    units?.forEach((u) => {
      flat.push({ id: u.id, depth, code: u.code, label: u.label });
      walk(u.children, depth + 1);
    });
  };
  walk(tree ?? [], 0);

  const fields = UNIT_FIELDS.map((f) =>
    f.key === "parent_id"
      ? {
          ...f,
          options: [
            ["", "— Aucune (racine) —"],
            ...flat.map((u) => [String(u.id), `${"— ".repeat(u.depth)}${u.code} · ${u.label}`] as [string, string]),
          ] as Array<[string, string]>,
        }
      : f,
  );

  const renderNode = (u: OrgUnit): ReactNode => (
    <li key={u.id}>
      <div className="group flex items-center gap-2 py-1.5">
        <span className="w-14 font-bold text-primary">{u.code}</span>
        <span className="text-sm">{u.label}</span>
        <div className="ml-auto flex gap-1 opacity-60 group-hover:opacity-100">
          <Button size="sm" variant="ghost" title="Ajouter un sous-élément"
                  onClick={() => setDialog({ unit: null, parentId: u.id })}>
            <Plus className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="ghost" onClick={() => setDialog({ unit: u, parentId: null })}>
            Modifier
          </Button>
          <Button size="sm" variant="ghost"
                  className="text-destructive hover:bg-destructive/10"
                  onClick={() => remove(u.id)}>
            Supprimer
          </Button>
        </div>
      </div>
      {u.children && u.children.length > 0 && (
        <ul className="ml-7 border-l border-dashed border-border pl-4">
          {u.children.map(renderNode)}
        </ul>
      )}
    </li>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Arbre des unités organisationnelles (chapitres I / II / III).
        </p>
        <Button onClick={() => setDialog({ unit: null, parentId: null })}>
          <Plus /> Nouvelle unité
        </Button>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}
      {!tree && <Skeleton className="h-64" />}

      {tree && (
        <Card className="p-6">
          {tree.length === 0 && (
            <p className="text-sm text-muted-foreground">Organigramme vide.</p>
          )}
          <ul className="space-y-0.5">{tree.map(renderNode)}</ul>
        </Card>
      )}

      {dialog && (
        <EntityFormDialog
          title={dialog.unit?.id ? "Modifier l'unité" : "Nouvelle unité"}
          fields={fields}
          item={dialog.unit?.id ? dialog.unit : ({ parent_id: dialog.parentId ? String(dialog.parentId) : "" } as any)}
          submitLabel="Enregistrer"
          onSubmit={save}
          onClose={() => setDialog(null)}
        />
      )}
    </div>
  );
}
