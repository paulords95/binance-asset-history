-- CreateTable
CREATE TABLE "csgorollCrashHistory" (
    "id" SERIAL NOT NULL,
    "data" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "crashValue" TEXT,

    CONSTRAINT "csgorollCrashHistory_pkey" PRIMARY KEY ("id")
);
