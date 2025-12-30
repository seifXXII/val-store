# Val Store - Complete Project Inventory

**Generated:** 2025-12-30  
**Project:** Val Store E-Commerce Platform

---

## 📂 Directory Structure

```
val-store/
├── 📁 .agent/                    # Workflow definitions
├── 📁 .husky/                    # Git hooks (commit-msg)
├── 📁 clothing-brand-project/    # Planning documentation (8 files)
├── 📁 docs/                      # Additional docs
├── 📁 drizzle/                   # Database migrations
├── 📁 public/                    # Static assets
├── 📁 scripts/                   # Seed scripts
├── 📁 src/                       # Source code (main)
├── 📄 .env.example               # Environment template
├── 📄 .env.local                 # Local environment
├── 📄 .gitignore
├── 📄 auth-schema.ts             # Better Auth schema
├── 📄 components.json            # shadcn/ui config
├── 📄 drizzle.config.ts          # Drizzle config
├── 📄 eslint.config.mjs          # ESLint config
├── 📄 next.config.ts             # Next.js config
├── 📄 package.json
├── 📄 pnpm-lock.yaml
├── 📄 postcss.config.mjs
└── 📄 tsconfig.json              # TypeScript config
```

---

## 📁 Source Code Inventory (`src/`)

### Application Layer (`src/application/`)

| Path                    | Type | Description                 |
| ----------------------- | ---- | --------------------------- |
| `container.ts`          | File | DI container (390 lines)    |
| `interfaces/`           | Dir  | Application interfaces      |
| `use-cases/categories/` | Dir  | Category CRUD use cases     |
| `use-cases/customers/`  | Dir  | Customer use cases          |
| `use-cases/dashboard/`  | Dir  | Dashboard metrics use cases |
| `use-cases/orders/`     | Dir  | Order management use cases  |
| `use-cases/products/`   | Dir  | 10 product use cases        |

#### Use Cases Catalog

| File                                           | Purpose                |
| ---------------------------------------------- | ---------------------- |
| `products/create-product.use-case.ts`          | Create new product     |
| `products/update-product.use-case.ts`          | Update product details |
| `products/get-product.use-case.ts`             | Fetch by ID/slug       |
| `products/list-products.use-case.ts`           | List with filters      |
| `products/delete-product.use-case.ts`          | Soft delete            |
| `products/toggle-product-status.use-case.ts`   | Toggle active          |
| `products/add-product-variant.use-case.ts`     | Add variant            |
| `products/update-variant-stock.use-case.ts`    | Stock update           |
| `products/add-product-image.use-case.ts`       | Add image              |
| `products/remove-product-image.use-case.ts`    | Remove image           |
| `orders/list-orders.use-case.ts`               | List orders            |
| `orders/get-order.use-case.ts`                 | Get order detail       |
| `orders/update-order-status.use-case.ts`       | Update status          |
| `categories/list-categories.use-case.ts`       | List categories        |
| `categories/create-category.use-case.ts`       | Create category        |
| `categories/update-category.use-case.ts`       | Update category        |
| `categories/delete-category.use-case.ts`       | Delete category        |
| `dashboard/get-metrics.use-case.ts`            | Dashboard stats        |
| `dashboard/get-sales-trend.use-case.ts`        | Sales chart            |
| `dashboard/get-recent-orders.use-case.ts`      | Recent orders          |
| `customers/get-or-create-customer.use-case.ts` | Customer lookup        |

---

### Database Layer (`src/db/`)

| File           | Lines | Description           |
| -------------- | ----- | --------------------- |
| `index.ts`     | 42    | Drizzle connection    |
| `schema.ts`    | 785   | All table definitions |
| `relations.ts` | 286   | ORM relations         |

#### Schema Tables (21 total)

| Table                    | Purpose             |
| ------------------------ | ------------------- |
| `user`                   | Better Auth users   |
| `session`                | Auth sessions       |
| `account`                | OAuth accounts      |
| `verification`           | Email verification  |
| `userProfiles`           | User roles          |
| `customers`              | Real human identity |
| `addresses`              | Shipping/billing    |
| `categories`             | Product hierarchy   |
| `products`               | Product catalog     |
| `productVariants`        | Size/color options  |
| `productImages`          | Product gallery     |
| `orders`                 | Customer orders     |
| `orderItems`             | Order line items    |
| `cartItems`              | Shopping cart       |
| `wishlist`               | Saved products      |
| `reviews`                | Product reviews     |
| `coupons`                | Discount codes      |
| `payments`               | Payment records     |
| `inventoryLogs`          | Stock history       |
| `adminNotifications`     | Admin alerts        |
| `siteSettings`           | CMS config          |
| `contentSections`        | CMS content         |
| `contentSectionsHistory` | CMS versions        |
| `featuredItems`          | Featured curation   |

---

### Domain Layer (`src/domain/`)

#### Entities (`src/domain/entities/`)

| File                        | Lines | Entity Type              |
| --------------------------- | ----- | ------------------------ |
| `cart-item.entity.ts`       | ~60   | CartItem                 |
| `category.entity.ts`        | 43    | Category                 |
| `content-section.entity.ts` | 143   | ContentSection + History |
| `customer.entity.ts`        | 140   | Customer                 |
| `featured-item.entity.ts`   | ~55   | FeaturedItem             |
| `order.entity.ts`           | 126   | Order                    |
| `product-image.entity.ts`   | ~70   | ProductImage             |
| `product-variant.entity.ts` | ~95   | ProductVariant           |
| `product.entity.ts`         | 96    | Product                  |
| `site-settings.entity.ts`   | 136   | SiteSettings             |
| `user-profile.entity.ts`    | ~60   | UserProfile              |

#### Interfaces (`src/domain/interfaces/repositories/`)

| File                                      | Methods | Description         |
| ----------------------------------------- | ------- | ------------------- |
| `cart.repository.interface.ts`            | 6       | Cart operations     |
| `category.repository.interface.ts`        | 8       | Category CRUD       |
| `customer.repository.interface.ts`        | 5       | Customer management |
| `dashboard.repository.interface.ts`       | 4       | Dashboard queries   |
| `order.repository.interface.ts`           | 8       | Order operations    |
| `product-image.repository.interface.ts`   | 6       | Image management    |
| `product-variant.repository.interface.ts` | 8       | Variant CRUD        |
| `product.repository.interface.ts`         | 12      | Product operations  |
| `site-config.repository.interface.ts`     | 14      | CMS operations      |
| `user-profile.repository.interface.ts`    | 4       | Profile operations  |

#### Value Objects (`src/domain/value-objects/`)

| File                    | Content                  |
| ----------------------- | ------------------------ |
| `content-schemas.ts`    | 6 Zod schemas for CMS    |
| `phone.value-object.ts` | Phone parsing/formatting |

#### Exceptions (`src/domain/exceptions/`)

| File                             | Purpose      |
| -------------------------------- | ------------ |
| `product-not-found.exception.ts` | Product 404  |
| `duplicate-sku.exception.ts`     | SKU conflict |

---

### Infrastructure Layer (`src/infrastructure/`)

#### Repositories (`src/infrastructure/database/repositories/`)

| File                            | Lines | Implements               |
| ------------------------------- | ----- | ------------------------ |
| `cart.repository.ts`            | ~240  | CartRepository           |
| `category.repository.ts`        | ~220  | CategoryRepository       |
| `customer.repository.ts`        | ~170  | CustomerRepository       |
| `dashboard.repository.ts`       | ~145  | DashboardRepository      |
| `order.repository.ts`           | ~310  | OrderRepository          |
| `product-image.repository.ts`   | ~195  | ProductImageRepository   |
| `product-variant.repository.ts` | ~260  | ProductVariantRepository |
| `product.repository.ts`         | 350   | ProductRepository        |
| `site-config.repository.ts`     | 427   | SiteConfigRepository     |
| `user-profile.repository.ts`    | ~130  | UserProfileRepository    |

#### Services (`src/infrastructure/services/`)

| File                      | Lines | Purpose       |
| ------------------------- | ----- | ------------- |
| `resend-email.service.ts` | 265   | Email sending |

---

### Server Layer (`src/server/`)

#### Core Files

| File       | Lines | Purpose                   |
| ---------- | ----- | ------------------------- |
| `index.ts` | 15    | App router definition     |
| `trpc.ts`  | 96    | tRPC context & procedures |

#### Admin Routers (`src/server/routers/admin/`)

| File            | Lines | Endpoints          |
| --------------- | ----- | ------------------ |
| `categories.ts` | ~55   | Category CRUD      |
| `dashboard.ts`  | ~35   | Metrics endpoints  |
| `images.ts`     | ~85   | Image management   |
| `index.ts`      | 20    | Router aggregation |
| `orders.ts`     | ~60   | Order management   |
| `products.ts`   | 88    | Product CRUD       |
| `settings.ts`   | 299   | CMS endpoints      |
| `variants.ts`   | ~150  | Variant CRUD       |

#### Public Routers (`src/server/routers/public/`)

| File            | Lines | Endpoints          |
| --------------- | ----- | ------------------ |
| `categories.ts` | ~140  | Public categories  |
| `config.ts`     | ~90   | CMS public API     |
| `index.ts`      | 17    | Router aggregation |
| `products.ts`   | 156   | Public products    |

#### Auth Router

| File      | Lines | Purpose               |
| --------- | ----- | --------------------- |
| `auth.ts` | ~40   | Email by phone lookup |

---

### Components (`src/components/`)

#### Admin Components (`src/components/admin/`)

| Path               | Files | Purpose               |
| ------------------ | ----- | --------------------- |
| `AdminHeader.tsx`  | 1     | Admin header          |
| `AdminSidebar.tsx` | 1     | Navigation sidebar    |
| `create-product/`  | ~5    | Product creation form |
| `dashboard/`       | ~5    | Dashboard widgets     |
| `orders-list/`     | ~3    | Orders table          |
| `products-list/`   | ~3    | Products table        |
| `settings/`        | 5     | CMS settings panels   |

#### Settings Components

| File                     | Lines | Purpose           |
| ------------------------ | ----- | ----------------- |
| `AppearanceSettings.tsx` | ~320  | Theme settings    |
| `FeaturedSettings.tsx`   | ~300  | Featured items    |
| `HomepageSettings.tsx`   | 355   | Hero/announcement |
| `StoreSettings.tsx`      | ~310  | Store info        |

#### Auth Components (`src/components/auth/`)

| Path                             | Files | Purpose      |
| -------------------------------- | ----- | ------------ |
| `login/LoginForm.tsx`            | 147   | Login form   |
| `login/LoginCard.tsx`            | ~50   | Card wrapper |
| `login/GoogleSignInButton.tsx`   | ~70   | OAuth button |
| `login/FacebookSignInButton.tsx` | ~50   | OAuth button |
| `signup/SignupForm.tsx`          | ~150  | Registration |

#### Home Components (`src/components/home/`)

| File                            | Lines | Purpose           |
| ------------------------------- | ----- | ----------------- |
| `BrandStory.tsx`                | ~90   | About section     |
| `DynamicFeaturedCategories.tsx` | ~140  | Client categories |
| `DynamicFeaturedProducts.tsx`   | ~125  | Client products   |
| `DynamicHeroSection.tsx`        | 130   | Client hero       |
| `FeaturedCategories.tsx`        | ~100  | Static categories |
| `FeaturedProducts.tsx`          | ~110  | Static products   |
| `HeroScrollIndicator.tsx`       | ~30   | Scroll hint       |
| `HeroSection.tsx`               | ~105  | Static hero       |
| `InstagramFeed.tsx`             | ~85   | Social feed       |
| `NewArrivals.tsx`               | ~170  | Horizontal scroll |
| `NewsletterSection.tsx`         | ~90   | Email signup      |
| `PromoBanner.tsx`               | ~80   | Promo section     |
| `ServerFeaturedCategories.tsx`  | ~145  | RSC categories    |
| `ServerFeaturedProducts.tsx`    | ~115  | RSC products      |
| `ServerHeroSection.tsx`         | ~155  | RSC hero          |
| `TrustIndicators.tsx`           | ~50   | Trust badges      |

#### UI Components (`src/components/ui/`)

| Type                 | Count | Source    |
| -------------------- | ----- | --------- |
| shadcn/ui components | 30+   | Generated |
| Custom components    | 7+    | Custom    |

---

### Pages (`src/app/`)

#### Admin Routes (`src/app/(admin)/`)

| Route                      | Page            | Status         |
| -------------------------- | --------------- | -------------- |
| `/dashboard`               | Admin dashboard | ✅ Implemented |
| `/dashboard/products`      | Products list   | ✅ Implemented |
| `/dashboard/products/new`  | Create product  | ✅ Implemented |
| `/dashboard/products/[id]` | Edit product    | ⚠️ Partial     |
| `/dashboard/orders`        | Orders list     | ✅ Implemented |
| `/dashboard/orders/[id]`   | Order detail    | ⚠️ Partial     |
| `/dashboard/settings`      | CMS settings    | ✅ Implemented |
| `/dashboard/categories`    | Category mgmt   | ❌ Missing     |
| `/dashboard/customers`     | Customer mgmt   | ❌ Missing     |
| `/dashboard/inventory`     | Inventory mgmt  | ❌ Missing     |
| `/dashboard/coupons`       | Coupon mgmt     | ❌ Missing     |
| `/dashboard/reviews`       | Review mgmt     | ❌ Missing     |

#### Auth Routes (`src/app/(auth)/`)

| Route           | Page         | Status         |
| --------------- | ------------ | -------------- |
| `/login`        | Login page   | ✅ Implemented |
| `/signup`       | Signup page  | ✅ Implemented |
| `/verify-email` | Email verify | ✅ Implemented |
| `/check-email`  | Email check  | ✅ Implemented |

#### Main Routes (`src/app/(main)/`)

| Route                 | Page           | Status         |
| --------------------- | -------------- | -------------- |
| `/`                   | Homepage       | ✅ Implemented |
| `/cart`               | Cart page      | ❌ Stub only   |
| `/collections/[slug]` | Category page  | ✅ Implemented |
| `/products/[slug]`    | Product detail | ✅ Implemented |
| `/search`             | Search page    | ⚠️ Minimal     |
| `/account`            | User dashboard | ❌ Missing     |
| `/account/orders`     | Order history  | ❌ Missing     |
| `/account/profile`    | Profile        | ❌ Missing     |
| `/account/addresses`  | Addresses      | ❌ Missing     |
| `/checkout`           | Checkout       | ❌ Missing     |
| `/wishlist`           | Wishlist       | ❌ Missing     |

#### API Routes (`src/app/api/`)

| Route              | Purpose      | Status     |
| ------------------ | ------------ | ---------- |
| `/api/auth/*`      | Better Auth  | ✅ Working |
| `/api/trpc/*`      | tRPC handler | ✅ Working |
| `/api/uploadthing` | File uploads | ✅ Working |

---

### Library Files (`src/lib/`)

| File             | Purpose                   |
| ---------------- | ------------------------- |
| `auth.ts`        | Better Auth server config |
| `auth-client.ts` | Better Auth client        |
| `trpc.ts`        | tRPC client setup         |
| `utils.ts`       | Utility functions         |
| `uploadthing.ts` | File upload config        |

---

## 📊 Summary Statistics

| Category                       | Count   |
| ------------------------------ | ------- |
| **Total TypeScript Files**     | ~120    |
| **Total Lines of Code**        | ~15,000 |
| **Database Tables**            | 21      |
| **Domain Entities**            | 11      |
| **Repository Interfaces**      | 10      |
| **Repository Implementations** | 10      |
| **tRPC Routers**               | 12      |
| **Use Cases**                  | 21      |
| **React Components**           | 50+     |
| **Page Routes**                | 15+     |
| **API Routes**                 | 3       |

---

## 🔗 Dependencies

### Production (32 packages)

- Next.js 16.0.8
- React 19.2.1
- tRPC 11.8.0
- Drizzle ORM 0.45.1
- Better Auth 1.4.7
- Zod 4.1.13
- 26 Radix UI packages
- Tailwind CSS 4
- And more...

### Development (18 packages)

- TypeScript 5
- ESLint 9
- Prettier 3.7.4
- Vitest (not installed)
- And more...

---

_Inventory generated by Senior Full-Stack Developer_
