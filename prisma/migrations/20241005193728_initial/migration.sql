/*
  Warnings:

  - You are about to drop the column `stream` on the `ChatSession` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ChatSession" DROP COLUMN "stream",
ALTER COLUMN "name" DROP NOT NULL;

-- CreateTable
CREATE TABLE "Help" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Help_pkey" PRIMARY KEY ("id")
);
