import CustomRequest from "@/types/types";
import { Request } from "express";

const getClientIp = (req: CustomRequest): string | null => {
  const forwarded = req.headers["x-forwarded-for"];
  const ip =
    typeof forwarded === "string"
      ? forwarded.split(",")[0]
      : req.socket?.remoteAddress || null;

  return ip;
};

export default getClientIp;
