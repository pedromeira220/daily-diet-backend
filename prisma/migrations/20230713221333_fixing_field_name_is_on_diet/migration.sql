/*
  Warnings:

  - You are about to drop the column `in_on_diet` on the `meals` table. All the data in the column will be lost.
  - Added the required column `is_on_diet` to the `meals` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "meals" DROP COLUMN "in_on_diet",
ADD COLUMN     "is_on_diet" BOOLEAN NOT NULL;
