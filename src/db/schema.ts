import {
  pgEnum,
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

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

// ============================================
// USER PROFILE TABLE (Extends Better Auth)
// ============================================

export const userProfiles = pgTable("user_profiles", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id").notNull().unique(), // FK to Better Auth user.id
  role: userRoleEnum("role").default("customer").notNull(),
  phone: varchar("phone", { length: 20 }),
  shippingAddress: text("shipping_address"),
  billingAddress: text("billing_address"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Export types for TypeScript
export type UserProfile = typeof userProfiles.$inferSelect;
export type NewUserProfile = typeof userProfiles.$inferInsert;
