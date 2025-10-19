import { AuthRequest } from "../types";
import { Response } from "express";
import * as helpers from "./base.controller";
import * as cartService from "../services/cart.service";

export const getAllCartItems = async (req: AuthRequest, res: Response) => {
  try {
    const response = await cartService.getAllCartItems(req);

    helpers.successResponse(
      res,
      200,
      "Cart Items successfully retrieved",
      response
    );
  } catch (error: any) {
    console.error("Get products error:", error);

    helpers.errResponse(
      res,
      error.code,
      "Failed to retrieved cart items",
      error.message
    );
  }
};

export const addToCart = async (req: AuthRequest, res: Response) => {
  try {
    const response = await cartService.addToCart(req);

    helpers.successResponse(
      res,
      201,
      "Item added to cart successfully",
      response
    );
  } catch (error: any) {
    console.error("Get products error:", error);

    helpers.errResponse(
      res,
      error.code,
      "Failed to add item to cart",
      error.message
    );
  }
};

export const updateCart = async (req: AuthRequest, res: Response) => {
  try {
    const response = await cartService.updateCartItem(req);

    helpers.successResponse(
      res,
      201,
      "Cart Item updated successfully",
      response
    );
  } catch (error: any) {
    console.error("Get products error:", error);

    helpers.errResponse(
      res,
      error.code,
      "Failed to update item in cart",
      error.message
    );
  }
};


export const removeCartItem = async (req: AuthRequest, res: Response) =>{
      try {
    const response = await cartService.removeCartItem(req);

    helpers.successResponse(
      res,
      200,
      "Cart Item deleted successfully",
      response
    );
  } catch (error: any) {
    console.error("Get products error:", error);

    helpers.errResponse(
      res,
      error.code,
      "Failed to delete item from cart",
      error.message
    );
  }
}