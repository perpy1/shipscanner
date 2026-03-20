export default function Loading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="mb-8">
        <div className="h-9 w-48 animate-pulse rounded bg-muted" />
        <div className="mt-2 h-5 w-64 animate-pulse rounded bg-muted" />
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="h-80 animate-pulse rounded-xl border border-border bg-card"
          />
        ))}
      </div>
    </div>
  );
}
