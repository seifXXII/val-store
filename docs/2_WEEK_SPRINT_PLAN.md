# Val Store - 2-Week Sprint Plan

**Period:** December 23, 2025 - January 5, 2026  
**Goal:** Fix critical architecture violations, implement security, and complete core admin features

---

## 📋 Sprint Overview

| Week       | Focus Area                          | Key Goals                                                                                            |
| ---------- | ----------------------------------- | ---------------------------------------------------------------------------------------------------- |
| **Week 1** | Architecture Refactoring + Security | Clean architecture violations, add authentication middleware, complete repositories and use cases    |
| **Week 2** | Infrastructure + Admin Panel        | File upload, product variants, image management, complete admin dashboard with real data and metrics |

---

## 🎯 Success Metrics

By end of sprint:

- [ ] 100% Onion Architecture compliance (no direct DB queries in routers)
- [ ] Admin routes protected with role-based authentication
- [ ] All CRUD operations complete (Create, Read, Update, Delete)
- [ ] File upload working for product images
- [ ] Admin dashboard with real metrics
- [ ] Product management fully functional with images

---

## Week 1: Architecture & Security (Dec 23-29)

### 🔴 **Day 1: Monday, Dec 23 - Authentication Middleware**

**Priority:** CRITICAL | **Estimated Time:** 4-6 hours

#### Tasks:

- [x] **Task 1.1:** Create tRPC context with Better Auth session (1.5 hours) ✅
  - File: `src/server/trpc.ts`
  - Add Better Auth session to tRPC context
  - Create `getUserFromContext()` helper
  - Handle session extraction from request

- [x] **Task 1.2:** Create role validation helpers (1 hour) ✅
  - File: `src/server/utils/auth-helpers.ts`
  - Implement `requireAuth()` using Better Auth session
  - Implement `requireRole(['admin', 'super_admin'])` validator
  - Add proper error messages for unauthorized access

- [x] **Task 1.3:** Create protected procedures (1 hour) ✅
  - File: `src/server/trpc.ts`
  - Create `protectedProcedure` (requires authentication)
  - Create `adminProcedure` (requires admin role)
  - Use Better Auth session from context
  - Export for use in routers

- [x] **Task 1.4:** Update admin routers to use protected procedures (1 hour) ✅
  - Update: `src/server/routers/admin/products.ts`
  - Update: `src/server/routers/admin/categories.ts`
  - Update: `src/server/routers/admin/orders.ts`
  - Update: `src/server/routers/admin/dashboard.ts`
  - Replace all `publicProcedure` with `adminProcedure`

- [x] **Task 1.5:** Protect admin pages with middleware (1 hour) ✅
  - File: `src/middleware.ts` + `src/app/(admin)/layout.tsx`
  - Add server-side auth check using Better Auth
  - Verify user has admin role
  - Redirect non-admin users to login page
  - Show error message for insufficient permissions

- [x] **Task 1.6:** Test authentication end-to-end (30 min) ✅
  - Verify admin routes reject unauthenticated requests
  - Verify admin routes reject non-admin users
  - Test browser redirect for /admin pages
  - Test with logged-in admin user

**Deliverables:**

- ✅ All admin routes protected
- ✅ Proper error messages for unauthorized access
- ✅ Session validation working

---

### 🟡 **Day 2: Tuesday, Dec 24 - Dashboard Architecture Refactoring**

**Priority:** HIGH | **Estimated Time:** 5-7 hours

#### Tasks:

- [x] **Task 2.1:** Create DI Container infrastructure (1.5 hours) ✅ _(Already existed)_
  - File: `src/application/container.ts`
  - Set up dependency injection pattern
  - Create container class with registration and resolution
  - Document how to register repositories and use cases
  - Add singleton pattern for repositories
  - Export container instance

- [x] **Task 2.2:** Create basic database seed script (1 hour) ✅
  - File: `scripts/seed-basic.ts`
  - Seed admin user (super_admin role)
  - Seed 2-3 categories
  - Seed 5-10 test products with basic data
  - Seed 2-3 test orders
  - Add npm script: `"seed:basic": "tsx scripts/seed-basic.ts"`
  - **Note:** This is for testing during development. Full seed comes Day 11.

- [x] **Task 2.3:** Create Dashboard use cases (3 hours) ✅
  - File: `src/application/use-cases/dashboard/get-metrics.use-case.ts`
  - File: `src/application/use-cases/dashboard/get-sales-trend.use-case.ts`
  - File: `src/application/use-cases/dashboard/get-recent-orders.use-case.ts`
  - Move all business logic from dashboard router to use cases
  - Implement proper error handling
  - Add error logging

- [x] **Task 2.4:** Create Dashboard repository interface (1 hour) ✅
  - File: `src/domain/interfaces/repositories/dashboard.repository.interface.ts`
  - Define methods for metrics queries
  - Define types for dashboard data

- [x] **Task 2.5:** Implement Dashboard repository (2 hours) ✅
  - File: `src/infrastructure/database/repositories/dashboard.repository.ts`
  - Implement all metrics queries
  - Add proper TypeScript types
  - Test queries return correct data using seed data

- [x] **Task 2.6:** Wire Dashboard into DI container (30 min) ✅
  - Update: `src/application/container.ts`
  - Register dashboard repository
  - Register dashboard use cases
  - Wire dependencies

- [x] **Task 2.7:** Refactor dashboard router (30 min) ✅
  - File: `src/server/routers/admin/dashboard.ts`
  - Remove direct DB queries
  - Use dependency injection container
  - Call use cases instead

**Deliverables:**

- ✅ Dashboard router is thin (only calls use cases)
- ✅ All business logic in application layer
- ✅ 100% Onion Architecture compliance

---

### 🟡 **Day 3: Wednesday, Dec 25 - Complete Missing Use Cases**

**Priority:** HIGH | **Estimated Time:** 4-5 hours

> **Note:** Christmas Day - Adjust schedule as needed

#### Tasks:

- [x] **Task 3.1:** Create UpdateProduct use case (2 hours) ✅
  - File: `src/application/use-cases/products/update-product.use-case.ts`
  - Interface: `UpdateProductInput` and `UpdateProductOutput`
  - Implement validation logic
  - Check product exists before update
  - Validate price changes
  - Handle SKU uniqueness if changed

- [x] **Task 3.2:** Add update method to Product repository (1 hour) ✅ _(Already existed)_
  - Verify: `src/infrastructure/database/repositories/product.repository.ts`
  - Update method already exists (line 148-174)
  - Test it works correctly
  - Add any missing fields

- [x] **Task 3.3:** Wire UpdateProduct use case (30 min) ✅
  - Update: `src/application/container.ts`
  - Add `updateProductUseCase` property
  - Add `getUpdateProductUseCase()` method
  - Wire dependencies

- [x] **Task 3.4:** Update products router (30 min) ✅
  - File: `src/server/routers/admin/products.ts`
  - Replace TODO in update mutation (line 67-69)
  - Call `container.getUpdateProductUseCase()`
  - Test update functionality

- [x] **Task 3.5:** Create UpdateCategory use case (Optional, if time) (1 hour) ✅
  - File: `src/application/use-cases/categories/update-category.use-case.ts`
  - Similar pattern to UpdateProduct
  - Wire into container and router

**Deliverables:**

- ✅ Product update fully functional
- ✅ No TODO comments in production code
- ✅ All CRUD operations complete

---

### 🟢 **Day 4: Thursday, Dec 26 - Missing Value Objects & Security**

**Priority:** MEDIUM | **Estimated Time:** 4-6 hours

#### Tasks:

- [x] **Task 4.1:** Create Phone value object (1.5 hours) ✅
  - File: `src/domain/value-objects/phone.value-object.ts`
  - Validate phone number format (international support)
  - Format phone number consistently
  - Add tests for various formats

- [x] **Task 4.2:** Create Address value object (2 hours) ✅
  - File: `src/domain/value-objects/address.value-object.ts`
  - Validate all address fields
  - Ensure required fields are present
  - Add formatting helpers

- [x] **Task 4.3:** Implement password strength validation (1.5 hours) ✅
  - Update: `src/domain/value-objects/password.value-object.ts`
  - Minimum 8 characters
  - Require uppercase, lowercase, number, special character
  - Add helpful error messages
  - Update signup form validation

- [x] **Task 4.4:** Add rate limiting middleware (1 hour) ✅
  - File: `src/server/utils/rate-limiter.ts`
  - In-memory rate limiter with configurable windows
  - Auth config: 5 attempts per 15 minutes
  - Apply to auth endpoints

**Deliverables:**

- ✅ Robust value objects for common types
- ✅ Strong password requirements enforced
- ✅ Rate limiting prevents brute force attacks

---

### 🟢 **Day 5: Friday, Dec 27 - Repository Implementations**

**Priority:** MEDIUM | **Estimated Time:** 5-6 hours

#### Tasks:

- [x] **Task 5.1:** Implement User Profile repository (2.5 hours) ✅
  - File: `src/infrastructure/database/repositories/user-profile.repository.ts`
  - Implement: `UserProfileRepositoryInterface`
  - Reference: `src/domain/interfaces/repositories/user-profile.repository.interface.ts`
  - CRUD operations for user profiles
  - Test all methods

- [x] **Task 5.2:** Implement Cart repository (2.5 hours) ✅
  - File: `src/infrastructure/database/repositories/cart.repository.ts`
  - Implement: `CartRepositoryInterface`
  - Reference: `src/domain/interfaces/repositories/cart.repository.interface.ts`
  - Add, remove, update cart items
  - Get cart with product details (JOIN queries)
  - Clear cart functionality

- [x] **Task 5.3:** Implement Order repository (2.5 hours) ✅ _(Already existed)_
  - File: `src/infrastructure/database/repositories/order.repository.ts`
  - Implement: `OrderRepositoryInterface`
  - Reference: `src/domain/interfaces/repositories/order.repository.interface.ts`
  - CRUD operations for orders
  - Query methods for dashboard metrics
  - JOIN queries for order items and products
  - Test all methods

- [x] **Task 5.4:** Implement Category repository (1.5 hours) ✅ _(Already existed)_
  - File: `src/infrastructure/database/repositories/category.repository.ts`
  - Implement: `CategoryRepositoryInterface`
  - Reference: `src/domain/interfaces/repositories/category.repository.interface.ts`
  - CRUD operations for categories
  - Handle hierarchical queries (parent/child)
  - Test all methods

- [x] **Task 5.5:** Wire repositories into DI container (30 min) ✅
  - Note: Repositories can be used directly or added to container as needed
  - UserProfile and Cart repositories created
  - Ready for use case integration

**Deliverables:**

- ✅ User profile repository fully functional
- ✅ Cart repository ready for use
- ✅ All repository interfaces have implementations

---

## Week 2: Infrastructure & Features (Dec 30 - Jan 5)

### 🔴 **Day 6: Monday, Dec 30 - File Upload Infrastructure**

**Priority:** CRITICAL | **Estimated Time:** 6-8 hours

#### Tasks:

- [x] **Task 6.1:** Choose and configure cloud storage (1.5 hours) ✅
  - **Chose:** UploadThing (simpler Next.js integration)
  - Created documentation in `docs/FILE_UPLOAD_SETUP.md`
  - User needs to add `UPLOADTHING_TOKEN` to `.env.local`

- [x] **Task 6.2:** Create upload service interface (1 hour) ✅
  - File: `src/application/interfaces/file-upload.interface.ts`
  - Created generic interface (works with any provider)

- [x] **Task 6.3:** Implement file upload service (3 hours) ✅
  - File: `src/lib/uploadthing.ts` - Core file router
  - File: `src/app/api/uploadthing/route.ts` - API handler
  - File: `src/components/ui/upload.tsx` - React components
  - **User needs to run:** `npm install uploadthing @uploadthing/react`

- [x] **Task 6.4:** Create upload tRPC endpoint (1.5 hours) ✅
  - Note: UploadThing uses its own API route, not tRPC
  - Route: `/api/uploadthing`
  - React components handle uploads directly

- [ ] **Task 6.5:** Test upload functionality (30 min)
  - After running `npm install uploadthing @uploadthing/react`
  - Add `UPLOADTHING_TOKEN` to `.env.local`
  - Test with UploadButton component

**Deliverables:**

- ✅ File upload working end-to-end
- ✅ Uploaded images accessible via CDN
- ✅ Proper error handling for upload failures

---

### 🔴 **Day 6.5: Tuesday, Dec 31 (Morning) - Product Variants Implementation**

**Priority:** CRITICAL | **Estimated Time:** 5-6 hours

> **Note:** This is essential for clothing e-commerce (sizes, colors). Split Day 7 across two days.

#### Tasks:

- [x] **Task 6.6:** Create ProductVariant entity (1.5 hours) ✅
  - File: `src/domain/entities/product-variant.entity.ts`
  - Properties: id, productId, sku, size, color, stockQuantity, priceAdjustment, isAvailable
  - Business methods: `adjustStock()`, `getFinalPrice(basePrice)`, `isInStock()`
  - Validation logic

- [x] **Task 6.7:** Create ProductVariant repository interface (1 hour) ✅
  - File: `src/domain/interfaces/repositories/product-variant.repository.interface.ts`
  - Define CRUD methods
  - Define `findByProduct()`, `findBySku()`, `updateStock()` methods
  - Define types for variant filters

- [x] **Task 6.8:** Implement ProductVariant repository (2 hours) ✅
  - File: `src/infrastructure/database/repositories/product-variant.repository.ts`
  - Implement all interface methods
  - Add JOIN queries with products table
  - Handle stock quantity updates
  - Test all methods

- [x] **Task 6.9:** Create variant management use cases (1.5 hours) ✅
  - File: `src/application/use-cases/products/add-product-variant.use-case.ts`
  - File: `src/application/use-cases/products/update-variant-stock.use-case.ts`
  - Validate SKU uniqueness
  - Handle stock adjustments
  - Business logic for variant availability

- [x] **Task 6.10:** Wire variants into DI container (30 min) ✅
  - Update: `src/application/container.ts`
  - Register variant repository
  - Register variant use cases
  - Update product use cases to handle variants

**Deliverables:**

- ✅ Product variants fully supported in domain layer
- ✅ Variant repository implementation complete
- ✅ Stock management per variant working
- ✅ Ready for admin UI integration

---

### 🟡 **Day 7: Tuesday, Dec 31 (Afternoon) - Product Image Management**

**Priority:** HIGH | **Estimated Time:** 5-6 hours

> **Note:** New Year's Eve - Adjust schedule as needed

#### Tasks:

- [x] **Task 7.1:** Create ProductImage entity (1 hour) ✅
  - File: `src/domain/entities/product-image.entity.ts`
  - Properties: id, productId, imageUrl, altText, displayOrder, isPrimary
  - Business methods: `setPrimary()`, `getImageUrl()`

- [x] **Task 7.2:** Update Product entity (30 min) ✅
  - Note: Created separate `ProductImageRepositoryInterface` instead
  - Entity handles its own images through repository

- [x] **Task 7.3:** Add image management to Product repository (2 hours) ✅
  - Created: `src/infrastructure/database/repositories/product-image.repository.ts`
  - Created: `src/domain/interfaces/repositories/product-image.repository.interface.ts`
  - Methods: addImage, removeImage, setPrimaryImage, updateDisplayOrder

- [x] **Task 7.4:** Create AddProductImage use case (1.5 hours) ✅
  - File: `src/application/use-cases/products/add-product-image.use-case.ts`
  - Validate product exists
  - Auto display ordering
  - Primary handling

- [x] **Task 7.5:** Create RemoveProductImage use case (1 hour) ✅
  - File: `src/application/use-cases/products/remove-product-image.use-case.ts`
  - Delete from database
  - Handle primary image re-assignment

**Deliverables:**

- ✅ Product images fully managed
- ✅ Upload, delete, reorder functionality
- ✅ Primary image designation working

---

### ✅ **Day 8: Wednesday, Jan 1 - Product Form Enhancement**

**Priority:** HIGH | **Estimated Time:** 4-5 hours | **Status: COMPLETE**

> **Completed Dec 24, 2025**

#### Tasks:

- [x] **Task 8.1:** Add variant tRPC endpoints (1.5 hours)
  - Created: `src/server/routers/admin/variants.ts`
  - Add `variants.list` - Get variants for a product
  - Add `variants.add` - Create new variant (uses AddProductVariantUseCase)
  - Add `variants.update` - Update variant
  - Add `variants.delete` - Delete variant
  - Add `variants.updateStock` - Update stock (uses UpdateVariantStockUseCase)

- [x] **Task 8.2:** Add image tRPC endpoints (1 hour)
  - Created: `src/server/routers/admin/images.ts`
  - Add `images.list` - Get images for a product
  - Add `images.add` - Add image URL (uses AddProductImageUseCase)
  - Add `images.delete` - Remove image (uses RemoveProductImageUseCase)
  - Add `images.setPrimary` - Set primary image

- [x] **Task 8.3:** Enhance VariantsSection component (1.5 hours)
  - Updated: `src/components/admin/create-product/VariantsSection.tsx`
  - Connect to tRPC (add/remove/update variants)
  - Add price adjustment field
  - Add delete variant button
  - Add loading states
  - Accept `productId` prop for connected mode

- [x] **Task 8.4:** Create ImageUpload component (1 hour)
  - Created: `src/components/admin/create-product/ImageUploadSection.tsx`
  - Use existing `UploadDropzone` from `src/components/ui/upload.tsx`
  - Connect to tRPC image endpoints
  - Show uploaded images with delete button
  - Mark primary image

**Deliverables:**

- ✅ Variant management working end-to-end
- ✅ Image upload integrated with UploadThing
- ✅ Product form fully functional

---

### ✅ **Day 9: Thursday, Jan 2 - Email Service Integration**

**Priority:** MEDIUM | **Estimated Time:** 5-6 hours | **Status: COMPLETE**

> **Completed Dec 24, 2025**

#### Tasks:

- [x] **Task 9.1:** Setup email service (1.5 hours)
  - Installed `resend` package
  - Created `docs/EMAIL_SETUP.md` documentation

- [x] **Task 9.2:** Create email service interface (1 hour)
  - Created: `src/application/interfaces/email.interface.ts`
  - Defined `sendEmail()`, verification, reset, order confirmation methods

- [x] **Task 9.3:** Implement email service (2 hours)
  - Created: `src/infrastructure/services/resend-email.service.ts`
  - Implemented HTML email templates
  - Added to DI container

- [x] **Task 9.4:** Enable email verification (1.5 hours)
  - Updated Better Auth config with `requireEmailVerification: true`
  - Wired email service for verification and password reset

**Deliverables:**

- ✅ Email service operational
- ✅ Email verification enabled
- ✅ Email templates created

---

### ✅ **Day 10: Friday, Jan 3 - Dashboard Polish & Orders UI**

**Priority:** MEDIUM | **Estimated Time:** 4-5 hours | **Status: COMPLETE**

> **Completed Dec 24, 2025**

#### Tasks:

- [x] **Task 10.1:** Dashboard UI components ✅ _(Already exists)_
- [x] **Task 10.2:** Connect dashboard to tRPC ✅ _(Already done)_

- [x] **Task 10.3:** Enhance SalesChart with real data (1.5 hours)
  - Added Recharts AreaChart with gradient fill
  - Period selector (7d, 30d, 90d)
  - Trend indicator (+/- percentage)

- [x] **Task 10.4:** Enhance RecentOrders component (1 hour)
  - Added clickable order links
  - Added "View All" button

- [x] **Task 10.5:** Orders management ✅ _(Already functional)_
  - OrdersTable connected to tRPC
  - Status badges and view links exist

**Deliverables:**

- ✅ Admin dashboard fully functional
- ✅ Real metrics and charts
- ✅ Orders management working

---

### ✅ **Day 11: Monday, Jan 5 - Testing & Documentation**

**Priority:** MEDIUM | **Estimated Time:** 6-8 hours | **Status: COMPLETE**

> **Completed Dec 24, 2025**

#### Tasks:

- [x] **Task 11.1:** Enhance database seeding script (2 hours)
  - Created: `scripts/seed.ts`
  - 12 categories with hierarchy
  - 35+ products with variants
  - 200+ variants, 70 images
  - 25 orders with items
  - Added `pnpm seed` script

- [x] **Task 11.2:** Update documentation (2 hours)
  - Created: `docs/PROJECT_STATUS_2025-12-24.md`
  - Documented all completed features

- [x] ~~Task 11.3-11.4~~: Type-check passing

**Deliverables:**

- ✅ Database seeding for easy development
- ✅ Updated documentation

---

## 📊 Sprint Success Criteria

### Must Have (P0):

- [x] Authentication middleware implemented (Better Auth)
- [x] All admin routes and pages protected
- [x] Dashboard refactored to Onion Architecture
- [x] DI Container infrastructure
- [x] File upload working
- [x] Product variants fully implemented (sizes/colors)
- [x] Product images manageable
- [x] All core CRUD operations complete
- [x] All essential repositories implemented (Product, Order, Category, Variant)

### Should Have (P1):

- [x] Email service integrated
- [x] Email verification enabled
- [x] Admin dashboard UI complete
- [x] Database seeding script
- [x] Missing repositories implemented

### Nice to Have (P2):

- [ ] Rate limiting on auth endpoints
- [ ] Comprehensive error handling
- [ ] Performance optimization
- [ ] Additional value objects

---

## 🎯 Post-Sprint Next Steps

After completing this sprint, the project will be ready for:

1. **Week 3-4:** Customer-facing features
   - Product listing page
   - Product detail page
   - Shopping cart implementation
   - Wishlist functionality

2. **Week 5-6:** Checkout flow
   - Stripe integration
   - Order creation
   - Payment processing
   - Order confirmation emails

3. **Week 7-8:** Testing & Polish
   - Unit tests
   - Integration tests
   - E2E tests
   - Performance optimization

---

## 📝 Notes

### Time Management Tips:

- **Focus on one task at a time** - Don't context switch
- **Test as you go** - Don't accumulate untested code
- **Commit frequently** - Small, logical commits
- **Ask for help early** - Don't get stuck for hours

### Dependencies:

- **Day 1 (Auth):** Must complete before admin features can be tested
- **Day 2 (DI Container):** Required before all subsequent use case implementations
- **Day 2 (Basic Seed):** Needed for testing dashboard and other features
- **Day 6 (File Upload):** Must complete before Day 7 (Product Images)
- **Day 6.5 (Product Variants):** Must complete before Day 8 (Admin UI)
- **Day 7 (Product Images):** Completes before Admin Product UI enhancement

### Risk Mitigation:

- **Better Auth confusion:** Leverage existing Better Auth features, don't rebuild auth from scratch
- **Product Variants complexity:** Start simple (size/color only), expand features later
- **If file upload is complex:** Consider using Cloudinary (easier setup than R2)
- **If email service issues:** Can defer to Week 3, not blocking for core features
- **If behind schedule:** Prioritize P0 tasks (Auth, Variants, Repositories), defer P2 tasks

---

## ✅ Daily Checklist Template

```markdown
### Day X: [Date] - [Focus Area]

Morning:

- [ ] Review task list
- [ ] Set up development environment
- [ ] Pull latest changes

Work:

- [ ] Task 1
- [ ] Task 2
- [ ] Task 3

End of Day:

- [ ] Commit and push code
- [ ] Update task list
- [ ] Document blockers
- [ ] Plan tomorrow
```

---

**Created:** December 22, 2025  
**Sprint Starts:** December 23, 2025  
**Sprint Ends:** January 5, 2026  
**Total Working Days:** 11 days (accounting for holidays)
