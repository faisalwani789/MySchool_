/*
  Warnings:

  - Added the required column `contact` to the `Parent` table without a default value. This is not possible if the table is not empty.
  - Added the required column `experiance` to the `Teacher` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `parent` ADD COLUMN `contact` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `teacher` ADD COLUMN `experiance` VARCHAR(191) NOT NULL,
    ADD COLUMN `salary` INTEGER NOT NULL DEFAULT 10000;
