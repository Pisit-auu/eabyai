-- DropForeignKey
ALTER TABLE "Bill" DROP CONSTRAINT "Bill_licenseId_fkey";

-- AlterTable
ALTER TABLE "Bill" ALTER COLUMN "licenseId" SET DATA TYPE TEXT;

-- AddForeignKey
ALTER TABLE "Bill" ADD CONSTRAINT "Bill_licenseId_fkey" FOREIGN KEY ("licenseId") REFERENCES "LicenseKey"("licensekey") ON DELETE RESTRICT ON UPDATE CASCADE;
