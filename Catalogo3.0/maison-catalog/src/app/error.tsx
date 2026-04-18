"use client";

/**
 * ERROR BOUNDARY GLOBAL
 * ----------------------
 * Ruta: src/app/error.tsx
 *
 * Captura errores en runtime de cualquier Server Component.
 * Muestra una página de error de marca en lugar de la pantalla
 * genérica de Next.js.
 */

import { useEffect } from "react";
import Link from "next/link";
import { brandConfig } from "@/brand.config";

interface ErrorProps {
  error:  Error & { digest?: string };
  reset:  () => void;
}

export default function GlobalError({ error, reset }: ErrorProps) {
  useEffect(() => {
    // En producción, enviar a tu servicio de logging (Sentry, LogFlare, etc.)
    console.error("[GlobalError]", error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <p className="text-xs tracking-[0.3em] uppercase text-brand-accent mb-4">
        Error inesperado
      </p>
      <h1 className="font-display text-4xl font-light text-brand-primary mb-4">
        Algo salió mal
      </h1>
      <p className="text-sm text-brand-muted max-w-sm mb-2 leading-relaxed">
        Ocurrió un error al cargar esta página. Puedes intentar de nuevo
        o volver al catálogo.
      </p>
      {error.digest && (
        <p className="text-xs text-brand-muted mb-8 font-mono">
          Ref: {error.digest}
        </p>
      )}
      <div className="flex gap-3">
        <button
          onClick={reset}
          className="px-6 py-2.5 bg-brand-primary text-brand-inverse text-sm font-medium rounded-md hover:bg-gray-800 transition-all duration-200"
        >
          Intentar de nuevo
        </button>
        <Link
          href="/"
          className="px-6 py-2.5 border border-brand-border text-sm text-brand-primary rounded-md hover:border-brand-primary transition-all duration-200"
        >
          Volver al catálogo
        </Link>
      </div>
    </div>
  );
}
