-- CreateEnum
CREATE TYPE "Platform" AS ENUM ('PC', 'PLAYSTATION_5', 'NINTENDO_SWITCH_2');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('WISHLIST', 'BACKLOG', 'PLAYING', 'SHELVED', 'COMPLETED', 'DROPPED');

-- CreateTable
CREATE TABLE "Game" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "metacriticScore" INTEGER NOT NULL,
    "released" TIMESTAMP(3) NOT NULL,
    "backgroundImage" TEXT NOT NULL,
    "userRating" DECIMAL(65,30),
    "platform" "Platform" NOT NULL DEFAULT 'PC',
    "status" "Status" NOT NULL DEFAULT 'WISHLIST',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Game_pkey" PRIMARY KEY ("id")
);
