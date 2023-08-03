/*
  Warnings:

  - Added the required column `origin` to the `image_source` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Origin" AS ENUM ('LOCAL', 'AWS_S3');

-- AlterTable
ALTER TABLE "image_source" ADD COLUMN     "origin" "Origin" NOT NULL;
