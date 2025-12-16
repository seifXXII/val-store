import { pgEnum } from "drizzle-orm/pg-core";

// ============================================
// ENUMS
// ============================================

// User role enum for UserProfile table (extends Better Auth)
export const userRoleEnum = pgEnum("user_role", [
  "customer",
  "worker",
  "admin",
]);

// ============================================
// BETTER AUTH TABLES
// ============================================

// Import Better Auth generated schema
export {
  user,
  session,
  account,
  verification,
  userRelations,
  sessionRelations,
  accountRelations,
} from "../../auth-schema";
