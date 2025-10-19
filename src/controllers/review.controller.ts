import { AuthRequest } from "../types";
import { Response } from "express";
import * as helpers from "./base.controller";
import * as reviewService from "../services/review.service";

export const getProductReviews = async (req: AuthRequest, res: Response) => {
  try {
    const response = await reviewService.getProductReviews(req);

    helpers.successResponse(
      res,
      200,
      "Product Reviews successfully retrieved",
      response
    );
  } catch (error: any) {
    console.error("Get products error:", error);

    helpers.errResponse(
      res,
      error.code,
      "Failed to retrieved product reviews",
      error.message
    );
  }
};

export const getUserReviews = async (req: AuthRequest, res: Response) => {
  try {
    const response = await reviewService.getUserReviews(req);

    helpers.successResponse(
      res,
      200,
      "User Reviews successfully retrieved",
      response
    );
  } catch (error: any) {
    console.error("Get products error:", error);

    helpers.errResponse(
      res,
      error.code,
      "Failed to retrieve user reviews",
      error.message
    );
  }
};

export const createReview = async (req: AuthRequest, res: Response) => {
  try {
    const response = await reviewService.createReview(req);

    helpers.successResponse(
      res,
      201,
      "Review created successfully",
      response
    );
  } catch (error: any) {
    console.error("Get products error:", error);

    helpers.errResponse(
      res,
      error.code,
      "Failed to create review",
      error.message
    );
  }
};



export const updateReview = async (req: AuthRequest, res: Response) => {
    try {
      const response = await reviewService.updateReview(req);

      helpers.successResponse(
        res,
        201,
        "Review updated successfully",
        response
      );
    } catch (error: any) {
      console.error("Get products error:", error);

      helpers.errResponse(
        res,
        error.code,
        "Failed to update review",
        error.message
      );
    }
}

export const deleteReview = async (req: AuthRequest, res: Response) => {
    try {
      const response = await reviewService.deleteReview(req);

      helpers.successResponse(
        res,
        200,
        "Review deleted successfully",
        response
      );
    } catch (error: any) {
      console.error("Get products error:", error);

      helpers.errResponse(
        res,
        error.code,
        "Failed to delete review",
        error.message
      );
    }
}

export const approveReview = async (req: AuthRequest, res: Response) => {
    try {
      const response = await reviewService.approveReview(req);

      helpers.successResponse(
        res,
        201,
        "Review approved successfully",
        response
      );
    } catch (error: any) {
      console.error("Get products error:", error);

      helpers.errResponse(
        res,
        error.code,
        "Failed to approved review",
        error.message
      );
    }
}

