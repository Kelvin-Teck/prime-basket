import { AuthRequest } from "../types";
import { NextFunction, Response } from "express";
import * as helpers from "./base.controller";
import * as productService from "../services/product.service";
import APIException from "../errors";

export const getAllProducts = async (req: AuthRequest, res: Response) => {
  try {
    const response = await productService.getAllProducts();

    helpers.successResponse(
      res,
      200,
      "All Products retrieved successfully",
      response
    );
  } catch (error: unknown) {
    if (error instanceof APIException) {
      helpers.errResponse(
        res,
        error.statusCode,
        "Failed to retrieved All Products",
        error.message
      );
    }

    helpers.errResponse(res, 500, "Internal Server Error");
  }
};

export const getSingleProduct = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const response = await productService.getSingleProduct(req);

    helpers.successResponse(
      res,
      200,
      "Product retrieved successfully",
      response
    );
  } catch (error: unknown) {
    if (error instanceof APIException) {
      helpers.errResponse(
        res,
        error.statusCode,
        "Failed to retrieved Product",
        error.message
      );
    }

    helpers.errResponse(res, 500, "Internal Server Error");
  }
};

export const createProduct = async (req: AuthRequest, res: Response) => {
  try {
    const response = await productService.createProduct(req);

    helpers.successResponse(res, 201, "Product created successfully", response);
  } catch (error: unknown) {
    if (error instanceof APIException) {
      helpers.errResponse(
        res,
        error.statusCode,
        "Failed to create Product",
        error.message
      );
    }

    helpers.errResponse(res, 500, "Internal Server Error");
  }
};

export const updateProduct = async (req: AuthRequest, res: Response) => {
  try {
    const response = await productService.updateProduct(req);

    helpers.successResponse(res, 201, "Product updated successfully", response);
  } catch (error: unknown) {
    if (error instanceof APIException) {
      helpers.errResponse(
        res,
        error.statusCode,
        "Failed to update Product",
        error.message
      );
    }

    helpers.errResponse(res, 500, "Internal Server Error");
  }
};

export const deleteProduct = async (req: AuthRequest, res: Response) => {
  try {
    const response = await productService.deleteProduct(req);

    helpers.successResponse(res, 200, "Product deleted successfully", response);
  } catch (error: unknown) {
    if (error instanceof APIException) {
      helpers.errResponse(
        res,
        error.statusCode,
        "Failed to delete Product",
        error.message
      );
    }

    helpers.errResponse(res, 500, "Internal Server Error");
  }
};
