import { Router } from "express";
import { authenticate, isAdmin } from "../middleware/auth";
import * as categoryController from "../controllers/category.controller"

const router = Router();

// Get all categories (public)
router.get("/", categoryController.getAllCategories);

// Get single category with products (public)
router.get("/:slug", categoryController.getSingleCategory);

// // Create category (admin only)
router.post("/", [authenticate, isAdmin], categoryController.createCategory);

// Update category (admin only)
router.put("/:id", [authenticate, isAdmin], categoryController.updateCategory);

// Delete category (admin only)
router.delete("/:id",[ authenticate, isAdmin], categoryController.deleteCategory);

export default router;
