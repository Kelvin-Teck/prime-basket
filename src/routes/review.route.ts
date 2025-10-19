import { Router } from "express";
import { authenticate, isAdmin } from "../middleware/auth";
import { AuthRequest } from "../types";
import * as reviewController from "../controllers/review.controller"

const router = Router();

// Get reviews for a product (public)
router.get("/product/:productId", reviewController.getProductReviews);

// Get user's reviews (authenticated)
router.get("/my-reviews", [authenticate], reviewController.getUserReviews) ;

// Create review (authenticated)
router.post("/", [authenticate],  reviewController.createReview);

// Update review (authenticated)
router.put("/:id", [authenticate], reviewController.updateReview);

// Delete review (authenticated)
router.delete("/:id", [authenticate], reviewController.deleteReview);

// Approve review (admin only)
router.patch("/:id/approve", [authenticate, isAdmin], reviewController.approveReview);

export default router;
