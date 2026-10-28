import { useState, type FormEvent, type ReactNode } from "react";
import { toast } from "sonner";
import { Loader2, X } from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { RichTextEditor } from "@/components/RichTextEditor";
import { ImageUploadField } from "@/components/ImageUploadField";
import { ArticleGalleryField, type GalleryItem } from "@/components/ArticleGalleryField";
import { MemberSelectField } from "@/components/MemberSelectField";
import type { FieldConfig } from "@/lib/entities";

// Modale de formulaire générique pilotée par la configuration des entités

interface FormValues {
  [key: string]: string | number | boolean | null | GalleryItem[];
}

export interface EntityFormDialogProps {
  title: string;
  description?: string;
  fields: FieldConfig[];
  item: Record<string, any> | null;
  extraData?: Record<string, any>;
  submitLabel: string;
  onSubmit: (values: FormValues) => Promise<void>;
  onClose: () => void;
}

export function EntityFormDialog({
  title, description, fields, item, extraData, submitLabel, onSubmit, onClose,
}: EntityFormDialogProps) {
  const [values, setValues] = useState<FormValues>(() => {
    const v: FormValues = {};
    for (const f of fields) {
      if (f.type === "gallery") {
        const imgs = item?.images as any[] | undefined;
        v[f.key] = imgs ? imgs.map((i) => ({ id: i.id, path: i.path, caption: i.caption })) : [];
        continue;
      }
      const raw = item && item.id !== undefined
        ? item[f.key]
        : (extraData?.[f.key] ?? (f.type === "checkbox" ? true : f.type === "number" ? 0 : ""));
      v[f.key] = raw === null || raw === undefined ? "" : raw;
    }
    return v;
  });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = (key: string, value: string | number | boolean | null | GalleryItem[]) =>
    setValues((v) => ({ ...v, [key]: value }));

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      // Ne pas envoyer les champs vides (l'API les traite en "sometimes")
      const payload: FormValues = {};
      for (const f of fields) {
        const val = values[f.key];
        if (f.type === "member") { continue; }
        if (f.type === "checkbox") payload[f.key] = Boolean(val);
        else if (f.type === "gallery") payload[f.key] = (val as GalleryItem[]) ?? [];
        else if (val !== "" && val !== null) payload[f.key] = val;
        else if (!item) payload[f.key] = f.type === "number" ? 0 : null;
      }
      await onSubmit(payload);
      onClose();
    } catch (err: any) {
      setError(err.message || "Erreur inconnue");
      toast.error(err.message || "Erreur lors de l'enregistrement");
    } finally {
      setBusy(false);
    }
  };

  const renderField = (f: FieldConfig) => {
    const value = values[f.key];
    const id = `field-${f.key}`;

    if (f.type === "checkbox") {
      return (
        <div key={f.key} className="flex items-center gap-2">
          <Checkbox
            id={id}
            checked={Boolean(value)}
            onCheckedChange={(c) => set(f.key, Boolean(c))}
          />
          <Label htmlFor={id}>{f.label}</Label>
        </div>
      );
    }

    if (f.type === "member") {
      return (
        <MemberSelectField
          key={f.key}
          label={f.label}
          values={values as unknown as Record<string, any>}
          set={(k, v) => set(k, v)}
        />
      );
    }

    if (f.type === "gallery") {
      return (
        <ArticleGalleryField
          key={f.key}
          label={f.label}
          value={(values[f.key] as GalleryItem[]) ?? []}
          onChange={(items) => set(f.key, items)}
        />
      );
    }

    if (f.type === "image") {
      return (
        <ImageUploadField
          key={f.key}
          label={f.label}
          value={String(value ?? "")}
          onChange={(v) => set(f.key, v)}
        />
      );
    }

    if (f.type === "richtext") {
      return (
        <div key={f.key} className="grid gap-2">
          <Label>{f.label}{f.required && " *"}</Label>
          <RichTextEditor
            value={String(value ?? "")}
            onChange={(html) => set(f.key, html)}
          />
        </div>
      );
    }

    if (f.type === "select") {
      const opts = f.options ?? [];
      return (
        <div key={f.key} className="grid gap-2">
          <Label htmlFor={id}>{f.label}{f.required && " *"}</Label>
          <Select value={String(value ?? "")} onValueChange={(v) => set(f.key, v)}>
            <SelectTrigger id={id}>
              <SelectValue placeholder="— Choisir —" />
            </SelectTrigger>
            <SelectContent>
              {opts.map(([v, l]) => (
                <SelectItem key={v} value={v}>{l}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      );
    }

    return (
      <div key={f.key} className="grid gap-2">
        <Label htmlFor={id}>{f.label}{f.required && " *"}</Label>
        {f.type === "textarea" ? (
          <Textarea id={id} value={String(value ?? "")}
            onChange={(e) => set(f.key, e.target.value)} />
        ) : (
          <Input
            id={id}
            type={f.type === "number" ? "number" : f.type}
            value={String(value ?? "")}
            onChange={(e) => set(f.key, e.target.value)}
            required={f.required}
          />
        )}
      </div>
    );
  };

  return (
    <Dialog open onOpenChange={(open) => { if (!open && !busy) onClose(); }}>
      <DialogContent className="h-[94vh] max-h-[94vh] w-[96vw] max-w-[96vw] overflow-y-auto sm:max-w-[96vw] sm:w-[96vw]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <form onSubmit={submit} className="grid gap-4">
          {fields.map(renderField)}
          {error && <p className="text-sm text-destructive">{error}</p>}
          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={busy}>
              <X /> Annuler
            </Button>
            <Button type="submit" disabled={busy}>
              {busy && <Loader2 className="animate-spin" />}
              {submitLabel}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// Bouton "Nouveau / Modifier / Supprimer" — helpers partagés
export function DeleteButton({ onConfirm, busy }: { onConfirm: () => void; busy?: boolean }) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      className="text-destructive hover:bg-destructive/10"
      onClick={onConfirm}
      disabled={busy}
    >
      Supprimer
    </Button>
  );
}

export type { ReactNode };
