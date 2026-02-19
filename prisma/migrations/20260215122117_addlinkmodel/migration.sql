-- CreateTable
CREATE TABLE "linkModel" (
    "id" SERIAL NOT NULL,
    "namefile" TEXT NOT NULL,
    "Pathname" TEXT NOT NULL,

    CONSTRAINT "linkModel_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "linkModel_namefile_key" ON "linkModel"("namefile");
