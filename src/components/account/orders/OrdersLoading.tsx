export function OrdersLoading() {
  return (
    <div className="space-y-4">
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className="h-24 bg-white/[0.06] rounded-lg animate-pulse"
        />
      ))}
    </div>
  );
}
