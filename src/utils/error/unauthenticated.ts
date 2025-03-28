import { StatusCodes } from "http-status-codes";
import CustomAPIError from "./custom-error";

class UnAuthenticatedError extends CustomAPIError {
  statusCode: StatusCodes;
  constructor(message: string) {
    super(message);
    this.statusCode = StatusCodes.UNAUTHORIZED;
  }
}

export default UnAuthenticatedError;
