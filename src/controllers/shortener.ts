import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { customAlphabet } from "nanoid";

const generateURL = async (req: Request, res: Response) => {
  const characters =
    "0123456789-ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz";
  const nanoid = customAlphabet(characters, 9);

  let uniqueCode = nanoid();

  console.log(uniqueCode);

  res
    .status(StatusCodes.CREATED)
    .json({ short_url: `https://localhost:5000/${uniqueCode}` });
};

const getOriginalURL = async (req: Request, res: Response) => {
  res.status(StatusCodes.MOVED_TEMPORARILY).redirect("/dummy_url");
};

export { generateURL, getOriginalURL };
