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
      },
      include: {
        user: true,
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
      include: {
        user: true,
      },
    });

    return {
      comments,
    };
  }
  async delete(commentId: number) {
    const comment = await prisma.comments.findUnique({
      where: {
        id: commentId,
      },
    });

    if (!comment) {
      throw new Error("Comentário não existe");
    }

    const deletedComment = await prisma.comments.delete({
      where: {
        id: commentId,
      },
    });

    return deletedComment;
  }
  async update(commentId: number, comment: string) {
    const commentExists = await prisma.comments.findUnique({
      where: {
        id: commentId,
      },
    });

    if (!commentExists) {
      throw new Error("Comentário não existe");
    }

    const updatedComment = await prisma.comments.update({
      where: {
        id: commentExists.id,
      },
      data: {
        comment,
      },
    });

    return updatedComment;
  }
}
