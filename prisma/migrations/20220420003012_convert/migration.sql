/*
  Warnings:

  - Added the required column `crashValue` to the `csgorollCrashHistory` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "csgorollCrashHistory" DROP COLUMN "crashValue",
ADD COLUMN     "crashValue" DOUBLE PRECISION NOT NULL;
