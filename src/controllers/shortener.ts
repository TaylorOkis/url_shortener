import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { customAlphabet } from "nanoid";

import db from "@/database/db";
import characters from "@/utils/constants/characters";

const generateShortURL = async (req: Request, res: Response) => {
  const nanoid = customAlphabet(characters, 9);

  const uniqueCode = nanoid().toString();

  await db.url.create({
    data: {
      longUrl: req.body.long_url,
      shortUrl: uniqueCode,
    },
  });

  res.status(StatusCodes.CREATED).json({
    status: "success",
    message: "short url created successfully",
    short_url: `https://localhost:5000/${uniqueCode}`,
  });
};

const getOriginalURL = async (req: Request, res: Response) => {
  res.status(StatusCodes.MOVED_TEMPORARILY).redirect("/dummy_url");
};

export { generateShortURL, getOriginalURL };
