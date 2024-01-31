import { FastifyInstance } from "fastify";
import { fastifyMultipart } from "@fastify/multipart";
import { PostController } from "../controllers/post-controller";
import {
  postToUpdateParamsSchema,
  postToUpdateSchema,
  postsByUserSchema,
  postsSchema,
  uniquePostSchema,
} from "../schemas/postsSchema";
import { auth } from "../middleware/auth";
import { z } from "zod";

const postController = new PostController();

export async function postRoutes(app: FastifyInstance) {
  app.register(fastifyMultipart, {
    limits: {
      fileSize: 1048576 * 25,
    },
    attachFieldsToBody: "keyValues",
    onFile: (part: any) => {
      part.value = {
        filename: part.filename,
        mimetype: part.mimetype,
        data: part.toBuffer(),
      };
    },
  });
  app.post(
    "/post",
    {
      preHandler: auth,
    },
    async (request, reply) => {
      const post = postsSchema.parse(request.body);

      const { user } = request.headers;

      await postController.create(post, Number(user));

      reply.status(201).send();
    }
  );

  app.get(
    "/post/:id",
    {
      preHandler: auth,
    },
    async (request, reply) => {
      const { id } = uniquePostSchema.parse(request.params);

      const post = await postController.getUniquePost(Number(id));

      if (!post) {
        return reply.status(204).send({ message: "Nenhum post encontrado" });
      }

      return reply.status(200).send(post);
    }
  );

  app.get(
    "/post/user/:id",
    {
      preHandler: auth,
    },
    async (request, reply) => {
      const { userId } = postsByUserSchema.parse(request.params);

      const post = await postController.getPostsByUser(Number(userId));

      if (!post) {
        return reply.status(204).send({ message: "Nenhum post encontrado" });
      }

      return reply.status(200).send(post);
    }
  );
  app.get(
    "/allPosts",
    {
      preHandler: auth,
    },
    async (request, reply) => {
      const post = await postController.getAllPosts();

      if (!post) {
        return reply.status(204).send({ message: "Nenhum post encontrado" });
      }

      return reply.status(200).send(post);
    }
  );

  app.put(
    "/post/:postId",
    {
      preHandler: auth,
    },
    async (req, reply) => {
      const postToUpdate = postToUpdateSchema.parse(req.body);

      const { postId } = postToUpdateParamsSchema.parse(req.params);

      postController.update(postToUpdate, Number(postId));

      reply.send(201);
    }
  );

  app.delete(
    "/post/:postId",
    {
      preHandler: auth,
    },
    async (req, reply) => {
      const { postId } = postToUpdateParamsSchema.parse(req.params);

      await postController.deletePost(Number(postId));

      reply.status(200).send();
    }
  );
}
