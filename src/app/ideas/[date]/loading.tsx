export default function Loading() {
  return (
    <div className="mx-auto max-w-6xl px-6 sm:px-12 py-12">
      <div className="mb-10">
        <div className="h-4 w-32 animate-pulse rounded bg-[rgba(255,255,255,0.03)] mb-4" />
        <div className="h-3 w-24 animate-pulse rounded bg-[rgba(255,255,255,0.05)] mb-3" />
        <div className="h-10 w-72 animate-pulse rounded bg-[rgba(255,255,255,0.05)]" />
      </div>
      <div className="grid gap-8 sm:grid-cols-2">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-64 animate-pulse glass-card" />
        ))}
      </div>
    </div>
  );
}
