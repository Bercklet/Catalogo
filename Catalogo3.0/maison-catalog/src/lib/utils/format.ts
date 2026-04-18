/**
 * lib/utils/format.ts
 * -------------------
 * Utilidades de formateo vinculadas a brandConfig.
 */

import { brandConfig } from "@/brand.config";

/**
 * Formatea un precio según la moneda y locale de la marca.
 *
 * @example
 * formatPrice(890000, "COP") → "$890.000"
 * formatPrice(89.99, "USD")  → "$89.99"
 */
export function formatPrice(amount: number, currency?: string): string {
  const curr = currency ?? brandConfig.brand.currency;
  const locale = brandConfig.brand.locale;

  // Para COP evitamos decimales (son precios enteros)
  const fractionDigits = curr === "COP" ? 0 : 2;

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: curr,
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(amount);
}

/**
 * Genera un slug URL-safe a partir de un texto.
 *
 * @example
 * slugify("Vestido Seda Cruda SS25") → "vestido-seda-cruda-ss25"
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Quita tildes
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

/**
 * Calcula el porcentaje de descuento entre dos precios.
 */
export function discountPercentage(originalPrice: number, salePrice: number): number {
  if (originalPrice <= 0) return 0;
  return Math.round(((originalPrice - salePrice) / originalPrice) * 100);
}
