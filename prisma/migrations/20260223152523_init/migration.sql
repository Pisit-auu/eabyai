-- CreateEnum
CREATE TYPE "role" AS ENUM ('admin', 'user');

-- CreateEnum
CREATE TYPE "Connect" AS ENUM ('false', 'true');

-- CreateEnum
CREATE TYPE "Active" AS ENUM ('false', 'true');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "role" "role" DEFAULT 'user',

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TradeAccount" (
    "id" SERIAL NOT NULL,
    "platformAccountId" TEXT NOT NULL,
    "InvestorPassword" TEXT NOT NULL,
    "Server" TEXT,
    "Leverage" TEXT,
    "fullname" TEXT,
    "connect" "Connect" NOT NULL DEFAULT 'false',
    "email" TEXT NOT NULL,
    "PlatformName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isDisconnected" BOOLEAN NOT NULL DEFAULT false,
    "disconnectedAt" TIMESTAMP(3),

    CONSTRAINT "TradeAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Model" (
    "id" SERIAL NOT NULL,
    "nameEA" TEXT NOT NULL,
    "nameSymbol" TEXT NOT NULL,
    "timeframeName" TEXT NOT NULL,
    "PlatformName" TEXT NOT NULL,
    "filePath" TEXT NOT NULL,
    "commission" DOUBLE PRECISION NOT NULL,
    "active" "Active" NOT NULL DEFAULT 'false',
    "downloadCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Model_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bill" (
    "id" SERIAL NOT NULL,
    "isPaid" BOOLEAN NOT NULL DEFAULT false,
    "expire" BOOLEAN NOT NULL DEFAULT false,
    "profit" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "exirelicendate" TIMESTAMP(3) NOT NULL,
    "commission" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "licenseId" TEXT NOT NULL,
    "email" TEXT,

    CONSTRAINT "Bill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LicenseKey" (
    "id" SERIAL NOT NULL,
    "licensekey" TEXT NOT NULL,
    "expire" BOOLEAN NOT NULL DEFAULT false,
    "email" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "expireDate" TIMESTAMP(3),
    "platformAccountId" TEXT NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "deletedAt" TIMESTAMP(3),
    "cancelReason" TEXT,
    "nameEA" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LicenseKey_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Platform" (
    "id" SERIAL NOT NULL,
    "nameplatform" TEXT NOT NULL DEFAULT 'MT5',

    CONSTRAINT "Platform_pkey" PRIMARY KEY ("id")
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

-- CreateTable
CREATE TABLE "linkModel" (
    "id" SERIAL NOT NULL,
    "namefile" TEXT NOT NULL,
    "Pathname" TEXT NOT NULL,

    CONSTRAINT "linkModel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "TradeAccount_platformAccountId_key" ON "TradeAccount"("platformAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Model_nameEA_key" ON "Model"("nameEA");

-- CreateIndex
CREATE UNIQUE INDEX "LicenseKey_licensekey_key" ON "LicenseKey"("licensekey");

-- CreateIndex
CREATE UNIQUE INDEX "Platform_nameplatform_key" ON "Platform"("nameplatform");

-- CreateIndex
CREATE UNIQUE INDEX "Symbol_nameSymbol_key" ON "Symbol"("nameSymbol");

-- CreateIndex
CREATE UNIQUE INDEX "Timeframe_nametimeframe_key" ON "Timeframe"("nametimeframe");

-- CreateIndex
CREATE UNIQUE INDEX "linkModel_namefile_key" ON "linkModel"("namefile");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- AddForeignKey
ALTER TABLE "TradeAccount" ADD CONSTRAINT "TradeAccount_email_fkey" FOREIGN KEY ("email") REFERENCES "User"("email") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TradeAccount" ADD CONSTRAINT "TradeAccount_PlatformName_fkey" FOREIGN KEY ("PlatformName") REFERENCES "Platform"("nameplatform") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Model" ADD CONSTRAINT "Model_nameSymbol_fkey" FOREIGN KEY ("nameSymbol") REFERENCES "Symbol"("nameSymbol") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Model" ADD CONSTRAINT "Model_timeframeName_fkey" FOREIGN KEY ("timeframeName") REFERENCES "Timeframe"("nametimeframe") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Model" ADD CONSTRAINT "Model_PlatformName_fkey" FOREIGN KEY ("PlatformName") REFERENCES "Platform"("nameplatform") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bill" ADD CONSTRAINT "Bill_licenseId_fkey" FOREIGN KEY ("licenseId") REFERENCES "LicenseKey"("licensekey") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LicenseKey" ADD CONSTRAINT "LicenseKey_platformAccountId_fkey" FOREIGN KEY ("platformAccountId") REFERENCES "TradeAccount"("platformAccountId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LicenseKey" ADD CONSTRAINT "LicenseKey_nameEA_fkey" FOREIGN KEY ("nameEA") REFERENCES "Model"("nameEA") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
