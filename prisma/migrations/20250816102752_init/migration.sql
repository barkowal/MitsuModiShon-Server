/*
  Warnings:

  - A unique constraint covering the columns `[token]` on the table `Refresh_Token` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Refresh_Token_token_key" ON "public"."Refresh_Token"("token");
