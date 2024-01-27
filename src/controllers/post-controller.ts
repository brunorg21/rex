import { prisma } from "../../prisma/prismaClient";

import { saveImage } from "../utils/saveImage";
import { IPost } from "../models/post-model";
import { z } from "zod";
import { postToUpdateSchema } from "../schemas/postsSchema";
import { updateImage } from "../utils/updateImage";

type PostToUpdate = z.infer<typeof postToUpdateSchema>;

export class PostController {
  async create(post: IPost, userId: number) {
    const { content, title, file, tags } = post;

    const tagsParsed = JSON.parse(tags);
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
        likes: true,
        tag: {
          select: {
            tagName: true,
          },
        },
      },
    });

    const postsWithLikesCount = posts.map((post) => ({
      ...post,
      likesCount: post.likes.length,
    }));

    return postsWithLikesCount;
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
        likes: true,
        user: {
          select: {
            avatar_url: true,
            name: true,
            username: true,
          },
        },
      },
    });
    const postsWithLikes = posts.map((item) => {
      return {
        ...item,
        likesCount: item.likes.length,
      };
    });

    return postsWithLikes;
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

  async deletePost(postId: number) {
    // await prisma.attachment.delete({
    //   where: {
    //     postId,
    //   },
    // });

    await prisma.post.delete({
      where: {
        id: postId,
      },
    });
  }
}
