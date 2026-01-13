import { router, protectedProcedure } from "@/server/trpc";
import { z } from "zod";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export const profileRouter = router({
  me: protectedProcedure.query(({ ctx }) => ctx.user),

  updateName: protectedProcedure
    .input(
      z.object({
        name: z.string().min(2).max(60),
      })
    )
    .mutation(async ({ input }) => {
      // 1) update name in Better Auth main user table
      await auth.api.updateUser({
        body: {
          name: input.name,
        },
        headers: {
          // forward request headers so Better Auth can resolve the current session
          ...Object.fromEntries((await headers()).entries()),
        },
      });

      return { name: input.name };
    }),
});
