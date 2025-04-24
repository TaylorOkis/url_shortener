import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import "express-async-errors";
import { rateLimit } from "express-rate-limit";

import errorHandler from "./middlewares/error-handler";
import notFound from "./middlewares/not-found";
import shortenRouter from "./routes/shortener";

dotenv.config();
const app = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 1000,
  standardHeaders: "draft-8",
  legacyHeaders: false,
});

// extra routes
app.use(limiter);
app.use(cors());
app.use(express.json());

// core routes
app.use("/url", shortenRouter);

//Error Middleware
app.use(notFound);
app.use(errorHandler);

export default app;
