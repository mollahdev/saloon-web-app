/*
  Warnings:

  - You are about to drop the column `isGood` on the `skills` table. All the data in the column will be lost.
  - You are about to drop the `working_hours` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `working_hours` DROP FOREIGN KEY `working_hours_user_id_fkey`;

-- AlterTable
ALTER TABLE `skills` DROP COLUMN `isGood`,
    ADD COLUMN `is_good` BOOLEAN NOT NULL DEFAULT false;

-- DropTable
DROP TABLE `working_hours`;

-- CreateTable
CREATE TABLE `business_time_offs` (
    `id` VARCHAR(191) NOT NULL,
    `type` ENUM('SINGLE', 'BREAK', 'RECURRING') NOT NULL DEFAULT 'SINGLE',
    `title` VARCHAR(255) NOT NULL DEFAULT 'Time Off',
    `is_full_day` BOOLEAN NOT NULL DEFAULT true,
    `start_date` DATE NOT NULL,
    `end_date` DATE NULL,
    `start_time` VARCHAR(191) NULL,
    `end_time` VARCHAR(191) NULL,
    `repeat_type` ENUM('DAILY', 'WEEKLY', 'MONTHLY') NULL,
    `repeat_day` INTEGER NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `business_weekly_hours` (
    `id` VARCHAR(191) NOT NULL,
    `day_of_week` ENUM('SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY') NOT NULL,
    `is_off_day` BOOLEAN NOT NULL DEFAULT false,
    `start_time` VARCHAR(191) NOT NULL DEFAULT '10:00:00',
    `end_time` VARCHAR(191) NOT NULL DEFAULT '19:00:00',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `staff_time_offs` (
    `id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `type` ENUM('SINGLE', 'BREAK', 'RECURRING') NOT NULL DEFAULT 'SINGLE',
    `title` VARCHAR(255) NOT NULL DEFAULT 'Time Off',
    `is_full_day` BOOLEAN NOT NULL DEFAULT true,
    `start_date` DATE NOT NULL,
    `end_date` DATE NULL,
    `start_time` VARCHAR(191) NULL,
    `end_time` VARCHAR(191) NULL,
    `repeat_type` ENUM('DAILY', 'WEEKLY', 'MONTHLY') NULL,
    `repeat_day` INTEGER NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `staff_time_offs_user_id_idx`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `staff_weekly_hours` (
    `id` VARCHAR(191) NOT NULL,
    `day_of_week` ENUM('SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY') NOT NULL,
    `is_off_day` BOOLEAN NOT NULL DEFAULT false,
    `start_time` VARCHAR(191) NOT NULL DEFAULT '10:00:00',
    `end_time` VARCHAR(191) NOT NULL DEFAULT '19:00:00',
    `user_id` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `staff_weekly_hours_user_id_day_of_week_key`(`user_id`, `day_of_week`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `staff_time_offs` ADD CONSTRAINT `staff_time_offs_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `staff_weekly_hours` ADD CONSTRAINT `staff_weekly_hours_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
