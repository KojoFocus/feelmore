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
      title: "I finally understood",
      body: "I pressed the Luna Mini against my clit and my whole body clenched immediately. I turned it up. My back arched off the bed, legs spread, hips grinding against it because I couldn't stop myself. I came in under four minutes — soaking wet, thighs shaking, gasping into the pillow. I had been having sex for years and nothing had ever made me come like that. I lay there wet and breathless thinking: this is what I've been missing.",
      isPublic: true,
    },
  });

  const story2 = await prisma.story.create({
    data: {
      userId: user3.id,
      category: StoryCategory.WOMEN_SAY,
      title: "His tongue didn't stop",
      body: "He spread my legs and went down on me like he had nowhere else to be. Licking me slow and deep, sucking on my clit until I was dripping and pulling his hair. He pushed two fingers inside and fucked me with them while his tongue worked me and I came so hard I squirted on his face. He didn't stop. He kept licking until I came a second time screaming into the sheets. Then he reached for the Silk Glide. We were not done.",
      isPublic: true,
    },
  });

  const story3 = await prisma.story.create({
    data: {
      userId: user2.id,
      category: StoryCategory.FOR_COUPLES,
      title: "He controlled everything",
      body: "He put the Double Trouble inside me, slid into me from behind, and held the remote. Every time I was about to come he turned it down and kept fucking me slowly, watching me lose my mind. By the third time I was soaking the sheets, begging him out loud — actually begging. When he finally turned it to max and fucked me hard we both came at the same time and I couldn't walk straight for an hour.",
      isPublic: true,
    },
  });

  const story4 = await prisma.story.create({
    data: {
      userId: user1.id,
      category: StoryCategory.TIPS,
      title: "Warm lube before everything",
      body: "Pour Ignite warming lube into both palms, rub them together until it heats up, then touch yourself or your partner. The warmth opens everything — your pussy gets wetter instantly, every nerve doubles in sensitivity. When my partner used it on me before going down, I came in two minutes flat. It turns foreplay into something completely different. Non-negotiable now.",
      isPublic: true,
    },
  });

  const story5 = await prisma.story.create({
    data: {
      userId: user2.id,
      category: StoryCategory.REAL_TALK,
      title: "She rode me until I broke",
      body: "She climbed on top, grabbed my cock, and pushed herself down on it slowly. Started riding — grinding her hips, bouncing on me, taking every inch. She reached back and held my thighs for leverage and fucked me until I was gripping the sheets. When she came she dug her nails into my chest and clenched around me so tight I came immediately after, deep inside her. We lay there leaking and wrecked and she looked at me and smiled.",
      isPublic: true,
    },
  });

  const story6 = await prisma.story.create({
    data: {
      userId: user3.id,
      category: StoryCategory.REAL_TALK,
      title: "He watched me the whole time",
      body: "I told him to sit in the chair and not touch me. I lay on the bed, spread my legs, and used the Luna Mini on my clit while he watched. I was so wet from being watched that it only took minutes. I came with my hips in the air, moaning, soaking the sheets — eyes on him the whole time. When I finished I said his name once. He crossed the room, flipped me over, and fucked me from behind without a word.",
      isPublic: true,
    },
  });

  const story7 = await prisma.story.create({
    data: {
      userId: user1.id,
      category: StoryCategory.WOMEN_SAY,
      title: "I ate her out for an hour",
      body: "I pulled her underwear off and buried my face between her thighs. Licked her pussy slow, learned every part of her — what made her gasp, what made her grab my head. I fingered her while I sucked her clit and she came on my face talking in a language I had never heard her use before. Then I used the Silk Glide on my fingers and took her apart a second time while she begged me not to stop.",
      isPublic: true,
    },
  });

  const story8 = await prisma.story.create({
    data: {
      userId: user2.id,
      category: StoryCategory.WOMEN_SAY,
      title: "Against the wall, no warning",
      body: "He pinned me against the kitchen wall, pulled my underwear to the side, and slid two fingers inside me. I was already wet. He fingered me until I was dripping down my thighs, then bent me forward and fucked me standing right there — deep, slow strokes that made me claw the wall. I came first. He followed thirty seconds later holding my hips so tight I had bruises for three days. I did not mind at all.",
      isPublic: true,
    },
  });

  const story9 = await prisma.story.create({
    data: {
      userId: user3.id,
      category: StoryCategory.FOR_COUPLES,
      title: "The ring changed everything",
      body: "I put the Vibe Ring on him and rode him. The moment I sank down and the vibration hit my clit I gasped and couldn't stop moving. I fucked him hard, chasing that feeling — grinding down, taking all of him while it buzzed against me. He watched my face the whole time. I came so intensely I bit his shoulder. He came thirty seconds later groaning my name. We looked at each other and immediately ordered a second one.",
      isPublic: true,
    },
  });

  const story10 = await prisma.story.create({
    data: {
      userId: user1.id,
      category: StoryCategory.FOR_COUPLES,
      title: "I made him lose control",
      body: "I warmed the Ignite lube and stroked him slow — both hands, long pulls, watching his face. Every time he got close I slowed down. He grabbed my wrist. I moved it away. When I finally took him in my mouth and sucked him properly he made a sound I had never heard before and came immediately. He pulled me up, kissed me deeply, and went down on me for forty-five minutes straight. Revenge. Beautiful revenge.",
      isPublic: true,
    },
  });

  const story11 = await prisma.story.create({
    data: {
      userId: user2.id,
      category: StoryCategory.TIPS,
      title: "Lube before everything",
      body: "Use Silk Glide before your partner enters you. A little on him, a little on yourself. The difference is immediate — deeper, smoother, and every thrust feels amplified. I used to skip it. Now I refuse to have sex without it. My partner says it changed how I feel around him. I say it changed how everything feels for me. Both true. Use the lube. Always.",
      isPublic: true,
    },
  });

  const story12 = await prisma.story.create({
    data: {
      userId: user3.id,
      category: StoryCategory.TIPS,
      title: "G-Spot Pro: don't move it",
      body: "Insert the G-Spot Pro, curve it upward, set it to mode 3, and hold it completely still. Breathe. In 90 seconds your hips will start moving on their own — let them. When the pressure builds and your legs start shaking, go to mode 5. I have made myself squirt three times in one session with this exact method. Do not chase it. Let it find you.",
      isPublic: true,
    },
  });

  const story13 = await prisma.story.create({
    data: {
      userId: user1.id,
      category: StoryCategory.TIPS,
      title: "Low setting. Ten minutes. Trust.",
      body: "Luna Mini on setting 1. Press it directly on your clit and leave it there for ten full minutes without moving it or turning it up. Your whole vulva wakes up, every nerve on edge, throbbing and soaking wet. Then go to setting 3. You will come within sixty seconds and it will be the most intense orgasm of your week. The build is everything. Rushing it robs you of half the sensation.",
      isPublic: true,
    },
  });

  // ── Extra explicit stories ────────────────────────────────────────────────
  const story14 = await prisma.story.create({ data: { userId: user2.id, category: StoryCategory.REAL_TALK, title: "Hotel room, alone", body: "I checked into the hotel, locked the door, and ordered room service I never ate. I lay on the king-size bed with the Rose Bullet and had four orgasms in forty minutes. I lay there shaking, wet through the sheets, looking at the ceiling thinking: this is why I always book my own room. Nobody else needed.", isPublic: true } });
  const story15 = await prisma.story.create({ data: { userId: user3.id, category: StoryCategory.REAL_TALK, title: "I woke him up", body: "He was asleep on his stomach. I pulled the sheets back, ran my hands down his back, gripped his hips and pressed against him until he stirred. He turned over already hard. I climbed on without a word, sank down slowly, and started moving. He came awake with his hands on my thighs and a sound in his throat that I will remember for the rest of my life.", isPublic: true } });
  const story16 = await prisma.story.create({ data: { userId: user1.id, category: StoryCategory.REAL_TALK, title: "In the mirror", body: "I positioned the mirror so I could watch myself. Used the G-Spot Pro and watched my own face — the way my expression changed, how my body moved, what I looked like when I started to lose control. It was the most turned on I have ever been by myself. I came twice and stayed there watching afterward, still catching my breath, thinking: I understand now why he can't look away.", isPublic: true } });
  const story17 = await prisma.story.create({ data: { userId: user2.id, category: StoryCategory.REAL_TALK, title: "She texted me at 2am", body: "Two words: 'Come over.' I arrived in fifteen minutes. She opened the door in nothing. Led me to the bedroom without speaking. Pushed me down on the bed and climbed on top of me. We fucked until 4am — no music, no talking, just each other and the sounds we were making. She kissed me at the door when I left and said 'same time next week?' I was already nodding before she finished the sentence.", isPublic: true } });
  const story18 = await prisma.story.create({ data: { userId: user3.id, category: StoryCategory.REAL_TALK, title: "First time I squirted", body: "He had two fingers inside me working the G-Spot Pro against my clit from outside simultaneously. I told him I needed to stop because something felt different, too intense. He slowed down but didn't stop. Thirty seconds later I understood what was happening. I soaked his hand, the sheets, everything. I cried afterward from the sheer release of it. He held me and said 'I know.' He absolutely knew.", isPublic: true } });
  const story19 = await prisma.story.create({ data: { userId: user1.id, category: StoryCategory.REAL_TALK, title: "Three hours", body: "We had nowhere to be on a Sunday. We started at 10am. We used the Vibe Ring, the Silk Glide, and each other — switching, slowing down, building back up. I lost count of how many times I came. At 1pm we ordered food and ate naked and then started again. That Sunday reset something in my body. I walked differently for a week.", isPublic: true } });

  const story20 = await prisma.story.create({ data: { userId: user3.id, category: StoryCategory.WOMEN_SAY, title: "My first orgasm at 27", body: "Twenty-seven years old. The Luna Mini. Ten minutes alone on a Thursday. That was the first time. I sat there afterward genuinely confused — not because it felt strange, but because I couldn't understand how I had lived this long without knowing my body could do that. I went back and did it again immediately just to confirm it was real. It was. I have not stopped since.", isPublic: true } });
  const story21 = await prisma.story.create({ data: { userId: user1.id, category: StoryCategory.WOMEN_SAY, title: "She taught me with her hands", body: "She took my hand and placed it on herself and said 'like this.' She guided my fingers — pressure, speed, where exactly — and watched my face while she did it. Then she used the Silk Glide and showed me again. I paid attention like my life depended on it. She came three times teaching me and said I was a fast learner. I've thought about that afternoon almost every day since.", isPublic: true } });
  const story22 = await prisma.story.create({ data: { userId: user2.id, category: StoryCategory.WOMEN_SAY, title: "I like being on top", body: "On top I control the depth, the angle, the pace. I can grind instead of bounce and find the exact spot that makes everything white. I come harder on top than any other way and I stopped apologising for taking what I need. When I feel it building I slow all the way down, hold still, and breathe, and then it hits like something breaking loose. My partner knows to hold my hips and not move.", isPublic: true } });
  const story23 = await prisma.story.create({ data: { userId: user3.id, category: StoryCategory.WOMEN_SAY, title: "Magic Wand on my clit", body: "The Magic Wand on the lowest setting against my clit through my underwear. I lasted four minutes. Then I took the underwear off and lasted forty-five seconds. I came so hard I knocked it out of my own hand. I lay completely still for five full minutes just breathing. Then I used it again. I understand now why it's called what it's called. There is nothing else like it.", isPublic: true } });
  const story24 = await prisma.story.create({ data: { userId: user1.id, category: StoryCategory.WOMEN_SAY, title: "Slow sex changes everything", body: "He went slow on purpose — barely moving, almost still inside me, making me feel every millimetre. I asked him to go faster. He didn't. I gripped the sheets and let the slow build take over. By the time he moved properly I was already so close that the first real thrust made me come immediately. Slow sex is not gentle sex. Slow sex is the most intense thing I have ever experienced.", isPublic: true } });
  const story25 = await prisma.story.create({ data: { userId: user2.id, category: StoryCategory.WOMEN_SAY, title: "I finally asked for what I want", body: "I used to just go along with whatever he did. Then one night I put his hand exactly where I wanted it and said 'here, like this, don't stop.' He did exactly that and I came in three minutes. Afterward he said 'why didn't you tell me before?' I didn't have an answer. Now I always tell him. Every time. And every time is better than the one before it.", isPublic: true } });

  const story26 = await prisma.story.create({ data: { userId: user3.id, category: StoryCategory.FOR_COUPLES, title: "Blindfolded", body: "He blindfolded me and told me not to move. I lay there hearing him move around the room, feeling his breath before his hands, never knowing where the next touch would land. He used the Ignite warming lube and his mouth and the Luna Mini in a sequence I couldn't predict. I came without him ever entering me, just from the sustained not-knowing. The blindfold made everything three times more intense.", isPublic: true } });
  const story27 = await prisma.story.create({ data: { userId: user1.id, category: StoryCategory.FOR_COUPLES, title: "She came four times", body: "I made it my goal that night to take her apart completely. Mouth first, then fingers with Silk Glide, then the Rose Bullet while I was inside her. By the fourth time she was laughing and shaking simultaneously and gripping my arm so hard it bruised. She looked at me after and said 'I didn't know it could be like that.' That sentence is the best thing anyone has ever said to me.", isPublic: true } });
  const story28 = await prisma.story.create({ data: { userId: user2.id, category: StoryCategory.FOR_COUPLES, title: "We talked first", body: "We sat on the bed before anything happened and took turns saying one thing we wanted and one thing we'd never asked for. It was fifteen minutes. Then what came after those fifteen minutes was the best sex of our five years together. Talking about it before isn't clinical. It's the hottest foreplay there is — hearing your partner say what they want done to them, while you're both fully clothed and about to not be.", isPublic: true } });
  const story29 = await prisma.story.create({ data: { userId: user3.id, category: StoryCategory.FOR_COUPLES, title: "Anniversary session", body: "We booked a hotel, brought the Double Trouble, the Silk Glide, and the Ignite. We spent four hours in that room. Room service was delivered and left cold. We used every product, tried everything we'd been curious about, and by the end were just lying there completely wrung out and laughing. We've been together six years. That night reminded me we haven't even started.", isPublic: true } });
  const story30 = await prisma.story.create({ data: { userId: user1.id, category: StoryCategory.FOR_COUPLES, title: "He watched from the chair", body: "I used the G-Spot Pro while he sat and watched. He had one rule: don't touch me until I said so. He held that rule for forty minutes while I took myself apart in front of him. When I finally said his name he crossed the room and the sex that followed was unlike anything we'd had before — like he'd been saving it all up. Watching and being watched is the most underrated thing in a relationship.", isPublic: true } });
  const story31 = await prisma.story.create({ data: { userId: user2.id, category: StoryCategory.FOR_COUPLES, title: "She used it on me", body: "She warmed the Ignite lube, slicked her hands, and worked me slowly while I lay back and tried not to lose my mind. Every time I got close she read my body and eased off. She did this for an hour. An entire hour. When she finally finished me with her mouth I came so intensely I couldn't speak for five minutes. She sat next to me and smiled. 'Worth it?' she asked. I still couldn't form words. She laughed.", isPublic: true } });

  const story32 = await prisma.story.create({ data: { userId: user3.id, category: StoryCategory.TIPS, title: "Foreplay is the main event", body: "If penetration is chapter ten, most people are starting at chapter eight. Spend forty-five minutes on chapters one through seven — kissing, hands, mouth, toys, lube, positioning, teasing. By chapter ten everything is so sensitive and swollen and ready that it takes four minutes and is the best four minutes of the week. The main event is the build. Everything else is just the ending.", isPublic: true } });
  const story33 = await prisma.story.create({ data: { userId: user1.id, category: StoryCategory.TIPS, title: "Temperature play: try it", body: "Warm the Ignite lube in your hands and use it, then immediately follow with your cold tongue. The contrast — warm hands, cold mouth, warm lube — makes every nerve fire simultaneously. Do it down the inner thigh before going anywhere near the centre. By the time you actually get there your partner will be incoherent. Temperature difference is the most underused tool in sex.", isPublic: true } });
  const story34 = await prisma.story.create({ data: { userId: user2.id, category: StoryCategory.TIPS, title: "Clean toys, more sessions", body: "Use the Pure Clean spray immediately after every session — before you've even caught your breath. I keep it on the nightstand. Spray, leave thirty seconds, wipe. Done. Clean toy means you'll actually use it again tomorrow instead of guilt-avoiding it for two weeks. The hygiene step is also the 'I'm taking this seriously' step. It changes how you relate to your pleasure.", isPublic: true } });
  const story35 = await prisma.story.create({ data: { userId: user3.id, category: StoryCategory.TIPS, title: "Store properly, last longer", body: "The velvet storage pouch is not optional. Silicone toys left touching each other degrade. Dust and bathroom air get into the motor. I lost a Rose Bullet to bad storage. Now everything lives in its pouch, clean, protected. My Luna Mini is two years old and runs like new because it has never touched another toy or collected dust. Spend the forty cedis. Protect the investment.", isPublic: true } });
  const story36 = await prisma.story.create({ data: { userId: user1.id, category: StoryCategory.TIPS, title: "Shower with waterproof toys", body: "The Luna Mini is waterproof. The shower is private, the hot water relaxes every muscle in your body, and the combination means your orgasm hits differently — fuller, deeper, longer. Stand with one foot on the edge, direct the showerhead where you want it, add the toy. I have had the best sessions of my life standing in my own bathroom at 7am before work. Nobody needs to know anything.", isPublic: true } });

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
      title: "The Understanding",
      slug: "the-understanding",
      description: "Serwaa and Kojo haven't spoken in three years. One hotel room, two nights, and everything they refused to say finally comes out.",
      genre: "Steamy",
      coverImage: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=600&h=900&fit=crop&q=80",
      isPublic: true,
      isComplete: true,
    },
  });

  const ep1_1 = await prisma.eroticaEpisode.create({
    data: {
      seriesId: series1.id,
      title: "How It Starts",
      slug: "how-it-starts",
      episodeNum: 1,
      readTime: 9,
      isFree: true,
      body: `Three years is a long time. Long enough for the memory of someone to become manageable — almost.

Serwaa had almost managed it when her phone lit up on a Tuesday night with his name.

Just in Accra for two days. Are you around?

She stared at the message for a long time. She knew what it meant. They both knew what it meant. They had always been honest about that, at least — about what they were to each other, even when they couldn't agree on anything else.

She typed back: Where are you staying?

He sent a hotel name. A nice one, central. She knew the bar.

She told herself she was just going for a drink.

She wore the red dress anyway.

He was already there when she arrived — sitting at the far end of the bar, which was something he'd always done, positioning himself to see the door. He stood when he saw her, and she felt the familiar pull — the way he looked at her. Like she was the only interesting thing in any room.

"You look —" He stopped. "Hi."

"Hi."

They sat. They ordered. They talked about surface things for maybe fifteen minutes — his work, her work, the city. And then he set down his glass and looked at her the way he always eventually looked at her, and said:

"Are we going to pretend this isn't what it is?"

"No," she said.

He paid the bill.

They took the lift up in silence, standing close but not touching — a specific restraint that she knew meant he wanted to, badly. The moment the door closed behind them she turned, and he was already there, his hands cupping her face, and the first kiss was slow and immediately familiar — the particular pressure of his mouth, the way he breathed in when they kissed, like he was trying to hold it.

"I missed you," he said against her mouth.

He undressed her carefully — unhooking her dress, letting it fall, taking his time in a way that made her feel seen. She worked on his shirt buttons while he kissed her neck, the place below her ear that made her breath catch.

"Still," he murmured against her skin. Like he was noting it for later.

When they came together it was slow at first — the particular slowness of relearning — and then it wasn't. By the end she had her fingers in his hair and her face pressed against his neck, saying things she hadn't planned to say.

Afterward he lay with his arm around her, her head on his chest.

"Two days isn't enough," he said.

"It never was," she said.`,
    },
  });

  const ep1_2 = await prisma.eroticaEpisode.create({
    data: {
      seriesId: series1.id,
      title: "The Rules We Break",
      slug: "the-rules-we-break",
      episodeNum: 2,
      readTime: 11,
      isFree: true,
      body: `They ordered room service at midnight and ate in bed, which felt both domestic and completely removed from real life — a bubble, Serwaa thought. That was what this had always been.

"We should have rules," she said.

"Rules." He repeated the word like he was trying its shape.

"So neither of us does something stupid."

He looked at her steadily before speaking — he had always done that, actually looked before he answered. "What would stupid look like?"

"Feelings," she said simply.

"No feelings," he agreed.

They shook on it. He immediately took the last piece of food from her plate.

"Kojo."

"Mm."

"That's a feeling."

"That's hunger."

She laughed — couldn't stop it — and he watched her with that expression she'd also missed: steady, fond, like her laughter was something he wanted to collect.

"See," she said. "That. That's the problem."

He set the plate down and moved toward her across the bed. "We have one more night," he said, "and you're thinking about rules."

He kissed her and the conversation ended.

By morning they had broken most of them. Not in ways that could be named cleanly. In the way of two people who fit together in a specific way that no amount of time seems to erase — in the way his hands knew exactly where to go, in the way she moved against him with an ease that felt less like desire and more like memory coming back.

She rode him in the grey dawn light with his hands steady at her hips, his eyes on her face, saying her name just often enough that it didn't stop meaning something. When she came it was hard and sudden and she dropped her forehead to his and they stayed like that — breathing, eyes closed, entirely present.

"No feelings," he said softly, after.

"Shut up," she said, and he did.`,
    },
  });

  const ep1_3 = await prisma.eroticaEpisode.create({
    data: {
      seriesId: series1.id,
      title: "What We Don't Say",
      slug: "what-we-dont-say",
      episodeNum: 3,
      readTime: 13,
      isFree: false,
      body: `His flight was at six. She woke at four and lay still, listening to him breathe, cataloguing things she refused to admit she was cataloguing.

He woke soon after. She felt him shift, then still.

"I know you're awake," he said.

"I know."

"Serwaa."

"Don't," she said quietly. Without edge.

He was silent. Then: "Okay."

But he turned toward her, and what followed was different from the nights before — slower, more deliberate. His hands moved like they were memorising. She pressed her palm against his chest and felt his heartbeat and let herself feel everything without naming it.

He kissed down her body slowly, starting at her throat, taking his time at every place that made her react, working south until she was gripping the sheet and saying his name in a way she hadn't planned to. He stayed there, unhurried, until she pulled him back up by the shoulders.

When they moved together it was the kind of slow that borders on unbearable. He looked at her the whole time. She let him.

Afterward she made coffee while he showered and packed. They sat at the hotel window with two cups, watching the city assemble itself below.

"When does work bring you back to Accra?" he asked.

She knew what he was doing. She let him. "March. Maybe."

"March," he repeated. Like he was saving it.

When it was time, he stood. She walked with him to the door the way you do when you're not ready. He kissed her once, properly. Then put his forehead against hers.

"March," he said.

She closed the door and stood with her back against it.

She thought about rules. About bubbles. About the specific difficulty of loving someone you refuse to admit you love.

She opened her phone and typed: Let me know when you land.

She already knew what it meant.

She sent it anyway.`,
    },
  });

  const series2 = await prisma.eroticaSeries.create({
    data: {
      authorId: user2.id,
      title: "Her Education",
      slug: "her-education",
      description: "At 29, Abena decides to stop performing pleasure and start feeling it. Everything changes when she does.",
      genre: "Romance",
      coverImage: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600&h=900&fit=crop&q=80",
      isPublic: true,
      isComplete: true,
    },
  });

  const ep2_1 = await prisma.eroticaEpisode.create({
    data: {
      seriesId: series2.id,
      title: "What I Ordered",
      slug: "what-i-ordered",
      episodeNum: 1,
      readTime: 8,
      isFree: true,
      body: `The package arrived in plain discreet packaging, exactly as promised, and Abena stood at her door for a moment before bringing it inside.

She was twenty-nine years old. She had been in four relationships. She had had sex — plenty of it — and had performed pleasure competently, sometimes enthusiastically, while privately wondering what the real fuss was.

A week ago, sitting in her best friend's living room at midnight, a glass of wine in her hand, she said this out loud for the first time.

"Wait," Yaa said. "You mean you've never actually—"

"I'm not saying never. I'm saying not reliably. Not because of someone else."

Yaa looked at her with an expression that was equal parts sympathy and outrage. Then she reached for her phone. "I'm sending you a link."

The Lelo Sona 2. Discreet, quiet, highly reviewed. The comment section, Yaa had warned, was not for the faint-hearted.

Now Abena sat on her bed with the box in her lap.

She read the instructions twice — she read everything twice — then set her phone to do not disturb, turned off the overhead light, and lay back in her own apartment on a quiet Thursday night with nowhere to be and no one to perform for.

What happened next surprised her.

Not the sensation itself. She had read about it, she was prepared. What surprised her was the sound she made. She hadn't known her own body could make that sound. Hadn't known she was capable of that particular sudden overwhelming blinding—

Afterward she lay very still for a long time.

Then she picked up her phone and texted Yaa a single emoji: 🔥

Yaa replied instantly: I TOLD YOU.

Abena stared at the ceiling and thought: twenty-nine years. She had been living in a country where she didn't speak the language, and she had just said something true in it for the first time.

She wasn't going back.`,
    },
  });

  const ep2_2 = await prisma.eroticaEpisode.create({
    data: {
      seriesId: series2.id,
      title: "The Ask",
      slug: "the-ask",
      episodeNum: 2,
      readTime: 10,
      isFree: true,
      body: `His name was Kweku. They had been seeing each other for two months — easy, uncomplicated, the kind of thing that doesn't ask too much of either person.

He was attentive. She had, until recently, been satisfied by his attentiveness.

That had changed.

She knew now what her body was capable of. She knew the language. She just hadn't tried to speak it with someone else in the room.

They were lying in his bed on a Saturday, the afternoon light coming through the curtains, and he was kissing her shoulder in the comfortable, pleasant way that used to be enough.

She turned toward him.

"I want to tell you something," she said.

He propped himself up to look at her. Kweku had the kind of face that was naturally open, un-alarmed.

"Okay," he said.

"When we're together, I want you to touch me here." She took his hand. Moved it. "Not quickly. Slowly. For a long time. Before anything else."

He looked at her steadily. Not embarrassed. Just listening.

"And I want to tell you when to change," she said. "And I want to say what feels good while it's happening. Out loud."

"Abena." He said her name like he meant it. "Yes. Please."

She laughed, unexpectedly.

He kissed her. And then, for the first time in two months, they did not rush past anything.

He followed her instructions with a patience that made her feel completely seen. She said what she needed. He did it. When she asked for more pressure, more time, a different angle, he adjusted without pride, as if her pleasure was the only thing that mattered.

It was a long afternoon.

When it was over she lay completely undone and thought: this is what it was supposed to feel like. This whole time. This is what I was supposed to be able to ask for.`,
    },
  });

  const ep2_3 = await prisma.eroticaEpisode.create({
    data: {
      seriesId: series2.id,
      title: "What She Knows Now",
      slug: "what-she-knows-now",
      episodeNum: 3,
      readTime: 12,
      isFree: false,
      body: `Three months later, Abena kept a list in the notes app on her phone.

Not public. Just honest: things I know now that I didn't know before.

The list was longer than she expected.

She knew her body responded differently depending on the time of day — more slowly in the morning, more intensely after ten at night. She knew that the thing that worked fastest alone was not what she wanted when Kweku was there. She knew that talking during sex — actually talking, not performing — made everything more real and sometimes almost too much.

She knew that almost too much was where she wanted to live.

On a Friday night Kweku came over and they ate and talked about nothing and later he reached for her with that combination of intention and gentleness that she had taught him — and she had let herself be taught by him too. Because it went both ways. She had told him what she wanted. He had told her things too — things he'd never said to anyone, he said. She had received them the same way he'd received hers: without judgment, with interest.

That night she brought the Sona out of the drawer. She had mentioned it weeks ago and he had been curious, not threatened. What followed was something she had no adequate words for — his hands and hers and the vibration and his voice close against her ear, and then the long shaking arrival of something that felt less like an event and more like a door finally swinging open.

Afterward he held her while she laughed helplessly.

"Okay?" he said.

"I've wasted so much time," she said, still laughing.

He pulled her closer. "You're twenty-nine. You have time."

She pressed her face into his chest and thought: yes. For the first time in her life, she felt like she did.`,
    },
  });

  const series3 = await prisma.eroticaSeries.create({
    data: {
      authorId: user3.id,
      title: "Room 14",
      slug: "room-14",
      description: "Two colleagues. One hotel room. A conference that changes everything about what they thought they were to each other.",
      genre: "Steamy",
      coverImage: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=600&h=900&fit=crop&q=80",
      isPublic: true,
      isComplete: true,
    },
  });

  const ep3_1 = await prisma.eroticaEpisode.create({
    data: {
      seriesId: series3.id,
      title: "The Double Booking",
      slug: "the-double-booking",
      episodeNum: 1,
      readTime: 7,
      isFree: true,
      body: `Ama had known Kofi for two years. Two years of the same office, same meetings, same deliberate professional distance she had maintained with real effort, because Kofi was the kind of man you notice immediately and then spend time trying to un-notice.

She had been managing it successfully.

Then the hotel conference app glitched, and they were standing at reception in Kumasi at 8pm being told that Room 14 was registered under both their names, and every other hotel within ten kilometers was full because of the festival.

"We're adults," Kofi said. To the ceiling, not to her.

"We are," Ama agreed. "It has two beds?"

"King suite," the receptionist clarified unhelpfully.

The room was large. Warm lighting, sitting area, one enormous bed. Ama went straight to the bathroom, changed into her sleep shirt, and told herself this was fine. Adults shared hotel rooms for work. With colleagues they had not thought about in any non-professional capacity.

She came out to find him standing at the window, jacket off, looking at the city.

"I can sleep on the couch," he said.

"It's a small couch."

"I've slept on worse."

She looked at him. He was being scrupulously correct — maintaining the professional distance they'd built together over two years — and she appreciated it.

The problem was she didn't want to appreciate it anymore.

"Kofi," she said.

He turned.

She had no speech prepared. She just looked at him across the room and said: "I think we both know this stopped being just a work thing a while ago."

He was still for a moment.

Then he crossed the room.

The professional distance, when it ended, ended all at once.`,
    },
  });

  const ep3_2 = await prisma.eroticaEpisode.create({
    data: {
      seriesId: series3.id,
      title: "What We've Been Doing",
      slug: "what-weve-been-doing",
      episodeNum: 2,
      readTime: 11,
      isFree: true,
      body: `Later — much later — they lay side by side looking at the ceiling.

"Two years," Ama said.

"Two years," he agreed.

"We wasted two years."

He turned to look at her. He had several expressions she'd never seen from across a conference table — softer ones, unguarded. "I don't think of it as wasted," he said. "The waiting was part of it."

"I didn't know you were waiting."

"I know."

"Did you know I was?"

"Yes," he said.

She hit him with a pillow. He laughed — a real laugh, not the professional one she'd heard for two years — and she thought: I want to hear that every day, which was alarming to realize at eleven-thirty on a Tuesday in Kumasi.

She set the thought aside and kissed him, which was easier.

They had established by now — through the specific education of actually touching each other — that they fit together in a way that felt almost unfair. He had learned quickly where she was sensitive, responding to sound and movement without needing instruction. She had discovered that he liked to go slowly at first, liked the buildup, liked to feel her building before he let either of them move further — the patience of a man who understood that delay is not deprivation.

She pulled him back toward her and he came willingly, his hands moving with a certainty that made her stop thinking entirely. By the time she came she was gripping his shoulders and saying his name in a way that had nothing professional about it.

"What are you thinking?" he asked, after.

"Thursday's meeting," she said honestly.

He looked at her for a long moment. Then his expression shifted into the focused attention that had, two hours ago, been very effectively making her forget her own name.

"I'll give you something else to think about," he said.

He did. She forgot Thursday completely.`,
    },
  });

  const ep3_3 = await prisma.eroticaEpisode.create({
    data: {
      seriesId: series3.id,
      title: "Back Home",
      slug: "back-home",
      episodeNum: 3,
      readTime: 12,
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
