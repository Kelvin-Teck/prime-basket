// prisma/seed.ts
import { PrismaClient, Role, OrderStatus, PaymentStatus } from "@prisma/client";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

function twoDecimals(n: number) {
  // ensure exactly 2 decimal places (Prisma Decimal will accept JS number)
  return Math.round(n * 100) / 100;
}

async function main() {
  console.log("🌱 Starting seed...");

  // -------------------------
  // 0) Clean existing data (children first)
  // -------------------------
  console.log("🗑️  Clearing existing data (in correct order)...");
  await prisma.review.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.wishlist.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();
  console.log("✅ Existing data cleared\n");

  // -------------------------
  // 1) Users
  // -------------------------
  console.log("👥 Creating users...");
  const admin = await prisma.user.create({
    data: {
      email: "admin@example.com",
      password: "admin123", // for demo only; hash in real apps
      name: "Admin User",
      role: Role.ADMIN,
    },
  });

  const users = await Promise.all(
    Array.from({ length: 4 }).map(() =>
      prisma.user.create({
        data: {
          email: faker.internet.email().toLowerCase(),
          password: "user123", // demo password
          name: faker.person.fullName(),
          role: Role.USER,
        },
      })
    )
  );

  const allUsers = [admin, ...users];
  console.log(`✅ Created ${allUsers.length} users\n`);

  // -------------------------
  // 2) Categories (unique names)
  // -------------------------
  console.log("📁 Creating categories...");
  const categoryNames = [
    "Electronics",
    "Audio",
    "Computers",
    "Accessories",
    "Home & Living",
  ]; // fixed unique list to avoid duplicates

  const categories = await Promise.all(
    categoryNames.map((name, idx) =>
      prisma.category.create({
        data: {
          name,
          slug: name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, ""),
          description: faker.lorem.sentence(),
          imageUrl: faker.image.urlPicsumPhotos({ width: 600, height: 400 }),
          sortOrder: idx + 1,
        },
      })
    )
  );
  console.log(`✅ Created ${categories.length} categories\n`);

  // -------------------------
  // 3) Products
  // -------------------------
  console.log("📦 Creating products...");
  const products = await Promise.all(
    Array.from({ length: 20 }).map(() => {
      const name = faker.commerce.productName();
      const price = twoDecimals(
        Number(faker.commerce.price({ min: 20, max: 1200 }))
      );
      const comparePrice = twoDecimals(
        price + faker.number.int({ min: 5, max: 200 })
      );
      const costPrice = twoDecimals(
        price - faker.number.int({ min: 1, max: 30 })
      );
      const category = faker.helpers.arrayElement(categories);

      return prisma.product.create({
        data: {
          name,
          slug: name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, ""),
          description: faker.commerce.productDescription(),
          price,
          comparePrice,
          costPrice,
          stock: faker.number.int({ min: 0, max: 200 }),
          sku: faker.string.alphanumeric(8).toUpperCase(),
          imageUrl: faker.image.urlPicsumPhotos({ width: 800, height: 600 }),
          images: [
            faker.image.urlPicsumPhotos({ width: 800, height: 600 }),
            faker.image.urlPicsumPhotos({ width: 800, height: 600 }),
          ],
          categoryId: category.id,
          isActive: true,
          isFeatured: faker.datatype.boolean(),
          metaTitle: `${name} — ${faker.commerce.productAdjective()}`,
          metaDescription: faker.lorem.sentence(),
        },
      });
    })
  );
  console.log(`✅ Created ${products.length} products\n`);

  // -------------------------
  // 4) Cart items
  // -------------------------
  console.log("🛒 Creating cart items...");
  const cartItems = [];
  for (const u of allUsers) {
    const count = faker.number.int({ min: 1, max: 3 });
    const chosen: Array<{ id: string }> = faker.helpers.arrayElements(products, count);
    for (const p of chosen) {
      cartItems.push({
        userId: u.id,
        productId: p.id,
        quantity: faker.number.int({ min: 1, max: 5 }),
      });
    }
  }

  // Now actually create all in DB
  await Promise.all(
    cartItems.map((item) =>
      prisma.cartItem.create({ data: item })
    )
  );
  console.log(`✅ Created ${cartItems.length} cart items\n`);

  // -------------------------
  // 5) Orders & OrderItems
  // -------------------------
  console.log("📋 Creating orders and order items...");
  const createdOrders = [];
  for (const u of allUsers) {
    const orderCount = faker.number.int({ min: 1, max: 2 });
    for (let i = 0; i < orderCount; i++) {
      // create order with placeholder totals (will update after items)
      const order = await prisma.order.create({
        data: {
          orderNumber: faker.string.alphanumeric(10).toUpperCase(),
          status: faker.helpers.arrayElement(Object.values(OrderStatus)),
          subtotal: 0,
          tax: 0,
          shippingCost: 0,
          discount: 0,
          total: 0,
          shippingName: u.name,
          shippingEmail: u.email,
          shippingPhone: faker.phone.number("+234 ### ### ####"),
          shippingAddress: faker.location.streetAddress(),
          shippingCity: faker.location.city(),
          shippingState: faker.location.state(),
          shippingZip: faker.location.zipCode(),
          shippingCountry: "NG",
          paymentMethod: faker.helpers.arrayElement([
            "credit_card",
            "paypal",
            "bank_transfer",
          ]),
          paymentStatus: faker.helpers.arrayElement(
            Object.values(PaymentStatus)
          ),
          paidAt: faker.datatype.boolean() ? faker.date.recent() : null,
          userId: u.id,
        },
      });

      // add 1-3 items
      const itemsCount = faker.number.int({ min: 1, max: 3 });
      const chosenProducts = faker.helpers.arrayElements(products, itemsCount);

      const createdItems = [];
      for (const prod of chosenProducts) {
        const qty = faker.number.int({ min: 1, max: 4 });
        const price = twoDecimals(Number(prod.price)); // price snapshot
        const subtotal = twoDecimals(qty * price);

        const item = await prisma.orderItem.create({
          data: {
            orderId: order.id,
            productId: prod.id,
            quantity: qty,
            price,
            subtotal,
            productName: prod.name,
            productDescription: prod.description,
            productImageUrl: prod.imageUrl,
            productSku: prod.sku,
          },
        });
        createdItems.push(item);
      }

      // compute totals & update order
      const subtotalSum = createdItems.reduce(
        (acc, it) => acc + Number(it.subtotal),
        0
      );
      const tax = twoDecimals(subtotalSum * 0.075); // 7.5%
      const shippingCost = 10.0;
      const discount = faker.datatype.boolean()
        ? twoDecimals(faker.number.int({ min: 0, max: 30 }))
        : 0;
      const total = twoDecimals(subtotalSum + tax + shippingCost - discount);

      await prisma.order.update({
        where: { id: order.id },
        data: { subtotal: subtotalSum, tax, shippingCost, discount, total },
      });

      createdOrders.push(order);
    }
  }
  console.log(`✅ Created ${createdOrders.length} orders (with items)\n`);

  // -------------------------
  // 6) Wishlists
  // -------------------------
  console.log("❤️ Creating wishlist items...");
  const wishlistOps = [];
  for (const u of allUsers) {
    const count = faker.number.int({ min: 1, max: 3 });
    const chosen = faker.helpers.arrayElements(products, count);
    for (const p of chosen) {
      wishlistOps.push(
        prisma.wishlist.create({
          data: { userId: u.id, productId: p.id },
        })
      );
    }
  }
  await Promise.all(wishlistOps);
  console.log(`✅ Created ${wishlistOps.length} wishlist items\n`);

  // -------------------------
  // 7) Reviews
  // -------------------------
  console.log("⭐ Creating reviews...");
  const reviewOps = [];
  for (const u of allUsers) {
    const count = faker.number.int({ min: 1, max: 2 });
    const chosen = faker.helpers.arrayElements(products, count);
    for (const p of chosen) {
      reviewOps.push(
        prisma.review.create({
          data: {
            userId: u.id,
            productId: p.id,
            rating: faker.number.int({ min: 1, max: 5 }),
            title: faker.lorem.words(3),
            comment: faker.lorem.sentences(2),
            isVerified: faker.datatype.boolean(),
            isApproved: true,
          },
        })
      );
    }
  }
  const createdReviews = await Promise.all(reviewOps);
  console.log(`✅ Created ${createdReviews.length} reviews\n`);

  // -------------------------
  // Done
  // -------------------------
  console.log("═══════════════════════════════════════");
  console.log("✨ SEED COMPLETED SUCCESSFULLY! ✨");
  console.log("═══════════════════════════════════════");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
