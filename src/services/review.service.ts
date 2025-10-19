import { AuthRequest } from "../types";
import * as reviewRepo from "../repos/review.repo";
import * as productRepo from "../repos/product.repo";
import * as orderItemRepo from "../repos/order-item.repo";

import NotFoundError from "../errors/not-found.error";
import { BadRequest } from "../errors/bad-request.error";
import AlreadyExists from "../errors/already-exist.error";
import ForbiddenError from "../errors/forbidden.error";

export const getProductReviews = async (req: AuthRequest) => {
  const { productId } = req.params;

  const reviews = await reviewRepo.getProductReviews(productId);

  if (reviews.length == 0) {
    throw new NotFoundError("No reviews Found");
  }

  // Calculate average rating
  const avgRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

  const formattedResponse = [...reviews, avgRating];

  return formattedResponse;
};

export const getUserReviews = async (req: AuthRequest) => {
  const userId = req.user!.userId;

  const reviews = await reviewRepo.getUserReviews(userId);

  if (reviews.length == 0) {
    throw new NotFoundError("No reviews Found");
  }

  return reviews;
};

export const createReview = async (req: AuthRequest) => {
  const userId = req.user!.userId;

  const { productId, rating, title, comment } = req.body;
  // Validate rating
  if (rating < 1 || rating > 5) {
    throw new BadRequest("Rating must be between 1 and 5");
  }
  // Check if product exists
  const product = await productRepo.getSingleProductById(productId);

  if (!product) {
    throw new NotFoundError("Product not found");
  }
  // Check if user already reviewed this product
  const existingReview = await reviewRepo.findSingleProductReviewedByUser(
    userId,
    productId
  );

  if (existingReview) {
    throw new AlreadyExists("You have already reviewed this product");
  }
  // Check if user purchased this product (verified review)
  const hasPurchased = orderItemRepo.findSingleDeliveredOrderItem(
    userId,
    productId
  );

  const data = {
    userId,
    productId,
    rating,
    title,
    comment,
    isVerified: !!hasPurchased,
    isApproved: false, // Auto-approve, or set to false for manual approval
  };

  const review = await reviewRepo.createReview(data);

  return review;
};

export const updateReview = async (req: AuthRequest) => {
  const userId = req.user!.userId;
  const { id } = req.params;

  const { rating, title, comment } = req.body;

  // Check if review exists and belongs to user
  const existingReview = await reviewRepo.getReviewById(id);

  if (!existingReview) {
    throw new NotFoundError("Review not found");
  }

  if (existingReview.userId !== userId) {
    throw new ForbiddenError("Unauthorized");
  }

  const data = {
    rating,
    title,
    comment,
  };

  return await reviewRepo.updateReview(id, data);
};

export const deleteReview = async (req: AuthRequest) => {
  const userId = req.user!.userId;

  const { id } = req.params;

  const review = await reviewRepo.getReviewById(id);

  if (!review) {
    throw new NotFoundError("Review not found");
  }

  if (review.userId !== userId) {
    throw new ForbiddenError(
      "You are not authorized to perform this operation"
    );
  }

  await reviewRepo.deleteReview(id);
};


export const approveReview = async (req: AuthRequest) => {
  const {id} =  req.params
  const approvedReview = reviewRepo.approveReview(id)
  
  return approvedReview;
}