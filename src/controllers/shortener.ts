import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { customAlphabet } from "nanoid";
import he from "he";

import db from "@/database/db";
import characters from "@/utils/constants/characters";
import { BadRequestError, NotFoundError } from "@/utils/error";

const generateShortURL = async (req: Request, res: Response) => {
  const longUrl = req.body.long_url;
  const expiresAt = req.body?.expiresAt ? new Date(req.body.expiresAt) : null;

  const existingLongUrl = await db.shortenedURL.findFirst({
    where: { AND: [{ longUrl: longUrl }, { enabled: true }] },
  });

  if (existingLongUrl) {
    throw new BadRequestError("Long url already exists and active");
  }

  const nanoid = customAlphabet(characters, 9);

  const uniqueCode = nanoid().toString();

  await db.shortenedURL.create({
    data: {
      longUrl: longUrl,
      shortCode: uniqueCode,
      expiresAt: expiresAt,
    },
  });

  res.status(StatusCodes.CREATED).json({
    status: "success",
    message: "short url created successfully",
    short_url: `https://localhost:5000/${uniqueCode}`,
  });
};

const getOriginalURL = async (req: Request, res: Response) => {
  const shortCode = req.params.short_code;

  const existingUrl = await db.shortenedURL.findUnique({
    where: {
      shortCode,
    },
    select: {
      id: true,
      longUrl: true,
    },
  });

  if (!existingUrl) {
    throw new NotFoundError("short url was not found");
  }

  await db.shortenedURL.update({
    where: { id: existingUrl.id },
    data: { clickCount: { increment: 1 } },
  });

  const longUrl = he.decode(existingUrl.longUrl);

  res.status(StatusCodes.MOVED_TEMPORARILY).redirect(longUrl);
};

export { generateShortURL, getOriginalURL };
