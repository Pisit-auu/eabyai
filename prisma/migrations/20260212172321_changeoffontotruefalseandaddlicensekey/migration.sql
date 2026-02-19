/*
  Warnings:

  - The values [off,on] on the enum `Active` will be removed. If these variants are still used in the database, this will fail.
  - The values [off,on] on the enum `Connect` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Active_new" AS ENUM ('false', 'true');
ALTER TABLE "public"."Model" ALTER COLUMN "active" DROP DEFAULT;
ALTER TABLE "Model" ALTER COLUMN "active" TYPE "Active_new" USING ("active"::text::"Active_new");
ALTER TYPE "Active" RENAME TO "Active_old";
ALTER TYPE "Active_new" RENAME TO "Active";
DROP TYPE "public"."Active_old";
ALTER TABLE "Model" ALTER COLUMN "active" SET DEFAULT 'false';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "Connect_new" AS ENUM ('false', 'true');
ALTER TABLE "public"."TradeAccount" ALTER COLUMN "connect" DROP DEFAULT;
ALTER TABLE "TradeAccount" ALTER COLUMN "connect" TYPE "Connect_new" USING ("connect"::text::"Connect_new");
ALTER TYPE "Connect" RENAME TO "Connect_old";
ALTER TYPE "Connect_new" RENAME TO "Connect";
DROP TYPE "public"."Connect_old";
ALTER TABLE "TradeAccount" ALTER COLUMN "connect" SET DEFAULT 'false';
COMMIT;

-- AlterTable
ALTER TABLE "Model" ALTER COLUMN "active" SET DEFAULT 'false';

-- AlterTable
ALTER TABLE "TradeAccount" ALTER COLUMN "connect" SET DEFAULT 'false';

-- CreateTable
CREATE TABLE "LicenseKey" (
    "id" SERIAL NOT NULL,
    "licensekey" TEXT NOT NULL,
    "valid" BOOLEAN NOT NULL DEFAULT true,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "expireDate" TIMESTAMP(3),
    "platformAccountId" TEXT NOT NULL,
    "modelId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LicenseKey_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "LicenseKey_licensekey_key" ON "LicenseKey"("licensekey");

-- AddForeignKey
ALTER TABLE "LicenseKey" ADD CONSTRAINT "LicenseKey_platformAccountId_fkey" FOREIGN KEY ("platformAccountId") REFERENCES "TradeAccount"("platformAccountId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LicenseKey" ADD CONSTRAINT "LicenseKey_modelId_fkey" FOREIGN KEY ("modelId") REFERENCES "Model"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
