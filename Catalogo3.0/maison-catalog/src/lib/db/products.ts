/**
 * PRODUCTOS — Queries de base de datos
 * --------------------------------------
 * Ruta: src/lib/db/products.ts
 *
 * Reemplaza mockData.ts. Importar en Server Components:
 *   import { getProducts, getProductBySlug } from "@/lib/db/products";
 */

import { supabase, supabaseAdmin } from "./supabaseClient";
import type { Product, ProductCategory, CatalogFilters } from "@/types/product";
import type { Database } from "@/types/database";

type CatalogRow = Database["public"]["Views"]["catalog_view"]["Row"];

/** Convierte una fila de catalog_view al tipo Product del frontend */
function rowToProduct(row: CatalogRow): Product {
  const category = row.category as { id: string; name: string; slug: string };
  const images   = (row.images as Array<{
    id: string; url: string; alt: string; position: number; width?: number; height?: number;
  }>) ?? [];
  const variants = (row.variants as Array<{
    id: string; sku: string; color: { name: string; hex: string };
    size: string; stock: number; price?: number;
  }>) ?? [];

  // Derivar colores y tallas únicas desde variantes
  const colorsMap = new Map<string, { name: string; hex: string }>();
  const sizesSet  = new Set<string>();
  variants.forEach((v) => {
    colorsMap.set(v.color.hex, v.color);
    sizesSet.add(v.size);
  });

  return {
    id:               row.id,
    slug:             row.slug,
    name:             row.name,
    description:      row.description,
    shortDescription: row.short_description ?? undefined,
    material:         row.material ?? undefined,
    careInstructions: row.care_instructions ?? undefined,
    images,
    price:            Number(row.price),
    compareAtPrice:   row.compare_at_price ? Number(row.compare_at_price) : undefined,
    currency:         row.currency,
    variants:         variants.map((v) => ({
      id:    v.id,
      sku:   v.sku,
      color: v.color,
      size:  v.size,
      stock: v.stock,
      price: v.price,
    })),
    availableColors:  Array.from(colorsMap.values()),
    availableSizes:   Array.from(sizesSet),
    category:         { id: category.id, name: category.name, slug: category.slug },
    tags:             row.tags ?? [],
    badges:           (row.badges ?? []) as Product["badges"],
    isActive:         row.is_active,
    publishedAt:      row.published_at,
    updatedAt:        row.updated_at,
    seo: {
      title:       row.seo_title    ?? undefined,
      description: row.seo_description ?? undefined,
      keywords:    row.seo_keywords    ?? undefined,
    },
  };
}

/** Obtener todos los productos activos (catálogo público) */
export async function getProducts(filters?: CatalogFilters): Promise<Product[]> {
  let query = supabase
    .from("catalog_view")
    .select("*")
    .eq("is_active", true)
    .order("published_at", { ascending: false });

  if (filters?.priceMin !== undefined)
    query = query.gte("price", filters.priceMin);
  if (filters?.priceMax !== undefined)
    query = query.lte("price", filters.priceMax);

  const { data, error } = await query;
  if (error) throw new Error(`getProducts: ${error.message}`);
  return (data ?? []).map(rowToProduct);
}

/** Obtener un producto por su slug */
export async function getProductBySlug(slug: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from("catalog_view")
    .select("*")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  if (error) return null;
  return rowToProduct(data);
}

/** Slugs de todos los productos activos (para generateStaticParams) */
export async function getAllProductSlugs(): Promise<string[]> {
  const { data } = await supabase
    .from("products")
    .select("slug")
    .eq("is_active", true);
  return (data ?? []).map((r) => r.slug);
}

/** Obtener categorías activas */
export async function getCategories(): Promise<ProductCategory[]> {
  const { data, error } = await supabase
    .from("categories")
    .select("id, name, slug, parent_id")
    .eq("is_active", true)
    .order("position");

  if (error) throw new Error(`getCategories: ${error.message}`);
  return (data ?? []).map((c) => ({
    id:       c.id,
    name:     c.name,
    slug:     c.slug,
    parentId: c.parent_id ?? undefined,
  }));
}

/** ADMIN — Crear producto completo (con imágenes y variantes) */
export async function createProduct(payload: {
  product:  Database["public"]["Tables"]["products"]["Insert"];
  images:   Omit<Database["public"]["Tables"]["product_images"]["Insert"], "product_id">[];
  variants: Omit<Database["public"]["Tables"]["product_variants"]["Insert"], "product_id">[];
}): Promise<string> {
  // 1. Insertar producto
  const { data: prod, error: prodErr } = await supabaseAdmin
    .from("products")
    .insert(payload.product)
    .select("id")
    .single();
  if (prodErr) throw new Error(`createProduct: ${prodErr.message}`);

  const productId = prod.id;

  // 2. Insertar imágenes
  if (payload.images.length > 0) {
    const { error: imgErr } = await supabaseAdmin
      .from("product_images")
      .insert(payload.images.map((img) => ({ ...img, product_id: productId })));
    if (imgErr) throw new Error(`createProduct images: ${imgErr.message}`);
  }

  // 3. Insertar variantes
  if (payload.variants.length > 0) {
    const { error: varErr } = await supabaseAdmin
      .from("product_variants")
      .insert(payload.variants.map((v) => ({ ...v, product_id: productId })));
    if (varErr) throw new Error(`createProduct variants: ${varErr.message}`);
  }

  return productId;
}

/** ADMIN — Actualizar stock de una variante */
export async function updateVariantStock(
  variantId: string,
  delta: number // positivo = sumar, negativo = restar
): Promise<void> {
  const { error } = await supabaseAdmin.rpc("update_variant_stock" as never, {
    p_variant_id: variantId,
    p_delta:      delta,
  });
  if (error) throw new Error(`updateVariantStock: ${error.message}`);
}
