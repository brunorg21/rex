/*
  Warnings:

  - You are about to drop the column `commentsId` on the `Likes` table. All the data in the column will be lost.
  - Added the required column `count` to the `Likes` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Likes" DROP CONSTRAINT "Likes_commentsId_fkey";

-- AlterTable
ALTER TABLE "Likes" DROP COLUMN "commentsId",
ADD COLUMN     "commentId" INTEGER,
ADD COLUMN     "count" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Likes" ADD CONSTRAINT "Likes_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "Comments"("id") ON DELETE SET NULL ON UPDATE CASCADE;
