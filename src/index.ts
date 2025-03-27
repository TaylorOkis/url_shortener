import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import "express-async-errors";

dotenv.config();
const PORT = process.env.PORT || 5000;
const app = express();

app.use(express.json());
app.use(cors());

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
