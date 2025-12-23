import { initTRPC } from "@trpc/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import {
  AuthUser,
  getUserRole,
  requireAuth,
  requireAdmin,
} from "./utils/auth-helpers";

/**
 * tRPC Context
 *
 * Context is created for each request and contains the authenticated user (if any).
 */
export interface TRPCContext {
  user: AuthUser | null;
}

/**
 * Create context from request headers
 * Extracts Better Auth session and fetches user role from database
 */
export async function createContext(): Promise<TRPCContext> {
  try {
    // Get session from Better Auth using headers
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return { user: null };
    }

    // Fetch user role from user_profiles table
    const role = await getUserRole(session.user.id);

    return {
      user: {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
        role,
      },
    };
  } catch {
    // If session extraction fails, treat as unauthenticated
    return { user: null };
  }
}

/**
 * Initialization of tRPC backend
 * Should be done only once per backend!
 */
const t = initTRPC.context<TRPCContext>().create();

/**
 * Middleware for protected routes (requires authentication)
 */
const isAuthed = t.middleware(({ ctx, next }) => {
  requireAuth(ctx.user);
  return next({
    ctx: {
      user: ctx.user, // Now guaranteed to be non-null
    },
  });
});

/**
 * Middleware for admin routes (requires admin or super_admin role)
 */
const isAdmin = t.middleware(({ ctx, next }) => {
  requireAuth(ctx.user);
  requireAdmin(ctx.user);
  return next({
    ctx: {
      user: ctx.user,
    },
  });
});

/**
 * Export reusable router and procedure helpers
 */
export const router = t.router;

// Public procedure - no authentication required
export const publicProcedure = t.procedure;

// Protected procedure - requires authentication
export const protectedProcedure = t.procedure.use(isAuthed);

// Admin procedure - requires admin or super_admin role
export const adminProcedure = t.procedure.use(isAdmin);
