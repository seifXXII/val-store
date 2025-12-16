# API Endpoints Documentation

## 🔐 Base URL

```
Production: https://api.yourbrand.com/v1
Development: http://localhost:3000/api/v1
```

## 📋 Common Headers

```javascript
{
  "Content-Type": "application/json",
  "Authorization": "Bearer {access_token}",
  "X-API-Version": "1.0"
}
```

---

## 🔑 Authentication Endpoints

### Register User

```http
POST /auth/register
```

**Request Body**:

```json
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "first_name": "John",
  "last_name": "Doe",
  "phone": "+1234567890"
}
```

**Response** (201):

```json
{
  "message": "Registration successful. Please verify your email.",
  "user_id": "uuid"
}
```

---

### Login

```http
POST /auth/login
```

**Request Body**:

```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**Response** (200):

```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "role": "customer"
  },
  "access_token": "eyJhbGc...",
  "refresh_token": "eyJhbGc..."
}
```

---

### Refresh Token

```http
POST /auth/refresh
```

**Request Body**:

```json
{
  "refresh_token": "eyJhbGc..."
}
```

**Response** (200):

```json
{
  "access_token": "eyJhbGc...",
  "refresh_token": "eyJhbGc..."
}
```

---

### Logout

```http
POST /auth/logout
```

**Headers**: Requires authentication

**Response** (200):

```json
{
  "message": "Logged out successfully"
}
```

---

## 🛍️ Product Endpoints

### Get All Products

```http
GET /products?page=1&limit=24&category=uuid&sort=price_asc
```

**Query Parameters**:

- `page` (optional, default: 1)
- `limit` (optional, default: 24)
- `category` (optional, UUID)
- `gender` (optional: men, women, unisex, kids)
- `min_price` (optional)
- `max_price` (optional)
- `size` (optional)
- `color` (optional)
- `in_stock` (optional, boolean)
- `sort` (optional: featured, price_asc, price_desc, newest, best_selling)
- `search` (optional, search query)

**Response** (200):

```json
{
  "products": [
    {
      "id": "uuid",
      "name": "Classic T-Shirt",
      "slug": "classic-t-shirt",
      "description": "Comfortable cotton t-shirt",
      "category": {
        "id": "uuid",
        "name": "T-Shirts"
      },
      "base_price": 29.99,
      "sale_price": 24.99,
      "is_featured": false,
      "rating": 4.5,
      "reviews_count": 127,
      "images": [
        {
          "url": "https://...",
          "alt_text": "Classic T-Shirt Front",
          "is_primary": true
        }
      ],
      "variants": [
        {
          "id": "uuid",
          "size": "M",
          "color": "Blue",
          "stock_quantity": 15,
          "is_available": true
        }
      ]
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 24,
    "total_pages": 5,
    "total_items": 120
  }
}
```

---

### Get Product by Slug

```http
GET /products/:slug
```

**Response** (200):

```json
{
  "id": "uuid",
  "name": "Classic T-Shirt",
  "slug": "classic-t-shirt",
  "description": "Full description...",
  "category": {...},
  "base_price": 29.99,
  "sale_price": 24.99,
  "material": "100% Cotton",
  "care_instructions": "Machine wash cold",
  "gender": "unisex",
  "rating": 4.5,
  "reviews_count": 127,
  "images": [...],
  "variants": [...],
  "related_products": [...]
}
```

---

### Get Product Reviews

```http
GET /products/:id/reviews?page=1&limit=10
```

**Response** (200):

```json
{
  "reviews": [
    {
      "id": "uuid",
      "user": {
        "first_name": "Jane",
        "last_name": "D."
      },
      "rating": 5,
      "title": "Great quality!",
      "comment": "Love this shirt...",
      "is_verified_purchase": true,
      "created_at": "2024-01-15T10:30:00Z"
    }
  ],
  "rating_summary": {
    "average": 4.5,
    "total": 127,
    "distribution": {
      "5": 80,
      "4": 30,
      "3": 10,
      "2": 5,
      "1": 2
    }
  },
  "pagination": {...}
}
```

---

### Create Product Review

```http
POST /products/:id/reviews
```

**Headers**: Requires authentication

**Request Body**:

```json
{
  "rating": 5,
  "title": "Great quality!",
  "comment": "Love this shirt..."
}
```

**Response** (201):

```json
{
  "message": "Review submitted for approval",
  "review_id": "uuid"
}
```

---

## 📦 Category Endpoints

### Get All Categories

```http
GET /categories
```

**Response** (200):

```json
{
  "categories": [
    {
      "id": "uuid",
      "name": "Men's Clothing",
      "slug": "mens-clothing",
      "image_url": "https://...",
      "product_count": 45,
      "subcategories": [
        {
          "id": "uuid",
          "name": "T-Shirts",
          "slug": "t-shirts",
          "product_count": 15
        }
      ]
    }
  ]
}
```

---

## 🛒 Cart Endpoints

### Get Cart

```http
GET /cart
```

**Headers**: Requires authentication

**Response** (200):

```json
{
  "items": [
    {
      "id": "uuid",
      "product": {
        "id": "uuid",
        "name": "Classic T-Shirt",
        "slug": "classic-t-shirt",
        "image_url": "https://..."
      },
      "variant": {
        "id": "uuid",
        "size": "M",
        "color": "Blue",
        "price": 24.99
      },
      "quantity": 2,
      "subtotal": 49.98
    }
  ],
  "summary": {
    "items_count": 2,
    "subtotal": 49.98,
    "tax": 4.5,
    "shipping": 5.99,
    "discount": 0,
    "total": 60.47
  }
}
```

---

### Add to Cart

```http
POST /cart/items
```

**Headers**: Requires authentication

**Request Body**:

```json
{
  "product_id": "uuid",
  "variant_id": "uuid",
  "quantity": 1
}
```

**Response** (201):

```json
{
  "message": "Item added to cart",
  "cart_item_id": "uuid"
}
```

---

### Update Cart Item

```http
PATCH /cart/items/:id
```

**Headers**: Requires authentication

**Request Body**:

```json
{
  "quantity": 3
}
```

**Response** (200):

```json
{
  "message": "Cart item updated"
}
```

---

### Remove from Cart

```http
DELETE /cart/items/:id
```

**Headers**: Requires authentication

**Response** (200):

```json
{
  "message": "Item removed from cart"
}
```

---

### Clear Cart

```http
DELETE /cart
```

**Headers**: Requires authentication

**Response** (200):

```json
{
  "message": "Cart cleared"
}
```

---

## ❤️ Wishlist Endpoints

### Get Wishlist

```http
GET /wishlist
```

**Headers**: Requires authentication

**Response** (200):

```json
{
  "items": [
    {
      "id": "uuid",
      "product": {
        "id": "uuid",
        "name": "Classic T-Shirt",
        "slug": "classic-t-shirt",
        "image_url": "https://...",
        "base_price": 29.99,
        "sale_price": 24.99,
        "is_available": true
      },
      "added_at": "2024-01-15T10:30:00Z"
    }
  ]
}
```

---

### Add to Wishlist

```http
POST /wishlist
```

**Headers**: Requires authentication

**Request Body**:

```json
{
  "product_id": "uuid"
}
```

**Response** (201):

```json
{
  "message": "Added to wishlist",
  "wishlist_item_id": "uuid"
}
```

---

### Remove from Wishlist

```http
DELETE /wishlist/:product_id
```

**Headers**: Requires authentication

**Response** (200):

```json
{
  "message": "Removed from wishlist"
}
```

---

## 📦 Order Endpoints

### Create Order

```http
POST /orders
```

**Headers**: Requires authentication

**Request Body**:

```json
{
  "shipping_address": {
    "full_name": "John Doe",
    "address_line1": "123 Main St",
    "city": "New York",
    "state": "NY",
    "postal_code": "10001",
    "country": "USA",
    "phone": "+1234567890"
  },
  "billing_address": {
    // Same structure or use_shipping: true
  },
  "shipping_method": "standard",
  "payment_method": "credit_card",
  "payment_details": {
    // Payment gateway specific
  },
  "coupon_code": "SAVE10"
}
```

**Response** (201):

```json
{
  "order": {
    "id": "uuid",
    "order_number": "ORD-2024-001234",
    "status": "pending",
    "total_amount": 60.47,
    "payment_status": "pending"
  },
  "payment_url": "https://payment-gateway.com/..."
}
```

---

### Get User Orders

```http
GET /orders?page=1&limit=10&status=delivered
```

**Headers**: Requires authentication

**Query Parameters**:

- `page` (optional)
- `limit` (optional)
- `status` (optional)

**Response** (200):

```json
{
  "orders": [
    {
      "id": "uuid",
      "order_number": "ORD-2024-001234",
      "status": "delivered",
      "items_count": 3,
      "total_amount": 85.99,
      "created_at": "2024-01-15T10:30:00Z",
      "delivered_at": "2024-01-20T14:20:00Z"
    }
  ],
  "pagination": {...}
}
```

---

### Get Order Details

```http
GET /orders/:id
```

**Headers**: Requires authentication

**Response** (200):

```json
{
  "id": "uuid",
  "order_number": "ORD-2024-001234",
  "status": "delivered",
  "items": [
    {
      "product_name": "Classic T-Shirt",
      "variant_details": "Size: M, Color: Blue",
      "quantity": 2,
      "unit_price": 24.99,
      "total_price": 49.98,
      "image_url": "https://..."
    }
  ],
  "shipping_address": {...},
  "billing_address": {...},
  "subtotal": 49.98,
  "tax_amount": 4.50,
  "shipping_amount": 5.99,
  "discount_amount": 5.00,
  "total_amount": 55.47,
  "payment_method": "credit_card",
  "payment_status": "completed",
  "tracking_number": "1Z999AA10123456784",
  "created_at": "2024-01-15T10:30:00Z",
  "shipped_at": "2024-01-16T09:00:00Z",
  "delivered_at": "2024-01-20T14:20:00Z"
}
```

---

## 👤 User Account Endpoints

### Get Profile

```http
GET /account/profile
```

**Headers**: Requires authentication

**Response** (200):

```json
{
  "id": "uuid",
  "email": "user@example.com",
  "first_name": "John",
  "last_name": "Doe",
  "phone": "+1234567890",
  "email_verified": true,
  "created_at": "2024-01-01T00:00:00Z"
}
```

---

### Update Profile

```http
PATCH /account/profile
```

**Headers**: Requires authentication

**Request Body**:

```json
{
  "first_name": "John",
  "last_name": "Doe",
  "phone": "+1234567890"
}
```

**Response** (200):

```json
{
  "message": "Profile updated successfully"
}
```

---

### Change Password

```http
POST /account/change-password
```

**Headers**: Requires authentication

**Request Body**:

```json
{
  "current_password": "OldPass123!",
  "new_password": "NewPass456!"
}
```

**Response** (200):

```json
{
  "message": "Password changed successfully"
}
```

---

### Get Addresses

```http
GET /account/addresses
```

**Headers**: Requires authentication

**Response** (200):

```json
{
  "addresses": [
    {
      "id": "uuid",
      "address_type": "shipping",
      "is_default": true,
      "full_name": "John Doe",
      "address_line1": "123 Main St",
      "city": "New York",
      "state": "NY",
      "postal_code": "10001",
      "country": "USA",
      "phone": "+1234567890"
    }
  ]
}
```

---

### Add Address

```http
POST /account/addresses
```

**Headers**: Requires authentication

**Request Body**:

```json
{
  "address_type": "shipping",
  "is_default": true,
  "full_name": "John Doe",
  "address_line1": "123 Main St",
  "city": "New York",
  "state": "NY",
  "postal_code": "10001",
  "country": "USA",
  "phone": "+1234567890"
}
```

**Response** (201):

```json
{
  "message": "Address added successfully",
  "address_id": "uuid"
}
```

---

## 🎫 Coupon Endpoints

### Validate Coupon

```http
POST /coupons/validate
```

**Request Body**:

```json
{
  "code": "SAVE10",
  "subtotal": 100.0
}
```

**Response** (200):

```json
{
  "valid": true,
  "coupon": {
    "code": "SAVE10",
    "discount_type": "percentage",
    "discount_value": 10,
    "discount_amount": 10.0
  }
}
```

---

## 👨‍💼 Admin Endpoints

### Get All Orders (Admin)

```http
GET /admin/orders?page=1&status=pending
```

**Headers**: Requires admin authentication

**Response** (200):

```json
{
  "orders": [...],
  "pagination": {...}
}
```

---

### Update Order Status (Admin)

```http
PATCH /admin/orders/:id/status
```

**Headers**: Requires admin authentication

**Request Body**:

```json
{
  "status": "processing",
  "admin_notes": "Order is being prepared"
}
```

**Response** (200):

```json
{
  "message": "Order status updated"
}
```

---

### Create Product (Admin)

```http
POST /admin/products
```

**Headers**: Requires admin authentication

**Request Body**:

```json
{
  "name": "New T-Shirt",
  "slug": "new-t-shirt",
  "description": "Description...",
  "category_id": "uuid",
  "sku": "TSH-001",
  "base_price": 29.99,
  "gender": "unisex",
  "material": "Cotton",
  "variants": [
    {
      "size": "M",
      "color": "Blue",
      "stock_quantity": 50
    }
  ],
  "images": [
    {
      "url": "https://...",
      "alt_text": "Product image",
      "is_primary": true
    }
  ]
}
```

**Response** (201):

```json
{
  "message": "Product created successfully",
  "product_id": "uuid"
}
```

---

### Update Product (Admin)

```http
PATCH /admin/products/:id
```

**Headers**: Requires admin authentication

**Request Body**: (any fields to update)

**Response** (200):

```json
{
  "message": "Product updated successfully"
}
```

---

### Delete Product (Admin)

```http
DELETE /admin/products/:id
```

**Headers**: Requires admin authentication

**Response** (200):

```json
{
  "message": "Product deleted successfully"
}
```

---

### Get Analytics (Admin)

```http
GET /admin/analytics?start_date=2024-01-01&end_date=2024-01-31
```

**Headers**: Requires admin authentication

**Response** (200):

```json
{
  "revenue": {
    "total": 15000.00,
    "trend": "+12%"
  },
  "orders": {
    "total": 245,
    "trend": "+8%"
  },
  "top_products": [...],
  "sales_by_category": {...}
}
```

---

## 📊 Error Responses

### Standard Error Format

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable error message",
    "details": {...}
  }
}
```

### Common HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `422` - Validation Error
- `429` - Too Many Requests
- `500` - Internal Server Error

---

## 🔄 Pagination

All list endpoints support pagination:

**Query Parameters**:

- `page` (default: 1)
- `limit` (default: 24, max: 100)

**Response Format**:

```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 24,
    "total_pages": 5,
    "total_items": 120,
    "has_next": true,
    "has_prev": false
  }
}
```

---

## 🔍 Search & Filtering

- Use query parameters for filtering
- Combine multiple filters with `&`
- Use URL encoding for special characters
- Date formats: ISO 8601 (YYYY-MM-DDTHH:mm:ssZ)

---

## 🔐 Rate Limiting

- 100 requests/minute for authenticated users
- 20 requests/minute for unauthenticated users
- Check `X-RateLimit-Remaining` header

**Rate Limit Response** (429):

```json
{
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Too many requests. Please try again later.",
    "retry_after": 60
  }
}
```
