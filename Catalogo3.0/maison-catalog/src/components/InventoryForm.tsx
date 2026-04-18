"use client";

import Image from "next/image";
import { useState, useRef, useCallback } from "react";
import type { Product, ProductBadge } from "@/types/product";
import { brandConfig } from "@/brand.config";
import { formatPrice } from "@/lib/utils/format";

interface InventoryFormProps {
  /** Producto existente para modo edición (undefined = modo creación) */
  product?: Partial<Product>;
  onSave?: (data: Partial<Product>) => Promise<void>;
  onCancel?: () => void;
}

const AVAILABLE_SIZES = ["XS", "S", "M", "L", "XL", "XXL"];
const BADGE_OPTIONS: { value: ProductBadge; label: string }[] = [
  { value: "nuevo",       label: "Nuevo" },
  { value: "best-seller", label: "Best Seller" },
  { value: "oferta",      label: "Oferta" },
  { value: "agotado",     label: "Agotado" },
  { value: "exclusivo",   label: "Exclusivo" },
];

interface ImagePreview {
  id: string;
  url: string;        // Object URL temporal
  name: string;
  size: number;
  position: number;
}

interface SizeStock {
  size: string;
  stock: number;
}

/**
 * InventoryForm — Formulario de gestión de inventario para admin.
 *
 * Características:
 * - Zona Drag & Drop para múltiples imágenes con reordenamiento
 * - Previsualización en tiempo real de la ProductCard
 * - Editor de precios con lógica de precio tachado
 * - Gestión de stock por talla con indicadores visuales
 * - Validación de formulario antes de guardar
 */
export function InventoryForm({ product, onSave, onCancel }: InventoryFormProps) {
  const [name, setName] = useState(product?.name ?? "");
  const [category, setCategory] = useState(product?.category?.name ?? "Prêt-à-porter");
  const [price, setPrice] = useState(product?.price?.toString() ?? "");
  const [compareAtPrice, setCompareAtPrice] = useState(product?.compareAtPrice?.toString() ?? "");
  const [description, setDescription] = useState(product?.description ?? "");
  const [badges, setBadges] = useState<ProductBadge[]>(product?.badges ?? []);
  const [images, setImages] = useState<ImagePreview[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [sizeStock, setSizeStock] = useState<SizeStock[]>(
    AVAILABLE_SIZES.map((size) => ({ size, stock: 0 }))
  );

  const fileInputRef = useRef<HTMLInputElement>(null);

  // ——— Manejo de imágenes ———

  const processFiles = useCallback((files: FileList | null) => {
    if (!files) return;
    const newImages: ImagePreview[] = Array.from(files)
      .filter((f) => f.type.startsWith("image/"))
      .slice(0, 10) // Máximo 10 imágenes
      .map((file, i) => ({
        id: `${Date.now()}-${i}`,
        url: URL.createObjectURL(file),
        name: file.name,
        size: file.size,
        position: images.length + i,
      }));
    setImages((prev) => [...prev, ...newImages]);
  }, [images.length]);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    processFiles(e.dataTransfer.files);
  };

  const removeImage = (id: string) => {
    setImages((prev) => {
      const filtered = prev.filter((img) => img.id !== id);
      return filtered.map((img, i) => ({ ...img, position: i }));
    });
  };

  // ——— Manejo de stock ———

  const updateStock = (size: string, value: string) => {
    const stock = Math.max(0, parseInt(value) || 0);
    setSizeStock((prev) =>
      prev.map((s) => (s.size === size ? { ...s, stock } : s))
    );
  };

  const getStockColor = (stock: number) => {
    if (stock === 0)  return "text-status-error";
    if (stock <= 5)   return "text-status-warning";
    return "text-status-success";
  };

  // ——— Toggle badges ———

  const toggleBadge = (badge: ProductBadge) => {
    setBadges((prev) =>
      prev.includes(badge) ? prev.filter((b) => b !== badge) : [...prev, badge]
    );
  };

  // ——— Validación ———

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!name.trim())       newErrors.name     = "El nombre es obligatorio";
    if (!price.trim())      newErrors.price    = "El precio es obligatorio";
    if (isNaN(Number(price))) newErrors.price  = "El precio debe ser un número";
    if (images.length === 0) newErrors.images  = "Sube al menos una imagen";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ——— Guardar ———

  const handleSave = async () => {
    if (!validate()) return;
    setIsSaving(true);
    try {
      await onSave?.({
        name,
        category: { id: "", name: category, slug: category.toLowerCase() },
        price: Number(price),
        compareAtPrice: compareAtPrice ? Number(compareAtPrice) : undefined,
        description,
        badges,
        currency: brandConfig.brand.currency,
        // Las imágenes reales se subirían aquí vía FormData a tu API
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Precio formateado para la previsualización
  const previewPrice = price
    ? formatPrice(Number(price), brandConfig.brand.currency)
    : `${brandConfig.brand.currencySymbol}0`;

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">

      {/* ——— FORMULARIO (2/3) ——— */}
      <div className="xl:col-span-2 flex flex-col gap-5">

        {/* Información básica */}
        <FormCard title="Información del producto">
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Nombre del producto" error={errors.name} required>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej. Vestido Seda Cruda SS25"
                className={fieldClass(!!errors.name)}
              />
            </FormField>
            <FormField label="Categoría" required>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className={fieldClass(false)}
              >
                <option>Prêt-à-porter</option>
                <option>Accesorios</option>
                <option>Calzado</option>
                <option>Joyería</option>
              </select>
            </FormField>
          </div>

          <FormField label="Descripción">
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descripción del producto, materiales, detalles de construcción..."
              rows={3}
              className={`${fieldClass(false)} resize-none`}
            />
          </FormField>

          {/* Badges */}
          <FormField label="Etiquetas / Badges">
            <div className="flex gap-2 flex-wrap">
              {BADGE_OPTIONS.map(({ value, label }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => toggleBadge(value)}
                  className={`px-3 py-1.5 text-xs rounded-sm border transition-all duration-200 ${
                    badges.includes(value)
                      ? "bg-brand-primary text-brand-inverse border-brand-primary"
                      : "bg-brand-surface text-brand-muted border-brand-border hover:border-brand-primary hover:text-brand-primary"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </FormField>
        </FormCard>

        {/* Precios */}
        <FormCard title="Precios y descuentos">
          <div className="grid grid-cols-2 gap-4">
            <FormField label={`Precio (${brandConfig.brand.currency})`} error={errors.price} required>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-brand-muted">
                  {brandConfig.brand.currencySymbol}
                </span>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="890000"
                  className={`${fieldClass(!!errors.price)} pl-7`}
                  min="0"
                  step="1000"
                />
              </div>
            </FormField>
            <FormField label="Precio tachado (opcional)">
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-brand-muted">
                  {brandConfig.brand.currencySymbol}
                </span>
                <input
                  type="number"
                  value={compareAtPrice}
                  onChange={(e) => setCompareAtPrice(e.target.value)}
                  placeholder="1200000"
                  className={`${fieldClass(false)} pl-7`}
                  min="0"
                  step="1000"
                />
              </div>
              {compareAtPrice && price && Number(compareAtPrice) > Number(price) && (
                <p className="text-xs text-status-success mt-1">
                  Descuento: {Math.round(((Number(compareAtPrice) - Number(price)) / Number(compareAtPrice)) * 100)}%
                </p>
              )}
            </FormField>
          </div>
        </FormCard>

        {/* Imágenes */}
        <FormCard title="Imágenes del producto">
          {/* Dropzone */}
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-md p-8 text-center cursor-pointer transition-all duration-200 ${
              isDragOver
                ? "border-brand-accent bg-amber-50"
                : errors.images
                ? "border-status-error bg-red-50"
                : "border-brand-border bg-brand-secondary hover:border-brand-accent hover:bg-amber-50/30"
            }`}
            role="button"
            aria-label="Subir imágenes"
          >
            <div className="text-3xl mb-2 opacity-40">⬆</div>
            <p className="text-sm text-brand-muted">
              Arrastra imágenes aquí o{" "}
              <span className="text-brand-accent underline">selecciona archivos</span>
            </p>
            <p className="text-xs text-brand-muted mt-1">
              JPG, PNG, WebP — máx. 10 imágenes — 10MB cada una
            </p>
            {errors.images && (
              <p className="text-xs text-status-error mt-2">{errors.images}</p>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => processFiles(e.target.files)}
          />

          {/* Preview de imágenes cargadas */}
          {images.length > 0 && (
            <div className="grid grid-cols-4 gap-2 mt-3">
              {images.map((img, idx) => (
                <div key={img.id} className="relative group rounded-md overflow-hidden border border-brand-border">
                  <div style={{ aspectRatio: "1 / 1" }} className="relative bg-brand-secondary">
                    <Image src={img.url} alt={img.name} fill className="object-cover" sizes="100px" />
                  </div>
                  {idx === 0 && (
                    <span className="absolute top-1 left-1 text-[10px] bg-brand-primary text-white px-1.5 py-0.5 rounded-sm">
                      Principal
                    </span>
                  )}
                  <button
                    onClick={() => removeImage(img.id)}
                    className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 text-white text-[10px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label="Eliminar imagen"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </FormCard>

        {/* Stock por talla */}
        <FormCard title="Stock por talla">
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
            {sizeStock.map(({ size, stock }) => (
              <div key={size} className="flex flex-col items-center gap-1.5 p-3 bg-brand-secondary rounded-md border border-brand-border">
                <span className="text-xs text-brand-muted">{size}</span>
                <input
                  type="number"
                  value={stock}
                  onChange={(e) => updateStock(size, e.target.value)}
                  min="0"
                  className={`w-full text-center border-none bg-transparent text-base font-medium outline-none ${getStockColor(stock)}`}
                  aria-label={`Stock para talla ${size}`}
                />
                <span className="text-[10px] text-brand-muted">uds.</span>
              </div>
            ))}
          </div>
          <div className="flex gap-4 mt-3 text-xs text-brand-muted">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-status-success inline-block" /> Disponible
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-status-warning inline-block" /> Stock bajo (&le;5)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-status-error inline-block" /> Agotado
            </span>
          </div>
        </FormCard>

        {/* Acciones */}
        <div className="flex justify-end gap-3">
          {onCancel && (
            <button
              onClick={onCancel}
              className="px-6 py-2.5 text-sm border border-brand-border rounded-md text-brand-muted hover:text-brand-primary hover:border-brand-primary transition-all duration-200"
            >
              Cancelar
            </button>
          )}
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-8 py-2.5 text-sm font-medium bg-brand-primary text-brand-inverse rounded-md hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            {isSaving ? "Guardando..." : "Guardar producto"}
          </button>
        </div>
      </div>

      {/* ——— PREVISUALIZACIÓN EN TIEMPO REAL (1/3) ——— */}
      <div className="xl:col-span-1 sticky top-20">
        <p className="text-xs uppercase tracking-widest text-brand-muted mb-3">
          Previsualización en catálogo
        </p>
        <div className="bg-brand-surface border border-brand-border rounded-lg p-4">
          {/* Mini ProductCard */}
          <div className="bg-brand-surface rounded-lg overflow-hidden border border-brand-border max-w-[200px] mx-auto">
            <div
              className="bg-brand-secondary flex items-center justify-center overflow-hidden"
              style={{ aspectRatio: "4 / 5" }}
            >
              {images.length > 0 ? (
                <Image
                  src={images[0].url}
                  alt="Previsualización"
                  width={200}
                  height={250}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-4xl opacity-20">📷</span>
              )}
            </div>
            <div className="p-3">
              <p className="text-[10px] text-brand-muted uppercase tracking-wider mb-0.5">
                {category}
              </p>
              <p className="font-display text-sm text-brand-primary leading-tight mb-2">
                {name || "Nombre del producto"}
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-sm font-medium text-brand-primary">
                  {previewPrice}
                </span>
                {compareAtPrice && price && Number(compareAtPrice) > Number(price) && (
                  <span className="text-xs text-brand-muted line-through">
                    {formatPrice(Number(compareAtPrice), brandConfig.brand.currency)}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Badges activos */}
          {badges.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1 justify-center">
              {badges.map((badge) => (
                <span
                  key={badge}
                  className="text-[10px] px-2 py-0.5 bg-brand-primary text-brand-inverse rounded-sm uppercase tracking-wide"
                >
                  {badge}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ——— Helpers de UI ———

function fieldClass(hasError: boolean) {
  return `w-full px-3 py-2 text-sm border rounded-sm font-ui text-brand-text bg-brand-surface outline-none transition-all duration-200 focus:border-brand-primary ${
    hasError ? "border-status-error" : "border-brand-border"
  }`;
}

function FormCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-brand-surface rounded-lg border border-brand-border p-5">
      <h2 className="text-[11px] uppercase tracking-widest text-brand-muted mb-4 pb-3 border-b border-brand-border">
        {title}
      </h2>
      <div className="flex flex-col gap-4">{children}</div>
    </div>
  );
}

function FormField({
  label,
  children,
  error,
  required,
}: {
  label: string;
  children: React.ReactNode;
  error?: string;
  required?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs text-brand-muted">
        {label}
        {required && <span className="text-status-error ml-0.5">*</span>}
      </label>
      {children}
      {error && <p className="text-xs text-status-error">{error}</p>}
    </div>
  );
}
