import express from "express";

import { generateURL, getOriginalURL } from "@/controllers/shortener";
import {
  generateURLValidator,
  getOriginalURLValidator,
} from "@/utils/validator/validators";
import validationMiddleWare from "@/middlewares/validation";

const shortenRouter = express.Router();

shortenRouter.get(
  "/:short_url",
  getOriginalURLValidator,
  validationMiddleWare,
  getOriginalURL
);
shortenRouter.post(
  "/shorten",
  generateURLValidator,
  validationMiddleWare,
  generateURL
);

export default shortenRouter;
