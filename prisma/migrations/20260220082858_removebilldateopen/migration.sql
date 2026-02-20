/*
  Warnings:

  - You are about to drop the column `isReadyBill` on the `Bill` table. All the data in the column will be lost.
  - You are about to drop the column `billOpenDate` on the `LicenseKey` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Bill" DROP COLUMN "isReadyBill";

-- AlterTable
ALTER TABLE "LicenseKey" DROP COLUMN "billOpenDate";
