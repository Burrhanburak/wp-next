/*
  Warnings:

  - You are about to drop the column `userAgent` on the `AdminLog` table. All the data in the column will be lost.
  - You are about to drop the column `callbackUrl` on the `AdminSession` table. All the data in the column will be lost.
  - You are about to drop the column `sessionData` on the `AdminSession` table. All the data in the column will be lost.
  - You are about to drop the column `code` on the `AdminVerification` table. All the data in the column will be lost.
  - You are about to drop the column `expiresAt` on the `AdminVerification` table. All the data in the column will be lost.
  - You are about to drop the column `verified` on the `AdminVerification` table. All the data in the column will be lost.
  - You are about to drop the column `blockedAt` on the `BlockedIP` table. All the data in the column will be lost.
  - You are about to drop the column `unblockAt` on the `BlockedIP` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `BlockedIP` table. All the data in the column will be lost.
  - You are about to drop the `Admin` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[token]` on the table `AdminVerification` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `expires` to the `AdminVerification` table without a default value. This is not possible if the table is not empty.
  - Added the required column `token` to the `AdminVerification` table without a default value. This is not possible if the table is not empty.
  - Added the required column `expiresAt` to the `BlockedIP` table without a default value. This is not possible if the table is not empty.
  - Made the column `reason` on table `BlockedIP` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "AdminLog" DROP CONSTRAINT "AdminLog_adminId_fkey";

-- DropForeignKey
ALTER TABLE "AdminSession" DROP CONSTRAINT "AdminSession_adminId_fkey";

-- DropForeignKey
ALTER TABLE "AdminVerification" DROP CONSTRAINT "AdminVerification_adminId_fkey";

-- AlterTable
ALTER TABLE "AdminLog" DROP COLUMN "userAgent";

-- AlterTable
ALTER TABLE "AdminSession" DROP COLUMN "callbackUrl",
DROP COLUMN "sessionData";

-- AlterTable
ALTER TABLE "AdminVerification" DROP COLUMN "code",
DROP COLUMN "expiresAt",
DROP COLUMN "verified",
ADD COLUMN     "expires" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "token" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "BlockedIP" DROP COLUMN "blockedAt",
DROP COLUMN "unblockAt",
DROP COLUMN "updatedAt",
ADD COLUMN     "expiresAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "reason" SET NOT NULL;

-- DropTable
DROP TABLE "Admin";

-- CreateTable
CREATE TABLE "admins" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT,
    "phone" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'ADMIN',
    "firebaseUid" TEXT NOT NULL,
    "twoFactorEnabled" BOOLEAN NOT NULL DEFAULT false,
    "twoFactorSecret" TEXT,
    "backupCodes" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "smsVerificationEnabled" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "admins_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LoginAttempt" (
    "id" TEXT NOT NULL,
    "ip" TEXT NOT NULL,
    "userId" TEXT,
    "success" BOOLEAN NOT NULL,
    "details" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LoginAttempt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SecurityLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "action" TEXT NOT NULL,
    "ip" TEXT,
    "details" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SecurityLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SmsVerification" (
    "id" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "verificationId" TEXT NOT NULL,
    "code" TEXT,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "adminId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SmsVerification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "admins_email_key" ON "admins"("email");

-- CreateIndex
CREATE UNIQUE INDEX "admins_phone_key" ON "admins"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "admins_firebaseUid_key" ON "admins"("firebaseUid");

-- CreateIndex
CREATE INDEX "LoginAttempt_ip_idx" ON "LoginAttempt"("ip");

-- CreateIndex
CREATE INDEX "LoginAttempt_userId_idx" ON "LoginAttempt"("userId");

-- CreateIndex
CREATE INDEX "SecurityLog_userId_idx" ON "SecurityLog"("userId");

-- CreateIndex
CREATE INDEX "SecurityLog_action_idx" ON "SecurityLog"("action");

-- CreateIndex
CREATE UNIQUE INDEX "SmsVerification_verificationId_key" ON "SmsVerification"("verificationId");

-- CreateIndex
CREATE INDEX "SmsVerification_phoneNumber_idx" ON "SmsVerification"("phoneNumber");

-- CreateIndex
CREATE INDEX "SmsVerification_adminId_idx" ON "SmsVerification"("adminId");

-- CreateIndex
CREATE INDEX "AdminLog_action_idx" ON "AdminLog"("action");

-- CreateIndex
CREATE UNIQUE INDEX "AdminVerification_token_key" ON "AdminVerification"("token");

-- AddForeignKey
ALTER TABLE "AdminLog" ADD CONSTRAINT "AdminLog_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "admins"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdminSession" ADD CONSTRAINT "AdminSession_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "admins"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdminVerification" ADD CONSTRAINT "AdminVerification_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "admins"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LoginAttempt" ADD CONSTRAINT "LoginAttempt_userId_fkey" FOREIGN KEY ("userId") REFERENCES "admins"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SecurityLog" ADD CONSTRAINT "SecurityLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "admins"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SmsVerification" ADD CONSTRAINT "SmsVerification_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "admins"("id") ON DELETE SET NULL ON UPDATE CASCADE;
