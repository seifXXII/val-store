"use client";

/**
 * Admin Notifications Dropdown
 *
 * Bell icon with unread count badge and dropdown list.
 */

import { useState } from "react";
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
  Trash2,
  Package,
  Star,
  AlertTriangle,
  CreditCard,
  UserPlus,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const NOTIFICATION_ICONS: Record<string, typeof Bell> = {
  new_order: Package,
  low_stock: AlertTriangle,
  new_review: Star,
  failed_payment: CreditCard,
  new_customer: UserPlus,
};

export function AdminNotifications() {
  const [open, setOpen] = useState(false);

  const { data: notifications = [], isLoading } =
    trpc.admin.notifications.list.useQuery({ limit: 10 }, { enabled: open });
  const { data: unreadCount = 0 } =
    trpc.admin.notifications.unreadCount.useQuery();

  const utils = trpc.useUtils();

  const markAsReadMutation = trpc.admin.notifications.markAsRead.useMutation({
    onSuccess: () => {
      utils.admin.notifications.list.invalidate();
      utils.admin.notifications.unreadCount.invalidate();
    },
  });

  const markAllAsReadMutation =
    trpc.admin.notifications.markAllAsRead.useMutation({
      onSuccess: () => {
        utils.admin.notifications.list.invalidate();
        utils.admin.notifications.unreadCount.invalidate();
      },
    });

  const deleteMutation = trpc.admin.notifications.delete.useMutation({
    onSuccess: () => {
      utils.admin.notifications.list.invalidate();
      utils.admin.notifications.unreadCount.invalidate();
    },
  });

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
            No notifications
          </div>
        ) : (
          <div className="max-h-80 overflow-y-auto">
            {notifications.map((n) => {
              const Icon = NOTIFICATION_ICONS[n.notificationType] || Bell;
              return (
                <DropdownMenuItem
                  key={n.id}
                  className={`flex gap-3 p-3 cursor-pointer ${
                    !n.isRead ? "bg-muted/50" : ""
                  }`}
                  onClick={() => {
                    if (!n.isRead) {
                      markAsReadMutation.mutate({ id: n.id });
                    }
                  }}
                >
                  <div
                    className={`p-2 rounded-full ${
                      !n.isRead ? "bg-primary/10" : "bg-muted"
                    }`}
                  >
                    <Icon
                      className={`h-4 w-4 ${
                        !n.isRead ? "text-primary" : "text-muted-foreground"
                      }`}
                    />
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
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 shrink-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteMutation.mutate({ id: n.id });
                    }}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </DropdownMenuItem>
              );
            })}
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
