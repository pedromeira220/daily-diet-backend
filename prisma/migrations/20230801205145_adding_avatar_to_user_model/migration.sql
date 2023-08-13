-- AlterTable
ALTER TABLE "users" ADD COLUMN     "avatar_id" TEXT;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_avatar_id_fkey" FOREIGN KEY ("avatar_id") REFERENCES "image_source"("id") ON DELETE SET NULL ON UPDATE CASCADE;
