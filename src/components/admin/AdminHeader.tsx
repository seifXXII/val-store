"use client";

import { UserDialog } from "@/components/UserDialog";
import { trpc } from "@/lib/trpc";
import { AdminNotifications } from "./AdminNotifications";
import { AdminThemeToggle } from "./AdminThemeToggle";
import { useSession } from "@/lib/auth-client";

export function AdminHeader() {
  const { data: session } = useSession();
  const { data: serverUser } = trpc.public.user.getSession.useQuery();

  // Transform session to user props expected by UserDialog
  const user = session?.user
    ? {
        id: session.user.id,
        email: session.user.email || "",
        firstName: session.user.name?.split(" ")[0] || "",
        lastName: session.user.name?.split(" ").slice(1).join(" ") || "",
        role: serverUser?.role || "user",
        image: session.user.image || null,
      }
    : null;

  return (
    <header className="flex h-16 items-center justify-between border-b bg-background px-6">
      <div className="flex items-center gap-4">
        <h2 className="text-lg font-semibold">Admin Panel</h2>
      </div>

      <div className="flex items-center gap-2">
        {/* Theme Toggle */}
        <AdminThemeToggle />

        {/* Notifications */}
        <AdminNotifications />

        {/* User Menu */}
        <UserDialog user={user} />
      </div>
    </header>
  );
}
