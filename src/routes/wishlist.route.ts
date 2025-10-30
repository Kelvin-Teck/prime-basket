import { Router } from "express";
import { authenticate } from "../middleware/auth";
import * as wishListController from "../controllers/wishlist.controller";
import { asyncHandler } from "../middleware/async-handler";

const router = Router();

// All wishlist routes require authentication
router.use(authenticate);

// Get user's wishlist
router.get("/", asyncHandler(wishListController.getUserWishList));

// Add product to wishlist
router.post("/:productId", asyncHandler(wishListController.addToWishList));

// Remove product from wishlist
router.delete(
  "/:productId",
  asyncHandler(wishListController.removeItemFromWishList)
);

// Check if product is in wishlist
router.get(
  "/check/:productId",
  asyncHandler(wishListController.checkProductInWishList)
);

export default router;
