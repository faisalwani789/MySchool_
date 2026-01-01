-- CreateTable
CREATE TABLE `ClassSubjects` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `classId` INTEGER NOT NULL,
    `subjectId` INTEGER NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ClassSubjects` ADD CONSTRAINT `ClassSubjects_classId_fkey` FOREIGN KEY (`classId`) REFERENCES `Class`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ClassSubjects` ADD CONSTRAINT `ClassSubjects_subjectId_fkey` FOREIGN KEY (`subjectId`) REFERENCES `Subject`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
