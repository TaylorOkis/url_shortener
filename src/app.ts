import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import "express-async-errors";
import errorHandler from "./middlewares/error-handler";
import notFound from "./middlewares/not-found";
import shortenRouter from "./routes/shortener";

dotenv.config();
const app = express();

// extra routes
app.use(express.json());
app.use(cors());

// core routes
app.use("/url", shortenRouter);

//Error Middleware
app.use(notFound);
app.use(errorHandler);

export default app;
