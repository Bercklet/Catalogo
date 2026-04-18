"use client";

import type { ProductCategory, CatalogFilters } from "@/types/product";
import { brandConfig } from "@/brand.config";

interface FilterBarProps {
  categories:  ProductCategory[];
  filters:     CatalogFilters;
  sort:        string;
  search:      string;
  total:       number;
  onFilter:    (f: CatalogFilters) => void;
  onSort:      (s: string) => void;
  onSearch:    (s: string) => void;
}

export function FilterBar({
  categories, filters, sort, search, total, onFilter, onSort, onSearch,
}: FilterBarProps) {
  const activeCategory = filters.categories?.[0];

  const toggleCategory = (slug: string) => {
    onFilter({
      ...filters,
      categories: activeCategory === slug ? [] : [slug],
    });
  };

  return (
    <div className="border-b border-brand-border bg-brand-surface sticky top-[57px] z-40">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">

        {/* Filtros de categoría */}
        <div className="flex gap-2 flex-wrap items-center">
          <button
            onClick={() => onFilter({ ...filters, categories: [] })}
            className={`px-3.5 py-1.5 rounded-full text-xs border transition-all duration-200 ${
              !activeCategory
                ? "bg-brand-primary text-brand-inverse border-brand-primary"
                : "bg-brand-surface text-brand-muted border-brand-border hover:border-brand-primary hover:text-brand-primary"
            }`}
          >
            Todos
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => toggleCategory(cat.slug)}
              className={`px-3.5 py-1.5 rounded-full text-xs border transition-all duration-200 ${
                activeCategory === cat.slug
                  ? "bg-brand-primary text-brand-inverse border-brand-primary"
                  : "bg-brand-surface text-brand-muted border-brand-border hover:border-brand-primary hover:text-brand-primary"
              }`}
            >
              {cat.name}
            </button>
          ))}
          <button
            onClick={() => onFilter({ ...filters, inStockOnly: !filters.inStockOnly })}
            className={`px-3.5 py-1.5 rounded-full text-xs border transition-all duration-200 ${
              filters.inStockOnly
                ? "bg-brand-accent text-white border-brand-accent"
                : "bg-brand-surface text-brand-muted border-brand-border hover:border-brand-accent hover:text-brand-accent"
            }`}
          >
            Solo disponibles
          </button>
        </div>

        {/* Derecha: búsqueda + ordenar + contador */}
        <div className="flex items-center gap-3 flex-shrink-0">
          {/* Búsqueda */}
          <div className="relative">
            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-brand-muted text-xs">⌕</span>
            <input
              type="search"
              placeholder="Buscar..."
              value={search}
              onChange={(e) => onSearch(e.target.value)}
              className="pl-7 pr-3 py-1.5 text-xs border border-brand-border rounded-md bg-brand-surface text-brand-text outline-none focus:border-brand-accent transition-colors w-36"
            />
          </div>

          {/* Ordenar */}
          <select
            value={sort}
            onChange={(e) => onSort(e.target.value)}
            className="text-xs border border-brand-border rounded-md px-2.5 py-1.5 bg-brand-surface text-brand-text outline-none focus:border-brand-accent transition-colors cursor-pointer"
          >
            {brandConfig.catalog.sortOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>

          <span className="text-xs text-brand-muted hidden sm:block whitespace-nowrap">
            {total} {total === 1 ? "pieza" : "piezas"}
          </span>
        </div>
      </div>
    </div>
  );
}
