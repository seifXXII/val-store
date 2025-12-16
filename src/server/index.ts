import { router } from "./trpc";

// App router - add your routers here
// Auth is handled by Better Auth directly
export const appRouter = router({
  // Future routers will be added here (products, orders, etc.)
});

export type AppRouter = typeof appRouter;
