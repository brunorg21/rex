-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "isRepost" BOOLEAN DEFAULT false,
ADD COLUMN     "originalId" INTEGER;
