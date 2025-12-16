import { router } from "./trpc";
import { adminRouter } from "./routers/admin";

// App router - add your routers here
// Auth is handled by Better Auth directly
export const appRouter = router({
  admin: adminRouter,
});

export type AppRouter = typeof appRouter;
