export function WishlistLoading() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">My Wishlist</h2>
        <p className="text-gray-400">Your saved items</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="h-80 bg-white/[0.06] rounded-lg animate-pulse"
          />
        ))}
      </div>
    </div>
  );
}
