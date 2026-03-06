import Link from "next/link";

export function ProfilePasswordCard() {
  return (
    <div className="bg-zinc-900 border border-white/10 rounded-lg">
      <div className="p-5 border-b border-white/10">
        <h3 className="text-lg font-semibold text-white">Password</h3>
        <p className="text-sm text-gray-500">Change your password.</p>
      </div>
      <div className="p-5">
        <Link
          href="/forgot-password"
          className="inline-flex items-center px-4 py-2 rounded-lg border border-white/10 text-sm font-medium text-gray-300 hover:bg-white/[0.04] hover:text-white transition-colors"
        >
          Change Password
        </Link>
      </div>
    </div>
  );
}
