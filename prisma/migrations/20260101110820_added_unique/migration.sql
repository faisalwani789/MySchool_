/*
  Warnings:

  - A unique constraint covering the columns `[className]` on the table `Class` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Class_className_key` ON `Class`(`className`);
