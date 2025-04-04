class CustomAPIError extends Error {
  statusCode: any;
  constructor(message: any) {
    super(message);
  }
}

export default CustomAPIError;
