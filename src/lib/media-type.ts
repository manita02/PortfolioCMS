export type MediaKind = "image" | "pdf";

const IMAGE_EXT =
  /\.(avif|bmp|gif|jpe?g|png|svg|webp)$/i;
const PDF_EXT = /\.pdf$/i;

/** Detecta imagen o PDF a partir de la URL (ignora query/hash). */
export function detectMediaKind(
  src: string,
  explicit?: MediaKind | "auto",
): MediaKind {
  if (explicit && explicit !== "auto") return explicit;

  const path = src.split(/[?#]/)[0] ?? src;
  if (PDF_EXT.test(path)) return "pdf";
  if (IMAGE_EXT.test(path)) return "image";

  // Fallback prudente: rutas de storage sin extensión clara suelen ser imagen
  return "image";
}

export function getMediaFilename(src: string, fallback = "documento") {
  try {
    const path = new URL(src).pathname;
    const name = path.split("/").pop();
    return name && name.length > 0 ? decodeURIComponent(name) : fallback;
  } catch {
    const name = src.split("/").pop()?.split(/[?#]/)[0];
    return name && name.length > 0 ? name : fallback;
  }
}
