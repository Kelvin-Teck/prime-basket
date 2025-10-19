import Joi from "joi";

// Product Schema
export const productSchema = Joi.object({
  name: Joi.string().min(1).required().messages({
    "any.required": "Product name is required",
  }),
  description: Joi.string().min(1).required().messages({
    "any.required": "Description is required",
  }),
  price: Joi.number().positive().required().messages({
    "number.positive": "Price must be positive",
  }),
  stock: Joi.number().integer().min(0).required().messages({
    "number.base": "Stock must be a number",
    "number.min": "Stock must be non-negative",
  }),
  imageUrl: Joi.string().uri().required().messages({
    "string.uri": "Invalid image URL",
  }),
});

// Update Product Schema
export const updateProductSchema = Joi.object({
  name: Joi.string().min(1).optional(),
  description: Joi.string().min(1).optional(),
  price: Joi.number().positive().optional(),
  stock: Joi.number().integer().min(0).optional(),
  imageUrl: Joi.string().uri().optional(),
});
