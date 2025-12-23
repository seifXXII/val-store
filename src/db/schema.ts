import {
  pgEnum,
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  boolean,
  integer,
  decimal,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ============================================
// ENUMS
// ============================================

// User role enum for UserProfile table (extends Better Auth)
export const userRoleEnum = pgEnum("user_role", [
  "customer",
  "worker",
  "admin",
  "super_admin",
]);

// Address type enum
export const addressTypeEnum = pgEnum("address_type", ["shipping", "billing"]);

// Gender enum for products
export const genderEnum = pgEnum("gender", ["men", "women", "unisex", "kids"]);

// Order status enum
export const orderStatusEnum = pgEnum("order_status", [
  "pending",
  "processing",
  "paid",
  "shipped",
  "delivered",
  "cancelled",
  "refunded",
]);

// Payment method enum
export const paymentMethodEnum = pgEnum("payment_method", [
  "credit_card",
  "debit_card",
  "paypal",
  "stripe",
  "cash_on_delivery",
]);

// Payment status enum
export const paymentStatusEnum = pgEnum("payment_status", [
  "pending",
  "completed",
  "failed",
  "refunded",
]);

// Discount type enum
export const discountTypeEnum = pgEnum("discount_type", [
  "percentage",
  "fixed",
]);

// Inventory change type enum
export const inventoryChangeTypeEnum = pgEnum("inventory_change_type", [
  "restock",
  "sale",
  "adjustment",
  "damaged",
  "return",
]);

// Admin notification type enum
export const notificationTypeEnum = pgEnum("notification_type", [
  "new_order",
  "low_stock",
  "new_review",
  "failed_payment",
  "new_customer",
]);

// ============================================
// BETTER AUTH TABLES
// ============================================

// Import Better Auth generated schema
import {
  user,
  session,
  account,
  verification,
  userRelations,
  sessionRelations,
  accountRelations,
} from "../../auth-schema";

// Re-export for use in the app
export {
  user,
  session,
  account,
  verification,
  userRelations,
  sessionRelations,
  accountRelations,
};

// ============================================
// USER PROFILE TABLE (Extends Better Auth)
// ============================================

export const userProfiles = pgTable("user_profiles", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id")
    .notNull()
    .unique()
    .references(() => user.id, { onDelete: "cascade" }),
  role: userRoleEnum("role").default("customer").notNull(),
  phone: varchar("phone", { length: 20 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ============================================
// ADDRESSES TABLE
// ============================================

export const addresses = pgTable(
  "addresses",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    addressType: addressTypeEnum("address_type").notNull(),
    isDefault: boolean("is_default").default(false).notNull(),
    fullName: varchar("full_name", { length: 200 }).notNull(),
    addressLine1: varchar("address_line1", { length: 255 }).notNull(),
    addressLine2: varchar("address_line2", { length: 255 }),
    city: varchar("city", { length: 100 }).notNull(),
    state: varchar("state", { length: 100 }).notNull(),
    postalCode: varchar("postal_code", { length: 20 }).notNull(),
    country: varchar("country", { length: 100 }).notNull(),
    phone: varchar("phone", { length: 20 }).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    userIdIdx: index("idx_addresses_user_id").on(table.userId),
    isDefaultIdx: index("idx_addresses_is_default").on(table.isDefault),
  })
);

// ============================================
// CATEGORIES TABLE (Self-referencing)
// ============================================

export const categories = pgTable(
  "categories",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 100 }).notNull(),
    slug: varchar("slug", { length: 100 }).notNull().unique(),
    description: text("description"),
    // Parent category ID for hierarchical structure (relation defined below)
    parentId: uuid("parent_id"),
    imageUrl: varchar("image_url", { length: 500 }),
    displayOrder: integer("display_order").default(0).notNull(),
    isActive: boolean("is_active").default(true).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    slugIdx: index("idx_categories_slug").on(table.slug),
    parentIdIdx: index("idx_categories_parent_id").on(table.parentId),
    isActiveIdx: index("idx_categories_is_active").on(table.isActive),
  })
);

// ============================================
// PRODUCTS TABLE
// ============================================

export const products = pgTable(
  "products",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 255 }).notNull(),
    slug: varchar("slug", { length: 255 }).notNull().unique(),
    description: text("description"),
    categoryId: uuid("category_id").references(() => categories.id, {
      onDelete: "set null",
    }),
    sku: varchar("sku", { length: 100 }).notNull().unique(),
    basePrice: decimal("base_price", { precision: 10, scale: 2 }).notNull(),
    salePrice: decimal("sale_price", { precision: 10, scale: 2 }),
    costPrice: decimal("cost_price", { precision: 10, scale: 2 }),
    isActive: boolean("is_active").default(true).notNull(),
    isFeatured: boolean("is_featured").default(false).notNull(),
    gender: genderEnum("gender").default("unisex"),
    material: varchar("material", { length: 255 }),
    careInstructions: text("care_instructions"),
    metaTitle: varchar("meta_title", { length: 255 }),
    metaDescription: text("meta_description"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    slugIdx: index("idx_products_slug").on(table.slug),
    skuIdx: index("idx_products_sku").on(table.sku),
    categoryIdIdx: index("idx_products_category_id").on(table.categoryId),
    isActiveIdx: index("idx_products_is_active").on(table.isActive),
    isFeaturedIdx: index("idx_products_is_featured").on(table.isFeatured),
  })
);

// ============================================
// PRODUCT VARIANTS TABLE
// ============================================

export const productVariants = pgTable(
  "product_variants",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    sku: varchar("sku", { length: 100 }).notNull().unique(),
    size: varchar("size", { length: 50 }),
    color: varchar("color", { length: 50 }),
    stockQuantity: integer("stock_quantity").default(0).notNull(),
    priceAdjustment: decimal("price_adjustment", {
      precision: 10,
      scale: 2,
    }).default("0"),
    isAvailable: boolean("is_available").default(true).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    productIdIdx: index("idx_variants_product_id").on(table.productId),
    skuIdx: index("idx_variants_sku").on(table.sku),
    isAvailableIdx: index("idx_variants_is_available").on(table.isAvailable),
  })
);

// ============================================
// PRODUCT IMAGES TABLE
// ============================================

export const productImages = pgTable(
  "product_images",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    imageUrl: varchar("image_url", { length: 500 }).notNull(),
    altText: varchar("alt_text", { length: 255 }),
    displayOrder: integer("display_order").default(0).notNull(),
    isPrimary: boolean("is_primary").default(false).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    productIdIdx: index("idx_images_product_id").on(table.productId),
    isPrimaryIdx: index("idx_images_is_primary").on(table.isPrimary),
  })
);

// ============================================
// ORDERS TABLE
// ============================================

export const orders = pgTable(
  "orders",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    orderNumber: varchar("order_number", { length: 50 }).notNull().unique(),
    userId: text("user_id").references(() => user.id, { onDelete: "set null" }),
    status: orderStatusEnum("status").default("pending").notNull(),
    subtotal: decimal("subtotal", { precision: 10, scale: 2 }).notNull(),
    taxAmount: decimal("tax_amount", { precision: 10, scale: 2 })
      .default("0")
      .notNull(),
    shippingAmount: decimal("shipping_amount", { precision: 10, scale: 2 })
      .default("0")
      .notNull(),
    discountAmount: decimal("discount_amount", { precision: 10, scale: 2 })
      .default("0")
      .notNull(),
    totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
    currency: varchar("currency", { length: 3 }).default("USD").notNull(),
    shippingAddressId: uuid("shipping_address_id").references(
      () => addresses.id
    ),
    billingAddressId: uuid("billing_address_id").references(() => addresses.id),
    customerNotes: text("customer_notes"),
    adminNotes: text("admin_notes"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
    shippedAt: timestamp("shipped_at"),
    deliveredAt: timestamp("delivered_at"),
  },
  (table) => ({
    userIdIdx: index("idx_orders_user_id").on(table.userId),
    orderNumberIdx: index("idx_orders_order_number").on(table.orderNumber),
    statusIdx: index("idx_orders_status").on(table.status),
    createdAtIdx: index("idx_orders_created_at").on(table.createdAt),
  })
);

// ============================================
// ORDER ITEMS TABLE
// ============================================

export const orderItems = pgTable(
  "order_items",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    orderId: uuid("order_id")
      .notNull()
      .references(() => orders.id, { onDelete: "cascade" }),
    productId: uuid("product_id").references(() => products.id, {
      onDelete: "set null",
    }),
    variantId: uuid("variant_id").references(() => productVariants.id, {
      onDelete: "set null",
    }),
    productName: varchar("product_name", { length: 255 }).notNull(),
    variantDetails: varchar("variant_details", { length: 255 }),
    quantity: integer("quantity").notNull(),
    unitPrice: decimal("unit_price", { precision: 10, scale: 2 }).notNull(),
    totalPrice: decimal("total_price", { precision: 10, scale: 2 }).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    orderIdIdx: index("idx_order_items_order_id").on(table.orderId),
    productIdIdx: index("idx_order_items_product_id").on(table.productId),
  })
);

// ============================================
// SHOPPING CART TABLE
// ============================================

export const cartItems = pgTable(
  "cart_items",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    variantId: uuid("variant_id").references(() => productVariants.id, {
      onDelete: "cascade",
    }),
    quantity: integer("quantity").default(1).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    userIdIdx: index("idx_cart_user_id").on(table.userId),
    productIdIdx: index("idx_cart_product_id").on(table.productId),
  })
);

// ============================================
// WISHLIST TABLE
// ============================================

export const wishlist = pgTable(
  "wishlist",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    userIdIdx: index("idx_wishlist_user_id").on(table.userId),
    productIdIdx: index("idx_wishlist_product_id").on(table.productId),
    uniqueWishlistIdx: uniqueIndex("idx_wishlist_unique").on(
      table.userId,
      table.productId
    ),
  })
);

// ============================================
// REVIEWS TABLE
// ============================================

export const reviews = pgTable(
  "reviews",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    orderId: uuid("order_id").references(() => orders.id, {
      onDelete: "set null",
    }),
    rating: integer("rating").notNull(),
    title: varchar("title", { length: 255 }),
    comment: text("comment"),
    isVerifiedPurchase: boolean("is_verified_purchase")
      .default(false)
      .notNull(),
    isApproved: boolean("is_approved").default(false).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    productIdIdx: index("idx_reviews_product_id").on(table.productId),
    userIdIdx: index("idx_reviews_user_id").on(table.userId),
    isApprovedIdx: index("idx_reviews_is_approved").on(table.isApproved),
  })
);

// ============================================
// COUPONS TABLE
// ============================================

export const coupons = pgTable(
  "coupons",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    code: varchar("code", { length: 50 }).notNull().unique(),
    description: text("description"),
    discountType: discountTypeEnum("discount_type").notNull(),
    discountValue: decimal("discount_value", {
      precision: 10,
      scale: 2,
    }).notNull(),
    minPurchaseAmount: decimal("min_purchase_amount", {
      precision: 10,
      scale: 2,
    }),
    maxDiscountAmount: decimal("max_discount_amount", {
      precision: 10,
      scale: 2,
    }),
    usageLimit: integer("usage_limit"),
    usageCount: integer("usage_count").default(0).notNull(),
    perUserLimit: integer("per_user_limit").default(1).notNull(),
    isActive: boolean("is_active").default(true).notNull(),
    startsAt: timestamp("starts_at"),
    expiresAt: timestamp("expires_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    codeIdx: index("idx_coupons_code").on(table.code),
    isActiveIdx: index("idx_coupons_is_active").on(table.isActive),
  })
);

// ============================================
// PAYMENTS TABLE
// ============================================

export const payments = pgTable(
  "payments",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    orderId: uuid("order_id")
      .notNull()
      .references(() => orders.id, { onDelete: "cascade" }),
    paymentMethod: paymentMethodEnum("payment_method").notNull(),
    paymentStatus: paymentStatusEnum("payment_status")
      .default("pending")
      .notNull(),
    amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
    currency: varchar("currency", { length: 3 }).default("USD").notNull(),
    transactionId: varchar("transaction_id", { length: 255 }),
    paymentGatewayResponse: text("payment_gateway_response"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    orderIdIdx: index("idx_payments_order_id").on(table.orderId),
    paymentStatusIdx: index("idx_payments_status").on(table.paymentStatus),
    transactionIdIdx: index("idx_payments_transaction_id").on(
      table.transactionId
    ),
  })
);

// ============================================
// INVENTORY LOGS TABLE
// ============================================

export const inventoryLogs = pgTable(
  "inventory_logs",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    variantId: uuid("variant_id")
      .notNull()
      .references(() => productVariants.id, { onDelete: "cascade" }),
    changeType: inventoryChangeTypeEnum("change_type").notNull(),
    quantityChange: integer("quantity_change").notNull(),
    previousQuantity: integer("previous_quantity").notNull(),
    newQuantity: integer("new_quantity").notNull(),
    reason: text("reason"),
    createdBy: text("created_by").references(() => user.id),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    variantIdIdx: index("idx_inventory_variant_id").on(table.variantId),
    createdAtIdx: index("idx_inventory_created_at").on(table.createdAt),
  })
);

// ============================================
// ADMIN NOTIFICATIONS TABLE
// ============================================

export const adminNotifications = pgTable(
  "admin_notifications",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    adminUserId: text("admin_user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    notificationType: notificationTypeEnum("notification_type").notNull(),
    title: varchar("title", { length: 255 }).notNull(),
    message: text("message").notNull(),
    relatedEntityId: uuid("related_entity_id"),
    isRead: boolean("is_read").default(false).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    adminUserIdIdx: index("idx_notifications_admin_user_id").on(
      table.adminUserId
    ),
    isReadIdx: index("idx_notifications_is_read").on(table.isRead),
    createdAtIdx: index("idx_notifications_created_at").on(table.createdAt),
  })
);

// ============================================
// TYPE EXPORTS
// ============================================

export type UserProfile = typeof userProfiles.$inferSelect;
export type NewUserProfile = typeof userProfiles.$inferInsert;

export type Address = typeof addresses.$inferSelect;
export type NewAddress = typeof addresses.$inferInsert;

export type Category = typeof categories.$inferSelect;
export type NewCategory = typeof categories.$inferInsert;

export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;

export type ProductVariant = typeof productVariants.$inferSelect;
export type NewProductVariant = typeof productVariants.$inferInsert;

export type ProductImage = typeof productImages.$inferSelect;
export type NewProductImage = typeof productImages.$inferInsert;

export type Order = typeof orders.$inferSelect;
export type NewOrder = typeof orders.$inferInsert;

export type OrderItem = typeof orderItems.$inferSelect;
export type NewOrderItem = typeof orderItems.$inferInsert;

export type CartItem = typeof cartItems.$inferSelect;
export type NewCartItem = typeof cartItems.$inferInsert;

export type Wishlist = typeof wishlist.$inferSelect;
export type NewWishlist = typeof wishlist.$inferInsert;

export type Review = typeof reviews.$inferSelect;
export type NewReview = typeof reviews.$inferInsert;

export type Coupon = typeof coupons.$inferSelect;
export type NewCoupon = typeof coupons.$inferInsert;

export type Payment = typeof payments.$inferSelect;
export type NewPayment = typeof payments.$inferInsert;

export type InventoryLog = typeof inventoryLogs.$inferSelect;
export type NewInventoryLog = typeof inventoryLogs.$inferInsert;

export type AdminNotification = typeof adminNotifications.$inferSelect;
export type NewAdminNotification = typeof adminNotifications.$inferInsert;

// ============================================
// RELATIONS (for self-referencing and complex joins)
// ============================================

// Category relations - handles parent/child hierarchy
export const categoryRelations = relations(categories, ({ one, many }) => ({
  parent: one(categories, {
    fields: [categories.parentId],
    references: [categories.id],
    relationName: "categoryHierarchy",
  }),
  children: many(categories, {
    relationName: "categoryHierarchy",
  }),
}));
