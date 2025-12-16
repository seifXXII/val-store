import { router } from "../../trpc";
import { productsRouter } from "./products";
import { dashboardRouter } from "./dashboard";
import { ordersRouter } from "./orders";

export const adminRouter = router({
  products: productsRouter,
  dashboard: dashboardRouter,
  orders: ordersRouter,
});
