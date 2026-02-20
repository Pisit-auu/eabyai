/*
  Warnings:

  - You are about to drop the column `totalAmount` on the `Bill` table. All the data in the column will be lost.
  - You are about to drop the column `billId` on the `LicenseKey` table. All the data in the column will be lost.
  - Added the required column `commission` to the `Bill` table without a default value. This is not possible if the table is not empty.
  - Added the required column `exirelicendate` to the `Bill` table without a default value. This is not possible if the table is not empty.
  - Added the required column `licenseId` to the `Bill` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "LicenseKey" DROP CONSTRAINT "LicenseKey_billId_fkey";

-- DropIndex
DROP INDEX "LicenseKey_billId_key";

-- AlterTable
ALTER TABLE "Bill" DROP COLUMN "totalAmount",
ADD COLUMN     "commission" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "exirelicendate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "licenseId" INTEGER NOT NULL,
ADD COLUMN     "profit" DOUBLE PRECISION NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "LicenseKey" DROP COLUMN "billId";

-- AddForeignKey
ALTER TABLE "Bill" ADD CONSTRAINT "Bill_licenseId_fkey" FOREIGN KEY ("licenseId") REFERENCES "LicenseKey"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
