import { prisma } from "../../prisma/prismaClient";

interface IComment {
  comment: string;
  userId: number;
  postId: number;
}

export class CommentController {
  async create({ comment, postId, userId }: IComment) {
    await prisma.comments.create({
      data: {
        comment,
        postId,
        userId,
      },
    });
  }
}
