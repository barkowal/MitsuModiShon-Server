/*
  Warnings:

  - The primary key for the `Refresh_Token` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "public"."Refresh_Token" DROP CONSTRAINT "Refresh_Token_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Refresh_Token_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Refresh_Token_id_seq";
