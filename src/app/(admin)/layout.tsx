import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { userProfiles } from "@/db/schema";
import { eq } from "drizzle-orm";

/**
 * Admin Layout - Server-side Auth Guard
 *
 * Protects all admin pages by:
 * 1. Checking if user is authenticated
 * 2. Verifying user has admin or super_admin role
 */
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Get session from Better Auth
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // If not authenticated, redirect to login
  if (!session?.user) {
    redirect("/login?error=unauthorized&redirect=/dashboard");
  }

  // Check if user has admin role
  const [profile] = await db
    .select({ role: userProfiles.role })
    .from(userProfiles)
    .where(eq(userProfiles.userId, session.user.id))
    .limit(1);

  const userRole = profile?.role ?? "customer";
  const isAdmin = userRole === "admin" || userRole === "super_admin";

  // If not admin, redirect to home with error
  if (!isAdmin) {
    redirect("/?error=forbidden");
  }

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <AdminHeader />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-muted/10 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
