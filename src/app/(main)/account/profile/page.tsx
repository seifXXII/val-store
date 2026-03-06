"use client";

/**
 * Profile Page
 *
 * Edit user profile information.
 */

import { trpc } from "@/lib/trpc";
import { ProfileForm } from "@/components/account/profile/ProfileForm";
import { ProfilePasswordCard } from "@/components/account/profile/ProfilePasswordCard";

export default function ProfilePage() {
  const { data: user } = trpc.public.profile.me.useQuery();

  return (
    <div className="space-y-6">
      <ProfileForm user={user} />
      <ProfilePasswordCard />
    </div>
  );
}
