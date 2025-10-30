import { AuthRequest } from "../types";
import { Response } from "express";
import * as helpers from "./base.controller";
import * as cartService from "../services/cart.service";
import APIException from "../errors";

export const getAllCartItems = async (req: AuthRequest, res: Response) => {
  try {
    const response = await cartService.getAllCartItems(req);

    helpers.successResponse(
      res,
      200,
      "Cart Items successfully retrieved",
      response
    );
  } catch (error: unknown) {
    if (error instanceof APIException) {
      helpers.errResponse(
        res,
        error.statusCode,
        "Failed to retrieved cart items",
        error.message
      );
    }
    helpers.errResponse(res, 500, "Internal Server Error");
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
  } catch (error: unknown) {
    if (error instanceof APIException) {
      helpers.errResponse(
        res,
        error.statusCode,
        "Failed to add item to cart",
        error.message
      );
    }
    helpers.errResponse(res, 500, "Internal Server Error");
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
  } catch (error: unknown) {
    if (error instanceof APIException) {
      helpers.errResponse(
        res,
        error.statusCode,
        "Failed to update item in cart",
        error.message
      );
    }

    helpers.errResponse(res, 500, "Internal Server Error");
  }
};

export const removeCartItem = async (req: AuthRequest, res: Response) => {
  try {
    const response = await cartService.removeCartItem(req);

    helpers.successResponse(
      res,
      200,
      "Cart Item deleted successfully",
      response
    );
  } catch (error: unknown) {
    if (error instanceof APIException) {
      helpers.errResponse(
        res,
        error.statusCode,
        "Failed to delete item from cart",
        error.message
      );
    }

    helpers.errResponse(res, 500, "Internal Server Error");
  }
};
