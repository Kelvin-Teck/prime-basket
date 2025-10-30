import { Router } from "express";
import { authenticate } from "../middleware/auth";
import * as orderController from "../controllers/order.controller";
import { validate } from "../middleware/validation";
import { asyncHandler } from "../middleware/async-handler";

const router = Router();

// All order routes require authentication
router.use(authenticate);

// Get user's orders
router.get("/", asyncHandler(orderController.getAllUserOrders));

// Get single order
router.get("/:id", asyncHandler(orderController.getSingleUserOrder));

// // Place order from cart
router.post("/checkout", [], asyncHandler(orderController.placeOrder));

export default router;
