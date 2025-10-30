import { AuthRequest } from "../types";
import { Response } from "express";
import * as orderService from "../services/order.service";
import * as helpers from "./base.controller";
import APIException from "../errors";

export const getAllUserOrders = async (req: AuthRequest, res: Response) => {
  try {
    const response = await orderService.getAllUserOrders(req);

    helpers.successResponse(
      res,
      200,
      "All Orders retrieved successfully",
      response
    );
  } catch (error: unknown) {
    if (error instanceof APIException) {
      helpers.errResponse(
        res,
        error.statusCode,
        "Failed to retrieved All Orders",
        error.message
      );
    }

    helpers.errResponse(res, 500, "Internal Server Error");
  }
};

export const getSingleUserOrder = async (req: AuthRequest, res: Response) => {
  try {
    const response = await orderService.getSingleUserOrder(req);

    helpers.successResponse(res, 200, "Order retrieved successfully", response);
  } catch (error: unknown) {
    if (error instanceof APIException) {
      helpers.errResponse(
        res,
        error.statusCode,
        "Failed to retrieved Order",
        error.message
      );
    }

    helpers.errResponse(res, 500, "Internal Server Error");
  }
};

export const placeOrder = async (req: AuthRequest, res: Response) => {
  try {
    const response = await orderService.placeOrder(req);

    helpers.successResponse(res, 201, "Order successfully placed", response);
  } catch (error: unknown) {
    if (error instanceof APIException) {
      helpers.errResponse(
        res,
        error.statusCode,
        "Failed to retrieved place Order",
        error.message
      );
    }

    helpers.errResponse(res, 500, "Internal Server Error");
  }
};
