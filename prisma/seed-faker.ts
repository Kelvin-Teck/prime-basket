import { PrismaClient, Role, OrderStatus, PaymentStatus } from "@prisma/client";
import { faker } from "@faker-js/faker";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// Helper function to generate slug from name
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// Helper function to generate order number
function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `ORD-${timestamp}-${random}`;
}

// Helper function to round to 2 decimal places
function roundToTwoDecimals(num: number): number {
  return Math.round(num * 100) / 100;
}

async function main() {
  console.log("🌱 Starting Faker seed...\n");

  // Clear existing data in correct order (respect foreign keys)
  console.log("🗑️  Clearing existing data...");
  await prisma.review.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.wishlist.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();
  console.log("✅ Existing data cleared\n");

  // ============================================
  // CREATE USERS
  // ============================================
  console.log("👥 Creating users...");
  const adminPassword = await bcrypt.hash("admin123", 10);
  const userPassword = await bcrypt.hash("user123", 10);

  // Create admin user
  const admin = await prisma.user.create({
    data: {
      email: "admin@primebasket.com",
      password: adminPassword,
      name: "Admin User",
      role: Role.ADMIN,
    },
  });

  // Create regular users with Faker
  const users = await Promise.all(
    Array.from({ length: 20 }).map(async () => {
      const hashedPassword = await bcrypt.hash("user123", 10);
      return prisma.user.create({
        data: {
          email: faker.internet.email().toLowerCase(),
          password: hashedPassword,
          name: faker.person.fullName(),
          role: Role.USER,
        },
      });
    })
  );

  console.log(
    `✅ Created ${users.length + 1} users (1 admin, ${users.length} regular)\n`
  );

  // ============================================
  // CREATE CATEGORIES
  // ============================================
  console.log("📁 Creating categories...");
  const categoryNames = [
    "Electronics",
    "Audio & Music",
    "Computers & Laptops",
    "Mobile & Accessories",
    "Home & Kitchen",
    "Sports & Fitness",
    "Books & Media",
    "Fashion & Apparel",
    "Health & Beauty",
    "Automotive",
  ];

  const categories = await Promise.all(
    categoryNames.map((name, index) =>
      prisma.category.create({
        data: {
          name,
          slug: generateSlug(name),
          description: faker.commerce.departmentDescription(),
          imageUrl: faker.image.url({ width: 500, height: 300 }),
          sortOrder: index + 1,
        },
      })
    )
  );

  console.log(`✅ Created ${categories.length} categories\n`);

  // ============================================
  // CREATE PRODUCTS
  // ============================================
  console.log("📦 Creating products...");
  const productCount = 100;
  const products = [];

  for (let i = 0; i < productCount; i++) {
    const productName = faker.commerce.productName();
    const basePrice = parseFloat(faker.commerce.price({ min: 10, max: 1000 }));
    const comparePrice = faker.datatype.boolean()
      ? basePrice * faker.number.float({ min: 1.2, max: 2.0 })
      : null;
    const costPrice = basePrice * faker.number.float({ min: 0.3, max: 0.7 });
    const stock = faker.number.int({ min: 0, max: 100 });
    const isFeatured = faker.datatype.boolean({ probability: 0.2 });

    const product = await prisma.product.create({
      data: {
        name: productName,
        slug: generateSlug(productName),
        description: faker.commerce.productDescription(),
        price: roundToTwoDecimals(basePrice),
        comparePrice: comparePrice ? roundToTwoDecimals(comparePrice) : null,
        costPrice: roundToTwoDecimals(costPrice),
        stock,
        sku: faker.string.alphanumeric({ length: 8, casing: "upper" }),
        imageUrl: faker.image.url({ width: 500, height: 500 }),
        images: Array.from({
          length: faker.number.int({ min: 1, max: 4 }),
        }).map(() => faker.image.url({ width: 500, height: 500 })),
        isActive: faker.datatype.boolean({ probability: 0.95 }),
        isFeatured,
        metaTitle: `${productName} - Premium Quality`,
        metaDescription: faker.commerce.productDescription().substring(0, 160),
        viewCount: faker.number.int({ min: 0, max: 1000 }),
        categoryId: faker.helpers.arrayElement(categories).id,
      },
    });
    products.push(product);
  }

  console.log(`✅ Created ${products.length} products\n`);

  // ============================================
  // CREATE CART ITEMS
  // ============================================
  console.log("🛒 Creating cart items...");
  const cartItemCount = faker.number.int({ min: 20, max: 50 });
  const cartItems = [];

  for (let i = 0; i < cartItemCount; i++) {
    const user = faker.helpers.arrayElement(users);
    const product = faker.helpers.arrayElement(products);
    const quantity = faker.number.int({ min: 1, max: 5 });

    // Check if cart item already exists for this user-product combination
    const existingCartItem = await prisma.cartItem.findUnique({
      where: {
        userId_productId: {
          userId: user.id,
          productId: product.id,
        },
      },
    });

    if (!existingCartItem) {
      const cartItem = await prisma.cartItem.create({
        data: {
          userId: user.id,
          productId: product.id,
          quantity,
        },
      });
      cartItems.push(cartItem);
    }
  }

  console.log(`✅ Created ${cartItems.length} cart items\n`);

  // ============================================
  // CREATE WISHLIST ITEMS
  // ============================================
  console.log("❤️  Creating wishlist items...");
  const wishlistCount = faker.number.int({ min: 30, max: 80 });
  const wishlistItems = [];

  for (let i = 0; i < wishlistCount; i++) {
    const user = faker.helpers.arrayElement(users);
    const product = faker.helpers.arrayElement(products);

    // Check if wishlist item already exists for this user-product combination
    const existingWishlist = await prisma.wishlist.findUnique({
      where: {
        userId_productId: {
          userId: user.id,
          productId: product.id,
        },
      },
    });

    if (!existingWishlist) {
      const wishlistItem = await prisma.wishlist.create({
        data: {
          userId: user.id,
          productId: product.id,
        },
      });
      wishlistItems.push(wishlistItem);
    }
  }

  console.log(`✅ Created ${wishlistItems.length} wishlist items\n`);

  // ============================================
  // CREATE ORDERS
  // ============================================
  console.log("📋 Creating orders...");
  const orderCount = faker.number.int({ min: 15, max: 40 });
  const orders = [];

  for (let i = 0; i < orderCount; i++) {
    const user = faker.helpers.arrayElement(users);
    const orderStatus = faker.helpers.arrayElement([
      OrderStatus.DELIVERED,
      OrderStatus.SHIPPED,
      OrderStatus.PROCESSING,
      OrderStatus.PAID,
      OrderStatus.PENDING,
    ]);
    const paymentStatus = faker.helpers.arrayElement([
      PaymentStatus.PAID,
      PaymentStatus.PENDING,
      PaymentStatus.FAILED,
    ]);

    // Create 1-5 items per order
    const itemCount = faker.number.int({ min: 1, max: 5 });
    const orderProducts = faker.helpers.arrayElements(products, itemCount);

    let subtotal = 0;
    const orderItems = orderProducts.map((product) => {
      const quantity = faker.number.int({ min: 1, max: 3 });
      const price = Number(product.price);
      const itemSubtotal = roundToTwoDecimals(price * quantity);
      subtotal += itemSubtotal;

      return {
        productId: product.id,
        quantity,
        price,
        subtotal: itemSubtotal,
        productName: product.name,
        productDescription: product.description,
        productImageUrl: product.imageUrl,
        productSku: product.sku,
      };
    });

    const tax = roundToTwoDecimals(subtotal * 0.075); // 7.5% tax
    const shippingCost = roundToTwoDecimals(
      faker.number.float({ min: 5, max: 25 })
    );
    const discount = faker.datatype.boolean({ probability: 0.3 })
      ? roundToTwoDecimals(faker.number.float({ min: 5, max: 50 }))
      : 0;
    const total = roundToTwoDecimals(subtotal + tax + shippingCost - discount);

    const order = await prisma.order.create({
      data: {
        orderNumber: generateOrderNumber(),
        userId: user.id,
        status: orderStatus,
        paymentStatus,
        paymentMethod: faker.helpers.arrayElement([
          "credit_card",
          "paypal",
          "bank_transfer",
          "cash_on_delivery",
        ]),
        subtotal,
        tax,
        shippingCost,
        discount,
        total,
        shippingName: faker.person.fullName(),
        shippingEmail: faker.internet.email(),
        shippingPhone: faker.phone.number(),
        shippingAddress: faker.location.streetAddress(),
        shippingCity: faker.location.city(),
        shippingState: faker.location.state(),
        shippingZip: faker.location.zipCode(),
        shippingCountry: faker.location.countryCode(),
        trackingNumber: faker.datatype.boolean({ probability: 0.7 })
          ? faker.string.alphanumeric({ length: 12, casing: "upper" })
          : null,
        paidAt:
          paymentStatus === PaymentStatus.PAID
            ? faker.date.past({ years: 1 })
            : null,
        shippedAt:
          orderStatus === OrderStatus.SHIPPED ||
          orderStatus === OrderStatus.DELIVERED
            ? faker.date.past({ years: 1 })
            : null,
        deliveredAt:
          orderStatus === OrderStatus.DELIVERED
            ? faker.date.past({ years: 1 })
            : null,
        customerNotes: faker.datatype.boolean({ probability: 0.3 })
          ? faker.lorem.sentence()
          : null,
        items: {
          create: orderItems,
        },
      },
    });
    orders.push(order);
  }

  console.log(`✅ Created ${orders.length} orders\n`);

  // ============================================
  // CREATE REVIEWS
  // ============================================
  console.log("⭐ Creating product reviews...");
  const reviewCount = faker.number.int({ min: 50, max: 150 });
  const reviews = [];

  for (let i = 0; i < reviewCount; i++) {
    const user = faker.helpers.arrayElement(users);
    const product = faker.helpers.arrayElement(products);
    const rating = faker.number.int({ min: 1, max: 5 });

    // Check if review already exists for this user-product combination
    const existingReview = await prisma.review.findUnique({
      where: {
        userId_productId: {
          userId: user.id,
          productId: product.id,
        },
      },
    });

    if (!existingReview) {
      const review = await prisma.review.create({
        data: {
          userId: user.id,
          productId: product.id,
          rating,
          title: faker.lorem.sentence({ min: 3, max: 8 }),
          comment: faker.lorem.paragraphs({ min: 1, max: 3 }),
          isVerified: faker.datatype.boolean({ probability: 0.7 }),
          isApproved: faker.datatype.boolean({ probability: 0.9 }),
        },
      });
      reviews.push(review);
    }
  }

  console.log(`✅ Created ${reviews.length} product reviews\n`);

  // ============================================
  // SUMMARY
  // ============================================
  console.log("═══════════════════════════════════════");
  console.log("✨ FAKER SEED COMPLETED SUCCESSFULLY! ✨");
  console.log("═══════════════════════════════════════\n");

  console.log("📊 Database Summary:");
  console.log("───────────────────────────────────────");
  console.log(
    `👥 Users: ${users.length + 1} (1 admin, ${users.length} regular)`
  );
  console.log(`   Admin: admin@primebasket.com / admin123`);
  console.log(`   Regular users: user123 (password for all)\n`);
  console.log(`📁 Categories: ${categories.length}`);
  const featuredProducts = products.filter((p: any) => p.isFeatured);
  console.log(
    `📦 Products: ${products.length} (${featuredProducts.length} featured)`
  );
  console.log(`🛒 Cart Items: ${cartItems.length}`);
  console.log(`❤️  Wishlist Items: ${wishlistItems.length}`);
  console.log(`📋 Orders: ${orders.length}`);
  console.log(`⭐ Reviews: ${reviews.length}\n`);
  console.log("═══════════════════════════════════════\n");
}

main()
  .catch((e) => {
    console.error("❌ Faker seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
