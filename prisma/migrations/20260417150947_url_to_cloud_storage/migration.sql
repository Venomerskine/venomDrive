-- DropForeignKey
ALTER TABLE "File" DROP CONSTRAINT "File_folderId_fkey";

-- AlterTable
ALTER TABLE "File" ADD COLUMN     "url" TEXT,
ALTER COLUMN "path" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_folderId_fkey" FOREIGN KEY ("folderId") REFERENCES "Folder"("id") ON DELETE CASCADE ON UPDATE CASCADE;
