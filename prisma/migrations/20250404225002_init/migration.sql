-- CreateTable
CREATE TABLE "Url" (
    "id" TEXT NOT NULL,
    "longUrl" TEXT NOT NULL,
    "shortUrl" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Url_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Url_longUrl_key" ON "Url"("longUrl");

-- CreateIndex
CREATE UNIQUE INDEX "Url_shortUrl_key" ON "Url"("shortUrl");
