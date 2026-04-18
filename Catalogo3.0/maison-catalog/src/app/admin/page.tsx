/**
 * ADMIN — Editar Producto
 * ------------------------
 * Ruta: src/app/admin/products/[id]/page.tsx
 */

import { notFound } from "next/navigation";
import { mockProducts } from "@/constants/mockData";
import { brandConfig } from "@/brand.config";

interface Props {
  params: { id: string };
}

export default function EditProductPage({ params }: Props) {
  const product = mockProducts.find((p) => p.id === params.id);

  if (!product) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-light text-brand-primary">
          Editar: {product.name}
        </h1>
        <p className="text-brand-muted">ID: {product.id}</p>
      </div>

      <div className="bg-white border border-brand-border rounded-xl p-8">
        <p className="text-center text-brand-muted py-12">
          Formulario de edición en desarrollo.<br />
          Conecta Supabase para guardar cambios reales.
        </p>
      </div>

      <div className="mt-6 text-center">
        <a 
          href="/admin" 
          className="text-brand-primary hover:underline"
        >
          ← Volver al panel de administración
        </a>
      </div>
    </div>
  );
}
