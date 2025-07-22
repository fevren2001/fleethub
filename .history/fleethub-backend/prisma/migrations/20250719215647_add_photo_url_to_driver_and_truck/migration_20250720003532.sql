-- AlterTable
ALTER TABLE "Delivery" ADD COLUMN     "type" TEXT NOT NULL DEFAULT 'General';

-- AlterTable
ALTER TABLE "Driver" ADD COLUMN     "photoUrl" TEXT;

-- AlterTable
ALTER TABLE "Truck" ADD COLUMN     "photoUrl" TEXT;
