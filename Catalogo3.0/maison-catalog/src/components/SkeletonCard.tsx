export function SkeletonCard() {
  return (
    <div className="bg-brand-surface rounded-lg border border-brand-border overflow-hidden animate-pulse">
      <div
        className="bg-brand-secondary"
        style={{ aspectRatio: "4 / 5" }}
      />
      <div className="p-3.5 space-y-2">
        <div className="h-2.5 w-16 bg-brand-border rounded-full" />
        <div className="h-4 w-3/4 bg-brand-border rounded-full" />
        <div className="h-4 w-1/2 bg-brand-border rounded-full" />
        <div className="flex justify-between items-center pt-1">
          <div className="h-3.5 w-20 bg-brand-border rounded-full" />
          <div className="flex gap-1">
            {[0,1,2].map((i) => (
              <div key={i} className="w-3.5 h-3.5 rounded-full bg-brand-border" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
