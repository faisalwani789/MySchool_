/*
  Warnings:

  - A unique constraint covering the columns `[classId,subjectId]` on the table `ClassSubjects` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `ClassSubjects_classId_subjectId_key` ON `ClassSubjects`(`classId`, `subjectId`);
