"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { User, LogOut, Settings, ShoppingBag } from "lucide-react";
import { signOut } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

interface UserDialogProps {
  user?: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
  } | null;
}

export function UserDialog({ user }: UserDialogProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    // Sign out from Better Auth (clears server session)
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          // Clear any client-side data
          localStorage.removeItem("user");
          // Redirect to login
          router.push("/login");
        },
      },
    });
  };

  if (!user) {
    return (
      <div className="flex gap-2">
        <Button variant="outline" asChild>
          <a href="/login">Sign in</a>
        </Button>
        <Button asChild>
          <a href="/signup">Sign up</a>
        </Button>
      </div>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <User className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Account</DialogTitle>
          <DialogDescription>
            Manage your account settings and preferences
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* User Info */}
          <div className="rounded-lg border p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                <User className="h-6 w-6" />
              </div>
              <div>
                <p className="font-medium">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-sm text-gray-500">{user.email}</p>
                <p className="text-xs text-gray-400 capitalize">{user.role}</p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-2">
            <Button variant="outline" className="w-full justify-start" asChild>
              <a href="/orders">
                <ShoppingBag className="mr-2 h-4 w-4" />
                My Orders
              </a>
            </Button>

            <Button variant="outline" className="w-full justify-start" asChild>
              <a href="/settings">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </a>
            </Button>

            {user.role === "admin" || user.role === "super_admin" ? (
              <Button
                variant="outline"
                className="w-full justify-start"
                asChild
              >
                <a href="/admin">
                  <Settings className="mr-2 h-4 w-4" />
                  Admin Dashboard
                </a>
              </Button>
            ) : null}
          </div>

          {/* Logout */}
          <Button
            variant="destructive"
            className="w-full"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign out
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
