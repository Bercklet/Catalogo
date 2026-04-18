/**
 * ADMIN — Crear nuevo producto
 */

import Link from "next/link";
import type { Metadata } from "next";
import { InventoryForm } from "@/components/InventoryForm";
import { brandConfig } from "@/brand.config";

export const metadata: Metadata = {
  title: `Nuevo producto — Admin — ${brandConfig.brand.name}`,
  robots: { index: false, follow: false },
};

export default function NewProductPage() {
  return (
    <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-brand-muted mb-6">
        <Link href="/admin" className="hover:text-brand-primary transition-colors">Admin</Link>
        <span>/</span>
        <span className="text-brand-primary font-medium">Nuevo producto</span>
      </nav>

      <div className="mb-6">
        <h1 className="font-display text-3xl font-light text-brand-primary">Nuevo producto</h1>
        <p className="text-sm text-brand-muted mt-1">
          Completa los campos y verás una previsualización en tiempo real.
        </p>
      </div>

      <InventoryForm
        onSave={async (data) => {
          "use server";
          // TODO: insertar en DB
          console.log("Guardar producto:", data);
        }}
      />
    </div>
  );
}
