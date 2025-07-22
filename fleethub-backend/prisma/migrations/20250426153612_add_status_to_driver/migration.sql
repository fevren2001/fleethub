/*
  Warnings:

  - You are about to drop the column `completionTime` on the `Delivery` table. All the data in the column will be lost.
  - You are about to drop the column `estimatedMinutes` on the `Delivery` table. All the data in the column will be lost.
  - You are about to drop the column `startTime` on the `Delivery` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Delivery" DROP COLUMN "completionTime",
DROP COLUMN "estimatedMinutes",
DROP COLUMN "startTime",
ADD COLUMN     "completedAt" TIMESTAMP(3),
ADD COLUMN     "durationMinutes" DOUBLE PRECISION,
ADD COLUMN     "startedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Driver" ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'pending';
