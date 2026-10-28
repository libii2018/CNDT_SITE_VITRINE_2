import { useRef, useState } from "react";
import { toast } from "sonner";
import { ImagePlus, Loader2, Link2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

// Upload d'image par glisser-déposer (ou sélection) → stockage Laravel (disque public)
// Le champ garde l'URL/chemin retourné dans la valeur du formulaire.

interface ImageUploadFieldProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
}

export async function uploadImage(file: File): Promise<{ path: string; url: string }> {
  const token = localStorage.getItem("cndt_admin_token");
  const form = new FormData();
  form.append("file", file);

  const res = await fetch("http://127.0.0.1:8000/api/v1/upload", {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    body: form,
  });
  const data = await res.json().catch(() => ({} as any));
  if (!res.ok) {
    throw new Error(data.errors ? Object.values(data.errors).flat().join(" ") : data.message || "Upload impossible");
  }
  return data;
}

export function ImageUploadField({ value, onChange, label }: ImageUploadFieldProps) {
  const [dragOver, setDragOver] = useState(false);
  const [busy, setBusy] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (files: FileList | null) => {
    const file = files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Veuillez choisir une image.");
      return;
    }
    setBusy(true);
    try {
      const res = await uploadImage(file);
      onChange(res.url);
      toast.success("Image téléversée.");
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setBusy(false);
    }
  };

  const isUrl = /^https?:\/\//.test(value) || value.startsWith("/storage/");

  return (
    <div className="grid gap-2">
      {label && <LabelLike>{label}</LabelLike>}
      <div
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          handleFiles(e.dataTransfer.files);
        }}
        className={cn(
          "flex min-h-28 cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-4 text-center text-sm transition-colors",
          dragOver ? "border-primary bg-primary/5" : "border-border hover:border-primary/50",
        )}
      >
        {busy ? (
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        ) : value ? (
          <div className="flex flex-col items-center gap-2">
            <img
              src={value} alt="Aperçu"
              className="max-h-40 rounded-md border object-contain"
              onError={(e) => ((e.target as HTMLImageElement).style.display = "none")}
            />
            <span className="break-all text-xs text-muted-foreground">{value}</span>
          </div>
        ) : (
          <>
            <ImagePlus className="h-6 w-6 text-muted-foreground" />
            <span className="text-muted-foreground">
              Glissez une image ici, ou <span className="text-primary underline">parcourir</span>
            </span>
            <span className="text-xs text-muted-foreground">JPG, PNG, WEBP, GIF — 5 Mo max</span>
          </>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
      <div className="flex items-center gap-2">
        <Link2 className="h-4 w-4 shrink-0 text-muted-foreground" />
        <Input
          placeholder="…ou collez un chemin / URL (ex. assets/actu.jpg)"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
      {isUrl && (
        <p className="text-xs text-muted-foreground">Image hébergée par l'API (stockage Laravel).</p>
      )}
    </div>
  );
}

function LabelLike({ children }: { children: React.ReactNode }) {
  return <span className="text-sm font-medium">{children}</span>;
}
