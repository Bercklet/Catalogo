/**
 * LOADING UI GLOBAL
 * ------------------
 * Ruta: src/app/loading.tsx
 *
 * Se muestra durante la navegación entre páginas mientras
 * Next.js carga el Server Component de la ruta destino.
 */

export default function GlobalLoading() {
  return (
    <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero skeleton */}
      <div className="bg-brand-primary rounded-lg h-44 mb-8 animate-pulse" />

      {/* Filter bar skeleton */}
      <div className="flex gap-2 mb-6">
        {[80, 120, 100, 90, 110].map((w, i) => (
          <div
            key={i}
            className="h-8 bg-brand-border rounded-full animate-pulse"
            style={{ width: `${w}px` }}
          />
        ))}
      </div>

      {/* Grid skeleton */}
      <div
        className="grid gap-4 sm:gap-5"
        style={{ gridTemplateColumns: "repeat(auto-fill, minmax(min(100%,220px), 1fr))" }}
      >
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="bg-white border border-brand-border rounded-lg overflow-hidden animate-pulse">
            <div className="bg-brand-secondary" style={{ aspectRatio: "4/5" }} />
            <div className="p-3.5 space-y-2">
              <div className="h-2.5 w-16 bg-brand-border rounded-full" />
              <div className="h-4 w-3/4 bg-brand-border rounded-full" />
              <div className="h-3.5 w-20 bg-brand-border rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
