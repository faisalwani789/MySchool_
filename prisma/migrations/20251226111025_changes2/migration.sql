/*
  Warnings:

  - You are about to drop the column `name` on the `parent` table. All the data in the column will be lost.
  - You are about to drop the `role` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE `parent` DROP COLUMN `name`;

-- DropTable
DROP TABLE `role`;

-- CreateTable
CREATE TABLE `Roles` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `role` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Roles_role_key`(`role`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
