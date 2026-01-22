"use client";

import { UserDialog } from "@/components/UserDialog";
import { useSession } from "@/lib/auth-client";
import { AdminNotifications } from "./AdminNotifications";

export function AdminHeader() {
  const { data: session } = useSession();

  // Transform session to user props expected by UserDialog
  const user = session?.user
    ? {
        id: session.user.id,
        email: session.user.email || "",
        firstName: session.user.name?.split(" ")[0] || "",
        lastName: session.user.name?.split(" ").slice(1).join(" ") || "",
        role: (session.user as { role?: string })?.role || "user",
      }
    : null;

  return (
    <header className="flex h-16 items-center justify-between border-b bg-background px-6">
      <div className="flex items-center gap-4">
        <h2 className="text-lg font-semibold">Admin Panel</h2>
      </div>

      <div className="flex items-center gap-4">
        {/* Notifications */}
        <AdminNotifications />

        {/* User Menu */}
        <UserDialog user={user} />
      </div>
    </header>
  );
}
