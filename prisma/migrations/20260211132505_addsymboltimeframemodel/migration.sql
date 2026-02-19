-- CreateEnum
CREATE TYPE "Active" AS ENUM ('off', 'on');

-- CreateTable
CREATE TABLE "Model" (
    "id" SERIAL NOT NULL,
    "nameEA" TEXT NOT NULL,
    "nameSymbol" TEXT NOT NULL,
    "timeframeName" TEXT NOT NULL,
    "filePath" TEXT NOT NULL,
    "commission" DOUBLE PRECISION NOT NULL,
    "active" "Active" NOT NULL DEFAULT 'off',
    "versionName" TEXT NOT NULL,
    "downloadCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Model_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Symbol" (
    "id" SERIAL NOT NULL,
    "nameSymbol" TEXT NOT NULL,

    CONSTRAINT "Symbol_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Timeframe" (
    "id" SERIAL NOT NULL,
    "nametimeframe" TEXT NOT NULL,

    CONSTRAINT "Timeframe_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Model_nameEA_key" ON "Model"("nameEA");

-- CreateIndex
CREATE UNIQUE INDEX "Symbol_nameSymbol_key" ON "Symbol"("nameSymbol");

-- CreateIndex
CREATE UNIQUE INDEX "Timeframe_nametimeframe_key" ON "Timeframe"("nametimeframe");

-- AddForeignKey
ALTER TABLE "Model" ADD CONSTRAINT "Model_nameSymbol_fkey" FOREIGN KEY ("nameSymbol") REFERENCES "Symbol"("nameSymbol") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Model" ADD CONSTRAINT "Model_timeframeName_fkey" FOREIGN KEY ("timeframeName") REFERENCES "Timeframe"("nametimeframe") ON DELETE RESTRICT ON UPDATE CASCADE;
