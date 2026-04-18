"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { Product } from "@/types/product";
import { brandConfig } from "@/brand.config";
import { formatPrice } from "@/lib/utils/format";

interface ProductCardProps {
  product: Product;
  /** Prioridad de carga de imagen (true para above-the-fold) */
  priority?: boolean;
}

/**
 * ProductCard — Tarjeta principal del grid de catálogo.
 *
 * Características:
 * - Aspect ratio forzado 4:5 con object-cover para simetría total en el grid
 * - Efecto hover suave con scale en imagen
 * - Selector de color inline (sin navegar al detalle)
 * - Skeleton de carga en imagen (state: isLoading)
 * - Soporte completo de badges (Nuevo, Best Seller, Oferta, Agotado)
 */
export function ProductCard({ product, priority = false }: ProductCardProps) {
  const [activeColor, setActiveColor] = useState(product.availableColors[0]);
  const [isImageLoading, setIsImageLoading] = useState(true);

  const mainImage = product.images.find((img) => img.position === 0);
  const hasDiscount = !!product.compareAtPrice;
  const isOutOfStock = product.badges.includes("agotado");

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group block bg-brand-surface rounded-lg border border-brand-border overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent"
      aria-label={`Ver ${product.name}`}
    >
      {/* ——— Contenedor de imagen con aspect-ratio fijo ——— */}
      <div
        className="relative overflow-hidden bg-brand-secondary"
        style={{ aspectRatio: brandConfig.ui.productImageRatio.card }}
      >
        {/* Skeleton de carga */}
        {isImageLoading && (
          <div className="absolute inset-0 bg-gradient-to-r from-brand-secondary via-brand-border to-brand-secondary animate-pulse" />
        )}

        {mainImage && (
          <Image
            src={mainImage.url}
            alt={mainImage.alt}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className={`object-cover transition-transform duration-500 group-hover:scale-105 ${
              isImageLoading ? "opacity-0" : "opacity-100"
            }`}
            priority={priority}
            onLoad={() => setIsImageLoading(false)}
          />
        )}

        {/* ——— Badges de estado ——— */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.badges.includes("nuevo") && (
            <BadgeTag variant="new">Nuevo</BadgeTag>
          )}
          {product.badges.includes("best-seller") && (
            <BadgeTag variant="bestseller">Best Seller</BadgeTag>
          )}
          {hasDiscount && (
            <BadgeTag variant="sale">
              -{Math.round(((product.compareAtPrice! - product.price) / product.compareAtPrice!) * 100)}%
            </BadgeTag>
          )}
          {isOutOfStock && (
            <BadgeTag variant="soldout">Agotado</BadgeTag>
          )}
        </div>
      </div>

      {/* ——— Info del producto ——— */}
      <div className="p-3.5">
        {/* Categoría */}
        <p className="text-xs text-brand-muted uppercase tracking-widest mb-1">
          {product.category.name}
        </p>

        {/* Nombre — fuente display */}
        <h3 className="font-display text-base font-normal text-brand-primary leading-snug mb-3">
          {product.name}
        </h3>

        {/* Footer: precio + swatches de color */}
        <div className="flex items-center justify-between">
          {/* Precio */}
          <div className="flex items-baseline gap-2">
            <span className="text-sm font-medium text-brand-primary">
              {formatPrice(product.price, product.currency)}
            </span>
            {hasDiscount && (
              <span className="text-xs text-brand-muted line-through">
                {formatPrice(product.compareAtPrice!, product.currency)}
              </span>
            )}
          </div>

          {/* Swatches de color (max 4 visibles) */}
          <div
            className="flex gap-1"
            onClick={(e) => e.preventDefault()} // Evita navegar al hacer click en swatches
            role="group"
            aria-label="Colores disponibles"
          >
            {product.availableColors.slice(0, 4).map((color) => (
              <button
                key={color.hex}
                className={`w-3.5 h-3.5 rounded-full border transition-all duration-200 ${
                  activeColor.hex === color.hex
                    ? "ring-1 ring-brand-primary ring-offset-1"
                    : "border-black/10"
                }`}
                style={{ backgroundColor: color.hex }}
                title={color.name}
                aria-label={color.name}
                aria-pressed={activeColor.hex === color.hex}
                onClick={() => setActiveColor(color)}
              />
            ))}
            {product.availableColors.length > 4 && (
              <span className="text-xs text-brand-muted self-center ml-0.5">
                +{product.availableColors.length - 4}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

// ——— Subcomponente Badge ———

type BadgeVariant = "new" | "bestseller" | "sale" | "soldout";

const badgeStyles: Record<BadgeVariant, string> = {
  new:        "bg-brand-primary text-brand-inverse",
  bestseller: "bg-brand-border text-brand-primary",
  sale:       "bg-brand-accent text-white",
  soldout:    "bg-white/80 text-brand-muted border border-brand-border",
};

function BadgeTag({
  variant,
  children,
}: {
  variant: BadgeVariant;
  children: React.ReactNode;
}) {
  return (
    <span
      className={`inline-block px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider rounded-sm ${badgeStyles[variant]}`}
    >
      {children}
    </span>
  );
}
