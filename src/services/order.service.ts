import { AuthRequest } from "../types";
import * as orderRepo from "../repos/order.repo";
import * as cartRepo from "../repos/cart.repo"
import NotFoundError from "../errors/not-found.error";
import ForbiddenError from "../errors/forbidden.error";
import { BadRequest } from "../errors/bad-request.error";
import * as helpers from "../utils/helpers"
import prisma from "../config/prisma.config";

export const getAllUserOrders = async (req: AuthRequest) => {
  const userId = req.user!.userId;

  const orders = await orderRepo.getAllUserOrders(userId);

  if (orders.length == 0) {
    throw new NotFoundError("orders not Found");
  }

  return orders;
};

export const getSingleUserOrder = async (req: AuthRequest) => {
  const { id } = req.params;
  const userId = req.user!.userId;

  const order = await orderRepo.getSingleUserOrder(id);

  if (!order) {
    throw new NotFoundError("order not Found");
  }

  // Check if order belongs to user
  if (order.userId !== userId) {
    throw new ForbiddenError(
      "You are not authorized to perform this operation"
    );
  }

  return order;
};

export const placeOrder = async (req: AuthRequest) => {
    const userId = req.user!.userId;

     const {
      shippingName,
      shippingEmail,
      shippingPhone,
      shippingAddress,
      shippingCity,
      shippingState,
      shippingZip,
      shippingCountry = "NG",
      paymentMethod,
      customerNotes,
    } = req.body;

    // Validate required fields
    if (
      !shippingName ||
      !shippingEmail ||
      !shippingAddress ||
      !shippingCity ||
      !shippingZip
    ) {
      throw new BadRequest("Missing required shipping information")
    }

    // Get cart items
    const cartItems =  await cartRepo.getAllCartItems(userId)

    if (cartItems.length === 0) {
      throw new NotFoundError( "Cart is empty");
    }

    // Check stock availability
    for (const item of cartItems) {
      if (item.product.stock < item.quantity) {
        throw new NotFoundError(`Insufficient stock for ${item.product.name}. Available: ${item.product.stock}`);
      }
    }

    // Calculate totals
    const subtotal = cartItems.reduce(
      (sum, item) => sum + Number(item.product.price) * item.quantity,
      0
    );

    const tax = subtotal * 0.075; // 7.5% tax
    const shippingCost = 10.0; // Flat rate shipping
    const total = subtotal + tax + shippingCost;

    // Generate order number
    const orderNumber = helpers.generateOrderNumber();

    // Create order with transaction
    const order = await prisma.$transaction(async (tx) => {
      // Create order
      const newOrder = await tx.order.create({
        data: {
          orderNumber,
          userId,
          status: "PENDING",
          paymentStatus: "PENDING",
          paymentMethod,
          subtotal,
          tax,
          shippingCost,
          total,
          shippingName,
          shippingEmail,
          shippingPhone,
          shippingAddress,
          shippingCity,
          shippingState,
          shippingZip,
          shippingCountry,
          customerNotes,
          items: {
            create: cartItems.map((item) => ({
              productId: item.product.id,
              quantity: item.quantity,
              price: item.product.price,
              subtotal: Number(item.product.price) * item.quantity,
              productName: item.product.name,
              productDescription: item.product.description,
              productImageUrl: item.product.imageUrl,
              productSku: item.product.sku,
            })),
          },
        },
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      });

      // Update product stock
      for (const item of cartItems) {
        await tx.product.update({
          where: { id: item.product.id },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });
      }

      // Clear cart
      await tx.cartItem.deleteMany({
        where: { userId: req.user!.userId },
      });

      return newOrder;
    });

};
