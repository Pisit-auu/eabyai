/*
  Warnings:

  - A unique constraint covering the columns `[billId]` on the table `LicenseKey` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "LicenseKey_billId_key" ON "LicenseKey"("billId");
