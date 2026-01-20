"use client";

import { UserDialog } from "@/components/UserDialog";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSession } from "@/lib/auth-client";

export function AdminHeader() {
  const { data: session } = useSession();

  // TODO: Replace with actual notification query when notification system is implemented
  // For now, no red dot since there's no notification system
  const unreadNotificationCount = 0;

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
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadNotificationCount > 0 && (
            <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-600" />
          )}
        </Button>

        {/* User Menu */}
        <UserDialog user={user} />
      </div>
    </header>
  );
}
