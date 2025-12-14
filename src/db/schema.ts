import {
  pgTable,
  uuid,
  varchar,
  boolean,
  timestamp,
  pgEnum,
  index,
} from "drizzle-orm/pg-core";

// ============================================
// ENUMS
// ============================================

export const userRoleEnum = pgEnum("user_role", [
  "customer",
  "admin",
  "super_admin",
]);

// ============================================
// USERS TABLE (Authentication)
// ============================================

export const users = pgTable(
  "users",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    passwordHash: varchar("password_hash", { length: 255 }).notNull(),
    firstName: varchar("first_name", { length: 100 }).notNull(),
    lastName: varchar("last_name", { length: 100 }).notNull(),
    phone: varchar("phone", { length: 20 }),
    role: userRoleEnum("role").default("customer").notNull(),
    emailVerified: boolean("email_verified").default(false).notNull(),
    isActive: boolean("is_active").default(true).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
    lastLogin: timestamp("last_login"),
  },
  (table) => ({
    emailIdx: index("idx_users_email").on(table.email),
    roleIdx: index("idx_users_role").on(table.role),
  })
);

// Export type for TypeScript
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

// ============================================
// PASSWORD RESET TOKENS TABLE
// ============================================

export const passwordResetTokens = pgTable(
  "password_reset_tokens",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    token: varchar("token", { length: 255 }).notNull().unique(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    userIdIdx: index("idx_reset_tokens_user_id").on(table.userId),
    tokenIdx: index("idx_reset_tokens_token").on(table.token),
  })
);

// Export type for TypeScript
export type PasswordResetToken = typeof passwordResetTokens.$inferSelect;
export type NewPasswordResetToken = typeof passwordResetTokens.$inferInsert;

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
