import { FastifyInstance } from "fastify";
import { fastifyMultipart } from "@fastify/multipart";
import { PostController } from "../controllers/post-controller";
import {
  deletePostParamsSchema,
  likeOnPostParamsSchema,
  postToUpdateParamsSchema,
  postToUpdateSchema,
  postsByUserSchema,
  postsSchema,
  uniquePostSchema,
} from "../schemas/postsSchema";
import { auth } from "../middleware/auth";

const postController = new PostController();

export async function postRoutes(app: FastifyInstance) {
  app.register(fastifyMultipart, {
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
    "/post/user/:userId",
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

  app.post(
    "/likeOnPost/:postId",
    {
      preHandler: auth,
    },
    async (req, reply) => {
      const { postId } = postToUpdateParamsSchema.parse(req.params);

      const { user } = req.headers;

      const { like } = await postController.likeOnPost(
        Number(postId),
        Number(user)
      );

      reply.status(201).send({
        postId: Number(postId),
        like,
      });
    }
  );
  app.delete(
    "/likeOnPost/:postId",
    {
      preHandler: auth,
    },
    async (req, reply) => {
      const { postId } = likeOnPostParamsSchema.parse(req.params);

      const { user } = req.headers;

      const { likes } = await postController.deleteLikeOnPost(
        Number(postId),
        Number(user)
      );

      reply.status(201).send({
        postId,
        likes,
      });
    }
  );

  app.delete(
    "/post/:postId/:fileId",
    {
      preHandler: auth,
    },
    async (req, reply) => {
      const { postId, fileId } = deletePostParamsSchema.parse(req.params);

      await postController.deletePost(Number(postId), fileId);

      reply.status(200).send();
    }
  );
}
