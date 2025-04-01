import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import "express-async-errors";
import errorHandler from "./middlewares/error-handler";
import notFound from "./middlewares/not-found";

dotenv.config();
const app = express();

//
app.use(express.json());
app.use(cors());

//Error Middleware
app.use(notFound);
app.use(errorHandler);

export default app;
