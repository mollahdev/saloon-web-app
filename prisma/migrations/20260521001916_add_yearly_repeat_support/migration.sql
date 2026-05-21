-- AlterTable: Update TimeOffType enum to remove BREAK (replace with SINGLE, RECURRING only)
ALTER TABLE `business_time_offs` MODIFY COLUMN `type` ENUM('SINGLE', 'RECURRING') NOT NULL DEFAULT 'SINGLE';
ALTER TABLE `staff_time_offs` MODIFY COLUMN `type` ENUM('SINGLE', 'RECURRING') NOT NULL DEFAULT 'SINGLE';

-- AlterTable: Add YEARLY to RepeatType enum
ALTER TABLE `business_time_offs` MODIFY COLUMN `repeat_type` ENUM('DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY') NULL;
ALTER TABLE `staff_time_offs` MODIFY COLUMN `repeat_type` ENUM('DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY') NULL;

-- AlterTable: Add repeat_month column
ALTER TABLE `business_time_offs` ADD COLUMN `repeat_month` INTEGER NULL;
ALTER TABLE `staff_time_offs` ADD COLUMN `repeat_month` INTEGER NULL;
