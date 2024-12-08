/*
  Warnings:

  - You are about to drop the column `failureReason` on the `AdminLoginAttempt` table. All the data in the column will be lost.
  - You are about to drop the column `sessionToken` on the `AdminLoginAttempt` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `AdminLoginAttempt` table. All the data in the column will be lost.
  - The `details` column on the `AdminSecurityLog` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `deviceInfo` on the `AdminSession` table. All the data in the column will be lost.
  - You are about to drop the column `revoked` on the `AdminSession` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `AdminSession` table. All the data in the column will be lost.
  - You are about to drop the column `attempts` on the `AdminVerification` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `AdminVerification` table. All the data in the column will be lost.
  - You are about to drop the column `verified` on the `AdminVerification` table. All the data in the column will be lost.
  - You are about to drop the column `expiresAt` on the `BlockedIP` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[token]` on the table `AdminSession` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `adminId` to the `AdminLoginAttempt` table without a default value. This is not possible if the table is not empty.
  - Added the required column `adminId` to the `AdminSession` table without a default value. This is not possible if the table is not empty.
  - Added the required column `token` to the `AdminSession` table without a default value. This is not possible if the table is not empty.
  - Made the column `code` on table `AdminVerification` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `updatedAt` to the `BlockedIP` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "AdminLoginAttempt" DROP CONSTRAINT "AdminLoginAttempt_userId_fkey";

-- DropForeignKey
ALTER TABLE "AdminSecurityLog" DROP CONSTRAINT "AdminSecurityLog_adminId_fkey";

-- DropForeignKey
ALTER TABLE "AdminSession" DROP CONSTRAINT "AdminSession_userId_fkey";

-- DropForeignKey
ALTER TABLE "AdminVerification" DROP CONSTRAINT "AdminVerification_adminId_fkey";

-- AlterTable
ALTER TABLE "AdminLoginAttempt" DROP COLUMN "failureReason",
DROP COLUMN "sessionToken",
DROP COLUMN "userId",
ADD COLUMN     "adminId" TEXT NOT NULL,
ADD COLUMN     "location" TEXT,
ALTER COLUMN "ip" DROP NOT NULL,
ALTER COLUMN "success" DROP DEFAULT;

-- AlterTable
ALTER TABLE "AdminSecurityLog" ALTER COLUMN "ip" DROP NOT NULL,
DROP COLUMN "details",
ADD COLUMN     "details" JSONB;

-- AlterTable
ALTER TABLE "AdminSession" DROP COLUMN "deviceInfo",
DROP COLUMN "revoked",
DROP COLUMN "userId",
ADD COLUMN     "adminId" TEXT NOT NULL,
ADD COLUMN     "ip" TEXT,
ADD COLUMN     "lastActiveAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "token" TEXT NOT NULL,
ADD COLUMN     "userAgent" TEXT;

-- AlterTable
ALTER TABLE "AdminVerification" DROP COLUMN "attempts",
DROP COLUMN "phone",
DROP COLUMN "verified",
ALTER COLUMN "code" SET NOT NULL;

-- AlterTable
ALTER TABLE "BlockedIP" DROP COLUMN "expiresAt",
ADD COLUMN     "blockedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "unblockedAt" TIMESTAMP(3),
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "Admin" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "phone" TEXT,
    "image" TEXT DEFAULT '/images/default-admin.jpg',
    "isSuperAdmin" BOOLEAN NOT NULL DEFAULT false,
    "permissions" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "lastLoginAt" TIMESTAMP(3),
    "lastLoginIp" TEXT,
    "failedLoginAttempts" INTEGER NOT NULL DEFAULT 0,
    "isLocked" BOOLEAN NOT NULL DEFAULT false,
    "lockedUntil" TIMESTAMP(3),
    "isTwoFactorEnabled" BOOLEAN NOT NULL DEFAULT false,
    "twoFactorSecret" TEXT,
    "backupCodes" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Admin_email_key" ON "Admin"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Admin_phone_key" ON "Admin"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "AdminSession_token_key" ON "AdminSession"("token");

-- AddForeignKey
ALTER TABLE "AdminLoginAttempt" ADD CONSTRAINT "AdminLoginAttempt_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "Admin"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdminSession" ADD CONSTRAINT "AdminSession_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "Admin"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdminSecurityLog" ADD CONSTRAINT "AdminSecurityLog_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "Admin"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdminVerification" ADD CONSTRAINT "AdminVerification_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "Admin"("id") ON DELETE CASCADE ON UPDATE CASCADE;
