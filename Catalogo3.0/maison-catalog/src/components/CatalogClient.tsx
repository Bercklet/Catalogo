"use client";

import { useCatalog } from "@/hooks/useCatalog";
import { ProductCard } from "@/components/ProductCard";
import { FilterBar } from "@/components/FilterBar";
import { SkeletonCard } from "@/components/SkeletonCard";
import type { Product, ProductCategory } from "@/types/product";

interface CatalogClientProps {
  initialProducts: Product[];
  categories: ProductCategory[];
}

export function CatalogClient({ initialProducts, categories }: CatalogClientProps) {
  const { products, total, filters, sort, search, setFilters, setSort, setSearch } =
    useCatalog(initialProducts);

  return (
    <>
      <FilterBar
        categories={categories}
        filters={filters}
        sort={sort}
        search={search}
        total={total}
        onFilter={setFilters}
        onSort={setSort}
        onSearch={setSearch}
      />

      <main className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {products.length === 0 ? (
          /* Estado vacío */
          <div className="text-center py-24">
            <p className="font-display text-3xl font-light text-brand-primary mb-3">
              Sin resultados
            </p>
            <p className="text-sm text-brand-muted mb-6">
              Intenta con otros filtros o términos de búsqueda.
            </p>
            <button
              onClick={() => { setFilters({}); setSearch(""); }}
              className="px-6 py-2.5 border border-brand-primary text-sm text-brand-primary rounded-md hover:bg-brand-primary hover:text-brand-inverse transition-all duration-200"
            >
              Limpiar filtros
            </button>
          </div>
        ) : (
          <div
            className="grid gap-4 sm:gap-5"
            style={{
              gridTemplateColumns: "repeat(auto-fill, minmax(min(100%,220px), 1fr))",
            }}
          >
            {products.map((product, i) => (
              <div
                key={product.id}
                className="animate-slide-up"
                style={{ animationDelay: `${Math.min(i * 40, 320)}ms`, animationFillMode: "both" }}
              >
                <ProductCard product={product} priority={i < 4} />
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
