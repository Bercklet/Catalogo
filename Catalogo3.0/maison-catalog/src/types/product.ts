/**
 * PRODUCT SCHEMA — Catálogo Premium v2.0
 * ----------------------------------------
 * Esquema de datos completo para un producto con soporte
 * para variantes complejas, galería multi-toma y SEO.
 */

/** Imagen con metadatos para accesibilidad y SEO */
export interface ProductImage {
  id: string;
  url: string;
  alt: string;           // Texto alternativo obligatorio (SEO + a11y)
  position: number;      // Orden en la galería (0 = principal)
  width?: number;
  height?: number;
}

/** Variante individual (color × talla × stock) */
export interface ProductVariant {
  id: string;
  sku: string;
  color: {
    name: string;        // "Ivory", "Ónix", "Lavanda"
    hex: string;         // "#E8D5C4"
  };
  size: string;          // "XS" | "S" | "M" | "L" | "XL" | "42" | etc.
  stock: number;         // 0 = agotado
  price?: number;        // Sobreprecio opcional por variante
}

/** Badges de estado del producto */
export type ProductBadge = "nuevo" | "best-seller" | "oferta" | "agotado" | "exclusivo";

/** Categoría del producto */
export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
  parentId?: string;     // Para subcategorías
}

/** Producto completo */
export interface Product {
  // ——— Identificadores ———
  id: string;
  slug: string;          // URL amigable: "vestido-seda-cruda-ss25"

  // ——— Contenido ———
  name: string;
  description: string;
  shortDescription?: string;
  material?: string;
  careInstructions?: string[];

  // ——— Media ———
  images: ProductImage[];

  // ——— Precio ———
  price: number;
  compareAtPrice?: number;   // Precio tachado (para descuentos)
  currency: string;          // "COP" | "USD" | "EUR"

  // ——— Variantes ———
  variants: ProductVariant[];
  availableColors: Array<{ name: string; hex: string }>;
  availableSizes: string[];

  // ——— Clasificación ———
  category: ProductCategory;
  tags: string[];
  badges: ProductBadge[];

  // ——— Metadatos ———
  isActive: boolean;
  publishedAt: string;       // ISO 8601
  updatedAt: string;
  seo?: {
    title?: string;
    description?: string;
    keywords?: string[];
  };
}

/** Filtros del catálogo */
export interface CatalogFilters {
  categories?: string[];
  priceMin?: number;
  priceMax?: number;
  colors?: string[];
  sizes?: string[];
  badges?: ProductBadge[];
  inStockOnly?: boolean;
}

/** Respuesta paginada del catálogo */
export interface CatalogPage {
  products: Product[];
  total: number;
  page: number;
  pageSize: number;
  hasNextPage: boolean;
}
