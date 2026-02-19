/*
  Warnings:

  - You are about to drop the column `platform` on the `TradeAccount` table. All the data in the column will be lost.
  - Added the required column `PlatformName` to the `TradeAccount` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Model" ADD COLUMN     "PlatformName" TEXT NOT NULL DEFAULT 'MT5';

-- AlterTable
ALTER TABLE "TradeAccount" DROP COLUMN "platform",
ADD COLUMN     "PlatformName" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Platform" (
    "id" SERIAL NOT NULL,
    "nameplatform" TEXT NOT NULL DEFAULT 'MT5',

    CONSTRAINT "Platform_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Platform_nameplatform_key" ON "Platform"("nameplatform");

-- AddForeignKey
ALTER TABLE "TradeAccount" ADD CONSTRAINT "TradeAccount_PlatformName_fkey" FOREIGN KEY ("PlatformName") REFERENCES "Platform"("nameplatform") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Model" ADD CONSTRAINT "Model_PlatformName_fkey" FOREIGN KEY ("PlatformName") REFERENCES "Platform"("nameplatform") ON DELETE RESTRICT ON UPDATE CASCADE;
