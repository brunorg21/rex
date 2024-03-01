/*
  Warnings:

  - You are about to drop the column `follower_avatar_url` on the `Follower` table. All the data in the column will be lost.
  - You are about to drop the column `avatar_url` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Attachment` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Attachment" DROP CONSTRAINT "Attachment_postId_fkey";

-- AlterTable
ALTER TABLE "Follower" DROP COLUMN "follower_avatar_url";

-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "imageId" TEXT;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "avatar_url",
ADD COLUMN     "avatarUrlId" TEXT;

-- DropTable
DROP TABLE "Attachment";
