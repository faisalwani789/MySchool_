/*
  Warnings:

  - You are about to drop the column `parent` on the `student` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId]` on the table `Parent` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,parentId]` on the table `Student` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[teacherId,classId]` on the table `TeacherClasses` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[teacherClassId,subjectId]` on the table `TeacherClassesSubject` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `parentId` to the `Student` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `student` DROP COLUMN `parent`,
    ADD COLUMN `parentId` INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Parent_userId_key` ON `Parent`(`userId`);

-- CreateIndex
CREATE UNIQUE INDEX `Student_userId_parentId_key` ON `Student`(`userId`, `parentId`);

-- CreateIndex
CREATE UNIQUE INDEX `TeacherClasses_teacherId_classId_key` ON `TeacherClasses`(`teacherId`, `classId`);

-- CreateIndex
CREATE UNIQUE INDEX `TeacherClassesSubject_teacherClassId_subjectId_key` ON `TeacherClassesSubject`(`teacherClassId`, `subjectId`);

-- AddForeignKey
ALTER TABLE `Teacher` ADD CONSTRAINT `Teacher_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TeacherClasses` ADD CONSTRAINT `TeacherClasses_teacherId_fkey` FOREIGN KEY (`teacherId`) REFERENCES `Teacher`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TeacherClasses` ADD CONSTRAINT `TeacherClasses_classId_fkey` FOREIGN KEY (`classId`) REFERENCES `Class`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TeacherClassesSubject` ADD CONSTRAINT `TeacherClassesSubject_subjectId_fkey` FOREIGN KEY (`subjectId`) REFERENCES `Subject`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TeacherClassesSubject` ADD CONSTRAINT `TeacherClassesSubject_teacherClassId_fkey` FOREIGN KEY (`teacherClassId`) REFERENCES `TeacherClasses`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Student` ADD CONSTRAINT `Student_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Student` ADD CONSTRAINT `Student_parentId_fkey` FOREIGN KEY (`parentId`) REFERENCES `Parent`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Student` ADD CONSTRAINT `Student_classId_fkey` FOREIGN KEY (`classId`) REFERENCES `Class`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Parent` ADD CONSTRAINT `Parent_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
