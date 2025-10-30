import { Router } from "express";
import { authenticate, isAdmin } from "../middleware/auth";
import * as categoryController from "../controllers/category.controller";
import { asyncHandler } from "../middleware/async-handler";

const router = Router();

// Get all categories (public)
router.get("/", asyncHandler(categoryController.getAllCategories));

// Get single category with products (public)
router.get("/:slug", asyncHandler(categoryController.getSingleCategory));

// // Create category (admin only)
router.post(
  "/",
  [authenticate, isAdmin],
  asyncHandler(categoryController.createCategory)
);

// Update category (admin only)
router.put(
  "/:id",
  [authenticate, isAdmin],
  asyncHandler(categoryController.updateCategory)
);

// Delete category (admin only)
router.delete(
  "/:id",
  [authenticate, isAdmin],
  asyncHandler(categoryController.deleteCategory)
);
export default router;
