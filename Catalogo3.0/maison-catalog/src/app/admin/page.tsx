/**
 * ADMIN — Dashboard de Inventario
 * ----------------------------------
 * Vista de gestión de productos con tabla de inventario,
 * métricas clave y acceso al formulario de creación/edición.
 *
 * ⚠️ En producción, protege esta ruta con autenticación
 * (Supabase Auth, NextAuth, Clerk, etc.)
 */
import Link from "next/link";
import type { Metadata } from "next";
import { mockProducts } from "@/constants/mockData";
import { formatPrice } from "@/lib/utils/format";
import { brandConfig } from "@/brand.config";

export const metadata: Metadata = {
  title: `Admin — ${brandConfig.name}`,
  robots: { index: false, follow: false }, // No indexar el admin
};

function getStockStatus(totalStock: number) {
  if (totalStock === 0) return { label: "Agotado", className: "bg-red-50 text-status-error border border-red-100" };
  if (totalStock <= 10) return { label: "Stock bajo", className: "bg-amber-50 text-status-warning border border-amber-100" };
  return { label: "Disponible", className: "bg-green-50 text-status-success border border-green-100" };
}

export default function AdminPage() {
  /* Métricas calculadas server-side */
  const totalProducts = mockProducts.length;
  const activeProducts = mockProducts.filter((p) => p.isActive).length;
  const outOfStock = mockProducts.filter((p) => p.variants.every((v) => v.stock === 0)).length;
  const totalStockValue = mockProducts.reduce((sum, p) => {
    const units = p.variants.reduce((s, v) => s + v.stock, 0);
    return sum + p.price * units;
  }, 0);

  return (
    <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* ——— Header ——— */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-xs text-brand-muted uppercase tracking-widest mb-1">Panel de administración</p>
          <h1 className="font-display text-3xl font-light text-brand-primary">Inventario</h1>
        </div>
        <Link
          href="/admin/products/new"
          className="px-5 py-2.5 bg-brand-primary text-brand-inverse text-sm font-medium rounded-md hover:bg-gray-800 transition-all duration-200"
        >
          + Nuevo producto
        </Link>
      </div>

      {/* ——— Métricas ——— */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total productos", value: totalProducts },
          { label: "Activos", value: activeProducts },
          { label: "Agotados", value: outOfStock, alert: outOfStock > 0 },
          { label: "Valor en stock", value: formatPrice(totalStockValue, brandConfig.currency), small: true },
        ].map(({ label, value, alert, small }) => (
          <div
            key={label}
            className={`bg-brand-surface border rounded-lg p-4 ${alert ? "border-amber-200" : "border-brand-border"}`}
          >
            <p className="text-xs text-brand-muted mb-1.5">{label}</p>
            <p className={`font-medium text-brand-primary ${small ? "text-base" : "text-2xl"}`}>
              {value}
            </p>
          </div>
        ))}
      </div>

      {/* ——— Tabla de inventario ——— */}
      <div className="bg-brand-surface border border-brand-border rounded-xl overflow-hidden">
        {/* Header de tabla */}
        <div className="grid grid-cols-[1fr_auto_auto_auto_80px] gap-4 px-5 py-3 border-b border-brand-border bg-brand-secondary">
          {["Producto", "Precio", "Stock total", "Estado", ""].map((h) => (
            <span key={h} className="text-[11px] font-medium uppercase tracking-wider text-brand-muted">
              {h}
            </span>
          ))}
        </div>

        {/* Filas */}
        {mockProducts.map((product) => {
          const totalStock = product.variants.reduce((s, v) => s + v.stock, 0);
          const status = getStockStatus(totalStock);
          const mainImage = product.images.find((img) => img.position === 0);

          return (
            <div
              key={product.id}
              className="grid grid-cols-[1fr_auto_auto_auto_80px] gap-4 px-5 py-4 border-b border-brand-border last:border-b-0 hover:bg-brand-secondary transition-colors duration-150 items-center"
            >
              {/* Producto */}
              <div className="flex items-center gap-3 min-w-0">
                {/* Thumbnail */}
                <div
                  className="w-10 h-10 rounded-md bg-brand-secondary border border-brand-border flex-shrink-0 overflow-hidden"
                  style={{ aspectRatio: "1/1" }}
                >
                  {mainImage && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={mainImage.url}
                      alt={mainImage.alt}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-brand-primary truncate">{product.name}</p>
                  <p className="text-xs text-brand-muted">{product.category?.name || "Sin categoría"}</p>
                </div>
              </div>

              {/* Precio */}
              <div className="text-right">
                <p className="text-sm text-brand-primary">
                  {formatPrice(product.price, product.currency || brandConfig.currency)}
                </p>
                {product.compareAtPrice && (
                  <p className="text-xs text-brand-muted line-through">
                    {formatPrice(product.compareAtPrice, product.currency || brandConfig.currency)}
                  </p>
                )}
              </div>

              {/* Stock */}
              <p className="text-sm text-brand-primary text-center">{totalStock}u</p>

              {/* Estado */}
              <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-medium whitespace-nowrap ${status.className}`}>
                {status.label}
              </span>

              {/* Acciones */}
              <div className="flex gap-2 justify-end">
                <Link
                  href={`/products/${product.slug}`}
                  className="text-xs text-brand-muted hover:text-brand-primary transition-colors"
                  title="Ver en catálogo"
                >
                  Ver
                </Link>
                <Link
                  href={`/admin/products/${product.id}`}
                  className="text-xs text-brand-accent hover:text-brand-primary transition-colors font-medium"
                >
                  Editar
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* ——— Nota de desarrollo ——— */}
      <div className="mt-6 p-4 border border-amber-200 bg-amber-50 rounded-lg">
        <p className="text-xs text-status-warning">
          <span className="font-medium">Modo desarrollo:</span> Los datos provienen de{" "}
          <code className="font-mono bg-amber-100 px-1 rounded">constants/mockData.ts</code>.
          Conecta Supabase o Neon para persistencia real.
        </p>
      </div>
    </div>
  );
}
