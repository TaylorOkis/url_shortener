import CustomRequest from "@/types/types";
import getClientIp from "@/utils/IP/getIp";
import { NextFunction, Request, Response } from "express";

const logIPMiddleware = (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  req.client = { clientIp: getClientIp(req) };
  next();
};

export default logIPMiddleware;
