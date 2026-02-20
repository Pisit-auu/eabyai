/*
  Warnings:

  - You are about to drop the column `valid` on the `LicenseKey` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "LicenseKey" DROP COLUMN "valid",
ADD COLUMN     "expire" BOOLEAN NOT NULL DEFAULT false;
