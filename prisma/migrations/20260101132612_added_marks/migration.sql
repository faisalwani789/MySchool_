-- CreateTable
CREATE TABLE `marks` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `marksObt` INTEGER NOT NULL,
    `maxMarks` INTEGER NOT NULL DEFAULT 100,
    `classSubId` INTEGER NOT NULL,
    `studentId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `marks` ADD CONSTRAINT `marks_classSubId_fkey` FOREIGN KEY (`classSubId`) REFERENCES `ClassSubjects`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `marks` ADD CONSTRAINT `marks_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `Student`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
