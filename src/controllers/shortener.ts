import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

const generateURL = async (req: Request, res: Response) => {
  res
    .status(StatusCodes.CREATED)
    .json({ short_url: "https://tinyurl.com/YImmdfwslfnw" });
};

const getOriginalURL = async (req: Request, res: Response) => {
  res.status(StatusCodes.MOVED_TEMPORARILY).redirect("/dummy_url");
};

export { generateURL, getOriginalURL };
