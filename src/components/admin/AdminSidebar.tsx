"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  BarChart3,
  Settings,
  Warehouse,
  Star,
  Tag,
} from "lucide-react";

const navItems = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Products",
    href: "/admin/products",
    icon: Package,
  },
  {
    title: "Orders",
    href: "/admin/orders",
    icon: ShoppingCart,
  },
  {
    title: "Coupons",
    href: "/admin/coupons",
    icon: Tag,
  },
  {
    title: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
];

// Coming Soon features (displayed but disabled)
const comingSoonItems = [
  { title: "Inventory", icon: Warehouse },
  { title: "Customers", icon: Users },
  { title: "Reviews", icon: Star },
  { title: "Analytics", icon: BarChart3 },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full w-64 flex-col border-r bg-background">
      {/* Logo */}
      <div className="flex h-16 items-center border-b px-6">
        <Link href="/admin" className="flex items-center gap-2 font-semibold">
          <Package className="h-6 w-6" />
          <span>Val Store Admin</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-4">
        {navItems.map((item) => {
          // Special case: Dashboard should only be active on exact /admin match
          // Other items should be active on prefix match (e.g., /admin/products/123)
          const isActive =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname === item.href || pathname?.startsWith(item.href + "/");
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              <span>{item.title}</span>
            </Link>
          );
        })}

        {/* Coming Soon Section */}
        <div className="pt-4">
          <p className="px-3 text-xs font-medium text-muted-foreground/50 uppercase tracking-wider">
            Coming Soon
          </p>
          {comingSoonItems.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground/50 cursor-not-allowed"
              >
                <Icon className="h-4 w-4" />
                <span>{item.title}</span>
              </div>
            );
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className="border-t p-4">
        <p className="text-xs text-muted-foreground">Logged in as Admin</p>
      </div>
    </div>
  );
}
