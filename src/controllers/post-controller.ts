import { prisma } from "../../prisma/prismaClient";

import { saveImage } from "../utils/saveImage";
import { IPost } from "../models/post-model";
import { z } from "zod";
import { postToUpdateSchema } from "../schemas/postsSchema";
import { updateImage } from "../utils/updateImage";
import { deleteImage } from "../utils/deleteImage";

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

    const destination = await saveImage(file);

    await prisma.post.create({
      data: {
        content,
        title,
        userId,
        likesCount: 0,
        attachments: {
          create: {
            name: file.filename,
            path: destination,
          },
        },
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
        attachments: true,
        comments: true,
        like: true,
        tag: {
          select: {
            tagName: true,
          },
        },
        user: {
          select: {
            avatar_url: true,
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
        attachments: true,
        comments: true,

        tag: {
          select: {
            tagName: true,
          },
        },
        like: true,
        user: {
          select: {
            avatar_url: true,
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
        attachments: {
          select: {
            name: true,
            path: true,
          },
        },
        comments: true,
        tag: {
          select: {
            tagName: true,
          },
        },

        user: {
          select: {
            avatar_url: true,
            name: true,
            username: true,
          },
        },
        like: true,
      },
    });

    return posts;
  }

  async update(postToUpdate: PostToUpdate, postId: number) {
    const { content, file, title } = postToUpdate;

    const attachment = await prisma.attachment.findUnique({
      where: {
        postId,
      },
    });

    const path = await updateImage(attachment?.path, file);

    await prisma.post.update({
      where: {
        id: postId,
      },
      data: {
        title,
        content,

        attachments: {
          update: {
            data: {
              name: file.filename,
              path,
            },
          },
        },
      },
    });
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

  async deletePost(postId: number) {
    const attachment = await prisma.attachment.findUnique({
      where: {
        postId,
      },
    });

    if (attachment) {
      if (attachment?.path) {
        deleteImage(attachment?.path);
      }

      await prisma.attachment.delete({
        where: {
          postId,
        },
      });
    }

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
