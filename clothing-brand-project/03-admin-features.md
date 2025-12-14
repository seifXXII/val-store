# Admin Panel Features & Pages

## 🎯 Admin Dashboard Overview

### Main Dashboard (`/admin`)

**Purpose**: Central hub for quick overview and actions

**Key Metrics**:

- Total revenue (today, week, month, year)
- New orders count
- Low stock alerts
- Pending reviews
- New customers
- Active users

**Charts & Graphs**:

- Sales trend (last 30 days)
- Top-selling products
- Revenue by category
- Order status distribution
- Traffic sources

**Quick Actions**:

- Create new product
- Process pending orders
- View inventory alerts
- Export reports

---

## 📦 Product Management

### Product List Page (`/admin/products`)

**Features**:

- Searchable table with filters
- Sort by: name, price, stock, created date
- Filter by: category, status, price range
- Bulk actions: activate/deactivate, delete
- Export to CSV
- Pagination

**Table Columns**:

- Product image thumbnail
- SKU
- Product name
- Category
- Price
- Stock quantity
- Status (active/inactive)
- Actions (edit, duplicate, delete)

---

### Create Product Page (`/admin/products/new`)

**Form Sections**:

1. **Basic Information**

   - Product name (required)
   - Slug (auto-generated, editable)
   - SKU (required, unique)
   - Description (rich text editor)
   - Category (dropdown)
   - Gender (select)

2. **Pricing**

   - Base price (required)
   - Sale price (optional)
   - Cost price (for profit calculation)

3. **Variants**

   - Add multiple size/color combinations
   - Each variant:
     - SKU (auto-generated)
     - Size
     - Color
     - Stock quantity
     - Price adjustment (optional)
     - Availability toggle

4. **Images**

   - Drag-and-drop upload
   - Multiple images
   - Set primary image
   - Reorder images
   - Alt text for SEO

5. **Additional Details**

   - Material
   - Care instructions
   - Featured product toggle

6. **SEO**
   - Meta title
   - Meta description

**Actions**:

- Save as draft
- Publish
- Save and create another
- Cancel

---

### Edit Product Page (`/admin/products/:id`)

**Same as create page plus**:

- View creation date
- View last update
- Product views count
- Sales count
- Delete product (with confirmation)

---

## 📋 Order Management

### Orders List Page (`/admin/orders`)

**Features**:

- Real-time order updates
- Quick status change
- Search by order number, customer name, email
- Filter by: status, date range, payment method
- Sort by: date, total amount, status
- Export filtered orders

**Table Columns**:

- Order number
- Customer name
- Date
- Items count
- Total amount
- Payment status
- Order status
- Actions (view, update status)

**Status Colors**:

- Pending: Yellow
- Processing: Blue
- Shipped: Purple
- Delivered: Green
- Cancelled: Red
- Refunded: Gray

---

### Order Detail Page (`/admin/orders/:id`)

**Sections**:

1. **Order Information**

   - Order number
   - Order date
   - Current status with timeline
   - Customer details (name, email, phone)

2. **Items List**

   - Product image
   - Product name and variant
   - Quantity
   - Unit price
   - Total

3. **Pricing Breakdown**

   - Subtotal
   - Tax
   - Shipping
   - Discount
   - Total

4. **Shipping Address**

   - Full address display
   - Phone number

5. **Billing Address**

   - Full address display
   - Same as shipping checkbox

6. **Payment Information**

   - Payment method
   - Transaction ID
   - Payment status
   - Amount paid

7. **Order Notes**

   - Customer notes (view only)
   - Admin notes (editable)

8. **Order Actions**
   - Update status (dropdown)
   - Print invoice
   - Send tracking email
   - Refund order
   - Cancel order

---

## 📊 Inventory Management

### Inventory Overview (`/admin/inventory`)

**Features**:

- Stock levels for all variants
- Low stock alerts (configurable threshold)
- Out of stock items
- Filter by category, product
- Quick stock adjustment

**Table Columns**:

- Product image
- Product name
- Variant (size/color)
- SKU
- Current stock
- Reserved (in carts/pending orders)
- Available stock
- Quick adjust (input + save)

---

### Inventory History (`/admin/inventory/history`)

**Features**:

- All stock changes log
- Filter by: date range, product, change type
- Show: product, variant, change type, quantity, reason, date, admin

---

### Stock Adjustment Page (`/admin/inventory/adjust`)

**Form**:

- Select product and variant
- Change type (restock, adjustment, damaged, return)
- Quantity change
- Reason (required)
- Submit

---

## 👥 Customer Management

### Customers List (`/admin/customers`)

**Features**:

- Search by name, email, phone
- Filter by: registration date, total orders, status
- Sort by: name, total spent, last order date
- View customer details
- Export customer list

**Table Columns**:

- Customer name
- Email
- Phone
- Total orders
- Total spent
- Last order date
- Status (active/inactive)
- Actions (view, edit, deactivate)

---

### Customer Detail Page (`/admin/customers/:id`)

**Sections**:

1. **Customer Information**

   - Name
   - Email (verified badge)
   - Phone
   - Registration date
   - Last login

2. **Statistics**

   - Total orders
   - Total spent
   - Average order value
   - Lifetime value

3. **Order History**

   - List of all orders
   - Order number, date, total, status

4. **Addresses**

   - Saved shipping addresses
   - Saved billing addresses

5. **Admin Actions**
   - Activate/deactivate account
   - Reset password (send email)
   - Add admin note

---

## 🏷️ Category Management

### Categories Page (`/admin/categories`)

**Features**:

- Hierarchical tree view
- Drag and drop to reorder
- Create, edit, delete categories
- Set category image
- Toggle active status

**Form Fields**:

- Category name
- Slug
- Description
- Parent category (create hierarchy)
- Category image
- Display order
- Active status

---

## 💰 Coupon Management

### Coupons List (`/admin/coupons`)

**Table Columns**:

- Coupon code
- Description
- Discount type/value
- Usage (X/Y or unlimited)
- Valid from/to
- Status
- Actions (edit, deactivate, delete)

---

### Create/Edit Coupon (`/admin/coupons/new`)

**Form Fields**:

- Coupon code (auto-generate option)
- Description
- Discount type (percentage/fixed amount)
- Discount value
- Minimum purchase amount
- Maximum discount amount
- Usage limit (total)
- Per-user limit
- Start date/time
- Expiry date/time
- Active status

---

## ⭐ Review Management

### Reviews List (`/admin/reviews`)

**Features**:

- Filter by: approval status, rating, product
- Search by product name, customer name
- Bulk approve/reject

**Table Columns**:

- Product name
- Customer name
- Rating (stars)
- Review title
- Date submitted
- Verified purchase badge
- Status (pending/approved/rejected)
- Actions (view, approve, reject, delete)

---

### Review Detail Modal

- Full review content
- Product details
- Customer details
- Order information (if verified purchase)
- Approve/reject buttons
- Delete option

---

## 📈 Analytics & Reports

### Analytics Dashboard (`/admin/analytics`)

**Sections**:

1. **Sales Analytics**

   - Revenue trends (daily, weekly, monthly)
   - Sales by category
   - Sales by product
   - Average order value
   - Conversion rate

2. **Customer Analytics**

   - New vs returning customers
   - Customer lifetime value
   - Customer acquisition cost
   - Geographic distribution

3. **Product Analytics**

   - Best sellers
   - Worst performers
   - Most viewed products
   - Most wishlisted products
   - Low stock products

4. **Traffic Analytics**
   - Page views
   - Bounce rate
   - Average session duration
   - Traffic sources

**Export Options**:

- PDF reports
- Excel exports
- CSV downloads
- Custom date ranges

---

## ⚙️ Settings (Super Admin Only)

### General Settings (`/admin/settings/general`)

- Store name
- Contact email
- Phone number
- Store address
- Currency
- Tax rate
- Shipping zones

### Payment Settings (`/admin/settings/payments`)

- Enable/disable payment methods
- Payment gateway credentials
- Test mode toggle

### Email Settings (`/admin/settings/email`)

- SMTP configuration
- Email templates
- Notification preferences

### User Management (`/admin/users`)

- Admin users list
- Create new admin
- Assign roles
- Deactivate users

---

## 🎨 UI/UX Design Guidelines

### Layout

- Sidebar navigation with icons
- Top bar with search, notifications, profile
- Breadcrumb navigation
- Mobile responsive

### Color Scheme

- Primary: Brand color
- Success: Green (#10b981)
- Warning: Yellow (#f59e0b)
- Danger: Red (#ef4444)
- Info: Blue (#3b82f6)

### Components

- Data tables with pagination
- Modal dialogs for confirmations
- Toast notifications for actions
- Loading states
- Empty states with helpful messages
- Form validation with clear error messages

---

## 🔔 Notifications System

### Types of Notifications

1. **New Order** - Bell icon, red badge
2. **Low Stock Alert** - Warning icon, yellow badge
3. **New Review** - Star icon
4. **Failed Payment** - Error icon, red badge
5. **New Customer** - User icon

### Notification Center

- Dropdown from bell icon
- Mark as read
- View all notifications page
- Filter by type
- Clear all option

---

## 📱 Mobile Responsiveness

### Mobile Menu

- Hamburger menu
- Collapsible sidebar
- Touch-friendly buttons
- Optimized tables (horizontal scroll or card view)

### Mobile Optimizations

- Large touch targets (min 44px)
- Swipe actions on lists
- Bottom navigation for key actions
- Simplified forms with better input types

---

## 🔐 Admin Security

### Access Control

- Role-based permissions
- Action logging
- Session timeout (30 minutes)
- Require re-authentication for sensitive actions

### Audit Trail

- Log all admin actions
- Track: who, what, when
- View logs page
- Export audit logs

---

## 📋 Quick Reference

### Common Admin Tasks

1. **Process New Order**

   - Orders → Select order → Update status to "Processing"
   - Send confirmation email

2. **Add New Product**

   - Products → New → Fill form → Add variants → Upload images → Publish

3. **Handle Low Stock**

   - Inventory → Adjust stock → Select product → Update quantity

4. **Approve Review**

   - Reviews → Select pending review → Approve

5. **Create Coupon**
   - Coupons → New → Set code, discount, dates → Save

---

## 💡 Best Practices

1. **Always verify stock** before marking order as shipped
2. **Review customer notes** in orders before processing
3. **Keep audit trail** of all major actions
4. **Regular backups** of product and customer data
5. **Monitor low stock alerts** daily
6. **Respond to reviews** (approve/reject) within 24 hours
7. **Test coupons** before making them live
8. **Review analytics weekly** to identify trends
