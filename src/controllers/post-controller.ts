import { prisma } from "../../prisma/prismaClient";

import { IPost } from "../models/post-model";
import { z } from "zod";
import { postToUpdateSchema } from "../schemas/postsSchema";
import { deleteImage, uploadImage } from "../utils/upload-image";

type PostToUpdate = z.infer<typeof postToUpdateSchema>;

export class PostController {
  async create(post: IPost, userId: number) {
    const { content, title, file, tags } = post;

    const tagsParsed = JSON.parse(tags!);

    const tagsToCreate = tagsParsed.map((item: string) => {
      return {
        tagName: item,
      };
    });

    const buffer: Buffer = await file.data;

    const imageId = await uploadImage(file, buffer);

    await prisma.post.create({
      data: {
        content,
        title,
        userId,
        likesCount: 0,
        imageId,
        tag: {
          createMany: {
            data: tagsToCreate,
          },
        },
      },
    });
  }

  async getUniquePost(postId: number) {
    const posts = await prisma.post.findMany({
      where: {
        id: postId,
      },
      orderBy: {
        id: "asc",
      },
      include: {
        comments: true,
        like: true,
        tag: {
          select: {
            tagName: true,
          },
        },
        user: {
          select: {
            avatarUrlId: true,
            name: true,
            username: true,
          },
        },
      },
    });

    return posts;
  }
  async getPostsByUser(userId: number) {
    const posts = await prisma.post.findMany({
      where: {
        userId,
      },
      orderBy: {
        id: "asc",
      },
      include: {
        comments: true,
        tag: {
          select: {
            tagName: true,
          },
        },
        like: true,
        user: {
          select: {
            avatarUrlId: true,
            name: true,
            username: true,
          },
        },
      },
    });

    return posts;
  }
  async getAllPosts() {
    const posts = await prisma.post.findMany({
      orderBy: {
        id: "desc",
      },
      include: {
        comments: true,
        tag: {
          select: {
            tagName: true,
          },
        },

        user: {
          select: {
            avatarUrlId: true,
            name: true,
            username: true,
          },
        },
        like: true,
      },
    });

    return posts;
  }

  async likeOnPost(postId: number, userId: number) {
    const actualPost = await prisma.post.findUnique({
      where: {
        id: postId,
      },
    });

    if (!actualPost) {
      throw new Error("Postagem não encontrada");
    }

    await prisma.post.update({
      where: {
        id: postId,
      },
      data: {
        likesCount: actualPost?.likesCount + 1,
      },
    });

    const like = await prisma.like.create({
      data: {
        postId,
        userId,
      },
    });
    return {
      postId,
      like,
    };
  }
  async deleteLikeOnPost(postId: number, userId: number) {
    const actualPost = await prisma.post.findUnique({
      where: {
        id: postId,
      },
    });

    if (!actualPost) {
      throw new Error("Postagem não encontrada");
    }

    await prisma.post.update({
      where: {
        id: postId,
      },
      data: {
        likesCount: actualPost?.likesCount - 1,
      },
    });

    const likeToDelete = await prisma.like.findMany({
      where: {
        postId,
        userId,
      },
    });

    await prisma.like.delete({
      where: {
        id: likeToDelete[0].id,
      },
    });

    const likes = await prisma.like.findMany();

    return {
      postId,
      likes,
    };
  }

  async deletePost(postId: number, fileId: string) {
    await deleteImage(fileId);

    await prisma.like.deleteMany({
      where: {
        postId,
      },
    });
    await prisma.comments.deleteMany({
      where: {
        postId,
      },
    });
    await prisma.tag.deleteMany({
      where: {
        postId,
      },
    });
    await prisma.post.delete({
      where: {
        id: postId,
      },
    });
  }
}
