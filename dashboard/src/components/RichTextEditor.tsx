import { useEffect, useRef } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import { toast } from "sonner";
import {
  Bold, Italic, Underline as UnderlineIcon, Strikethrough, Heading2, Heading3,
  List, ListOrdered, Quote, Undo2, Redo2, ImagePlus, Link2, Loader2, FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { uploadImage } from "@/components/ImageUploadField";
import { convertDocxToHtml, notifyDocxResult } from "@/lib/docx";

// Éditeur WYSIWYG (Tiptap) stylé Tailwind — avec insertion d'images par upload

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
}

export function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const docxRef = useRef<HTMLInputElement>(null);
  const uploading = useRef(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({ openOnClick: false, autolink: true }),
      Image.configure({ inline: false }),
    ],
    content: value || "",
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: "prose-tiptap focus:outline-none",
      },
      // Coller une image → upload + insertion
      handlePaste: (_view, event) => insertFilesIfAny(event.clipboardData?.files),
      // Glisser-déposer une image dans l'éditeur → upload + insertion
      handleDrop: (_view, event, _slice, moved) => {
        if (moved) return false;
        return insertFilesIfAny(event.dataTransfer?.files);
      },
    },
    onUpdate: ({ editor: e }) => onChange(e.getHTML()),
  });

  // Synchroniser le contenu si la valeur change extérieurement (changement d'item)
  // ou quand l'éditeur devient disponible (immediatelyRender: false)
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || "", { emitUpdate: false });
    }
  }, [value, editor]);

  function insertFilesIfAny(files: FileList | null | undefined): boolean {
    const images = files ? Array.from(files).filter((f) => f.type.startsWith("image/")) : [];
    if (!images.length) return false;

    // L'upload se fait en tâche de fond ; l'insertion suit la réponse de l'API
    void (async () => {
      for (const file of images) {
        if (uploading.current) return;
        uploading.current = true;
        try {
          const res = await uploadImage(file);
          editor?.chain().focus().setImage({ src: res.url, alt: file.name }).run();
          toast.success("Image insérée dans l'article.");
        } catch (e: any) {
          toast.error(e.message);
        } finally {
          uploading.current = false;
        }
      }
    })();
    return true;
  }

  if (!editor) {
    return (
      <div className="flex h-40 items-center justify-center rounded-md border">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const ToolbarButton = ({
    onClick, active, children, title,
  }: { onClick: () => void; active?: boolean; children: React.ReactNode; title: string }) => (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={cn(
        "flex h-8 w-8 items-center justify-center rounded-md hover:bg-accent",
        active && "bg-primary/10 text-primary",
      )}
    >
      {children}
    </button>
  );

  return (
    <div className="overflow-hidden rounded-lg border bg-background">
      {/* Barre d'outils */}
      <div className="flex flex-wrap items-center gap-0.5 border-b bg-muted/40 px-2 py-1.5">
        <ToolbarButton title="Gras" active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()}>
          <Bold className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton title="Italique" active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()}>
          <Italic className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton title="Souligné" active={editor.isActive("underline")} onClick={() => editor.chain().focus().toggleUnderline().run()}>
          <UnderlineIcon className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton title="Barré" active={editor.isActive("strike")} onClick={() => editor.chain().focus().toggleStrike().run()}>
          <Strikethrough className="h-4 w-4" />
        </ToolbarButton>

        <span className="mx-1 h-5 w-px bg-border" />

        <ToolbarButton title="Titre 2" active={editor.isActive("heading", { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
          <Heading2 className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton title="Titre 3" active={editor.isActive("heading", { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>
          <Heading3 className="h-4 w-4" />
        </ToolbarButton>

        <span className="mx-1 h-5 w-px bg-border" />

        <ToolbarButton title="Liste à puces" active={editor.isActive("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()}>
          <List className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton title="Liste numérotée" active={editor.isActive("orderedList")} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
          <ListOrdered className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton title="Citation" active={editor.isActive("blockquote")} onClick={() => editor.chain().focus().toggleBlockquote().run()}>
          <Quote className="h-4 w-4" />
        </ToolbarButton>

        <span className="mx-1 h-5 w-px bg-border" />

        <ToolbarButton
          title="Insérer un lien"
          active={editor.isActive("link")}
          onClick={() => {
            const url = window.prompt("URL du lien :", editor.getAttributes("link").href ?? "https://");
            if (url === null) return;
            if (url === "") editor.chain().focus().unsetLink().run();
            else editor.chain().focus().setLink({ href: url }).run();
          }}
        >
          <Link2 className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton title="Insérer une image (téléversée)" onClick={() => fileRef.current?.click()}>
          <ImagePlus className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton title="Importer un fichier Word (.docx) — texte, structure et images" onClick={() => docxRef.current?.click()}>
          <FileText className="h-4 w-4" />
        </ToolbarButton>

        <span className="mx-1 h-5 w-px bg-border" />

        <ToolbarButton title="Annuler" onClick={() => editor.chain().focus().undo().run()}>
          <Undo2 className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton title="Rétablir" onClick={() => editor.chain().focus().redo().run()}>
          <Redo2 className="h-4 w-4" />
        </ToolbarButton>
      </div>

      {/* Zone d'édition */}
      <EditorContent
        editor={editor}
        className="tiptap-wrap min-h-48 px-4 py-3 text-sm"
      />
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => { insertFilesIfAny(e.target.files); e.target.value = ""; }}
      />
      <input
        ref={docxRef}
        type="file"
        accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        className="hidden"
        onChange={async (e) => {
          const file = e.target.files?.[0];
          e.target.value = "";
          if (!file) return;
          const restore = editor.getHTML();
          toast.info("Lecture du document Word en cours…");
          try {
            const html = await convertDocxToHtml(file, uploadImage);
            editor.commands.setContent(html, { emitUpdate: false });
            onChange(editor.getHTML());
            notifyDocxResult(html);
          } catch (err: any) {
            // Restauration si échec
            editor.commands.setContent(restore, { emitUpdate: false });
            toast.error(err.message || "Impossible de lire ce fichier Word.");
          }
        }}
      />
    </div>
  );
}
