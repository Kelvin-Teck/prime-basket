import { Response } from "express";

export const errResponse = (
  res: Response,
  code: number = 500,
  msg = "",
  data: any = {}
) => {
  return res.status(code).json({
    status: "ERROR",
    message: msg,
    data,
  });
};

export const successResponse = (
  res: Response,
  code: number = 200,
  msg = "",
  data: any = {}
) => {
  return res.status(code).json({
    status: "SUCCESS",
    message: msg,
    data,
  });
};
