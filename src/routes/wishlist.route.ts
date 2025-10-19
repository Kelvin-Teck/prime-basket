import { Router } from "express";
import { authenticate } from "../middleware/auth";
import * as wishListController from "../controllers/wishlist.controller"

const router = Router();

// All wishlist routes require authentication
router.use(authenticate);

// Get user's wishlist
router.get("/", wishListController.getUserWishList);

// Add product to wishlist
router.post("/:productId", wishListController.addToWishList);

// Remove product from wishlist
router.delete("/:productId", wishListController.removeItemFromWishList);

// Check if product is in wishlist
router.get("/check/:productId", wishListController.checkProductInWishList);

export default router;
