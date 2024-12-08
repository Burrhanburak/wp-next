/*
  Warnings:

  - You are about to drop the column `backupCodes` on the `Admin` table. All the data in the column will be lost.
  - You are about to drop the column `twoFactorSecret` on the `Admin` table. All the data in the column will be lost.
  - You are about to drop the column `ip` on the `AdminSession` table. All the data in the column will be lost.
  - You are about to drop the column `lastActiveAt` on the `AdminSession` table. All the data in the column will be lost.
  - You are about to drop the column `userAgent` on the `AdminSession` table. All the data in the column will be lost.
  - You are about to drop the column `unblockedAt` on the `BlockedIP` table. All the data in the column will be lost.
  - You are about to drop the column `activity` on the `UserActivity` table. All the data in the column will be lost.
  - You are about to drop the column `device` on the `UserActivity` table. All the data in the column will be lost.
  - You are about to drop the column `ip` on the `UserActivity` table. All the data in the column will be lost.
  - You are about to drop the `AdminLoginAttempt` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AdminRateLimit` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AdminSecurityLog` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PasswordResetToken` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TwoFactorToken` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `VerificationToken` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `updatedAt` to the `AdminSession` table without a default value. This is not possible if the table is not empty.
  - Added the required column `action` to the `UserActivity` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "AdminLoginAttempt" DROP CONSTRAINT "AdminLoginAttempt_adminId_fkey";

-- DropForeignKey
ALTER TABLE "AdminSecurityLog" DROP CONSTRAINT "AdminSecurityLog_adminId_fkey";

-- DropForeignKey
ALTER TABLE "Template" DROP CONSTRAINT "Template_userId_fkey";

-- DropIndex
DROP INDEX "AdminVerification_adminId_key";

-- AlterTable
ALTER TABLE "Admin" DROP COLUMN "backupCodes",
DROP COLUMN "twoFactorSecret",
ADD COLUMN     "verified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "verifiedAt" TIMESTAMP(3),
ALTER COLUMN "image" SET DEFAULT '/images/default-user.jpg';

-- AlterTable
ALTER TABLE "AdminLog" ADD COLUMN     "ip" TEXT,
ADD COLUMN     "userAgent" TEXT,
ALTER COLUMN "details" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "AdminSession" DROP COLUMN "ip",
DROP COLUMN "lastActiveAt",
DROP COLUMN "userAgent",
ADD COLUMN     "callbackUrl" TEXT,
ADD COLUMN     "sessionData" JSONB,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "AdminVerification" ADD COLUMN     "verified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "verifiedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "BlockedIP" DROP COLUMN "unblockedAt",
ADD COLUMN     "unblockAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Session" ADD COLUMN     "callbackUrl" TEXT;

-- AlterTable
ALTER TABLE "Template" ADD COLUMN     "isPublic" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "UserActivity" DROP COLUMN "activity",
DROP COLUMN "device",
DROP COLUMN "ip",
ADD COLUMN     "action" TEXT NOT NULL,
ADD COLUMN     "details" TEXT;

-- DropTable
DROP TABLE "AdminLoginAttempt";

-- DropTable
DROP TABLE "AdminRateLimit";

-- DropTable
DROP TABLE "AdminSecurityLog";

-- DropTable
DROP TABLE "PasswordResetToken";

-- DropTable
DROP TABLE "TwoFactorToken";

-- DropTable
DROP TABLE "VerificationToken";

-- CreateTable
CREATE TABLE "NotificationTemplate" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NotificationTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AdminLog_adminId_idx" ON "AdminLog"("adminId");

-- CreateIndex
CREATE INDEX "AdminSession_adminId_idx" ON "AdminSession"("adminId");

-- CreateIndex
CREATE INDEX "AdminVerification_adminId_idx" ON "AdminVerification"("adminId");

-- CreateIndex
CREATE INDEX "BlockedIP_ip_idx" ON "BlockedIP"("ip");

-- CreateIndex
CREATE INDEX "UserActivity_userId_idx" ON "UserActivity"("userId");

-- AddForeignKey
ALTER TABLE "AdminLog" ADD CONSTRAINT "AdminLog_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "Admin"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Template" ADD CONSTRAINT "Template_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
