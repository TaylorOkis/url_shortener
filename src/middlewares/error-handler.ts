import { StatusCodes } from "http-status-codes";
import { Request, Response, NextFunction } from "express";
import { CustomAPIError } from "@/utils/error";

const errorHandler = (
  error: CustomAPIError | Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let customError = {
    statusCode:
      error instanceof CustomAPIError
        ? error.statusCode
        : StatusCodes.INTERNAL_SERVER_ERROR,
    status: "fail",
    error: error.message || "Something went wrong, please try again later",
  };

  res
    .status(customError.statusCode)
    .json({ status: customError.error, error: customError.error });
};

export default errorHandler;
