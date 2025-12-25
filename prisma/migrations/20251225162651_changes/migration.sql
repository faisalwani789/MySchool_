/*
  Warnings:

  - You are about to drop the column `childId` on the `parent` table. All the data in the column will be lost.
  - Added the required column `parent` to the `Student` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `parent` DROP COLUMN `childId`,
    ADD COLUMN `isActive` BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE `student` ADD COLUMN `parent` INTEGER NOT NULL;
