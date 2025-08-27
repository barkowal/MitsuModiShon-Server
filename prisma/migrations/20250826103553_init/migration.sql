-- CreateTable
CREATE TABLE "public"."Animation_Scene" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "duration" INTEGER NOT NULL,
    "data_filename" TEXT NOT NULL,
    "img_filename" TEXT NOT NULL,
    "is_public" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "account_id" INTEGER NOT NULL,

    CONSTRAINT "Animation_Scene_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Animation_Scene" ADD CONSTRAINT "Animation_Scene_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
