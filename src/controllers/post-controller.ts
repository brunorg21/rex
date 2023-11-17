import { MultipartFile } from "@fastify/multipart";
import { prisma } from "../../prisma/prismaClient";

import path from "path";
import { saveImage } from "../utils/saveImage";
import { IPost } from "../models/post-model";

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
      },
    });

    return posts;
  }
}
