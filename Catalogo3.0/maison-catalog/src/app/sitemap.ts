/**
 * SITEMAP DINÁMICO
 * -----------------
 * Ruta: src/app/sitemap.ts
 *
 * Next.js genera /sitemap.xml automáticamente desde este archivo.
 * En producción lee los slugs desde Supabase.
 * En desarrollo (si Supabase no está configurado), usa mockProducts.
 */

import type { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://maison-catalog.vercel.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Importar slugs (con fallback a mock para desarrollo)
  let productSlugs: string[] = [];

  try {
    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
      const { getAllProductSlugs } = await import("@/lib/db/products");
      productSlugs = await getAllProductSlugs();
    } else {
      const { mockProducts } = await import("@/constants/mockData");
      productSlugs = mockProducts.map((p) => p.slug);
    }
  } catch {
    const { mockProducts } = await import("@/constants/mockData");
    productSlugs = mockProducts.map((p) => p.slug);
  }

  // Páginas estáticas
  const staticPages: MetadataRoute.Sitemap = [
    {
      url:              SITE_URL,
      lastModified:     new Date(),
      changeFrequency:  "daily",
      priority:         1.0,
    },
    {
      url:              `${SITE_URL}/productos`,
      lastModified:     new Date(),
      changeFrequency:  "daily",
      priority:         0.9,
    },
  ];

  // Páginas de producto
  const productPages: MetadataRoute.Sitemap = productSlugs.map((slug) => ({
    url:             `${SITE_URL}/products/${slug}`,
    lastModified:    new Date(),
    changeFrequency: "weekly" as const,
    priority:        0.8,
  }));

  return [...staticPages, ...productPages];
}
