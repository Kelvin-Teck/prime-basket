import Joi from "joi";

// Product Schema
export const productSchema = Joi.object({
  name: Joi.string().required(),
  slug: Joi.string().optional(), // Auto-generate on backend if not provided
  description: Joi.string().required(),
  price: Joi.number().positive().required(),
  comparePrice: Joi.number().positive().optional(),
  costPrice: Joi.number().positive().optional(),
  stock: Joi.number().integer().min(0).optional(),
  sku: Joi.string().optional(),
  imageUrl: Joi.string().uri().required(),
  images: Joi.array().items(Joi.string().uri()).optional(),
  isActive: Joi.boolean().optional(),
  isFeatured: Joi.boolean().optional(),
  metaTitle: Joi.string().optional(),
  metaDescription: Joi.string().optional(),
  categoryId: Joi.string().optional()
});

// Update Product Schema
export const updateProductSchema = Joi.object({
  name: Joi.string().min(1).optional(),
  description: Joi.string().min(1).optional(),
  price: Joi.number().positive().optional(),
  stock: Joi.number().integer().min(0).optional(),
  imageUrl: Joi.string().uri().optional(),
});
