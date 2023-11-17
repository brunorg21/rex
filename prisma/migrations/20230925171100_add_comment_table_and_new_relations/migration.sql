/*
  Warnings:

  - A unique constraint covering the columns `[postId]` on the table `Attachment` will be added. If there are existing duplicate values, this will fail.
  - Made the column `postId` on table `Attachment` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Attachment" DROP CONSTRAINT "Attachment_postId_fkey";

-- AlterTable
ALTER TABLE "Attachment" ALTER COLUMN "postId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "commentsId" INTEGER;

-- CreateTable
CREATE TABLE "Comments" (
    "id" SERIAL NOT NULL,
    "comment" TEXT NOT NULL,
    "postId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Comments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Attachment_postId_key" ON "Attachment"("postId");

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_commentsId_fkey" FOREIGN KEY ("commentsId") REFERENCES "Comments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attachment" ADD CONSTRAINT "Attachment_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comments" ADD CONSTRAINT "Comments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
