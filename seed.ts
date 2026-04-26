// prisma/seed.ts
// Run with: npx prisma db seed

import { PrismaClient, UserRole, OrderStatus, StoryCategory } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // ─── CLEAN SLATE ──────────────────────────────────────────────────────────
  await prisma.eroticaRead.deleteMany();
  await prisma.eroticaBookmark.deleteMany();
  await prisma.eroticaComment.deleteMany();
  await prisma.eroticaReaction.deleteMany();
  await prisma.eroticaSeriesLike.deleteMany();
  await prisma.eroticaEpisode.deleteMany();
  await prisma.eroticaSeries.deleteMany();
  await prisma.storyComment.deleteMany();
  await prisma.storyLike.deleteMany();
  await prisma.story.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.wishlistItem.deleteMany();
  await prisma.review.deleteMany();
  await prisma.productTag.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.product.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.category.deleteMany();
  await prisma.address.deleteMany();
  await prisma.user.deleteMany();
  await prisma.banner.deleteMany();

  console.log("✅ Cleared existing data");

  // ─── USERS ────────────────────────────────────────────────────────────────
  const adminPassword = await bcrypt.hash("Admin@1234", 12);
  const userPassword = await bcrypt.hash("User@1234", 12);

  const admin = await prisma.user.create({
    data: {
      email: "admin@feelmore.shop",
      passwordHash: adminPassword,
      name: "Admin",
      role: UserRole.ADMIN,
      verified: true,
    },
  });

  const user1 = await prisma.user.create({
    data: {
      email: "ama@example.com",
      passwordHash: userPassword,
      name: "Ama Serwaa",
      verified: true,
    },
  });

  const user2 = await prisma.user.create({
    data: {
      email: "kwame@example.com",
      passwordHash: userPassword,
      name: "Kwame Mensah",
      verified: true,
    },
  });

  const user3 = await prisma.user.create({
    data: {
      email: "abena@example.com",
      passwordHash: userPassword,
      name: "Abena Owusu",
      verified: false,
    },
  });

  console.log("✅ Users seeded");

  // ─── ADDRESSES ────────────────────────────────────────────────────────────
  const address1 = await prisma.address.create({
    data: {
      userId: user1.id,
      fullName: "Ama Serwaa",
      phone: "0244000001",
      street: "12 Independence Ave",
      city: "Accra",
      region: "Greater Accra",
      country: "Ghana",
      isDefault: true,
    },
  });

  await prisma.address.create({
    data: {
      userId: user2.id,
      fullName: "Kwame Mensah",
      phone: "0244000002",
      street: "5 Osei Tutu Road",
      city: "Kumasi",
      region: "Ashanti",
      country: "Ghana",
      isDefault: true,
    },
  });

  console.log("✅ Addresses seeded");

  // ─── CATEGORIES ───────────────────────────────────────────────────────────
  const catVibrators = await prisma.category.create({
    data: {
      name: "Vibrators",
      slug: "vibrators",
      description: "From gentle to powerful — find your perfect vibe.",
      image: "/images/categories/vibrators.jpg",
    },
  });

  const catDolls = await prisma.category.create({
    data: {
      name: "Sex Dolls",
      slug: "sex-dolls",
      description: "Lifelike companionship, crafted with premium materials.",
      image: "/images/categories/sex-dolls.jpg",
    },
  });

  const catLubricants = await prisma.category.create({
    data: {
      name: "Lubricants",
      slug: "lubricants",
      description: "Body-safe lubes for every experience.",
      image: "/images/categories/lubricants.jpg",
    },
  });

  const catCouples = await prisma.category.create({
    data: {
      name: "Couples",
      slug: "couples",
      description: "Designed to bring you closer.",
      image: "/images/categories/couples.jpg",
    },
  });

  const catMassagers = await prisma.category.create({
    data: {
      name: "Massagers",
      slug: "massagers",
      description: "Wellness and pleasure, together.",
      image: "/images/categories/massagers.jpg",
    },
  });

  const catAccessories = await prisma.category.create({
    data: {
      name: "Accessories",
      slug: "accessories",
      description: "Elevate your experience.",
      image: "/images/categories/accessories.jpg",
    },
  });

  const catDoodles = await prisma.category.create({
    data: {
      name: "Doodles",
      slug: "doodles",
      description: "Playful novelty items and fun gifts.",
      image: "/images/categories/doodles.jpg",
    },
  });

  console.log("✅ Categories seeded");

  // ─── TAGS ─────────────────────────────────────────────────────────────────
  const tags = await Promise.all(
    [
      "beginner-friendly",
      "quiet",
      "waterproof",
      "rechargeable",
      "body-safe",
      "silicone",
      "couples",
      "solo",
      "discreet",
      "bestseller",
      "g-spot",
      "clitoral",
      "anal",
      "premium",
      "water-based",
      "long-lasting",
    ].map((name) =>
      prisma.tag.create({
        data: { name, slug: name },
      })
    )
  );

  const tagMap = Object.fromEntries(tags.map((t) => [t.slug, t]));

  console.log("✅ Tags seeded");

  // ─── PRODUCTS ─────────────────────────────────────────────────────────────
  // Helper to connect tags
  const connectTags = (slugs: string[]) => ({
    create: slugs.map((slug) => ({ tag: { connect: { id: tagMap[slug].id } } })),
  });

  // VIBRATORS
  const lunaMini = await prisma.product.create({
    data: {
      name: "Luna Mini",
      slug: "luna-mini",
      description:
        "The Luna Mini is the perfect starter vibrator. Compact, whisper-quiet, and crafted from body-safe silicone. 10 vibration modes, USB rechargeable, and waterproof for shower play.",
      shortDesc: "Beginner friendly",
      price: 320,
      comparePrice: 380,
      currency: "GHS",
      stock: 45,
      sku: "VIB-001",
      isBestseller: true,
      isFeatured: true,
      badge: "Bestseller",
      tagline: "Beginner friendly",
      categoryId: catVibrators.id,
      images: {
        create: [
          { url: "/images/products/luna-mini-1.jpg", alt: "Luna Mini vibrator", isPrimary: true, order: 0 },
          { url: "/images/products/luna-mini-2.jpg", alt: "Luna Mini - side view", isPrimary: false, order: 1 },
        ],
      },
      tags: connectTags(["beginner-friendly", "quiet", "waterproof", "rechargeable", "silicone", "clitoral", "bestseller"]),
      variants: {
        create: [
          { name: "Color", value: "Rose Pink", stock: 25 },
          { name: "Color", value: "Lilac", stock: 12 },
          { name: "Color", value: "Black", stock: 8 },
        ],
      },
    },
  });

  const vibeRing = await prisma.product.create({
    data: {
      name: "Vibe Ring",
      slug: "vibe-ring",
      description:
        "A stretchy, ultra-soft vibrating ring designed to enhance sensation for both partners. Slip it on for stronger, longer-lasting pleasure. One size fits most.",
      shortDesc: "Stronger connection",
      price: 280,
      currency: "GHS",
      stock: 60,
      sku: "COU-001",
      isFeatured: true,
      tagline: "Stronger connection",
      categoryId: catCouples.id,
      images: {
        create: [
          { url: "/images/products/vibe-ring-1.jpg", alt: "Vibe Ring", isPrimary: true, order: 0 },
        ],
      },
      tags: connectTags(["couples", "rechargeable", "body-safe", "silicone"]),
    },
  });

  const roseBullet = await prisma.product.create({
    data: {
      name: "Rose Bullet",
      slug: "rose-bullet",
      description:
        "Small but mighty. The Rose Bullet delivers precise, powerful stimulation in a pocket-sized body. Whisper-quiet motor — your secret is safe.",
      shortDesc: "Quiet & discreet",
      price: 250,
      comparePrice: 310,
      currency: "GHS",
      stock: 80,
      sku: "VIB-002",
      isFeatured: true,
      tagline: "Quiet & discreet",
      categoryId: catVibrators.id,
      images: {
        create: [
          { url: "/images/products/rose-bullet-1.jpg", alt: "Rose Bullet vibrator", isPrimary: true, order: 0 },
        ],
      },
      tags: connectTags(["quiet", "discreet", "rechargeable", "body-safe", "clitoral"]),
      variants: {
        create: [
          { name: "Color", value: "Dusty Rose", stock: 40 },
          { name: "Color", value: "Nude", stock: 40 },
        ],
      },
    },
  });

  const gSpot = await prisma.product.create({
    data: {
      name: "G-Spot",
      slug: "g-spot-pro",
      description:
        "Curved with precision, the G-Spot Pro targets your most sensitive inner zone. 12 patterns, flexible neck, whisper-quiet, and fully waterproof.",
      shortDesc: "Deep pleasure",
      price: 420,
      comparePrice: 500,
      currency: "GHS",
      stock: 30,
      sku: "VIB-003",
      isFeatured: true,
      tagline: "Deep pleasure",
      categoryId: catVibrators.id,
      images: {
        create: [
          { url: "/images/products/g-spot-1.jpg", alt: "G-Spot Pro vibrator", isPrimary: true, order: 0 },
        ],
      },
      tags: connectTags(["g-spot", "waterproof", "rechargeable", "silicone", "premium"]),
    },
  });

  // SEX DOLLS
  const siennaDoll = await prisma.product.create({
    data: {
      name: "Sienna — Torso Doll",
      slug: "sienna-torso-doll",
      description:
        "Crafted from premium TPE material, Sienna offers a lifelike tactile experience. Lightweight, easy to store, and designed for realistic intimacy. Comes with cleaning kit.",
      shortDesc: "Premium TPE, lifelike",
      price: 2800,
      comparePrice: 3200,
      currency: "GHS",
      stock: 15,
      sku: "DOLL-001",
      isFeatured: true,
      badge: "Premium",
      tagline: "Lifelike sensation",
      categoryId: catDolls.id,
      images: {
        create: [
          { url: "/images/products/sienna-doll-1.jpg", alt: "Sienna torso doll", isPrimary: true, order: 0 },
        ],
      },
      tags: connectTags(["premium", "body-safe", "solo"]),
    },
  });

  const noaDoll = await prisma.product.create({
    data: {
      name: "Noa — Full Figure",
      slug: "noa-full-figure-doll",
      description:
        "Noa is a full-figure love doll with articulated joints and ultra-realistic features. Premium silicone skin, poseable skeleton, and a custom storage bag included.",
      shortDesc: "Full figure, poseable",
      price: 8500,
      comparePrice: 9500,
      currency: "GHS",
      stock: 5,
      sku: "DOLL-002",
      isBestseller: false,
      badge: "Premium",
      tagline: "Fully poseable",
      categoryId: catDolls.id,
      images: {
        create: [
          { url: "/images/products/noa-doll-1.jpg", alt: "Noa full figure doll", isPrimary: true, order: 0 },
        ],
      },
      tags: connectTags(["premium", "body-safe", "solo"]),
    },
  });

  // LUBRICANTS
  const silkGlide = await prisma.product.create({
    data: {
      name: "Silk Glide — Water Based",
      slug: "silk-glide-water-based",
      description:
        "A smooth, long-lasting water-based lubricant. Compatible with all toy materials. Paraben-free, fragrance-free, and pH-balanced for body safety.",
      shortDesc: "Long-lasting, toy safe",
      price: 95,
      comparePrice: 120,
      currency: "GHS",
      stock: 200,
      sku: "LUB-001",
      isBestseller: true,
      badge: "Bestseller",
      tagline: "Toy safe & pH balanced",
      categoryId: catLubricants.id,
      images: {
        create: [
          { url: "/images/products/silk-glide-1.jpg", alt: "Silk Glide lubricant", isPrimary: true, order: 0 },
        ],
      },
      tags: connectTags(["water-based", "body-safe", "long-lasting", "bestseller"]),
      variants: {
        create: [
          { name: "Size", value: "50ml", price: 95, stock: 100 },
          { name: "Size", value: "100ml", price: 160, stock: 80 },
          { name: "Size", value: "200ml", price: 280, stock: 20 },
        ],
      },
    },
  });

  const velvetSilicone = await prisma.product.create({
    data: {
      name: "Velvet — Silicone Lube",
      slug: "velvet-silicone-lube",
      description:
        "Ultra-silky silicone lubricant for extended sessions. A little goes a long way. Not compatible with silicone toys. Perfect for skin-to-skin.",
      shortDesc: "Silky & long-lasting",
      price: 145,
      currency: "GHS",
      stock: 120,
      sku: "LUB-002",
      tagline: "Silky & long-lasting",
      categoryId: catLubricants.id,
      images: {
        create: [
          { url: "/images/products/velvet-lube-1.jpg", alt: "Velvet silicone lubricant", isPrimary: true, order: 0 },
        ],
      },
      tags: connectTags(["silicone", "long-lasting", "body-safe"]),
    },
  });

  const warmingLube = await prisma.product.create({
    data: {
      name: "Ignite — Warming Lube",
      slug: "ignite-warming-lube",
      description:
        "Feel the warmth. Ignite is a water-based warming lubricant that creates a gentle heat sensation. Perfect for adding that extra spark.",
      shortDesc: "Warming sensation",
      price: 120,
      currency: "GHS",
      stock: 80,
      sku: "LUB-003",
      tagline: "Warming sensation",
      categoryId: catLubricants.id,
      images: {
        create: [
          { url: "/images/products/ignite-lube-1.jpg", alt: "Ignite warming lube", isPrimary: true, order: 0 },
        ],
      },
      tags: connectTags(["water-based", "body-safe"]),
    },
  });

  // COUPLES
  const doubleTrouble = await prisma.product.create({
    data: {
      name: "Double Trouble",
      slug: "double-trouble-couples-vibe",
      description:
        "Wear it together. The Double Trouble couples vibrator stimulates both partners simultaneously during intimacy. Remote-controlled with 7 shared vibration patterns.",
      shortDesc: "For both of you",
      price: 580,
      comparePrice: 650,
      currency: "GHS",
      stock: 25,
      sku: "COU-002",
      isFeatured: true,
      badge: "Hot",
      tagline: "Shared pleasure",
      categoryId: catCouples.id,
      images: {
        create: [
          { url: "/images/products/double-trouble-1.jpg", alt: "Double Trouble couples vibrator", isPrimary: true, order: 0 },
        ],
      },
      tags: connectTags(["couples", "rechargeable", "waterproof", "silicone", "premium"]),
    },
  });

  // MASSAGERS
  const wandMassager = await prisma.product.create({
    data: {
      name: "Magic Wand",
      slug: "magic-wand-massager",
      description:
        "The legendary wand, reimagined. Powerful full-body massager with a flexible neck and 20 vibration settings. Equally at home on sore shoulders or everywhere else.",
      shortDesc: "Legendary power",
      price: 650,
      comparePrice: 750,
      currency: "GHS",
      stock: 20,
      sku: "MAS-001",
      isFeatured: true,
      tagline: "Legendary power",
      categoryId: catMassagers.id,
      images: {
        create: [
          { url: "/images/products/magic-wand-1.jpg", alt: "Magic Wand massager", isPrimary: true, order: 0 },
        ],
      },
      tags: connectTags(["rechargeable", "waterproof", "body-safe", "clitoral", "premium"]),
    },
  });

  // DOODLES
  const naughtyDice = await prisma.product.create({
    data: {
      name: "Naughty Dice",
      slug: "naughty-dice",
      description:
        "Roll for fun. A set of 2 adult dice — one for body parts, one for actions. The perfect icebreaker gift for couples or a cheeky party game.",
      shortDesc: "Roll & play",
      price: 45,
      currency: "GHS",
      stock: 300,
      sku: "DOO-001",
      tagline: "Roll & play",
      categoryId: catDoodles.id,
      images: {
        create: [
          { url: "/images/products/naughty-dice-1.jpg", alt: "Naughty dice set", isPrimary: true, order: 0 },
        ],
      },
      tags: connectTags(["couples", "beginner-friendly"]),
    },
  });

  const cheekyCard = await prisma.product.create({
    data: {
      name: "Cheeky Card Game",
      slug: "cheeky-card-game",
      description:
        "52 cards, endless possibilities. A flirty card game for adventurous couples. Draw, dare, and discover new sides of each other.",
      shortDesc: "52 cards for couples",
      price: 80,
      currency: "GHS",
      stock: 150,
      sku: "DOO-002",
      tagline: "52 cards for couples",
      categoryId: catDoodles.id,
      images: {
        create: [
          { url: "/images/products/cheeky-cards-1.jpg", alt: "Cheeky card game", isPrimary: true, order: 0 },
        ],
      },
      tags: connectTags(["couples", "beginner-friendly"]),
    },
  });

  // ACCESSORIES
  const toyCleanser = await prisma.product.create({
    data: {
      name: "Pure Clean Spray",
      slug: "pure-clean-toy-spray",
      description:
        "Keep your toys hygienic. An antibacterial, fragrance-free toy cleaner that's safe on all materials. Spray, wipe, play.",
      shortDesc: "Antibacterial, all materials",
      price: 60,
      currency: "GHS",
      stock: 250,
      sku: "ACC-001",
      tagline: "Spray, wipe, play",
      categoryId: catAccessories.id,
      images: {
        create: [
          { url: "/images/products/pure-clean-1.jpg", alt: "Pure Clean toy spray", isPrimary: true, order: 0 },
        ],
      },
      tags: connectTags(["body-safe"]),
    },
  });

  const storageBag = await prisma.product.create({
    data: {
      name: "Velvet Storage Pouch",
      slug: "velvet-storage-pouch",
      description:
        "A discreet, dust-proof velvet pouch to safely store your items. Keeps toys clean, private, and protected. Available in 3 sizes.",
      shortDesc: "Discreet storage",
      price: 35,
      currency: "GHS",
      stock: 400,
      sku: "ACC-002",
      tagline: "Discreet & protective",
      categoryId: catAccessories.id,
      images: {
        create: [
          { url: "/images/products/velvet-pouch-1.jpg", alt: "Velvet storage pouch", isPrimary: true, order: 0 },
        ],
      },
      tags: connectTags(["discreet"]),
      variants: {
        create: [
          { name: "Size", value: "Small", price: 35, stock: 150 },
          { name: "Size", value: "Medium", price: 50, stock: 150 },
          { name: "Size", value: "Large", price: 65, stock: 100 },
        ],
      },
    },
  });

  console.log("✅ Products seeded");

  // ─── REVIEWS ──────────────────────────────────────────────────────────────
  await prisma.review.createMany({
    data: [
      {
        productId: lunaMini.id,
        userId: user1.id,
        rating: 5,
        title: "Life-changing tbh",
        body: "I was nervous to buy my first toy but the Luna Mini was so gentle and easy to use. Packaging was discreet and delivery was fast. 10/10.",
        verified: true,
      },
      {
        productId: lunaMini.id,
        userId: user2.id,
        rating: 4,
        title: "Great for beginners",
        body: "Very quiet, which I loved. Battery life could be longer but overall really happy with it.",
        verified: true,
      },
      {
        productId: roseBullet.id,
        userId: user1.id,
        rating: 5,
        title: "Tiny but powerful",
        body: "Don't let the size fool you. This little thing packs a punch. And it's SO quiet.",
        verified: true,
      },
      {
        productId: silkGlide.id,
        userId: user3.id,
        rating: 5,
        title: "Best lube I've tried",
        body: "No weird smell, doesn't dry out fast, and it's compatible with my toys. Repurchasing.",
        verified: false,
      },
      {
        productId: doubleTrouble.id,
        userId: user2.id,
        rating: 5,
        title: "Changed date night",
        body: "Me and my partner absolutely love this. The remote control feature is a game changer.",
        verified: true,
      },
      {
        productId: gSpot.id,
        userId: user1.id,
        rating: 5,
        title: "Premium product",
        body: "Worth every pesewa. The curve is perfect, the patterns are varied, and it's completely waterproof.",
        verified: true,
      },
    ],
  });

  console.log("✅ Reviews seeded");

  // ─── CART ITEMS ───────────────────────────────────────────────────────────
  await prisma.cartItem.createMany({
    data: [
      { userId: user1.id, productId: roseBullet.id, quantity: 1 },
      { userId: user1.id, productId: silkGlide.id, quantity: 2 },
      { userId: user2.id, productId: doubleTrouble.id, quantity: 1 },
    ],
  });

  console.log("✅ Cart items seeded");

  // ─── WISHLIST ─────────────────────────────────────────────────────────────
  await prisma.wishlistItem.createMany({
    data: [
      { userId: user1.id, productId: gSpot.id },
      { userId: user1.id, productId: wandMassager.id },
      { userId: user3.id, productId: lunaMini.id },
    ],
  });

  console.log("✅ Wishlist seeded");

  // ─── ORDERS ───────────────────────────────────────────────────────────────
  const order1 = await prisma.order.create({
    data: {
      userId: user1.id,
      status: OrderStatus.DELIVERED,
      total: 415,
      currency: "GHS",
      addressId: address1.id,
      paymentMethod: "mobile_money",
      paymentRef: "MTN-PAY-001234",
      items: {
        create: [
          { productId: lunaMini.id, quantity: 1, price: 320 },
          { productId: silkGlide.id, quantity: 1, price: 95 },
        ],
      },
    },
  });

  const order2 = await prisma.order.create({
    data: {
      userId: user2.id,
      status: OrderStatus.SHIPPED,
      total: 580,
      currency: "GHS",
      paymentMethod: "card",
      paymentRef: "CARD-002345",
      items: {
        create: [
          { productId: doubleTrouble.id, quantity: 1, price: 580 },
        ],
      },
    },
  });

  const order3 = await prisma.order.create({
    data: {
      userId: user1.id,
      status: OrderStatus.CONFIRMED,
      total: 330,
      currency: "GHS",
      addressId: address1.id,
      paymentMethod: "mobile_money",
      paymentRef: "MTN-PAY-003456",
      items: {
        create: [
          { productId: roseBullet.id, quantity: 1, price: 250 },
          { productId: storageBag.id, quantity: 1, price: 35 },
          { productId: toyCleanser.id, quantity: 1, price: 60 },
        ],
      },
    },
  });

  console.log("✅ Orders seeded");

  // ─── STORIES (Community feed) ──────────────────────────────────────────────
  const story1 = await prisma.story.create({
    data: {
      userId: user1.id,
      category: StoryCategory.REAL_TALK,
      title: "Thursday night alone",
      body: "I was in bed, lights off, when I finally opened the Luna Mini box. I slid it under the sheets and pressed it between my thighs. The first setting made me gasp. I turned it up. My hips lifted off the mattress on their own — my body took over completely. I came so hard my thighs were still shaking ten minutes later. I lay there in the dark and thought: I have been starving myself for years.",
      isPublic: true,
    },
  });

  const story2 = await prisma.story.create({
    data: {
      userId: user3.id,
      category: StoryCategory.WOMEN_SAY,
      title: "His mouth first",
      body: "He kissed down my stomach slowly, parting my thighs with both hands. When his mouth found me I stopped breathing. He took his time — licking softly at first, then harder when my fingers gripped his hair. He slid two fingers inside me and curled them upward and I came against his face saying his name like a prayer. Then he reached for the Silk Glide and we were nowhere near done.",
      isPublic: true,
    },
  });

  const story3 = await prisma.story.create({
    data: {
      userId: user2.id,
      category: StoryCategory.FOR_COUPLES,
      title: "The remote was his",
      body: "He slipped the Double Trouble inside me, fit the ring on himself, and handed me nothing — the remote stayed in his hand all night. Every time I got close he turned it down. He watched my face fall apart and put it back together three times before he finally let me finish. When it hit I grabbed his shoulders and couldn't let go. He held me through all of it. That night broke something open between us that has never closed.",
      isPublic: true,
    },
  });

  const story4 = await prisma.story.create({
    data: {
      userId: user1.id,
      category: StoryCategory.TIPS,
      title: "Warm it in your hands",
      body: "Pour the Ignite warming lube into your palm and rub your hands together for thirty seconds before you touch anything. The heat builds in your palms first — then the moment you use it, the warmth spreads and opens everything up. Your sensitivity triples. Whatever you do next lands completely differently. Do not skip this. It is the difference between good and unforgettable.",
      isPublic: true,
    },
  });

  const story5 = await prisma.story.create({
    data: {
      userId: user2.id,
      category: StoryCategory.REAL_TALK,
      title: "I wasn't ready for it",
      body: "She straddled me and reached between us to guide me inside her. Slow. Inch by inch, watching my face the whole time. Then she leaned forward, lips at my ear, and whispered exactly what she wanted. I gripped her hips and gave it to her. She rode me until her thighs were shaking and her nails were in my back and she came with her forehead pressed against mine, eyes open, looking straight at me. I have thought about that moment every single day since.",
      isPublic: true,
    },
  });

  const story6 = await prisma.story.create({
    data: {
      userId: user3.id,
      category: StoryCategory.REAL_TALK,
      title: "He watched and didn't move",
      body: "I told him to sit in the chair and not touch me. He did. I used the Luna Mini on myself while he watched from across the room, fully dressed, completely still. The only thing that moved was his jaw — tight, controlled. I came twice. Hard. When I finally said his name he crossed the room in two steps and we didn't sleep until morning. The watching was the best foreplay of my life.",
      isPublic: true,
    },
  });

  const story7 = await prisma.story.create({
    data: {
      userId: user1.id,
      category: StoryCategory.WOMEN_SAY,
      title: "I took her apart slowly",
      body: "I warmed the Silk Glide between my palms, kissed her neck, and worked my way down until she was gripping the headboard with both hands. I used my fingers first — slow, deep, watching every breath. Then my mouth. She said stop. She said don't stop. She said my name in a voice I had never heard before. When she finally came it was long and full and she pulled me up immediately and kissed me so hard I tasted her lipstick for an hour.",
      isPublic: true,
    },
  });

  const story8 = await prisma.story.create({
    data: {
      userId: user2.id,
      category: StoryCategory.WOMEN_SAY,
      title: "On the kitchen counter",
      body: "It started with a kiss that wasn't supposed to go anywhere. He lifted me onto the kitchen counter and stood between my knees and the kissing turned into hands and the hands turned into him sliding into me right there — no bedroom, no planning, no buildup. Just the two of us and the sound of the city outside and his mouth on my collarbone while I held the back of his neck and let myself be completely loud about it.",
      isPublic: true,
    },
  });

  const story9 = await prisma.story.create({
    data: {
      userId: user3.id,
      category: StoryCategory.FOR_COUPLES,
      title: "We used it together",
      body: "She put the Vibe Ring on me herself — took her time doing it, eyes on mine. Then she climbed on top and when she sank down and the vibration hit us both simultaneously, her mouth fell open. We moved together finding the angle where it buzzed against her perfectly and her hands braced on my chest and she came before I did, loudly, and the feeling of her around me when she did meant I wasn't far behind. We lay there completely wrecked afterward. It was glorious.",
      isPublic: true,
    },
  });

  const story10 = await prisma.story.create({
    data: {
      userId: user1.id,
      category: StoryCategory.FOR_COUPLES,
      title: "I made him beg",
      body: "I warmed the Ignite lube and used it on him with both hands — long, slow, deliberate. Every time his breathing changed I slowed down. He grabbed my wrist twice. Both times I moved it gently away. When I finally let him come it was with my mouth and he said my name in a voice that didn't sound like him at all. Afterward he pulled me close and said, 'where did you learn that?' I told him: feelmore. He ordered two more products that same night.",
      isPublic: true,
    },
  });

  const story11 = await prisma.story.create({
    data: {
      userId: user2.id,
      category: StoryCategory.TIPS,
      title: "Always lube. Always.",
      body: "I don't care how ready you think you are — Silk Glide changes the entire experience. Everything is smoother, deeper, more sensitive. Your partner feels different. You feel different. It removes friction and replaces it with something that makes every movement land twice as hard. I use it every single time now. My body has never been happier and neither has anyone I've been in bed with.",
      isPublic: true,
    },
  });

  const story12 = await prisma.story.create({
    data: {
      userId: user3.id,
      category: StoryCategory.TIPS,
      title: "The G-Spot Pro: a guide",
      body: "Curve it toward your belly button. Mode 3. Do not move it — just hold it there and breathe. Your body will start responding within ninety seconds if you stay still and let it. When your hips start moving on their own, switch to mode 5. Then hold on. I have used a lot of toys. Nothing finds that spot with this accuracy. It is almost unreasonably good.",
      isPublic: true,
    },
  });

  const story13 = await prisma.story.create({
    data: {
      userId: user1.id,
      category: StoryCategory.TIPS,
      title: "Start low, go slow",
      body: "New to vibrators? Stay on setting 1 for the first ten minutes. Your body needs to calibrate — to learn to receive before it knows how to chase. By the time you move up a level, every nerve ending is awake and begging. The Luna Mini on setting 3 after a slow build will make your toes curl and your back arch in a way that feels almost too good to be real. Build the tension. The release is worth it.",
      isPublic: true,
    },
  });

  // Story likes
  await prisma.storyLike.createMany({
    data: [
      { storyId: story1.id, userId: user2.id },
      { storyId: story1.id, userId: user3.id },
      { storyId: story2.id, userId: user1.id },
      { storyId: story3.id, userId: user1.id },
      { storyId: story3.id, userId: user3.id },
      { storyId: story4.id, userId: user2.id },
      { storyId: story4.id, userId: user3.id },
      { storyId: story5.id, userId: user1.id },
      { storyId: story5.id, userId: user3.id },
      { storyId: story6.id, userId: user2.id },
      { storyId: story7.id, userId: user2.id },
      { storyId: story7.id, userId: user3.id },
      { storyId: story8.id, userId: user1.id },
      { storyId: story9.id, userId: user1.id },
      { storyId: story9.id, userId: user2.id },
      { storyId: story10.id, userId: user3.id },
      { storyId: story11.id, userId: user1.id },
      { storyId: story11.id, userId: user3.id },
      { storyId: story12.id, userId: user2.id },
      { storyId: story13.id, userId: user1.id },
      { storyId: story13.id, userId: user2.id },
    ],
  });

  // Story comments
  await prisma.storyComment.createMany({
    data: [
      { storyId: story1.id,  userId: user2.id, body: "Same experience here! The team at feelmore was super helpful." },
      { storyId: story1.id,  userId: user3.id, body: "I wish I found this store sooner tbh." },
      { storyId: story2.id,  userId: user2.id, body: "Exactly! Quality over size every time." },
      { storyId: story3.id,  userId: user3.id, body: "Which product did you get? DM me!" },
      { storyId: story5.id,  userId: user1.id, body: "This needed to be said. Thank you for sharing." },
      { storyId: story7.id,  userId: user3.id, body: "Self care is not selfish. Love this energy!" },
      { storyId: story9.id,  userId: user3.id, body: "Going to try this with my partner this weekend 😊" },
      { storyId: story11.id, userId: user3.id, body: "Didn't know this! Saving for later." },
      { storyId: story13.id, userId: user2.id, body: "This tip is so important for beginners!" },
    ],
  });

  console.log("✅ Stories seeded");

  // ─── EROTICA SERIES ───────────────────────────────────────────────────────
  const series1 = await prisma.eroticaSeries.create({
    data: {
      authorId: user1.id,
      title: "The Lagos Affair",
      slug: "the-lagos-affair",
      description: "A high-flying Lagos executive crosses paths with her mysterious new neighbour. What begins as tension becomes something neither of them can resist.",
      genre: "Romance",
      coverImage: "https://images.unsplash.com/photo-1518621736915-f3b1c41bfd00?w=600&h=900&fit=crop&q=80",
      isPublic: true,
      isComplete: false,
    },
  });

  const ep1_1 = await prisma.eroticaEpisode.create({
    data: {
      seriesId: series1.id,
      title: "The New Neighbour",
      slug: "the-new-neighbour",
      episodeNum: 1,
      readTime: 8,
      isFree: true,
      body: `The moving truck arrived at six in the morning, which Adaeze found deeply inconsiderate.

She stood at her window in her silk robe, coffee in hand, watching men carry boxes into the apartment directly across the courtyard. Lagos was many things — loud, brilliant, relentless — but it had never invaded her mornings like this.

Then he stepped out.

Tall. Dark shirt with the sleeves rolled to the elbow. He directed the movers with a quiet authority that she recognised instantly — the kind that doesn't need volume to be felt.

He must have sensed her watching. He looked up.

Adaeze did not move. She held his gaze for exactly three seconds, then turned away and refilled her coffee.

She was not the kind of woman who stared at men. She was the kind of woman men stared at.

But for the rest of the morning, she found herself standing near that window more than usual.

His name, she would learn from the building manager that evening, was Kofi. He was from Accra originally. A consultant. Moving to Lagos for a project that would take "at least a year."

At least a year, she thought, and felt something she hadn't felt in a long time stir quietly somewhere beneath her professionalism.

She told herself it was just curiosity.

She almost believed it.`,
    },
  });

  const ep1_2 = await prisma.eroticaEpisode.create({
    data: {
      seriesId: series1.id,
      title: "The Lift",
      slug: "the-lift",
      episodeNum: 2,
      readTime: 10,
      isFree: true,
      body: `They met properly in the lift on a Thursday evening.

Adaeze had come home late — board meeting, then drinks she hadn't wanted but couldn't decline — and her heels were in her hand when the lift doors opened and he was already inside.

"I was wondering when we'd actually meet," he said. His voice was lower than she'd expected. Accented with something that wasn't quite British, wasn't quite Ghanaian — somewhere in between, shaped by too many cities.

"Adaeze," she said, and offered her hand like she was in a boardroom.

He took it. "Kofi." He didn't let go immediately. Not inappropriately — just a half-second longer than necessary. Just enough for her to notice.

The lift moved. They watched the floor numbers climb.

"You were watching me move in," he said. Not an accusation. A statement.

"I was watching the truck block my parking spot."

He smiled. It changed his whole face. "Of course."

The lift stopped at her floor. She stepped out, then turned. He was still watching her, leaning against the back wall with an ease that suggested he was someone who was comfortable taking up space.

"Welcome to the building," she said.

"Thank you for not complaining about the noise."

She walked down the corridor to her apartment, unlocked the door, and stood for a moment with her back against it in the dark.

She pressed her palm flat against her sternum, feeling her own heartbeat, which was doing something it had no business doing.

This, she told herself, was a problem.`,
    },
  });

  const ep1_3 = await prisma.eroticaEpisode.create({
    data: {
      seriesId: series1.id,
      title: "The Dinner",
      slug: "the-dinner",
      episodeNum: 3,
      readTime: 12,
      isFree: false,
      body: `He knocked on her door at seven on a Saturday with a bottle of Merlot and an expression that suggested he was not entirely sure this was a good idea either.

"I made rice," he said. "I made too much of it. It seemed rude not to knock."

Adaeze looked at the wine. She looked at him. She was in a lounge set — comfortable, not dressed for company — and she had spent absolutely no time thinking about this moment.

"Come in," she said, and stepped aside.

Her apartment was full of things she'd curated carefully: art she'd bought at markets from artists whose names she knew, books stacked with intention, a record player she actually used. He moved through it like someone reading a room rather than just being in one.

"You like Afrobeats," he said, looking at the records.

"I like music that makes you feel something."

He chose a record without asking. Something slow. She didn't stop him.

They ate at her kitchen counter because the dining table had become her second desk. He told her about Accra — about the water, the heat, the way the city smelled different from any other. She told him about growing up in Enugu, coming to Lagos at twenty-three with nothing but ambition and a single good blazer.

"Do you still have the blazer?" he asked.

"I have eight of them now."

He laughed. Really laughed. And she felt something in her chest relax that had been held tight for so long she'd forgotten it was there.

Later, standing in her kitchen doing the washing up side by side, his arm brushed hers. Neither of them moved away.

"Adaeze," he said quietly.

"Yes."

He turned to look at her. Just looked, for a long moment, like he was working something out.

Then he handed her a glass to dry, and said nothing else, and she understood perfectly that this was patience — deliberate and careful — and that it was the most seductive thing she had ever encountered.`,
    },
  });

  const series2 = await prisma.eroticaSeries.create({
    data: {
      authorId: user3.id,
      title: "Midnight Between Us",
      slug: "midnight-between-us",
      description: "Two strangers. One beach house. Seven days to figure out what they are to each other — and why they can't seem to stay apart.",
      genre: "Steamy",
      coverImage: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=600&h=900&fit=crop&q=80",
      isPublic: true,
      isComplete: true,
    },
  });

  const ep2_1 = await prisma.eroticaEpisode.create({
    data: {
      seriesId: series2.id,
      title: "Day One",
      slug: "day-one",
      episodeNum: 1,
      readTime: 7,
      isFree: true,
      body: `The booking mistake was the agency's fault. Maame was certain of that.

She'd reserved the beach house for the week — confirmed, paid, reference number saved in two places — and had arrived with her suitcase and her plan for seven days of absolute solitude to find a man already standing barefoot in the kitchen making eggs.

He turned around. "You must be the other half of the double-booking."

He was unfairly handsome. This was not something Maame had needed to know on day one of her healing retreat.

"I am the correct booking," she said. "You're the other half."

"Nana." He held out a hand.

"Maame." She did not shake it. "I'm calling the agency."

The agency, it turned out, was closed until Monday. It was Thursday.

They stood in the kitchen and looked at each other with the particular energy of two people calculating whether they could survive a week of proximity.

The house had two bedrooms, a shared living room, and one spectacular ocean-facing deck.

"Ground rules," Maame said.

"Ground rules," he agreed, and she was annoyed to find that he seemed unbothered. Amused, even. Like a man who was used to situations resolving themselves in his favour.

She took the bedroom with the better view. She figured she'd earned something.

That night, she sat on the deck alone, listening to the waves, and tried to remember what she'd come here to think about.

She found it oddly hard to concentrate.`,
    },
  });

  const ep2_2 = await prisma.eroticaEpisode.create({
    data: {
      seriesId: series2.id,
      title: "Day Three",
      slug: "day-three",
      episodeNum: 2,
      readTime: 11,
      isFree: true,
      body: `By day three they had established a rhythm that felt, alarmingly, comfortable.

He cooked breakfast. She made coffee — strong enough to strip paint, he said, and drank three cups anyway. They divided the deck into unspoken zones and spent long afternoons in a companionable silence that had no business being this easy between two people who were technically strangers.

It was the swim that changed things.

Maame had gone in early, before he was up, because she wanted the ocean to herself. She'd made it fifty metres out when she heard the water move behind her and turned to find him pulling up alongside her with the efficient stroke of someone who'd grown up near water.

They swam without speaking. In parallel, in the low morning light, out past the break and back again.

When they waded in, breathless and dripping, the sun had come fully up and everything looked different — sharper, more vivid, the way things look when your body has been fully awake.

He pushed his wet hair back. She was acutely aware of the water on his shoulders, the steady rise and fall of his chest.

"You didn't mention you could swim like that," she said.

"You didn't ask."

They stood at the shoreline, close enough that she could feel the warmth coming off him despite the cool water.

"Nana."

"Maame."

Neither of them moved for a long moment.

Then he said, "I'll make breakfast," and turned and walked up the beach, and she stood there in the surf and thought: this is going to be a problem.

She was right.`,
    },
  });

  const ep2_3 = await prisma.eroticaEpisode.create({
    data: {
      seriesId: series2.id,
      title: "The Last Night",
      slug: "the-last-night",
      episodeNum: 3,
      readTime: 14,
      isFree: false,
      body: `On the last night, neither of them pretended to sleep.

They sat on the deck in the dark — the ocean invisible but audible, enormous and close — and drank the last of the wine they'd been rationing since day four without discussing it.

"Tomorrow we go back," Maame said.

"Yes."

The word landed between them with weight.

"Different cities," she said.

"Yes."

"Different lives."

He was quiet for a moment. Then: "Do they have to be?"

She turned to look at him. In the dark, she could see the shape of his jaw, the steadiness in his eyes. He was not a man who said things carelessly. She had learned that in seven days.

"Nana."

"I'm not trying to complicate things," he said. "I'm trying to — I don't know what I'm trying to do. Something true. Something honest."

Maame set down her glass.

She had come here to heal from someone who had not been honest with her. Who had taken up space in her life without ever fully arriving in it.

She looked at this man — this stranger who was no longer strange — and felt something quietly enormous shift in her chest.

"Come here," she said.

He moved. Crossed the space between their chairs in one motion. She stood to meet him, and when he kissed her it was not urgent or desperate — it was slow and full of intention, like every word he'd said all week, like someone who meant it completely.

The ocean kept moving in the dark below.

They had all night.

They used it.`,
    },
  });

  const series3 = await prisma.eroticaSeries.create({
    data: {
      authorId: user2.id,
      title: "The Couple's Experiment",
      slug: "the-couples-experiment",
      description: "After five years together, Esi and Kwabena decide to try something new — and discover they barely knew each other at all.",
      genre: "Romance",
      coverImage: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=600&h=900&fit=crop&q=80",
      isPublic: true,
      isComplete: false,
    },
  });

  const ep3_1 = await prisma.eroticaEpisode.create({
    data: {
      seriesId: series3.id,
      title: "Year Five",
      slug: "year-five",
      episodeNum: 1,
      readTime: 6,
      isFree: true,
      body: `Five years is a long time to know someone. Long enough to know how they take their tea, what they look like in the middle of the night, the particular silence they make when they're thinking something they haven't decided to say yet.

Esi knew all of these things about Kwabena. She knew them so completely that sometimes she forgot to pay attention.

That was the problem, she thought, watching him across their kitchen table on a Sunday morning. He was reading something on his phone and absently touching the back of his neck the way he always did when something was interesting. She'd watched him do that ten thousand times.

When had she stopped finding it interesting?

"We should try something," she said.

He looked up. He had learned, in five years, that when Esi said this, it was worth pausing whatever else he was doing.

"What kind of something?"

She had thought about this. She had, if she was honest, been thinking about it for weeks — ever since a conversation with a friend, a frank conversation, the kind women have at the end of a long dinner when the wine is nearly done.

"Something that isn't what we usually do," she said.

He was quiet for a moment. Then he put his phone down.

"Tell me," he said, and in the way he said it — unhurried, open — she remembered suddenly what she'd loved about him in the beginning. He had never been afraid of her directness. He had always moved toward it.

She felt something warm and tentative unfurl in her chest.

"Okay," she said. "Here's what I was thinking."`,
    },
  });

  const ep3_2 = await prisma.eroticaEpisode.create({
    data: {
      seriesId: series3.id,
      title: "The Agreement",
      slug: "the-agreement",
      episodeNum: 2,
      readTime: 9,
      isFree: true,
      body: `They wrote it down. That had been Kwabena's idea, and Esi had laughed at first, but then agreed, because there was something clarifying about making it real on paper.

The list was simple. Honest. A little embarrassing to write in the way that honest things sometimes are.

Things we want more of. Things we've been curious about. Things we've never said out loud.

They did it separately, then read each other's lists at the kitchen table with tea that went cold while they talked.

There were surprises. Not shocking ones — not the kind that change everything — but the kind that made Esi look at him and think: five years, and I still don't know all of you. There's still more.

She found this more exciting than she expected.

"This one," he said, tapping the paper. "You've wanted this for how long?"

"A while," she said.

"Why didn't you say?"

She thought about it. "I think I assumed you'd already know."

He shook his head slowly. "I want you to tell me. I want to hear you say the things you want. That's — " He stopped. Looked at her. "That's actually what I want most. More than anything on my list."

Esi reached across the table and took his hand.

Five years. The same hands she'd held a thousand times. And somehow, right now, it felt like the first time she was really holding them.

"Okay," she said. "Then I'll tell you everything."

She did.

It took the rest of the evening.`,
    },
  });

  const ep3_3 = await prisma.eroticaEpisode.create({
    data: {
      seriesId: series3.id,
      title: "Rediscovering",
      slug: "rediscovering",
      episodeNum: 3,
      readTime: 13,
      isFree: false,
      body: `They started on a Friday night, which felt right — the week done, the weekend open, nowhere to be.

Esi lit candles. Not because she was trying to set a scene, but because she wanted to see him properly — in warm light, close up, without the usual domestic clutter of their evenings together.

He came out of the bathroom and stopped when he saw the room.

"This is different," he said.

"That's the point."

He came to her then, and the first thing he did was something he hadn't done in longer than she could remember — he took his time. Stood close without immediately moving. Looked at her.

"You're beautiful," he said. Quietly. Like a fact he was observing, not a compliment he was offering.

She had heard him say it before. But not like this. Not with this particular quality of attention.

Something in her unlocked.

What followed was unhurried in a way that the last few years hadn't been — there was no tiredness behind it, no distraction, no running list of everything else that still needed doing. There was only this: two people choosing each other deliberately, with their full attention, for the first time in a long time.

At one point she started to cry, which surprised her. Not from sadness. From something else — relief, maybe. Recognition.

He held her face in his hands and looked at her the way she'd forgotten people could look at each other.

"I missed you," she said, which didn't quite make sense.

"I know," he said. "I missed you too."

They stayed awake until nearly three, talking and not talking, and when they finally slept it was close and warm and Esi thought: this. This is what it was supposed to feel like.

This is what we were always capable of.`,
    },
  });

  // Series likes
  await prisma.eroticaSeriesLike.createMany({
    data: [
      { seriesId: series1.id, userId: user2.id },
      { seriesId: series1.id, userId: user3.id },
      { seriesId: series2.id, userId: user1.id },
      { seriesId: series2.id, userId: user2.id },
      { seriesId: series3.id, userId: user1.id },
      { seriesId: series3.id, userId: user3.id },
    ],
  });

  // Episode reactions
  await prisma.eroticaReaction.createMany({
    data: [
      { episodeId: ep1_1.id, userId: user2.id, type: "FIRE" },
      { episodeId: ep1_1.id, userId: user3.id, type: "HEART" },
      { episodeId: ep1_2.id, userId: user2.id, type: "FIRE" },
      { episodeId: ep1_2.id, userId: user3.id, type: "FIRE" },
      { episodeId: ep1_3.id, userId: user2.id, type: "HEART" },
      { episodeId: ep2_1.id, userId: user1.id, type: "CLAP" },
      { episodeId: ep2_2.id, userId: user1.id, type: "FIRE" },
      { episodeId: ep2_2.id, userId: user3.id, type: "SHOCKED" },
      { episodeId: ep2_3.id, userId: user1.id, type: "HEART" },
      { episodeId: ep3_1.id, userId: user1.id, type: "HEART" },
      { episodeId: ep3_1.id, userId: user3.id, type: "CLAP" },
      { episodeId: ep3_2.id, userId: user1.id, type: "FIRE" },
    ],
  });

  // Episode comments
  await prisma.eroticaComment.createMany({
    data: [
      { episodeId: ep1_1.id, userId: user2.id, body: "I love the tension already. The way she described him — perfect." },
      { episodeId: ep1_2.id, userId: user3.id, body: "The lift scene is everything. The half-second longer 😭🔥" },
      { episodeId: ep1_3.id, userId: user2.id, body: "The patience. THE PATIENCE. This man understands the assignment." },
      { episodeId: ep2_1.id, userId: user1.id, body: "Already obsessed with Nana. Please update soon!" },
      { episodeId: ep2_2.id, userId: user1.id, body: "The swim scene had me holding my breath. Beautifully written." },
      { episodeId: ep2_3.id, userId: user3.id, body: "I cried. On a Tuesday. Because of this story. Thank you." },
      { episodeId: ep3_1.id, userId: user3.id, body: "This is so real. This is every long-term relationship." },
      { episodeId: ep3_2.id, userId: user1.id, body: "Writing the list together is so intimate. I love this approach." },
    ],
  });

  console.log("✅ Erotica series seeded");

  // ─── BANNERS ──────────────────────────────────────────────────────────────
  await prisma.banner.createMany({
    data: [
      {
        title: "Explore quietly.",
        subtitle: "Discreet delivery. Body-safe products. Real pleasure.",
        image: "/images/banners/hero-1.jpg",
        link: "/shop",
        isActive: true,
        order: 0,
      },
      {
        title: "New arrivals",
        subtitle: "Fresh picks for bold explorers.",
        image: "/images/banners/new-arrivals.jpg",
        link: "/shop?sort=newest",
        isActive: true,
        order: 1,
      },
      {
        title: "You're not alone.",
        subtitle: "Real people. Real stories.",
        image: "/images/banners/community.jpg",
        link: "/stories",
        isActive: true,
        order: 2,
      },
    ],
  });

  console.log("✅ Banners seeded");

  console.log("\n🎉 Database seeded successfully!");
  console.log("─────────────────────────────────");
  console.log("Admin:    admin@feelmore.shop / Admin@1234");
  console.log("User 1:   ama@example.com / User@1234");
  console.log("User 2:   kwame@example.com / User@1234");
  console.log("User 3:   abena@example.com / User@1234");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
