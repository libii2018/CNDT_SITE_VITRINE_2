import { useRef, useState } from "react";
import { toast } from "sonner";
import { ImagePlus, Loader2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { uploadImage } from "@/components/ImageUploadField";

// Galerie d'images d'un article : ajout multiple par glisser-déposer / parcourir,
// retrait individuel. Les images ajoutées sont téléversées immédiatement
// (stockage Laravel) ; la synchronisation avec l'article se fait à l'enregistrement.

export interface GalleryItem {
  id?: number;      // présent si image déjà enregistrée
  path: string;
  caption?: string | null;
}

interface GalleryFieldProps {
  label: string;
  value: GalleryItem[];
  onChange: (items: GalleryItem[]) => void;
}

export function ArticleGalleryField({ label, value, onChange }: GalleryFieldProps) {
  const [dragOver, setDragOver] = useState(false);
  const [busy, setBusy] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const addFiles = async (files: FileList | null) => {
    const images = files ? Array.from(files).filter((f) => f.type.startsWith("image/")) : [];
    if (!images.length) return;
    setBusy(true);
    const added: GalleryItem[] = [];
    try {
      for (const file of images) {
        try {
          const res = await uploadImage(file);
          added.push({ path: res.url, caption: "" });
        } catch (e: any) {
          toast.error(`${file.name} : ${e.message}`);
        }
      }
      if (added.length) {
        onChange([...value, ...added]);
        toast.success(`${added.length} image(s) ajoutée(s) à la galerie.`);
      }
    } finally {
      setBusy(false);
    }
  };

  const removeItem = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  return (
    <div className="grid gap-2">
      <span className="text-sm font-medium">{label}</span>

      {value.length > 0 && (
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
          {value.map((img, i) => (
            <div key={i} className="group relative overflow-hidden rounded-md border">
              <img
                src={img.path}
                alt={img.caption || "Image de la galerie"}
                className="aspect-square w-full object-cover"
                onError={(e) => ((e.target as HTMLImageElement).src = img.path)}
              />
              {img.id && (
                <span
                  className="absolute left-1 top-1 rounded bg-black/60 px-1 text-[10px] text-white"
                  title="Image déjà enregistrée"
                >
                  #{img.id}
                </span>
              )}
              <button
                type="button"
                title="Retirer de la galerie"
                onClick={() => removeItem(i)}
                className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-destructive text-white opacity-0 transition-opacity group-hover:opacity-100"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

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
          addFiles(e.dataTransfer.files);
        }}
        className={cn(
          "flex min-h-20 cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed p-4 text-center text-sm transition-colors",
          dragOver ? "border-primary bg-primary/5" : "border-border hover:border-primary/50",
        )}
      >
        {busy ? (
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
        ) : (
          <>
            <ImagePlus className="h-5 w-5 text-muted-foreground" />
            <span className="text-muted-foreground">
              Glissez des images pour la galerie, ou <span className="text-primary underline">parcourir</span>
            </span>
          </>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => { addFiles(e.target.files); e.target.value = ""; }}
      />
    </div>
  );
}
