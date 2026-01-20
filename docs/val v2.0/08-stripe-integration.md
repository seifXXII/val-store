# Stripe Integration Guide (Products & Checkout)

**Created:** 2026-01-14  
**Related to:** V1.0 Checkout, V2.0 Payment Flexibility

---

## 🎯 Two Approaches to Stripe Products

### Approach A: Pre-Created Stripe Products ⭐

Store Stripe IDs in your database when admin creates products.

**Pros:**

- Products exist in Stripe Dashboard (easier to manage)
- Use Stripe's built-in product catalog
- Required for Stripe subscriptions

**Cons:**

- Need to sync products between your DB and Stripe
- More complex admin flow

**Implementation:**

```typescript
// When admin creates product
async function createProductWithStripe(productData: CreateProductInput) {
  // 1. Create product in Stripe
  const stripeProduct = await stripe.products.create({
    name: productData.name,
    description: productData.description,
    images: [productData.imageUrl],
    metadata: {
      dbProductId: productData.id, // Link back to your DB
    },
  });

  // 2. Create price in Stripe
  const stripePrice = await stripe.prices.create({
    product: stripeProduct.id,
    unit_amount: Math.round(productData.price * 100),
    currency: "egp",
  });

  // 3. Store IDs in your database
  await db.insert(products).values({
    ...productData,
    stripeProductId: stripeProduct.id,
    stripePriceId: stripePrice.id,
  });
}
```

**Admin UI Addition:**

```tsx
// In product form, show Stripe sync status
<div className="border p-4 rounded">
  <h4>Stripe Integration</h4>
  {product.stripeProductId ? (
    <div className="text-green-600">
      ✓ Synced with Stripe
      <br />
      Product ID: {product.stripeProductId}
      <br />
      Price ID: {product.stripePriceId}
    </div>
  ) : (
    <Button onClick={syncToStripe}>Sync to Stripe</Button>
  )}
</div>
```

**DB Schema Addition:**

```sql
ALTER TABLE products ADD COLUMN stripe_product_id VARCHAR(255);
ALTER TABLE products ADD COLUMN stripe_price_id VARCHAR(255);
-- For variants with different prices:
ALTER TABLE product_variants ADD COLUMN stripe_price_id VARCHAR(255);
```

---

### Approach B: Dynamic Line Items (Recommended for Most Cases) ⭐⭐

Don't store Stripe IDs — build checkout session dynamically from cart.

**Pros:**

- No sync needed between DB and Stripe
- Handles sales/discounts easily
- Simpler admin flow

**Cons:**

- Products don't appear in Stripe Dashboard catalog
- Can't use Stripe's subscription features directly

**This is what you likely have now.**

---

## 🛒 Multi-Product Cart Checkout

Both approaches handle multiple products the same way:

### With Dynamic Pricing (Approach B):

```typescript
// src/application/use-cases/checkout/create-checkout-session.use-case.ts

export async function createCheckoutSession(cart: Cart, user: User) {
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    customer_email: user.email,

    // Map ALL cart items to line_items
    line_items: cart.items.map((item) => ({
      price_data: {
        currency: "egp",
        product_data: {
          name: item.productName,
          description: item.variantName, // "Size: M, Color: Black"
          images: item.imageUrl ? [item.imageUrl] : [],
          metadata: {
            productId: item.productId,
            variantId: item.variantId,
          },
        },
        unit_amount: Math.round(item.unitPrice * 100), // Stripe uses cents
      },
      quantity: item.quantity,
    })),

    // Add shipping as a line item OR use shipping_options
    shipping_options: [
      {
        shipping_rate_data: {
          type: "fixed_amount",
          fixed_amount: { amount: 0, currency: "egp" },
          display_name: "Free Shipping",
          delivery_estimate: {
            minimum: { unit: "business_day", value: 3 },
            maximum: { unit: "business_day", value: 5 },
          },
        },
      },
      {
        shipping_rate_data: {
          type: "fixed_amount",
          fixed_amount: { amount: 5000, currency: "egp" }, // 50 EGP
          display_name: "Express Shipping",
          delivery_estimate: {
            minimum: { unit: "business_day", value: 1 },
            maximum: { unit: "business_day", value: 2 },
          },
        },
      },
    ],

    // Metadata for webhook
    metadata: {
      userId: user.id,
      orderId: pendingOrder.id,
      cartId: cart.id,
    },

    // Redirect URLs
    success_url: `${APP_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${APP_URL}/cart?cancelled=true`,
  });

  return session;
}
```

### With Pre-Created Prices (Approach A):

```typescript
line_items: cart.items.map((item) => ({
  price: item.stripePriceId,  // Use stored Stripe Price ID
  quantity: item.quantity,
})),
```

---

## 💰 Applying Discounts (Coupons)

### Option 1: Stripe Coupons

```typescript
const session = await stripe.checkout.sessions.create({
  // ... line_items
  discounts: [
    {
      coupon: "SAVE10", // Pre-created in Stripe Dashboard
    },
  ],
  allow_promotion_codes: true, // Let customer enter codes
});
```

### Option 2: Adjust Line Item Prices

```typescript
// Calculate discounted price in your code
const discountedPrice = applyDiscount(item.unitPrice, coupon);

line_items: cart.items.map((item) => ({
  price_data: {
    unit_amount: Math.round(discountedPrice * 100),
    // ...
  },
})),
```

---

## 🔄 Variant Pricing

For products with variants at different prices:

```typescript
// Each variant can have its own Stripe Price ID
const variant = await db.query.productVariants.findFirst({
  where: eq(productVariants.id, item.variantId),
});

// Use variant's stripe price, or calculate dynamically
const unitAmount = variant.stripePriceId
  ? undefined // Use Stripe price
  : Math.round(variant.price * 100);
```

---

## 📊 Recommendation

**For Val Store, use Approach B (Dynamic Line Items)** because:

1. ✅ You already have product management in your DB
2. ✅ You want flexible pricing (sales, per-variant prices)
3. ✅ Simpler to implement
4. ✅ No sync headaches

**Add Stripe Product IDs later** if you need:

- Stripe's subscription billing
- Integration with Stripe's reporting
- Using Stripe as product catalog source of truth

---

## 📋 Implementation Checklist

### Current Priority (V1.0):

- [ ] Ensure checkout creates session with all cart items
- [ ] Add `userId` to Stripe metadata (for webhook)
- [ ] Handle shipping options
- [ ] Test multi-item checkout flow

### Future (V2.0):

- [ ] Consider adding Stripe sync for products (optional)
- [ ] Add coupon/promo code support
- [ ] Integrate Tabby alongside Stripe

---

_Focus on getting checkout working first. Stripe product sync is optional._
