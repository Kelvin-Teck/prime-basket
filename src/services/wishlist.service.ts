import { AuthRequest } from "../types";
import * as wishListRepo from "../repos/wishlist.repo";
import * as productRepo from "../repos/product.repo";
import NotFoundError from "../errors/not-found.error";
import AlreadyExists from "../errors/already-exist.error";

export const getUserWishList = async (req: AuthRequest) => {
  const userId = req.user!.userId;

  const wishList = await wishListRepo.getAllUserWishList(userId);

  if (wishList.length == 0) {
    throw new NotFoundError("No wishlist Found");
  }

  return wishList;
};

export const addToWishList = async (req: AuthRequest) => {
  const userId = req.user!.userId;

  const { productId } = req.params;

  // Check if product exists
  const product = await productRepo.getSingleProductById(productId);

  if (!product) {
    throw new NotFoundError("Product not found");
  }

  // Check if already in wishlist
  const existing = await wishListRepo.findProductInUserWishList(
    userId,
    productId
  );

  if (existing) {
    throw new AlreadyExists("Product already in wishlist");
  }

  // Add to wishlist
  const wishlistItem = await wishListRepo.addToWishList(userId, productId);

  return wishlistItem;
};

export const removeItemFromWishList = async (req: AuthRequest) => {
  const userId = req.user!.userId;

  const { productId } = req.params;

  const wishlistItem = await wishListRepo.findProductInUserWishList(
    userId,
    productId
  );

  if (!wishlistItem) {
    throw new NotFoundError("Product not in wishlist");
  }

  await wishListRepo.deleteItemFromWishList(userId, productId);
  return;
};

export const checkProductInWishList = async (req: AuthRequest) => {
  const userId = req.user!.userId;

  const { productId } = req.params;

  const wishlistItem = await wishListRepo.findProductInUserWishList(
    userId,
    productId
  );

  return wishlistItem;
};
