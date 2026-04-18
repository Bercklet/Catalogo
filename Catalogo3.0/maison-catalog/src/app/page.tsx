/**
 * PÁGINA PRINCIPAL — Catálogo MAISON
 * ------------------------------------
 * Server Component: los datos se cargan en el servidor.
 * La interactividad (filtros, búsqueda) la maneja CatalogClient.
 *
 * Para migrar a base de datos real:
 *   - Reemplaza `mockProducts` por `await getProducts()` de tu lib/db
 *   - Agrega `export const revalidate = 60;` para ISR cada 60 segundos
 */

import { Suspense } from "react";
import { CatalogClient } from "@/components/CatalogClient";
import { SkeletonCard } from "@/components/SkeletonCard";
import { mockProducts, mockCategories } from "@/constants/mockData";
import { brandConfig } from "@/brand.config";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: `Nueva Colección — ${brandConfig.brand.name}`,
  description: `Explora la nueva colección de ${brandConfig.brand.name}. ${mockProducts.length} piezas seleccionadas.`,
};

// Para producción con DB real, descomentar:
// export const revalidate = 60; // ISR: revalida cada 60s

function CatalogSkeleton() {
  return (
    <div
      className="grid gap-4 sm:gap-5 max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
      style={{ gridTemplateColumns: "repeat(auto-fill, minmax(min(100%,220px), 1fr))" }}
    >
      {Array.from({ length: 8 }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

export default function CatalogPage() {
  // Server-side: aquí iría tu fetch a DB
  const products  = mockProducts;
  const categories = mockCategories;

  return (
    <>
      {/* ——— Hero strip ——— */}
      <section className="bg-brand-primary text-brand-inverse py-14 px-4 text-center">
        <p className="text-xs tracking-[0.3em] uppercase text-brand-accent mb-3">
          Colección Primavera — Verano 2025
        </p>
        <h1 className="font-display text-4xl sm:text-5xl font-light tracking-wide mb-4">
          Nueva Colección
        </h1>
        <p className="text-sm text-white/60 max-w-md mx-auto leading-relaxed">
          Piezas diseñadas para durar más allá de la temporada.
          Cada prenda, una historia de oficio y materiales excepcionales.
        </p>
      </section>

      {/* ——— Catálogo con filtros ——— */}
      <Suspense fallback={<CatalogSkeleton />}>
        <CatalogClient
          initialProducts={products}
          categories={categories}
        />
      </Suspense>
    </>
  );
}
