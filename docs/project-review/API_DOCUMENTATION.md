# Val Store - API Documentation

**Generated:** 2025-12-30  
**API Type:** tRPC v11.8.0  
**Base URL:** `/api/trpc`

---

## 📋 Overview

Val Store uses **tRPC** for type-safe API communication. The API is divided into three main namespaces:

| Namespace | Auth Required | Description            |
| --------- | ------------- | ---------------------- |
| `public`  | No            | Storefront endpoints   |
| `admin`   | Admin role    | Admin management       |
| `auth`    | Varies        | Authentication helpers |

---

## 🔓 Public API (`trpc.public.*`)

### Products

#### `public.products.list`

List active products for storefront.

```typescript
// Input (optional)
{
  categoryId?: string;    // UUID
  limit?: number;         // 1-50, default: 20
  offset?: number;        // default: 0
}

// Output
[{
  id: string;
  name: string;
  slug: string;
  description: string;
  basePrice: number;
  salePrice: number | null;
  categoryId: string | null;
  gender: "men" | "women" | "unisex" | "kids" | null;
  isFeatured: boolean;
}]
```

---

#### `public.products.getBySlug`

Get product details by slug.

```typescript
// Input
{ slug: string }

// Output
{
  id: string;
  name: string;
  slug: string;
  description: string;
  basePrice: number;
  salePrice: number | null;
  categoryId: string | null;
  gender: string | null;
  material: string | null;
  careInstructions: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
  images: [{
    id: string;
    imageUrl: string;
    altText: string | null;
    isPrimary: boolean;
    displayOrder: number;
  }];
  variants: [{
    id: string;
    size: string | null;
    color: string | null;
    priceAdjustment: number;
    inStock: boolean;  // Note: actual quantity not exposed
  }];
} | null
```

---

#### `public.products.getFeatured`

Get featured products for homepage.

```typescript
// Input
{ limit?: number }  // 1-20, default: 8

// Output
[{
  id: string;
  name: string;
  slug: string;
  basePrice: number;
  salePrice: number | null;
}]
```

---

#### `public.products.search`

Search products by name/description.

```typescript
// Input
{
  query: string;    // min 1 char
  limit?: number;   // 1-50, default: 20
}

// Output: Same as getFeatured
```

---

### Categories

#### `public.categories.list`

List active categories.

```typescript
// Input (optional)
{
  parentId?: string | null;  // Filter by parent
}

// Output
[{
  id: string;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  parentId: string | null;
  displayOrder: number;
}]
```

---

#### `public.categories.getBySlug`

Get category by slug.

```typescript
// Input
{ slug: string }

// Output
{
  id: string;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  parentId: string | null;
  parent: Category | null;
  children: Category[];
} | null
```

---

### Site Config (CMS)

#### `public.config.getSiteSettings`

Get public site settings.

```typescript
// Output
{
  storeName: string;
  storeTagline: string | null;
  logoUrl: string | null;
  faviconUrl: string | null;
  currency: string;
  locale: string;
  defaultMetaTitle: string | null;
  defaultMetaDescription: string | null;
  socialLinks: {
    instagram?: string;
    facebook?: string;
    twitter?: string;
    tiktok?: string;
  };
}
```

---

#### `public.config.getSection`

Get active content section by type.

```typescript
// Input
{
  sectionType: "hero" | "announcement" | "promo_banner" |
               "brand_story" | "newsletter" | "instagram"
}

// Output
{
  sectionType: string;
  content: HeroContent | AnnouncementContent | ...;
  displayOrder: number;
} | null  // null if not found or inactive
```

---

#### `public.config.getAllSections`

Get all active content sections.

```typescript
// Output
[{
  sectionType: string;
  content: object;  // Type depends on sectionType
  displayOrder: number;
}]
```

---

## 🔐 Admin API (`trpc.admin.*`)

> ⚠️ **All admin endpoints require `admin` or `super_admin` role**

### Products

#### `admin.products.list`

List all products (including inactive).

```typescript
// Input (optional)
{
  isActive?: boolean;
  isFeatured?: boolean;
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
}

// Output: ProductEntity[] with all fields
```

---

#### `admin.products.getById`

Get product by ID with all details.

```typescript
// Input
{
  id: string;
} // UUID

// Output: Full ProductEntity
```

---

#### `admin.products.create`

Create new product.

```typescript
// Input
{
  name: string;
  slug: string;
  sku: string;
  description: string;
  categoryId: string;  // UUID
  basePrice: number;
  salePrice?: number;
  isActive?: boolean;   // default: true
  isFeatured?: boolean; // default: false
}

// Output: Created ProductEntity
```

---

#### `admin.products.update`

Update existing product.

```typescript
// Input
{
  id: string; // UUID
  data: Partial<CreateProductInput>;
}

// Output: Updated ProductEntity
```

---

#### `admin.products.delete`

Soft delete product.

```typescript
// Input
{
  id: string;
} // UUID

// Output: { success: true }
```

---

#### `admin.products.toggleStatus`

Toggle product active status.

```typescript
// Input
{
  id: string;
} // UUID

// Output: Updated ProductEntity
```

---

### Product Variants

#### `admin.variants.list`

List variants for a product.

```typescript
// Input
{
  productId: string;
}

// Output: ProductVariantEntity[]
```

---

#### `admin.variants.create`

Add variant to product.

```typescript
// Input
{
  productId: string;
  sku: string;
  size?: string;
  color?: string;
  stockQuantity?: number;
  priceAdjustment?: number;
  isAvailable?: boolean;
}

// Output: Created ProductVariantEntity
```

---

#### `admin.variants.updateStock`

Update variant stock quantity.

```typescript
// Input
{
  id: string;
  stockQuantity: number;
}

// Output: Updated ProductVariantEntity
```

---

### Product Images

#### `admin.images.list`

List images for a product.

```typescript
// Input
{
  productId: string;
}

// Output: ProductImageEntity[]
```

---

#### `admin.images.add`

Add image to product.

```typescript
// Input
{
  productId: string;
  imageUrl: string;
  altText?: string;
  displayOrder?: number;
  isPrimary?: boolean;
}

// Output: Created ProductImageEntity
```

---

#### `admin.images.remove`

Remove image from product.

```typescript
// Input
{
  id: string;
}

// Output: { success: true }
```

---

### Orders

#### `admin.orders.list`

List orders with filtering.

```typescript
// Input (optional)
{
  userId?: string;
  status?: string;
  startDate?: Date;
  endDate?: Date;
  minTotal?: number;
  maxTotal?: number;
}

// Output: OrderEntity[]
```

---

#### `admin.orders.getById`

Get order details.

```typescript
// Input
{
  id: string;
} // UUID

// Output: OrderEntity with items
```

---

#### `admin.orders.updateStatus`

Update order status.

```typescript
// Input
{
  id: string;
  status: "pending" |
    "confirmed" |
    "processing" |
    "shipped" |
    "delivered" |
    "cancelled" |
    "refunded";
}

// Output: Updated OrderEntity
```

---

### Categories

#### `admin.categories.list`

List all categories.

```typescript
// Output: CategoryEntity[]
```

---

#### `admin.categories.create`

Create category.

```typescript
// Input
{
  name: string;
  slug: string;
  description?: string;
  parentId?: string;
  imageUrl?: string;
  displayOrder?: number;
  isActive?: boolean;
}

// Output: Created CategoryEntity
```

---

#### `admin.categories.update`

Update category.

```typescript
// Input
{
  id: string;
  data: Partial<CreateCategoryInput>;
}

// Output: Updated CategoryEntity
```

---

#### `admin.categories.delete`

Delete category.

```typescript
// Input
{
  id: string;
}

// Output: { success: true }
```

---

### Dashboard

#### `admin.dashboard.getMetrics`

Get dashboard KPIs.

```typescript
// Output
{
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  totalCustomers: number;
  revenueChange: number; // % from previous period
  ordersChange: number;
}
```

---

#### `admin.dashboard.getSalesTrend`

Get sales data for chart.

```typescript
// Input (optional)
{ days?: number }  // default: 30

// Output
[{
  date: string;
  revenue: number;
  orders: number;
}]
```

---

#### `admin.dashboard.getRecentOrders`

Get recent orders.

```typescript
// Input (optional)
{ limit?: number }  // default: 10

// Output: OrderEntity[] (recent first)
```

---

### CMS Settings

#### `admin.settings.getSiteSettings`

Get full site settings.

```typescript
// Output: SiteSettingsEntity (includes updatedBy)
```

---

#### `admin.settings.updateSiteSettings`

Update site settings.

```typescript
// Input
{
  storeName?: string;
  storeTagline?: string | null;
  logoUrl?: string | null;
  // ... all SiteSettings fields
}

// Output: Updated SiteSettingsEntity
```

---

#### `admin.settings.getContentSection`

Get content section for editing.

```typescript
// Input
{
  sectionType: SectionType;
}

// Output
{
  id: string;
  sectionType: string;
  content: object; // Parsed JSON
  displayOrder: number;
  isActive: boolean;
  version: number;
  updatedAt: Date;
  updatedBy: string | null;
}
```

---

#### `admin.settings.updateContentSection`

Update content section (auto-saves history).

```typescript
// Input
{
  sectionType: SectionType;
  content: HeroContent | AnnouncementContent | ...;
  displayOrder?: number;
  isActive?: boolean;
}

// Output: Updated ContentSectionEntity
```

---

#### `admin.settings.toggleSectionStatus`

Toggle section active/inactive.

```typescript
// Input
{
  sectionType: SectionType;
}

// Output: Updated ContentSectionEntity
```

---

#### `admin.settings.getContentHistory`

Get version history.

```typescript
// Input
{ sectionType: SectionType }

// Output
[{
  id: string;
  version: number;
  content: object;
  createdAt: Date;
  createdBy: string | null;
}]  // Ordered by version descending
```

---

#### `admin.settings.revertToVersion`

Revert to previous version.

```typescript
// Input
{
  sectionType: SectionType;
  version: number;
}

// Output: Reverted ContentSectionEntity
```

---

### Featured Items

#### `admin.settings.getFeaturedItems`

Get featured items for a section.

```typescript
// Input
{
  section: string;
} // e.g., "homepage_featured"

// Output: FeaturedItemEntity[]
```

---

#### `admin.settings.updateFeaturedItems`

Replace all featured items.

```typescript
// Input
{
  section: string;
  items: [{
    itemType: "product" | "category";
    itemId: string;
    section: string;
    displayOrder?: number;
    isActive?: boolean;
  }];
}

// Output: FeaturedItemEntity[]
```

---

#### `admin.settings.addFeaturedItem`

Add single featured item.

```typescript
// Input: FeaturedItemInput
// Output: FeaturedItemEntity
```

---

#### `admin.settings.removeFeaturedItem`

Remove featured item.

```typescript
// Input
{
  id: string;
}

// Output: { success: true }
```

---

#### `admin.settings.reorderFeaturedItems`

Reorder featured items.

```typescript
// Input
{
  section: string;
  orderedIds: string[];  // New order
}

// Output: { success: true }
```

---

## 🔑 Auth API (`trpc.auth.*`)

#### `auth.getEmailByPhone`

Lookup email by phone number (for login).

```typescript
// Input
{
  phone: string;
}

// Output
{
  email: string | null;
}
```

---

## 🚨 Error Codes

| Code                    | Description            |
| ----------------------- | ---------------------- |
| `UNAUTHORIZED`          | Not logged in          |
| `FORBIDDEN`             | Missing required role  |
| `NOT_FOUND`             | Resource doesn't exist |
| `BAD_REQUEST`           | Invalid input          |
| `INTERNAL_SERVER_ERROR` | Server error           |

---

## 🔒 Security Notes

1. **Public endpoints** return only safe data (no costPrice, SKU for products)
2. **Admin endpoints** require `admin` or `super_admin` role
3. **Audit trail** - admin actions track `updatedBy`
4. **Stock quantity** not exposed to public (only `inStock` boolean)

---

_API Documentation generated by Senior Full-Stack Developer_
