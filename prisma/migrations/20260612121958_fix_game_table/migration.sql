/*
  Warnings:

  - You are about to drop the column `description` on the `Game` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Game" DROP COLUMN "description",
ADD COLUMN     "genres" TEXT[],
ADD COLUMN     "playtime" INTEGER,
ALTER COLUMN "metacriticScore" DROP NOT NULL,
ALTER COLUMN "released" DROP NOT NULL,
ALTER COLUMN "backgroundImage" DROP NOT NULL;
