import { AddToCartBody, AuthRequest, UpdateCartBody } from "../types";
import * as cartRepo from "../repos/cart.repo";
import * as productRepo from "../repos/product.repo";
import NotFoundError from "../errors/not-found.error";
import ForbiddenError from "../errors/forbidden.error";

export const getAllCartItems = async (req: AuthRequest) => {
  const userId = req.user!.userId;

  const cartItems = await cartRepo.getAllCartItems(userId);

  if (cartItems.length == 0) {
    throw new NotFoundError("No Item in cart");
  }

  return cartItems;
};

export const addToCart = async (req: AuthRequest) => {
  const userId = req.user!.userId;
  // const cartItems = await cartRepo.getAllCartItems(userId)
  const { productId, quantity } = req.body as AddToCartBody;

  // Check if product exists and has enough stock
  const product = await productRepo.getSingleProductById(productId);

  if (!product) {
    throw new NotFoundError("Product not found");
  }

  if (product.stock < quantity) {
    throw new NotFoundError("Insufficient stock. Currently out of stock");
  }

  // Check if item already in cart
  const existingItem = await cartRepo.getCartItem(userId, productId);

  let cartItem;
  if (existingItem) {
    // Update quantity
    const newQuantity = existingItem.quantity + quantity;

    if (product.stock < newQuantity) {
      throw new NotFoundError("Insufficient stock. Currently out of stock");
    }

    cartItem = await cartRepo.updateCartItemQuantity(
      newQuantity,
      existingItem.id
    );
  } else {
    // Create new cart item
    cartItem = await cartRepo.createCartItem(userId, productId, quantity);
  }
};

export const updateCartItem = async (req: AuthRequest) => {
  const { id } = req.params;
  const userId = req.user!.userId;

  const { quantity } = req.body as UpdateCartBody;
  // Check if cart item exists and belongs to user
  const cartItem = await cartRepo.getSingleCartItemById(id);

  if (!cartItem) {
    throw new NotFoundError("Cart item not found");
  }

  if (cartItem.userId !== userId) {
    throw new ForbiddenError(
      "You are not authororized to perform this operation"
    );
  }

  // Check stock
  if (cartItem.product.stock < quantity) {
    throw new NotFoundError("Insufficient stock. This item is out of stock");
  }

  const updatedItem = await cartRepo.updateCartItemQuantity(quantity, id);

  return updateCartItem;
};

export const removeCartItem = async (req: AuthRequest) => {
  const { id } = req.params;
  const userId = req.user!.userId;

  const cartItem = await cartRepo.getSingleCartItemById(id);

  if (!cartItem) {
    throw new NotFoundError("Cart item not found");
  }

  if (cartItem.userId !== userId) {
    throw new ForbiddenError(
      "You are not authororized to perform this operation"
    );
  }

  await cartRepo.removeCartItem(id);
};
