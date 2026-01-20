# V2.0 Feature: Social Proof & Reviews System

**Created:** 2026-01-14  
**Priority:** 🔴 High Impact  
**Estimated Effort:** 5-7 days  
**Expected Impact:** +20-35% conversion, +15% trust

> [!IMPORTANT]
> 93% of consumers read reviews before buying. Products with reviews convert 270% better than those without. This is non-negotiable for a real store.

---

## 🎯 Goals

1. Collect authentic customer reviews with photos
2. Display ratings throughout the shopping journey
3. Build trust with social proof elements
4. Enable review moderation for quality control
5. Incentivize reviews for growth

---

## 📦 Feature Components

### 1. Star Ratings Everywhere

**Display Locations:**

- Product cards (collection pages)
- Product detail page (hero section)
- Search results
- Cart items
- Recently viewed

```tsx
// components/products/StarRating.tsx

interface StarRatingProps {
  rating: number; // 0-5
  reviewCount: number;
  size?: "sm" | "md" | "lg";
  showCount?: boolean;
}

export function StarRating({
  rating,
  reviewCount,
  size = "md",
  showCount = true,
}) {
  return (
    <div className="flex items-center gap-1">
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={cn(
              size === "sm" && "w-3 h-3",
              size === "md" && "w-4 h-4",
              size === "lg" && "w-5 h-5",
              star <= rating
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            )}
          />
        ))}
      </div>
      {showCount && (
        <span className="text-sm text-muted-foreground">({reviewCount})</span>
      )}
    </div>
  );
}
```

---

### 2. Reviews with Photos

**User-generated content is your best marketing asset.**

```
┌────────────────────────────────────────────────────┐
│ ★★★★★  "Amazing quality!"                          │
│                                                    │
│ The fabric is so soft and the fit is perfect.     │
│ I've already ordered two more colors!             │
│                                                    │
│ [📷 Photo 1] [📷 Photo 2]                          │
│                                                    │
│ Sarah M. • Verified Purchase • 2 days ago         │
│ Size: Medium | Color: Black                       │
│                                                    │
│ 👍 12 found this helpful                           │
└────────────────────────────────────────────────────┘
```

---

### 3. Review Summary Widget

```
┌────────────────────────────────────────────────────┐
│ Customer Reviews                                   │
│                                                    │
│ ★★★★★ 4.8 out of 5                                │
│ Based on 127 reviews                              │
│                                                    │
│ 5 ★ ████████████████████████░░ 89%               │
│ 4 ★ ██████░░░░░░░░░░░░░░░░░░░  8%               │
│ 3 ★ █░░░░░░░░░░░░░░░░░░░░░░░░  2%               │
│ 2 ★ ░░░░░░░░░░░░░░░░░░░░░░░░░  1%               │
│ 1 ★ ░░░░░░░░░░░░░░░░░░░░░░░░░  0%               │
│                                                    │
│ [ Write a Review ]                                 │
└────────────────────────────────────────────────────┘
```

---

## 🗄️ Database Schema

```sql
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  order_id UUID REFERENCES orders(id),

  -- Review content
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title VARCHAR(255),
  content TEXT,

  -- Purchase context
  variant_info JSONB,  -- { size: "M", color: "Black" }
  verified_purchase BOOLEAN DEFAULT false,

  -- Moderation
  status VARCHAR(20) DEFAULT 'pending',  -- pending | approved | rejected
  moderated_at TIMESTAMP,
  moderated_by UUID REFERENCES users(id),
  rejection_reason TEXT,

  -- Engagement
  helpful_count INTEGER DEFAULT 0,
  reported_count INTEGER DEFAULT 0,

  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE review_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  review_id UUID REFERENCES reviews(id) ON DELETE CASCADE,
  image_url VARCHAR(500) NOT NULL,
  alt_text VARCHAR(255),
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE review_helpful_votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  review_id UUID REFERENCES reviews(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(review_id, user_id)
);

-- Indexes
CREATE INDEX idx_reviews_product ON reviews(product_id);
CREATE INDEX idx_reviews_status ON reviews(status);
CREATE INDEX idx_reviews_rating ON reviews(rating);
```

---

## 📧 Review Request Emails

### Email 1: Request Review (7 days after delivery)

**Subject:** "How's your new [Product Name]? ⭐"

```
Hi [Name],

We hope you're loving your [Product Name]!

We'd love to hear what you think. Your review helps other
shoppers make the right choice.

[⭐⭐⭐⭐⭐ Rate Your Purchase]

As a thank you, you'll earn 50 loyalty points for your review
(100 points if you add a photo!)

- The Val Store Team
```

### Email 2: Reminder (14 days, if no review)

**Subject:** "Quick favor? Share your thoughts ✍️"

---

## 🛡️ Trust Badges

### Checkout Trust Strip

```tsx
// components/checkout/TrustBadges.tsx

export function TrustBadges() {
  return (
    <div className="flex items-center justify-center gap-6 py-4 border-t">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Lock className="w-4 h-4" />
        <span>Secure Checkout</span>
      </div>
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Truck className="w-4 h-4" />
        <span>Free Shipping 100+ EGP</span>
      </div>
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <RotateCcw className="w-4 h-4" />
        <span>14-Day Returns</span>
      </div>
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Shield className="w-4 h-4" />
        <span>Money-Back Guarantee</span>
      </div>
    </div>
  );
}
```

### Payment Method Icons

Display accepted payment methods: Visa, Mastercard, Tabby, Tamara, COD

---

## 📱 Recent Purchase Notifications

**Shows real purchases to build trust and urgency**

```tsx
// components/notifications/SocialProofToast.tsx

// Display every 30-60 seconds on product pages:
// "Sarah from Cairo just purchased Classic Tee - 2 min ago"

interface RecentPurchase {
  firstName: string;
  city: string;
  productName: string;
  productImage: string;
  minutesAgo: number;
}
```

**Privacy rules:**

- First name only
- City only (not full address)
- Last 24 hours only
- Max 1 notification per minute

---

## 👨‍💼 Admin Moderation

### Moderation Queue

```tsx
// Admin can:
// - Approve reviews
// - Reject with reason
// - Flag for quality issues
// - Feature exceptional reviews
// - Respond to reviews publicly
```

### Auto-moderation Rules

- Auto-approve if: rating >= 3, no profanity, verified purchase
- Flag for review if: rating < 3, contains links, new user
- Auto-reject if: profanity detected, spam patterns

---

## 📊 Review Analytics

| Metric            | What to Track                      |
| ----------------- | ---------------------------------- |
| Average rating    | By product, category, overall      |
| Review volume     | Per product, trend over time       |
| Photo rate        | % of reviews with photos           |
| Response rate     | % of reviews responded to          |
| Conversion impact | Conversion with vs without reviews |

---

## 🎁 Incentives for Reviews

| Action                      | Points Earned |
| --------------------------- | ------------- |
| Text-only review            | 50 points     |
| Review with 1+ photos       | 100 points    |
| Review selected as featured | 200 points    |

---

## 📋 Implementation Checklist

### Phase 1: Database & API (Days 1-2)

- [ ] Create `reviews` table
- [ ] Create `review_images` table
- [ ] Create `review_helpful_votes` table
- [ ] Build public reviews router
- [ ] Build admin moderation router

### Phase 2: Display Components (Days 2-3)

- [ ] Create `StarRating` component
- [ ] Create `ReviewCard` component
- [ ] Create `ReviewSummary` widget
- [ ] Add ratings to product cards
- [ ] Add reviews section to PDP

### Phase 3: Review Submission (Days 3-4)

- [ ] Create review form with photo upload
- [ ] Add variant selection
- [ ] Connect to UploadThing for images
- [ ] Add to order confirmation page

### Phase 4: Moderation (Days 4-5)

- [ ] Build admin moderation queue
- [ ] Add auto-moderation rules
- [ ] Create review response system

### Phase 5: Emails & Growth (Days 5-7)

- [ ] Create review request email template
- [ ] Schedule emails 7 days post-delivery
- [ ] Add loyalty points integration
- [ ] Create featured reviews showcase

---

## 🎨 UI Guidelines

### Do's ✅

- Show "Verified Purchase" badge prominently
- Display variant info (Size: M, Color: Black)
- Show helpful votes
- Allow filtering by rating
- Feature reviews with photos

### Don'ts ❌

- Don't hide negative reviews (builds trust)
- Don't show fake reviews
- Don't make submitting reviews difficult
- Don't ignore negative feedback

---

_Build after checkout flow is complete. Requires order history for verified purchases._
