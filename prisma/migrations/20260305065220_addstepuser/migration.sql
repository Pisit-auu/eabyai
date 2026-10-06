-- AlterTable
ALTER TABLE "User" ADD COLUMN     "setupProgress" INTEGER[] DEFAULT ARRAY[]::INTEGER[];
