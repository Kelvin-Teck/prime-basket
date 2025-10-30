import { AuthRequest } from "../types";
import { Response } from "express";
import * as helpers from "./base.controller";
import * as reviewService from "../services/review.service";
import APIException from "../errors";

export const getProductReviews = async (req: AuthRequest, res: Response) => {
  try {
    const response = await reviewService.getProductReviews(req);

    helpers.successResponse(
      res,
      200,
      "Product Reviews successfully retrieved",
      response
    );
  } catch (error: unknown) {
    if (error instanceof APIException) {
      helpers.errResponse(
        res,
        error.statusCode,
        "Failed to retrieved product reviews",
        error.message
      );
    }

    helpers.errResponse(res, 500, "Internal Server Error");
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
  } catch (error: unknown) {
    if (error instanceof APIException) {
      helpers.errResponse(
        res,
        error.statusCode,
        "Failed to retrieve user reviews",
        error.message
      );
    }

    helpers.errResponse(res, 500, "Internal Server Error");
  }
};

export const createReview = async (req: AuthRequest, res: Response) => {
  try {
    const response = await reviewService.createReview(req);

    helpers.successResponse(res, 201, "Review created successfully", response);
  } catch (error: unknown) {
    if (error instanceof APIException) {
      helpers.errResponse(
        res,
        error.statusCode,
        "Failed to create review",
        error.message
      );
    }

    helpers.errResponse(res, 500, "Internal Server Error");
  }
};

export const updateReview = async (req: AuthRequest, res: Response) => {
  try {
    const response = await reviewService.updateReview(req);

    helpers.successResponse(res, 201, "Review updated successfully", response);
  } catch (error: unknown) {
    if (error instanceof APIException) {
      helpers.errResponse(
        res,
        error.statusCode,
        "Failed to update review",
        error.message
      );
    }

    helpers.errResponse(res, 500, "Internal Server Error");
  }
};

export const deleteReview = async (req: AuthRequest, res: Response) => {
  try {
    const response = await reviewService.deleteReview(req);

    helpers.successResponse(res, 200, "Review deleted successfully", response);
  } catch (error: unknown) {
    if (error instanceof APIException) {
      helpers.errResponse(
        res,
        error.statusCode,
        "Failed to delete review",
        error.message
      );
    }

    helpers.errResponse(res, 500, "Internal Server Error");
  }
};

export const approveReview = async (req: AuthRequest, res: Response) => {
  try {
    const response = await reviewService.approveReview(req);

    helpers.successResponse(res, 201, "Review approved successfully", response);
  } catch (error: unknown) {
    if (error instanceof APIException) {
      helpers.errResponse(
        res,
        error.statusCode,
        "Failed to approved review",
        error.message
      );
    }
    helpers.errResponse(res, 500, "Internal Server Error");
  }
};
