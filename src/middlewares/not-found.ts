import { Request, Response, NextFunction } from "express";
import { NotFoundError } from "@/utils/error";

const notFound = (req: Request, res: Response, next: NextFunction) =>
  next(new NotFoundError("Route not Found"));

export default notFound;
