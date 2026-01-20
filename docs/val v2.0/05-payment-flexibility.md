# V2.0 Feature: Payment Flexibility (BNPL, Gift Cards, Multi-Payment)

**Created:** 2026-01-14  
**Priority:** 🔴 High Impact  
**Estimated Effort:** 3-5 days  
**Expected Impact:** +20-30% conversion on high-ticket items

> [!IMPORTANT]
> Buy Now Pay Later (BNPL) increases conversion by 20-30% and average order value by 40-50%. In MENA region, Tabby and Tamara dominate this space.

---

## 🎯 Goals

1. Reduce cart abandonment due to price
2. Increase average order value
3. Enable gift card purchases and redemption
4. Support multiple payment methods
5. Improve checkout conversion

---

## 📦 Payment Methods

### 1. Buy Now Pay Later (BNPL)

**Providers for MENA:**

- **Tabby** — Split in 4, pay later (most popular in Egypt/GCC)
- **Tamara** — Similar, strong in Saudi Arabia
- **Valu** — Egypt-specific installments

**Display on Product Page:**

```
┌────────────────────────────────────────────────────┐
│ EGP 400                                            │
│                                                    │
│ or 4 interest-free payments of EGP 100 with       │
│ [Tabby Logo]  Learn more                          │
└────────────────────────────────────────────────────┘
```

**At Checkout:**

```
Payment Method:
○ Credit/Debit Card
○ Pay in 4 with Tabby (EGP 100 × 4)
○ Cash on Delivery (+EGP 20)
```

---

### Integration: Tabby

```typescript
// lib/payments/tabby.ts

import Tabby from "tabby-sdk";

const tabby = new Tabby({
  merchantCode: process.env.TABBY_MERCHANT_CODE!,
  secretKey: process.env.TABBY_SECRET_KEY!,
  environment: process.env.NODE_ENV === "production" ? "production" : "sandbox",
});

export async function createTabbySession(order: Order, customer: Customer) {
  const session = await tabby.checkout.createSession({
    amount: order.totalAmount.toString(),
    currency: "EGP",
    buyer: {
      email: customer.email,
      phone: customer.phone,
      name: customer.name,
    },
    order: {
      reference_id: order.id,
      items: order.items.map((item) => ({
        title: item.productName,
        quantity: item.quantity,
        unit_price: item.unitPrice.toString(),
        category: item.category,
      })),
    },
    shipping_address: {
      city: order.shippingAddress.city,
      address: order.shippingAddress.street,
      zip: order.shippingAddress.postalCode,
    },
    merchant_urls: {
      success: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success?provider=tabby`,
      cancel: `${process.env.NEXT_PUBLIC_APP_URL}/checkout?cancelled=true`,
      failure: `${process.env.NEXT_PUBLIC_APP_URL}/checkout?failed=true`,
    },
  });

  return session;
}
```

---

### 2. Gift Cards

**Features:**

- Purchase gift cards ($25, $50, $100, custom amount)
- Email delivery with unique code
- Apply at checkout
- Partial redemption (balance tracking)
- No expiration (or configurable)

**Database Schema:**

```sql
CREATE TABLE gift_cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(20) UNIQUE NOT NULL,  -- e.g., "VAL-XXXX-XXXX"

  -- Value
  initial_amount DECIMAL(10, 2) NOT NULL,
  current_balance DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'EGP',

  -- Purchase info
  purchased_by_user_id UUID REFERENCES users(id),
  purchased_order_id UUID REFERENCES orders(id),

  -- Recipient
  recipient_email VARCHAR(255),
  recipient_name VARCHAR(255),
  personal_message TEXT,

  -- Status
  status VARCHAR(20) DEFAULT 'active',  -- active | redeemed | expired | cancelled
  activated_at TIMESTAMP,
  expires_at TIMESTAMP,  -- NULL = never

  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE gift_card_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  gift_card_id UUID REFERENCES gift_cards(id),
  order_id UUID REFERENCES orders(id),
  amount DECIMAL(10, 2) NOT NULL,  -- Negative = redemption
  balance_after DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

**Gift Card Product Page:**

```tsx
// app/(main)/gift-cards/page.tsx

export function GiftCardPage() {
  const amounts = [25, 50, 100, 200];
  const [selectedAmount, setSelectedAmount] = useState(50);
  const [customAmount, setCustomAmount] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [message, setMessage] = useState("");

  return (
    <div className="max-w-2xl mx-auto">
      <h1>Give the Gift of Style</h1>

      {/* Amount selection */}
      <div className="grid grid-cols-4 gap-3">
        {amounts.map((amount) => (
          <Button
            key={amount}
            variant={selectedAmount === amount ? "default" : "outline"}
            onClick={() => setSelectedAmount(amount)}
          >
            EGP {amount}
          </Button>
        ))}
      </div>

      {/* Custom amount */}
      <Input
        placeholder="Custom amount"
        type="number"
        onChange={(e) => setCustomAmount(e.target.value)}
      />

      {/* Recipient details */}
      <Input placeholder="Recipient's email" />
      <Textarea placeholder="Personal message (optional)" />

      <Button className="w-full">Add to Cart</Button>
    </div>
  );
}
```

**Checkout Gift Card Redemption:**

```tsx
// components/checkout/GiftCardInput.tsx

export function GiftCardInput() {
  const [code, setCode] = useState("");
  const [appliedCard, setAppliedCard] = useState<GiftCard | null>(null);

  const applyGiftCard = async () => {
    const result = await trpc.public.giftCards.validate.mutate({ code });
    if (result.valid) {
      setAppliedCard(result.giftCard);
    }
  };

  return (
    <div>
      <Label>Gift Card</Label>
      <div className="flex gap-2">
        <Input
          placeholder="Enter gift card code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
        <Button onClick={applyGiftCard}>Apply</Button>
      </div>

      {appliedCard && (
        <div className="mt-2 p-3 bg-green-50 rounded">
          <p>Gift card applied! Balance: EGP {appliedCard.balance}</p>
          <p className="text-sm">
            Using: EGP {Math.min(appliedCard.balance, cartTotal)}
          </p>
        </div>
      )}
    </div>
  );
}
```

---

### 3. Cash on Delivery (COD)

**Already planned in V1 — key points:**

- Add COD fee (configurable, e.g., +EGP 20)
- Order verification SMS/call for high-value orders
- Limit COD for new customers or high-risk addresses

```typescript
// Check COD eligibility
function isCODEligible(order: Order, customer: Customer): boolean {
  // Limit COD for new customers
  if (customer.orderCount === 0 && order.total > 1000) {
    return false;
  }

  // Block COD for certain areas
  if (HIGH_RISK_AREAS.includes(order.shippingAddress.city)) {
    return false;
  }

  return true;
}
```

---

### 4. Wallet / Store Credit

**Use cases:**

- Refunds go to wallet instead of original payment
- Loyalty points converted to credit
- Promotional credits

```sql
CREATE TABLE user_wallets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE REFERENCES users(id),
  balance DECIMAL(10, 2) DEFAULT 0,
  currency VARCHAR(3) DEFAULT 'EGP',
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE wallet_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_id UUID REFERENCES user_wallets(id),
  amount DECIMAL(10, 2) NOT NULL,  -- Positive = credit, Negative = debit
  type VARCHAR(50) NOT NULL,  -- 'refund' | 'loyalty_conversion' | 'promo' | 'purchase'
  reference_id VARCHAR(255),  -- Order ID, promo code, etc.
  balance_after DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## 🖼️ Checkout Payment UI

```
┌─────────────────────────────────────────────────────┐
│ Payment Method                                       │
│                                                      │
│ ┌─────────────────────────────────────────────────┐ │
│ │ ○ Credit/Debit Card                             │ │
│ │   [Visa] [Mastercard] [Amex]                    │ │
│ └─────────────────────────────────────────────────┘ │
│                                                      │
│ ┌─────────────────────────────────────────────────┐ │
│ │ ○ Pay in 4 installments            [Tabby logo] │ │
│ │   4 × EGP 100 • No interest • No fees           │ │
│ └─────────────────────────────────────────────────┘ │
│                                                      │
│ ┌─────────────────────────────────────────────────┐ │
│ │ ○ Cash on Delivery                   +EGP 20    │ │
│ │   Pay when you receive your order               │ │
│ └─────────────────────────────────────────────────┘ │
│                                                      │
│ ─────────────────────────────────────────────────── │
│                                                      │
│ Gift Card or Promo Code                              │
│ [ Enter code            ] [Apply]                    │
│                                                      │
│ Wallet Balance: EGP 50  [✓] Use wallet balance      │
│                                                      │
└─────────────────────────────────────────────────────┘
```

---

## 📋 Implementation Checklist

### Phase 1: BNPL Integration (Days 1-2)

- [ ] Sign up for Tabby merchant account
- [ ] Install Tabby SDK
- [ ] Add BNPL option to checkout
- [ ] Display installment info on product pages
- [ ] Handle Tabby webhooks

### Phase 2: Gift Cards (Days 2-4)

- [ ] Create `gift_cards` table
- [ ] Create `gift_card_transactions` table
- [ ] Build gift card purchase page
- [ ] Build gift card email template
- [ ] Add gift card redemption to checkout
- [ ] Track partial redemptions

### Phase 3: Wallet (Day 4-5)

- [ ] Create `user_wallets` table
- [ ] Create `wallet_transactions` table
- [ ] Add wallet balance display in account
- [ ] Enable wallet use at checkout
- [ ] Convert refunds to wallet credit

---

_BNPL is the highest priority — immediate conversion lift with minimal effort._
