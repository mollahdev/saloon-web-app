-- CreateTable
CREATE TABLE `otps` (
    `id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `otp_hash` VARCHAR(191) NOT NULL,
    `is_used` BOOLEAN NOT NULL DEFAULT false,
    `expires_at` DATETIME(3) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `otps_user_id_idx`(`user_id`),
    INDEX `otps_otp_hash_idx`(`otp_hash`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `skills` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `isGood` BOOLEAN NOT NULL DEFAULT false,
    `icon` VARCHAR(255) NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `phone` VARCHAR(20) NULL,
    `address` VARCHAR(500) NULL,
    `position` VARCHAR(500) NOT NULL DEFAULT 'Barber/Stylist',
    `bio` VARCHAR(500) NULL,
    `avatar` VARCHAR(500) NULL,
    `role` ENUM('OWNER', 'ADMIN', 'MEMBER') NOT NULL DEFAULT 'MEMBER',
    `status` ENUM('ACTIVE', 'LOCKED', 'INACTIVE', 'PENDING_VERIFICATION') NOT NULL DEFAULT 'PENDING_VERIFICATION',
    `password_hash` VARCHAR(255) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `users_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `working_hours` (
    `id` VARCHAR(191) NOT NULL,
    `day_of_week` ENUM('SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY') NOT NULL,
    `is_off_day` BOOLEAN NOT NULL DEFAULT false,
    `start_time` VARCHAR(191) NOT NULL DEFAULT '10:00:00',
    `end_time` VARCHAR(191) NOT NULL DEFAULT '19:00:00',
    `user_id` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `otps` ADD CONSTRAINT `otps_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `skills` ADD CONSTRAINT `skills_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `working_hours` ADD CONSTRAINT `working_hours_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
