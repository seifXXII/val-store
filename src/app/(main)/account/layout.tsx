"use client";

/**
 * Account Layout
 *
 * Wraps account pages with sidebar navigation.
 * Requires authentication.
 */

import { useSession } from "@/lib/auth-client";
import { redirect } from "next/navigation";
import { AccountSidebar } from "@/components/account/AccountSidebar";

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, isPending } = useSession();

  if (isPending) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-48 mb-8" />
          <div className="flex gap-8">
            <div className="w-64 space-y-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-12 bg-muted rounded" />
              ))}
            </div>
            <div className="flex-1 h-96 bg-muted rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!session?.user) {
    redirect("/login?redirect=/account");
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Account</h1>
      <div className="flex flex-col md:flex-row gap-8">
        <AccountSidebar />
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  );
}
