import { validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";
import { UnprocessableEntityError } from "@/utils/error";

const validationMiddleWare = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    throw new UnprocessableEntityError(result.array());
  }
  next();
};

export default validationMiddleWare;
