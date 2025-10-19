import { AuthRequest } from "../types";
import { Response } from "express";
import * as categoryService from "../services/category.service"
import * as helpers from "./base.controller";


export const getAllCategories = async (req: AuthRequest, res: Response) => {
      try {
        const response = await categoryService.getAllCategories(req);

        helpers.successResponse(
          res,
          200,
          "All Categories retrieved successfully",
          response
        );
      } catch (error: any) {
        console.error("Get products error:", error);

        helpers.errResponse(
          res,
          error.code,
          "Failed to retrieve categories",
          error.message
        );
      }
}

export const getSingleCategory = async (req: AuthRequest, res: Response) => {
      try {
        const response = await categoryService.getSingleCategory(req);

        helpers.successResponse(
          res,
          200,
          "category retrieved successfully",
          response
        );
      } catch (error: any) {
        console.error("Get products error:", error);

        helpers.errResponse(
          res,
          error.code,
          "Failed to retrive category",
          error.message
        );
      }
}

export const createCategory = async (req: AuthRequest, res: Response) => {
      try {
        const response = await categoryService.createCategory(req);

        helpers.successResponse(
          res,
          201,
          "category created successfully",
          response
        );
      } catch (error: any) {
        console.error("Get products error:", error);

        helpers.errResponse(
          res,
          error.code,
          "Failed to create category",
          error.message
        );
      }
}

export const updateCategory = async (req: AuthRequest, res: Response) => {
      try {
        const response = await categoryService.updateCategory(req);

        helpers.successResponse(
          res,
          200,
          "category updated successfully",
          response
        );
      } catch (error: any) {
        console.error("Get products error:", error);

        helpers.errResponse(
          res,
          error.code,
          "Failed to update category",
          error.message
        );
      }
}

export const deleteCategory = async (req: AuthRequest, res: Response) => {
  try {
    const response = await categoryService.deleteCategory(req);

    helpers.successResponse(
      res,
      200,
      "category deleted successfully",
      response
    );
  } catch (error: any) {
    console.error("Get products error:", error);

    helpers.errResponse(
      res,
      error.code,
      "Failed to delete category",
      error.message
    );
  }
};
