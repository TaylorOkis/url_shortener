import { StatusCodes } from "http-status-codes";
import CustomAPIError from "./custom-error";

class UnAuthorizedError extends CustomAPIError {
  statusCode: StatusCodes;
  constructor(message: string) {
    super(message);
    this.statusCode = StatusCodes.FORBIDDEN;
  }
}

export default UnAuthorizedError;
