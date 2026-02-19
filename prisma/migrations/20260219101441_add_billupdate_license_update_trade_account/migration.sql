-- AlterTable
ALTER TABLE "LicenseKey" ADD COLUMN     "billId" INTEGER,
ADD COLUMN     "cancelReason" TEXT,
ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "TradeAccount" ADD COLUMN     "disconnectedAt" TIMESTAMP(3),
ADD COLUMN     "isDisconnected" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "Bill" (
    "id" SERIAL NOT NULL,
    "isPaid" BOOLEAN NOT NULL DEFAULT false,
    "isReadyBill" BOOLEAN NOT NULL DEFAULT false,
    "totalAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Bill_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "LicenseKey" ADD CONSTRAINT "LicenseKey_billId_fkey" FOREIGN KEY ("billId") REFERENCES "Bill"("id") ON DELETE SET NULL ON UPDATE CASCADE;
