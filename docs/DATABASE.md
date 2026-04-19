# Database Schema: B & B

## Overview
We use **Neon PostgreSQL** (serverless). Access exclusively via raw SQL (`@neondatabase/serverless`) — no ORM.

---

## Tables

### 1. `coffees`
| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | SERIAL (PK) | Unique identifier |
| `name` | VARCHAR(255) | Coffee name |
| `origin` | VARCHAR(255) | Geographic origin |
| `roast_level` | VARCHAR(50) | Light / Medium / Dark |
| `price` | DECIMAL(10,2) | Price |
| `notes` | TEXT (nullable) | Flavor profile |
| `description` | TEXT | Product description |
| `image_url` | TEXT (nullable) | Image URL |
| `stock_quantity` | INTEGER | Current stock (added in migration 001) |
| `is_active` | BOOLEAN | Whether visible to customers (added in migration 001) |

### 2. `users`
| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | SERIAL (PK) | Unique identifier |
| `email` | VARCHAR(255) UNIQUE | Email address |
| `password_hash` | TEXT | bcryptjs password hash |
| `name` | VARCHAR(255) (nullable) | User's name |
| `session_token` | TEXT (nullable) | Active session token |
| `session_expires_at` | TIMESTAMP (nullable) | Session expiry |
| `created_at` | TIMESTAMP | Registration date |

### 3. `orders`
| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | SERIAL (PK) | Unique identifier |
| `user_id` | INTEGER (FK → users) | Customer |
| `stripe_session_id` | TEXT UNIQUE | Stripe Checkout Session ID |
| `stripe_payment_intent` | TEXT (nullable) | Stripe Payment Intent ID |
| `status` | VARCHAR(50) | `pending` / `paid` |
| `total_amount` | DECIMAL(10,2) | Total amount |
| `delivery_type` | TEXT (nullable) | `delivery` / `pickup` |
| `delivery_address` | TEXT (nullable) | Delivery address |
| `delivery_lat` | NUMERIC(10,7) (nullable) | GPS latitude |
| `delivery_lng` | NUMERIC(10,7) (nullable) | GPS longitude |
| `pickup_location_id` | INTEGER (FK → pickup_locations, nullable) | Selected pickup location |
| `created_at` | TIMESTAMP | Order date |

### 4. `order_items`
| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | SERIAL (PK) | Unique identifier |
| `order_id` | INTEGER (FK → orders, CASCADE DELETE) | Order |
| `coffee_id` | INTEGER (FK → coffees, SET NULL) | Coffee |
| `name` | VARCHAR(255) | Name at time of purchase |
| `price` | DECIMAL(10,2) | Price at time of purchase |
| `quantity` | INTEGER | Quantity |

### 5. `pickup_locations`
| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | SERIAL (PK) | Unique identifier |
| `name` | TEXT | Location name (e.g., "Zemun Market") |
| `address` | TEXT | Full address |
| `lat` | NUMERIC(10,7) | GPS latitude |
| `lng` | NUMERIC(10,7) | GPS longitude |
| `is_active` | BOOLEAN | Whether available to customers |
| `created_at` | TIMESTAMPTZ | Creation date |

### 6. `events`
| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | SERIAL (PK) | Unique identifier |
| `name` | TEXT | Event name (e.g., `add_to_cart`) |
| `properties` | JSONB (nullable) | Arbitrary event metadata |
| `user_id` | INTEGER (FK → users, SET NULL) | Associated user (if logged in) |
| `created_at` | TIMESTAMPTZ | Event timestamp |

---

## Migrations
| File | Contents |
| :--- | :--- |
| `001_add_stock.sql` | `stock_quantity`, `is_active` on `coffees` |
| `002_users_orders.sql` | `users`, `orders`, `order_items` tables |
| `003_delivery_address.sql` | `delivery_address`, `delivery_lat`, `delivery_lng` on `orders` |
| `004_pickup_locations.sql` | `pickup_locations` table + `delivery_type`, `pickup_location_id` on `orders` |
| `005_events.sql` | `events` table with index on `(name, created_at)` |
