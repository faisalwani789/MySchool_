/*
  Warnings:

  - Added the required column `name` to the `Parent` table without a default value. This is not possible if the table is not empty.
  - Added the required column `occupation` to the `Parent` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `parent` ADD COLUMN `name` VARCHAR(191) NOT NULL,
    ADD COLUMN `occupation` VARCHAR(191) NOT NULL;
