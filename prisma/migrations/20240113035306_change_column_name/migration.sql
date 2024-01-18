/*
  Warnings:

  - You are about to drop the column `quantity` on the `Likes` table. All the data in the column will be lost.
  - You are about to drop the column `isRepost` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `originalId` on the `Post` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Likes" DROP COLUMN "quantity";

-- AlterTable
ALTER TABLE "Post" DROP COLUMN "isRepost",
DROP COLUMN "originalId";

-- CreateTable
CREATE TABLE "Follower" (
    "id" SERIAL NOT NULL,
    "follower_username" TEXT NOT NULL,
    "follower_name" TEXT NOT NULL,
    "follower_avatar_url" TEXT,
    "userId" INTEGER,

    CONSTRAINT "Follower_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tag" (
    "id" SERIAL NOT NULL,
    "tagName" TEXT NOT NULL,
    "postId" INTEGER,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Follower" ADD CONSTRAINT "Follower_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tag" ADD CONSTRAINT "Tag_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE SET NULL ON UPDATE CASCADE;
