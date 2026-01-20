# V2.0 Feature: Loyalty Program & Gamification

**Created:** 2026-01-14  
**Priority:** 🟡 Medium-High  
**Estimated Effort:** 7-10 days  
**Expected Impact:** +25% customer retention, +15% repeat purchases

> [!IMPORTANT]
> Acquiring a new customer costs 5-7x more than retaining one. A loyalty program turns one-time buyers into repeat customers and brand advocates.

---

## 🎯 Goals

1. Increase customer lifetime value
2. Encourage repeat purchases
3. Build emotional connection with brand
4. Generate word-of-mouth referrals
5. Collect valuable customer data

---

## 📦 Program Structure

### Tier System

| Tier         | Points Required | Benefits                                       |
| ------------ | --------------- | ---------------------------------------------- |
| **Bronze**   | 0               | 1 point per EGP spent, birthday reward         |
| **Silver**   | 500 pts         | 1.25x points, early access to sales            |
| **Gold**     | 2,000 pts       | 1.5x points, free shipping, exclusive products |
| **Platinum** | 5,000 pts       | 2x points, priority support, VIP events        |

### Earning Points

| Action            | Points                                |
| ----------------- | ------------------------------------- |
| Purchase          | 1 point per EGP spent                 |
| First purchase    | +50 bonus points                      |
| Write a review    | +50 points                            |
| Review with photo | +100 points                           |
| Refer a friend    | +200 points (after their first order) |
| Birthday          | +100 points                           |
| Complete profile  | +25 points                            |
| Newsletter signup | +25 points                            |

### Redeeming Points

| Points   | Reward                     |
| -------- | -------------------------- |
| 100 pts  | EGP 10 off                 |
| 250 pts  | EGP 30 off                 |
| 500 pts  | EGP 75 off                 |
| 1000 pts | EGP 175 off (bonus value!) |

---

## 🗄️ Database Schema

```sql
-- Loyalty program tables
CREATE TABLE loyalty_tiers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(50) NOT NULL,  -- 'bronze', 'silver', 'gold', 'platinum'
  display_name VARCHAR(100) NOT NULL,
  min_points INTEGER NOT NULL,
  points_multiplier DECIMAL(3, 2) DEFAULT 1.0,
  benefits JSONB,  -- { "freeShipping": true, "earlyAccess": true }
  badge_color VARCHAR(20),
  badge_icon VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE loyalty_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  tier_id UUID REFERENCES loyalty_tiers(id),

  -- Points
  lifetime_points INTEGER DEFAULT 0,
  available_points INTEGER DEFAULT 0,

  -- Tracking
  joined_at TIMESTAMP DEFAULT NOW(),
  tier_updated_at TIMESTAMP,

  -- Referral
  referral_code VARCHAR(20) UNIQUE,
  referred_by UUID REFERENCES loyalty_members(id),
  referral_count INTEGER DEFAULT 0
);

CREATE TABLE loyalty_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id UUID REFERENCES loyalty_members(id) ON DELETE CASCADE,

  -- Transaction details
  points INTEGER NOT NULL,  -- Positive = earn, Negative = redeem
  type VARCHAR(50) NOT NULL,
  description VARCHAR(255),

  -- Reference
  reference_type VARCHAR(50),  -- 'order', 'review', 'referral', 'bonus'
  reference_id UUID,

  -- Balance
  balance_after INTEGER NOT NULL,

  expires_at TIMESTAMP,  -- Points expiry (optional)
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE loyalty_rewards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  points_cost INTEGER NOT NULL,
  reward_type VARCHAR(50) NOT NULL,  -- 'discount', 'free_product', 'free_shipping'
  reward_value JSONB,  -- { "discountAmount": 10 } or { "productId": "..." }
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_loyalty_members_user ON loyalty_members(user_id);
CREATE INDEX idx_loyalty_transactions_member ON loyalty_transactions(member_id);
CREATE INDEX idx_loyalty_transactions_type ON loyalty_transactions(type);
```

---

## 🖼️ UI Components

### Loyalty Dashboard (Account Page)

```
┌─────────────────────────────────────────────────────────────┐
│  ⭐ GOLD MEMBER                                             │
│                                                             │
│  ████████████████████░░░░░░  2,450 / 5,000 pts             │
│  550 more points to Platinum!                               │
│                                                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │   2,450     │  │   1,250     │  │    3,700    │         │
│  │ Available   │  │ Redeemed    │  │  Lifetime   │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
│                                                             │
│  Your Benefits:                                             │
│  ✓ 1.5x points on all purchases                            │
│  ✓ Free shipping on all orders                             │
│  ✓ Early access to new collections                         │
│  ✓ Exclusive Gold member products                          │
│                                                             │
│  [ Redeem Points ]  [ View History ]  [ Refer Friends ]    │
└─────────────────────────────────────────────────────────────┘
```

### Points Widget (Header/Navbar)

```tsx
// components/loyalty/PointsWidget.tsx

export function PointsWidget() {
  const { data: member } = trpc.public.loyalty.getMembership.useQuery();

  if (!member) return null;

  return (
    <Link href="/account/rewards" className="flex items-center gap-2">
      <Star className="w-4 h-4 text-yellow-500" />
      <span className="font-medium">{member.availablePoints} pts</span>
    </Link>
  );
}
```

### Checkout Points Redemption

```
┌─────────────────────────────────────────────────────────────┐
│  🎁 Use Your Points                                         │
│                                                             │
│  You have 2,450 points available                            │
│                                                             │
│  ○ Don't use points                                         │
│  ○ Use 100 pts → Save EGP 10                               │
│  ○ Use 250 pts → Save EGP 30                               │
│  ● Use 500 pts → Save EGP 75  ✓ Best Value                 │
│  ○ Use 1000 pts → Save EGP 175                             │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 📧 Loyalty Emails

### Welcome to Loyalty Program

**Trigger:** After first purchase
**Content:** Explain program, show earned points, tier benefits

### Points Earned

**Trigger:** After each order ships
**Content:** "You earned X points! Your balance is now Y pts"

### Tier Upgrade

**Trigger:** When reaching new tier
**Content:** Celebration + new benefits unlocked

### Points About to Expire

**Trigger:** 30 days before expiry
**Content:** "Use your X points before they expire!"

### Birthday Reward

**Trigger:** 7 days before birthday
**Content:** Free points + exclusive birthday discount

---

## 🔗 Referral Program

### How It Works

1. Member shares unique referral link
2. Friend signs up and makes first purchase
3. Friend gets: 10% off first order
4. Member gets: 200 points after friend's order ships

### Referral UI

```
┌─────────────────────────────────────────────────────────────┐
│  🎁 Give EGP 50, Get 200 Points                             │
│                                                             │
│  Share your link with friends:                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ valstore.com/ref/SARAH2026                           │   │
│  └─────────────────────────────────────────────────────┘   │
│  [ Copy Link ]  [ Share on WhatsApp ]  [ Share on FB ]     │
│                                                             │
│  You've referred: 5 friends                                 │
│  Points earned: 1,000 pts                                   │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎮 Gamification Elements

### Progress Bars

- Show progress to next tier
- Show progress to next reward threshold

### Achievements / Badges

- "First Purchase" badge
- "Review Champion" (10+ reviews)
- "Loyal Customer" (5+ orders)
- "Super Referrer" (10+ referrals)

### Challenges / Missions

- "Write 3 reviews this month → +150 bonus points"
- "Shop 2 times in November → +100 bonus points"
- "Refer a friend before Friday → 2x referral bonus"

---

## 📊 Admin Dashboard

### Loyalty Metrics

| Metric            | Description                           |
| ----------------- | ------------------------------------- |
| Active members    | Members with activity in last 90 days |
| Points issued     | Total points given out                |
| Points redeemed   | Total points used                     |
| Liability         | Outstanding points × value            |
| Redemption rate   | Redeemed / Issued                     |
| Tier distribution | % in each tier                        |

---

## 📋 Implementation Checklist

### Phase 1: Database & Core (Days 1-3)

- [ ] Create loyalty tables
- [ ] Build loyalty service (earn/redeem)
- [ ] Create tRPC routers
- [ ] Auto-enroll on first purchase

### Phase 2: Account UI (Days 3-5)

- [ ] Build loyalty dashboard page
- [ ] Create points history view
- [ ] Add tier progress visualization
- [ ] Create points widget for navbar

### Phase 3: Checkout Integration (Days 5-6)

- [ ] Add points redemption to checkout
- [ ] Calculate points earned on order
- [ ] Apply tier multipliers

### Phase 4: Emails (Days 6-7)

- [ ] Welcome email
- [ ] Points earned email
- [ ] Tier upgrade email
- [ ] Birthday email

### Phase 5: Referrals (Days 7-9)

- [ ] Generate unique referral codes
- [ ] Track referral signups
- [ ] Award points on referral purchase
- [ ] Build referral sharing UI

### Phase 6: Gamification (Days 9-10)

- [ ] Add achievement badges
- [ ] Build challenges system
- [ ] Add admin challenge creation

---

_Build after core commerce works. Start simple with points → tiers → referrals._
