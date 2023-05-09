-- CreateTable
CREATE TABLE `Users` (
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `username` VARCHAR(191) NULL,
    `fullname` VARCHAR(191) NULL,
    `image` VARCHAR(191) NULL,
    `role` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `isOnline` BOOLEAN NULL DEFAULT false,

    UNIQUE INDEX `Users_email_key`(`email`),
    UNIQUE INDEX `Users_username_key`(`username`),
    UNIQUE INDEX `Users_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Accounts` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `hash` VARCHAR(191) NULL,
    `refresh_token` TEXT NULL DEFAULT '',
    `type` VARCHAR(191) NULL DEFAULT '',

    UNIQUE INDEX `Accounts_userId_key`(`userId`),
    INDEX `Accounts_userId_idx`(`userId`),
    UNIQUE INDEX `Accounts_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Verification` (
    `id` VARCHAR(191) NOT NULL,
    `identifier` VARCHAR(191) NOT NULL,
    `token` VARCHAR(191) NOT NULL,
    `expiry` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Verification_id_key`(`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Message` (
    `id` VARCHAR(191) NOT NULL,
    `content` VARCHAR(191) NOT NULL,
    `senderId` VARCHAR(191) NOT NULL,
    `receiverId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `Message_id_idx`(`id`),
    INDEX `Message_senderId_idx`(`senderId`),
    INDEX `Message_receiverId_idx`(`receiverId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ThreadBookMarks` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `threadId` INTEGER NOT NULL,
    `userImage` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `displayName` VARCHAR(191) NOT NULL,
    `emoji` VARCHAR(191) NOT NULL,
    `headline` VARCHAR(191) NOT NULL,
    `content` VARCHAR(191) NOT NULL,
    `link` VARCHAR(191) NOT NULL,
    `username` VARCHAR(191) NOT NULL,
    `code` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `ThreadBookMarks_id_key`(`id`),
    UNIQUE INDEX `ThreadBookMarks_threadId_key`(`threadId`),
    INDEX `ThreadBookMarks_userId_idx`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ThreadImages` (
    `id` VARCHAR(191) NOT NULL,
    `threadId` INTEGER NOT NULL,
    `url` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `ThreadImages_id_key`(`id`),
    INDEX `ThreadImages_threadId_idx`(`threadId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ThreadLinkPreviewMetaData` (
    `id` VARCHAR(191) NOT NULL,
    `bookmarkId` INTEGER NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `url` VARCHAR(191) NOT NULL,
    `image` VARCHAR(191) NOT NULL,
    `favicon` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `ThreadLinkPreviewMetaData_bookmarkId_key`(`bookmarkId`),
    INDEX `ThreadLinkPreviewMetaData_bookmarkId_idx`(`bookmarkId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
