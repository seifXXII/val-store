"use client";

/**
 * Profile Page
 *
 * Edit user profile information.
 */

import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function ProfilePage() {
  const { data: user } = trpc.public.profile.me.useQuery();
  const utils = trpc.useUtils();

  const [name, setName] = useState(user?.name || "");

  useEffect(() => {
    if (user?.name) {
      setName(user.name);
    }
  }, [user?.name]);

  const updateName = trpc.public.profile.updateName.useMutation({
    onSuccess: () => {
      utils.public.profile.me.invalidate();
      toast("Profile updated");
    },
    onError: (err) => {
      toast.error("Failed to update profile", { description: err.message });
    },
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await updateName.mutateAsync({ name });
    } catch {
      toast.error("Failed to update profile.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Profile Information */}
      <div className="bg-zinc-900 border border-white/10 rounded-lg">
        <div className="p-5 border-b border-white/10">
          <h3 className="text-lg font-semibold text-white">
            Profile Information
          </h3>
          <p className="text-sm text-gray-500">
            Update your personal information.
          </p>
        </div>
        <div className="p-5">
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div className="space-y-2">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-300"
              >
                Name
              </label>
              <input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="w-full px-3 py-2 bg-white/[0.06] border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-val-accent/50 focus:border-val-accent/50 transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-300"
              >
                Email
              </label>
              <input
                id="email"
                value={user?.email || ""}
                disabled
                className="w-full px-3 py-2 bg-white/[0.04] border border-white/10 rounded-lg text-gray-500 cursor-not-allowed"
              />
              <p className="text-xs text-gray-600">Email cannot be changed.</p>
            </div>

            <Button
              type="submit"
              disabled={isLoading || updateName.isPending}
              className="bg-val-accent hover:bg-val-accent/90 text-black font-medium"
            >
              {updateName.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </form>
        </div>
      </div>

      {/* Password */}
      <div className="bg-zinc-900 border border-white/10 rounded-lg">
        <div className="p-5 border-b border-white/10">
          <h3 className="text-lg font-semibold text-white">Password</h3>
          <p className="text-sm text-gray-500">Change your password.</p>
        </div>
        <div className="p-5">
          <a
            href="/forgot-password"
            className="inline-flex items-center px-4 py-2 rounded-lg border border-white/10 text-sm font-medium text-gray-300 hover:bg-white/[0.04] hover:text-white transition-colors"
          >
            Change Password
          </a>
        </div>
      </div>
    </div>
  );
}
