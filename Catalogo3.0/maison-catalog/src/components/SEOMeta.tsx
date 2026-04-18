/**
 * SEO META — Componente reutilizable de metadatos
 * -------------------------------------------------
 * Ruta: src/components/SEOMeta.tsx
 *
 * Uso en cualquier page.tsx (Server Component):
 *
 *   export const metadata = buildProductMetadata(product);
 *   export const metadata = buildCatalogMetadata();
 *
 * La og:image apunta a /api/og que genera la imagen dinámicamente.
 */

import type { Metadata } from "next";
import type { Product }  from "@/types/product";
import { brandConfig }   from "@/brand.config";

const SITE_URL  = process.env.NEXT_PUBLIC_SITE_URL ?? "https://maison-catalog.vercel.app";
const SITE_NAME = brandConfig.brand.name;

/** Metadatos base compartidos por todas las páginas */
const baseMetadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  authors:      [{ name: SITE_NAME }],
  creator:      SITE_NAME,
  publisher:    SITE_NAME,
  formatDetection: { telephone: false },
  icons: {
    icon:    [
      { url: "/favicon.ico",   sizes: "any"   },
      { url: "/icon.svg",      type:  "image/svg+xml" },
    ],
    apple:   "/apple-touch-icon.png",
    shortcut: "/favicon-16x16.png",
  },
  manifest: "/manifest.json",
};

/** Metadatos para la página principal del catálogo */
export function buildCatalogMetadata(productCount?: number): Metadata {
  const title       = `${SITE_NAME} — ${brandConfig.brand.tagline}`;
  const description = `Descubre la nueva colección de ${SITE_NAME}. ${productCount ? `${productCount} piezas seleccionadas. ` : ""}Prêt-à-porter de lujo, accesorios y calzado artesanal colombiano.`;
  const ogImage     = `${SITE_URL}/api/og?title=${encodeURIComponent(title)}`;

  return {
    ...baseMetadata,
    title: {
      default:  title,
      template: `%s — ${SITE_NAME}`,
    },
    description,
    keywords: [
      "moda de lujo Colombia",
      "prêt-à-porter Bogotá",
      "ropa artesanal colombiana",
      "accesorios premium",
      SITE_NAME.toLowerCase(),
    ],
    openGraph: {
      type:        "website",
      url:         SITE_URL,
      siteName:    SITE_NAME,
      title,
      description,
      locale:      "es_CO",
      images: [{
        url:    ogImage,
        width:  1200,
        height: 630,
        alt:    title,
      }],
    },
    twitter: {
      card:        "summary_large_image",
      title,
      description,
      images:      [ogImage],
      creator:     `@${SITE_NAME.toLowerCase()}`,
    },
    alternates: {
      canonical: SITE_URL,
    },
  };
}

/** Metadatos dinámicos para una página de producto */
export function buildProductMetadata(product: Product): Metadata {
  const title       = product.seo?.title       ?? `${product.name} — ${SITE_NAME}`;
  const description = product.seo?.description ?? product.shortDescription ?? product.description.slice(0, 155);
  const keywords    = product.seo?.keywords    ?? product.tags;
  const mainImage   = product.images.find((img) => img.position === 0);
  const productUrl  = `${SITE_URL}/products/${product.slug}`;

  // OG Image: usa la imagen real del producto
  const ogImage = mainImage?.url ?? `${SITE_URL}/api/og?title=${encodeURIComponent(product.name)}`;

  return {
    ...baseMetadata,
    title,
    description,
    keywords,
    openGraph: {
      type:        "website", // "product" no es estándar en Next.js Metadata
      url:         productUrl,
      siteName:    SITE_NAME,
      title,
      description,
      locale:      "es_CO",
      images: [{
        url:    ogImage,
        width:  mainImage?.width  ?? 800,
        height: mainImage?.height ?? 1000,
        alt:    mainImage?.alt    ?? product.name,
      }],
    },
    twitter: {
      card:        "summary_large_image",
      title,
      description,
      images:      [ogImage],
    },
    alternates: {
      canonical: productUrl,
    },
    // Datos estructurados JSON-LD se agregan en el componente de página
  };
}

/**
 * Componente de datos estructurados JSON-LD para producto.
 * Mejora la apariencia en resultados de búsqueda de Google.
 *
 * Uso: <ProductJsonLd product={product} />
 */
export function ProductJsonLd({ product }: { product: Product }) {
  const mainImage = product.images.find((img) => img.position === 0);

  const jsonLd = {
    "@context":   "https://schema.org",
    "@type":      "Product",
    name:         product.name,
    description:  product.description,
    image:        product.images.map((img) => img.url),
    sku:          product.variants[0]?.sku,
    brand: {
      "@type": "Brand",
      name:    brandConfig.brand.name,
    },
    offers: {
      "@type":         "Offer",
      url:             `${SITE_URL}/products/${product.slug}`,
      priceCurrency:   product.currency,
      price:           product.price.toString(),
      priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      availability:    product.variants.some((v) => v.stock > 0)
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      seller: {
        "@type": "Organization",
        name:    brandConfig.brand.name,
      },
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
