import { prisma } from "../../prisma/prismaClient";

import { saveImage } from "../utils/saveImage";
import { IPost } from "../models/post-model";
import { z } from "zod";
import { postToUpdateSchema } from "../schemas/postsSchema";
import { updateImage } from "../utils/updateImage";

type PostToUpdate = z.infer<typeof postToUpdateSchema>;

export class PostController {
  async create(post: IPost, userId: number) {
    const { content, title, file } = post;

    const destination = await saveImage(file);

    await prisma.post.create({
      data: {
        content,
        title,
        userId,
        attachments: {
          create: {
            name: file.filename,
            path: destination,
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
        attachments: {},
        comments: {},
        likes: true,
      },
    });

    const postsWithLikesCount = posts.map((post) => ({
      ...post,
      likesCount: post.likes.length,
    }));

    return postsWithLikesCount;
  }
  async getAllPosts(userId: number) {
    const posts = await prisma.post.findMany({
      where: {
        userId: userId,
      },
      orderBy: {
        id: "asc",
      },
      include: {
        attachments: {},
        comments: {},
        likes: true,
      },
    });

    const postsWithLikesCount = posts.map((post) => ({
      ...post,
      likesCount: post.likes.length,
    }));

    return postsWithLikesCount;
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
}
