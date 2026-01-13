import { protectedProcedure, publicProcedure, router } from "@/server/trpc";

export const userRouter = router({
  getSession: publicProcedure.query(({ ctx }) => {
    return ctx.user;
  }),
});
