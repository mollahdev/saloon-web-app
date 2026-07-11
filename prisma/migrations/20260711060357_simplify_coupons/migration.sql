/*
  Warnings:

  - You are about to drop the column `expiry_date` on the `coupons` table. All the data in the column will be lost.
  - You are about to drop the column `maximum_spend` on the `coupons` table. All the data in the column will be lost.
  - You are about to drop the `_CouponExcludeServices` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_CouponExcludeStaffs` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_CouponServices` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_CouponStaffs` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `_CouponExcludeServices` DROP FOREIGN KEY `_CouponExcludeServices_A_fkey`;

-- DropForeignKey
ALTER TABLE `_CouponExcludeServices` DROP FOREIGN KEY `_CouponExcludeServices_B_fkey`;

-- DropForeignKey
ALTER TABLE `_CouponExcludeStaffs` DROP FOREIGN KEY `_CouponExcludeStaffs_A_fkey`;

-- DropForeignKey
ALTER TABLE `_CouponExcludeStaffs` DROP FOREIGN KEY `_CouponExcludeStaffs_B_fkey`;

-- DropForeignKey
ALTER TABLE `_CouponServices` DROP FOREIGN KEY `_CouponServices_A_fkey`;

-- DropForeignKey
ALTER TABLE `_CouponServices` DROP FOREIGN KEY `_CouponServices_B_fkey`;

-- DropForeignKey
ALTER TABLE `_CouponStaffs` DROP FOREIGN KEY `_CouponStaffs_A_fkey`;

-- DropForeignKey
ALTER TABLE `_CouponStaffs` DROP FOREIGN KEY `_CouponStaffs_B_fkey`;

-- AlterTable
ALTER TABLE `coupons` DROP COLUMN `expiry_date`,
    DROP COLUMN `maximum_spend`;

-- DropTable
DROP TABLE `_CouponExcludeServices`;

-- DropTable
DROP TABLE `_CouponExcludeStaffs`;

-- DropTable
DROP TABLE `_CouponServices`;

-- DropTable
DROP TABLE `_CouponStaffs`;
