/*
  Warnings:

  - You are about to drop the column `backgroundImage` on the `Game` table. All the data in the column will be lost.
  - You are about to drop the column `metacriticScore` on the `Game` table. All the data in the column will be lost.
  - You are about to drop the column `playtime` on the `Game` table. All the data in the column will be lost.
  - You are about to drop the column `rawgId` on the `Game` table. All the data in the column will be lost.
  - You are about to drop the column `released` on the `Game` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Game_rawgId_key";

-- AlterTable
ALTER TABLE "Game" DROP COLUMN "backgroundImage",
DROP COLUMN "metacriticScore",
DROP COLUMN "playtime",
DROP COLUMN "rawgId",
DROP COLUMN "released",
ADD COLUMN     "cover" TEXT,
ADD COLUMN     "genres" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "rating" INTEGER,
ADD COLUMN     "release_date" TIMESTAMP(3),
ALTER COLUMN "id" DROP DEFAULT;
DROP SEQUENCE "Game_id_seq";
