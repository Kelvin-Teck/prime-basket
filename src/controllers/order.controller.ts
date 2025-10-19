import { AuthRequest } from "../types";
import { Response } from "express";
import * as  orderService from "../services/order.service"
import * as helpers from "./base.controller";


export const getAllUserOrders = async (req: AuthRequest, res: Response) => {
  try {
    const response = await orderService.getAllUserOrders(req);

    helpers.successResponse(
      res,
      200,
      "All Orders retrieved successfully",
      response
    );
  } catch (error: any) {
    console.error("Get products error:", error);

    helpers.errResponse(
      res,
      error.code,
      "Failed to retrieved All Orders",
      error.message
    );
  }
};

export const getSingleUserOrder = async (req: AuthRequest, res: Response) => {
  try {
    const response = await orderService.getSingleUserOrder(req);

    helpers.successResponse(
      res,
      200,
      "Order retrieved successfully",
      response
    );
  } catch (error: any) {
    console.error("Get products error:", error);

    helpers.errResponse(
      res,
      error.code,
      "Failed to retrieved Order",
      error.message
    );
  }
};


export const placeOrder = async (req: AuthRequest, res: Response) => {
  try {
    const response = await orderService.placeOrder(req);

    helpers.successResponse(res, 201, "Order successfully placed", response);
  } catch (error: any) {
    console.error("Get products error:", error);

    helpers.errResponse(
      res,
      error.code,
      "Failed to retrieved place Order",
      error.message
    );
  }
};
