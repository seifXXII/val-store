export function CartLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:py-12">
      <h1 className="text-2xl sm:text-3xl font-bold text-white mb-8">
        Your Cart
      </h1>
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-24 bg-white/[0.06] rounded-lg animate-pulse"
            />
          ))}
        </div>
        <div className="h-64 bg-white/[0.06] rounded-lg animate-pulse" />
      </div>
    </div>
  );
}
