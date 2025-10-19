import { Router } from "express";
import { authenticate } from "../middleware/auth";
import * as orderController from "../controllers/order.controller"
import { validate } from "../middleware/validation";

const router = Router();

// All order routes require authentication
router.use(authenticate);

// Get user's orders
router.get("/", orderController.getAllUserOrders);

// Get single order
router.get("/:id", orderController.getSingleUserOrder);

// // Place order from cart
router.post("/checkout", [], orderController.placeOrder);

export default router;
