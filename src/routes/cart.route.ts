import { Router } from "express";
import { authenticate } from "../middleware/auth";
import { validate } from "../middleware/validation";
import * as cartController from "../controllers/cart.controller";
import { addToCartSchema, updateCartSchema } from "../validators";
import { asyncHandler } from "../middleware/async-handler";

const router = Router();

// All cart routes require authentication
router.use(authenticate);

// Get cart
router.get("/", asyncHandler(cartController.getAllCartItems));

// Add to cart
router.post(
  "/",
  [validate(addToCartSchema)],
  asyncHandler(cartController.addToCart)
);

// Update cart item quantity
router.put("/:id", [validate(updateCartSchema)], asyncHandler(cartController.updateCart));

// Remove from  Item from cart
router.delete("/:id", asyncHandler(cartController.removeCartItem));

export default router;
