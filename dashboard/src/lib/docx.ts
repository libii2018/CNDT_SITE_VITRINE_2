// Import d'un fichier Word (.docx) → HTML structuré (titres, listes, images)
// via Mammoth (build browser, chargé en global). Les images extraites du Word
// sont téléversées vers le stockage Laravel et référencées par URL.
import { toast } from "sonner";

declare global {
  interface Window {
    mammoth?: {
      convertToHtml: (input: unknown, options?: unknown) => Promise<{ value: string; messages: unknown[] }>;
      images: {
        imgElement: (func: (image: unknown, message: unknown) => Promise<unknown>) => unknown;
      };
    };
  }
}

async function readImageBlob(image: any): Promise<Blob> {
  if (typeof image.readAsBlob === "function") {
    return image.readAsBlob();
  }
  // Mammoth navigateur récent : getImageAsBase64String ou toBuffer
  const base64 = await image.readAsBase64String?.();
  if (base64) {
    const res = await fetch(`data:${image.contentType};base64,${base64}`);
    return res.blob();
  }
  throw new Error("Image du document non lisible");
}

export async function convertDocxToHtml(
  file: File,
  uploadFile: (f: File) => Promise<{ path: string; url: string }>,
): Promise<string> {
  const mammoth = window.mammoth;
  if (!mammoth) {
    throw new Error("Module de lecture Word indisponible (mammoth.browser.min.js non chargé).");
  }

  const arrayBuffer = await file.arrayBuffer();

  const options = {
    styleMap: [
      "p[style-name='Title'] => h1:fresh",
      "p[style-name='Heading 1'] => h1:fresh",
      "p[style-name='Heading 2'] => h2:fresh",
      "p[style-name='Heading 3'] => h3:fresh",
      "p[style-name='Quote'] => blockquote:fresh",
      "b => strong",
    ],
    convertImage: mammoth.images.imgElement(async (image: any) => {
      try {
        const blob = await readImageBlob(image);
        const name = (file.name || "word").replace(/\.docx$/i, "");
        const ext = (blob.type.split("/")[1] || "png").replace("jpeg", "jpg");
        const imageFile = new File([blob], `${name}-${Date.now()}.${ext}`, { type: blob.type });
        const res = await uploadFile(imageFile);
        return { src: res.url };
      } catch {
        // Image illisible : ignorée (le texte reste)
        return {};
      }
    }),
  };

  const result = await mammoth.convertToHtml({ arrayBuffer }, options);

  if (!result.value || !/<\w/.test(result.value)) {
    throw new Error("Le document ne contient pas de contenu exploitable.");
  }
  return result.value;
}

export function notifyDocxResult(html: string) {
  const imgCount = (html.match(/<img/g) || []).length;
  const hCount = (html.match(/<h[123]/g) || []).length;
  toast.success(
    `Document Word importé${hCount ? ` : ${hCount} titre(s)` : ""}${imgCount ? `, ${imgCount} image(s) téléversée(s)` : ""}.`,
  );
}
