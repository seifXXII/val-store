# V2.0 Feature: Urgency & Scarcity System

**Created:** 2026-01-14  
**Priority:** 🔴 High Impact  
**Estimated Effort:** 3-5 days total  
**Expected Impact:** +15-25% conversion rate

> [!IMPORTANT]
> Urgency and scarcity are the most powerful psychological triggers in e-commerce. When done authentically (not fake), they dramatically increase conversion without discounting.

---

## 🎯 Feature Goals

1. Create genuine urgency that respects customers
2. Increase add-to-cart rate on product pages
3. Reduce time-to-purchase decision
4. Decrease cart abandonment
5. Boost flash sale performance

---

## 📦 Feature Components

### 1. Low Stock Indicators

**Trigger:** When `variant.stockQuantity <= threshold`

#### UI Locations

- Product cards in collections
- Product detail page
- Cart drawer
- Checkout summary

#### Visual States

| Stock Level | Display        | Color          |
| ----------- | -------------- | -------------- |
| 0           | "Out of Stock" | Gray, disabled |
| 1-3         | "Only X left!" | Red, pulsing   |
| 4-10        | "Low Stock"    | Orange         |
| 11+         | "In Stock"     | Green          |

#### Implementation

```tsx
// components/products/StockIndicator.tsx

interface StockIndicatorProps {
  quantity: number;
  showExact?: boolean; // Show "Only 3 left" vs just "Low Stock"
}

export function StockIndicator({
  quantity,
  showExact = true,
}: StockIndicatorProps) {
  if (quantity === 0) {
    return (
      <Badge variant="secondary" className="bg-gray-100 text-gray-500">
        Out of Stock
      </Badge>
    );
  }

  if (quantity <= 3) {
    return (
      <Badge variant="destructive" className="animate-pulse">
        {showExact ? `Only ${quantity} left!` : "Almost Gone!"}
      </Badge>
    );
  }

  if (quantity <= 10) {
    return (
      <Badge variant="warning" className="bg-orange-100 text-orange-700">
        Low Stock
      </Badge>
    );
  }

  return (
    <Badge variant="success" className="bg-green-100 text-green-700">
      In Stock
    </Badge>
  );
}
```

#### Admin Configuration

Add to `siteSettings`:

```typescript
stockIndicators: {
  enabled: boolean;
  criticalThreshold: number; // default: 3
  lowThreshold: number; // default: 10
  showExactCount: boolean; // default: true for critical only
}
```

---

### 2. Countdown Timers

**Use Cases:**

- Flash sales
- Limited-time discounts
- Cart reservation warnings
- Shipping cutoff ("Order in 2h 15m for next-day delivery")

#### Timer Component

```tsx
// components/ui/CountdownTimer.tsx

interface CountdownTimerProps {
  endTime: Date;
  onExpire?: () => void;
  variant: "sale" | "cart" | "shipping";
  label?: string;
}

export function CountdownTimer({
  endTime,
  onExpire,
  variant,
  label,
}: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(endTime));

  useEffect(() => {
    const timer = setInterval(() => {
      const remaining = calculateTimeLeft(endTime);
      setTimeLeft(remaining);

      if (remaining.total <= 0) {
        clearInterval(timer);
        onExpire?.();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [endTime, onExpire]);

  if (timeLeft.total <= 0) return null;

  return (
    <div
      className={cn(
        "flex items-center gap-2 font-mono",
        variant === "sale" && "text-red-600 bg-red-50 px-3 py-2 rounded-lg",
        variant === "cart" && "text-orange-600",
        variant === "shipping" && "text-blue-600"
      )}
    >
      {variant === "sale" && <Flame className="w-4 h-4 animate-bounce" />}
      {label && <span className="text-sm font-medium">{label}</span>}
      <div className="flex gap-1">
        {timeLeft.days > 0 && <TimeBlock value={timeLeft.days} label="d" />}
        <TimeBlock value={timeLeft.hours} label="h" />
        <TimeBlock value={timeLeft.minutes} label="m" />
        <TimeBlock value={timeLeft.seconds} label="s" />
      </div>
    </div>
  );
}
```

#### Shipping Cutoff Timer

**Logic:** Calculate time until next shipping cutoff

```typescript
// lib/shipping-cutoff.ts

interface ShippingCutoff {
  cutoffTime: string; // "14:00" (2 PM)
  timezone: string; // "Africa/Cairo"
  excludeWeekends: boolean;
  message: string; // "Order in {time} for next-day delivery"
}

export function getNextShippingCutoff(config: ShippingCutoff): Date | null {
  const now = new Date();
  const [hours, minutes] = config.cutoffTime.split(":").map(Number);

  let cutoff = new Date();
  cutoff.setHours(hours, minutes, 0, 0);

  // If past today's cutoff, move to tomorrow
  if (now > cutoff) {
    cutoff.setDate(cutoff.getDate() + 1);
  }

  // Skip weekends if configured
  if (config.excludeWeekends) {
    while (cutoff.getDay() === 0 || cutoff.getDay() === 6) {
      cutoff.setDate(cutoff.getDate() + 1);
    }
  }

  return cutoff;
}
```

---

### 3. Recently Purchased Notifications (Social Proof + Urgency)

**Display:** Toast notifications showing recent purchases

```
┌────────────────────────────────────┐
│ 🛒 Sarah from Cairo                │
│    just purchased "Classic Tee"    │
│    2 minutes ago                   │
└────────────────────────────────────┘
```

#### Implementation

```tsx
// components/notifications/RecentPurchaseToast.tsx

interface RecentPurchase {
  customerName: string; // First name only
  city: string;
  productName: string;
  productImage: string;
  timeAgo: string;
}

// Fetch recent orders (anonymized) from API
// Display one every 30-60 seconds on product pages
// Skip if user has that product in cart (don't be annoying)
```

#### Privacy Considerations

- Show first name only
- City, not full address
- Only show orders from last 24 hours
- Admin toggle to enable/disable
- Option for customers to opt-out

---

### 4. Cart Reservation System

**Concept:** Items in cart are "reserved" for a limited time during high-demand periods.

#### When to Activate

- Flash sales
- New product launches
- When stock < 10 and item is in cart

#### UI Display

```
┌──────────────────────────────────────────┐
│ ⏱️ Items reserved for: 14:32            │
│    Complete checkout to secure your order│
└──────────────────────────────────────────┘
```

#### Backend Logic

```typescript
// Optional: Actual inventory reservation
// This is complex - only implement if you have high-traffic sales

interface CartReservation {
  cartId: string;
  userId: string;
  items: {
    variantId: string;
    quantity: number;
    reservedAt: Date;
    expiresAt: Date; // usually 15-30 min
  }[];
}

// On expiry: release reservation, show "Items may have sold out" warning
```

---

### 5. Flash Sale Infrastructure

#### Database Schema

```sql
CREATE TABLE flash_sales (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  starts_at TIMESTAMP NOT NULL,
  ends_at TIMESTAMP NOT NULL,
  discount_type VARCHAR(20) NOT NULL, -- 'percentage' | 'fixed'
  discount_value DECIMAL(10, 2) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE flash_sale_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  flash_sale_id UUID REFERENCES flash_sales(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  original_price DECIMAL(10, 2) NOT NULL,  -- Snapshot at sale start
  sale_price DECIMAL(10, 2) NOT NULL,
  max_quantity INTEGER,  -- Optional limit per customer
  sold_count INTEGER DEFAULT 0,
  UNIQUE(flash_sale_id, product_id)
);
```

#### Flash Sale Banner Component

```tsx
// components/promotions/FlashSaleBanner.tsx

interface FlashSaleBannerProps {
  sale: {
    name: string;
    endsAt: Date;
    discountText: string; // "Up to 50% OFF"
  };
}

export function FlashSaleBanner({ sale }: FlashSaleBannerProps) {
  return (
    <div className="bg-linear-to-r from-red-600 to-orange-500 text-white py-3">
      <div className="container flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Zap className="w-6 h-6 animate-pulse" />
          <span className="font-bold text-lg">{sale.name}</span>
          <Badge className="bg-white/20">{sale.discountText}</Badge>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm">Ends in:</span>
          <CountdownTimer endTime={sale.endsAt} variant="sale" />
        </div>
      </div>
    </div>
  );
}
```

---

## 🎨 UI/UX Guidelines

### Do's ✅

- Use real data (actual stock levels, real orders)
- Make countdowns accurate
- Allow customers to dismiss notifications
- Use subtle animations, not aggressive
- Respect user preferences (frequency limits)

### Don'ts ❌

- Never fake scarcity ("Only 2 left!" when you have 500)
- Don't show notifications too frequently (max 1 per minute)
- Don't block content with urgency messages
- Don't use dark patterns (fake countdowns that reset)
- Don't show "X people viewing this" if it's not real

---

## 📊 Metrics to Track

| Metric                              | How to Measure              | Target         |
| ----------------------------------- | --------------------------- | -------------- |
| Add-to-cart rate on low stock items | Events / impressions        | +30% vs normal |
| Time to purchase (flash sales)      | Avg time from view to order | -40%           |
| Cart abandonment during sales       | Abandoned / started         | -15%           |
| Checkout completion with timer      | Completed / started         | +20%           |

---

## 🗂️ Files to Create/Modify

| File                                               | Action | Purpose                  |
| -------------------------------------------------- | ------ | ------------------------ |
| `components/products/StockIndicator.tsx`           | Create | Stock level badges       |
| `components/ui/CountdownTimer.tsx`                 | Create | Reusable timer component |
| `components/notifications/RecentPurchaseToast.tsx` | Create | Social proof toasts      |
| `components/promotions/FlashSaleBanner.tsx`        | Create | Sale banner with timer   |
| `lib/shipping-cutoff.ts`                           | Create | Shipping deadline logic  |
| `db/schema.ts`                                     | Modify | Add flash_sales tables   |
| `server/routers/public/flash-sales.ts`             | Create | Flash sale API           |
| `server/routers/admin/flash-sales.ts`              | Create | Flash sale management    |

---

## 📋 Implementation Checklist

### Phase 1: Stock Indicators (Day 1)

- [ ] Create `StockIndicator` component
- [ ] Add to product cards
- [ ] Add to product detail page
- [ ] Add to cart items
- [ ] Admin config for thresholds

### Phase 2: Countdown Timers (Day 2)

- [ ] Create `CountdownTimer` component
- [ ] Implement shipping cutoff logic
- [ ] Add to product page ("Order in X for delivery by...")
- [ ] Add to cart drawer

### Phase 3: Flash Sales (Days 3-5)

- [ ] Create database tables
- [ ] Create admin management UI
- [ ] Create flash sale banner
- [ ] Create flash sale collection page
- [ ] Integrate countdown with sale end time
- [ ] Add sold count tracking

### Phase 4: Recent Purchase Notifications (Day 5)

- [ ] Create toast component
- [ ] Create API for anonymized recent orders
- [ ] Implement display logic with frequency limits
- [ ] Add customer opt-out option

---

_Ready for implementation after V1.0 core commerce loop is complete._
