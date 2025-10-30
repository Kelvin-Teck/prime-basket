import { Router } from "express";
import { authenticate, isAdmin } from "../middleware/auth";
import { AuthRequest } from "../types";
import * as reviewController from "../controllers/review.controller";
import { asyncHandler } from "../middleware/async-handler";

const router = Router();

// Get reviews for a product (public)
router.get(
  "/product/:productId",
  asyncHandler(reviewController.getProductReviews)
);

// Get user's reviews (authenticated)
router.get(
  "/my-reviews",
  [authenticate],
  asyncHandler(reviewController.getUserReviews)
);

// Create review (authenticated)
router.post("/", [authenticate], asyncHandler(reviewController.createReview));

// Update review (authenticated)
router.put("/:id", [authenticate], asyncHandler(reviewController.updateReview));

// Delete review (authenticated)
router.delete(
  "/:id",
  [authenticate],
  asyncHandler(reviewController.deleteReview)
);

// Approve review (admin only)
router.patch(
  "/:id/approve",
  [authenticate, isAdmin],
  asyncHandler(reviewController.approveReview)
);

export default router;
