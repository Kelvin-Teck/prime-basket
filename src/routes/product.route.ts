import { Router } from "express";
import { authenticate, isAdmin } from "../middleware/auth";
import { productSchema, updateProductSchema } from "../validators";

import { CreateProductBody, UpdateProductBody } from "../types";
import * as productController from "../controllers/product.controller";
import { validate } from "../middleware/validation";

const router = Router();

// Get all products (public)
router.get("/", [authenticate], productController.getAllProducts);

// Get single product (public)
router.get("/:id", [authenticate], productController.getSingleProduct);

// Create product (admin only)
router.post(
  "/",
  [authenticate, isAdmin, validate(productSchema)],
  productController.createProduct
);

// Update product (admin only)
router.put(
  "/:id",
  [authenticate, isAdmin, validate(updateProductSchema)],
  productController.updateProduct
);

// Delete product (admin only)
router.delete("/:id", [authenticate, isAdmin], productController.deleteProduct);

export default router;
