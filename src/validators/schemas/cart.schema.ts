import Joi from "joi";

// Add To Cart Schema
export const addToCartSchema = Joi.object({
  productId: Joi.string().min(1).required().messages({
    "any.required": "Product ID is required",
  }),
  quantity: Joi.number().integer().positive().required().messages({
    "number.base": "Quantity must be a number",
    "number.positive": "Quantity must be positive",
  }),
});

// Update Cart Schema
export const updateCartSchema = Joi.object({
  quantity: Joi.number().integer().positive().required().messages({
    "number.base": "Quantity must be a number",
    "number.positive": "Quantity must be positive",
  }),
});
