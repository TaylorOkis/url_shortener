import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import "express-async-errors";
import errorHandler from "./middlewares/error-handler";
import notFound from "./middlewares/not-found";

dotenv.config();
const PORT = process.env.PORT || 5000;
const app = express();

//
app.use(express.json());
app.use(cors());

//Error Middleware
app.use(notFound);
app.use(errorHandler);

const start = () => {
  try {
    app.listen(PORT, () => {
      console.log(`App is running on port ${PORT}...`);
    });
  } catch (error) {
    console.log(
      `An error occurred when initializing the app.\n Error: ${error} `
    );
  }
};

start();
