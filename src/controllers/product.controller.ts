import { AuthRequest } from "../types";
import { Response } from "express";
import * as helpers from "./base.controller";
import * as productService from "../services/product.service";

export const getAllProducts = async (req: AuthRequest, res: Response) => {
  try {
    const response = await productService.getAllProducts();

    helpers.successResponse(
      res,
      200,
      "All Products retrieved successfully",
      response
      );
      
      
  } catch (error: any) {
    console.error("Get products error:", error);

    helpers.errResponse(
      res,
      error.code,
      "Failed to retrieved All Products",
      error.message
    );
  }
};

export const getSingleProduct = async (req: AuthRequest, res: Response) => {
  try {
    const response = await productService.getSingleProduct(req);

    helpers.successResponse(
      res,
      200,
      "Product retrieved successfully",
      response
      );
      
      
  } catch (error: any) {
    console.error("Get product error:", error);

    helpers.errResponse(
      res,
      error.code,
      "Failed to retrieved Product",
      error.message
    );
  }
};

export const createProduct = async (req: AuthRequest, res: Response) => {
  try {
    const response = await productService.createProduct(req);

    helpers.successResponse(
      res,
      201,
      "Product created successfully",
      response
      );
      
      
  } catch (error: any) {
    console.error("Get product error:", error);

    helpers.errResponse(
      res,
      error.code,
      "Failed to create Product",
      error.message
    );
  }
};

export const updateProduct = async (req: AuthRequest, res: Response) => {
  try {
    const response = await productService.updateProduct(req);

    helpers.successResponse(
      res,
      201,
      "Product updated successfully",
      response
      );
      
      
  } catch (error: any) {
    console.error("Get product error:", error);

    helpers.errResponse(
      res,
      error.code,
      "Failed to update Product",
      error.message
    );
  }
};

export const deleteProduct = async (req: AuthRequest, res: Response) => {
  try {
    const response = await productService.deleteProduct(req);

    helpers.successResponse(
      res,
      200,
      "Product deleted successfully",
      response
      );
      
      
  } catch (error: any) {
    console.error("Get product error:", error);

    helpers.errResponse(
      res,
      error.code,
      "Failed to delete Product",
      error.message
    );
  }
};
