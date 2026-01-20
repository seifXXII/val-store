# V2.0 Feature: Smart Recommendations Engine

**Created:** 2026-01-14  
**Priority:** 🟡 High Value  
**Estimated Effort:** 5-7 days  
**Expected Impact:** +10-30% Average Order Value

> [!IMPORTANT]
> Amazon attributes 35% of revenue to recommendations. Even a simple "You may also like" section can boost AOV by 10-20%.

---

## 🎯 Goals

1. Increase average order value through cross-sells
2. Improve product discovery
3. Personalize the shopping experience
4. Reduce bounce rate on product pages

---

## 📦 Recommendation Types

### 1. "Customers Also Bought" (Cross-sell)

**Location:** Product detail page, cart drawer
**Logic:** Based on order history co-occurrence

```sql
-- Find products frequently bought together
SELECT
  oi2.product_id,
  COUNT(*) as co_occurrence_count
FROM order_items oi1
JOIN order_items oi2 ON oi1.order_id = oi2.order_id
WHERE oi1.product_id = $current_product_id
  AND oi2.product_id != $current_product_id
GROUP BY oi2.product_id
ORDER BY co_occurrence_count DESC
LIMIT 8;
```

---

### 2. "Complete the Look" (Upsell)

**Location:** Product detail page
**Logic:** Curated by admin OR category-based matching

```typescript
// Admin-curated bundles
interface ProductBundle {
  mainProductId: string;
  complementaryProducts: string[]; // Max 4
  bundleDiscount?: number; // Optional bundle price
}

// Auto-matching by category tags
// Shirt → suggest Pants, Belt, Shoes from same style
```

---

### 3. "You May Also Like" (Similar Products)

**Location:** Product detail page, 404 pages
**Logic:** Same category + similar price range + similar attributes

```typescript
async function getSimilarProducts(product: Product, limit = 8) {
  return await db.query.products.findMany({
    where: and(
      eq(products.categoryId, product.categoryId),
      ne(products.id, product.id),
      eq(products.isActive, true),
      // Price within 30% range
      between(products.price, product.price * 0.7, product.price * 1.3)
    ),
    orderBy: desc(products.soldCount),
    limit,
  });
}
```

---

### 4. "Recently Viewed"

**Location:** Homepage, product pages footer
**Storage:** localStorage (guest) + DB (logged in)

```typescript
// Store in localStorage
const recentlyViewed = JSON.parse(
  localStorage.getItem("recentlyViewed") || "[]"
);
recentlyViewed.unshift(productId);
localStorage.setItem(
  "recentlyViewed",
  JSON.stringify(recentlyViewed.slice(0, 12))
);
```

---

### 5. "Trending Now"

**Location:** Homepage, collection pages
**Logic:** Most viewed/purchased in last 7 days

```sql
SELECT product_id, COUNT(*) as view_count
FROM product_views
WHERE viewed_at > NOW() - INTERVAL '7 days'
GROUP BY product_id
ORDER BY view_count DESC
LIMIT 12;
```

---

### 6. "Personalized For You"

**Location:** Homepage (logged-in users)
**Logic:** Based on browsing history, past purchases, wishlist

```typescript
async function getPersonalizedProducts(userId: string) {
  // 1. Get user's preferred categories from order history
  const preferredCategories = await getUserPreferredCategories(userId);

  // 2. Get recently viewed but not purchased
  const viewedNotPurchased = await getViewedNotPurchased(userId);

  // 3. Get wishlist items still in stock
  const wishlistInStock = await getWishlistInStock(userId);

  // 4. Mix and rank
  return rankAndMix(
    [...viewedNotPurchased, ...wishlistInStock],
    preferredCategories
  );
}
```

---

## 🗄️ Database Schema

```sql
-- Track product views for recommendations
CREATE TABLE product_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id),
  session_id VARCHAR(255),
  viewed_at TIMESTAMP DEFAULT NOW()
);

-- Admin-curated product bundles
CREATE TABLE product_bundles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  main_product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  name VARCHAR(255),
  discount_percentage DECIMAL(5, 2),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE product_bundle_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bundle_id UUID REFERENCES product_bundles(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  display_order INTEGER DEFAULT 0
);

-- Precomputed recommendations (refresh daily)
CREATE TABLE product_recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  recommended_product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  recommendation_type VARCHAR(50),  -- 'also_bought' | 'similar' | 'trending'
  score DECIMAL(10, 4),
  computed_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(product_id, recommended_product_id, recommendation_type)
);

CREATE INDEX idx_product_views_product ON product_views(product_id);
CREATE INDEX idx_product_views_time ON product_views(viewed_at);
CREATE INDEX idx_recommendations_product ON product_recommendations(product_id);
```

---

## 🖼️ UI Components

### Recommendation Carousel

```tsx
// components/products/RecommendationCarousel.tsx

interface RecommendationCarouselProps {
  title: string;
  products: Product[];
  type: "also_bought" | "similar" | "recently_viewed" | "trending";
}

export function RecommendationCarousel({
  title,
  products,
  type,
}: RecommendationCarouselProps) {
  if (products.length === 0) return null;

  return (
    <section className="py-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">{title}</h2>
        <Button variant="ghost" asChild>
          <Link href="/collections/all">View All</Link>
        </Button>
      </div>

      <div className="relative">
        <Carousel opts={{ align: "start", loop: true }}>
          <CarouselContent>
            {products.map((product) => (
              <CarouselItem
                key={product.id}
                className="basis-1/2 md:basis-1/4 lg:basis-1/5"
              >
                <ProductCard product={product} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </section>
  );
}
```

### Cart Recommendations

```tsx
// In cart drawer, show "Add these for a complete look"
<div className="border-t pt-4 mt-4">
  <h4 className="font-medium mb-3">Complete Your Order</h4>
  <div className="space-y-2">
    {recommendations.map((product) => (
      <MiniProductCard
        key={product.id}
        product={product}
        onAdd={() => addToCart(product.id)}
      />
    ))}
  </div>
</div>
```

---

## ⚙️ Background Jobs

### Daily Recommendations Refresh

```typescript
// jobs/compute-recommendations.ts
// Run daily at 3 AM

export async function computeRecommendations() {
  // 1. Compute "also bought" from last 90 days of orders
  await computeAlsoBought();

  // 2. Compute "trending" from last 7 days
  await computeTrending();

  // 3. Compute "similar" based on category + attributes
  await computeSimilar();

  // 4. Clear old recommendations
  await clearStaleRecommendations();
}
```

---

## 📊 Metrics to Track

| Metric             | Description                             | Target          |
| ------------------ | --------------------------------------- | --------------- |
| Click-through rate | Clicks on recommendations / impressions | 5-15%           |
| Add-to-cart rate   | Adds from recommendations / clicks      | 10-20%          |
| Revenue from recs  | Orders containing recommended items     | 15-25% of total |
| AOV lift           | AOV with recs vs without                | +15%            |

---

## 📋 Implementation Checklist

### Phase 1: Data Collection (Day 1)

- [ ] Create `product_views` table
- [ ] Track product views on PDP
- [ ] Store recently viewed in localStorage

### Phase 2: Simple Recommendations (Days 2-3)

- [ ] Implement "Recently Viewed" component
- [ ] Implement "You May Also Like" (same category)
- [ ] Add to product detail page

### Phase 3: Smart Recommendations (Days 4-5)

- [ ] Create `product_recommendations` table
- [ ] Build "Customers Also Bought" job
- [ ] Build recommendation API endpoints

### Phase 4: Cart Upsells (Days 5-6)

- [ ] Add recommendations to cart drawer
- [ ] Create "Complete the Look" bundles (admin)
- [ ] Track recommendation conversions

### Phase 5: Personalization (Day 7)

- [ ] Build personalized homepage for logged-in users
- [ ] Implement "Trending Now" section

---

_Start with "Recently Viewed" and "Similar Products" — quick wins with immediate impact._
