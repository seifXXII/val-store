export function AccountWelcome({
  userName,
}: {
  userName: string | null | undefined;
}) {
  return (
    <div className="bg-gradient-to-r from-val-accent/15 to-val-accent/5 border border-val-accent/20 rounded-xl p-6">
      <h2 className="text-2xl font-bold text-white mb-2">
        Welcome back, {userName || "there"}!
      </h2>
      <p className="text-gray-400">
        Manage your orders, addresses, and preferences.
      </p>
    </div>
  );
}
