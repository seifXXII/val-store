# V2.0 Feature: Abandoned Cart Recovery System

**Created:** 2026-01-14  
**Priority:** 🔴 Highest ROI Feature  
**Estimated Effort:** 4-6 days  
**Expected Impact:** Recover 5-15% of abandoned carts

> [!IMPORTANT]
> Average cart abandonment is **70%**. Recovering just 10% is pure profit. This is your highest-ROI feature.

---

## 🎯 Goals

1. Capture abandoned carts with email
2. Multi-touch email recovery sequence
3. Exit-intent popup for email capture
4. Track recovery rate and revenue

---

## 📧 Email Recovery Sequence

### Email 1: Reminder (1 hour)

**Subject:** "Did you forget something? 👀"

- Show cart items with images
- Simple CTA: "Return to Cart"
- **No discount yet**

### Email 2: Nudge (24 hours)

**Subject:** "Your cart misses you 💔"

- Cart items + social proof (reviews)
- Benefits reminder (free shipping, easy returns)
- **Still no discount**

### Email 3: Last Chance (72 hours)

**Subject:** "10% off your cart 🎁"

- Discount code: `COMEBACK10`
- Urgency: "Expires in 24 hours"
- **Now offer discount**

---

## 🗄️ Database Schema

```sql
CREATE TABLE abandoned_carts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  session_id VARCHAR(255),
  email VARCHAR(255),
  cart_data JSONB NOT NULL,
  cart_total DECIMAL(10, 2) NOT NULL,
  last_activity_at TIMESTAMP NOT NULL,
  abandoned_at TIMESTAMP,
  recovery_status VARCHAR(20) DEFAULT 'pending',
  recovered_order_id UUID REFERENCES orders(id),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE cart_recovery_emails (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  abandoned_cart_id UUID REFERENCES abandoned_carts(id),
  email_type VARCHAR(50) NOT NULL,
  sent_at TIMESTAMP,
  opened_at TIMESTAMP,
  clicked_at TIMESTAMP,
  discount_code VARCHAR(50)
);
```

---

## 🚪 Exit-Intent Popup

**Trigger:** Mouse moves toward browser close button

```
┌─────────────────────────────────────────┐
│            ✋ Wait!                      │
│                                         │
│  Enter your email to save your cart     │
│  + get 10% off:                         │
│                                         │
│  [ your@email.com             ]         │
│                                         │
│  [ SAVE MY CART & GET 10% OFF ]         │
└─────────────────────────────────────────┘
```

---

## ⚙️ Backend Job

```typescript
// Run every 15 minutes
export async function detectAbandonedCarts() {
  const threshold = 30 * 60 * 1000; // 30 min inactivity

  const staleCarts = await db.query.abandonedCarts.findMany({
    where: and(
      lt(abandonedCarts.lastActivityAt, thirtyMinAgo),
      isNull(abandonedCarts.abandonedAt),
      isNotNull(abandonedCarts.email)
    ),
  });

  for (const cart of staleCarts) {
    await markAsAbandoned(cart.id);
    await queueRecoveryEmail(cart.id, "reminder_1h", in1Hour);
  }
}
```

---

## 📊 Metrics Dashboard

| Metric                    | Target        |
| ------------------------- | ------------- |
| Carts with email captured | 30%+          |
| Email open rate           | 40%+          |
| Recovery rate             | 5-15%         |
| Revenue recovered         | Track monthly |

---

## 📋 Implementation Checklist

### Phase 1: Database (Day 1)

- [ ] Create `abandoned_carts` table
- [ ] Create `cart_recovery_emails` table
- [ ] Add cart tracking to frontend

### Phase 2: Emails (Days 2-3)

- [ ] Create email templates (React Email)
- [ ] Set up Resend integration
- [ ] Implement email queue
- [ ] Create recovery link system

### Phase 3: Exit-Intent (Day 4)

- [ ] Create popup component
- [ ] Implement exit detection
- [ ] Add email capture

### Phase 4: Admin (Days 5-6)

- [ ] Create metrics API
- [ ] Build dashboard widget
- [ ] Add A/B testing

---

_Highest ROI feature. Build after checkout works._
