import { router } from "./trpc";
import { adminRouter } from "./routers/admin";
import { authRouter } from "./routers/auth";
import { publicRouter } from "./routers/public";

// App router - add your routers here
// Auth is handled by Better Auth directly
export const appRouter = router({
  admin: adminRouter,
  auth: authRouter,
  public: publicRouter,
});

export type AppRouter = typeof appRouter;
