/**
 * PÁGINA DE DETALLE DE PRODUCTO
 * --------------------------------
 * Server Component con generateStaticParams para SSG.
 * Genera rutas estáticas para cada producto en build time → velocidad máxima.
 */

import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { ProductDetailView } from "@/components/ProductDetailView";
import { ProductCard } from "@/components/ProductCard";
import { mockProducts } from "@/constants/mockData";
import { brandConfig } from "@/brand.config";

interface PageProps {
  params: { slug: string };
}

/* ——— Pre-genera todas las páginas en build time ——— */
export function generateStaticParams() {
  return mockProducts.map((p) => ({ slug: p.slug }));
}

/* ——— Metadatos dinámicos por producto ——— */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const product = mockProducts.find((p) => p.slug === params.slug);
  if (!product) return { title: "Producto no encontrado" };

  const mainImage = product.images.find((img) => img.position === 0);

  return {
    title: product.seo?.title ?? `${product.name} — ${brandConfig.brand.name}`,
    description: product.seo?.description ?? product.shortDescription ?? product.description.slice(0, 155),
    keywords: product.seo?.keywords ?? product.tags,
    openGraph: {
      title: product.name,
      description: product.shortDescription ?? product.description.slice(0, 155),
      images: mainImage ? [{ url: mainImage.url, alt: mainImage.alt }] : [],
    },
  };
}

export default function ProductDetailPage({ params }: PageProps) {
  const product = mockProducts.find((p) => p.slug === params.slug);

  if (!product) notFound();

  /* Productos relacionados: misma categoría, excluyendo el actual, máx 4 */
  const related = mockProducts
    .filter((p) => p.category.id === product.category.id && p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="bg-brand-secondary min-h-screen">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* ——— Breadcrumb ——— */}
        <nav className="flex items-center gap-2 text-xs text-brand-muted mb-8" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-brand-primary transition-colors">
            Inicio
          </Link>
          <span>/</span>
          <Link
            href={`/?category=${product.category.slug}`}
            className="hover:text-brand-primary transition-colors"
          >
            {product.category.name}
          </Link>
          <span>/</span>
          <span className="text-brand-primary font-medium truncate max-w-[200px]">
            {product.name}
          </span>
        </nav>

        {/* ——— Vista de detalle ——— */}
        <div className="bg-brand-surface rounded-xl border border-brand-border p-6 sm:p-10 mb-16 animate-fade-in">
          <ProductDetailView product={product} />
        </div>

        {/* ——— Productos relacionados ——— */}
        {related.length > 0 && (
          <section>
            <div className="flex items-baseline justify-between mb-6">
              <h2 className="font-display text-2xl font-light text-brand-primary">
                También te puede interesar
              </h2>
              <Link
                href="/"
                className="text-xs text-brand-accent underline underline-offset-2 hover:text-brand-primary transition-colors"
              >
                Ver todo
              </Link>
            </div>
            <div
              className="grid gap-4 sm:gap-5"
              style={{ gridTemplateColumns: "repeat(auto-fill, minmax(min(100%,200px), 1fr))" }}
            >
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
