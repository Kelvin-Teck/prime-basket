import { AuthRequest } from "../types";
import { Response, NextFunction, RequestHandler } from "express";

export const validate = (
  schema: any,
  property: "body" | "params" | "query" = "body"
): RequestHandler => {
  return (req:AuthRequest, res:Response, next:NextFunction) => {
    const { error } = schema.validate(req[property], { abortEarly: false });

    if (error) {
      const details = error.details.map((detail: any) => ({
        field: detail.path.join("."),
        message: detail.message,
        value: detail.context?.value,
      }));

      return res.status(400).json({ error: "Validation failed", details });
    }

    next();
  };
};
