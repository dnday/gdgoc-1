-- AlterTable
ALTER TABLE "Application" ADD COLUMN     "userId" TEXT;

-- AlterTable
ALTER TABLE "Job" ADD COLUMN     "company" TEXT,
ADD COLUMN     "location" TEXT;
