-- CreateTable
CREATE TABLE "Likes" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "postId" INTEGER,
    "commentsId" INTEGER,
    "quantity" INTEGER NOT NULL,

    CONSTRAINT "Likes_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Likes" ADD CONSTRAINT "Likes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Likes" ADD CONSTRAINT "Likes_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Likes" ADD CONSTRAINT "Likes_commentsId_fkey" FOREIGN KEY ("commentsId") REFERENCES "Comments"("id") ON DELETE SET NULL ON UPDATE CASCADE;
