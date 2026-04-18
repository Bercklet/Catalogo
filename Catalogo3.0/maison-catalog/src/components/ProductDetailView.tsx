"use client";

/**
 * PRODUCT DETAIL VIEW — Con carrito funcional
 * Ruta: src/components/ProductDetailView.tsx  (reemplaza el existente)
 */

import Image from "next/image";
import { useState, useCallback } from "react";
import type { Product, ProductVariant } from "@/types/product";
import { useCartStore } from "@/store/cart.store";
import { formatPrice } from "@/lib/utils/format";

interface ProductDetailViewProps {
  product: Product;
}

export function ProductDetailView({ product }: ProductDetailViewProps) {
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [selectedColor, setSelectedColor]       = useState(product.availableColors[0]);
  const [selectedSize, setSelectedSize]         = useState<string | null>(null);
  const [lightboxOpen, setLightboxOpen]         = useState(false);
  const [justAdded, setJustAdded]               = useState(false);
  const [sizeError, setSizeError]               = useState(false);

  const { addItem } = useCartStore();

  const sortedImages = [...product.images].sort((a, b) => a.position - b.position);
  const currentImage = sortedImages[selectedImageIdx];

  const getVariant = useCallback(
    (colorHex: string, size: string): ProductVariant | undefined =>
      product.variants.find((v) => v.color.hex === colorHex && v.size === size),
    [product.variants]
  );

  const isSizeAvailable = (size: string): boolean => {
    const variant = getVariant(selectedColor.hex, size);
    return (variant?.stock ?? 0) > 0;
  };

  const selectedVariant = selectedSize
    ? getVariant(selectedColor.hex, selectedSize)
    : undefined;

  const currentPrice = selectedVariant?.price ?? product.price;
  const stockLevel   = selectedVariant?.stock ?? 0;
  const isLowStock   = stockLevel > 0 && stockLevel <= 5;

  const handleAddToCart = () => {
    if (!selectedSize) {
      setSizeError(true);
      setTimeout(() => setSizeError(false), 2000);
      return;
    }

    addItem(product, selectedColor, selectedSize);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2500);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start">

      {/* ——— GALERÍA ——— */}
      <div className="flex flex-col gap-3">
        <div
          className="relative overflow-hidden rounded-lg bg-brand-secondary cursor-zoom-in"
          style={{ aspectRatio: "4 / 5" }}
          onClick={() => setLightboxOpen(true)}
          role="button"
          aria-label="Ampliar imagen"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && setLightboxOpen(true)}
        >
          {currentImage && (
            <Image
              src={currentImage.url}
              alt={currentImage.alt}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          )}
        </div>

        {/* Thumbnails */}
        <div className="flex gap-2">
          {sortedImages.map((image, idx) => (
            <button
              key={image.id}
              onClick={() => setSelectedImageIdx(idx)}
              className={`relative flex-1 overflow-hidden rounded-md border-2 transition-all duration-200 ${
                idx === selectedImageIdx
                  ? "border-brand-primary"
                  : "border-transparent opacity-60 hover:opacity-100"
              }`}
              style={{ aspectRatio: "1 / 1" }}
              aria-label={`Ver ángulo ${idx + 1}`}
            >
              <Image
                src={image.url}
                alt={image.alt}
                fill
                className="object-cover"
                sizes="80px"
              />
            </button>
          ))}
        </div>
      </div>

      {/* ——— INFO ——— */}
      <div className="flex flex-col gap-5">
        <div>
          <p className="text-xs text-brand-muted uppercase tracking-widest mb-2">
            {product.category.name}
          </p>
          <h1 className="font-display text-3xl lg:text-4xl font-light text-brand-primary leading-tight">
            {product.name}
          </h1>
        </div>

        {/* Precio */}
        <div className="flex items-baseline gap-3">
          <span className="text-2xl font-medium text-brand-primary">
            {formatPrice(currentPrice, product.currency)}
          </span>
          {product.compareAtPrice && (
            <span className="text-base text-brand-muted line-through">
              {formatPrice(product.compareAtPrice, product.currency)}
            </span>
          )}
        </div>

        <p className="text-sm text-gray-600 leading-relaxed border-t border-brand-border pt-5">
          {product.description}
        </p>

        {/* ——— Selector de color ——— */}
        <div>
          <p className="text-xs text-brand-muted uppercase tracking-wider mb-3">
            Color — <span className="text-brand-primary font-medium">{selectedColor.name}</span>
          </p>
          <div className="flex gap-2.5 flex-wrap" role="radiogroup" aria-label="Color">
            {product.availableColors.map((color) => (
              <button
                key={color.hex}
                onClick={() => { setSelectedColor(color); setSelectedSize(null); }}
                className={`w-8 h-8 rounded-full transition-all duration-200 border ${
                  selectedColor.hex === color.hex
                    ? "ring-2 ring-brand-primary ring-offset-2"
                    : "border-black/10 hover:ring-1 hover:ring-brand-muted hover:ring-offset-1"
                }`}
                style={{ backgroundColor: color.hex }}
                aria-label={color.name}
                aria-pressed={selectedColor.hex === color.hex}
              />
            ))}
          </div>
        </div>

        {/* ——— Selector de talla ——— */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className={`text-xs uppercase tracking-wider ${sizeError ? "text-status-error font-medium" : "text-brand-muted"}`}>
              {sizeError ? "⚠ Selecciona una talla" : "Talla"}
            </p>
          </div>
          <div className="flex gap-2 flex-wrap" role="radiogroup" aria-label="Talla">
            {product.availableSizes.map((size) => {
              const available = isSizeAvailable(size);
              return (
                <button
                  key={size}
                  onClick={() => { if (available) { setSelectedSize(size); setSizeError(false); } }}
                  disabled={!available}
                  className={`px-4 py-2 text-sm border rounded-sm transition-all duration-200 ${
                    !available
                      ? "border-brand-border text-brand-muted opacity-40 cursor-not-allowed"
                      : selectedSize === size
                      ? "bg-brand-primary text-brand-inverse border-brand-primary"
                      : sizeError
                      ? "border-status-error text-brand-primary animate-pulse"
                      : "bg-white text-brand-primary border-brand-border hover:border-brand-primary"
                  }`}
                  aria-label={`Talla ${size}${!available ? " — agotado" : ""}`}
                  aria-pressed={selectedSize === size}
                >
                  {size}
                </button>
              );
            })}
          </div>
        </div>

        {/* Stock bajo */}
        {isLowStock && selectedSize && (
          <p className="text-xs text-status-warning font-medium">
            ¡Solo quedan {stockLevel} unidades!
          </p>
        )}

        {/* ——— CTA ——— */}
        <button
          onClick={handleAddToCart}
          className={`w-full h-12 rounded-md text-sm font-medium tracking-widest uppercase transition-all duration-300 ${
            justAdded
              ? "bg-status-success text-white"
              : sizeError
              ? "bg-status-error text-white"
              : "bg-brand-primary text-brand-inverse hover:bg-gray-800 hover:-translate-y-0.5 active:scale-[0.98]"
          }`}
          aria-live="polite"
        >
          {justAdded
            ? "✓ Agregado al carrito"
            : sizeError
            ? "Selecciona una talla"
            : "Agregar al carrito"}
        </button>

        <p className="text-center text-xs text-brand-muted">
          Envío gratuito en compras mayores a {formatPrice(500000, product.currency)}
        </p>

        {/* Detalles acordeón */}
        {product.material && (
          <details className="border-t border-brand-border pt-4 group">
            <summary className="text-sm font-medium text-brand-primary cursor-pointer select-none list-none flex justify-between items-center">
              Material y composición
              <span className="text-brand-muted group-open:rotate-180 transition-transform">↓</span>
            </summary>
            <p className="mt-3 text-sm text-gray-600 leading-relaxed">{product.material}</p>
          </details>
        )}
        {product.careInstructions && product.careInstructions.length > 0 && (
          <details className="border-t border-brand-border pt-4 group">
            <summary className="text-sm font-medium text-brand-primary cursor-pointer select-none list-none flex justify-between items-center">
              Cuidado y mantenimiento
              <span className="text-brand-muted group-open:rotate-180 transition-transform">↓</span>
            </summary>
            <ul className="mt-3 space-y-1.5">
              {product.careInstructions.map((ins, i) => (
                <li key={i} className="text-sm text-gray-600 flex gap-2">
                  <span className="text-brand-accent flex-shrink-0">—</span>
                  {ins}
                </li>
              ))}
            </ul>
          </details>
        )}
      </div>

      {/* ——— LIGHTBOX ——— */}
      {lightboxOpen && currentImage && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightboxOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Vista ampliada"
        >
          <button
            className="absolute top-4 right-4 text-white text-2xl w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
            onClick={() => setLightboxOpen(false)}
            aria-label="Cerrar"
          >
            ✕
          </button>
          <div
            className="relative max-w-2xl w-full"
            style={{ aspectRatio: "4 / 5" }}
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={currentImage.url}
              alt={currentImage.alt}
              fill
              className="object-contain"
              sizes="800px"
            />
          </div>
        </div>
      )}
    </div>
  );
}
