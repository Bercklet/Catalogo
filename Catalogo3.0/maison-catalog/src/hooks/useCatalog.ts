"use client";

import { useState, useMemo } from "react";
import type { Product, CatalogFilters } from "@/types/product";

type SortValue = "date_desc" | "price_asc" | "price_desc" | "popularity_desc";

export function useCatalog(allProducts: Product[]) {
  const [filters, setFilters]   = useState<CatalogFilters>({});
  const [sort, setSort]         = useState<SortValue>("date_desc");
  const [search, setSearch]     = useState("");

  const filtered = useMemo(() => {
    let result = allProducts.filter((p) => p.isActive);

    // Búsqueda por texto
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.tags.some((t) => t.includes(q))
      );
    }

    // Filtro por categoría
    if (filters.categories?.length) {
      result = result.filter((p) =>
        filters.categories!.includes(p.category.slug)
      );
    }

    // Filtro por rango de precio
    if (filters.priceMin !== undefined) {
      result = result.filter((p) => p.price >= filters.priceMin!);
    }
    if (filters.priceMax !== undefined) {
      result = result.filter((p) => p.price <= filters.priceMax!);
    }

    // Filtro solo en stock
    if (filters.inStockOnly) {
      result = result.filter((p) =>
        p.variants.some((v) => v.stock > 0)
      );
    }

    // Filtro por color
    if (filters.colors?.length) {
      result = result.filter((p) =>
        p.availableColors.some((c) => filters.colors!.includes(c.hex))
      );
    }

    // Ordenamiento
    result = [...result].sort((a, b) => {
      switch (sort) {
        case "price_asc":  return a.price - b.price;
        case "price_desc": return b.price - a.price;
        case "popularity_desc":
          return (b.badges.includes("best-seller") ? 1 : 0) -
                 (a.badges.includes("best-seller") ? 1 : 0);
        case "date_desc":
        default:
          return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
      }
    });

    return result;
  }, [allProducts, filters, sort, search]);

  return {
    products: filtered,
    total: filtered.length,
    filters,
    setFilters,
    sort,
    setSort,
    search,
    setSearch,
  };
}
