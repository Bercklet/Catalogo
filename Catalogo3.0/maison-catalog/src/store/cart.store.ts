"use client";

/**
 * CART STORE — Zustand con persistencia en localStorage
 * -------------------------------------------------------
 * Ruta: src/store/cart.store.ts
 *
 * Funcionalidades:
 * - Agregar producto con variante (color + talla)
 * - Incrementar / decrementar cantidad
 * - Eliminar ítem
 * - Vaciar carrito
 * - Abrir / cerrar drawer
 * - Total de ítems y precio total
 * - Persiste en localStorage (sobrevive recargas)
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product } from "@/types/product";

export interface CartItem {
  /** ID único del ítem = productId + colorHex + size */
  cartItemId: string;
  productId:  string;
  slug:       string;
  name:       string;
  price:      number;
  currency:   string;
  image:      string;
  imageAlt:   string;
  color:      { name: string; hex: string };
  size:       string;
  quantity:   number;
}

interface CartState {
  items:      CartItem[];
  isOpen:     boolean;

  // Acciones
  addItem:    (product: Product, color: { name: string; hex: string }, size: string) => void;
  removeItem: (cartItemId: string) => void;
  increment:  (cartItemId: string) => void;
  decrement:  (cartItemId: string) => void;
  clearCart:  () => void;
  openCart:   () => void;
  closeCart:  () => void;
  toggleCart: () => void;

  // Derivados
  totalItems:    () => number;
  totalPrice:    () => number;
  itemCount:     (cartItemId: string) => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items:  [],
      isOpen: false,

      addItem: (product, color, size) => {
        const cartItemId = `${product.id}-${color.hex}-${size}`;
        const mainImage  = product.images.find((img) => img.position === 0);

        set((state) => {
          const existing = state.items.find((i) => i.cartItemId === cartItemId);

          if (existing) {
            // Ya existe → incrementar cantidad
            return {
              items: state.items.map((i) =>
                i.cartItemId === cartItemId
                  ? { ...i, quantity: i.quantity + 1 }
                  : i
              ),
              isOpen: true,
            };
          }

          // Nuevo ítem
          const newItem: CartItem = {
            cartItemId,
            productId: product.id,
            slug:      product.slug,
            name:      product.name,
            price:     product.price,
            currency:  product.currency,
            image:     mainImage?.url ?? "",
            imageAlt:  mainImage?.alt ?? product.name,
            color,
            size,
            quantity: 1,
          };

          return { items: [...state.items, newItem], isOpen: true };
        });
      },

      removeItem: (cartItemId) =>
        set((state) => ({
          items: state.items.filter((i) => i.cartItemId !== cartItemId),
        })),

      increment: (cartItemId) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.cartItemId === cartItemId ? { ...i, quantity: i.quantity + 1 } : i
          ),
        })),

      decrement: (cartItemId) =>
        set((state) => ({
          items: state.items
            .map((i) =>
              i.cartItemId === cartItemId ? { ...i, quantity: i.quantity - 1 } : i
            )
            .filter((i) => i.quantity > 0),
        })),

      clearCart:  () => set({ items: [] }),
      openCart:   () => set({ isOpen: true }),
      closeCart:  () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
      totalPrice: () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
      itemCount:  (cartItemId) => get().items.find((i) => i.cartItemId === cartItemId)?.quantity ?? 0,
    }),
    {
      name: "maison-cart", // clave en localStorage
      // Solo persistir los ítems, no el estado del drawer
      partialize: (state) => ({ items: state.items }),
    }
  )
);
