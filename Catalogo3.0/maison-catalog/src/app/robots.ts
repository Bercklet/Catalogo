/**
 * ROBOTS.TXT
 * -----------
 * Ruta: src/app/robots.ts
 * Next.js genera /robots.txt automáticamente.
 */

import type { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://maison-catalog.vercel.app";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow:     "/",
        disallow:  ["/admin/", "/api/", "/_next/"],
      },
    ],
    sitemap:    `${SITE_URL}/sitemap.xml`,
    host:       SITE_URL,
  };
}
