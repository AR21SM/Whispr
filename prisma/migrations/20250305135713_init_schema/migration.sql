-- CreateTable
CREATE TABLE "Report" (
    "id" SERIAL NOT NULL,
    "crimeSubcategory" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "personallyWitnessed" BOOLEAN NOT NULL,
    "location" TEXT NOT NULL,
    "tokenStake" INTEGER NOT NULL,
    "occurrenceDate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "solved" BOOLEAN NOT NULL DEFAULT false,
    "tipScore" INTEGER NOT NULL DEFAULT 0,
    "userId" INTEGER,
    CONSTRAINT "Report_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;