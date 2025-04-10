import { Request } from "express";

interface CustomRequest extends Request {
  client?: {
    clientIp: string | null;
  };
}

export default CustomRequest;
