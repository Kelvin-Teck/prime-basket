import { Response } from "express"; // ✅ Import Response from express
import { AuthRequest } from "../types";
import * as helpers from "./base.controller";
import * as authService from "../services/auth.service";

export const register = async (req: AuthRequest, res: Response) => {
    try {
    const response = await authService.register(req);
    helpers.successResponse(res, 201, "User registered successfully", response);
  } catch (error :any ) {
    console.error("Register error:", error);
    helpers.errResponse(res, error.code ,"Failed to register this user", error.message);
  }
};

export const login = async (req: AuthRequest, res: Response) => {
  try {
    const response = await authService.login(req);
    helpers.successResponse(res, 200, "Login successful", response);
  } catch (error: any) {
    console.error("Login error:", error);
    helpers.errResponse(res, error.code,"Failed to login", error.message);
  }
};
