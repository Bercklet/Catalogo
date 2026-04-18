/**
 * CLOUDINARY — Utilidades de subida de imágenes
 * -----------------------------------------------
 * Ruta: src/lib/utils/cloudinary.ts
 *
 * Instalación: npm install cloudinary
 *
 * Variables requeridas en .env.local:
 *   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=tu_cloud_name
 *   CLOUDINARY_API_KEY=tu_api_key
 *   CLOUDINARY_API_SECRET=tu_api_secret
 *   CLOUDINARY_UPLOAD_PRESET=maison_products   ← Crear en Cloudinary Dashboard
 *
 * Para crear el Upload Preset en Cloudinary:
 *   Dashboard → Settings → Upload → Upload Presets → Add preset
 *   Name: maison_products | Signing mode: Unsigned
 *   Folder: maison/products | Transformations: f_auto, q_auto
 */

/** Resultado de una subida exitosa */
export interface CloudinaryUploadResult {
  publicId:  string;  // "maison/products/vestido-seda-abc123"
  url:       string;  // URL de Cloudinary sin transformaciones
  secureUrl: string;  // HTTPS — usar siempre este
  width:     number;
  height:    number;
  format:    string;  // "jpg" | "webp" | etc.
  bytes:     number;
}

/** Sube un archivo File al preset de Cloudinary (desde el browser) */
export async function uploadImageToCloudinary(
  file: File,
  options?: {
    folder?:       string;  // Sobrescribir carpeta del preset
    productSlug?:  string;  // Para nombrar el archivo
    position?:     number;  // 0 = principal
  }
): Promise<CloudinaryUploadResult> {
  const cloudName   = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET ?? "maison_products";

  if (!cloudName) throw new Error("Falta NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME");

  // Validaciones
  const MAX_SIZE = 10 * 1024 * 1024; // 10MB
  const ALLOWED  = ["image/jpeg", "image/png", "image/webp", "image/avif"];

  if (file.size > MAX_SIZE)
    throw new Error(`Imagen muy grande: ${(file.size / 1024 / 1024).toFixed(1)}MB. Máximo 10MB.`);
  if (!ALLOWED.includes(file.type))
    throw new Error(`Formato no soportado: ${file.type}. Usa JPG, PNG o WebP.`);

  // Construir FormData
  const formData = new FormData();
  formData.append("file",          file);
  formData.append("upload_preset", uploadPreset);

  if (options?.folder) {
    formData.append("folder", options.folder);
  }

  // Nombre del archivo público
  if (options?.productSlug) {
    const posLabel = options.position !== undefined ? `-${options.position}` : "";
    formData.append(
      "public_id",
      `maison/products/${options.productSlug}${posLabel}-${Date.now()}`
    );
  }

  // Transformaciones automáticas
  formData.append("transformation", "f_auto,q_auto,c_limit,w_2000,h_2500");

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    { method: "POST", body: formData }
  );

  if (!response.ok) {
    const err = await response.json();
    throw new Error(`Cloudinary error: ${err.error?.message ?? response.statusText}`);
  }

  const data = await response.json();

  return {
    publicId:  data.public_id,
    url:       data.url,
    secureUrl: data.secure_url,
    width:     data.width,
    height:    data.height,
    format:    data.format,
    bytes:     data.bytes,
  };
}

/**
 * Genera URL optimizada de Cloudinary con transformaciones.
 *
 * @example
 * getCloudinaryUrl("maison/products/vestido-abc", { w: 800, ar: "4:5" })
 * → "https://res.cloudinary.com/TU_CLOUD/image/upload/f_auto,q_auto,w_800,ar_4:5/maison/products/vestido-abc"
 */
export function getCloudinaryUrl(
  publicId: string,
  transforms?: {
    w?:  number;
    h?:  number;
    ar?: string;     // "4:5" | "1:1"
    q?:  number;     // 1-100, default auto
    f?:  string;     // "auto" | "webp" | "avif"
    c?:  string;     // "fill" | "limit" | "pad"
  }
): string {
  const cloud = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  if (!cloud) return publicId;

  const t = transforms ?? {};
  const parts: string[] = [
    `f_${t.f ?? "auto"}`,
    `q_${t.q ?? "auto"}`,
  ];

  if (t.c)  parts.push(`c_${t.c}`);
  if (t.w)  parts.push(`w_${t.w}`);
  if (t.h)  parts.push(`h_${t.h}`);
  if (t.ar) parts.push(`ar_${t.ar.replace(":", "_")}`); // "4:5" → "ar_4_5"

  return `https://res.cloudinary.com/${cloud}/image/upload/${parts.join(",")}/v1/${publicId}`;
}

/** Sube múltiples imágenes en paralelo con límite de concurrencia */
export async function uploadMultipleImages(
  files: File[],
  productSlug: string
): Promise<CloudinaryUploadResult[]> {
  const CONCURRENCY = 3; // Máximo 3 uploads simultáneos
  const results: CloudinaryUploadResult[] = [];

  for (let i = 0; i < files.length; i += CONCURRENCY) {
    const batch = files.slice(i, i + CONCURRENCY);
    const batchResults = await Promise.all(
      batch.map((file, idx) =>
        uploadImageToCloudinary(file, {
          productSlug,
          position: i + idx,
        })
      )
    );
    results.push(...batchResults);
  }

  return results;
}
