import { httpBatchLink } from "@trpc/client";
import { createTRPCReact } from "@trpc/react-query";
import type { AppRouter } from "@/server";

export const trpc = createTRPCReact<AppRouter>();

export function getTRPCUrl() {
  if (typeof window !== "undefined") {
    // Browser should use relative path
    return "/api/trpc";
  }

  // SSR should use absolute URL
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}/api/trpc`;
  }

  return `http://localhost:${process.env.PORT ?? 3000}/api/trpc`;
}

export const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: getTRPCUrl(),
    }),
  ],
});
