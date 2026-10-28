import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { Plus, Search, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { EntityFormDialog, DeleteButton } from "@/components/EntityFormDialog";
import { api, type Album, type Paginated, type Photo } from "@/lib/api";
import type { EntityConfig } from "@/lib/entities";

// Page CRUD générique (tableau + recherche + modale) + gestion des photos (galerie)

export function EntityPage({ config }: { config: EntityConfig }) {
  const [items, setItems] = useState<any[] | null>(null);
  const [search, setSearch] = useState("");
  const [searchDebounced, setSearchDebounced] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<Record<string, any> | null>(null);
  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState<any | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setSearchDebounced(search), 400);
    return () => clearTimeout(t);
  }, [search]);

  const load = useCallback(async () => {
    try {
      const q = new URLSearchParams({ all: "true", per_page: "200" });
      if (searchDebounced) q.set("search", searchDebounced);
      const res = await api<Paginated<any>>(`${config.endpoint}?${q}`);
      setItems(res.data);
      setError(null);
    } catch (e: any) {
      setError(e.message);
    }
  }, [config.endpoint, searchDebounced]);

  useEffect(() => { load(); }, [load]);

  const save = async (values: Record<string, any>) => {
    const { gallery, ...body } = values;
    let item = editing;

    if (editing) {
      await api(`${config.endpoint}/${encodeURIComponent(editing[config.idKey])}`, {
        method: "PUT", body,
      });
    } else {
      const res = await api<{ data: any }>(config.endpoint, { method: "POST", body });
      item = res.data;
    }

    // Synchronisation de la galerie d'images (articles uniquement)
    if (config.key === "articles" && item && Array.isArray(gallery)) {
      await syncArticleGallery(item[config.idKey], gallery, (editing?.images as any[]) ?? []);
    }

    toast.success("Enregistré.");
    load();
  };

  const syncArticleGallery = async (
    slug: string,
    next: Array<{ id?: number; path: string; caption?: string | null }>,
    original: Array<{ id: number; path: string }>,
  ) => {
    const keptIds = new Set(next.filter((i) => i.id).map((i) => i.id));
    // Ajouter les nouvelles images (uploadées, sans id)
    for (const img of next.filter((i) => !i.id)) {
      try {
        await api(`/articles/${encodeURIComponent(slug)}/images`, {
          method: "POST",
          body: { path: img.path, caption: img.caption || undefined },
        });
      } catch (e: any) { toast.error(e.message); }
    }
    // Retirer les images supprimées de la galerie
    for (const img of original.filter((o) => !keptIds.has(o.id))) {
      try {
        await api(`/articles/${encodeURIComponent(slug)}/images/${img.id}`, { method: "DELETE" });
      } catch (e: any) { toast.error(e.message); }
    }
  };

  const move = async (index: number, dir: -1 | 1) => {
    const a = items?.[index];
    const b = items?.[index + dir];
    if (!a || !b) return;
    try {
      await api(`${config.endpoint}/${a.id}`, { method: "PUT", body: { position: b.position || index + 1 + dir } });
      await api(`${config.endpoint}/${b.id}`, { method: "PUT", body: { position: a.position || index + 1 } });
      toast.success("Ordre mis à jour.");
      load();
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const remove = async () => {
    if (!deleting) return;
    try {
      await api(`${config.endpoint}/${encodeURIComponent(deleting[config.idKey])}`, {
        method: "DELETE",
      });
      toast.success("Supprimé.");
      setDeleting(null);
      load();
    } catch (e: any) {
      toast.error(e.message);
      setDeleting(null);
    }
  };

const onTableClick = config.orderable
    ? (e: React.MouseEvent<HTMLDivElement>) => {
        const btn = (e.target as HTMLElement).closest("button[data-move-up], button[data-move-down]");
        if (!btn) return;
        const idx = Number((btn as HTMLElement).dataset.idx);
        move(idx, btn.hasAttribute("data-move-up") ? -1 : 1);
      }
    : undefined;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher…" className="pl-8"
            value={search} onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Button className="ml-auto" onClick={() => setCreating(true)}>
          <Plus /> Nouveau
        </Button>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      {!items && <Skeleton className="h-48" />}

      {items && (
        <div onClick={onTableClick} className="rounded-lg border bg-background">
          <Table>
            <TableHeader>
              <TableRow>
                {config.orderable && <TableHead className="w-16">Ordre</TableHead>}
                {config.columns.map((c) => (
                  <TableHead key={c.label}>{c.label}</TableHead>
                ))}
                <TableHead className="w-32" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.length === 0 && (
                <TableRow>
                  <TableCell colSpan={config.columns.length + 1} className="py-8 text-center text-muted-foreground">
                    Aucun élément.
                  </TableCell>
                </TableRow>
              )}
              {items.map((item) => (
                <TableRow key={item[config.idKey]}>
                  {config.orderable && (
                    <TableCell>
                      <div className="flex gap-1">
                        <Button size="sm" variant="ghost" data-move-up data-idx={items.indexOf(item)} disabled={items.indexOf(item) === 0} title="Monter">↑</Button>
                        <Button size="sm" variant="ghost" data-move-down data-idx={items.indexOf(item)} disabled={items.indexOf(item) === items.length - 1} title="Descendre">↓</Button>
                      </div>
                    </TableCell>
                  )}
                  {config.columns.map((c) => (
                    <TableCell key={c.label} className="max-w-[240px] truncate">
                      {c.render ? c.render(item) : (item[c.key ?? ""] ?? "—")}
                    </TableCell>
                  ))}
                  <TableCell>
                    <div className="flex gap-1">
                      <Button size="sm" variant="ghost" onClick={() => setEditing(item)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <DeleteButton onConfirm={() => setDeleting(item)} />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Section spéciale galerie : gestion des photos par album */}
      {config.key === "albums" && items && <AlbumPhotosPanel albums={items as Album[]} />}

      {/* Réordonnancement (carrousel instituts) */}
      {/* Modales */}
      {(editing || creating) && (
        <EntityFormDialog
          title={`${editing ? "Modifier" : "Nouveau"} — ${config.title}`}
          description={editing ? `Modifier ${config.singular}.` : `Créer ${config.singular}.`}
          fields={config.fields}
          item={editing}
          submitLabel={editing ? "Enregistrer" : "Créer"}
          onSubmit={save}
          onClose={() => { setEditing(null); setCreating(false); }}
        />
      )}

      <AlertDialog open={!!deleting} onOpenChange={(o) => !o && setDeleting(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer cet élément ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est définitive.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={remove} className="bg-destructive text-white hover:bg-destructive/90">
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// ---------- Gestion des photos d'un album ----------
function AlbumPhotosPanel({ albums }: { albums: Album[] }) {
  const [albumSlug, setAlbumSlug] = useState(albums[0]?.slug ?? "");
  const [photos, setPhotos] = useState<Photo[] | null>(null);
  const [path, setPath] = useState("");
  const [caption, setCaption] = useState("");

  useEffect(() => {
    setAlbumSlug(albums[0]?.slug ?? "");
  }, [albums]);

  const loadPhotos = useCallback(async () => {
    if (!albumSlug) { setPhotos([]); return; }
    try {
      const res = await api<{ data: Album }>(`/albums/${encodeURIComponent(albumSlug)}`);
      setPhotos(res.data.photos ?? []);
    } catch {
      setPhotos([]);
    }
  }, [albumSlug]);

  useEffect(() => { loadPhotos(); }, [loadPhotos]);

  const addPhoto = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!path) return;
    try {
      await api(`/albums/${encodeURIComponent(albumSlug)}/photos`, {
        method: "POST",
        body: { path, caption: caption || undefined, position: (photos?.length ?? 0) + 1 },
      });
      setPath(""); setCaption("");
      toast.success("Photo ajoutée.");
      loadPhotos();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const deletePhoto = async (id: number) => {
    try {
      await api(`/albums/${encodeURIComponent(albumSlug)}/photos/${id}`, { method: "DELETE" });
      toast.success("Photo supprimée.");
      loadPhotos();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  if (!albums.length) return null;

  return (
    <Card>
      <div className="border-b px-6 py-4">
        <h3 className="font-semibold">Gestion des photos</h3>
      </div>
      <div className="flex flex-wrap items-center gap-3 border-b px-6 py-4">
        <label className="text-sm text-muted-foreground">Album :</label>
        <select
          className="rounded-md border bg-background px-3 py-2 text-sm"
          value={albumSlug}
          onChange={(e) => setAlbumSlug(e.target.value)}
        >
          {albums.map((a) => (
            <option key={a.slug} value={a.slug}>{a.title}</option>
          ))}
        </select>
        <Badge variant="secondary">{photos?.length ?? 0} photo(s)</Badge>
      </div>

      <div className="grid gap-3 px-6 py-4 sm:grid-cols-3">
        {photos?.map((p) => (
          <div key={p.id} className="rounded-md border p-3 text-xs">
            <div className="break-all text-muted-foreground">{p.path}</div>
            {p.caption && <div className="mt-1">{p.caption}</div>}
            <Button
              size="sm" variant="ghost" className="mt-2 text-destructive hover:bg-destructive/10"
              onClick={() => deletePhoto(p.id)}
            >
              Supprimer
            </Button>
          </div>
        ))}
        {photos && photos.length === 0 && (
          <p className="text-sm text-muted-foreground">Aucune photo dans cet album.</p>
        )}
      </div>

      <form onSubmit={addPhoto} className="flex flex-wrap gap-3 border-t px-6 py-4">
        <Input
          className="min-w-[220px] flex-1" placeholder="Chemin de l'image (ex. albums/session/photo-3.jpg)"
          value={path} onChange={(e) => setPath(e.target.value)} required
        />
        <Input
          className="min-w-[160px]" placeholder="Légende (optionnelle)"
          value={caption} onChange={(e) => setCaption(e.target.value)}
        />
        <Button type="submit" disabled={!albumSlug}>
          <Plus /> Ajouter la photo
        </Button>
      </form>
    </Card>
  );
}
