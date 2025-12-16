# Coding Standards & Naming Conventions

## 🎯 Core Principle

**All names should be self-explanatory and describe what they do or represent.**

No single-letter variables (except in very specific cases like `i` in short loops). Every developer should understand what a variable/function does just by reading its name.

---

## 📝 Naming Conventions

### 1. Variables

#### ✅ DO

```typescript
// Descriptive and clear
const userEmail = "user@example.com";
const totalPrice = 100;
const isAuthenticated = true;
const productList = [];

// Arrays - use plural
const users = [...];
const products = [...];
const orderItems = [...];

// Boolean - use is/has/can prefix
const isLoading = false;
const hasPermission = true;
const canEdit = false;
const shouldRefetch = true;
```

#### ❌ DON'T

```typescript
// Too short, not descriptive
const e = "user@example.com";  // BAD
const t = 100;                 // BAD
const a = true;                // BAD
const x = [];                  // BAD

// Abbreviations that aren't clear
const usr = {...};             // BAD - use 'user'
const prod = {...};            // BAD - use 'product'
const qty = 5;                 // BAD - use 'quantity'
```

### 2. Functions

#### ✅ DO

```typescript
// Use verbs that describe the action
function getUserById(userId: string) {}
function calculateTotalPrice(items: CartItem[]) {}
function validateEmail(email: string) {}
function formatCurrency(amount: number) {}

// Async functions - be explicit
async function fetchUserData(userId: string) {}
async function createNewOrder(orderData: Order) {}
async function deleteProductById(productId: string) {}

// Event handlers - use 'handle' prefix
function handleSubmit(event: FormEvent) {}
function handleClick(event: MouseEvent) {}
function handleInputChange(event: ChangeEvent) {}
```

#### ❌ DON'T

```typescript
// Too vague
function get(id: string) { }           // BAD - get what?
function process(data: any) { }        // BAD - process how?
function do(x: number) { }             // BAD - do what?

// Single letters
const f = () => { };                   // BAD
const x = (data) => { };               // BAD
```

### 3. Constants

#### ✅ DO

```typescript
// All caps with underscores for global constants
const MAX_LOGIN_ATTEMPTS = 3;
const API_BASE_URL = "https://api.example.com";
const DEFAULT_PAGE_SIZE = 20;
const SESSION_TIMEOUT_MS = 3600000;

// PascalCase for configuration objects
const DatabaseConfig = {
  host: "localhost",
  port: 5432,
};

const EmailTemplates = {
  welcome: "...",
  passwordReset: "...",
};
```

#### ❌ DON'T

```typescript
const M = 3; // BAD - what is M?
const URL = "..."; // BAD - which URL?
const T = 3600000; // BAD - what timeout?
```

### 4. Types & Interfaces

#### ✅ DO

```typescript
// PascalCase, descriptive names
interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

type ProductCategory = "clothing" | "accessories" | "shoes";

interface CreateOrderRequest {
  userId: string;
  items: OrderItem[];
  totalAmount: number;
}

// Use descriptive generic names
type ApiResponse<DataType> = {
  data: DataType;
  error?: string;
};
```

#### ❌ DON'T

```typescript
interface U {} // BAD
type T = "a" | "b"; // BAD
interface Req {} // BAD - abbreviation
```

### 5. React Components

#### ✅ DO

```typescript
// PascalCase, descriptive component names
function UserProfileCard() {}
function ProductListItem() {}
function ShoppingCartSummary() {}
function OrderConfirmationDialog() {}

// Props - use descriptive names
interface UserProfileCardProps {
  userId: string;
  showAvatar: boolean;
  onEditClick: () => void;
}
```

#### ❌ DON'T

```typescript
function Card() {} // BAD - too generic
function Item() {} // BAD - what item?
function Dialog() {} // BAD - which dialog?
```

### 6. Custom Hooks

#### ✅ DO

```typescript
// Always start with 'use'
function useUserAuthentication() {}
function useFetchProducts(categoryId: string) {}
function useLocalStorage(storageKey: string) {}
function useDebounce(value: string, delayMs: number) {}
```

#### ❌ DON'T

```typescript
function getData() {} // BAD - not a hook name
function userHook() {} // BAD - doesn't start with 'use'
function useData() {} // BAD - too vague
```

### 7. File Names

#### ✅ DO

```typescript
// PascalCase for React components (.tsx)
UserProfile.tsx
ProductList.tsx
ShoppingCart.tsx
LoginForm.tsx

// kebab-case for utilities, services (.ts)
user-profile.service.ts
product-list.service.ts
email.validator.ts
product.dto.ts
order.entity.ts

// kebab-case for directories
src/components/auth/login/
src/lib/utils/
src/server/routers/
```

#### ❌ DON'T

```typescript
user - profile.tsx; // BAD - use PascalCase for .tsx
product - list.tsx; // BAD - use PascalCase for .tsx
UserProfile.ts; // CONFUSING - PascalCase usually for .tsx
usr.tsx; // BAD
prod.ts; // BAD
data.tsx; // BAD - too vague
component.tsx; // BAD - which component?
```

---

## 🎨 Code Style Rules

### 1. Destructuring

#### ✅ DO

```typescript
// Descriptive destructured names
const { userEmail, firstName, lastName } = user;
const { productId, productName, productPrice } = product;

// Rename if needed for clarity
const { id: userId, email: userEmail } = user;
```

#### ❌ DON'T

```typescript
const { e, f, l } = user; // BAD
const { a, b, c } = product; // BAD
```

### 2. Function Parameters

#### ✅ DO

```typescript
function createOrder(
  userId: string,
  orderItems: OrderItem[],
  shippingAddress: Address,
  paymentMethod: PaymentMethod
) {}

// Use object parameter for many params
function createOrder(orderData: {
  userId: string;
  orderItems: OrderItem[];
  shippingAddress: Address;
  paymentMethod: PaymentMethod;
}) {}
```

#### ❌ DON'T

```typescript
function createOrder(u: string, i: any[], a: any, p: string) {} // BAD
```

### 3. Loop Variables

#### ✅ DO

```typescript
// Use descriptive names even in loops
for (const user of users) {
  console.log(user.email);
}

products.forEach((product) => {
  console.log(product.name);
});

orderItems.map((orderItem) => orderItem.price);

// Short loops with obvious context - OK to use 'i'
for (let i = 0; i < 5; i++) {
  console.log(i);
}
```

#### ❌ DON'T

```typescript
// Don't use single letters when iterating objects
for (const u of users) {
} // BAD
products.forEach((p) => {}); // BAD
items.map((x) => x.price); // BAD
```

### 4. Callback Functions

#### ✅ DO

```typescript
// Descriptive callback names
users.filter((user) => user.isActive);
products.find((product) => product.id === selectedProductId);

// Named callbacks for clarity
const isActiveUser = (user: User) => user.isActive;
const hasMatchingId = (product: Product) => product.id === selectedProductId;

users.filter(isActiveUser);
products.find(hasMatchingId);
```

#### ❌ DON'T

```typescript
users.filter((x) => x.isActive); // BAD
products.find((p) => p.id === id); // BAD
```

---

## 📋 Special Cases

### When Single Letters ARE Acceptable

```typescript
// Mathematical formulas (clearly documented)
function calculateDistance(x1: number, y1: number, x2: number, y2: number) {
  return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
}

// Very short, obvious loops
for (let i = 0; i < 3; i++) {
  console.log(i);
}

// Generic types (standard convention)
type Result<T, E> = { data: T } | { error: E };
```

---

## 🚫 Common Abbreviations to Avoid

| ❌ Avoid | ✅ Use Instead                              |
| -------- | ------------------------------------------- |
| usr      | user                                        |
| prod     | product                                     |
| addr     | address                                     |
| qty      | quantity                                    |
| amt      | amount                                      |
| btn      | button                                      |
| msg      | message                                     |
| err      | error (or keep 'error')                     |
| req      | request                                     |
| res      | response                                    |
| auth     | authentication (or keep 'auth' as standard) |
| temp     | temporary                                   |
| calc     | calculate                                   |
| init     | initialize                                  |

### Acceptable Standard Abbreviations

```typescript
// These are widely understood and OK to use
const userId = "..."; // 'id' is standard
const maxRetries = 3; // 'max' is standard
const minPrice = 10; // 'min' is standard
const apiKey = "..."; // 'api' is standard
const htmlContent = "..."; // 'html' is standard
const urlPath = "..."; // 'url' is standard
```

---

## ✅ Examples: Before & After

### ❌ Before (Bad)

```typescript
const u = await db.select().from(users).where(eq(users.id, id));
const p = u.map((x) => x.email);
const t = p.reduce((a, b) => a + b.length, 0);

function f(x: string) {
  const y = x.split("@");
  return y[0];
}
```

### ✅ After (Good)

```typescript
const userRecords = await db.select().from(users).where(eq(users.id, userId));
const userEmails = userRecords.map((user) => user.email);
const totalEmailLength = userEmails.reduce(
  (totalLength, email) => totalLength + email.length,
  0
);

function extractUsernameFromEmail(email: string) {
  const emailParts = email.split("@");
  return emailParts[0];
}
```

---

## 📚 Summary

**Golden Rules:**

1. ✅ Names should explain themselves
2. ✅ Use full words, not abbreviations (unless standard)
3. ✅ Be descriptive, even if it makes names longer
4. ✅ Use consistent patterns (handle*, is*, fetch\*, etc.)
5. ✅ Think: "Will another developer understand this in 6 months?"

**Remember:** Code is read more often than it's written. Invest in good names!
