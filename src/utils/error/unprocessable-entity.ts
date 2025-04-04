import { StatusCodes } from "http-status-codes";
import CustomAPIError from "./custom-error";

class UnprocessableEntityError extends CustomAPIError {
  statusCode: StatusCodes;
  errors: any;
  constructor(message: Object) {
    super("Unprocessable Entity");
    this.statusCode = StatusCodes.UNPROCESSABLE_ENTITY;
    this.errors = message;
  }
}

export default UnprocessableEntityError;
