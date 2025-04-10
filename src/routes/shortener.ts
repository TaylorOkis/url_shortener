import express from "express";

import { generateShortURL, getOriginalURL } from "@/controllers/shortener";
import {
  generateURLValidator,
  getOriginalURLValidator,
} from "@/utils/validator/validators";
import validationMiddleWare from "@/middlewares/validation";
import logIPMiddleware from "@/middlewares/logIP";

const shortenRouter = express.Router();

shortenRouter.get(
  "/:short_code",
  getOriginalURLValidator,
  validationMiddleWare,
  logIPMiddleware,
  getOriginalURL
);
shortenRouter.post(
  "/shorten",
  generateURLValidator,
  validationMiddleWare,
  generateShortURL
);

export default shortenRouter;
