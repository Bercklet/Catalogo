"use client";

/**
 * NAVBAR — Con contador de carrito en tiempo real
 * Ruta: src/components/Navbar.tsx  (reemplaza el existente)
 */

import Link from "next/link";
import { useCartStore } from "@/store/cart.store";
import { brandConfig } from "@/brand.config";

export function Navbar() {
  const { toggleCart, totalItems } = useCartStore();
  const itemCount = totalItems();

  return (
    <header className="bg-white border-b border-brand-border sticky top-0 z-50">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">

        {/* Logo */}
        <Link
          href="/"
          className="font-display text-xl font-light tracking-[0.15em] text-brand-primary hover:text-brand-accent transition-colors duration-200"
        >
          {brandConfig.brand.name}
        </Link>

        {/* Tagline — solo desktop */}
        <span className="hidden md:block text-xs text-brand-muted tracking-widest uppercase">
          {brandConfig.brand.tagline}
        </span>

        {/* Acciones */}
        <div className="flex items-center gap-4">
          <Link
            href="/admin"
            className="text-xs text-brand-muted hover:text-brand-primary transition-colors duration-200 hidden sm:block"
          >
            Admin
          </Link>

          {/* Botón carrito con contador en vivo */}
          <button
            onClick={toggleCart}
            className="relative flex items-center gap-2 text-xs font-medium text-brand-primary border border-brand-border px-3.5 py-1.5 rounded-md hover:border-brand-primary transition-all duration-200"
            aria-label={`Carrito — ${itemCount} ${itemCount === 1 ? "producto" : "productos"}`}
          >
            <span>Carrito</span>

            {/* Badge contador */}
            {itemCount > 0 ? (
              <span className="bg-brand-accent text-white text-[10px] font-medium w-4 h-4 rounded-full flex items-center justify-center leading-none">
                {itemCount > 9 ? "9+" : itemCount}
              </span>
            ) : (
              <span className="text-brand-muted">(0)</span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
