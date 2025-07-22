/*
  Warnings:

  - You are about to drop the column `completedAt` on the `Delivery` table. All the data in the column will be lost.
  - You are about to drop the column `durationMinutes` on the `Delivery` table. All the data in the column will be lost.
  - You are about to drop the column `startedAt` on the `Delivery` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Delivery" DROP COLUMN "completedAt",
DROP COLUMN "durationMinutes",
DROP COLUMN "startedAt",
ADD COLUMN     "completionTime" TIMESTAMP(3),
ADD COLUMN     "estimatedMinutes" DOUBLE PRECISION,
ADD COLUMN     "startTime" TIMESTAMP(3);
