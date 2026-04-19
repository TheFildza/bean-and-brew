# Database Schema: Bean & Brew

## Overview
We use **Neon PostgreSQL**, a serverless database that allows for instant branching and autoscaling, which is ideal for a growing SaaS product.

## Tables

### 1. `coffees`
Stores the core product catalog.

| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | SERIAL (PK) | Unique identifier for each roast. |
| `name` | VARCHAR(255) | Name of the coffee blend or single origin. |
| `origin` | VARCHAR(255) | Geographic origin (e.g., Ethiopia, Brazil). |
| `roast_level` | VARCHAR(50) | Light, Medium, or Dark. |
| `price` | DECIMAL(10,2) | Price per bag (250g/500g). |
| `notes` | TEXT | Flavor profile notes (e.g., Citrus, Chocolate). |
| `description` | TEXT | Longer storytelling description for the product page. |
| `image_url` | TEXT | URL to the product image. |

## Future Expansion (Phase 2+)
- `orders`: For tracking customer purchases.
- `customers`: For managing D2C relationships and preferences.
- `ai_recommendations`: To store interaction history for the AI Sommelier.