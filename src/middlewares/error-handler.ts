import { StatusCodes } from "http-status-codes";
import { Request, Response, NextFunction } from "express";
import { CustomAPIError, UnprocessableEntityError } from "@/utils/error";

const errorHandler = (
  error: CustomAPIError | UnprocessableEntityError | Error,
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

  if (error instanceof UnprocessableEntityError) {
    customError = {
      statusCode: error.statusCode,
      status: "fail",
      error: error.errors,
    };
  }

  res
    .status(customError.statusCode)
    .json({ status: customError.status, error: customError.error });
};

export default errorHandler;
