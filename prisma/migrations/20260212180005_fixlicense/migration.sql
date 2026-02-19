/*
  Warnings:

  - You are about to drop the column `modelId` on the `LicenseKey` table. All the data in the column will be lost.
  - Added the required column `nameEA` to the `LicenseKey` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "LicenseKey" DROP CONSTRAINT "LicenseKey_modelId_fkey";

-- AlterTable
ALTER TABLE "LicenseKey" DROP COLUMN "modelId",
ADD COLUMN     "nameEA" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "LicenseKey" ADD CONSTRAINT "LicenseKey_nameEA_fkey" FOREIGN KEY ("nameEA") REFERENCES "Model"("nameEA") ON DELETE RESTRICT ON UPDATE CASCADE;
