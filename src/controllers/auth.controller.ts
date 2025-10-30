import { Response } from "express"; // ✅ Import Response from express
import { AuthRequest } from "../types";
import * as helpers from "./base.controller";
import * as authService from "../services/auth.service";
import APIException from "../errors";

export const register = async (req: AuthRequest, res: Response) => {
  try {
    const response = await authService.register(req);

    helpers.successResponse(res, 201, "User registered successfully", response);
  } catch (error: unknown) {
    if (error instanceof APIException) {
      helpers.errResponse(
        res,
        error.statusCode,
        "Failed to register this user",
        error.message
      );
    }

    helpers.errResponse(res, 500, "Internal Server Error");
  }
};

export const login = async (req: AuthRequest, res: Response) => {
  try {
    const response = await authService.login(req);

    helpers.successResponse(res, 200, "Login successful", response);
  } catch (error: unknown) {
    if (error instanceof APIException) {
      helpers.errResponse(
        res,
        error.statusCode,
        "Failed to login",
        error.message
      );
    }

    helpers.errResponse(res, 500, "Internal Server Error");
  }
};
