import express from "express";

import { generateURL, getOriginalURL } from "@/controllers/shortener";

const shortenRouter = express.Router();

shortenRouter.post("/shorten", generateURL);
shortenRouter.get("/:id", getOriginalURL);

export default shortenRouter;
