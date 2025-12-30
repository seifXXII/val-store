/**
 * Public Router
 *
 * Aggregates all public (no-auth) endpoints for the storefront.
 * Uses publicProcedure - no authentication required.
 */

import { router } from "../../trpc";
import { publicProductsRouter } from "./products";
import { publicCategoriesRouter } from "./categories";
import { publicConfigRouter } from "./config";

export const publicRouter = router({
  products: publicProductsRouter,
  categories: publicCategoriesRouter,
  config: publicConfigRouter,
});
