import { prisma } from "../../prisma/prismaClient";

interface IComment {
  comment: string;
  userId: number;
  postId: number;
}

export class CommentController {
  async create({ comment, postId, userId }: IComment) {
    const createdComment = await prisma.comments.create({
      data: {
        comment,
        postId,
        userId,
        likesCount: 0,
      },
    });

    return createdComment;
  }

  async getAll(postId: number) {
    const comments = await prisma.comments.findMany({
      orderBy: {
        id: "desc",
      },
      where: {
        postId,
      },
    });

    return {
      comments,
    };
  }
}
