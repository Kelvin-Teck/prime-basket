import { Request, Response, NextFunction } from "express";
import APIException from "../errors";

export const exceptionHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error("🔥 Exception caught:", err);

  if (err instanceof APIException) {
    return res.status(err.statusCode).json({
      success: false,
      error: err.message,
      details: err.details || null,
    });
  }

  // Catch-all fallback for unhandled errors
  return res.status(500).json({
    success: false,
    error: "Internal Server Error",
    message:
      process.env.NODE_ENV === "development"
        ? err.message
        : "Something went wrong",
  });
};
