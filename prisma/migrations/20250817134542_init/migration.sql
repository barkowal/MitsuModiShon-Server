-- CreateTable
CREATE TABLE "public"."Object3D" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "file_path" TEXT NOT NULL,
    "img_path" TEXT NOT NULL,
    "is_public" BOOLEAN NOT NULL DEFAULT false,
    "account_id" INTEGER NOT NULL,

    CONSTRAINT "Object3D_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Refresh_Token" ADD CONSTRAINT "Refresh_Token_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Object3D" ADD CONSTRAINT "Object3D_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
