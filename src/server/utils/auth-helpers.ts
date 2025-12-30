/**
 * Authentication Helpers
 *
 * Utility functions for authentication and authorization in tRPC context.
 */

import { TRPCError } from "@trpc/server";
import { db } from "@/db";
import { userProfiles } from "@/db/schema";
import { eq } from "drizzle-orm";

// User roles that have admin access
const ADMIN_ROLES = ["admin", "super_admin"] as const;

export type UserRole = "customer" | "worker" | "admin" | "super_admin";

export interface AuthUser {
  id: string;
  email: string;
  name: string | null;
  role: UserRole;
}

/**
 * Check if a user has admin privileges
 */
export function isAdmin(user: AuthUser): boolean {
  return ADMIN_ROLES.includes(user.role as (typeof ADMIN_ROLES)[number]);
}

/**
 * Get user role from user_profiles table
 * Better Auth stores basic user info, but role is in our user_profiles table
 */
export async function getUserRole(userId: string): Promise<UserRole> {
  const [profile] = await db
    .select({ role: userProfiles.role })
    .from(userProfiles)
    .where(eq(userProfiles.userId, userId))
    .limit(1);

  // If no profile exists, default to customer
  return (profile?.role as UserRole) ?? "customer";
}

/**
 * Require user to be authenticated
 * Throws UNAUTHORIZED if no user in context
 */
export function requireAuth(user: AuthUser | null): asserts user is AuthUser {
  if (!user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "You must be logged in to access this resource",
    });
  }
}

/**
 * Require user to have one of the specified roles
 * Throws FORBIDDEN if user doesn't have required role
 */
export function requireRole(user: AuthUser, roles: UserRole[]): void {
  if (!roles.includes(user.role)) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "You do not have permission to access this resource",
    });
  }
}

/**
 * Require user to be an admin (admin or super_admin)
 * Convenience wrapper for requireRole
 */
export function requireAdmin(user: AuthUser): void {
  requireRole(user, ["admin", "super_admin"]);
}
