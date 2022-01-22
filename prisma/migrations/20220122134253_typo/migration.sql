/*
  Warnings:

  - You are about to drop the column `totalBalanceBR` on the `balancehistory` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "balancehistory" DROP COLUMN "totalBalanceBR",
ADD COLUMN     "totalBalanceBRL" TEXT;
