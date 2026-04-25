# Feelmore — Database Setup

## Stack
- **Next.js 14** + TypeScript
- **Neon PostgreSQL** (serverless)
- **Prisma ORM**

---

## 1. Environment Variables

Create a `.env` file at the project root:

```env
# Neon DB — get both from your Neon dashboard
DATABASE_URL="postgresql://user:password@ep-xxx.neon.tech/feelmore?sslmode=require&pgbouncer=true&connect_timeout=15"
DIRECT_URL="postgresql://user:password@ep-xxx.neon.tech/feelmore?sslmode=require"
```

> `DATABASE_URL` uses the **pooled** connection (via PgBouncer).
> `DIRECT_URL` uses the **direct** connection (required for migrations).

---

## 2. Install Dependencies

```bash
npm install
```

---

## 3. Push Schema to Neon

```bash
npm run db:push
```

Or use migrations (recommended for production):

```bash
npm run db:migrate
```

---

## 4. Seed the Database

```bash
npm run db:seed
```

This creates:
- **4 users** (1 admin + 3 customers)
- **7 categories** (Vibrators, Sex Dolls, Lubricants, Couples, Massagers, Accessories, Doodles)
- **14 products** with variants and images
- **16 tags**
- **6 reviews**
- **3 cart items**
- **3 wishlist items**
- **3 orders** (with order items)
- **4 community stories** with likes and comments
- **3 banners**

---

## 5. Explore with Prisma Studio

```bash
npm run db:studio
```

---

## Seed Credentials

| Role    | Email                    | Password    |
|---------|--------------------------|-------------|
| Admin   | admin@feelmore.shop      | Admin@1234  |
| User    | ama@example.com          | User@1234   |
| User    | kwame@example.com        | User@1234   |
| User    | abena@example.com        | User@1234   |

---

## Schema Overview

```
User
├── orders       → Order → OrderItem → Product
├── reviews      → Review → Product
├── cart         → CartItem → Product
├── wishlist     → WishlistItem → Product
├── addresses    → Address
└── stories      → Story → StoryLike, StoryComment

Product
├── category     → Category (with optional parent)
├── images       → ProductImage
├── variants     → ProductVariant
├── tags         → ProductTag → Tag
├── reviews      → Review
└── orderItems   → OrderItem

Story
├── category     → REAL_TALK | WOMEN_SAY | FOR_COUPLES | TIPS
├── likes        → StoryLike
└── comments     → StoryComment

Banner           (homepage hero/promo banners)
```

---

## Reset Everything

```bash
npm run db:reset
```

This drops all tables and reruns migrations + seed.
