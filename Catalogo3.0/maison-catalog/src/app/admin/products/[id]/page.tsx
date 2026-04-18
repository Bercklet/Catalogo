/**
 * ADMIN — Editar producto existente
 */

import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { InventoryForm } from "@/components/InventoryForm";
import { mockProducts } from "@/constants/mockData";
import { brandConfig } from "@/brand.config";

interface PageProps {
  params: { id: string };
}

export function generateStaticParams() {
  return mockProducts.map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const product = mockProducts.find((p) => p.id === params.id);
  return {
    title: product
      ? `Editar: ${product.name} — Admin — ${brandConfig.brand.name}`
      : "Producto no encontrado",
    robots: { index: false, follow: false },
  };
}

export default function EditProductPage({ params }: PageProps) {
  const product = mockProducts.find((p) => p.id === params.id);
  if (!product) notFound();

  return (
    <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-brand-muted mb-6">
        <Link href="/admin" className="hover:text-brand-primary transition-colors">Admin</Link>
        <span>/</span>
        <span className="text-brand-primary font-medium truncate max-w-[200px]">{product.name}</span>
      </nav>

      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="font-display text-3xl font-light text-brand-primary">Editar producto</h1>
          <p className="text-sm text-brand-muted mt-1">{product.name}</p>
        </div>
        <Link
          href={`/products/${product.slug}`}
          target="_blank"
          className="text-xs text-brand-accent underline underline-offset-2 hover:text-brand-primary transition-colors"
        >
          Ver en catálogo ↗
        </Link>
      </div>

      <InventoryForm
        product={product}
        onSave={async (data) => {
          "use server";
          // TODO: actualizar en DB
          console.log("Actualizar producto:", params.id, data);
        }}
      />
    </div>
  );
}
