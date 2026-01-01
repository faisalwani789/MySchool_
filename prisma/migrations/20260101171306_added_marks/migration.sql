/*
  Warnings:

  - You are about to drop the column `classSubId` on the `marks` table. All the data in the column will be lost.
  - Added the required column `subjectId` to the `marks` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `marks` DROP FOREIGN KEY `marks_classSubId_fkey`;

-- DropIndex
DROP INDEX `marks_classSubId_fkey` ON `marks`;

-- AlterTable
ALTER TABLE `marks` DROP COLUMN `classSubId`,
    ADD COLUMN `subjectId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `marks` ADD CONSTRAINT `marks_subjectId_fkey` FOREIGN KEY (`subjectId`) REFERENCES `Subject`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
