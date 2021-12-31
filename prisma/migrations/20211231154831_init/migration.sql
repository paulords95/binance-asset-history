-- CreateTable
CREATE TABLE "balancehistory" (
    "id" SERIAL NOT NULL,
    "data" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "asset" VARCHAR(255) NOT NULL,
    "balance" TEXT,
    "balanceUSD" TEXT,
    "balanceBRL" TEXT,

    CONSTRAINT "balancehistory_pkey" PRIMARY KEY ("id")
);
