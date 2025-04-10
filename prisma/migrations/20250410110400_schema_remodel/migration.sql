/*
  Warnings:

  - You are about to drop the `Url` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "Browser" AS ENUM ('CHROME', 'FIREFOX', 'SAFARI', 'EDGE', 'OPERA', 'OTHER');

-- CreateEnum
CREATE TYPE "OS" AS ENUM ('WINDOWS', 'MACOS', 'LINUX', 'IOS', 'ANDROID', 'OTHER');

-- CreateEnum
CREATE TYPE "DeviceType" AS ENUM ('MOBILE', 'TABLET', 'DESKTOP', 'OTHER');

-- DropTable
DROP TABLE "Url";

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShortenedURL" (
    "id" TEXT NOT NULL,
    "shortCode" TEXT NOT NULL,
    "longUrl" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3),
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "clickCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT,

    CONSTRAINT "ShortenedURL_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClickEvent" (
    "id" TEXT NOT NULL,
    "timeStamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "referrer" TEXT,
    "country" TEXT,
    "city" TEXT,
    "browser" "Browser",
    "os" "OS",
    "deviceType" "DeviceType",
    "ipAddress" TEXT,
    "shortUrlId" TEXT NOT NULL,

    CONSTRAINT "ClickEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_email_createdAt_idx" ON "User"("email", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "ShortenedURL_shortCode_key" ON "ShortenedURL"("shortCode");

-- CreateIndex
CREATE INDEX "ShortenedURL_shortCode_idx" ON "ShortenedURL"("shortCode");

-- CreateIndex
CREATE INDEX "ShortenedURL_userId_idx" ON "ShortenedURL"("userId");

-- CreateIndex
CREATE INDEX "ShortenedURL_createdAt_idx" ON "ShortenedURL"("createdAt");

-- CreateIndex
CREATE INDEX "ShortenedURL_expiresAt_idx" ON "ShortenedURL"("expiresAt");

-- CreateIndex
CREATE INDEX "ShortenedURL_clickCount_idx" ON "ShortenedURL"("clickCount");

-- CreateIndex
CREATE INDEX "ClickEvent_shortUrlId_idx" ON "ClickEvent"("shortUrlId");

-- CreateIndex
CREATE INDEX "ClickEvent_timeStamp_idx" ON "ClickEvent"("timeStamp");

-- CreateIndex
CREATE INDEX "ClickEvent_country_idx" ON "ClickEvent"("country");

-- CreateIndex
CREATE INDEX "ClickEvent_browser_idx" ON "ClickEvent"("browser");

-- CreateIndex
CREATE INDEX "ClickEvent_os_idx" ON "ClickEvent"("os");

-- CreateIndex
CREATE INDEX "ClickEvent_deviceType_idx" ON "ClickEvent"("deviceType");

-- CreateIndex
CREATE INDEX "ClickEvent_shortUrlId_timeStamp_idx" ON "ClickEvent"("shortUrlId", "timeStamp");

-- AddForeignKey
ALTER TABLE "ShortenedURL" ADD CONSTRAINT "ShortenedURL_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClickEvent" ADD CONSTRAINT "ClickEvent_shortUrlId_fkey" FOREIGN KEY ("shortUrlId") REFERENCES "ShortenedURL"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
