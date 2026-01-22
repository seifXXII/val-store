"use client";

/**
 * User Notifications Bell
 *
 * Bell icon with unread count badge and dropdown for logged-in users.
 */

import { useState } from "react";
import { useSession } from "@/lib/auth-client";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  Bell,
  Check,
  Tag,
  Package,
  Percent,
  Clock,
  Truck,
  CheckCircle,
  XCircle,
  RefreshCw,
  ShoppingBag,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";

const NOTIFICATION_ICONS: Record<string, typeof Bell> = {
  wishlist_sale: Tag,
  item_available: Package,
  order_update: Clock,
  price_drop: Percent,
  order_confirmed: ShoppingBag,
  order_shipped: Truck,
  order_delivered: CheckCircle,
  order_cancelled: XCircle,
  refund_processed: RefreshCw,
};

const NOTIFICATION_COLORS: Record<string, string> = {
  wishlist_sale: "text-green-600 bg-green-100",
  item_available: "text-blue-600 bg-blue-100",
  order_update: "text-orange-600 bg-orange-100",
  price_drop: "text-purple-600 bg-purple-100",
  order_confirmed: "text-blue-600 bg-blue-100",
  order_shipped: "text-indigo-600 bg-indigo-100",
  order_delivered: "text-green-600 bg-green-100",
  order_cancelled: "text-red-600 bg-red-100",
  refund_processed: "text-amber-600 bg-amber-100",
};

export function UserNotificationsBell() {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);

  const { data: notifications = [], isLoading } =
    trpc.public.notifications.list.useQuery(
      { limit: 10 },
      { enabled: open && !!session?.user }
    );
  const { data: unreadCount = 0 } =
    trpc.public.notifications.unreadCount.useQuery(undefined, {
      enabled: !!session?.user,
    });

  const utils = trpc.useUtils();

  const markAsReadMutation = trpc.public.notifications.markAsRead.useMutation({
    onSuccess: () => {
      utils.public.notifications.list.invalidate();
      utils.public.notifications.unreadCount.invalidate();
    },
  });

  const markAllAsReadMutation =
    trpc.public.notifications.markAllAsRead.useMutation({
      onSuccess: () => {
        utils.public.notifications.list.invalidate();
        utils.public.notifications.unreadCount.invalidate();
      },
    });

  // Don't show if not logged in
  if (!session?.user) {
    return null;
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="flex items-center justify-between px-3 py-2">
          <span className="font-semibold">Notifications</span>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="text-xs"
              onClick={() => markAllAsReadMutation.mutate()}
            >
              <Check className="h-3 w-3 mr-1" />
              Mark all read
            </Button>
          )}
        </div>
        <DropdownMenuSeparator />
        {isLoading ? (
          <div className="p-4 text-center text-sm text-muted-foreground">
            Loading...
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-4 text-center text-sm text-muted-foreground">
            No notifications yet
          </div>
        ) : (
          <div className="max-h-80 overflow-y-auto">
            {notifications.map((n) => {
              const Icon = NOTIFICATION_ICONS[n.notificationType] || Bell;
              const colorClass =
                NOTIFICATION_COLORS[n.notificationType] ||
                "text-muted-foreground bg-muted";

              return (
                <DropdownMenuItem
                  key={n.id}
                  className={`flex gap-3 p-3 cursor-pointer ${
                    !n.isRead ? "bg-muted/50" : ""
                  }`}
                  asChild
                >
                  <Link
                    href={n.productSlug ? `/products/${n.productSlug}` : "#"}
                    onClick={() => {
                      if (!n.isRead) {
                        markAsReadMutation.mutate({ id: n.id });
                      }
                    }}
                  >
                    <div className={`p-2 rounded-full ${colorClass}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-sm truncate ${
                          !n.isRead ? "font-medium" : ""
                        }`}
                      >
                        {n.title}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {n.message}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatDistanceToNow(new Date(n.createdAt), {
                          addSuffix: true,
                        })}
                      </p>
                    </div>
                  </Link>
                </DropdownMenuItem>
              );
            })}
          </div>
        )}
        {notifications.length > 0 && (
          <>
            <DropdownMenuSeparator />
            <div className="p-2">
              <Link
                href="/account/notifications"
                className="text-sm text-primary hover:underline block text-center"
              >
                View all notifications
              </Link>
            </div>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
