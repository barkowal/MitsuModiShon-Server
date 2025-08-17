/*
  Warnings:

  - You are about to drop the column `file_path` on the `Object3D` table. All the data in the column will be lost.
  - You are about to drop the column `img_path` on the `Object3D` table. All the data in the column will be lost.
  - Added the required column `data_filename` to the `Object3D` table without a default value. This is not possible if the table is not empty.
  - Added the required column `img_filename` to the `Object3D` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Object3D" DROP COLUMN "file_path",
DROP COLUMN "img_path",
ADD COLUMN     "data_filename" TEXT NOT NULL,
ADD COLUMN     "img_filename" TEXT NOT NULL;
