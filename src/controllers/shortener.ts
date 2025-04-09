import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { customAlphabet } from "nanoid";
import he from "he";

import db from "@/database/db";
import characters from "@/utils/constants/characters";
import { BadRequestError, NotFoundError } from "@/utils/error";

const generateShortURL = async (req: Request, res: Response) => {
  const longUrl = req.body.long_url;

  const existingLongUrl = await db.url.findUnique({
    where: { longUrl: longUrl },
  });

  if (existingLongUrl) {
    throw new BadRequestError("Long url already exists");
  }

  const nanoid = customAlphabet(characters, 9);

  const uniqueCode = nanoid().toString();

  await db.url.create({
    data: {
      longUrl: longUrl,
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
  const shortUrl = req.params.short_url;

  const existingUrl = await db.url.findUnique({
    where: {
      shortUrl: shortUrl,
    },
    select: {
      id: true,
      longUrl: true,
    },
  });

  if (!existingUrl) {
    throw new NotFoundError("short url was not found");
  }

  console.log(existingUrl.id);

  await db.url.update({
    where: { id: existingUrl.id },
    data: { clicks: { increment: 1 } },
  });

  const longUrl = he.decode(existingUrl.longUrl);

  res.status(StatusCodes.MOVED_TEMPORARILY).redirect(longUrl);
};

export { generateShortURL, getOriginalURL };
