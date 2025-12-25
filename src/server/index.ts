import { router } from "./trpc";
import { adminRouter } from "./routers/admin";
import { authRouter } from "./routers/auth";

// App router - add your routers here
// Auth is handled by Better Auth directly
export const appRouter = router({
  admin: adminRouter,
  auth: authRouter,
});

export type AppRouter = typeof appRouter;
