"use client";

/**
 * CART DRAWER — Actualizado con CheckoutModal real
 * Ruta: src/components/CartDrawer.tsx  (reemplaza el anterior)
 */

import Image from "next/image";
import Link  from "next/link";
import { useEffect, useState } from "react";
import { useCartStore }   from "@/store/cart.store";
import { CheckoutModal }  from "@/components/CheckoutModal";
import { formatPrice }    from "@/lib/utils/format";

export function CartDrawer() {
  const {
    items, isOpen, closeCart,
    increment, decrement, removeItem, clearCart,
    totalItems, totalPrice,
  } = useCartStore();

  const [checkoutOpen, setCheckoutOpen] = useState(false);

  const itemCount = totalItems();
  const cartTotal = totalPrice();
  const currency  = items[0]?.currency ?? "COP";

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") closeCart(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [closeCart]);

  const handleCheckout = () => {
    closeCart();
    setCheckoutOpen(true);
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-black transition-opacity duration-300 ${
          isOpen ? "opacity-40 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={closeCart}
        aria-hidden="true"
      />

      {/* Panel */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Carrito de compras"
        className={`fixed top-0 right-0 z-50 h-full w-full max-w-sm bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-brand-border flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <h2 className="font-display text-xl font-light text-brand-primary">Carrito</h2>
            {itemCount > 0 && (
              <span className="text-xs bg-brand-accent text-white w-5 h-5 rounded-full flex items-center justify-center font-medium">
                {itemCount > 9 ? "9+" : itemCount}
              </span>
            )}
          </div>
          <button onClick={closeCart} className="w-8 h-8 flex items-center justify-center rounded-md text-brand-muted hover:text-brand-primary hover:bg-brand-secondary transition-colors" aria-label="Cerrar">✕</button>
        </div>

        {/* Lista */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center gap-4">
              <div className="text-5xl opacity-20">🛍</div>
              <p className="font-display text-xl font-light text-brand-primary">Tu carrito está vacío</p>
              <p className="text-sm text-brand-muted">Agrega piezas desde el catálogo para comenzar.</p>
              <button onClick={closeCart} className="mt-2 px-6 py-2.5 border border-brand-primary text-sm text-brand-primary rounded-md hover:bg-brand-primary hover:text-brand-inverse transition-all duration-200">
                Ver catálogo
              </button>
            </div>
          ) : (
            <ul className="flex flex-col gap-5" role="list">
              {items.map((item) => (
                <li key={item.cartItemId} className="flex gap-3 pb-5 border-b border-brand-border last:border-b-0">
                  <Link href={`/products/${item.slug}`} onClick={closeCart} className="flex-shrink-0 w-20 rounded-md overflow-hidden border border-brand-border bg-brand-secondary" style={{ aspectRatio: "4/5" }}>
                    {item.image && <Image src={item.image} alt={item.imageAlt} width={80} height={100} className="w-full h-full object-cover" />}
                  </Link>
                  <div className="flex-1 flex flex-col gap-1 min-w-0">
                    <Link href={`/products/${item.slug}`} onClick={closeCart} className="font-display text-sm text-brand-primary leading-snug hover:text-brand-accent transition-colors line-clamp-2">
                      {item.name}
                    </Link>
                    <div className="flex items-center gap-2 text-xs text-brand-muted">
                      <span className="w-3 h-3 rounded-full border border-black/10" style={{ backgroundColor: item.color.hex }} />
                      <span>{item.color.name}</span>
                      <span>·</span>
                      <span>{item.size}</span>
                    </div>
                    <p className="text-sm font-medium text-brand-primary mt-0.5">{formatPrice(item.price, item.currency)}</p>
                    <div className="flex items-center justify-between mt-1.5">
                      <div className="flex items-center border border-brand-border rounded-md overflow-hidden">
                        <button onClick={() => decrement(item.cartItemId)} className="w-7 h-7 flex items-center justify-center text-brand-muted hover:text-brand-primary hover:bg-brand-secondary transition-colors text-sm" aria-label="Reducir">−</button>
                        <span className="w-8 text-center text-sm font-medium text-brand-primary">{item.quantity}</span>
                        <button onClick={() => increment(item.cartItemId)} className="w-7 h-7 flex items-center justify-center text-brand-muted hover:text-brand-primary hover:bg-brand-secondary transition-colors text-sm" aria-label="Aumentar">+</button>
                      </div>
                      <span className="text-sm font-medium text-brand-primary">{formatPrice(item.price * item.quantity, item.currency)}</span>
                      <button onClick={() => removeItem(item.cartItemId)} className="text-xs text-brand-muted hover:text-status-error transition-colors ml-2">Eliminar</button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="flex-shrink-0 border-t border-brand-border px-5 py-5 flex flex-col gap-3 bg-white">
            <div className="text-xs text-center text-brand-muted">
              {cartTotal >= 500000
                ? <span className="text-status-success font-medium">✓ Envío gratuito incluido</span>
                : <span>Agrega <span className="font-medium text-brand-primary">{formatPrice(500000 - cartTotal, currency)}</span> más para envío gratis</span>
              }
            </div>
            <div className="flex items-center justify-between py-2 border-t border-brand-border">
              <span className="text-sm text-brand-muted">Subtotal</span>
              <span className="text-lg font-medium text-brand-primary">{formatPrice(cartTotal, currency)}</span>
            </div>
            <button
              onClick={handleCheckout}
              className="w-full py-3.5 bg-brand-primary text-brand-inverse text-sm font-medium tracking-widest uppercase rounded-md hover:bg-gray-800 transition-all duration-200 active:scale-[0.98]"
            >
              Proceder al pago
            </button>
            <button onClick={clearCart} className="text-xs text-brand-muted hover:text-status-error transition-colors text-center">
              Vaciar carrito
            </button>
          </div>
        )}
      </aside>

      {/* Modal de checkout */}
      <CheckoutModal
        isOpen={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
      />
    </>
  );
}
