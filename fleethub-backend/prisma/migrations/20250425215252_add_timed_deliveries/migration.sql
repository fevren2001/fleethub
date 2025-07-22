-- AlterTable
ALTER TABLE "Delivery" ADD COLUMN     "completedAt" TIMESTAMP(3),
ADD COLUMN     "durationMinutes" DOUBLE PRECISION,
ADD COLUMN     "expectedCompletionTime" TIMESTAMP(3),
ADD COLUMN     "startedAt" TIMESTAMP(3);
