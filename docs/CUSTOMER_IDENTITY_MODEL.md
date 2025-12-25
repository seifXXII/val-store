# Customer Identity Model

## Overview

A single **real person** (customer) can have multiple **user accounts** (logins). The phone number is the unique identifier for a real human.

---

## Data Model

```
┌─────────────────────────────────────────────────────────────┐
│                        CUSTOMER                              │
│  (Real Human - identified by phone number)                  │
│                                                              │
│  id (uuid)                                                   │
│  phone (unique) ← Primary identifier                        │
│  preferred_name                                              │
│  is_phone_verified (boolean)                                │
│  total_orders (int)                                          │
│  total_spent (decimal)                                       │
│  loyalty_points (int)                                        │
│  notes (admin notes)                                         │
│  created_at                                                  │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ 1:many
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                         USER                                 │
│  (Login Account - managed by Better Auth)                   │
│                                                              │
│  id                                                          │
│  email                                                       │
│  phone ─────────────────────────────────────────────────────┼─► Links to Customer
│  name                                                        │
│  ...                                                         │
└─────────────────────────────────────────────────────────────┘
```

---

## Key Concepts

### Phone Number = Real Identity

- Phone numbers uniquely identify a real person
- Multiple emails can belong to the same phone number
- All accounts with same phone = same customer

### User vs Customer

| User (Account)      | Customer (Person)   |
| ------------------- | ------------------- |
| Login credentials   | Real human identity |
| Email-based         | Phone-based         |
| Many per customer   | One per person      |
| Better Auth managed | Our custom entity   |

---

## Scenarios

### Scenario 1: New User, New Customer

1. User signs up with email + phone
2. System checks: customer with this phone?
3. No → Create new `customer` record
4. Link user to new customer

### Scenario 2: New User, Existing Customer

1. User signs up with email + phone
2. System checks: customer with this phone?
3. Yes → Link user to existing customer
4. All order history accessible

### Scenario 3: Guest Checkout

1. Guest provides phone for delivery
2. System checks: customer with this phone?
3. Yes → Attach order to existing customer
4. No → Create customer, attach order

---

## Implementation Tasks

### Phase 1: Database & Entity

- [ ] Create `customers` table in schema
- [ ] Create `Customer` entity in domain layer
- [ ] Create `CustomerRepository` interface
- [ ] Implement Drizzle repository

### Phase 2: Linking Logic

- [ ] Add `customer_id` to user or use phone for linking
- [ ] Create `GetOrCreateCustomerUseCase`
- [ ] Hook into Better Auth signup to create/link customer
- [ ] Hook into guest checkout

### Phase 3: Admin Features

- [ ] Customer list page in admin
- [ ] View all accounts for a customer
- [ ] View complete order history across accounts
- [ ] Add admin notes to customer

### Phase 4: Phone Verification

- [ ] SMS OTP service (Twilio)
- [ ] Verify phone for COD orders
- [ ] Mark `is_phone_verified` on customer

---

## Schema Draft

```sql
CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone VARCHAR(20) UNIQUE NOT NULL,
  preferred_name VARCHAR(100),
  is_phone_verified BOOLEAN DEFAULT FALSE,
  total_orders INT DEFAULT 0,
  total_spent DECIMAL(10,2) DEFAULT 0,
  loyalty_points INT DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Index for fast phone lookup
CREATE INDEX idx_customers_phone ON customers(phone);
```

---

## API Endpoints (Future)

| Endpoint                         | Description                   |
| -------------------------------- | ----------------------------- |
| `GET /admin/customers`           | List all customers            |
| `GET /admin/customers/:id`       | Customer details + all orders |
| `GET /admin/customers/:id/users` | All accounts for customer     |
| `PUT /admin/customers/:id`       | Update customer notes         |

---

## Benefits

1. **Unified Order History** - See all orders regardless of account used
2. **Loyalty Rewards** - Points apply to the person, not account
3. **Fraud Detection** - Spot multiple accounts same person
4. **Better Analytics** - Real customer count, not inflated accounts
5. **COD Trust** - Verified phone means trusted customer

---

## Notes

- Phone verification only required for COD checkout
- Email verification is optional (soft reminder)
- Admin role is on `user` level, not `customer` level
- Guest orders still create a customer record (by phone)
