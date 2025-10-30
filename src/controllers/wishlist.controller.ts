import { AuthRequest } from "../types";
import { Response } from "express";
import * as helpers from "./base.controller";
import * as wishListService from "../services/wishlist.service";
import APIException from "../errors";

export const getUserWishList = async (req: AuthRequest, res: Response) => {
  try {
    const response = await wishListService.getUserWishList(req);

    helpers.successResponse(
      res,
      200,
      "wishList retrieved successfully",
      response
    );
  } catch (error: unknown) {
    if (error instanceof APIException) {
      helpers.errResponse(
        res,
        error.statusCode,
        "Failed to retrieve wishlist",
        error.message
      );
    }

    helpers.errResponse(res, 500, "Internal Server Error");
  }
};

export const addToWishList = async (req: AuthRequest, res: Response) => {
  try {
    const response = await wishListService.addToWishList(req);

    helpers.successResponse(res, 201, "item added to wishList", response);
  } catch (error: unknown) {
    if (error instanceof APIException) {
      helpers.errResponse(
        res,
        error.statusCode,
        "Failed to add item to wishlist",
        error.message
      );
    }

    helpers.errResponse(res, 500, "Internal Server Error");
  }
};

export const removeItemFromWishList = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const response = await wishListService.removeItemFromWishList(req);

    helpers.successResponse(res, 200, "item removed from wishList", response);
  } catch (error: unknown) {
    if (error instanceof APIException) {
      helpers.errResponse(
        res,
        error.statusCode,
        "Failed to remove item from wishlist",
        error.message
      );
    }

    helpers.errResponse(res, 500, "Internal Server Error");
  }
};

export const checkProductInWishList = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const response = await wishListService.checkProductInWishList(req);

    helpers.successResponse(
      res,
      200,
      "product in wishlist retrieved successfully",
      response
    );
  } catch (error: unknown) {
    if (error instanceof APIException) {
      helpers.errResponse(
        res,
        error.statusCode,
        "Failed to retrieve product in wishlist",
        error.message
      );
    }

    helpers.errResponse(res, 500, "Internal Server Error");
  }
};
