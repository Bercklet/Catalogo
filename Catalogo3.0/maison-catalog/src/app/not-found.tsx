import Link from "next/link";
import { brandConfig } from "@/brand.config";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <p className="text-xs tracking-[0.3em] uppercase text-brand-accent mb-4">404</p>
      <h1 className="font-display text-4xl font-light text-brand-primary mb-4">
        Página no encontrada
      </h1>
      <p className="text-sm text-brand-muted max-w-sm mb-8 leading-relaxed">
        La página que buscas no existe o fue movida.
        Vuelve al catálogo para continuar explorando.
      </p>
      <Link
        href="/"
        className="px-8 py-3 bg-brand-primary text-brand-inverse text-sm font-medium rounded-md hover:bg-gray-800 transition-all duration-200"
      >
        Volver al catálogo
      </Link>
    </div>
  );
}
