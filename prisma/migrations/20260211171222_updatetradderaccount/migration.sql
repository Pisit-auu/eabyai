/*
  Warnings:

  - Made the column `email` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "Connect" AS ENUM ('off', 'on');

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "email" SET NOT NULL;

-- CreateTable
CREATE TABLE "TradeAccount" (
    "id" SERIAL NOT NULL,
    "platformAccountId" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "connect" "Connect" NOT NULL DEFAULT 'off',
    "email" TEXT NOT NULL,

    CONSTRAINT "TradeAccount_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TradeAccount_platformAccountId_key" ON "TradeAccount"("platformAccountId");

-- AddForeignKey
ALTER TABLE "TradeAccount" ADD CONSTRAINT "TradeAccount_email_fkey" FOREIGN KEY ("email") REFERENCES "User"("email") ON DELETE RESTRICT ON UPDATE CASCADE;
