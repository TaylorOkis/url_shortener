import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { customAlphabet } from "nanoid";
import he from "he";

import db from "@/database/db";
import redisClient from "@/database/redisDB";
import characters from "@/utils/constants/characters";
import { BadRequestError, NotFoundError } from "@/utils/error";
import CustomRequest from "@/types/types";
import getIpInfo from "@/utils/IP/getIpInfo";
import isLocalIPAddress from "@/utils/IP/localIP";
import getUserAgentData from "@/utils/IP/user-agent-data";

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

const getOriginalURL = async (req: CustomRequest, res: Response) => {
  const shortCode = req.params.short_code;
  const ip = req.client?.clientIp;
  const userAgent = req.get("user-agent");
  let existingUrl = null;

  const key = "shorturl:" + shortCode;
  const value = await redisClient.get(key);

  if (value) {
    existingUrl = JSON.parse(value);
  } else {
    existingUrl = await db.shortenedURL.findUnique({
      where: {
        shortCode,
      },
      select: {
        id: true,
        longUrl: true,
        expiresAt: true,
      },
    });

    if (!existingUrl) {
      throw new NotFoundError("short url was not found");
    }

    await redisClient.set(key, JSON.stringify(existingUrl), {
      EX: 300,
    });
  }

  let ipInfo = {} as any;

  if (ip && !isLocalIPAddress(ip)) {
    ipInfo = await getIpInfo(ip!);
  }

  const { browserEnum, deviceEnum, osEnum } = getUserAgentData(userAgent);

  await db.$transaction(async (tx) => {
    await tx.clickEvent.create({
      data: {
        shortUrlId: existingUrl.id,
        ipAddress: ip,
        browser: browserEnum,
        os: osEnum,
        deviceType: deviceEnum,
        country: ipInfo.country,
        city: ipInfo.city,
      },
    });

    await tx.shortenedURL.update({
      where: { id: existingUrl.id },
      data: { clickCount: { increment: 1 } },
    });
  });

  const longUrl = he.decode(existingUrl.longUrl);

  res.status(StatusCodes.OK).json({ status: "success", message: longUrl });
  // res.status(StatusCodes.MOVED_TEMPORARILY).redirect(longUrl);
};

export { generateShortURL, getOriginalURL };
